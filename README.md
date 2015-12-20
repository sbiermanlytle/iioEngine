[![JS.ORG](https://img.shields.io/badge/js.org-iio-888888.svg?style=flat-square)](http://js.org)

iio.js v1.4.0
=============

iio.js is a javascript library that speeds the creation and deployment of HTML5 Canvas applications. This repo contains all versions iio.js, and the sourcecode of the accompanying documentation website (iio.js.org)

iio.js was formarly known as iio Engine. Checkout the v1.2 branch or visit iioEngine.com for the old versions source code and documentation.

This branch contains the cutting edge version of iio.js, updated regularly with new features.

The last stable release was v1.4.0: https://github.com/iioinc/iio.js/tree/v1.4.0

## links
Homepage: http://iio.js.org

Documentation: http://iio.js.org/#api

Demos: http://iio.js.org/#demos

Tutorials: http://iioinc.com/tutorials

Twitter: @iioinc

## loading iio.js
To use the library, load the iio.js build file from a local folder or the iio.js URL:

    <script type="text/javascript" src="http://iio.js.org/iio.js"></script>

iio.js has a debugging version with extra features:

    <script type="text/javascript" src="http://iio.js.org/iio.debug.js"></script>

## building Source Files (optional)
If you would like to edit iio.js source code files, use Grunt to re-build. Grunt depends on nodejs and npm.

#### installing nodejs and grunt
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
