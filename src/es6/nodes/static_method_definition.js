/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : static_method_definition.js
* Created at  : 2019-08-21
* Updated at  : 2019-08-29
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/6.0/#sec-class-definitions
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { AST_Node_Definition } = require("@jeefo/parser");
const { property_list }       = require("../enums/states_enum");
const { terminal_definition } = require("../../common");

module.exports = new AST_Node_Definition({
    id         : "Static method definition",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : (node, token, parser) => {
        const keyword = terminal_definition.generate_new_node(parser);

        parser.prev_state = property_list;
        parser.change_state("property_name");
        parser.previous_nodes.push(parser.generate_next_node());
        const method = parser.generate_next_node();

        node.keyword = keyword;
        node.method  = method;
        node.start   = keyword.start;
        node.end     = method.end;
    }
});
