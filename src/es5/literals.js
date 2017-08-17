/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : literals.js
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

var literals = ["null", "array", "number", "string", "regexp", "boolean"];

module.exports = function (symbol_table) {
	var container = symbol_table.symbols.others;

	literals.forEach(function (literal) {
		literal = require(`./literals/${ literal }_literal`);

		symbol_table.register(container, literal.token_type, {
			is          : literal.is,
			Constructor : literal.Constructor
		});
	});
};
