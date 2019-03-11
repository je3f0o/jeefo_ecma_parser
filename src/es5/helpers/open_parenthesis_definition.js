/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : open_parenthesis_definition.js
* Created at  : 2019-03-07
* Updated at  : 2019-03-11
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

const SymbolDefinition   = require("@jeefo/parser/src/symbol_definition"),
      get_pre_comment    = require("./get_pre_comment"),
      get_start_position = require("./get_start_position");

module.exports = new SymbolDefinition({
    id         : "Open parenthesis",
    type       : "Delimiter",
    precedence : -1,

    is         : () => {},
    initialize : (symbol, current_token, parser) => {
        symbol.value       = '(';
        symbol.pre_comment = get_pre_comment(parser);
        symbol.start       = get_start_position(symbol.pre_comment, current_token);
        symbol.end         = current_token.end;
    }
});
