/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : expression_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-03-30
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const states_enum     = require("../enums/states_enum"),
      precedence_enum = require("../enums/precedence_enum"),
      get_right_value = require("../helpers/get_right_value");

const expression_delimiters = ['[', '('];
const expression_keywords = [
    "new",
    "void",
    "delete",
    "typeof",

    "null",
    "true",
    "false",
    "undefined",
];
const unary_expressions = [ "~", "!", "+", "-", "++", "--" ];

module.exports = {
    id         : "Expression statement",
    type       : "Statement",
    precedence : 40,

    is : (token, parser) => {
        switch (parser.current_state) {
            case states_enum.statement :
                switch (token.id) {
                    case "Slash"  :
                    case "String" :
                    case "Number" :
                        return true;
                    case "Identifier" :
                        if (expression_keywords.includes(token.value)) {
                            return true;
                        }
                        return parser.symbol_table.reserved_words[token.value] === undefined;
                    case "Delimiter" :
                        return expression_delimiters.includes(token.value);
                    case "Operator" :
                        return unary_expressions.includes(token.value);
                }
                break;
        }
        return false;
    },

    initialize : (symbol, current_token, parser) => {
        let terminator = null;
        const is_individual_block_statement = parser.current_state === states_enum.statement;

        parser.change_state("expression");

        // Labelled statement
        if (parser.next_symbol_definition.id === "Identifier") {
            parser.current_symbol   = parser.next_symbol_definition.generate_new_symbol(parser);
            parser.previous_symbols = [parser.current_symbol];
            parser.prepare_next_symbol_definition();

            if (parser.next_token !== null && parser.next_token.value === ':') {
                symbol.identifier = parser.current_symbol;
                symbol.delimiter  = parser.next_symbol_definition.generate_new_symbol(parser);
                return parser.change_state("labelled_statement");
            }
        }

        parser.post_comment = null;
        const expression = get_right_value(parser, precedence_enum.TERMINATION);
        parser.current_symbol = parser.post_comment;

        if (parser.next_token !== null && parser.next_token.value === ';') {
            parser.change_state("delimiter");
            terminator = parser.next_symbol_definition.generate_new_symbol(parser);
        }

        symbol.expression = expression;
        symbol.terminator = terminator;
        symbol.start      = expression.start;
        symbol.end        = terminator ? terminator.end : expression.end;

        if (is_individual_block_statement) {
            parser.terminate(symbol);
        }
    }
};
