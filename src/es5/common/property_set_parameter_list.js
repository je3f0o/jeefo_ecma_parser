/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : property_set_parameter_list.js
* Created at  : 2019-08-21
* Updated at  : 2019-08-28
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

const { AST_Node_Definition } = require("@jeefo/parser");
const { terminal_definition } = require("../../common");
const {
    is_identifier,
    is_open_parenthesis,
    is_close_parenthesis,
} = require("../../helpers");

module.exports = new AST_Node_Definition({
    id         : "Property set parameter list",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : (node, token, parser) => {
        parser.expect('(', is_open_parenthesis);
        const open = terminal_definition.generate_new_node(parser);

        parser.prepare_next_state("expression", true);
        if (is_close_parenthesis(parser)) {
            parser.throw_unexpected_token(
                "Setter must have exactly one formal parameter."
            );
        }
        parser.expect("identifier", is_identifier);
        const parameter = parser.generate_next_node();

        parser.prepare_next_state("delimiter", true);
        parser.expect(')', is_close_parenthesis);
        const close = terminal_definition.generate_new_node(parser);

        node.open_parenthesis  = open;
        node.parameter         = parameter;
        node.close_parenthesis = close;
        node.start             = open.start;
        node.end               = close.end;
    }
});
