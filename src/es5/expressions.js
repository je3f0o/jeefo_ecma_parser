/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : expressions.js
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

var expressions = [
	"function",
	"grouping"
];

module.exports = function (symbol_table) {
	expressions.forEach(expression => {
		expression = require(`./expressions/${ expression }_expression`);

		symbol_table.statement(expression.token_type, {
			is          : expression.is,
			Constructor : expression.Constructor,
		});
	});
};
