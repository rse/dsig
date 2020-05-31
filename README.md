
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

Example
-------

```sh
$ echo -n "Foo Bar Quux" >sample.txt
$ dsig keygen "Dr. Ralf S. Engelschall" "rse@engelschall.com" secure sample.prv sample.pub
$ cat sample.prv sample.pub
-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: DSIG 1.0.0 OpenPGP Private Key
Comment: Dr. Ralf S. Engelschall <rse@engelschall.com> [AFF1-333B-AE41-A464-9915-B442-2D6B-A3CD-4351-9428]

xYYEXtRAFhYJKwYBBAHaRw8BAQdADCSgVU5xTcOvXxKObmSh2yGMI3oB0oKD
KFq6kO+DOQj+CQMIgnwtcLbFPpPgSKi5436kFmsfUMtjA7sqIA/FjumThc/u
KnB4ruHU8TQ3XHfiD7KjBKButMGAkDnC5Kren9fSwAng+09U7EAhqC+jGweK
Qc0tRHIuIFJhbGYgUy4gRW5nZWxzY2hhbGwgPHJzZUBlbmdlbHNjaGFsbC5j
b20+wngEEBYKACAFAl7UQBYGCwkHCAMCBBUICgIEFgIBAAIZAQIbAwIeAQAK
CRAta6PNQ1GUKGwwAP4hEj1Ououd4DhaZNG6RaJx5S5X3mMaR65LoVfnGsuJ
EwD/RajtMVwkAnO8Jj2wQcZDRH0JiQqsYwcARMYp8HQvKgzHiwRe1EAWEgor
BgEEAZdVAQUBAQdA1/KRJN3K6tbbHyIgnooRqx36X2PDFT+yIiVCBxQK/l0D
AQgH/gkDCMD80CtZCl9l4PKqw/6+XftIlUFpgwsPxODshsglsvQ0LER+TosP
azOCCJjW4BPpGkylHwEToCdayi/sSA9adcj60vA+kRKfROdUi2n3/s/CYQQY
FggACQUCXtRAFgIbDAAKCRAta6PNQ1GUKAvHAQDDHWNyE//fWTTSU06TTnqJ
JBM7cfxN6bHvYHjXyZVWbQEA8x1gbd17/Tlyjne/qnMEVqtG5DctuXqoM0kI
PD+NWQ0=
=eVBL
-----END PGP PRIVATE KEY BLOCK-----
-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: DSIG 1.0.0 OpenPGP Public Key
Comment: Dr. Ralf S. Engelschall <rse@engelschall.com> [AFF1-333B-AE41-A464-9915-B442-2D6B-A3CD-4351-9428]

xjMEXtRAFhYJKwYBBAHaRw8BAQdADCSgVU5xTcOvXxKObmSh2yGMI3oB0oKD
KFq6kO+DOQjNLURyLiBSYWxmIFMuIEVuZ2Vsc2NoYWxsIDxyc2VAZW5nZWxz
Y2hhbGwuY29tPsJ4BBAWCgAgBQJe1EAWBgsJBwgDAgQVCAoCBBYCAQACGQEC
GwMCHgEACgkQLWujzUNRlChsMAD+IRI9TrqLneA4WmTRukWiceUuV95jGkeu
S6FX5xrLiRMA/0Wo7TFcJAJzvCY9sEHGQ0R9CYkKrGMHAETGKfB0LyoMzjgE
XtRAFhIKKwYBBAGXVQEFAQEHQNfykSTdyurW2x8iIJ6KEasd+l9jwxU/siIl
QgcUCv5dAwEIB8JhBBgWCAAJBQJe1EAWAhsMAAoJEC1ro81DUZQoC8cBAMMd
Y3IT/99ZNNJTTpNOeokkEztx/E3pse9geNfJlVZtAQDzHWBt3Xv9OXKOd7+q
cwRWq0bkNy25eqgzSQg8P41ZDQ==
=MkbC
-----END PGP PUBLIC KEY BLOCK-----
$ dsig fingerprint sample.prv secure
AFF1-333B-AE41-A464-9915-B442-2D6B-A3CD-4351-9428
$ dsig fingerprint sample.pub >sample.fpr
(echo "Meta 1"; echo "Meta 2") >sample.inf
$ dsig sign sample.txt sample.sig sample.prv secure sample.inf
$ cat sample.sig
-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA512

DSIG-Issued: 2020-05-31T23:39:02.985Z
DSIG-Length: 12
DSIG-Digest:
    91DF-590E-634E-39F6-7859-4EC1-D055-27CF-1077-88C2-AA29-00B9-CF84-D10E-BE83-3AEB
    FB81-7B02-D66C-DCB6-B64F-FCEF-756E-AF32-3907-4683-94B7-1474-0BA9-6222-048E-FEAC

Meta 1
Meta 2

-----BEGIN PGP SIGNATURE-----
Version: DSIG 1.0.0 OpenPGP Digital Signature
Comment: Dr. Ralf S. Engelschall <rse@engelschall.com> [AFF1-333B-AE41-A464-9915-B442-2D6B-A3CD-4351-9428]

wl4EARYKAAYFAl7UQBYACgkQLWujzUNRlCjKYQEA04+44sUM8JilOh0XON8k
4PHB/nLXl29DE/QuZjcd654BAMDNAZZ5tsxv1cYPDC2byikasxyxtHZm1GET
Glr4ZGcK
=6pCb
-----END PGP SIGNATURE-----
$ dsig verify sample.txt sample.sig sample.pub "`cat sample.fpr`"
Meta 1
Meta 2
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

