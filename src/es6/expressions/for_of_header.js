/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_of_header.js
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

const { for_of_header }           = require("../enums/states_enum");
const { EXPRESSION, TERMINATION } = require("../enums/precedence_enum");

const error_message = (
    "for-of loop variable declaration may not have an initializer."
);

module.exports = {
    id         : "For of header",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, parser) => parser.current_state === for_of_header,
    initialize : (node, token, parser) => {
        let { keyword, binding, prev_node, initializer } = parser.prev_node;

        if (initializer) {
            parser.throw_unexpected_token(error_message, initializer);
        }

        if (keyword) {
            if (keyword.value === "var") {
                parser.change_state("for_binding", false);
                binding = parser.generate_next_node();
            } else {
                parser.change_state("for_declaration", false);
                binding = parser.generate_next_node();
            }
        }

        parser.prev_node = prev_node;
        parser.change_state("expression_no_in");
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
