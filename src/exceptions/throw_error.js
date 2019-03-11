/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : throw_error.js
* Created at  : 2019-01-03
* Updated at  : 2019-01-03
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

var style = require("../misc/style");

module.exports = function throw_error (message) {
	throw new Error(style(message, "red"));
};
