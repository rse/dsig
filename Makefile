##
##  DSIG -- Digital Signature with OpenPGP
##  Copyright (c) 2015-2021 Dr. Ralf S. Engelschall <rse@engelschall.com>
##  Licensed under LGPL 3.0 <https://spdx.org/licenses/LGPL-3.0-only>
##

NPM = npm
DSIG = node src/dsig-cli.js

all: build

bootstrap:
	@if [ ! -d node_modules ]; then $(NPM) install; fi

build: bootstrap
	@$(NPM) run build

clean: bootstrap
	@$(NPM) run clean

distclean: clean
	-rm -rf node_modules

test: test-prepare test-distribution test-license test-cleanup

test-prepare:
	$(DSIG) keygen \
		--user-name "Dr. Ralf S. Engelschall" \
		--user-email rse@engelschall.com \
		--pass-phrase secure \
		--private-key sample.prv \
		--public-key sample.pub
	cat sample.prv sample.pub
	$(DSIG) fingerprint \
		--public-key sample.pub \
		--fingerprint sample.fpr
	cat sample.fpr

test-distribution:
	echo -n "Foo" >sample.txt
	zip sample.zip sample.txt
	(echo "Name: Sample"; echo "Version: 1.0.0"; echo "Released: 2020-01-01") >sample.inf
	$(DSIG) sign \
		--payload sample.zip \
		--private-key sample.prv \
		--pass-phrase secure \
		--meta-info sample.inf \
		--signature sample.sig
	cat sample.sig
	$(DSIG) verify \
		--payload sample.zip \
		--signature sample.sig \
		--public-key sample.pub \
		--fingerprint sample.fpr \
		--meta-info sample.inf.out
	cat sample.inf.out

test-license:
	(echo "Name: Sample"; echo "Version: 1.0.*"; \
	echo "Issued: 2020-01-01"; echo "Expires: 2020-12-31") >sample.txt
	$(DSIG) sign \
		--private-key sample.prv \
		--pass-phrase secure \
		--meta-info sample.txt \
		--signature sample.lic
	cat sample.lic
	$(DSIG) verify \
		--signature sample.lic \
		--public-key sample.pub \
		--fingerprint sample.fpr
	sed -i -e "s;Expires: 2020-12-31;Expires: 2021-12-31;" sample.lic
	$(DSIG) verify \
		--signature sample.lic \
		--public-key sample.pub \
		--fingerprint sample.fpr || true

test-cleanup:
	rm -f sample.*

