/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : object_literal.js
* Created at  : 2019-08-21
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

const { EXPRESSION }                     = require("../enums/precedence_enum");
const { expression, primary_expression } = require("../enums/states_enum");
const {
    is_close_curly,
    is_assign_token,
    is_delimiter_token,
    get_last_non_comment_node,
} = require("../../helpers");

const nested_literals_tree = [
    "Assignment expression",
    "Primary expression"
];
let validate_expression, validate_array_literal, validate_object_literal;

const has_validation_required = context_stack => {
    if (context_stack.length === 0) {
        return true;
    }
    return context_stack[context_stack.length - 1] !== "Object literal";
};

validate_expression = (node, parser) => {
    switch (node.id) {
        case "Primary expression" :
        case "Assignment expression" :
            validate_expression(node.expression, parser);
            break;
        case "Literal" :
            break;
        case "Object literal" :
            validate_object_literal(node.property_definition_list, parser);
            break;
        default:
            if (node.type === "Binary operator") {
                validate_expression(node.left, parser);
                validate_expression(node.right, parser);
            } else {
                parser.throw_unexpected_token(
                    `Unimplemented '${
                        node.id
                    }' expression: validate_expression`,
                    node
                );
            }
    }
};

validate_array_literal = (elements, parser) => {
    elements.forEach(({ expression }) => {
        validate_expression(expression, parser);
    });
};

validate_object_literal = (properties, parser) => {
    properties.forEach(({ definition }) => {
        switch (definition.id) {
            case "Cover initialized name":
                parser.throw_unexpected_token(
                    "Invalid shorthand property initializer",
                    definition
                );
                break;
            case "Property assignment":
                let node = definition.expression;
                for (let id of nested_literals_tree) {
                    if (node.id === id) {
                        node = node.expression;
                    } else {
                        break;
                    }
                }

                switch (node.id) {
                    case "Array literal" :
                        validate_array_literal(
                            node.element_list, parser
                        );
                        break;
                    case "Object literal" :
                        validate_object_literal(
                            node.property_definition_list, parser
                        );
                        break;
                }
                break;
        }
    });
};

module.exports = {
    id         : "Object literal",
    type       : "Expression",
    precedence : EXPRESSION,

    is (token, parser) {
        if (parser.current_state !== expression) { return; }
        if (is_delimiter_token(token, '{')) {
            return get_last_non_comment_node(parser) === null;
        }
    },
    initialize (node, token, parser) {
        const list              = [];
        const delimiters        = [];
        const { context_stack } = parser;
        context_stack.push(node.id);

        parser.change_state("punctuator");
        const open = parser.generate_next_node();
        parser.prepare_next_state("property_definition", true);
        while (! is_close_curly(parser)) {
            list.push(parser.generate_next_node());

            if (parser.next_token === null) {
                parser.throw_unexpected_end_of_stream();
            }

            if (is_delimiter_token(parser.next_token, ',')) {
                parser.change_state("punctuator");
                delimiters.push(parser.generate_next_node());

                parser.prepare_next_state("property_definition", true);
            }
        }
        parser.change_state("punctuator");
        const close = parser.generate_next_node();

        node.open_curly_bracket       = open;
        node.property_definition_list = list;
        node.delimiters               = delimiters;
        node.close_curly_bracket      = close;
        node.start                    = open.start;
        node.end                      = close.end;

        parser.current_state = primary_expression;
        context_stack.pop();

        if (has_validation_required(context_stack)) {
            const next_token = parser.look_ahead();
            if (! next_token || ! is_assign_token(next_token)) {
                validate_object_literal(list, parser);
            }
        }
    }
};
