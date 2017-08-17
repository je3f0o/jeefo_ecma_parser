/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : exponentiation_expression.js
* Created at  : 2017-08-16
* Updated at  : 2017-08-17
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var ExponentiationExpression = function () {};
ExponentiationExpression.prototype = {
	type            : "ExponentiationExpression",
	precedence      : 15,
	initialize      : require("../operator_initialzier"),
	left_denotation : require("./binary").left_denotation,
};

module.exports = {
	is          : function (token) { return token.operator === "**"; },
	token_type  : "Operator",
	Constructor : ExponentiationExpression
};
