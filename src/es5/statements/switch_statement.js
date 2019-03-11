/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : switch_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-03-11
* Author      : jeefo
* Purpose     :
* Description :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const states_enum               = require("../enums/states_enum"),
      precedence_enum           = require("../enums/precedence_enum"),
      SymbolDefinition          = require("@jeefo/parser/src/symbol_definition"),
      get_pre_comment           = require("../helpers/get_pre_comment"),
      get_start_position        = require("../helpers/get_start_position"),
      get_surrounded_expression = require("../helpers/get_surrounded_expression");

const case_block_definition = new SymbolDefinition({
    id         : "Case block",
    type       : "Statement",
    precedence : 31,

    is         : () => {},
    initialize : (symbol, current_token, parser) => {
        const pre_comment  = get_pre_comment(parser),
              case_clauses = [];

        parser.prepare_next_state(null, true);
        while (parser.next_token.value !== '}') {
            if (parser.next_token.id !== "Identifier") {
                parser.throw_unexpected_token();
            }

            switch (parser.next_token.value) {
                case "case" :
                    parser.change_state("case_clause");
                    break;
                case "default" :
                    parser.change_state("default_clause");
                    break;
                default:
                    parser.throw_unexpected_token();
            }
            case_clauses.push(parser.next_symbol_definition.generate_new_symbol(parser));
        }

        symbol.case_clauses = case_clauses;
        symbol.pre_comment  = pre_comment;
        symbol.start        = get_start_position(pre_comment, current_token);
        symbol.end          = parser.next_token.end;
    }
});

module.exports = function register_switch_statement (symbol_table) {
    symbol_table.register_reserved_word("case", {
        id         : "Case clause",
        type       : "Statement",
        precedence : 31,

        is         : (token, parser) => parser.current_state === states_enum.case_clause,
        initialize : (symbol, current_token, parser) => {
            const statements  = [],
                  pre_comment = get_pre_comment(parser);

            parser.prepare_next_state("expression", true);
            const expression = parser.get_next_symbol(precedence_enum.TERMINATION);
            if (parser.next_token === null) {
                parser.throw_unexpected_end_of_stream();
            }
            parser.expect(':', parser => parser.next_token.value === ':');
            let end = parser.next_token.end;

            parser.prepare_next_state(null, true);
            while (true) {
                let is_statement = parser.next_token.id !== "Identifier" ||
                     ! ["case", "default"].includes(parser.next_token.value);

                is_statement &= parser.next_token.value !== '}';

                if (is_statement) {
                    const statement = parser.get_next_symbol(precedence_enum.TERMINATION);
                    end = statement.end;
                    statements.push(statement);

                    parser.prepare_next_state(null, true);
                } else {
                    break;
                }
            }

            symbol.expression  = expression;
            symbol.statements  = statements;
            symbol.pre_comment = pre_comment;
            symbol.start       = get_start_position(pre_comment, current_token);
            symbol.end         = end;
        }
    });

    symbol_table.register_reserved_word("default", {
        id         : "Default clause",
        type       : "Statement",
        precedence : 31,

        is         : (token, parser) => parser.current_state === states_enum.default_clause,
        initialize : (symbol, current_token, parser) => {
            const statements  = [],
                  pre_comment = get_pre_comment(parser);

            parser.prepare_next_state(null, true);
            parser.expect(':', parser => parser.next_token.value === ':');
            let end = parser.next_token.end;

            parser.prepare_next_state(null, true);
            while (true) {
                let is_statement = parser.next_token.id !== "Identifier" ||
                     ! ["case", "default"].includes(parser.next_token.value);

                is_statement &= parser.next_token.value !== '}';

                if (is_statement) {
                    const statement = parser.get_next_symbol(precedence_enum.TERMINATION);
                    end = statement.end;
                    statements.push(statement);

                    parser.prepare_next_state(null, true);
                } else {
                    break;
                }
            }

            symbol.statements  = statements;
            symbol.pre_comment = pre_comment;
            symbol.start       = get_start_position(pre_comment, current_token);
            symbol.end         = end;
        }
    });

    symbol_table.register_reserved_word("switch", {
        id         : "Switch statement",
        type       : "Statement",
        precedence : 31,

        is         : (token, parser) => parser.current_state === states_enum.statement,
        initialize : (symbol, current_token, parser) => {
            const pre_comment = get_pre_comment(parser);

            parser.prepare_next_state(null, true);
            parser.expect('(', parser => parser.next_token.value === '(');
            const expression = get_surrounded_expression(parser);

            parser.prepare_next_state(null, true);
            parser.expect('{', parser => parser.next_token.value === '{');
            const case_block = case_block_definition.generate_new_symbol(parser);

            symbol.expression  = expression;
            symbol.case_block  = case_block;
            symbol.pre_comment = pre_comment;
            symbol.start       = get_start_position(pre_comment, current_token);
            symbol.end         = case_block.end;

            parser.terminate(symbol);
        }
    });
};
