/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : bit_shift_expression.js
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

var BitwiseShiftExpression = function () {};
BitwiseShiftExpression.prototype = {
	type            : "BitwiseShiftExpression",
	precedence      : 12,
	initialize      : require("../operator_initialzier"),
	left_denotation : require("./binary").left_denotation,
};

module.exports = {
	token_type : "Operator",

	is : function (token) {
		switch (token.operator) { case '<<' : case '>>' : case '>>>' :
			return true;
		}
	},
	Constructor : BitwiseShiftExpression
};
