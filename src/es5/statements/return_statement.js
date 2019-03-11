/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : return_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-03-01
* Author      : jeefo
* Purpose     :
* Description :
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

module.exports = {
	id         : "Return statement",
	type       : "Statement",
	precedence : 31,

	is         : (token, parser) => parser.current_state === states_enum.statement,
    initialize : (symbol, current_token, parser) => {
        let asi        = true,
            end        = current_token.end,
            expression = null;
        const pre_comment = get_pre_comment(parser);

        parser.prepare_next_state("expression");
        if (parser.next_token && parser.next_token.start.line === current_token.start.line) {
            expression = parser.get_next_symbol(precedence_enum.TERMINATION);
            if (parser.next_token && parser.next_token.value === ';') {
                asi = false;
                end = parser.next_token.end;
            } else {
                end = expression.end;
            }
        }

        symbol.expression  = expression;
        symbol.ASI         = asi;
        symbol.pre_comment = pre_comment;
        symbol.start       = get_start_position(pre_comment, current_token);
        symbol.end         = end;

        parser.terminate(symbol);
    }
};
