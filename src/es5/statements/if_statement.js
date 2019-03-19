/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : if_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-03-19
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
      get_pre_comment           = require("../helpers/get_pre_comment"),
      get_start_position        = require("../helpers/get_start_position"),
      get_surrounded_expression = require("../helpers/get_surrounded_expression");

module.exports = function register_if_statement (symbol_table) {
    symbol_table.register_reserved_word("else", {
        id         : "Else statement",
        type       : "Statement",
        precedence : 31,

        is         : (current_token, parser) => parser.current_state === states_enum.if_statement,
        initialize : (symbol, current_token, parser) => {
            const pre_comment = get_pre_comment(parser);
            parser.prepare_next_state(null, true);

            symbol.pre_comment = pre_comment;
            symbol.token       = current_token;
            symbol.statement   = parser.get_next_symbol(precedence_enum.TERMINATION);
            symbol.start       = get_start_position(pre_comment, current_token);
            symbol.end         = symbol.statement.end;
        }
    });

    symbol_table.register_reserved_word("if", {
        id         : "If statement",
        type       : "Statement",
        precedence : 31,

        is         : (token, parser) => parser.current_state === states_enum.statement,
        initialize : (symbol, current_token, parser) => {
            const pre_comment = get_pre_comment(parser);
            let else_statement = null;

            // Conditional expression
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

            symbol.expression     = surrounded_expression;
            symbol.statement      = statement;
            symbol.else_statement = else_statement;
            symbol.pre_comment    = pre_comment;
            symbol.start          = get_start_position(pre_comment, current_token);
            symbol.end            = else_statement ? else_statement.end : statement.end;

            parser.terminate(symbol);
        }
    });
};
