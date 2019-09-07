/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2019-08-19
* Updated at  : 2019-09-07
* Author      : jeefo
* Purpose     :
* Description :
* Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const is_delimiter = value => {
    return ({ next_token : token }) => {
        return token && token.id === "Delimiter" && token.value === value;
    };
};

const is_property_name = (() => {
    const literal_property_names = ["Number", "String", "Identifier"];
    return token => {
        return (
            literal_property_names.includes(token.id) || token.value === '['
        );
    };
})();

// Destructuring binding patterns
const destructuring_binding_patterns = [
    "Array binding pattern",
    "Object binding pattern",
];

module.exports = {
    is_delimiter,
    is_property_name,
    is_comma                : is_delimiter(','),
    is_colon                : is_delimiter(':'),
    is_terminator           : is_delimiter(';'),
    is_open_curly           : is_delimiter('{'),
    is_close_curly          : is_delimiter('}'),
    is_open_parenthesis     : is_delimiter('('),
    is_close_parenthesis    : is_delimiter(')'),
    is_open_square_bracket  : is_delimiter('['),
    is_close_square_bracket : is_delimiter(']'),

    is_arrow_token (token) {
        return token.id === "Arrow";
    },

    is_assign_token (token) {
        return token.id === "Operator" && token.value === '=';
    },

    is_identifier_token (token) {
        return token.id === "Identifier";
    },

    is_asterisk_token (token) {
        return token.id === "Operator" && token.value === '*';
    },

    is_reference_operator (token) {
        return token.id === "Operator" && token.value === '.';
    },

    is_operator_token (token, value) {
        return token.id === "Operator" && token.value === value;
    },

    is_delimiter_token (token, value) {
        return token.id === "Delimiter" && token.value === value;
    },

    is_identifier_name ({ next_token : token }) {
        return token && token.id === "Identifier";
    },

    is_identifier_value (token, value) {
        return token.id === "Identifier" && token.value === value;
    },

    is_destructuring_binding_pattern (node) {
        return destructuring_binding_patterns.includes(node.id);
    },

    has_no_line_terminator (last_token, next_token) {
        return last_token.end.line === next_token.start.line;
    },

    get_pre_comment (parser) {
        let pre_comment = null;
        if (parser.prev_node && parser.prev_node.id === "Comment") {
            pre_comment = parser.prev_node;
        }
        return pre_comment;
    },

    get_last_non_comment_node (parser, throw_if_not_found) {
        let i = parser.previous_nodes.length;
        while (i--) {
            if (parser.previous_nodes[i].id === "Comment") {
                continue;
            }
            return parser.previous_nodes[i];
        }

        if (throw_if_not_found) {
            parser.throw_unexpected_token("Only comments");
        }

        return null;
    },
};
