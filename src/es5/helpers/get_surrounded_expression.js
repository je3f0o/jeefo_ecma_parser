/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : get_surrounded_expression.js
* Created at  : 2019-03-02
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

const SymbolDefinition = require("@jeefo/parser/src/symbol_definition"),
      precedence_enum  = require("../enums/precedence_enum"),
      get_right_value  = require("./get_right_value");

const surrounded_expression_definition = new SymbolDefinition({
    id         : "Surrounded expression",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : (symbol, current_token, parser) => {
        const open_parenthesis = parser.next_symbol_definition.generate_new_symbol(parser);

        parser.prepare_next_state("expression", true);
        if (parser.next_token.value === ')') {
            parser.throw_unexpected_token("Missing expression");
        }

        parser.post_comment = null;
        let expression = get_right_value(parser, precedence_enum.TERMINATION);

        parser.current_symbol = parser.post_comment;
        parser.expect(')', parser => parser.next_token.value === ')');
        const close_parenthesis = parser.next_symbol_definition.generate_new_symbol(parser);

        symbol.open_parenthesis  = open_parenthesis;
        symbol.expression        = expression;
        symbol.close_parenthesis = close_parenthesis;
        symbol.start             = open_parenthesis.start;
        symbol.end               = close_parenthesis.end;
    }
});

module.exports = function get_surrounded_expression (parser) {
    return surrounded_expression_definition.generate_new_symbol(parser);
};
