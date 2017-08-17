/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : labeled_statement.js
* Created at  : 2017-08-17
* Updated at  : 2017-08-17
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var LabeledStatement = function (label) {
	this.initialize();
	this.label = label;
};
LabeledStatement.prototype = {
	type       : "LabeledStatement",
	initialize : require("../generic_initializer")
};

module.exports = LabeledStatement;
