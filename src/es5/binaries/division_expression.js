/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : division_expression.js
* Created at  : 2017-08-16
* Updated at  : 2017-09-28
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

var BinaryExpression = function () {};
BinaryExpression.prototype = {
	type       : "BinaryExpression",
	precedence : 14,
	initialize : function () {
		this.type     = this.type;
		this.operator = '/';
	},
	left_denotation : require("./binary").left_denotation,
};

module.exports = {
	token_type  : "Slash",
	Constructor : BinaryExpression
};
