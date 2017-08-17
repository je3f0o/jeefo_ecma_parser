/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : unary_expressions.js
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

var unaries = [
	"new",
	"operators",
	"void_typeof_delete"
];

module.exports = function (symbol_table) {
	var container = symbol_table.symbols.others;

	unaries.forEach(expression => {
		expression = require(`./unaries/${ expression }_expression`);

		symbol_table.register(container, expression.token_type, {
			is          : expression.is,
			Constructor : expression.Constructor,
		});
	});
};
