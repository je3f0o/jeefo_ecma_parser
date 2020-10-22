/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : class_body.js
* Created at  : 2019-08-29
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

const {EXPRESSION} = require("../enums/precedence_enum");
const {class_body} = require("../enums/states_enum");
const {
    is_open_curly,
    is_close_curly,
    is_delimiter_token,
} = require("../../helpers");

const prepare_method_definition = parser => {
    parser.change_state("property_name");
    const property_name = parser.generate_next_node();
    parser.set_prev_node(property_name);
    parser.change_state("method_definition");
};

module.exports = {
    id         : "Class body",
    type       : "Class declarations",
    precedence : EXPRESSION,

    is         : (_, {current_state: s}) => s === class_body,
    initialize : (node, current_token, parser) => {
        const element_list = [];

        parser.expect('{', is_open_curly);
        parser.change_state("punctuator");
        const open = parser.generate_next_node();

        parser.prepare_next_state("expression", true);
        while (! parser.is_terminated) {
            OUTER:
            switch (parser.next_token.id) {
                case "Delimiter" :
                    switch (parser.next_token.value) {
                        case ';' :
                            parser.change_state("punctuator");
                            break OUTER;
                        case '[':
                            prepare_method_definition(parser);
                            break OUTER;
                    }
                    parser.throw_unexpected_token();
                    break;
                case "Number" :
                case "String" :
                    prepare_method_definition(parser);
                    break;
                case "Identifier" :
                    if (parser.next_token.value === "static") {
                        const next_token = parser.look_ahead(true);
                        if (is_delimiter_token(next_token, '(')) {
                            prepare_method_definition(parser);
                        } else {
                            parser.change_state("static_method");
                        }
                    } else {
                        prepare_method_definition(parser);
                    }
                    break;
                default: parser.throw_unexpected_token();
            }

            element_list.push(parser.generate_next_node());
            parser.prepare_next_state("expression", true);
        }

        parser.expect('}', is_close_curly);
        parser.is_terminated = false;
        parser.change_state("punctuator");
        const close = parser.generate_next_node();

        node.open_curly_bracket  = open;
        node.element_list        = element_list;
        node.close_curly_bracket = close;
        node.start               = open.start;
        node.end                 = close.end;
    }
};
