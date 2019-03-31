/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : empty_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-03-31
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
      get_pre_comment    = require("../helpers/get_pre_comment"),
      get_start_position = require("../helpers/get_start_position");

module.exports = {
    id         : "Empty statement",
    type       : "Statement",
    precedence : 1,

    is         : (token, parser) => token.value === ';' && parser.current_state === states_enum.statement,
    initialize : (symbol, current_token, parser) => {
        symbol.pre_comment = get_pre_comment(parser);
        symbol.token       = current_token;
        symbol.start       = get_start_position(symbol.pre_comment, current_token);
        symbol.end         = current_token.end;

        parser.terminate(symbol);
    }
};
