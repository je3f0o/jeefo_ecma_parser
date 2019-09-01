/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : lexical_binding.js
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

const { DECLARATION }     = require("../enums/precedence_enum");
const { error_reporter }  = require("../helpers");
const { lexical_binding } = require("../enums/states_enum");
const {
    is_assign,
    is_destructuring_binding_pattern
} = require("../../helpers");

module.exports = {
    id         : "Lexical binding",
    type       : "Declaration",
    precedence : DECLARATION,

    is         : (_, parser) => parser.current_state === lexical_binding,
    initialize : (node, token, parser) => {
        let initializer = null;

        parser.change_state("assignable_declaration", false);
        const binding = parser.generate_next_node().declaration;
        parser.set_prev_node(binding);
        parser.prepare_next_node_definition();

        if (parser.next_token) {
            if (is_assign(parser)) {
                parser.change_states("initializer", "expression");
                initializer = parser.generate_next_node();
            } else if (is_destructuring_binding_pattern(binding)) {
                error_reporter.missing_initializer_in_destructuring(parser);
            }
        }

        node.binding     = binding;
        node.initializer = initializer;
        node.start       = binding.start;
        node.end         = (initializer || binding).end;
    }
};
