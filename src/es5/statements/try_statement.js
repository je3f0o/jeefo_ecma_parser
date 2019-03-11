/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : try_statement.js
* Created at  : 2017-08-17
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
      get_pre_comment    = require("../helpers/get_pre_comment"),
      get_start_position = require("../helpers/get_start_position");

module.exports = function register_try_statement (symbol_table) {
    // {{{1 Catch parameter
    symbol_table.register_symbol_definition({
        id         : "Catch parameter",
        type       : "Primitive",
        precedence : 31,

        is         : (token, parser) => parser.current_state === states_enum.catch_parameter,
        initialize : (symbol, current_token, parser) => {
            parser.change_state("delimiter");
            const open_parenthesis = parser.next_symbol_definition.generate_new_symbol(parser);

            parser.prepare_next_state("expression", true);
            if (parser.next_token.value === ')') {
                parser.throw_unexpected_token("Missing identifier");
            }

            parser.expect("identifier", parser => parser.next_symbol_definition.id === "Identifier");
			const identifier = parser.next_symbol_definition.generate_new_symbol(parser);

            parser.prepare_next_state("delimiter", true);
            parser.expect(')', parser => parser.next_token.value === ')');
            const close_parenthesis = parser.next_symbol_definition.generate_new_symbol(parser);

            symbol.open_parenthesis  = open_parenthesis;
            symbol.identifier        = identifier;
            symbol.close_parenthesis = close_parenthesis;
            symbol.start             = get_start_position(open_parenthesis.pre_comment, current_token);
            symbol.end               = close_parenthesis.end;
        }
    });

    // {{{1 Catch block
    symbol_table.register_reserved_word("catch", {
        id         : "Catch block",
        type       : "Statement",
        precedence : 31,

        is         : (token, parser) => parser.current_state === states_enum.try_statement,
        initialize : (symbol, current_token, parser) => {
            const pre_comment = get_pre_comment(parser);

            // Parameter
            parser.prepare_next_state("catch_parameter", true);
            parser.expect('(', parser => parser.next_token.value === '(');
            const parameter = parser.get_next_symbol(precedence_enum.TERMINATION);

            // Block statement
            parser.prepare_next_state("block_statement", true);
            parser.expect('{', parser => parser.next_token.value === '{');
			const block = parser.next_symbol_definition.generate_new_symbol(parser);

            symbol.parameter   = parameter;
            symbol.block       = block;
            symbol.pre_comment = pre_comment;
            symbol.start       = get_start_position(pre_comment, current_token);
            symbol.end         = block.end;
        }
    });

    // {{{1 Finally block
    symbol_table.register_reserved_word("finally", {
        id         : "Finally block",
        type       : "Statement",
        precedence : 31,

        is         : (token, parser) => parser.current_state === states_enum.try_statement,
        initialize : (symbol, current_token, parser) => {
            let pre_comment = get_pre_comment(parser), block;

            parser.prepare_next_state(null, true);
            parser.expect('{', parser => parser.next_token.value === '{');
            block = parser.get_next_symbol(precedence_enum.TERMINATION);

            symbol.block       = block;
            symbol.pre_comment = pre_comment;
            symbol.start       = get_start_position(pre_comment, current_token);
            symbol.end         = block.end;
        }
    });
    // }}}1

    symbol_table.register_reserved_word("try", {
        id         : "Try statement",
        type       : "Statement",
        precedence : 31,

        is         : (token, parser) => parser.current_state === states_enum.statement,
        initialize : (symbol, current_token, parser) => {
            const pre_comment = get_pre_comment(parser);
            let handler = null, finalizer = null, block;

            parser.prepare_next_state(null, true);
            parser.expect('{', parser => parser.next_token.value === '{');
            block = parser.get_next_symbol(precedence_enum.TERMINATION);

            parser.prepare_next_state("try_statement", true);
            if (parser.next_symbol_definition !== null && parser.next_symbol_definition.id === "Catch block") {
                handler = parser.get_next_symbol(precedence_enum.TERMINATION);
                parser.prepare_next_state("try_statement");
            }

            if (parser.next_symbol_definition !== null && parser.next_symbol_definition.id === "Finally block") {
                finalizer = parser.get_next_symbol(precedence_enum.TERMINATION);
            }

            parser.expect("catch or finally after try", () => handler !== null || finalizer !== null);

            symbol.block       = block;
            symbol.handler     = handler;
            symbol.finalizer   = finalizer;
            symbol.pre_comment = pre_comment;
            symbol.start       = get_start_position(pre_comment, current_token);
            symbol.end         = finalizer ? finalizer.end : handler.end;

            if (! parser.is_terminated) {
                parser.terminate(symbol);
            }
        }
    });
};
