/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2019-01-28
* Updated at  : 2019-08-28
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { is_expression }      = require("../helpers");
const { get_pre_comment }    = require("../../helpers");
const { PRIMITIVE, COMMENT } = require("../enums/precedence_enum");

module.exports = function register_primitives (ast_node_table) {
    // Primitive key words
    const keyword_definition = {
        type       : "Primitive",
        precedence : PRIMITIVE,
        is         : (token, parser) => is_expression(parser),
        initialize : (node, current_token, parser) => {
            node.pre_comment = get_pre_comment(parser);
            node.value       = current_token.value;
            node.start       = current_token.start;
            node.end         = current_token.end;
        }
    };

    const primitive_keywords = [
        {
            id    : "Null literal",
            value : "null",
        },
        {
            id    : "Undefined literal",
            value : "undefined",
        },
        {
            id     : "Boolean literal",
            values : ["true", "false"],
        },
    ];
    primitive_keywords.forEach(keyword => {
        keyword_definition.id = keyword.id;
        if (keyword.value) {
            ast_node_table.register_reserved_word(
                keyword.value, keyword_definition
            );
        } else {
            ast_node_table.register_reserved_words(
                keyword.values, keyword_definition
            );
        }
    });

    // Comment
    ast_node_table.register_node_definition({
        id         : "Comment",
        type       : "Primitive",
        precedence : COMMENT,

        is         : token => token.id === "Comment",
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
