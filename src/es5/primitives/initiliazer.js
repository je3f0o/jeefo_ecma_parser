/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : initiliazer.js
* Created at  : 2019-01-29
* Updated at  : 2019-02-02
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const get_start_position      = require("../helpers/get_start_position"),
      value_symbol_definition = require("./value_symbol_definition");

module.exports = (symbol, current_token, parser) => {
    let pre_comment = null;
    if (parser.current_symbol) {
        if (parser.current_symbol.id === "Comment") {
            pre_comment = parser.current_symbol;
        } else {
            parser.throw_unexpected_token();
        }
    }

    symbol.value       = value_symbol_definition.generate_new_symbol(current_token);
    symbol.pre_comment = pre_comment;
    symbol.start       = get_start_position(pre_comment) || current_token.start;
    symbol.end         = current_token.end;
};
