#!/usr/bin/env node
/*!
**  DSIG -- Digital Signature with OpenPGP
**  Copyright (c) 2015-2022 Dr. Ralf S. Engelschall <rse@engelschall.com>
**  Licensed under LGPL 3.0 <https://spdx.org/licenses/LGPL-3.0-only>
*/

/*  external requirements  */
const yargs     = require("yargs")
const CLIio     = require("cli-io")

/*  internal requirements  */
const my        = require("../package.json")
const DSIG      = require("./dsig-api.js")

/*  establish asynchronous environment  */
;(async () => {
    /*  helper function for parsing command-line options  */
    /* eslint indent: off */
    const parseArgs = (argv, config, args, handler) => {
        let obj = yargs()
            .parserConfiguration(Object.assign({}, {
                "duplicate-arguments-array": true,
                "set-placeholder-key":       true,
                "flatten-duplicate-arrays":  true,
                "camel-case-expansion":      true,
                "strip-aliased":             false,
                "dot-notation":              false
            }, config))
            .version(false)
            .help(true)
            .showHelpOnFail(true)
            .strict(true)
        obj = handler(obj)
        const options = obj.parse(argv)
        delete options.$0
        if (typeof args.min === "number" && options._.length < args.min)
            throw new Error(`too less arguments (at least ${args.min} expected)`)
        if (typeof args.max === "number" && options._.length > args.max)
            throw new Error(`too many arguments (at most ${args.max} expected)`)
        return options
    }

    /*  parse global command-line options  */
    let argv = process.argv.slice(2)
    const optsGlobal = parseArgs(argv, { "halt-at-non-option": true }, { min: 1 }, (yargs) =>
        yargs.usage(
            "USAGE: dsig [--help|-h] <command> [<options>]\n" +
            "\n" +
            "Commands:\n" +
            "  version, keygen, fingerprint, sign, verify"
        )
        .option("help", {
            alias:    "h",
            type:     "boolean",
            describe: "display usage help",
            nargs:    0,
            default:  false
        })
    )

    /*  establish CLI input/output  */
    const io = new CLIio({ encoding: "utf8" })

    /*  define commands  */
    const commands = {
        /*  command: "version"  */
        async version (optsGlobal, argv) {
            /*  parse command line options  */
            parseArgs(argv, {}, { min: 0, max: 0 }, (yargs) =>
                yargs.usage("USAGE: dsig version")
            )
            process.stdout.write(`${my.name} ${my.version}\n`)
            process.stdout.write(`${my.description} <${my.homepage}>\n`)
            process.stdout.write(`${my.author.name} <${my.author.email}> <${my.author.url}>\n`)
            return 0
        },

        /*  command: "keygen"  */
        async keygen (optsGlobal, argv) {
            /*  parse command line options  */
            const opts = parseArgs(argv, {}, { min: 0, max: 0 }, (yargs) =>
                yargs.usage([
                    "USAGE: dsig keygen",
                    "--user-name|-n <user-name>",
                    "--user-email|-m <user-email>",
                    "--pass-phrase|-w <pass-phase>",
                    "--private-key|-k <private-key-file>",
                    "--public-key|-p <public-key-file>"
                ].join(" "))
                .option("user-name", {
                    alias:        "n",
                    type:         "string",
                    describe:     "full name of user",
                    nargs:        1,
                    demandOption: true
                })
                .option("user-email", {
                    alias:        "m",
                    type:         "string",
                    describe:     "email address of user",
                    nargs:        1,
                    demandOption: true
                })
                .option("pass-phrase", {
                    alias:        "w",
                    type:         "string",
                    describe:     "pass-phrase for private key",
                    nargs:        1,
                    demandOption: true
                })
                .option("private-key", {
                    alias:        "k",
                    type:         "string",
                    describe:     "file to store private key",
                    nargs:        1,
                    demandOption: true
                })
                .option("public-key", {
                    alias:        "p",
                    type:         "string",
                    describe:     "file to store public key",
                    nargs:        1,
                    demandOption: true
                })
            )

            /*  perform underlying API operation  */
            const keypair = await DSIG.keygen(opts.userName, opts.userEmail, opts.passPhrase)

            /*  write output  */
            await io.output(opts.privateKey, keypair.privateKey, { mode: 0o600 })
            await io.output(opts.publicKey,  keypair.publicKey,  { mode: 0o644 })
            return 0
        },

        /*  command: "fingerprint"  */
        async fingerprint (optsGlobal, argv) {
            /*  parse command line options  */
            const opts = parseArgs(argv, {}, { min: 0, max: 0 }, (yargs) =>
                yargs.usage([
                    "USAGE: dsig fingerprint",
                    "--public-key|-p <public-key-file>",
                    "--fingerprint|-f <fingerprint-file>"
                ].join(" "))
                .option("public-key", {
                    alias:        "p",
                    type:         "string",
                    describe:     "file to read public key",
                    nargs:        1,
                    demandOption: true
                })
                .option("fingerprint", {
                    alias:        "f",
                    type:         "string",
                    describe:     "file to write fingerprint",
                    nargs:        1,
                    demandOption: true
                })
            )

            /*  read input  */
            const key = await io.input(opts.publicKey)

            /*  perform underlying API operation  */
            const fingerprint = await DSIG.fingerprint(key)

            /*  write output  */
            await io.output(opts.fingerprint, `${fingerprint}\n`)
            return 0
        },

        /*  command: "sign"  */
        async sign (optsGlobal, argv) {
            /*  parse command line options  */
            const opts = parseArgs(argv, {}, { min: 0, max: 0 }, (yargs) =>
                yargs.usage([
                    "USAGE: dsig sign",
                    "[--payload|-p <payload-file>]",
                    "--private-key|-k <private-key-file>",
                    "--pass-phrase|-w <pass-phase>",
                    "[--meta-info|-m <meta-info-file>]",
                    "--signature|-s <signature-file>"
                ].join(" "))
                .option("payload", {
                    alias:        "p",
                    type:         "string",
                    describe:     "file to read payload",
                    nargs:        1,
                    default:      ""
                })
                .option("private-key", {
                    alias:        "k",
                    type:         "string",
                    describe:     "file to store private key",
                    nargs:        1,
                    demandOption: true
                })
                .option("pass-phrase", {
                    alias:        "w",
                    type:         "string",
                    describe:     "pass-phrase for private key",
                    nargs:        1,
                    demandOption: true
                })
                .option("meta-info", {
                    alias:        "i",
                    type:         "string",
                    describe:     "file to read meta information",
                    nargs:        1,
                    default:      ""
                })
                .option("signature", {
                    alias:        "s",
                    type:         "string",
                    describe:     "file to store digital signature",
                    nargs:        1,
                    demandOption: true
                })
            )

            /*  read input  */
            const key = await io.input(opts.privateKey)
            const payload  = opts.payload  !== "" ? await io.input(opts.payload, { encoding: null }) : null
            const metaInfo = opts.metaInfo !== "" ? await io.input(opts.metaInfo) : null

            /*  perform underlying API operation  */
            const sig = await DSIG.sign(payload, key, opts.passPhrase, metaInfo)

            /*  write output  */
            await io.output(opts.signature, sig)
            return 0
        },

        /*  command: "verify"  */
        async verify (optsGlobal, argv) {
            /*  parse command line options  */
            const opts = parseArgs(argv, {}, { min: 0, max: 0 }, (yargs) =>
                yargs.usage([
                    "USAGE: dsig verify",
                    "[--payload|-p <payload-file>]",
                    "--signature|-s <signature-file>",
                    "--public-key|-k <public-key-file>",
                    "[--fingerprint|-f <fingerprint-file>]",
                    "[--meta-info|-m <meta-info-file>]"
                ].join(" "))
                .option("payload", {
                    alias:        "p",
                    type:         "string",
                    describe:     "file to read payload",
                    nargs:        1,
                    default:      ""
                })
                .option("signature", {
                    alias:        "s",
                    type:         "string",
                    describe:     "file to read digital signature",
                    nargs:        1,
                    demandOption: true
                })
                .option("public-key", {
                    alias:        "k",
                    type:         "string",
                    describe:     "file to read public key",
                    nargs:        1,
                    demandOption: true
                })
                .option("fingerprint", {
                    alias:        "f",
                    type:         "string",
                    describe:     "file to read fingerprint of public key",
                    nargs:        1,
                    default:      ""
                })
                .option("meta-info", {
                    alias:        "i",
                    type:         "string",
                    describe:     "file to write meta information",
                    nargs:        1,
                    default:      ""
                })
            )

            /*  read input  */
            const payload     = opts.payload !== "" ? await io.input(opts.payload, { encoding: null }) : null
            const signature   = await io.input(opts.signature)
            const publicKey   = await io.input(opts.publicKey)
            const fingerprint = opts.fingerprint !== "" ? await io.input(opts.fingerprint) : null

            /*  perform underlying API operation  */
            const metaInfo = await DSIG.verify(payload, signature, publicKey, fingerprint)

            /*  write output  */
            if (metaInfo !== null && opts.metaInfo !== "")
                await io.output(opts.metaInfo, metaInfo)
            return 0
        }
    }

    /*  dispatch command  */
    argv = optsGlobal._
    delete optsGlobal._
    const cmd = argv.shift()
    if (typeof commands[cmd] !== "function")
        throw new Error(`unknown command: "${cmd}" (expected "version", "keygen", "fingerprint", "sign" or "verify")`)
    const rc = await commands[cmd](optsGlobal, argv)
    process.exit(rc)
})().catch((err) => {
    process.stderr.write(`dsig: ERROR: ${err.message}\n`)
    process.exit(1)
})

