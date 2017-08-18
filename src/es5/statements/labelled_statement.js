/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : labelled_statement.js
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

var LabelledStatement = function (label) {
	this.initialize();
	this.label = label;
};
LabelledStatement.prototype = {
	type       : "LabelledStatement",
	initialize : require("../generic_initializer")
};

module.exports = LabelledStatement;
