/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : empty_parameter_list.js
* Created at  : 2019-08-21
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

const { AST_Node_Definition } = require("@jeefo/parser");
const { terminal_definition } = require("../../common");
const {
    is_open_parenthesis,
    is_close_parenthesis,
} = require("../../helpers");

module.exports = new AST_Node_Definition({
    id         : "Empty parameter list",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : (node, token, parser) => {
        parser.expect('(', is_open_parenthesis);
        const open = terminal_definition.generate_new_node(parser);

        parser.prepare_next_node_definition(true);
        parser.expect(')', is_close_parenthesis);
        const close = terminal_definition.generate_new_node(parser);

        node.open_parenthesis  = open;
        node.close_parenthesis = close;
        node.start             = open.start;
        node.end               = close.end;
    }
});
