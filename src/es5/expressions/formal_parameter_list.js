/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : formal_parameter_list.js
* Created at  : 2019-08-27
* Updated at  : 2019-08-27
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

const { terminal_definition }   = require("../../common");
const { formal_parameter_list } = require("../enums/states_enum");
const {
    is_comma,
    is_identifier,
    is_close_parenthesis,
} = require("../../helpers");

module.exports = {
    id         : "Formal parameter list",
    type       : "Expression",
    precedence : -1,

    is : (token, parser) => {
        return parser.current_state === formal_parameter_list;
    },
    initialize : (node, current_token, parser) => {
        const parameters = [];
        const delimiters = [];

        const open = terminal_definition.generate_new_node(parser);
        parser.prepare_next_state("expression", true);
        while (! is_close_parenthesis(parser)) {
            parser.expect("identifier", is_identifier);
            parameters.push(parser.generate_next_node());

            parser.prepare_next_state("delimiter", true);
            if (is_comma(parser)) {
                delimiters.push(
                    terminal_definition.generate_new_node(parser)
                );
                parser.prepare_next_state("expression", true);
            }
        }
        const close = terminal_definition.generate_new_node(parser);

        node.open_parenthesis  = open;
        node.parameters        = parameters;
        node.delimiters        = delimiters;
        node.close_parenthesis = close;
        node.start             = open.start;
        node.end               = close.end;
    }
};
