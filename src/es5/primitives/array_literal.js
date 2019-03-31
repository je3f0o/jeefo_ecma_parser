/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : array_literal.js
* Created at  : 2017-08-17
* Updated at  : 2019-03-25
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const precedence_enum                 = require("../enums/precedence_enum"),
      is_expression                   = require("../helpers/is_expression"),
      get_current_state_name          = require("../helpers/get_current_state_name"),
      get_comma_separated_expressions = require("../helpers/get_comma_separated_expressions");

module.exports = {
    id         : "Array literal",
    type       : "Primitive",
    precedence : precedence_enum.PRIMITIVE,

    is         : (token, parser) => is_expression(parser) && token.value === '[',
    initialize : (symbol, current_token, parser) => {
        const expression_name = get_current_state_name(parser);
        parser.change_state("delimiter");

        symbol.open_square_bracket  = parser.next_symbol_definition.generate_new_symbol(parser);
        symbol.elements             = get_comma_separated_expressions(parser, ']');
        symbol.close_square_bracket = parser.next_symbol_definition.generate_new_symbol(parser);
        symbol.start                = symbol.open_square_bracket.start;
        symbol.end                  = symbol.close_square_bracket.end;

        parser.prepare_next_state(expression_name, true);
    }
};
