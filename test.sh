
node src/dsig-cli.js keygen \
	--user-name "Dr. Ralf S. Engelschall" \
	--user-email rse@engelschall.com \
	--pass-phrase secure \
	--private-key sample.prv \
	--public-key sample.pub
cat sample.prv sample.pub
node src/dsig-cli.js fingerprint \
	--public-key sample.pub \
	--fingerprint sample.fpr
cat sample.fpr

echo -n "Foo" >sample.txt
zip sample.zip sample.txt
(echo "Name: Sample"; echo "Version: 1.0.0"; echo "Released: 2020-01-01") >sample.inf
node src/dsig-cli.js sign \
	--payload sample.zip \
	--private-key sample.prv \
	--pass-phrase secure \
	--meta-info sample.inf \
	--signature sample.sig
cat sample.sig
node src/dsig-cli.js verify \
	--payload sample.zip \
	--signature sample.sig \
	--public-key sample.pub \
	--fingerprint sample.fpr \
	--meta-info sample.inf.out
cat sample.inf.out

(echo "Name: Sample"; echo "Version: 1.0.*"; \
echo "Issued: 2020-01-01"; echo "Expires: 2020-12-31") >sample.txt
node src/dsig-cli.js sign \
	--private-key sample.prv \
	--pass-phrase secure \
	--meta-info sample.txt \
	--signature sample.lic
cat sample.lic
node src/dsig-cli.js verify \
	--signature sample.lic \
	--public-key sample.pub \
	--fingerprint sample.fpr
sed -e "s;Expires: 2020-12-31;Expires: 2021-12-31;" <sample.lic >sample.lic.bad
node src/dsig-cli.js verify \
	--signature sample.lic.bad \
	--public-key sample.pub \
	--fingerprint sample.fpr || true

rm -f sample.*

