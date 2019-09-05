/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : object_literal.js
* Created at  : 2019-08-21
* Updated at  : 2019-09-06
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

const { EXPRESSION }                     = require("../enums/precedence_enum");
const { expression, primary_expression } = require("../enums/states_enum");
const {
    is_close_curly,
    is_delimiter_token,
    get_last_non_comment_node,
} = require("../../helpers");

module.exports = {
    id         : "Object literal",
    type       : "Expression",
    precedence : EXPRESSION,

    is (token, parser) {
        if (parser.current_state !== expression) { return; }
        if (is_delimiter_token(token, '{')) {
            return get_last_non_comment_node(parser) === null;
        }
    },
    initialize (node, token, parser) {
        const list       = [];
        const delimiters = [];

        parser.change_state("punctuator");
        const open = parser.generate_next_node();
        parser.prepare_next_state("property_definition", true);
        while (! is_close_curly(parser)) {
            list.push(parser.generate_next_node());

            if (parser.next_token === null) {
                parser.throw_unexpected_end_of_stream();
            }

            if (is_delimiter_token(parser.next_token, ',')) {
                parser.change_state("punctuator");
                delimiters.push(parser.generate_next_node());

                parser.prepare_next_state("property_definition", true);
            }
        }
        parser.change_state("punctuator");
        const close = parser.generate_next_node();

        node.open_curly_bracket       = open;
        node.property_definition_list = list;
        node.delimiters               = delimiters;
        node.close_curly_bracket      = close;
        node.start                    = open.start;
        node.end                      = close.end;

        parser.current_state = primary_expression;
    }
};
