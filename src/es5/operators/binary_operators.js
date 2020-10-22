/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : binary_operators.js
* Created at  : 2019-01-24
* Updated at  : 2020-09-10
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

const {expression}                = require("../enums/states_enum");
const {get_last_non_comment_node} = require("../../helpers");
const {
    LOGICAL_OR_EXPRESSION,
    LOGICAL_AND_EXPRESSION,
    BITWISE_OR_EXPRESSION,
    BITWISE_XOR_EXPRESSION,
    BITWISE_AND_EXPRESSION,
    EQUALITY_EXPRESSION,
    RELATIONAL_EXPRESSION,
    SHIFT_EXPRESSION,
    ADDITIVE_EXPRESSION,
    MULTIPLICATIVE_EXPRESSION,
    EXPONENTIATION_EXPRESSION,
} = require("../enums/precedence_enum");

module.exports = ast_node_table => {
    const binary_expressions = [
        {
            id         : "Logical or operator",
            type       : "Logical or expression",
            precedence : LOGICAL_OR_EXPRESSION,
            is         : token => token.value === "||",
        },
        {
            id         : "Logical and operator",
            type       : "Logical and expression",
            precedence : LOGICAL_AND_EXPRESSION,
            is         : token => token.value === "&&",
        },
        {
            id         : "Bitwise or operator",
            type       : "Bitwise or expression",
            precedence : BITWISE_OR_EXPRESSION,
            is         : token => token.value === '|',
        },
        {
            id         : "Bitwise xor operator",
            type       : "Bitwise xor expression",
            precedence : BITWISE_XOR_EXPRESSION,
            is         : token => token.value === '^',
        },
        {
            id         : "Bitwise and operator",
            type       : "Bitwise and expression",
            precedence : BITWISE_AND_EXPRESSION,
            is         : token => token.value === '&',
        },
        {
            id         : "Equality operator",
            type       : "Equality expression",
            precedence : EQUALITY_EXPRESSION,
            is         : ({value:v}) => ["==", "===", "!=", "!=="].includes(v),
        },
        {
            id         : "Relational operator",
            type       : "Relational expression",
            precedence : RELATIONAL_EXPRESSION,
            is         : token => ['<', '>', "<=", ">="].includes(token.value),
        },
        {
            id         : "Bitwise shift operator",
            type       : "Shift expression",
            precedence : SHIFT_EXPRESSION,
            is         : token => ["<<", ">>", ">>>"].includes(token.value),
        },
        {
            id         : "Additive operator",
            type       : "Additive expression",
            precedence : ADDITIVE_EXPRESSION,
            is         : token => ['+','-'].includes(token.value),
        },
        {
            id         : "Exponentiation operator",
            type       : "Exponentiation expression",
            precedence : EXPONENTIATION_EXPRESSION,
            is         : token => token.value === "**",
        },
    ];

    const initializer_factory = operator_generator => (node, token, parser) => {
        const left     = get_last_non_comment_node(parser, true);
        const operator = operator_generator(parser);

        parser.prepare_next_state("expression", true);
        parser.parse_next_node(node.precedence);
        const right = get_last_non_comment_node(parser, true);

        node.left     = left;
        node.operator = operator;
        node.right    = right;
        node.start    = left.start;
        node.end      = right.end;

        parser.end(node);
    };

    const operator_initializer = initializer_factory(parser => {
        parser.change_state("punctuator");
        return parser.generate_next_node(parser);
    });

    const keyword_initializer = initializer_factory(parser => {
        parser.change_state("keyword");
        return parser.generate_next_node(parser);
    });

    const is_binary_expression = (_, parser) =>
        parser.current_state === expression &&
        get_last_non_comment_node(parser) !== null;

    const is_binary_operator_factory = is_method => (token, parser) =>
        is_binary_expression(token, parser) &&
        token.id === "Operator" &&
        is_method(token, parser);

    for (const expr of binary_expressions) {
        expr.is         = is_binary_operator_factory(expr.is);
		expr.initialize = operator_initializer;
		ast_node_table.register_node_definition(expr);
    }

    ast_node_table.register_node_definition({
        id         : "Multiplicative operator",
        type       : "Multiplicative expression",
        precedence : MULTIPLICATIVE_EXPRESSION,
        initialize : operator_initializer,
        is (token, parser) {
            if (is_binary_expression(token, parser)) {
                switch (token.id) {
                    case "Slash"    : return true;
                    case "Operator" : return ['*', '%'].includes(token.value);
                }
            }
        }
    });

    // Binary in operator
    ast_node_table.register_reserved_word("in", {
        id         : "Relational in operator",
        type       : "Relational expression",
        precedence : RELATIONAL_EXPRESSION,
        is (_, parser) {
            const {current_state: s, context_stack: cs} = parser;
            if (s === expression) {
                const last_node = get_last_non_comment_node(parser);
                if (last_node) {
                    if (cs.includes("For header")) {
                        parser.terminate(last_node);
                    } else {
                        return true;
                    }
                }
            }
        },
        initialize : keyword_initializer,
    });

    // Binary instanceof operator
    ast_node_table.register_reserved_word("instanceof", {
        id         : "Relational instanceof operator",
        type       : "Relational expression",
        precedence : RELATIONAL_EXPRESSION,
        is         : is_binary_expression,
        initialize : keyword_initializer,
    });
};
