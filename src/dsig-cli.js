#!/usr/bin/env node
/*!
**  DSIG -- Digital Signature with OpenPGP
**  Copyright (c) 2015-2020 Dr. Ralf S. Engelschall <rse@engelschall.com>
**  Licensed under LGPL 3.0 <https://spdx.org/licenses/LGPL-3.0-only>
*/

/*  external requirements  */
const fs   = require("fs")
const DSIG = require("./dsig-api.js")

/*  establish asynchronous environment  */
;(async () => {
    const argv = process.argv.slice(2)
    const cmd = argv.shift()
    if (cmd === "keygen") {
        if (argv.length !== 5)
            throw new Error("Usage: dsig keygen <user-name> <user-email> <pass-phase> <private-key-file> <public-key-file>")
        const [ userName, userEmail, passPhrase, prvFile, pubFile ] = argv
        const keypair = await DSIG.keygen(userName, userEmail, passPhrase)
        await fs.promises.writeFile(prvFile, keypair.privateKey, { encoding: "utf8" })
        await fs.promises.writeFile(pubFile, keypair.publicKey,  { encoding: "utf8" })
    }
    else if (cmd === "fingerprint") {
        if (argv.length !== 1 && argv.length !== 2)
            throw new Error("Usage: dsig fingerprint { <private-key-file> <pass-phrase> | <public-key-file> }")
        const [ keyFile, passPhrase ] = argv
        const key = await fs.promises.readFile(keyFile, { encoding: "utf8" })
        const fp = await DSIG.fingerprint(key, passPhrase)
        process.stdout.write(`${fp}\n`)
    }
    else if (cmd === "sign") {
        if (argv.length < 4)
            throw new Error("Usage: dsig sign <payload-file> <signature-file> <private-key-file> <pass-phrase> [<meta-info-file>]")
        const [ payloadFile, dsigFile, keyFile, passPhrase, metaFile ] = argv
        const payload = await fs.promises.readFile(payloadFile, { encoding: null })
        const key = await fs.promises.readFile(keyFile, { encoding: "utf8" })
        const metaInfo = metaFile ? await fs.promises.readFile(metaFile, { encoding: "utf8" }) : ""
        const sig = await DSIG.sign(payload, key, passPhrase, metaInfo)
        fs.writeFileSync(dsigFile, sig, { encoding: "utf8" })
    }
    else if (cmd === "verify") {
        if (argv.length !== 4)
            throw new Error("Usage: dsig verify <payload-file> <signature-file> <public-key-file> <finger-print>")
        const [ payloadFile, dsigFile, pubFile, fingerPrint ] = argv
        const payload = await fs.promises.readFile(payloadFile, { encoding: null })
        const sig = await fs.promises.readFile(dsigFile, { encoding: "utf8" })
        const pub = await fs.promises.readFile(pubFile, { encoding: "utf8" })
        const metaInfo = await DSIG.verify(payload, sig, pub, fingerPrint)
        process.stdout.write(metaInfo)
    }
    else
        throw new Error("Usage: dsig keygen|fingerprint|sign|verify ...")
})().catch((err) => {
    process.stderr.write(`dsig: ERROR: ${err.stack}\n`)
    process.exit(1)
})

