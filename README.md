iioengine
========= 

iio Engine is an open source JavaScript framework that streamlines the development HTML5 Canvas applications. This repo contains all published copies and working editions of iio Engine.

iio Engine 1.4.0 is the working copy of a push to finalize the upgrade. It will be modified frequently as it is tested and extended.

iio Engine 1.2.2 was the last stable deployment. You may wish to use that version (available at iioEngine.com) if you would like a better documented and more stable platform to work with.

## links
Homepage: http://iioEngine.com

Twitter: @iioEngine

## loading iio Engine
You can load the minified engine from a local folder or the iio Engine URL:

	<script type="text/javascript" src="http://iioengine.com/iioEngine.min.js"></script>

iio Engine has a debugging version with extra features:

	<script type="text/javascript" src="http://iioengine.com/iioEngine-debug.js"></script>

## building Source Files
To edit source files, use Grunt to re-build the engine. Grunt depends on nodejs and npm.

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

The iio Engine is licensed under the BSD 2-clause Open Source license

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
