/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2019-08-19
* Updated at  : 2020-09-08
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

// Factory methods
// ===============

// Bind for token
//const bind_token = (binding_id, binding_value) => ({id, value}) =>
    //id === binding_id && value === binding_value;

const compare_token_id = binding_id => ({id}) => id === binding_id;

const bind_token_id = binding_id => ({id, value}, input_value) =>
    id === binding_id && value === input_value;
const bind_operator_token   = bind_token_id("Operator");
const bind_delimiter_token  = bind_token_id("Delimiter");
const bind_identifier_token = bind_token_id("Identifier");

// Bind for parser
//const bind_parser = (binding_id, binding_value) => parser =>
    //bind_token(binding_id, binding_value)(parser.next_token || {});

const compare_parser_id = binding_id => ({next_token}) =>
    next_token && next_token.id === binding_id;

const bind_parser_id = binding_id => binding_value => parser =>
    bind_token_id(binding_id)(parser.next_token || {}, binding_value);

const bind_parser_operator  = bind_parser_id("Operator");
const bind_parser_delimiter = bind_parser_id("Delimiter");

// Destructuring binding patterns
const destructuring_binding_patterns = [
    "Array binding pattern",
    "Object binding pattern",
];

let validate_object_literal, validate_object_literals;

validate_object_literal = (properties, parser) => {
    for (const {expression: property} of properties) {
        switch (property.id) {
            case "Cover initialized name":
                parser.throw_unexpected_token(
                    "Invalid shorthand property initializer",
                    property
                );
                break;
            case "Method definition":
            case "Identifier reference":
                break;
            case "Property assignment":
                validate_object_literals(property.expression, parser);
                break;
            default:
                parser.throw_unexpected_token(
                    `Invalid '${property.constructor.name}'`, property
                );
        }
    }
};

validate_object_literals = (expr, parser) => {
    switch (expr.id) {
        case "Object literal" :
            validate_object_literal(expr.property_definition_list, parser);
            break;
        case "Assignment expression" :
            validate_object_literals(expr.expression, parser);
            break;
        case "Expression" :
        case "Assignment operator" :
            validate_object_literals(expr.right, parser);
            validate_object_literals(expr.left, parser);
            break;
        default:
            // Silently ignored
            //console.log(expr);
            //debugger
    }
};

module.exports = {
    assert (condition, error_node) {
        if (! condition) throw error_node;
    },

    // Token methods
    is_arrow_token      : compare_token_id("Arrow"),
    is_assign_token     : token => bind_operator_token(token, '='),
    is_asterisk_token   : token => bind_operator_token(token, '*'),
    is_terminator_token : token => bind_delimiter_token(token, ';'),

    is_operator_token  : bind_operator_token,
    is_delimiter_token : bind_delimiter_token,
    is_identifier_token: bind_identifier_token,

    // Parser methods
    is_dot                  : bind_parser_operator('.'),
    is_rest                 : compare_parser_id("Rest"),
    is_comma                : bind_parser_delimiter(','),
    is_colon                : bind_parser_delimiter(':'),
    is_arrow                : compare_parser_id("Arrow"),
    is_assign               : bind_parser_operator('='),
    is_delimiter            : compare_parser_id("Delimiter"),
    is_identifier           : compare_parser_id("Identifier"),
    is_terminator           : bind_parser_delimiter(';'),
    is_open_curly           : bind_parser_delimiter('{'),
    is_close_curly          : bind_parser_delimiter('}'),
    is_open_parenthesis     : bind_parser_delimiter('('),
    is_close_parenthesis    : bind_parser_delimiter(')'),
    is_open_square_bracket  : bind_parser_delimiter('['),
    is_close_square_bracket : bind_parser_delimiter(']'),

    is_labelled_function: ({id, item}) =>
        id      === "Labelled statement" &&
        item.id === "Function declaration",

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
            if (parser.previous_nodes[i].id === "Comment") continue;
            return parser.previous_nodes[i];
        }

        if (throw_if_not_found) {
            const exception = parser.next_token ? "token" : "end_of_stream";
            parser[`throw_unexpected_${exception}`]();
        }
        return null;
    },

    validate_object_literals,
};
