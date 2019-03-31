/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : labelled_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-03-30
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

const states_enum     = require("../enums/states_enum"),
      precedence_enum = require("../enums/precedence_enum");

module.exports = {
    id         : "Labelled statement",
    type       : "Statement",
    precedence : 31,

    is         : (token, parser) => parser.current_state === states_enum.labelled_statement,
    initialize : (symbol, current_token, parser) => {
        const identifier = parser.current_symbol.identifier,
              delimiter  = parser.current_symbol.delimiter;

        parser.prepare_next_state(null, true);
        const statement = parser.get_next_symbol(precedence_enum.TERMINATION);

        symbol.identifier = identifier;
        symbol.delimiter  = delimiter;
        symbol.statement  = statement;
        symbol.start      = identifier.start;
        symbol.end        = statement.end;
    }
};
