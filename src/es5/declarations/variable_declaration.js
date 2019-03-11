/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : variable_declaration.js
* Created at  : 2017-08-17
* Updated at  : 2019-03-11
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const states_enum        = require("../enums/states_enum"),
      precedence_enum    = require("../enums/precedence_enum"),
      get_right_value    = require("../helpers/get_right_value"),
      get_pre_comment    = require("../helpers/get_pre_comment"),
      SymbolDefinition   = require("@jeefo/parser/src/symbol_definition"),
      get_start_position = require("../helpers/get_start_position");

const variable_declarator_symbol_definition = new SymbolDefinition({
    id         : "Variable declarator",
    type       : "Declarator",
    precedence : 31,
    is         : () => {},
    initialize : (symbol, current_token, parser) => {
        parser.expect("identifier", parser => parser.next_symbol_definition.id === "Identifier");
        const identifier = parser.next_symbol_definition.generate_new_symbol(parser);
        let init         = null,
            pre_comment  = null,
            post_comment = null;

        // We don't want prepare_next_state("expression") here.
        // Because we want line termination if possible.
        // That is why we set `current_symbol = identifier` manually.
        parser.current_symbol = identifier;
        parser.prepare_next_symbol_definition();
        if (parser.next_token !== null) {
            switch (parser.next_token.value) {
                case '=' :
                    if (parser.current_symbol.id === "Comment") {
                        pre_comment = parser.current_symbol;
                    }

                    parser.prepare_next_state("expression", true);
                    parser.post_comment = null;
                    init = get_right_value(parser, precedence_enum.COMMA);
                    if (parser.next_token !== null) {
                        post_comment = parser.post_comment;
                    }
                    break;
                case ',' :
                case ';' :
                    if (parser.current_symbol.id === "Comment") {
                        post_comment = parser.current_symbol;
                    }
                    break;
                default:
                    parser.throw_unexpected_token();
            }
        }

        symbol.identifier   = identifier;
        symbol.init         = init;
        symbol.pre_comment  = pre_comment;
        symbol.post_comment = post_comment;
        symbol.start        = get_start_position(identifier.comment, identifier);
        symbol.end          = post_comment ? post_comment.end : init ? init.end : identifier.end;
    }
});

module.exports = {
    id         : "Variable declaration",
    type       : "Declaration",
    precedence : 31,

    is         : (current_token, parser) => parser.current_state === states_enum.statement,
    initialize : (symbol, current_token, parser) => {
        const declarations = [];
        let asi         = true,
            pre_comment = get_pre_comment(parser),
            declarator;

        parser.prepare_next_state("expression", true);

        LOOP:
        while (true) {
            declarator = variable_declarator_symbol_definition.generate_new_symbol(parser);
            declarations.push(declarator);

            if (parser.next_token === null) { break; }

            switch (parser.next_token.value) {
                case ',' :
                    parser.prepare_next_state("expression", true);
                    break;
                case ';' :
                    asi = false;
                    break LOOP;
                default:
                    parser.throw_unexpected_token(`Expected delimiter instead saw: ${ parser.next_token.value }`);
            }
        }

        symbol.declarations = declarations;
        symbol.pre_comment  = pre_comment;
        symbol.ASI          = asi;
        symbol.start        = get_start_position(pre_comment, current_token);
        symbol.end          = asi ? declarator.end : parser.next_token.end;

        parser.terminate(symbol);
    }
};
