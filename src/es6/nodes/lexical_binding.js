/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : lexical_binding.js
* Created at  : 2019-08-25
* Updated at  : 2019-08-25
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
const { is_assign }           = require("../../helpers");
const initializer_definition  = require("./initializer_definition");

module.exports = new AST_Node_Definition({
    id         : "Lexical binding",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : (node, current_token, parser) => {
        const binding   = parser.prev_node;
        let initializer = null;

        //parser.prepare_next_node_definition(binding.id !== "Identifier");
        if (parser.next_token && is_assign(parser.next_token)) {
            initializer = initializer_definition.generate_new_node(parser);
        }

        node.binding     = binding;
        node.initializer = initializer;
        node.start       = binding.start;
        node.end         = (initializer || binding).end;
    }
});
