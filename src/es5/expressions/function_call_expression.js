/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : function_call_expression.js
* Created at  : 2019-03-19
* Updated at  : 2019-03-29
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

const SymbolDefinition                = require("@jeefo/parser/src/symbol_definition"),
      is_expression                   = require("../helpers/is_expression"),
      get_current_state_name          = require("../helpers/get_current_state_name"),
      get_last_non_comment_symbol     = require("../helpers/get_last_non_comment_symbol"),
      get_comma_separated_expressions = require("../helpers/get_comma_separated_expressions");

const arguments_list_definition = new SymbolDefinition({
    id         : "Arguments list",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : (symbol, current_token, parser) => {
        const expression_name = get_current_state_name(parser);
        parser.change_state("delimiter");

        symbol.open_parenthesis  = parser.next_symbol_definition.generate_new_symbol(parser);
        symbol.expressions       = get_comma_separated_expressions(parser, ')');
        symbol.close_parenthesis = parser.next_symbol_definition.generate_new_symbol(parser);
        symbol.start             = symbol.open_parenthesis.start;
        symbol.end               = symbol.close_parenthesis.end;

        parser.change_state(expression_name);
        parser.prepare_next_symbol_definition();
    }
});

module.exports = {
    id         : "Function call expression",
	type       : "Expression",
	precedence : 19,

    is : (current_token, parser) => {
        return current_token.value === '('
            && is_expression(parser)
            && get_last_non_comment_symbol(parser) !== null;
    },

	initialize : (symbol, current_token, parser) => {
        symbol.callee         = get_last_non_comment_symbol(parser);
        symbol.arguments_list = arguments_list_definition.generate_new_symbol(parser);
        symbol.start          = symbol.callee.start;
        symbol.end            = symbol.arguments_list.end;
    },
};
