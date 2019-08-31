/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : class_body.js
* Created at  : 2019-08-29
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

const { EXPRESSION }               = require("../enums/precedence_enum");
const { class_body }               = require("../enums/states_enum");
const { static_method_definition } = require("../nodes");
const {
    terminal_definition : terminal
} = require("../../common");
const {
    is_terminator,
    is_open_curly,
    is_close_curly,
} = require("../../helpers");

const is_static = (parser) => {
    const { next_token : token } = parser;
    if (token.id === "Identifier" && token.value === "static") {
        const next_token = parser.look_ahead(true);
        return next_token.id !== "Delimiter" || next_token.value !== '(';
    }
};

module.exports = {
    id         : "Class body",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, parser) => parser.current_state === class_body,
    initialize : (node, current_token, parser) => {
        const element_list = [];

        parser.expect('{', is_open_curly);
        const open_curly_bracket = terminal.generate_new_node(parser);

        parser.prepare_next_state("expression", true);
        while (! is_close_curly(parser)) {
            let element;
            if (is_terminator(parser)) {
                element = terminal.generate_new_node(parser);
            } else if (is_static(parser)) {
                element = static_method_definition.generate_new_node(parser);
            } else {
                parser.change_state("property_name");
                parser.previous_nodes.push(parser.generate_next_node());
                parser.prepare_next_node_definition(true);
                element = parser.generate_next_node();
            }

            element_list.push(element);
            parser.prepare_next_state("expression", true);
        }
        const close_curly_bracket = terminal.generate_new_node(parser);

        node.open_curly_bracket  = open_curly_bracket;
        node.element_list        = element_list;
        node.close_curly_bracket = close_curly_bracket;
        node.start               = open_curly_bracket.start;
        node.end                 = close_curly_bracket.end;
    }
};
