/*
**  DSIG -- Digital Signature with OpenPGP
**  Copyright (c) 2015-2022 Dr. Ralf S. Engelschall <rse@engelschall.com>
**  Licensed under LGPL 3.0 <https://spdx.org/licenses/LGPL-3.0-only>
*/

/*  external requirements  */
const openpgp = require("openpgp")
const sha512  = require("hash.js/lib/hash/sha/512")

/*  the API class  */
module.exports = class DSIG {
    /*  generate a private/public key pair  */
    static async keygen (userName, userEmail, passPhrase) {
        /*  generate key pair  */
        const keypair = await openpgp.generateKey({
            userIDs:    [ { name: userName, email: userEmail } ],
            passphrase: passPhrase,
            curve:      openpgp.enums.curve.curve25519,
            config: {
                showVersion:   true,
                versionString: "DSIG-1.0 <placeholder1>",
                showComment:   true,
                commentString: "<placeholder2>"
            }
        })

        /*  calculate fingerprint  */
        let fp = (await openpgp.readKey({ armoredKey: keypair.publicKey })).getFingerprint()
        fp = fp.toUpperCase().replace(/([0-9A-F]{4})(?=.)/g, "$1-")

        /*  post-adjust private/public keys  */
        const privateKey = keypair.privateKey
            .replace(/<placeholder1>/, "OpenPGP Private Key")
            .replace(/<placeholder2>/, `${userName} <${userEmail}> [${fp}]`)
        const publicKey = keypair.publicKey
            .replace(/<placeholder1>/, "OpenPGP Public Key")
            .replace(/<placeholder2>/, `${userName} <${userEmail}> [${fp}]`)

        /*  return key pair  */
        return { privateKey, publicKey }
    }

    /*  calculate fingerprint of public key  */
    static async fingerprint (publicKey) {
        /*  read public key  */
        const key = await openpgp.readKey({ armoredKey: publicKey })

        /*  verify integrity of public key  */
        const result = await key.verifyPrimaryKey().then(() => "").catch((err) => err)
        if (result !== "")
            throw new Error(`invalid public key (integrity check failed: ${result}`)

        /*  extract fingerprint  */
        let fp = key.getFingerprint()
        fp = fp.toUpperCase().replace(/([0-9A-F]{4})(?=.)/g, "$1-")

        /*  return fingerprint  */
        return fp
    }

    /*  sign payload with private key  */
    static async sign (payload, privateKey, passPhrase, metaInfo = null) {
        /*  read comment from private key  */
        const [ , user ] = privateKey.match(/\r?\nComment: *([^\r\n]+)/)
        if (user === undefined)
            throw new Error("invalid private key (comment line not found)")

        /*  read private key  */
        let key = await openpgp.readKey({ armoredKey: privateKey })
        if (key.isPrivate())
            key = await openpgp.decryptKey({ privateKey: key, passphrase: passPhrase })

        /*  verify integrity of private key  */
        const result = await key.verifyPrimaryKey().then(() => "").catch((err) => err)
        if (result !== "")
            throw new Error(`invalid private key (integrity check failed: ${result}`)

        /*  determine creation time and size  */
        const issued = (new Date()).toISOString()

        /*  calculate message digest on payload ourself  */
        let payloadDigest
        let payloadLength
        if (payload !== null) {
            payloadDigest = sha512().update(payload).digest("hex")
            payloadDigest = payloadDigest.toUpperCase()
            payloadLength = payload.length
        }

        /*  define message  */
        let msg = `DSIG-Issued: ${issued}\r\n`
        if (payload !== null) {
            msg += `DSIG-Payload-Length: ${payloadLength}\r\n`
            const value = payloadDigest
                .replace(/([0-9A-F-]{4})(?=.)/g, "$1-")
                .replace(/([0-9A-F-]{80})(?=.)/g, "$1\r\n    ")
                .replace(/-$/mg, "")
            msg += `DSIG-Payload-Digest:\r\n    ${value}\r\n`
        }
        if (metaInfo !== null) {
            metaInfo = metaInfo.replace(/\r?\n/g, "\r\n")
            msg += `\r\n${metaInfo}`
        }

        /*  verify clear-signed signature with public key  */
        msg = await openpgp.createCleartextMessage({ text: msg })
        let sig = await openpgp.sign({
            message: msg,
            signingKeys: [ key ],
            config: {
                showVersion: true,
                versionString: "DSIG-1.0 OpenPGP Digital Signature",
                showComment: true,
                commentString: user
            }
        })
        sig = sig.replace(/^\r?\n/, "")
            .replace(/(\r?\n)\r?\n$/, "$1")
        return sig
    }

    /*  verify payload with public key and fingerprint  */
    static async verify (payload, signature, publicKey, fingerPrint = null) {
        /*  read public key  */
        const key = await openpgp.readKey({ armoredKey: publicKey })

        /*  verify integrity of public key  */
        let result = await key.verifyPrimaryKey().then(() => "").catch((err) => err)
        if (result !== "")
            throw new Error(`invalid public key (integrity check failed: ${result}`)
        if (fingerPrint !== null) {
            const fingerprint = fingerPrint.toLowerCase().replace(/[^a-fA-F0-9]/g, "")
            if (key.getFingerprint() !== fingerprint)
                throw new Error("invalid public key (fingerprint does not match)")
        }

        /*  read clear-signed signature  */
        const sig = await openpgp.readCleartextMessage({ cleartextMessage: signature })

        /*  verify clear-signed signature with public key  */
        result = await openpgp.verify({ message: sig, verificationKeys: [ key ] })

        /*  ensure that the signature validated successfully  */
        if (!(   typeof result === "object"
              && typeof result.signatures === "object"
              && result.signatures instanceof Array
              && result.signatures.length === 1
              && (await result.signatures[0].verified) === true))
            throw new Error("invalid digital signature")

        /*  parse embedded key/value information  */
        let m = result.data.match(/^((?:DSIG-[a-zA-Z0-9-]+: *[^\r\n]*(?:\r?\n +[^\r\n]+)*\r?\n)+)(?:\r?\n((?:.|\r?\n)*))?$/)
        if (m === null)
            throw new Error("invalid signature message")
        let [ , headers, metaInfo ] = m
        const header = {}
        const re = /(DSIG-[a-zA-Z0-9-]+): *([^\r\n]*(?:\r?\n +[^\r\n]+)*)\r?\n/g
        while ((m = re.exec(headers)) !== null) {
            let [ , key, value ] = m
            value = value.replace(/^ +/, "").replace(/\r?\n +/g, "").replace(/ +$/, "")
            header[key] = value
        }
        if (metaInfo === undefined)
            metaInfo = null

        /*  verify payload integrity  */
        if (payload !== null) {
            /*  sanity check for existing message digest  */
            if (header["DSIG-Payload-Digest"] === undefined)
                throw new Error("DSIG-Payload-Digest header missing")

            /*  calculate message digest on payload ourself  */
            const sha = sha512().update(payload).digest("hex").toUpperCase()

            /*  compare message digests  */
            if (sha !== header["DSIG-Payload-Digest"].replace(/-/g, ""))
                throw new Error("DSIG-Payload-Digest does not match")
        }

        /*  provide embedded key/value information  */
        return metaInfo
    }
}

