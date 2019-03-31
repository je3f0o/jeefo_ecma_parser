/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : delimiters.js
* Created at  : 2017-08-17
* Updated at  : 2019-03-29
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
      get_start_position = require("./helpers/get_start_position");

module.exports = function register_delimiter_symbol_definitions (symbol_table) {
    symbol_table.register_symbol_definition({
        id         : "Delimiter",
        type       : "Delimiter",
        precedence : -1,

        is : (token, parser) => {
            switch (token.value) {
                case '(' : case ')' :
                case '[' : case ']' :
                case '{' : case '}' :
                case ':' : case ';' :
                    return true;
                case ',' :
                    return parser.current_state === states_enum.delimiter;
            }
            return false;
        },
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
};
