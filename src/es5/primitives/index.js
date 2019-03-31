/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2019-01-28
* Updated at  : 2019-03-27
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
      get_pre_comment    = require("../helpers/get_pre_comment"),
      get_start_position = require("../helpers/get_start_position");

module.exports = function register_primitives (symbol_table) {
    const skeleton_symbol_definition = {
        type       : "Primitive",
        precedence : 31,
        initialize : (symbol, current_token, parser) => {
            symbol.pre_comment = get_pre_comment(parser);
            symbol.token       = current_token;
            symbol.start       = get_start_position(symbol.pre_comment, current_token);
            symbol.end         = current_token.end;
        }
    };

    const is_primitive_factory = condition => {
        return (current_token, parser) => {
            switch (parser.current_state) {
                case states_enum.expression :
                case states_enum.expression_no_in :
                    return condition(current_token, parser);
            }
            return false;
        };
    };

    const make_primitive_definition = (() => {
        const is_primitive_keywords = is_primitive_factory(() => true);
        return id => {
            skeleton_symbol_definition.id = id;
            skeleton_symbol_definition.is = is_primitive_keywords;
            return skeleton_symbol_definition;
        };
    })();

    // Comment
    symbol_table.register_symbol_definition({
        id         : "Comment",
        type       : "Primitive",
        precedence : 32,

        is         : token => token.id === "Comment",
        initialize : (symbol, current_token, parser) => {
            let previous_comment = null;

            if (parser.current_symbol && parser.current_symbol.id === "Comment") {
                previous_comment = parser.current_symbol;
            }

            symbol.value            = current_token.comment;
            symbol.is_inline        = current_token.is_inline;
            symbol.previous_comment = previous_comment;
            symbol.start            = current_token.start;
            symbol.end              = current_token.end;
        }
    });

    // Primitive key words
    symbol_table.register_reserved_word("null"            , make_primitive_definition("Null literal"));
    symbol_table.register_reserved_word("undefined"       , make_primitive_definition("Undefined literal"));
    symbol_table.register_reserved_words(["true", "false"], make_primitive_definition("Boolean literal"));

    // Identifier
    skeleton_symbol_definition.id = "Identifier";
    skeleton_symbol_definition.is = is_primitive_factory((token, parser) => {
        return token.id                                        === "Identifier" &&
               parser.symbol_table.reserved_words[token.value] === undefined;
    });
    symbol_table.register_symbol_definition(skeleton_symbol_definition);

    // Number literal
    skeleton_symbol_definition.id = "Numeric literal";
    skeleton_symbol_definition.is = is_primitive_factory(token => token.id === "Number");
    symbol_table.register_symbol_definition(skeleton_symbol_definition);

    // String literal
    skeleton_symbol_definition.id = "String literal";
    skeleton_symbol_definition.is = is_primitive_factory(token => token.id === "String");
    symbol_table.register_symbol_definition(skeleton_symbol_definition);

    // literals
    symbol_table.register_symbol_definition(require("./array_literal"));
    symbol_table.register_symbol_definition(require("./object_literal"));
    symbol_table.register_symbol_definition(require("./regular_expression_literal"));
};
