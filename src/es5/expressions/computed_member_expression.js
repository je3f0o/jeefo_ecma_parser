/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : computed_member_expression.js
* Created at  : 2019-03-19
* Updated at  : 2019-03-19
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

const precedence_enum             = require("../enums/precedence_enum"),
      operator_definition         = require("../common/operator_definition"),
      is_expression               = require("../helpers/is_expression"),
      prepare_next_expression     = require("../helpers/prepare_next_expression"),
      get_current_state_name      = require("../helpers/get_current_state_name"),
      get_last_non_comment_symbol = require("../helpers/get_last_non_comment_symbol");

module.exports = {
    id         : "Computed member expression",
	type       : "Expression",
	precedence : 19,

    is : (current_token, parser) => {
        if (is_expression(parser) && current_token.value === '[') {
            const lvalue = get_last_non_comment_symbol(parser);
            if (lvalue !== null) {
                // TODO: check lvalue
                return true;
            }
        }
        return false;
    },

	initialize : (symbol, current_token, parser) => {
        const object = parser.current_symbol;

        const state_name = get_current_state_name(parser);
        parser.current_symbol   = null;
        parser.previous_symbols = [];
        parser.change_state(state_name);

        const open_square_bracket = operator_definition.generate_new_symbol(parser);

        prepare_next_expression(parser, true);
        const expression = parser.get_next_symbol(precedence_enum.TERMINATION);

        parser.expect(']', parser => parser.next_token.value === ']');
        const close_square_bracket = operator_definition.generate_new_symbol(parser);

        symbol.object               = object;
        symbol. open_square_bracket = open_square_bracket;
        symbol.expression           = expression;
        symbol.close_square_bracket = close_square_bracket;
        symbol.start                = object.start;
        symbol.end                  = close_square_bracket.end;

        parser.prepare_next_state(state_name);
    },
};
