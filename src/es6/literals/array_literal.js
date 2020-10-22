/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : array_literal.js
* Created at  : 2019-08-24
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

const {EXPRESSION} = require("../enums/precedence_enum");
const {expression} = require("../enums/states_enum");
const {
    is_comma,
    is_delimiter_token,
    is_close_square_bracket,
    get_last_non_comment_node,
} = require("../../helpers");

module.exports = {
    id         : "Array literal",
    type       : "Primary expression",
    precedence : EXPRESSION,

    is : (token, parser) => (
        parser.current_state === expression &&
        is_delimiter_token(token, '[') &&
        get_last_non_comment_node(parser) === null
    ),

    initialize (node, token, parser) {
        const delimiters   = [];
        const element_list = [];

        parser.change_state("punctuator");
        const open = parser.generate_next_node();
        parser.prepare_next_state("assignment_expression", true);
        while (! is_close_square_bracket(parser)) {
            if (parser.next_token.id === "Rest") {
                parser.change_state("spread_element");
                element_list.push(parser.generate_next_node());

                if (is_comma(parser)) {
                    parser.throw_unexpected_token(
                        "Rest element must be last element"
                    );
                } else if (is_close_square_bracket(parser)) {
                    break;
                }

                parser.throw_unexpected_token();
            } else if (is_comma(parser)) {
                parser.change_state("elision");
                delimiters.push(parser.generate_next_node());
                parser.prepare_next_state("assignment_expression", true);
            } else {
                const expr = parser.generate_next_node();
                element_list.push(expr);
                parser.prepare_next_state("assignment_expression", true);
            }
        }
        parser.change_state("punctuator");
        const close = parser.generate_next_node();

        node.open_square_bracket  = open;
        node.element_list         = element_list;
        node.delimiters           = delimiters;
        node.close_square_bracket = close;
        node.start                = open.start;
        node.end                  = close.end;

        parser.end(node);
        parser.current_state = expression;
    },
};
