/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : operator_definition.js
* Created at  : 2019-03-19
* Updated at  : 2019-03-19
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
      get_start_position = require("../helpers/get_start_position");

module.exports = new SymbolDefinition({
    id         : "Operator",
    type       : "Operator",
    precedence : -1,

    is         : () => {},
    initialize : (symbol, current_token, parser) => {
        let pre_comment = null;
        if (parser.current_symbol !== null && parser.current_symbol.id === "Comment") {
            pre_comment = parser.current_symbol;
        }

        symbol.pre_comment = pre_comment;
        symbol.token       = current_token;
        symbol.start       = get_start_position(pre_comment, current_token);
        symbol.end         = current_token.end;
    }
});
