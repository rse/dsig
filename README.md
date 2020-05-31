
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

Example
-------

```sh
$ dsig keygen "Dr. Ralf S. Engelschall" "rse@engelschall.com" secure sample.prv sample.pub

$ dsig fingerprint sample.prv secure
CBA9-F53F-DC7E-F31A-EEC2-4B35-85A8-735F-6651-5FF1

$ dsig fingerprint sample.pub >sample.fpr
$ echo "Foo Bar Quux" >sample.txt
$ (echo "Meta 1"; echo "Meta 2") >sample.inf

$ dsig sign sample.txt sample.sig sample.prv secure sample.inf

$ dsig verify sample.txt sample.sig sample.pub "`cat sample.fpr`"
Meta 1
Meta 2

$ cat sample.txt sample.prv sample.pub sample.fpr sample.sig
Foo Bar Quux
-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: DSIG 1.0.0 OpenPGP Private Key
Comment: Dr. Ralf S. Engelschall <rse@engelschall.com> [CBA9-F53F-DC7E-F31A-EEC2-4B35-85A8-735F-6651-5FF1]

xYYEXtQ/FBYJKwYBBAHaRw8BAQdA6S++yiCv4YFCKXhiYBM1yefszTpHOM1C
YcGq5LO0Brb+CQMIS4DXIhkdaNrgIeLqqCm+2IMkUx1J7Jgg1Erj933ZiEMB
sNOewIyfv1anRJvOW001Gsu7M2q2gbqZL4orBDuJOBDgPUuXA6rXHWOmjGZf
G80tRHIuIFJhbGYgUy4gRW5nZWxzY2hhbGwgPHJzZUBlbmdlbHNjaGFsbC5j
b20+wngEEBYKACAFAl7UPxQGCwkHCAMCBBUICgIEFgIBAAIZAQIbAwIeAQAK
CRCFqHNfZlFf8XDYAPwPoT8TkCHRfdfc2kwn2exkUCVjiaC0ExxQxlSOEwzA
7AEAuvmgFRV2OhRGQk2YIFsvukGtH6v0XRH94Je+wpeqBA/HiwRe1D8UEgor
BgEEAZdVAQUBAQdA5BlHVEWQV15Xo1gNAXSkaraKsmSYqkX7jH5MJV3tGg4D
AQgH/gkDCGOmjqJZ9MWB4KQf9BXQ9eAm2bfov7sPIwdUvxkcn+th7cwbQE3o
QPOWxSmx+oPQc6vc3mN5DJZiQcV0foRG0zn8HPO1RBe1mijAeC7/yXjCYQQY
FggACQUCXtQ/FAIbDAAKCRCFqHNfZlFf8deIAQCUv/WL41TDMzb2IhbW+UNo
tI+Fvt4NsMEhrgrFchjZBwD5AbPQBMSXtuBfmWU6faM1AEviSQxrtDVGtMWP
2WDvlwU=
=2StE
-----END PGP PRIVATE KEY BLOCK-----
-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: DSIG 1.0.0 OpenPGP Public Key
Comment: Dr. Ralf S. Engelschall <rse@engelschall.com> [CBA9-F53F-DC7E-F31A-EEC2-4B35-85A8-735F-6651-5FF1]

xjMEXtQ/FBYJKwYBBAHaRw8BAQdA6S++yiCv4YFCKXhiYBM1yefszTpHOM1C
YcGq5LO0BrbNLURyLiBSYWxmIFMuIEVuZ2Vsc2NoYWxsIDxyc2VAZW5nZWxz
Y2hhbGwuY29tPsJ4BBAWCgAgBQJe1D8UBgsJBwgDAgQVCAoCBBYCAQACGQEC
GwMCHgEACgkQhahzX2ZRX/Fw2AD8D6E/E5Ah0X3X3NpMJ9nsZFAlY4mgtBMc
UMZUjhMMwOwBALr5oBUVdjoURkJNmCBbL7pBrR+r9F0R/eCXvsKXqgQPzjgE
XtQ/FBIKKwYBBAGXVQEFAQEHQOQZR1RFkFdeV6NYDQF0pGq2irJkmKpF+4x+
TCVd7RoOAwEIB8JhBBgWCAAJBQJe1D8UAhsMAAoJEIWoc19mUV/x14gBAJS/
9YvjVMMzNvYiFtb5Q2i0j4W+3g2wwSGuCsVyGNkHAPkBs9AExJe24F+ZZTp9
ozUAS+JJDGu0NUa0xY/ZYO+XBQ==
=viif
-----END PGP PUBLIC KEY BLOCK-----
CBA9-F53F-DC7E-F31A-EEC2-4B35-85A8-735F-6651-5FF1
-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA512

DSIG-Issued: 2020-05-31T23:34:45.209Z
DSIG-Length: 13
DSIG-Digest:
    AA37-BDA8-C70D-D1A9-95B2-94D4-DC33-295E-6B7F-405A-45D9-2232-996B-F7D3-48E6-08C0
    D67E-2B65-F06A-0A32-1853-B2F1-A06E-16CE-E670-2517-70DC-6E7D-A082-3C0D-63F3-12FB

Meta 1
Meta 2

-----BEGIN PGP SIGNATURE-----
Version: DSIG 1.0.0 OpenPGP Digital Signature
Comment: Dr. Ralf S. Engelschall <rse@engelschall.com> [CBA9-F53F-DC7E-F31A-EEC2-4B35-85A8-735F-6651-5FF1]

wl4EARYKAAYFAl7UPxUACgkQhahzX2ZRX/GsvQEAxF7lY1QzmZ0SkEj3XoAM
CYYpGcx2dkc9HFeJfRlxVl0BAJ2XZMVTQd8h/Lq3E3YKXhRY9LL0CXAqEdYr
uRFu808I
=yY7q
-----END PGP SIGNATURE-----
rm -f sample.*
```

