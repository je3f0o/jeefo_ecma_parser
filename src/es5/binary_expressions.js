/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : binary_expressions.js
* Created at  : 2017-08-17
* Updated at  : 2017-08-18
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

/* Binary Expressions */
//-----------------------------------------------------
// Sequence Expression
// Exponentiation expression (15)
// Multiply, Division and Remainder expressions (14)
// Addition and Subtraction expressions (13)
// Bitwise shift expressions (12)
// Comparition expressions (11)
// In expression (11)
// Instanceof expression (11)
// Equality expressions (10)
// Bitwise And expression (9)
// Bitwise Xor expression (8)
// Bitwise Or expression (7)
// Logical And expression (6)
// Logical Or expression (5)
// Conditional expression (4)
// Assignment expression (3)
// ----------------------------------------------------

// ignore:end

var expressions = [
	// Math expressions
	"division",
	"multiply_remainder",
	"addition_subtraction",
	"exponentiation",

	// Object member expressions
	"member",
	"computed_member",

	// Object operator expressions
	"in",
	"instanceof",

	// Comparision expressions
	"logical_or",
	"logical_and",

	"equality",
	"comparition",

	// Binary operator expressions
	"bit_shift",

	"bitwise_or",
	"bitwise_and",
	"bitwise_xor",

	"conditional",

	// Assignmenr expression
	"assignment",

	// Call
	"call",

	// Sequance
	"sequence",

	// Unary suffix
	"unary"
];

module.exports = function (symbol_table) {
	expressions.forEach(expression => {
		expression = require(`./binaries/${ expression }_expression`);

		symbol_table.binary_expression(expression.token_type, {
			is          : expression.is,
			Constructor : expression.Constructor,
		});
	});

	var comment = require("./declarations/comment");
	symbol_table.binary_expression(comment.token_type, {
		Constructor : comment.Constructor
	});

	var delimiter = require("./declarations/delimiter");
	symbol_table.binary_expression(delimiter.token_type, {
		is          : delimiter.is,
		Constructor : delimiter.Constructor
	});
};
