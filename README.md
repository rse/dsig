
DSIG
====

Digital Signature with OpenPGP in JavaScript

<p/>
<img src="https://nodei.co/npm/dsig.png?downloads=true&stars=true" alt=""/>

<p/>
<img src="https://david-dm.org/rse/dsig.png" alt=""/>

About
-----

DSIG (Digital Signature) is a JavaScript Application Programming
Interface (API) and Command-Line Interface (CLI) for generating an
[OpenPGP](https://www.ietf.org/rfc/rfc4880.txt) public/private key
pair, calculating the fingerprint of the public/private key, signing a
payload with the private key and verifying the payload afterwards with
the public key and the fingerprint. It is especially intended to sign
application license files and application distribution archive files.

The crux of DSIG is:

1. It is based on [OpenPGP.js](https://openpgpjs.org/) and as a
   consequence is a plain JavaScript solution which does not require an
   installed [GnuPG](https://gnupg.org/) and its native `gpg` command
   and works in both [Node.js](https://nodejs.org/) and the Browser.

2. The private key, public key, fingerprint and signature
   use a fully valid [OpenPGP](https://www.ietf.org/rfc/rfc4880.txt)
   format and hence they *could* even be used with GnuPG, although the
   DSIG signature is a clear-signed OpenPGP message carrying both the
   SHA-512 digest of the payload and optional meta information.

Installation
------------

```shell
$ npm install [-g] dsig
```

Usage
-----

- Command-Line Interface:<br/>
  See [Unix manual page](src/dsig-cli.md).

- Application Programming Interface (API):<br/>
  See [TypeScript API definition](src/dsig-api.d.ts).

License
-------

Copyright &copy; 2015-2020 [Dr. Ralf S. Engelschall](http://engelschall.com/)<br/>
Licensed under [LGPL 3.0](https://spdx.org/licenses/LGPL-3.0-only)

