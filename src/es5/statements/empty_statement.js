/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : empty_statement.js
* Created at  : 2017-08-17
* Updated at  : 2017-08-18
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var EmptyStatement = function (token) {
	this.initialize();
	this.start = token.start;
	this.end   = token.end;
};
EmptyStatement.prototype = {
	type       : "EmptyStatement",
	precedence : 31,
	initialize : require("../generic_initializer"),
};

module.exports = EmptyStatement;
