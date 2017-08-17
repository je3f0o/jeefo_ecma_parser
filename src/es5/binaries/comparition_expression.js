/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : comparition_expression.js
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

var ComparisionExpression = function () {};
ComparisionExpression.prototype = {
	type            : "ComparisionExpression",
	precedence      : 11,
	initialize      : require("../operator_initialzier"),
	left_denotation : require("./binary").left_denotation,
};

module.exports = {
	token_type : "Operator",

	is : function (token) {
		switch (token.operator) {
			case '<'  :
			case '>'  :
			case '<=' :
			case '>=' :
				return true;
		}
	},
	Constructor : ComparisionExpression
};
