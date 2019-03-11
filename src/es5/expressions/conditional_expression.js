/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : conditional_expression.js
* Created at  : 2019-02-12
* Updated at  : 2019-02-26
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

const states_enum        = require("../enums/states_enum"),
      precedence_enum    = require("../enums/precedence_enum"),
      get_start_position = require("../helpers/get_start_position");

module.exports = {
	id         : "Conditional expression",
	type       : "Expression",
	precedence : 41,

    is         : (token, parser) => parser.current_state === states_enum.conditional_expression && token.value === '(',
    initialize : (symbol, current_token, parser) => {
        parser.change_state("delimiter");
        const open_parenthesis = parser.next_symbol_definition.generate_new_symbol(parser);

        parser.prepare_next_state("expression", true);
        if (parser.next_token.value === ')') {
            parser.throw_unexpected_token("Missing expression");
        }

        let expression = parser.get_next_symbol(precedence_enum.TERMINATION);
        if (expression.id === "Comment") {
            let i = parser.previous_symbols.length;
            while (i--) {
                if (parser.previous_symbols[i].id === "Comment") {
                    continue;
                }
                expression = parser.previous_symbols[i];
                break;
            }
        } else {
            parser.current_symbol = null;
        }

        parser.expect(')', parser => parser.next_token.value === ')');
        parser.change_state("delimiter");
        const close_parenthesis = parser.next_symbol_definition.generate_new_symbol(parser);

        symbol.open_parenthesis  = open_parenthesis;
        symbol.expression        = expression;
        symbol.close_parenthesis = close_parenthesis;
        symbol.start             = get_start_position(open_parenthesis.pre_comment, current_token);
        symbol.end               = close_parenthesis.end;
    }
};
