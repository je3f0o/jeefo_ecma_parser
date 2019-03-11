/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : labelled_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-03-04
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-12.12
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
    id         : "Labelled statement",
    type       : "Statement",
    precedence : 31,

    is         : (token, parser) => parser.current_state === states_enum.labelled_statement,
    initialize : (symbol, current_token, parser) => {
        parser.change_state("expression");

        const pre_comment = get_pre_comment(parser),
              identifier  = parser.next_symbol_definition.generate_new_symbol(parser);

        parser.prepare_next_symbol_definition();
        parser.expect(':', parser => parser.next_token.value === ':');

        parser.prepare_next_state(null, true);
        const statement = parser.get_next_symbol(precedence_enum.TERMINATION);

        symbol.identifier  = identifier;
        symbol.statement   = statement;
        symbol.pre_comment = pre_comment;
        symbol.start       = get_start_position(pre_comment, current_token);
        symbol.end         = statement.end;
    }
};
