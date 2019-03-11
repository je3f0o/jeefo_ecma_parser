/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : conditional_expression_expectation.js
* Created at  : 2019-02-12
* Updated at  : 2019-02-12
* Author      : jeefo
* Purpose     :
* Description :
* Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

module.exports = function conditional_expression_expectation (parser) {
    if (parser.next_symbol_definition === null) {
        return false;
    }

    if (parser.next_symbol_definition.id === "Comment") {
        parser.current_symbol = parser.next_symbol_definition.generate_new_symbol(parser.next_token, parser);
        parser.prepare_next_symbol_definition();
        return conditional_expression_expectation(parser);
    }

    return parser.next_symbol_definition.id === "Conditional expression";
};
