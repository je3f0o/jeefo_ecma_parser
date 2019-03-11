/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : debugger_statement.js
* Created at  : 2019-03-01
* Updated at  : 2019-03-03
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
      get_pre_comment    = require("../helpers/get_pre_comment"),
      get_start_position = require("../helpers/get_start_position");

module.exports = {
	id         : "Debugger statement",
	type       : "Statement",
	precedence : 31,

	is         : (token, parser) => parser.current_state === states_enum.statement,
    initialize : (symbol, current_token, parser) => {
        let asi          = true,
            end          = current_token.end,
            post_comment = null;
        const pre_comment = get_pre_comment(parser);

        parser.prepare_next_state();
        if (parser.next_token            !== null &&
            parser.next_token.start.line === current_token.start.line) {
            if (parser.next_token.value === ';') {
                end = parser.next_token.end;
            } else {
                parser.throw_unexpected_token();
            }
        }

        symbol.ASI          = asi;
        symbol.pre_comment  = pre_comment;
        symbol.post_comment = post_comment;
        symbol.start        = get_start_position(pre_comment, current_token);
        symbol.end          = end;

        parser.terminate(symbol);
    }
};
