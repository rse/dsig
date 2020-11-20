
# dsig(1) -- Digital Signature with OpenPGP

## SYNOPSIS

`dsig`
\[`--help`|`-h`]
*command*
\[*options*\]

`dsig`
`version`

`dsig`
`keygen`
`--user-name`|`-n` *user-name*
`--user-email`|`-m` *user-email*
`--pass-phrase`|`-w` *pass-phase*
`--private-key`|`-k` *private-key-file*
`--public-key`|`-p` *public-key-file*

`dsig fingerprint`
`--public-key`|`-p` *public-key-file*
`--fingerprint`|`-f` *fingerprint-file*

`dsig sign`
\[`--payload`|`-p` *payload-file*\]
`--private-key`|`-k` *private-key-file*
`--pass-phrase`|`-w` *pass-phase*
\[`--meta-info`|`-m` *meta-info-file*\]
`--signature`|`-s` *signature-file*

`dsig verify`
\[`--payload`|`-p` *payload-file*\]
`--signature`|`-s` *signature-file*
`--public-key`|`-k` *public-key-file*
`--fingerprint`|`-f` *fingerprint-file*
\[`--meta-info`|`-m` *meta-info-file*\]

## DESCRIPTION

DSIG (Digital Signature) is
Command-Line Interface (CLI) for generating an
[OpenPGP](https://www.ietf.org/rfc/rfc4880.txt) public/private key
pair, calculating the fingerprint of the public/private key, signing a
payload with the private key and verifying the payload afterwards with
the public key and the fingerprint. It is especially intended to sign
application license files and application distribution archive files.

## OPTIONS

The following top-level options and arguments exist:

- \[`--help`|`-h`\]:
  Display usage information.

- *command*:
  The particular command, either `version`, `keygen`, `fingerprint`, `sign` or `verify`.

- \[*options*\]:
  The options of the command. All file-based arguments of options can
  be of various forms:

    -  reading input data is supported from `stdin` (with filenames `-` or `stdin:`),
       from URLs with HTTP (with filenames starting with `http:` or `https:`)
       and from local files (with filenames starting with `file:` or no scheme)

    -  writing output data is supported to `stdout` (with filenames `-` or `stdout:`),
       to URLs with HTTP/WebDAV (with filenames starting with `http:` or `https:`)
       and to local files (with filenames starting with `file:` or no scheme)

## COMMANDS

The following commands and their options and arguments exist:

- `dsig version`:
  Display detailed program version information.

- `dsig keygen`
  `--user-name`|`-n` *user-name*
  `--user-email`|`-m` *user-email*
  `--pass-phrase`|`-w` *pass-phase*
  `--private-key`|`-k` *private-key-file*
  `--public-key`|`-p` *public-key-file*:
  Generate a private/public key pair.

- `dsig fingerprint`
  `--public-key`|`-p` *public-key-file*
  `--fingerprint`|`-f` *fingerprint-file*:
  Calculate fingerprint of public key.

- `dsig sign`
  \[`--payload`|`-p` *payload-file*\]
  `--private-key`|`-k` *private-key-file*
  `--pass-phrase`|`-w` *pass-phase*
  \[`--meta-info`|`-m` *meta-info-file*\]
  `--signature`|`-s` *signature-file*:
  Generate a digital signature to sign a payload and/or meta information.

- `dsig verify`
  \[`--payload`|`-p` *payload-file*\]
  `--signature`|`-s` *signature-file*
  `--public-key`|`-k` *public-key-file*
  `--fingerprint`|`-f` *fingerprint-file*
  \[`--meta-info`|`-m` *meta-info-file*\]:
  Verify digital signature of payload and/or meta information.

## EXAMPLE

### Preparation

We have to prepare a private key (kept secret at author side) and a
public key (distributed to everyone) and determine the fingerprint of
the public key (hard-coded into the application update procedure).

```sh
# generate a private/public key pair
$ dsig keygen \
    --user-name "Dr. Ralf S. Engelschall" \
    --user-email rse@engelschall.com \
    --pass-phrase secure \
    --private-key sample.prv \
    --public-key sample.pub
$ cat sample.prv sample.pub
-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: DSIG-1.0 OpenPGP Private Key
Comment: Dr. Ralf S. Engelschall <rse@engelschall.com> [4FC0-9DEF-4E4D-8BCE-46F7-3FD0-0B96-30C3-CB00-726A]

xYYEXtS9jRYJKwYBBAHaRw8BAQdAu9BrDPyWhRzkYOO5ucGNlfuYjkmg7+ae
NXrvFZFh3Kz+CQMIOUiNchFKKz3g1k263lI6mRUYbkyEUY6MQHXHtLpkzGpO
xAMYCBGXse/Q08VjYngJzFpibUa6grWsi1hjTxDUDoNohql9HJDCW+LV9WGk
080tRHIuIFJhbGYgUy4gRW5nZWxzY2hhbGwgPHJzZUBlbmdlbHNjaGFsbC5j
b20+wngEEBYKACAFAl7UvY0GCwkHCAMCBBUICgIEFgIBAAIZAQIbAwIeAQAK
CRALljDDywByaiDDAQDR8u0Xo3MrB+txe+tFRV1I+wT9aq6zMoc0o9oE2Xjd
MAD+J/kFAhKVhd97y4+jQVpDAWqk42qLrdUS+HBNvhCnCgDHiwRe1L2NEgor
BgEEAZdVAQUBAQdARUl/ex8MCxjSGtUFMK46KfpoM6LpqEKPq52lg5H0tlMD
AQgH/gkDCLb2wb7Ou+ib4NgwksklzwGsFSoryIO/XFZOvj4cdWn3yZW7NjLm
5DsN27BS4VqGcGwnygKzuPzzKuhp1URsy6w+gMLdWMMAsu7QjkwaI8vCYQQY
FggACQUCXtS9jQIbDAAKCRALljDDywByatz9AP909OSSyiguOaeZ5yN/qnox
3X7bRnydWC+alnuTXXfErgEA6u3q0EGD6PITaaUGeKwguoqTgO5u2T1c6ON+
H2E7SAk=
=WILC
-----END PGP PRIVATE KEY BLOCK-----
-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: DSIG-1.0 OpenPGP Public Key
Comment: Dr. Ralf S. Engelschall <rse@engelschall.com> [4FC0-9DEF-4E4D-8BCE-46F7-3FD0-0B96-30C3-CB00-726A]

xjMEXtS9jRYJKwYBBAHaRw8BAQdAu9BrDPyWhRzkYOO5ucGNlfuYjkmg7+ae
NXrvFZFh3KzNLURyLiBSYWxmIFMuIEVuZ2Vsc2NoYWxsIDxyc2VAZW5nZWxz
Y2hhbGwuY29tPsJ4BBAWCgAgBQJe1L2NBgsJBwgDAgQVCAoCBBYCAQACGQEC
GwMCHgEACgkQC5Yww8sAcmogwwEA0fLtF6NzKwfrcXvrRUVdSPsE/WquszKH
NKPaBNl43TAA/if5BQISlYXfe8uPo0FaQwFqpONqi63VEvhwTb4QpwoAzjgE
XtS9jRIKKwYBBAGXVQEFAQEHQEVJf3sfDAsY0hrVBTCuOin6aDOi6ahCj6ud
pYOR9LZTAwEIB8JhBBgWCAAJBQJe1L2NAhsMAAoJEAuWMMPLAHJq3P0A/3T0
5JLKKC45p5nnI3+qejHdfttGfJ1YL5qWe5Ndd8SuAQDq7erQQYPo8hNppQZ4
rCC6ipOA7m7ZPVzo434fYTtICQ==
=PZb6
-----END PGP PUBLIC KEY BLOCK-----
```

```sh
# determine fingerprint of public key
$ dsig fingerprint \
    --public-key sample.pub \
    --fingerprint sample.fpr
$ cat sample.fpr
4FC0-9DEF-4E4D-8BCE-46F7-3FD0-0B96-30C3-CB00-726A
```

### Use Case 1: Application Distribution Archive Signing

We can sign a distribution archive of the application and let the
application update procedure verify the signature after downloading the
distribution archive.

```sh
# generate a sample distribution archive
$ echo "Foo Bar Quux" >sample.txt
$ zip sample.zip sample.txt
```

```sh
# generate a sample meta information
$ (echo "Name: Sample"; echo "Version: 1.0.0"; echo "Released: 2020-01-01") >sample.inf
```

```sh
# generate digital signature for distribution archive
$ dsig sign \
    --payload sample.zip \
    --signature sample.sig \
    --pass-phrase secure \
    --private-key sample.prv \
    --meta-info sample.inf
$ cat sample.sig
-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA512

DSIG-Issued: 2020-06-01T08:34:21.725Z
DSIG-Payload-Length: 12
DSIG-Payload-Digest:
    91DF-590E-634E-39F6-7859-4EC1-D055-27CF-1077-88C2-AA29-00B9-CF84-D10E-BE83-3AEB
    FB81-7B02-D66C-DCB6-B64F-FCEF-756E-AF32-3907-4683-94B7-1474-0BA9-6222-048E-FEAC

Name: Sample
Version: 1.0.0
Released: 2020-01-01

-----BEGIN PGP SIGNATURE-----
Version: DSIG-1.0 OpenPGP Digital Signature
Comment: Dr. Ralf S. Engelschall <rse@engelschall.com> [4FC0-9DEF-4E4D-8BCE-46F7-3FD0-0B96-30C3-CB00-726A]

wl4EARYKAAYFAl7UvY0ACgkQC5Yww8sAcmqpygD/SftaTKz0qnSklsYZKOUw
fOfB7afvsBQBt9VD4q/pCf4BAMpYWkMeStzA9UweVCYD5KnrYkM2QGW6gIez
Jam53esE
=g+l3
-----END PGP SIGNATURE-----
```

```sh
# verify digital signature of distribution archive
$ dsig verify \
    --payload sample.zip \
    --signature sample.sig \
    --public-key sample.pub \
    --fingerprint sample.fpr
```

### Use Case 2: Application License Signing

We can generate a signed electronic version of the license of the
application which can be verified by the application in its startup
procedure.

```sh
# generate a sample license
$ (echo "Name: Sample"; echo "Version: 1.0.*"; \
  echo "Issued: 2020-01-01"; echo "Expires: 2020-12-31") >sample.txt
$ dsig sign \
	--signature sample.lic \
	--pass-phrase secure \
	--private-key sample.prv \
	--meta-info sample.txt
$ cat sample.lic
```

```sh
# verify digital signature of license
$ dsig verify \
    --signature sample.lic \
    --public-key sample.pub \
    --fingerprint sample.fpr
```

## AUTHOR

Dr. Ralf S. Engelschall <rse@engelschall.com>

