/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_header_controller.js
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

const { EXPRESSION, TERMINATION } = require("../enums/precedence_enum");
const {
    for_iterator_header,
    for_header_controller,
} = require("../enums/states_enum");
const {
    is_assign,
    is_terminator,
} = require("../../helpers");

const has_terminal = (() => {
    const terminal_words = ["var", "let", "const"];

    return token => {
        if (token.id === "Identifier") {
            return terminal_words.includes(token.value);
        }
    };
})();

const for_expression_operators = ["in", "of"];
const is_ForIn_or_ForOf_header = token => {
    if (token.id === "Identifier") {
        return for_expression_operators.includes(token.value);
    }
};

const is_valid_ForIn_or_ForOf_binding = binding => {
    return binding.id === "Assignable left hand side expression";
};

module.exports = {
    id         : "For header controller",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, parser) => parser.current_state === for_header_controller,
    initialize : (node, token, parser) => {
        let keyword     = null;
        let initializer = null, binding;

        if (is_terminator(parser)) {
            parser.set_prev_node({
                prev_node  : parser.prev_node,
                expression : null,
            });
            parser.change_state("for_iterator_initializer", false);
            node.initializer = parser.generate_next_node();

            parser.ending_index -= 1;
            parser.current_state = for_iterator_header;
            return;
        } else if (has_terminal(parser.next_token)) {
            parser.change_state("delimiter");
            keyword = parser.generate_next_node();
            parser.prepare_next_state("assignable_declaration", false);
            binding = parser.generate_next_node().declaration;
            parser.prepare_next_state("expression_no_in", true);

            if (is_assign(parser)) {
                parser.change_states("initializer", "expression_no_in");
                initializer = parser.generate_next_node();
            }
        } else {
            parser.change_states("assignable_expression", "expression_no_in");
            binding = parser.generate_next_node();

            if (is_assign(parser)) {
                parser.change_state("expression_no_in");
                binding = parser.parse_next_node(TERMINATION);
            }
        }

        if (is_ForIn_or_ForOf_header(parser.next_token)) {
            if (! keyword && ! is_valid_ForIn_or_ForOf_binding(binding)) {
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

        if (keyword) {
            parser.set_prev_node({
                keyword, binding, initializer,
                prev_node : parser.prev_node
            });
            if (keyword.value === "var") {
                parser.change_state("variable_declaration_list_no_in");
            } else {
                parser.change_state("lexical_declaration_no_in");
            }
        } else {
            parser.set_prev_node({
                prev_node  : parser.prev_node,
                expression : binding
            });
            parser.change_state("for_iterator_initializer");
        }

        node.initializer     = parser.generate_next_node();
        parser.ending_index -= 1;
        parser.current_state = for_iterator_header;
    }
};
