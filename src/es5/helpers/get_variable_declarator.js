/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : get_variable_declarator.js
* Created at  : 2019-03-15
* Updated at  : 2019-03-29
* Author      : jeefo
* Purpose     : Hiding long named variables and make it simple short named
*             : function for easier to use.
* Description :
* Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const SymbolDefinition        = require("@jeefo/parser/src/symbol_definition"),
      precedence_enum         = require("../enums/precedence_enum"),
      operator_definition     = require("../common/operator_definition"),
      get_right_value         = require("./get_right_value"),
      get_start_position      = require("./get_start_position"),
      prepare_next_expression = require("./prepare_next_expression");

// {{{1 variable_declarator_symbol_definition
const variable_declarator_symbol_definition = new SymbolDefinition({
    id         : "Variable declarator",
    type       : "Declarator",
    precedence : 31,

    is         : () => {},
    initialize : (symbol, current_token, parser) => {
        const identifier = parser.current_symbol;

        let init         = null,
            operator     = null,
            post_comment = null;

        if (parser.next_token === identifier.token) {
            parser.prepare_next_symbol_definition();
        }

        if (parser.next_token !== null) {
            switch (parser.next_token.value) {
                case '=' :
                    if (parser.current_symbol !== null && parser.current_symbol.id === "Identifier") {
                        parser.current_symbol = null;
                    }
                    operator = operator_definition.generate_new_symbol(parser);

                    prepare_next_expression(parser, true);

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
        symbol.initializer  = init;
        symbol.operator     = operator;
        symbol.post_comment = post_comment;
        symbol.start        = get_start_position(identifier.comment, identifier);
        symbol.end          = post_comment ? post_comment.end : init ? init.end : identifier.end;
    }
});
// }}}1

function get_variable_declarator (parser) {
    if (parser.current_symbol === null || parser.current_symbol.id === "Comment") {
        parser.expect("identifier", parser => parser.next_symbol_definition.id === "Identifier");
        parser.current_symbol = parser.next_symbol_definition.generate_new_symbol(parser);
    }

    return variable_declarator_symbol_definition.generate_new_symbol(parser);
}

module.exports = get_variable_declarator;
