/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : get_parameters.js
* Created at  : 2019-01-28
* Updated at  : 2019-03-11
* Author      : jeefo
* Purpose     :
* Description :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const SymbolDefinition   = require("@jeefo/parser/src/symbol_definition"),
      get_start_position = require("../helpers/get_start_position");

const parameter_symbol_definition = new SymbolDefinition({
    id         : "Parameter",
    type       : "Primitive",
    precedence : 31,
    is         : () => {},
    initialize : (symbol, current_token, parser) => {
        parser.expect("identifier", parser => parser.next_symbol_definition.id === "Identifier");
        const identifier = parser.next_symbol_definition.generate_new_symbol(parser);

        parser.prepare_next_state("expression", true);
        const post_comment = parser.current_symbol;

        symbol.identifier   = identifier;
        symbol.post_comment = post_comment;
        symbol.start        = get_start_position(identifier.pre_comment, identifier);
        symbol.end          = post_comment ? post_comment.end : identifier.end;
    }
});

const parameters_symbol_definition = new SymbolDefinition({
    id         : "Parameters",
    type       : "Notation",
    precedence : 31,
    is         : () => {},
    initialize : (symbol, current_token, parser) => {
        parser.change_state("delimiter");
        const parameters       = [];
        const open_parenthesis = parser.next_symbol_definition.generate_new_symbol(parser);

        parser.prepare_next_state("expression", true);

        while (parser.next_token.value !== ')') {
            const parameter = parameter_symbol_definition.generate_new_symbol(parser);
            parameters.push(parameter);

            if (parser.next_token.value !== ')') {
                parser.expect(',', parser => parser.next_token.value === ',');
                parser.prepare_next_state("expression", true);
            }
        }

        parser.expect(')', parser => parser.next_token.value === ')');
        parser.change_state("delimiter");
        const close_parenthesis = parser.next_symbol_definition.generate_new_symbol(parser);

        symbol.open_parenthesis  = open_parenthesis;
        symbol.parameters        = parameters;
        symbol.close_parenthesis = close_parenthesis;
        symbol.start             = get_start_position(open_parenthesis.pre_comment, current_token);
        symbol.end               = close_parenthesis.end;
    }
});

module.exports = function get_parameters (parser) {
    return parameters_symbol_definition.generate_new_symbol(parser);
};
