/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : binary_operators.js
* Created at  : 2019-01-24
* Updated at  : 2019-02-25
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const capitalize                  = require("jeefo_utils/string/capitalize"),
      states_enum                 = require("../enums/states_enum"),
      get_right_value             = require("../helpers/get_right_value"),
      get_start_position          = require("../helpers/get_start_position"),
      get_last_non_comment_symbol = require("../helpers/get_last_non_comment_symbol");

const initialize = (symbol, current_token, parser) => {
    const left      = get_last_non_comment_symbol(parser);
    let pre_comment = null;
    if (parser.current_symbol.id === "Comment") {
        pre_comment = parser.current_symbol;
    }

    parser.prepare_next_state("expression", true);
    const right = get_right_value(parser, symbol.precedence);

	symbol.operator    = current_token.value;
    symbol.left        = left;
    symbol.right       = right;
	symbol.pre_comment = pre_comment;
	symbol.start       = get_start_position(pre_comment, left);
	symbol.end         = right.end;
};

module.exports = function register_binary_operators (symbol_table) {
	const operator_definitions = [
		// {{{1 Exponentiation operator (15)
		{
            id         : "Exponentiation operator",
			precedence : 15,
			is         : token => token.value === "**",
		},

		// {{{1 Arithmetic operator (14)
		{
            id         : "Arithmetic operator",
			precedence : 14,
			is         : token => {
				switch (token.value) { case '*' : case '%' : return true; }
				return false;
			},
		},

		// {{{1 Arithmetic operator (13)
		{
            id         : "Arithmetic operator",
			precedence : 13,
			is         : token => {
				switch (token.value) { case '+' : case '-' : return true; }
				return false;
			},
		},

		// {{{1 Bitwise shift operator (12)
		{
            id         : "Bitwise shift operator",
			precedence : 12,
			is         : token => {
				switch (token.value) { case "<<" : case ">>" : case ">>>" : return true; }
				return false;
			},
		},

		// {{{1 Comparision operator (11)
		{
            id         : "Comparision operator",
			precedence : 11,
			is         : token => {
				switch (token.value) {
					case '<'  :
					case '>'  :
					case "<=" :
					case ">=" :
						return true;
				}
				return false;
			},
		},

		// {{{1 Equality operator (10)
		{
            id         : "Equality operator",
			precedence : 10,
			is         : token => {
				switch (token.value) {
					case  "==" :
					case "===" :
					case  "!=" :
					case "!==" :
						return true;
				}
				return false;
			},
		},

		// {{{1 Bitwise and operator (9)
		{
            id         : "Bitwise and operator",
			precedence : 9,
			is         : token => token.value === '&',
		},

		// {{{1 Bitwise xor operator (8)
		{
            id         : "Bitwise xor operator",
			precedence : 8,
			is         : token => token.value === '^',
		},

		// {{{1 Bitwise or operator (7)
		{
            id         : "Bitwise or operator",
			precedence : 7,
			is         : token => token.value === '|',
		},

		// {{{1 Logical and operator (6)
		{
            id         : "Logical and operator",
			precedence : 6,
			is         : token => token.value === "&&",
		},

		// {{{1 Logical or operator (5)
		{
            id         : "Logical or operator",
			precedence : 5,
			is         : token => token.value === "||",
		},

		// {{{1 Assignment operator (3)
		{
            id         : "Assignment operator",
			precedence : 3,
			is         : token => {
				switch (token.value) {
					case    '=' :
					case   "+=" :
					case   "-=" :
					case   "*=" :
					case   "/=" :
					case   "%=" :
					case   "&=" :
					case   "|=" :
					case   "^=" :
					case  "**=" :
					case  "<<=" :
					case  ">>=" :
					case ">>>=" :
						return true;
				}
				return false;
			},
		}
		// }}}1
	];

	operator_definitions.forEach(operator_definition => {
        operator_definition.type       = "Binary operator";
		operator_definition.initialize = initialize;

        const is_operator_expression = operator_definition.is;
        operator_definition.is = (token, parser) => {
            return parser.current_state === states_enum.expression && is_operator_expression(token);
        };

		symbol_table.register_symbol_definition(operator_definition);
	});

    const skeleton_expression_definition = {
        type       : "Binary expression",
        precedence : 11,
        is : (current_token, parser) => {
            if (parser.current_state  === states_enum.expression && parser.current_symbol !== null) {
                let i = parser.previous_symbols.length;
                while (i--) {
                    if (parser.previous_symbols[i].id === "Comment") {
                        continue;
                    }
                    return true;
                }
            }
            return false;
        },
        initialize : initialize,
    };

    ["in", "instanceof"].forEach(keyword => {
        skeleton_expression_definition.id = `${ capitalize(keyword) } expression`;
        symbol_table.register_reserved_word(keyword, skeleton_expression_definition);
    });
};
