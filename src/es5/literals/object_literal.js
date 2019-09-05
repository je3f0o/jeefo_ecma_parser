/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : object_literal.js
* Created at  : 2019-03-23
* Updated at  : 2019-09-05
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-11.1.5
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
        const delimiters = [];
        const properties = [];

        parser.change_state("punctuator");
        const open = parser.generate_next_node();
        parser.prepare_next_state("property_list", true);
        while (! is_close_curly(parser)) {
            properties.push(parser.generate_next_node());

            if (parser.next_token === null) {
                parser.throw_unexpected_end_of_stream();
            }

            if (is_delimiter_token(parser.next_token, ',')) {
                delimiters.push(parser.generate_next_node());

                parser.prepare_next_state("property_list", true);
            }
        }
        parser.change_state("punctuator");
        const close = parser.generate_next_node();

        node.open_curly_bracket  = open;
        node.properties          = properties;
        node.delimiters          = delimiters;
        node.close_curly_bracket = close;
        node.start               = open.start;
        node.end                 = close.end;

        parser.current_state = primary_expression;
    }
};
