/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : operators_expression.js
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

module.exports = {
	token_type : "Operator",

	is : function (token) {
		switch (token.operator) {
			case '!'  :
			case '~'  :
			case '+'  :
			case '-'  :
			case '++' :
			case '--' :
				return true;
		}
	},
	Constructor : require("./unary_expression")
};
