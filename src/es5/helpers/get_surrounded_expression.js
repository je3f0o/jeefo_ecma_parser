/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : get_surrounded_expression.js
* Created at  : 2019-03-02
* Updated at  : 2019-03-11
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

const precedence_enum              = require("../enums/precedence_enum"),
      SymbolDefinition             = require("@jeefo/parser/src/symbol_definition"),
      open_parenthesis_definition  = require("./open_parenthesis_definition"),
      close_parenthesis_definition = require("./close_parenthesis_definition");

const surrounded_expression_definition = new SymbolDefinition({
    id         : "Surrounded expression",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : (symbol, current_token, parser) => {
        const open_parenthesis = open_parenthesis_definition.generate_new_symbol(parser);

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
        const close_parenthesis = close_parenthesis_definition.generate_new_symbol(parser);

        symbol.open_parenthesis  = open_parenthesis;
        symbol.expression        = expression;
        symbol.close_parenthesis = close_parenthesis;
        symbol.start             = open_parenthesis.start;
        symbol.end               = close_parenthesis.end;
    }
});

module.exports = parser => surrounded_expression_definition.generate_new_symbol(parser);
