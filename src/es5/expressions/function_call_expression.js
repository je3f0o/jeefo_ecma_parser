/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : function_call_expression.js
* Created at  : 2019-03-19
* Updated at  : 2019-03-20
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-11.2
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const SymbolDefinition            = require("@jeefo/parser/src/symbol_definition"),
      precedence_enum             = require("../enums/precedence_enum"),
      is_expression               = require("../helpers/is_expression"),
      get_start_position          = require("../helpers/get_start_position"),
      get_current_state_name      = require("../helpers/get_current_state_name"),
      get_last_non_comment_symbol = require("../helpers/get_last_non_comment_symbol");

const arguments_list_definition = new SymbolDefinition({
    id         : "Arguments list",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : (symbol, current_token, parser) => {
        const expressions        = [];
        const current_state_name = get_current_state_name(parser);

        parser.current_symbol   = null;
        parser.previous_symbols = [];
        parser.change_state("expression");

        const open_parenthesis = parser.next_symbol_definition.generate_new_symbol(parser);
        parser.prepare_next_state("expression", true);

        LOOP:
        while (true) {
            if (parser.next_token.value === ')') {
                break;
            }

            expressions.push(parser.get_next_symbol(precedence_enum.COMMA));

            if (parser.next_token === null) {
                parser.throw_unexpected_end_of_stream();
            }

            switch (parser.next_token.value) {
                case ',' :
                    parser.prepare_next_state("expression", true);
                    break;
                case ')' :
                    break LOOP;
                default:
                    parser.throw_unexpected_token();
            }
        }

        parser.expect(')', parser => parser.next_token.value === ')');
        const close_parenthesis = parser.next_symbol_definition.generate_new_symbol(parser);
        parser.prepare_next_state(current_state_name);

        symbol.open_parenthesis  = open_parenthesis;
        symbol.expressions       = expressions;
        symbol.close_parenthesis = close_parenthesis;
        symbol.start             = open_parenthesis.start;
        symbol.end               = close_parenthesis.end;
    }
});

module.exports = {
    id         : "Function call",
	type       : "Expression",
	precedence : 19,

    is : (current_token, parser) => {
        if (is_expression(parser)) {
            return current_token.value === '(' && get_last_non_comment_symbol(parser) !== null;
        }
        return false;
    },

	initialize : (symbol, current_token, parser) => {
        const callee         = get_last_non_comment_symbol(parser);
        const arguments_list = arguments_list_definition.generate_new_symbol(parser);

        symbol.callee         = callee;
        symbol.arguments_list = arguments_list;
        symbol.start          = get_start_position(callee.pre_comment, callee);
        symbol.end            = arguments_list.end;
    },
};
