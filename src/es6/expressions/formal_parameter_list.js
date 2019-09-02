/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : formal_parameter_list.js
* Created at  : 2019-08-28
* Updated at  : 2019-09-02
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

const { EXPRESSION }            = require("../enums/precedence_enum");
const { terminal_definition }   = require("../../common");
const { binding_rest_element }  = require("../nodes");
const { formal_parameter_list } = require("../enums/states_enum");
const {
    is_comma,
    is_close_parenthesis,
} = require("../../helpers");

function parse_parameters (parameters, delimiters, parser) {
    while (! is_close_parenthesis(parser)) {
        let param;
        if (parser.next_token.id === "Rest") {
            param = binding_rest_element.generate_new_node(parser);

            parser.prepare_next_state("delimiter", true);
            if (! is_close_parenthesis(parser)) {
                parser.throw_unexpected_token(
                    "Rest parameter must be last formal parameter"
                );
            }
        } else {
            param = parser.generate_next_node();
        }

        parameters.push(param);

        if (is_comma(parser)) {
            delimiters.push(
                terminal_definition.generate_new_node(parser)
            );
            parser.prepare_next_state("binding_element", true);
        }
    }
}

module.exports = {
    id         : "Formal parameter list",
    type       : "Expression",
    precedence : EXPRESSION,

    is (token, parser) {
        return parser.current_state === formal_parameter_list;
    },
    initialize (node, current_token, parser) {
        const parameters = [];
        const delimiters = [];

        parser.change_state("delimiter");
        const open = parser.generate_next_node();

        parser.prepare_next_state("binding_element", true);
        if (! is_close_parenthesis(parser)) {
            parse_parameters(parameters, delimiters, parser);
        } else {
            parser.change_state("delimiter");
        }

        const close = parser.generate_next_node();

        node.open_parenthesis  = open;
        node.parameters        = parameters;
        node.delimiters        = delimiters;
        node.close_parenthesis = close;
        node.start             = open.start;
        node.end               = close.end;
    }
};
