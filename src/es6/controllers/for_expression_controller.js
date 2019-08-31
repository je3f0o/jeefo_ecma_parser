/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_expression_controller.js
* Created at  : 2019-08-29
* Updated at  : 2019-09-01
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

const { AST_Node_Definition }           = require("@jeefo/parser");
const { EXPRESSION, TERMINATION }       = require("../enums/precedence_enum");
const {
    expression_no_in,
    for_in_expression,
    for_of_expression,
    for_iterator_header,
    for_header_controller
} = require("../enums/states_enum");
const {
    is_assign,
    is_terminator,
    is_identifier_value,
    parse_asignment_expression,
} = require("../../helpers");

const for_of_init_error = (
    "for-of loop variable declaration may not have an initializer."
);

const has_terminal = (() => {
    const terminal_words = ["var", "let", "const"];

    return token => {
        if (token.id === "Identifier") {
            return terminal_words.includes(token.value);
        }
    };
})();

const for_declaration = new AST_Node_Definition({
    id         : "For declaration",
    type       : "Declaration",
    precedence : -1,

    is         : () => {},
    initialize : (node, token, parser) => {
        const { keyword, lvalue } = parser.prev_node;

        node.keyword = keyword;
        node.binding = lvalue;
        node.start   = keyword.start;
        node.end     = lvalue.end;
    }
});

function parse_for_left_expression (keyword, lvalue, parser) {
    if (keyword) {
        parser.prev_node = { keyword, lvalue };

        if (keyword.value === "var") {
            if (lvalue.id === "Identifier" && is_assign(parser.next_token)) {
                parser.set_prev_node(lvalue);
                parser.change_state("expression_no_in");

                parser.throw_not_found = false;
                const expression = parse_asignment_expression(parser);
                parser.throw_not_found = true;

                parser.prev_node = { keyword, expression };
                return variable_declaration_no_in.generate_new_node(parser);
            }
            return for_binding.generate_new_node(parser);
        }
        return for_declaration.generate_new_node(parser);
    }

    return lvalue;
}

const for_expression_operators = ["in", "of"];
const is_ForIn_or_ForOf_header = token => {
    if (token.id === "Identifier") {
        return for_expression_operators.includes(token.value);
    }
};

module.exports = {
    id         : "For expression controller",
    type       : "Expression",
    precedence : EXPRESSION,

    is : (_, parser) => {
        return parser.current_state === for_header_controller;
    },
    initialize : (node, token, parser) => {
        let keyword     = null;
        let initializer = null, binding;

        if (is_terminator(parser)) {
            //initializer = terminal_definition.generate_new_node(parser);
        } else if (has_terminal(parser.next_token)) {
            parser.change_state("delimiter");
            keyword = parser.generate_next_node();
            parser.prepare_next_state("assignable_declaration", false);
            binding = parser.generate_next_node().declaration;
            parser.prepare_next_state("expression_no_in", true);
        } else {
            parser.change_states("assignable_expression", "expression_no_in");
            binding = parser.generate_next_node();
        }

        if (is_assign(parser)) {
            parser.change_states("initializer", "expression_no_in");
            initializer = parser.generate_next_node();
        }

        if (is_ForIn_or_ForOf_header(parser.next_token)) {
            if (! keyword && initializer) {
                const error_message = `Invalid left-hand side in for-${
                    parser.next_token.value
                } loop`;
                parser.throw_unexpected_token(error_message, initializer);
            }
            node.binding     = binding;
            node.keyword     = keyword;
            node.prev_node   = parser.prev_node;
            node.initializer = initializer;
            const state_name = `for_${ parser.next_token.value }_header`;
            return parser.change_state(state_name, false);
        }
        /*

        if (keyword) {
            if (keyword.value === "var") {
                parser.set_prev_node({
                    keyword     : keyword,
                    prev_node   : parser.prev_node,
                    declaration : left,
                });
                parser.change_state("variable_declaration_list_no_in");
                initializer = parser.generate_next_node();
            }
        } else {
            parser.set_prev_node({
                prev_node  : parser.prev_node,
                expression : left,
            });
            parser.change_state("for_iterator_initializer");
            initializer = parser.generate_next_node();
        }

        node.initializer     = initializer;
        parser.current_state = for_iterator_expression;
        */
    }
};
