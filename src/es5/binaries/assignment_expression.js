/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : assignment_expression.js
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

var binary = require("./binary");

var AssignmentExpression = function () {};
AssignmentExpression.prototype = {
	type            : "AssignmentExpression",
	precedence      : 3,
	initialize      : require("../operator_initialzier"),
	left_denotation : binary.left_denotation,
};

module.exports = {
	token_type : "Operator",

	is : function (token) {
		switch (token.operator) {
			case    '=' :
			case   '+=' :
			case   '-=' :
			case   '*=' :
			case   '/=' :
			case   '%=' :
			case   '&=' :
			case   '|=' :
			case   '^=' :
			case  '**=' :
			case  '<<=' :
			case  '>>=' :
			case '>>>=' :
				return true;
		}
	},
	Constructor : AssignmentExpression
};
