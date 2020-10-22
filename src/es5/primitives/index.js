/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2019-01-28
* Updated at  : 2020-09-08
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const {expression}         = require("../enums/states_enum");
const {get_pre_comment}    = require("../../helpers");
const {PRIMITIVE, COMMENT} = require("../enums/precedence_enum");

module.exports = function register_primitives (ast_node_table) {
    // Primitive key words
    const keyword_definition = {
        type       : "Primary expression",
        precedence : PRIMITIVE,
        is         : (_, {current_state: s}) => s === expression,
        initialize : (node, token, parser) => {
            node.pre_comment = get_pre_comment(parser);
            node.value       = token.value;
            node.start       = token.start;
            node.end         = token.end;
        }
    };

    [
        {
            id    : "Null literal",
            value : "null",
        },
        {
            id    : "Undefined",
            value : "undefined",
        },
        {
            id    : "Boolean literal",
            value : ["true", "false"],
        },
    ].forEach(({id, value}) => {
        keyword_definition.id = id;
        if (Array.isArray(value)) {
            ast_node_table.register_reserved_words(value, keyword_definition);
        } else {
            ast_node_table.register_reserved_word(value, keyword_definition);
        }
    });

    // Comment
    ast_node_table.register_node_definition({
        id         : "Comment",
        type       : "Comment",
        precedence : COMMENT,

        is         : ({id}) => id === "Comment",
        initialize : (node, token, parser) => {
            let previous_comment = null;
            if (parser.prev_node && parser.prev_node.id === "Comment") {
                previous_comment = parser.prev_node;
            }

            node.previous_comment = previous_comment;
            node.value            = token.comment;
            node.is_inline        = token.is_inline;
            node.start            = token.start;
            node.end              = token.end;
        }
    });

    // literals
    const literal_paths = [
        "./string_definition",
        "./numeric_definition",
        "./identifier_definition",
        "./regular_expression_literal",
    ];
    literal_paths.forEach(path => {
        ast_node_table.register_node_definition(require(path));
    });
};
