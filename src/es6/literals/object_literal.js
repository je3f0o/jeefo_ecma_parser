/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : object_literal.js
* Created at  : 2019-08-21
* Updated at  : 2020-09-08
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

const {expression} = require("../enums/states_enum");
const {EXPRESSION} = require("../enums/precedence_enum");
const {
    is_comma,
    is_close_curly,
    is_delimiter_token,
    validate_object_literals,
    get_last_non_comment_node,
} = require("../../helpers");

const cover_paren = "Cover parenthesized expression and arrow parameter list";

module.exports = {
    id         : "Object literal",
    type       : "Primary expression",
    precedence : EXPRESSION,

    is: (token, parser) => (
        parser.current_state === expression &&
        is_delimiter_token(token, '{') &&
        get_last_non_comment_node(parser) === null
    ),

    initialize (node, token, parser) {
        const list       = [];
        const delimiters = [];

        parser.context_stack.push(node.id);
        parser.change_state("punctuator");
        const open = parser.generate_next_node();

        parser.prepare_next_state("property_definition", true);
        while (! parser.is_terminated) {
            list.push(parser.generate_next_node());

            parser.prepare_next_state("punctuator", true);
            if (parser.is_terminated) {
                parser.expect('}', is_close_curly);
            } else {
                parser.expect(',', is_comma);
                delimiters.push(parser.generate_next_node());
                parser.prepare_next_state("property_definition", true);
            }
        }
        parser.is_terminated = false;
        parser.change_state("punctuator");
        const close = parser.generate_next_node();
        parser.context_stack.pop();

        node.open_curly_bracket       = open;
        node.property_definition_list = list;
        node.delimiters               = delimiters;
        node.close_curly_bracket      = close;
        node.start                    = open.start;
        node.end                      = close.end;

        parser.end(node);
        parser.current_state = expression;

        if (! parser.context_stack.includes(cover_paren)) {
            validate_object_literals(node, parser);
        }
    }
};
