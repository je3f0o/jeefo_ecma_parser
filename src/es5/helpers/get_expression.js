/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : get_expression.js
* Created at  : 2019-03-22
* Updated at  : 2019-03-22
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

module.exports = function get_expression (parser, precedence) {
    let is_valid = false;
    switch (parser.next_symbol_definition.type) {
        case "Primitive" :
        case "Expression" :
            is_valid = true;
            break;
        default:
            is_valid = parser.next_token.value === "function";
    }

    if (is_valid) {
        return parser.get_next_symbol(precedence);
    }

    parser.throw_unexpected_token();
};
