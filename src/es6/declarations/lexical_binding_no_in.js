/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : lexical_binding_no_in.js
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

const { DECLARATION }           = require("../enums/precedence_enum");
const { error_reporter }        = require("../helpers");
const { lexical_binding_no_in } = require("../enums/states_enum");
const {
    is_assign,
    is_destructuring_binding_pattern
} = require("../../helpers");

module.exports = {
    id         : "Lexical binding no in",
    type       : "Declaration",
    precedence : DECLARATION,

    is         : (_, parser) => parser.current_state === lexical_binding_no_in,
    initialize : (node, token, parser) => {
        let initializer = null, binding;

        if (parser.prev_node) {
            ({ binding, initializer } = parser.prev_node);
            if (! initializer && is_destructuring_binding_pattern(binding)) {
                error_reporter.missing_initializer_in_destructuring(parser);
            }
        } else {
            parser.change_state("assignable_declaration", false);
            binding = parser.generate_next_node().declaration;
            parser.prepare_next_state("expression_no_in", true);

            if (is_assign(parser)) {
                parser.change_state("initializer");
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
