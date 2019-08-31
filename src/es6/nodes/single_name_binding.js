/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : single_name_binding.js
* Created at  : 2019-08-21
* Updated at  : 2019-08-29
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/6.0/#sec-destructuring-binding-patterns
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { AST_Node_Definition } = require("@jeefo/parser");

module.exports = new AST_Node_Definition({
    id         : "Single name binding",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : (node, token, parser) => {
        let { identifier, initializer } = parser.prev_node;
        const prev_state = parser.current_state;

        parser.prev_node = identifier;
        parser.previous_nodes.push(identifier);
        parser.change_state("binding_identifier");
        identifier = parser.generate_next_node();

        node.identifier  = identifier;
        node.initializer = initializer;
        node.start       = identifier.start;
        node.end         = (initializer || identifier).end;

        parser.current_state = prev_state;
    }
});
