/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : if_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-03-24
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const states_enum               = require("../enums/states_enum"),
      precedence_enum           = require("../enums/precedence_enum"),
      keyword_definition        = require("../common/keyword_definition"),
      get_surrounded_expression = require("../helpers/get_surrounded_expression");

module.exports = function register_if_statement (symbol_table) {
    symbol_table.register_reserved_word("else", {
        id         : "Else statement",
        type       : "Statement",
        precedence : 31,

        is         : (current_token, parser) => parser.current_state === states_enum.if_statement,
        initialize : (symbol, current_token, parser) => {
            const keyword = keyword_definition.generate_new_symbol(parser);
            parser.prepare_next_state(null, true);

            symbol.keyword     = keyword;
            symbol.statement   = parser.get_next_symbol(precedence_enum.TERMINATION);
            symbol.start       = keyword.start;
            symbol.end         = symbol.statement.end;
        }
    });

    symbol_table.register_reserved_word("if", {
        id         : "If statement",
        type       : "Statement",
        precedence : 31,

        is         : (token, parser) => parser.current_state === states_enum.statement,
        initialize : (symbol, current_token, parser) => {
            const keyword = keyword_definition.generate_new_symbol(parser);
            let else_statement = null;

            // Surrounded expression
            parser.prepare_next_state(null, true);
            parser.expect('(', parser => parser.next_token.value === '(');
            const surrounded_expression = get_surrounded_expression(parser);

            // Statement
            parser.prepare_next_state(null, true);
            const statement = parser.get_next_symbol(precedence_enum.TERMINATION);

            // Else statement
            parser.prepare_next_state("if_statement");
            if (parser.next_symbol_definition !== null && parser.next_symbol_definition.id === "Else statement") {
                else_statement = parser.get_next_symbol(precedence_enum.TERMINATION);
            }

            symbol.keyword        = keyword;
            symbol.expression     = surrounded_expression;
            symbol.statement      = statement;
            symbol.else_statement = else_statement;
            symbol.start          = keyword.start;
            symbol.end            = else_statement ? else_statement.end : statement.end;

            parser.terminate(symbol);
        }
    });
};
