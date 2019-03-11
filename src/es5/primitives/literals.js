/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : literals.js
* Created at  : 2017-08-17
* Updated at  : 2019-01-29
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

//var literals = ["null", "array", "number", "string", "regexp", "object", "boolean"];

const primitive_initiliazer = require("./initiliazer");

const COMMA_PRECEDENCE = 1;

module.exports = [
    // {{{1 Number literal
    {
        id         : "Number",
        precedence : 31,

        is         : token => token.type === "Number",
        initialize : (symbol, current_token, parser) => {
            symbol.value = current_token.value;
            primitive_initiliazer(symbol, current_token, parser);
        }
    },

    // {{{1 Array literal
    {
        id         : "Array",
        precedence : 31,

        is         : token => token.delimiter === '[',
        initialize : (symbol, current_token, parser) => {
            symbol.elements = [];
            symbol.start    = current_token.start;

            parser.prepare_next_symbol_definition();
            let next_symbol = parser.get_next_symbol(COMMA_PRECEDENCE);

            LOOP:
            while (next_symbol) {
                symbol.elements.push(next_symbol);

                if (parser.next_token) {
                    switch (parser.next_token.delimiter) {
                        case ',' :
                            parser.prepare_next_symbol_definition();
                            next_symbol = parser.get_next_symbol(COMMA_PRECEDENCE);
                            break;
                        case ']' :
                            break LOOP;
                        default:
                            throw new Error("Missing ] in array list");
                    }
                }
            }

            symbol.end = parser.next_token.end;
            parser.prepare_next_symbol_definition();
        }
    },

    // {{{1 String literal
    {
        id         : "String",
        precedence : 31,

        is         : token => token.type === "String",
        initialize : (symbol, current_token, parser) => {
            symbol.quote = current_token.quote;
            symbol.value = current_token.value;
            primitive_initiliazer(symbol, current_token, parser);
        }
    },
    // }}}1
];
