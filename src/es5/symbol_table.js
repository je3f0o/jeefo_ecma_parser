/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : symbol_table.js
* Created at  : 2017-08-16
* Updated at  : 2019-03-11
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const states_enum        = require("./enums/states_enum"),
      SymbolTable        = require("@jeefo/parser/src/symbol_table"),
      get_pre_comment    = require("./helpers/get_pre_comment"),
      get_start_position = require("./helpers/get_start_position");

const symbol_table = new SymbolTable();

symbol_table.register_symbol_definition({
    id         : "Empty statement",
    type       : "Statement",
    precedence : 1,

    is         : (token, parser) => parser.current_state === states_enum.statement && token.value === ';',
    initialize : (symbol, current_token, parser) => {
        symbol.pre_comment = get_pre_comment(parser);
        symbol.start       = get_start_position(symbol.pre_comment, current_token);
        symbol.end         = current_token.end;

        parser.terminate(symbol);
    }
});

symbol_table.register_symbol_definition({
    id         : "Sequence expression",
    type       : "Expression",
    precedence : 1,

    is         : (token, parser) => parser.current_state === states_enum.expression && token.value === ',',
    initialize : () => {
        throw new Error("Should not be initialized until implement SequenceExpression.");
    }
});

require("./delimiters")(symbol_table);
require("./operators")(symbol_table);
require("./primitives")(symbol_table);
require("./declarations")(symbol_table);
//require("./complex_notations")(es5_symbol_table);
require("./expressions")(symbol_table);
require("./statements")(symbol_table);

module.exports = symbol_table;
