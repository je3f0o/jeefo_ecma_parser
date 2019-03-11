/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : with_statement.js
* Created at  : 2019-03-04
* Updated at  : 2019-03-04
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-12.10
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
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

module.exports = {
    id         : "Labelled statement",
    type       : "Statement",
    precedence : 31,

    is         : (token, parser) => parser.current_state === states_enum.statement,
    initialize : (symbol, current_token, parser) => {
        const pre_comment = get_pre_comment(parser);

        parser.prepare_next_state("expression", true);
        parser.expect('(', parser => parser.next_token.value === '(');
        const expression = get_surrounded_expression(parser);

        parser.prepare_next_state(null, true);
        const statement = parser.get_next_symbol(precedence_enum.TERMINATION);

        symbol.expression  = expression;
        symbol.statement   = statement;
        symbol.pre_comment = pre_comment;
        symbol.start       = get_start_position(pre_comment, current_token);
        symbol.end         = statement.end;
    }
};
