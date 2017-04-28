/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2017-04-26
* Updated at  : 2017-04-27
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
//ignore:start
"use strict";

/* global */
/* exported */
/* exported */

//ignore:end

var jeefo    = require("jeefo"),
	_package = require("./package");

require(`./dist/${ _package.name }.node`)(jeefo);

jeefo.module(_package.name).run("javascript.ES5_parser", function (parser) {
	module.exports = parser;
});
