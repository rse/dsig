/*
**  DSIG -- Digital Signature with OpenPGP
**  Copyright (c) 2015-2021 Dr. Ralf S. Engelschall <rse@engelschall.com>
**  Licensed under LGPL 3.0 <https://spdx.org/licenses/LGPL-3.0-only>
*/

/*  external requirements  */
const openpgp = require("openpgp")

/*  helper function for scoped OpenPGP.js configuration  */
const scopedConfig = async (version, comment, callback) => {
    /*  preserve old values  */
    const showversion   = openpgp.config.show_version
    const versionstring = openpgp.config.versionstring
    const showcomment   = openpgp.config.show_comment
    const commentstring = openpgp.config.commentstring

    /*  set new values  */
    openpgp.config.show_version  = true
    openpgp.config.versionstring = version
    openpgp.config.show_comment  = true
    openpgp.config.commentstring = comment

    /*  execute asynchronous callback  */
    const result = await callback()

    /*  restore old values  */
    openpgp.config.show_version  = showversion
    openpgp.config.versionstring = versionstring
    openpgp.config.show_comment  = showcomment
    openpgp.config.commentstring = commentstring

    return result
}

/*  the API class  */
module.exports = class DSIG {
    /*  generate a private/public key pair  */
    static async keygen (userName, userEmail, passPhrase) {
        /*  generate key pair  */
        const keypair = await scopedConfig("DSIG-1.0 <placeholder1>", "<placeholder2>", () => {
            return openpgp.generateKey({
                userIds:    [ { name: userName, email: userEmail } ],
                passphrase: passPhrase,
                curve:      "curve25519"
            })
        })

        /*  calculate fingerprint  */
        let fp = (await openpgp.key.readArmored(keypair.publicKeyArmored))
            .keys[0].primaryKey.getFingerprint()
        fp = fp.toUpperCase().replace(/([0-9A-F]{4})(?=.)/g, "$1-")

        /*  post-adjust private/public keys  */
        const privateKey = keypair.privateKeyArmored
            .replace(/<placeholder1>/, "OpenPGP Private Key")
            .replace(/<placeholder2>/, `${userName} <${userEmail}> [${fp}]`)
        const publicKey = keypair.publicKeyArmored
            .replace(/<placeholder1>/, "OpenPGP Public Key")
            .replace(/<placeholder2>/, `${userName} <${userEmail}> [${fp}]`)

        /*  return key pair  */
        return { privateKey, publicKey }
    }

    /*  calculate fingerprint of public key  */
    static async fingerprint (publicKey) {
        /*  read public key  */
        const key = (await openpgp.key.readArmored(publicKey)).keys[0]

        /*  verify integrity of public key  */
        const result = await key.verifyPrimaryKey().then(() => "").catch((err) => err)
        if (result !== "")
            throw new Error(`invalid public key (integrity check failed: ${result}`)

        /*  extract fingerprint  */
        let fp = key.primaryKey.getFingerprint()
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
        const key = (await openpgp.key.readArmored(privateKey)).keys[0]
        if (key.isPrivate())
            await key.decrypt(passPhrase)

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
            payloadDigest = await openpgp.crypto.hash.sha512(payload)
            payloadDigest = openpgp.util.Uint8Array_to_hex(payloadDigest)
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
        const sig = await scopedConfig("DSIG-1.0 OpenPGP Digital Signature", user, () => {
            msg = openpgp.cleartext.fromText(msg)
            return openpgp.sign({ message: msg, privateKeys: [ key ] })
        })
        sig.data = sig.data
            .replace(/^\r?\n/, "")
            .replace(/(\r?\n)\r?\n$/, "$1")
        return sig.data
    }

    /*  verify payload with public key and fingerprint  */
    static async verify (payload, signature, publicKey, fingerPrint = null) {
        /*  read public key  */
        const key = (await openpgp.key.readArmored(publicKey)).keys[0]

        /*  verify integrity of public key  */
        let result = await key.verifyPrimaryKey().then(() => "").catch((err) => err)
        if (result !== "")
            throw new Error(`invalid public key (integrity check failed: ${result}`)
        if (fingerPrint !== null) {
            const fingerprint = fingerPrint.toLowerCase().replace(/[^a-fA-F0-9]/g, "")
            if (key.primaryKey.getFingerprint() !== fingerprint)
                throw new Error("invalid public key (fingerprint does not match)")
        }

        /*  read clear-signed signature  */
        const sig = await openpgp.cleartext.readArmored(signature)

        /*  verify clear-signed signature with public key  */
        result = await openpgp.verify({ message: sig, publicKeys: [ key ] })

        /*  ensure that the signature validated successfully  */
        if (!(   typeof result === "object"
              && typeof result.signatures === "object"
              && result.signatures instanceof Array
              && result.signatures.length === 1
              && typeof result.signatures[0].valid === "boolean"
              && result.signatures[0].valid === true))
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
            const hash = await openpgp.crypto.hash.sha512(payload)
            let sha = openpgp.util.Uint8Array_to_hex(hash)
            sha = sha.toUpperCase()

            /*  compare message digests  */
            if (sha !== header["DSIG-Payload-Digest"].replace(/-/g, ""))
                throw new Error("DSIG-Payload-Digest does not match")
        }

        /*  provide embedded key/value information  */
        return metaInfo
    }
}

