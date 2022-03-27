
#   configuration
passphrase="sample"

#   generate private/public key pair
echo ""
echo "==== generate private/public key pair ===="
node src/dsig-cli.js keygen \
	--user-name   "Dr. Ralf S. Engelschall" \
	--user-email  rse@engelschall.com \
	--pass-phrase "$passphrase" \
	--private-key sample.prv \
	--public-key  sample.pub
cat sample.prv sample.pub

#   determine public key fingerprint
echo ""
echo "==== determine public key fingerprint ===="
node src/dsig-cli.js fingerprint \
	--public-key  sample.pub \
	--fingerprint sample.fpr
cat sample.fpr

#   generate arbitrary application payload
echo ""
echo "==== generate arbitrary application payload ===="
echo -n "Foo" >sample.bin

#   generate arbitrary application meta-information
echo ""
echo "==== generate arbitrary application meta-information ===="
(   echo "Name:     Sample"
    echo "Version:  1.0.0"
    echo "Released: 2020-01-01"
) >sample.inf
cat sample.inf

#   sign arbitrary application payload and meta-information
echo ""
echo "==== sign arbitrary application payload and meta-information ===="
node src/dsig-cli.js sign \
	--payload     sample.bin \
	--private-key sample.prv \
	--pass-phrase "$passphrase" \
	--meta-info   sample.inf \
	--signature   sample.sig
cat sample.sig

#   verify signature
echo ""
echo "==== verify signature ===="
node src/dsig-cli.js verify \
	--payload     sample.bin \
	--signature   sample.sig \
	--public-key  sample.pub \
	--fingerprint sample.fpr \
	--meta-info   sample.inf.out
cat sample.inf.out
if cmp sample.inf sample.inf.out; then
    echo "meta-information: OK"
else
    echo "meta-information: BAD"
fi

#   generate arbitrary application meta-information (again)
echo ""
echo "==== generate arbitrary application meta-information (again) ===="
(   echo "Name:    Sample"
    echo "Version: 1.0.*"
    echo "Issued:  2020-01-01"
    echo "Expires: 2020-12-31"
) >sample.inf
cat sample.inf

#   (clear-text) sign arbitrary application meta-information
echo ""
echo "==== (clear-text) sign arbitrary application meta-information ===="
node src/dsig-cli.js sign \
	--private-key sample.prv \
	--pass-phrase "$passphrase" \
	--meta-info   sample.inf \
	--signature   sample.sig
cat sample.sig

#   verify signature
echo ""
echo "==== verify signature ===="
node src/dsig-cli.js verify \
	--signature   sample.sig \
	--public-key  sample.pub \
	--fingerprint sample.fpr \
	--meta-info   sample.inf.out
cat sample.inf.out
if cmp sample.inf sample.inf.out; then
    echo "meta-information: OK"
else
    echo "meta-information: BAD"
fi

#   manipulate application license
echo ""
echo "==== manipulate application license ===="
sed -e "s;Expires: 2020-12-31;Expires: 2021-12-31;" \
    <sample.sig >sample.sig.bad
cat sample.sig.bad

#   verify signature again (now has to fail)
echo ""
echo "==== verify signature again (now has to fail) ===="
node src/dsig-cli.js verify \
	--signature   sample.sig.bad \
	--public-key  sample.pub \
	--fingerprint sample.fpr
if [ $? -ne 0 ]; then
    echo "expected signature check failure: OK"
else
    echo "expected signature check failure: BAD"
fi

#   cleanup
rm -f sample.*

