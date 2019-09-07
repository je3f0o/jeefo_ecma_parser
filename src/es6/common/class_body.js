/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : class_body.js
* Created at  : 2019-08-29
* Updated at  : 2019-09-07
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

const { EXPRESSION } = require("../enums/precedence_enum");
const { class_body } = require("../enums/states_enum");
const {
    is_terminator,
    is_open_curly,
    is_close_curly,
    is_identifier_value,
} = require("../../helpers");

const is_static = parser => {
    if (is_identifier_value(parser.next_token, "static")) {
        const next_token = parser.look_ahead(true);
        return next_token.id !== "Delimiter" || next_token.value !== '(';
    }
};

module.exports = {
    id         : "Class body",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, { current_state : s }) => s === class_body,
    initialize : (node, current_token, parser) => {
        const element_list = [];

        parser.expect('{', is_open_curly);
        parser.change_state("punctuator");
        const open = parser.generate_next_node();

        parser.prepare_next_state("expression", true);
        while (! is_close_curly(parser)) {
            if (is_terminator(parser)) {
                parser.change_state("punctuator");
            } else if (is_static(parser)) {
                parser.change_state("static_method");
            } else {
                parser.change_state("method_definition");
            }

            element_list.push(parser.generate_next_node());
            parser.prepare_next_state("expression", true);
        }
        parser.change_state("punctuator");
        const close = parser.generate_next_node();

        node.open_curly_bracket  = open;
        node.element_list        = element_list;
        node.close_curly_bracket = close;
        node.start               = open.start;
        node.end                 = close.end;
    }
};
