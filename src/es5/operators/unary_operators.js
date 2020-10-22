/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : unary_operators.js
* Created at  : 2019-01-28
* Updated at  : 2020-09-09
* Author      : jeefo
* Purpose     :
* Description : Prefix and postfix unary operator parsers.
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-11.3
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-11.4
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const capitalize   = require("@jeefo/utils/string/capitalize");
const {expression} = require("../enums/states_enum");
const {
    is_identifier_token,
    has_no_line_terminator,
    get_last_non_comment_node,
} = require("../../helpers");
const {
    UNARY_PREFIX_EXPRESSION,
    UNARY_POSTFIX_EXPRESSION,
} = require("../enums/precedence_enum");

module.exports = function register_unary_operators (ast_node_table) {
    const is_unary_expression = (_, parser) =>
        parser.current_state              === expression &&
        get_last_non_comment_node(parser) === null;

    const skeleton_def = {
        type : "Unary operators",
        is   : is_unary_expression,
    };

    // void, typeof, delete expression (16)
    skeleton_def.precedence = UNARY_PREFIX_EXPRESSION;

    // initialize
    const init = (node, token, parser) => {
        parser.change_state("keyword");
        const keyword = parser.generate_next_node();
        parser.prepare_next_state("expression", true);
        parser.parse_next_node(node.precedence - 1);
        const expr = get_last_non_comment_node(parser, true);

        node.keyword    = keyword;
        node.expression = expr;
        node.start      = keyword.start;
        node.end        = expr.end;
    };

    ["void", "typeof", "delete"].forEach(keyword => {
        skeleton_def.id         = `${capitalize(keyword)} operator`;
        skeleton_def.initialize = (node, token, parser) => {
            parser.expect(keyword, is_identifier_token(token, keyword));
            init(node, token, parser);
        };
        ast_node_table.register_reserved_word(keyword, skeleton_def);
    });

    // Prefix operators (16)
    skeleton_def.initialize = (node, token, parser) => {
        parser.change_state("punctuator");
        const operator = parser.generate_next_node();
        parser.prepare_next_state("expression", true);
        parser.parse_next_node(node.precedence - 1);
        const expr = get_last_non_comment_node(parser, true);

        node.operator   = operator;
        node.expression = expr;
        node.start      = operator.start;
        node.end        = expr.end;
    };

    const generate_definition = (id, operator) => ({
        id : `${id} operator`,
        is : ({id, value}, parser) => (
            is_unary_expression(null, parser) &&
            id === "Operator" && value === operator
        )
    });

    [
        generate_definition("Logical not"   , '!'),
        generate_definition("Bitwise not"   , '~'),
        generate_definition("Positive plus" , '+'),
        generate_definition("Negation minus", '-'),
    ].forEach(operator => {
        skeleton_def.id = operator.id;
        skeleton_def.is = operator.is;
        ast_node_table.register_node_definition(skeleton_def);
    });

    skeleton_def.type = "Update expressions";
    [
        generate_definition("Prefix increment", "++"),
        generate_definition("Prefix decrement", "--"),
    ].forEach(operator => {
        skeleton_def.id = operator.id;
        skeleton_def.is = operator.is;
        ast_node_table.register_node_definition(skeleton_def);
    });

    // Postfix operators (17)
    const postfix_operators = [
        {
            id : "increment",
            is : value => value === "++",
        },
        {
            id : "decrement",
            is : value => value === "--",
        }
    ];

    skeleton_def.precedence = UNARY_POSTFIX_EXPRESSION;
    skeleton_def.initialize = (node, token, parser) => {
        parser.change_state("punctuator");
        node.operator   = parser.generate_next_node();
        node.expression = parser.prev_node;
        node.start      = node.expression.start;
        node.end        = token.end;
    };

    postfix_operators.forEach(operator => {
        skeleton_def.id = `Postfix ${operator.id} operator`;
        skeleton_def.is = (token, parser) => {
            if (token.id === "Operator" && parser.current_state === expression) {
                const last = get_last_non_comment_node(parser);
                if (last && has_no_line_terminator(last, token)) {
                    return operator.is(token.value);
                }
            }
        };
        ast_node_table.register_node_definition(skeleton_def);
    });
};
