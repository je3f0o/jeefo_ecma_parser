/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : init_variable_declarator.js
* Created at  : 2019-03-14
* Updated at  : 2019-03-15
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

const precedence_enum    = require("../enums/precedence_enum"),
      get_right_value    = require("./get_right_value"),
      get_start_position = require("./get_start_position");

module.exports = function init_variable_declaration (symbol, identifier, parser) {
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
};
