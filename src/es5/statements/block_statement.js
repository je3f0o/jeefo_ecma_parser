/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : block_statement.js
* Created at  : 2017-08-18
* Updated at  : 2019-03-30
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const states_enum     = require("../enums/states_enum"),
      precedence_enum = require("../enums/precedence_enum");

module.exports = {
	id         : "Block statement",
	type       : "Statement",
	precedence : 31,

    is : (token, parser) => {
        if (token.value === '{') {
            switch (parser.current_state) {
                case states_enum.statement       :
                case states_enum.block_statement :
                    return true;
            }
        }

        return false;
    },

	initialize : (symbol, current_token, parser) => {
        const statements   = [],
              is_statement = parser.current_state === states_enum.statement;

        parser.change_state("delimiter");
        const open_curly_bracket = parser.next_symbol_definition.generate_new_symbol(parser);

        parser.prepare_next_state(null, true);
		while (parser.next_token.value !== '}') {
            const statement = parser.get_next_symbol(precedence_enum.TERMINATION);
            if (! parser.is_terminated) {
                if (statement.id === "Comment") {
                    parser.terminate(statement);
                } else {
                    parser.throw_unexpected_token();
                }
            }

            statements.push(statement);
            parser.prepare_next_state(null, true);
		}

        const close_curly_bracket = parser.next_symbol_definition.generate_new_symbol(parser);

        symbol.open_curly_bracket  = open_curly_bracket;
        symbol.statements          = statements;
        symbol.close_curly_bracket = close_curly_bracket;
        symbol.start               = symbol.open_curly_bracket.start;
        symbol.end                 = symbol.close_curly_bracket.end;

        if (is_statement) {
            parser.terminate(symbol);
        }
    }
};
