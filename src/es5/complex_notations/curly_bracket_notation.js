/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : curly_bracket_notation.js
* Created at  : 2019-01-27
* Updated at  : 2019-01-29
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

/**
 * Grammer
 * Source : https://www.ecma-international.org/ecma-262/5.1/#sec-12.4
 * 12.4 - Expression Statement
 * NOTE:
 * An ExpressionStatement cannot start with an opening curly brace because that might
 * make it ambiguous with a Block. Also, an ExpressionStatement cannot start with the
 * function keyword because that might make it ambiguous with a FunctionDeclaration.
 */

// ignore:end

const ignore_comments  = require("../helpers/ignore_comments"),
      SymbolDefinition = require("../../symbol_definition");

const COMMA_PRECEDENCE      = 1;
const TERMINATOR_PRECEDENCE = 0;

const property_symbol_definition = new SymbolDefinition({
    id         : "Object Property",
    type       : "Object Property",
    precedence : 31,
    initialize : (symbol, key, value) => {
        symbol.key   = key;
        symbol.value = value;
        symbol.start = key.start;
        symbol.end   = value.end;
    }
});

const block_statement_symbol_definition = new SymbolDefinition({
    id         : "Block statement",
    type       : "Block statement",
    precedence : 31,
    initialize : (symbol, current_token) => {
        symbol.statements = [];
        symbol.start      = current_token.start;
    }
});

module.exports = {
    id         : "Object literal",
    type       : "Object literal",
    precedence : 31,

    is             : token => token.delimiter === '{',
    initialize : (symbol, current_token, parser) => {
        const has_current_symbol = parser.current_symbol !== null;

        parser.prepare_next_symbol_definition();
        ignore_comments(parser);

        if (! has_current_symbol) {
            console.log("can be block statement");
            //process.exit();
        }

        symbol.properties = [];
        symbol.start      = current_token.start;

        LOOP:
        while (true) {
            if (parser.next_token === null) {
                parser.throw_unexpected_end_of_stream();
            }

            switch (parser.next_token.type) {
                case "Number"     :
                case "String"     :
                case "Identifier" :
                    parser.current_symbol = null;
                    const key = parser.next_symbol_definition.generate_new_symbol(parser.next_token, parser);

                    ignore_comments(parser);
                    parser.prepare_next_symbol_definition();

                    if (parser.next_token.delimiter === ':') {
                        parser.prepare_next_symbol_definition();
                        const value = parser.get_next_symbol(COMMA_PRECEDENCE);

                        const property = property_symbol_definition.generate_new_symbol(key, value);
                        symbol.properties.push(property);
                    } else {
                        parser.throw_unexpected_token();
                    }
                    break;
                default:
                    if (parser.next_token.delimiter === '}') {
                        break LOOP;
                    } else {
                        parser.throw_unexpected_token();
                    }
            }

            ignore_comments(parser);
            if (parser.next_token.delimiter === ',') {
                parser.prepare_next_symbol_definition();
            }
        }

        symbol.end = parser.next_token.end;
        parser.prepare_next_symbol_definition();
    },

    block_statement : parser => {
        const block_statement = block_statement_symbol_definition.generate_new_symbol(parser.next_token);

        parser.prepare_next_symbol_definition();

        while (true) {
            if (parser.next_token) {
                if (parser.next_token.delimiter === '}') {
                    block_statement.end = parser.next_token.end;
                    break;
                } else {
                    parser.current_symbol = null;
                    block_statement.statements.push(parser.get_next_symbol(TERMINATOR_PRECEDENCE));
                    parser.prepare_next_symbol_definition();
                }
            } else {
                parser.throw_unexpected_end_of_stream();
            }
        }

        return block_statement;
    }
};