Usage
-----

### Command-Line Interface

```sh
$ dsig keygen <user-name> <user-email> <pass-phase> <private-key-file> <public-key-file>
$ dsig fingerprint { <private-key-file> <pass-phrase> | <public-key-file> }
$ dsig sign <payload-file> <signature-file> <private-key-file> <pass-phrase> [<meta-info-file>]
$ dsig verify <payload-file> <signature-file> <public-key-file> <finger-print>
```

### Application Programming Interface (API)

```ts
declare module "DSIG" {
    class DSIG {
        /*  generate a private/public key pair  */
        static keygen (
            userName:           string,                      /*  name of user  */
            userEmail:          string,                      /*  email address of user  */
            passPhrase:         string                       /*  pass-phrase of private key  */
        ): Promise<{
            privateKey:         string,                      /*  private key (encrypted)  */
            publicKey:          string                       /*  public key  */
        }>;

        /*  calculate fingerprint of public or private key  */
        static fingerprint (
            publicOrPrivateKey: string,                      /*  public or private key  */
            passPhrase?:        string                       /*  pass-phrase of private key  */
        ): Promise<{
            fingerPrint:        string                       /*  finger-print of public/private key  */
        }>;

        /*  sign payload with private key  */
        static sign (
            payload:            string|Buffer,               /*  payload to sign  */
            privateKey:         string,                      /*  private key  */
            passPhrase:         string,                      /*  pass-phrase of private key  */
            metaInfo?:          string,                      /*  optional meta information  */
        ): Promise<{
            signature:          string                       /*  signature  */
        }>;

        /*  verify payload with public key and fingerprint  */
        static verify (
            payload:            string|Buffer,               /*  payload to verify  */
            signature:          string,                      /*  signature  */
            publicKey:          string,                      /*  public key  */
            fingerPrint:        string                       /*  finger-print of public/private key  */
        ): Promise <{
            metaInfo:           string                       /*  optional meta information  */
        }>;
    }
    export = DSIG
}
```

License
-------

Copyright &copy; 2015-2020 [Dr. Ralf S. Engelschall](http://engelschall.com/)<br/>
Licensed under [LGPL 3.0](https://spdx.org/licenses/LGPL-3.0-only)

