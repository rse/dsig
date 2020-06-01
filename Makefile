##
##  DSIG -- Digital Signature with OpenPGP
##  Copyright (c) 2015-2020 Dr. Ralf S. Engelschall <rse@engelschall.com>
##  Licensed under LGPL 3.0 <https://spdx.org/licenses/LGPL-3.0-only>
##

NPM = npm

all: build

bootstrap:
	@if [ ! -d node_modules ]; then $(NPM) install; fi

build: bootstrap
	@$(NPM) run build

clean: bootstrap
	@$(NPM) run clean

distclean: clean
	-rm -rf node_modules

test:
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
	echo -n "Foo Bar Quux" >sample.txt
	(echo "Meta 1"; echo "Meta 2") >sample.inf
	node src/dsig-cli.js sign \
		--payload sample.txt \
		--signature sample.sig \
		--pass-phrase secure \
		--private-key sample.prv \
		--meta-info sample.inf
	cat sample.sig
	node src/dsig-cli.js verify \
		--payload sample.txt \
		--signature sample.sig \
		--public-key sample.pub \
		--fingerprint sample.fpr \
		--meta-info sample.inf.out
	cat sample.inf.out
	rm -f sample.*

