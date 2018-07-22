[![JS.ORG](https://img.shields.io/badge/js.org-iio-888888.svg?style=flat-square)](http://js.org)

iio Engine v1.4.1
=================

iio Engine is a javascript library that speeds the creation and deployment of HTML5 Canvas applications. This repo contains all versions iio Engine, and the sourcecode of the accompanying documentation website (iio.js.org)

This branch contains the cutting edge version of iio Engine, updated regularly with new features.

The last stable release was v1.4.0: https://github.com/sbiermanlytle/iioEngine/tree/v1.4.0

## links
Homepage: http://iioengine.com

Documentation: http://iioengine.com/#api

Demos: http://iioengine.com/#demos

Tutorials: http://iioinc.com/tutorials

Twitter: @iioinc

## loading iio Engine
To use the library, load the iio Engine build file from a local folder or the iio Engine URL:

    <script type="text/javascript" src="http://iioengine.com/iio.js"></script>

iio Engine has a debugging version with extra features:

    <script type="text/javascript" src="http://iioengine.com/iio.debug.js"></script>

## mobile deployment
iio can run on iOS, Android, and other mobile environments using PhoneGap: http://phonegap.com

A demo is provided in the `mobile/phonegap.www` directory. To use the demo, install phonegap using npm.

    npm install -g phonegap@latest

Then create a new phonegap project.

    phonegap create myApp

Then replace the contents of `myApp/www` with the contents of the `mobile/phonegap.www` directory in this repo.

This is a complete phonegap environment that loads iio applications. You can test it by starting a local phonegap server.

    phonegap serve

You can now see the app in a browser at `localhost:3000` and on your mobile phone by downloading the PhoneGap developer 
mobile application and signing in with the IP address given in the console logs when the phonegap server is created.

More info is available here: http://docs.phonegap.com/getting-started/4-preview-your-app/cli/

## building Source Files (optional)
If you would like to edit iio Engine source code files, use Grunt to re-build. Grunt depends on nodejs and npm.

#### installing nodejs and grunt
If you have brew you can install node easily

    brew install node

Then install the Grunt CLI.

    npm install -g grunt-cli

Install dependencies with npm.

    npm install

You can now run Grunt to build and minify iio Engine

    grunt

Include the debug flag to build the debugging versions

    grunt debug

## license

iio Engine is licensed under the BSD 2-clause Open Source license

Copyright (c) 2018, Sebastian Bierman-Lytle
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
