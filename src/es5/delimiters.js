/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : delimiters.js
* Created at  : 2017-08-17
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

const get_start_position = require("./helpers/get_start_position");

module.exports = function register_delimiter_symbol_definitions (symbol_table) {
    symbol_table.register_symbol_definition({
        id         : "Delimiter",
        type       : "Delimiter",
        precedence : -1,

        is : token => {
            switch (token.value) {
                case '(' : case ')' :
                case '[' : case ']' :
                case '{' : case '}' :
                //case ',' :
                case ':' :
                    return true;
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

    symbol_table.register_symbol_definition({
        id         : "Terminator",
        type       : "Delimiter",
        precedence : -1,

        is : token => token.value === ';',
        initialize : (symbol, current_token, parser) => {
            parser.throw_unexpected_token("Terminator shouldn't be called.");
        }
    });
};
