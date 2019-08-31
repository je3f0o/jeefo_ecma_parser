/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_expression_controller.js
* Created at  : 2019-08-29
* Updated at  : 2019-08-30
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
    for_iterator_expression,
    for_expression_controller : for_expr_ctrl
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

const for_binding_valid_left_values = [
    "Identifier",
    "Array binding pattern",
    "Object binding pattern",
];
const for_binding = new AST_Node_Definition({
    id         : "For binding",
    type       : "Declaration",
    precedence : -1,

    is         : () => {},
    initialize : (node, token, parser) => {
        const { keyword, lvalue } = parser.prev_node;
        if (! for_binding_valid_left_values.includes(lvalue.id)) {
            parser.throw_unexpected_token(null, lvalue);
        }

        node.keyword = keyword;
        node.binding = lvalue;
        node.start   = keyword.start;
        node.end     = lvalue.end;
    }
});

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

module.exports = {
    id         : "For expression controller",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, parser) => parser.current_state === for_expr_ctrl,
    initialize : (node, token, parser) => {
        let keyword = null, left;
        if (is_terminator(parser)) {
            //initializer = terminal_definition.generate_new_node(parser);
        } else if (has_terminal(parser.next_token)) {
            parser.change_state("statement");
            keyword = parser.generate_next_node();
            parser.prepare_next_state("assignable_left_expression", true);
        } else {
            parser.change_state("assignable_left_expression");
        }

        parser.prev_state = expression_no_in;
        const lvalue = parser.generate_next_node();
        /*
        if (! is_assign_token(parser.next_token)) {
            parser.throw_unexpected_token(
                "Missing initializer in destructuring declaration"
            );
        }
        */

        if (keyword) {
            if (keyword.value === "var") {
                parser.change_state("variable_declaration_no_in");

                const { prev_node } = parser;
                parser.set_prev_node(lvalue);
                left = parser.generate_next_node();
                parser.prev_node = prev_node;
            } else {
                left = for_binding.generate_new_node(parser);
            }
        } else {
            left = lvalue;
        }

        if (parser.next_token.id === "Identifier") {
            switch (parser.next_token.value) {
                case "in" :
                    node.left            = left;
                    parser.current_state = for_in_expression;
                    return;
                case "of" :
                    if (left.id === "Variable declaration no in") {
                        if (left.initializer) {
                            parser.throw_unexpected_token(for_of_init_error);
                        }
                    }
                    node.left            = left;
                    parser.current_state = for_of_expression;
                    return;
            }
        }

        let initializer;
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
    }
};
