/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : addition_subtraction_expression.js
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

var binary = require("./binary");

var BinaryExpression = function () {};
BinaryExpression.prototype = {
	type            : "BinaryExpression",
	precedence      : 13,
	initialize      : require("../operator_initialzier"),
	left_denotation : binary.left_denotation,
};

module.exports = {
	token_type : "Operator",

	is : function (token) {
		switch (token.operator) { case '-' : case '+' :
			return true;
		}
	},
	Constructor : BinaryExpression
};
