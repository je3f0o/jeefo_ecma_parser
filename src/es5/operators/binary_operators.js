/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : binary_operators.js
* Created at  : 2019-01-24
* Updated at  : 2019-08-29
* Author      : jeefo
* Purpose     :
* Description :
* Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const states_enum                   = require("../enums/states_enum");
const { terminal_definition }       = require("../../common");
const { get_last_non_comment_node } = require("../../helpers");
const {
    is_expression,
    prepare_next_expression,
    get_right_value,
} = require("../helpers");

module.exports = function register_binary_operators (ast_node_table) {
    const is_binary = parser => {
        if (is_expression(parser)) {
            return get_last_non_comment_node(parser) !== null;
        }
    };

    const initialize = (node, token, parser) => {
        const left     = get_last_non_comment_node(parser, true);
        const operator = terminal_definition.generate_new_node(parser);

        prepare_next_expression(parser, true);
        const right = get_right_value(parser, node.precedence);

        node.left     = left;
        node.operator = operator;
        node.right    = right;
        node.start    = left.start;
        node.end      = right.end;

        parser.ending_index = node.end.index;
    };

	const operator_definitions = [
		// Exponentiation operator (15)
		{
            id         : "Exponentiation operator",
			precedence : 15,
			is         : token => token.value === "**",
		},

		// Arithmetic operator (14)
		{
            id         : "Arithmetic operator",
			precedence : 14,
			is         : token => {
				switch (token.value) {
                    case '*' : case '/' : case '%' : return true;
                }
            }
		},

		// Arithmetic operator (13)
		{
            id         : "Arithmetic operator",
			precedence : 13,
			is         : token => token.value === '+' || token.value === '-'
		},

		// Bitwise shift operator (12)
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
			},
		},

		// Comparision operator (11)
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
			},
		},

		// Equality operator (10)
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
			},
		},

		// Bitwise and operator (9)
		{
            id         : "Bitwise and operator",
			precedence : 9,
			is         : token => token.value === '&',
		},

		// Bitwise xor operator (8)
		{
            id         : "Bitwise xor operator",
			precedence : 8,
			is         : token => token.value === '^',
		},

		// Bitwise or operator (7)
		{
            id         : "Bitwise or operator",
			precedence : 7,
			is         : token => token.value === '|',
		},

		// Logical and operator (6)
		{
            id         : "Logical and operator",
			precedence : 6,
			is         : token => token.value === "&&",
		},

		// Logical or operator (5)
		{
            id         : "Logical or operator",
			precedence : 5,
			is         : token => token.value === "||",
		},

		// Assignment expression (3)
		{
            id         : "Assignment expression",
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
	];

	operator_definitions.forEach(operator_definition => {
        operator_definition.type       = "Binary operator";
		operator_definition.initialize = initialize;

        const is_operator_expression = operator_definition.is;
        operator_definition.is = (token, parser) => {
            return is_operator_expression(token) && is_binary(parser);
        };

		ast_node_table.register_node_definition(operator_definition);
	});

    // Binary in operator
    ast_node_table.register_reserved_word("in", {
        id         : "In operator",
        type       : "Binary operator",
        precedence : 11,

        is : (token, parser) => {
            /*
            if (parser.current_state === states_enum.expression_no_in) {
                parser.throw_unexpected_token(
                    "Invalid `in` operator in for-loop's expression"
                );
            }
            */
            if (parser.current_state === states_enum.expression) {
                return get_last_non_comment_node(parser) !== null;
            }
        },
        initialize : initialize
    });

    // Binary instanceof operator
    ast_node_table.register_reserved_word("instanceof", {
        id         : "Instanceof operator",
        type       : "Binary operator",
        precedence : 11,

        is         : (token, parser) => is_binary(parser),
        initialize : initialize
    });
};
