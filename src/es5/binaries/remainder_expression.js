/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : remainder_expression.js
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

var BinaryExpression = function () {};
BinaryExpression.prototype = {
	type            : "BinaryExpression",
	precedence      : 14,
	initialize      : require("../operator_initialzier"),
	left_denotation : require("./binary").left_denotation,
};

module.exports = {
	token_type  : "Slash",
	Constructor : BinaryExpression
};
