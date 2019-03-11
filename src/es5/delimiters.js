/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : delimiters.js
* Created at  : 2017-08-17
* Updated at  : 2019-02-21
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

const states_enum        = require("./enums/states_enum"),
      get_pre_comment    = require("./helpers/get_pre_comment"),
      get_start_position = require("./helpers/get_start_position");

module.exports = function register_delimiter_symbol_definitions (symbol_table) {
    symbol_table.register_symbol_definition({
        id         : "Delimiter",
        type       : "Delimiter",
        precedence : -1,

        is : token => {
            switch (token.value) {
                case ':' :
                case ')' :
                case ']' :
                case '}' :
                case ',' :
                case ';' :
                    return true;
            }
            return false;
        },
        initialize : () => {}
    });

    symbol_table.register_symbol_definition({
        id         : "Open parenthesis",
        type       : "Delimiter",
        precedence : -1,

        is         : (token, parser) => parser.current_state === states_enum.delimiter && token.value === '(',
        initialize : (symbol, current_token, parser) => {
            symbol.value       = '(';
            symbol.pre_comment = get_pre_comment(parser);
            symbol.start       = get_start_position(symbol.pre_comment, current_token);
            symbol.end         = current_token.end;
        }
    });

    symbol_table.register_symbol_definition({
        id         : "Close parenthesis",
        type       : "Delimiter",
        precedence : -1,

        is         : (token, parser) => parser.current_state === states_enum.delimiter && token.value === ')',
        initialize : (symbol, current_token, parser) => {
            symbol.value       = ')';
            symbol.pre_comment = get_pre_comment(parser);
            symbol.start       = get_start_position(symbol.pre_comment, current_token);
            symbol.end         = current_token.end;
        }
    });
};
