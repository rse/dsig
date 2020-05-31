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
	echo -n "Foo Bar Quux" >sample.txt
	node src/dsig-cli.js keygen "Dr. Ralf S. Engelschall" "rse@engelschall.com" secure sample.prv sample.pub
	cat sample.prv sample.pub
	node src/dsig-cli.js fingerprint sample.prv secure
	node src/dsig-cli.js fingerprint sample.pub >sample.fpr
	(echo "Meta 1"; echo "Meta 2") >sample.inf
	node src/dsig-cli.js sign sample.txt sample.sig sample.prv secure sample.inf
	cat sample.sig
	node src/dsig-cli.js verify sample.txt sample.sig sample.pub "`cat sample.fpr`"
	rm -f sample.*

