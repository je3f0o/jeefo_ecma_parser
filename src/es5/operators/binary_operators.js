/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : binary_operators.js
* Created at  : 2019-01-24
* Updated at  : 2019-03-30
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const states_enum                 = require("../enums/states_enum"),
      operator_definition         = require("../common/operator_definition"),
      prepare_next_expression     = require("../helpers/prepare_next_expression"),
      get_right_value             = require("../helpers/get_right_value"),
      get_last_non_comment_symbol = require("../helpers/get_last_non_comment_symbol");

module.exports = function register_binary_operators (symbol_table) {
    const is_binary = parser => {
        switch (parser.current_state) {
            case states_enum.expression       :
            case states_enum.expression_no_in :
                return get_last_non_comment_symbol(parser) !== null;
        }
        return false;
    };

    const initialize = (symbol, current_token, parser) => {
        const left     = get_last_non_comment_symbol(parser, true);
        const operator = operator_definition.generate_new_symbol(parser);

        prepare_next_expression(parser, true);
        const right = get_right_value(parser, symbol.precedence);

        symbol.left        = left;
        symbol.operator    = operator;
        symbol.right       = right;
        symbol.start       = left.start;
        symbol.end         = right.end;
    };

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
			is         : token => token.value === '*' || token.value === '%',
		},

		// {{{1 Arithmetic operator (13)
		{
            id         : "Arithmetic operator",
			precedence : 13,
			is         : token => token.value === '+' || token.value === '-',
		},

		// {{{1 Bitwise shift operator (12)
		{
            id         : "Bitwise shift operator",
			precedence : 12,
			is         : token => {
				switch (token.value) {
                    case "<<"  :
                    case ">>"  :
                    case ">>>" :
                        return true;
                }
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
            return is_operator_expression(token) && is_binary(parser);
        };

		symbol_table.register_symbol_definition(operator_definition);
	});

    // Division operator
    symbol_table.register_symbol_definition({
        id         : "Arithmetic operator",
        type       : "Binary operator",
        precedence : 14,

        is : (token, parser) => {
            if (token.value === '/' && is_binary(parser)) {
                const streamer = parser.tokenizer.streamer;
                return streamer.at(streamer.cursor.index + 1) !== '=';
            }
            return false;
        },
        initialize : initialize
    });

    symbol_table.register_symbol_definition({
        id         : "Assignment operator",
        type       : "Binary operator",
        precedence : 3,

        is : (token, parser) => {
            if (token.value === '/' && is_binary(parser)) {
                const streamer = parser.tokenizer.streamer;
                return streamer.at(streamer.cursor.index + 1) === '=';
            }
            return false;
        },
        initialize : (symbol, token, parser) => {
            token.value += parser.tokenizer.streamer.get_next_character();
            token.end = parser.tokenizer.streamer.get_cursor();

            initialize(symbol, token, parser);
        }
    });

    // Binary in operator
    symbol_table.register_reserved_word("in", {
        id         : "In operator",
        type       : "Binary operator",
        precedence : 11,

        is : (token, parser) => {
            if (parser.current_state === states_enum.expression_no_in) {
                parser.throw_unexpected_token("Invalid `in` operator in for-loop's expression");
            }

            return parser.current_state === states_enum.expression
                && get_last_non_comment_symbol(parser) !== null;
        },
        initialize : initialize
    });

    // Binary instanceof operator
    symbol_table.register_reserved_word("instanceof", {
        id         : "Instanceof operator",
        type       : "Binary operator",
        precedence : 11,

        is         : (token, parser) => is_binary(parser),
        initialize : initialize
    });
};
