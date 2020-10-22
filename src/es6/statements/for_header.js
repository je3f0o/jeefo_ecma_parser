/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_header.js
* Created at  : 2020-08-27
* Updated at  : 2020-09-09
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

const {statement} = require("../enums/states_enum");
const {
    STATEMENT,
    TERMINATION,
    LEFT_HAND_SIDE_EXPRESSION,
} = require("../enums/precedence_enum");
const {
    is_terminator,
    is_open_parenthesis,
    get_last_non_comment_node,
} = require("../../helpers");

const parse_var_terminal = (node, parser) => {
    parser.change_state("for_variable_declaration");
    const decl = parser.generate_next_node();

    if (decl.terminator) {
        node.initializer  = decl;
        node.end          = decl.end;
        parser.change_state("for_statement");
        parser.prepare_next_node = false;
    } else {
        const {value} = parser.look_ahead(true);
        const {declaration_list: list} = decl;
        if (list.length > 1) {
            parser.throw_unexpected_token(
                "Invalid left-hand side in for-in loop: " +
                "Must have a single binding.",
                {
                    start : list[0].start,
                    end   : list[list.length - 1].end
                }
            );
        }
        if (list[0].initializer) {
            const is_valid = (
                value === "in" &&
                ! parser.context_stack.push("strict mode")
            );
            if (! is_valid) {
                parser.throw_unexpected_token(
                    `for-${value} loop variable declaration ` +
                    "may not have an initializer.",
                    list[0]
                );
            }
        }
        node.left = decl;
        node.end  = decl.end;
        parser.change_state(`for_${value}_statement`);
    }
};

const parse_from_lexical_declaration = (node, parser) => {
    const decl = parser.refine("lexical_declaration", node);

    if (decl.terminator) {
        node.initializer  = decl;
        node.end          = decl.end;
        parser.change_state("for_statement");
        parser.prepare_next_node = false;
    } else {
        const {value} = parser.look_ahead(true);
        const {binding_list: list} = decl;
        if (list.length > 1) {
            parser.throw_unexpected_token(
                "Invalid left-hand side in for-in loop: " +
                "Must have a single binding.",
                {
                    start : list[0].start,
                    end   : list[list.length - 1].end
                }
            );
        }
        if (list[0].initializer) {
            parser.throw_unexpected_token(
                `for-${value} loop variable declaration ` +
                "may not have an initializer.",
                list[0]
            );
        }

        node.left = decl;
        node.end  = decl.end;
        parser.change_state(`for_${value}_statement`);
    }
};

const parse_let_or_const_terminal = (node, parser) => {
    if (parser.next_token.value === "let") {
        const {id, value} = parser.look_ahead(true);
        if (id === "Identifier" && ["in", "of"].includes(value)) {
            parser.change_state("identifier_reference");
            node.left = parser.generate_next_node();
            node.end  = node.left.end;
            parser.change_state(`for_${value}_statement`);
        } else {
            parse_from_lexical_declaration(node, parser);
        }
    } else {
        parse_from_lexical_declaration(node, parser);
    }
};

// for (x ...
const parse_lhs_expr = (node, parser) => {
    if (is_terminator(parser)) {
        node.end = node.open.end;
        parser.change_state("for_statement");
        parser.prepare_next_node = false;
    } else {
        parser.change_state("expression");
        parser.parse_next_node(TERMINATION);
        const last = get_last_non_comment_node(parser, true);
        parser.end(last);
        const {id, value} = parser.look_ahead(true);
        if (id === "Identifier" && ["in", "of"].includes(value)) {
            if (last.precedence < LEFT_HAND_SIDE_EXPRESSION) {
                parser.throw_unexpected_token(
                    "Invalid left-hand side in for-loop"
                );
            }
            node.left = last;
            node.end  = last.end;
            parser.change_state(`for_${value}_statement`);
        } else {
            node.initializer = last;
            node.end         = last.end;
            parser.prepare_next_state("for_statement");
            parser.prepare_next_node = false;
        }
    }
};

module.exports = {
    id         : "For header",
    type       : "Iteration statements",
    precedence : STATEMENT,
    is         : (_, {current_state: s}) => s === statement,

    initialize (node, token, parser) {
        parser.change_state("keyword");
        const keyword = parser.generate_next_node();

        parser.prepare_next_state("punctuator", true);
        parser.expect('(', is_open_parenthesis);
        const open = parser.generate_next_node();

        node.keyword = keyword;
        node.open    = open;
        node.start   = keyword.start;

        // this is the big one
        parser.context_stack.push(node.id);
        parser.prepare_next_state(null, true);
        if (parser.next_token.id === "Identifier") {
            switch (parser.next_token.value) {
                // for (var ...
                case "var" :
                    parse_var_terminal(node, parser);
                    break;
                // for ([let | const] ...
                case "let" :
                case "const" :
                    parse_let_or_const_terminal(node, parser);
                    break;
                // for (x ...
                default: parse_lhs_expr(node, parser);
            }
        } else {
            parse_lhs_expr(node, parser);
        }
        parser.context_stack.pop();
    }
};
