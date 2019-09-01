/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : assignable_declaration.js
* Created at  : 2019-09-01
* Updated at  : 2019-09-01
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

const { DECLARATION }            = require("../enums/precedence_enum");
const { assignable_declaration } = require("../enums/states_enum");

module.exports = {
    id         : "Assignable declaration",
    type       : "Declaration",
    precedence : DECLARATION,

    is : (token, parser) => {
        return parser.current_state === assignable_declaration;
    },
    initialize : (node, token, parser) => {
        parser.change_state("expression");
        if (! parser.next_node_definition) {
            parser.throw_unexpected_token();
        }
        switch (parser.next_node_definition.id) {
            case "Identifier"     : break;
            case "Array literal"  :
            case "Object literal" :
                parser.set_prev_node(parser.generate_next_node());
                parser.change_state("binding_pattern", false);
                break;
            default:
                parser.throw_unexpected_token();
        }

        node.declaration = parser.generate_next_node();
    }
};
