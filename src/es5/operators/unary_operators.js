/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : unary_operators.js
* Created at  : 2019-01-28
* Updated at  : 2019-01-28
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const capitalize = require("jeefo_utils/string/capitalize");

module.exports = function register_unary_operators (symbol_table) {
    symbol_table.register_reserved_word("new", {
		id         : "New expression",
        type       : "Unary expression",
        precedence : 18,
        initialize : (symbol, current_token, parser) => {
            parser.prepare_next_symbol_definition();
            if (parser.next_token === null) {
                parser.throw_unexpected_end_of_stream();
            }

            const callee = parser.get_next_symbol(symbol.precedence);
            if (callee.id === "Function call expression") {
                symbol.precedence = 19;
            }

            symbol.operator = "new";
            symbol.callee   = callee;
            symbol.start    = current_token.start;
            symbol.end      = symbol.callee.end;
        }
    });

    const expression_definition = {
        type       : "Unary expression",
        precedence : 16,
        initialize : (symbol, current_token, parser) => {
            parser.prepare_next_symbol_definition();
            if (parser.next_token === null) {
                parser.throw_unexpected_end_of_stream();
            }

            symbol.operator  = current_token.name;
            symbol.argument  = parser.get_next_symbol(symbol.precedence);
            symbol.is_prefix = true;
            symbol.start     = current_token.start;
            symbol.end       = symbol.argument.end;
        }
    };

    ["void", "typeof", "delete"].forEach(keyword => {
        expression_definition.id = `${ capitalize(keyword) } expression`;
        symbol_table.register_reserved_word(keyword, expression_definition);
    });

    symbol_table.register_symbol_definition({
		id         : "unnamed operator",
        type       : "Unary operator",
        precedence : 17,

        is : (token, parser) => {
            switch (token.operator) {
                case "++" :
                case "--" :
                    /* TODO: implement
                    if (left.start.line !== scope.current_token.start.line) {
                        scope.current_token.error();
                    }
                    */
                    return parser.current_symbol !== null && parser.current_symbol.type !== "Binary operator";
            }
            return false;
        },

        initialize : (symbol, current_token, parser) => {
            symbol.id        = `Post ${ current_token.operator === "++" ? "increment" : "decrement" } operator`;
            symbol.operator  = current_token.operator;
            symbol.argument  = parser.current_symbol;
            symbol.is_prefix = false;
            symbol.start     = current_token.start;
            symbol.end       = symbol.argument.end;
        }
    });

    symbol_table.register_symbol_definition({
		id         : "unnamed operator",
        type       : "Unary operator",
        precedence : 16,

        is : (token, parser) => {
            switch (token.operator) {
                case '!'  :
                case '~'  :
                case "++" :
                case "--" :
                    return true;
                case '+' :
                case '-' :
                    return parser.current_symbol === null || parser.current_symbol.type === "Binary operator";
            }
            return false;
        },

        initialize : (symbol, current_token, parser) => {
            switch (current_token.operator) {
                case '!'  :
                    symbol.id = "Logical not operator";
                    break;
                case '~'  :
                    symbol.id = "Bitwise not operator";
                    break;
                case "++" :
                    symbol.id = "Pre increment operator";
                    break;
                case "--" :
                    symbol.id = "Pre decrement operator";
                    break;
                case '+' :
                    symbol.id = "Positive plus operator";
                    break;
                case '-' :
                    symbol.id = "Negation minus operator";
                    break;
            }

            if (parser.next_token === null) {
                parser.throw_unexpected_end_of_stream();
            }

            symbol.operator = current_token.operator;

            parser.current_symbol = symbol;
            parser.prepare_next_symbol_definition();
            symbol.argument = parser.get_next_symbol(symbol.precedence);

            symbol.is_prefix = true;
            symbol.start     = current_token.start;
            symbol.end       = symbol.argument.end;
        }
    });
};
