/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : symbol_table.js
* Created at  : 2017-05-23
* Updated at  : 2017-08-20
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var symbol_table = require("../es5/symbol_table").clone(),
	container    = symbol_table.symbols.others, i;

var stmt = require("./statements/export_statement");

var literals = [
	"template",
	"tagged_template"
], literal;

i = literals.length;
while (i--) {
	literal = require(`./literals/${ literals[i] }_literal`);

	symbol_table.register(container, literal.token_type, {
		is          : literal.is,
		Constructor : literal.Constructor
	});
}

var expressions = [
	"arrow_function_with_parenthesis",
	"arrow_function_without_parenthesis",
], expression;

i = expressions.length;
while (i--) {
	expression = require(`./expressions/${ expressions[i] }`);

	symbol_table.register(container, expression.token_type, {
		is          : expression.is,
		Constructor : expression.Constructor
	});
}

symbol_table.register(container, stmt.token_type, {
	is          : stmt.is,
	Constructor : stmt.Constructor
});

module.exports = symbol_table;
