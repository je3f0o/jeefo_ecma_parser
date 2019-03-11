/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : block_statement.js
* Created at  : 2017-08-18
* Updated at  : 2019-03-02
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const states_enum        = require("../enums/states_enum"),
      precedence_enum    = require("../enums/precedence_enum"),
      get_pre_comment    = require("../helpers/get_pre_comment"),
      get_start_position = require("../helpers/get_start_position");

module.exports = {
	id         : "Block statement",
	type       : "Statement",
	precedence : 31,

    is : (token, parser) => {
        if (token.value === '{') {
            switch (parser.current_state) {
                case states_enum.block_statement :
                    return true;
                case states_enum.statement :
                    // TODO: check make sure it's statement
                    return true;
            }
        }

        return false;
    },
	initialize : (symbol, current_token, parser) => {
        const statements  = [],
              pre_comment = get_pre_comment(parser);

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

        symbol.pre_comment = pre_comment;
        symbol.statements  = statements;
        symbol.start       = get_start_position(pre_comment, current_token);
        symbol.end         = parser.next_token.end;

        parser.terminate(symbol);
    }
};
