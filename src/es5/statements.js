/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : statements.js
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

var statements = [
	// Label statements
	"break",
	"continue",

	// Argument statements
	"throw",
	"return",

	// Loop statements
	"for",
	"while",
	"do_while",

	// Empty statement ;
	"empty",

	// Conditional statement
	"if",

	// Block statements
	"try",
	"switch"
];

module.exports = function (symbol_table) {
	var container = symbol_table.symbols.others;

	statements.forEach(statement => {
		statement = require(`./statements/${ statement }_statement`);

		symbol_table.register(container, statement.token_type, {
			is          : statement.is,
			Constructor : statement.Constructor,
		});
	});
};
