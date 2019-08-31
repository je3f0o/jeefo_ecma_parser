/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_in_header.js
* Created at  : 2019-08-29
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

const { for_in_header }           = require("../enums/states_enum");
const { EXPRESSION, TERMINATION } = require("../enums/precedence_enum");

module.exports = {
    id         : "For in header",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, parser) => parser.current_state === for_in_header,
    initialize : (node, token, parser) => {
        let { keyword, binding, prev_node, initializer } = parser.prev_node;

        if (keyword) {
            // for (var $var = value in expression); is valid in
            // non-strict mode.
            // Reference: https://www.ecma-international.org/ecma-262/8.0/index.html#sec-initializers-in-forin-statement-heads
            if (keyword.value === "var") {
                if (initializer) {
                    parser.change_state(
                        "es5_legacy_variable_declaration_no_in", false
                    );
                } else {
                    parser.change_state("for_binding", false);
                }
                binding = parser.generate_next_node();
            } else {
                parser.change_state("for_declaration", false);
                binding = parser.generate_next_node();
            }
        }

        parser.prev_node = prev_node;
        parser.change_state("delimiter");
        const operator = parser.generate_next_node();

        parser.prepare_next_state("expression", true);
        const expression = parser.parse_next_node(TERMINATION);
        if (! expression) {
            parser.throw_unexpected_token();
        }

        node.binding    = binding;
        node.operator   = operator;
        node.expression = expression;
        node.start      = binding.start;
        node.end        = expression.end;
    }
};
