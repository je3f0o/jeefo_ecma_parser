/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : lexical_binding.js
* Created at  : 2019-09-01
* Updated at  : 2019-09-08
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
const { is_assign_token } = require("../../helpers");

module.exports = {
    id         : "Lexical binding",
    type       : "Declaration",
    precedence : DECLARATION,

    is         : (_, { current_state : s }) => s === lexical_binding,
    initialize : (node, token, parser) => {
        let initializer = null, is_destructuring;

        if (token.id === "Identifier") {
            if (token.value === "let") {
                parser.throw_unexpected_token(
                    "let is disallowed as a lexically bound name"
                );
            }
            parser.change_state("binding_identifier");
        } else {
            is_destructuring = true;
            parser.change_state("binding_pattern");
        }
        const binding = parser.generate_next_node();

        parser.set_prev_node(binding);
        parser.prepare_next_node_definition();
        if (parser.next_token && is_assign_token(parser.next_token)) {
            parser.change_state("initializer");
            initializer = parser.generate_next_node();
        }
        const error_occurred = (
            is_destructuring &&
            ! initializer &&
            ! parser.is_terminated
        );
        if (error_occurred) {
            error_reporter.missing_initializer_in_destructuring(parser);
        }

        node.binding     = binding;
        node.initializer = initializer;
        node.start       = binding.start;
        node.end         = (initializer || binding).end;
    }
};
