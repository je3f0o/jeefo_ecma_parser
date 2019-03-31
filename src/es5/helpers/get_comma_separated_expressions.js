/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : get_comma_separated_expressions.js
* Created at  : 2019-03-22
* Updated at  : 2019-03-28
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

const precedence_enum = require("../enums/precedence_enum"),
      get_expression  = require("./get_expression");

module.exports = function get_comma_separated_expressions (parser, terminator) {
    const expressions = [];
    parser.prepare_next_state("expression", true);

    LOOP:
    while (true) {
        if (parser.next_token.value === terminator) { break; }

        expressions.push(get_expression(parser, precedence_enum.COMMA));

        if (parser.next_token === null) {
            parser.throw_unexpected_end_of_stream();
        }

        switch (parser.next_token.value) {
            case ',' :
                parser.change_state("delimiter");
                expressions.push(parser.next_symbol_definition.generate_new_symbol(parser));

                parser.prepare_next_state("expression", true);
                break;
            case terminator :
                break LOOP;
            default:
                parser.throw_unexpected_token();
        }
    }

    return expressions;
};
