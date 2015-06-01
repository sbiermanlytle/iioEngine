[![JS.ORG](https://img.shields.io/badge/js.org-iio-888888.svg?style=flat-square)](http://js.org)

iio.js
====== 

iio.js is a javascript library that speeds the creation and deployment of HTML5 Canvas applications. This repo contains all published copies and working editions of iio.js.

iio.js was formarly known as 'iio Engine'. The last version of iio Engine, v1.2.2, included Box2D compatability and tutorials. Visit iioEngine.com for the old versions source code, documentation, tutorials, and demos.

## links
Homepage: http://iioinc.github.io/iio.js

Twitter: @iioinc

## loading iio.js
You can load the minified engine from a local folder or the iio Engine URL:

	<script type="text/javascript" src="https://raw.githubusercontent.com/iioinc/iio.js/master/build/iio.min.js"></script>

iio Engine has a debugging version with extra features:

	<script type="text/javascript" src="https://raw.githubusercontent.com/iioinc/iio.js/master/build/iio_debug.js"></script>

## building Source Files
To edit source files, use Grunt to re-build. Grunt depends on nodejs and npm.

### installing nodejs and grunt
If you have brew you can install node easily

    brew install node

Then install the Grunt CLI.

    npm install -g grunt-cli

Install dependencies with npm.

    npm install

You can now run Grunt to build and minify iio.js

    grunt

Include the debug flag to build the debugging versions

    grunt debug

## license

iio.js is licensed under the BSD 2-clause Open Source license

Copyright (c) 2014, Sebastian Bierman-Lytle
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, 
are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list 
of conditions and the following disclaimer.

Redistributions in binary form must reproduce the above copyright notice, this
list of conditions and the following disclaimer in the documentation and/or other 
materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, 
INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT 
NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, 
OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, 
WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) 
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE 
POSSIBILITY OF SUCH DAMAGE.
