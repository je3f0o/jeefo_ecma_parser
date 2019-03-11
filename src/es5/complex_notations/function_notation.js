/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : function_notation.js
* Created at  : 2019-01-27
* Updated at  : 2019-01-27
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const ignore_comments = require("../helpers/ignore_comments");

function get_parameters (parser) {
    const parameters = [];

    parser.prepare_next_symbol_definition();

    LOOP:
    while (parser.next_token && parser.next_token.delimiter !== ')') {
        ignore_comments(parser);

        if (parser.next_symbol_definition.id === "Identifier") {
            parameters.push(parser.next_symbol_definition.generate_new_symbol(parser.next_token));
            parser.prepare_next_symbol_definition();
        } else {
            parser.throw_unexpected_token();
        }

        if (! parser.next_token) {
            parser.throw_unexpected_end_of_stream();
        }

        ignore_comments(parser);

        switch (parser.next_token.delimiter) {
            case ')' :
                parser.prepare_next_symbol_definition();
                break LOOP;
            case ',' :
                parser.prepare_next_symbol_definition();
                break;
            default:
                parser.throw_unexpected_token();
        }
    }

    return parameters;
}

module.exports = {
    id         : "Function expression",
    precedence : 31,

    is         : token => token.name === "function",
    initialize : (symbol, current_token, parser) => {
        const is_function_declaration = parser.current_symbol === null;
        if (is_function_declaration) {
            symbol.id = "Function delcaration";
        }

        parser.prepare_next_symbol_definition();
        ignore_comments(parser);

        if (parser.next_token.type === "Identifier") {
            symbol.name = parser.next_symbol_definition.generate_new_symbol(parser.next_token, parser);
            parser.prepare_next_symbol_definition();
        } else if (! is_function_declaration) {
            symbol.name = null;
        } else {
            parser.throw_unexpected_token();
        }

        ignore_comments(parser);

        if (parser.next_token.delimiter === '(') {
            symbol.parameters = get_parameters(parser);
        } else {
            parser.throw_unexpected_token();
        }

        ignore_comments(parser);

        if (parser.next_token.delimiter === '{') {
            symbol.body  = parser.next_symbol_definition.block_statement(parser);
            symbol.start = current_token.start;
            symbol.end   = symbol.body.end;
        } else {
            parser.throw_unexpected_token();
        }

        if (is_function_declaration) {
            parser.terminate();
        }
    },
};
