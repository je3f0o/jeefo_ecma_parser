/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : expression_statement.js
* Created at  : 2017-08-17
* Updated at  : 2018-01-15
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

var ExpressionStatement = function (expression, ASI, start, end) {
	if (expression.name === "null") {
		console.log(this);
		console.log(expression);
		process.exit();
	}
	this.type       = this.type;
	this.expression = expression;
	this.ASI        = ASI;
	this.start      = start;
	this.end        = end;
};
ExpressionStatement.prototype.type = "ExpressionStatement";

module.exports = ExpressionStatement;
