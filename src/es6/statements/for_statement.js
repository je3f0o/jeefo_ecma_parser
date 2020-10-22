/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_statement.js
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

const {for_statement}          = require("../enums/states_enum");
const {STATEMENT, TERMINATION} = require("../enums/precedence_enum");
const {
    is_terminator,
    is_close_parenthesis,
    is_labelled_function,
    get_last_non_comment_node,
} = require("../../helpers");

const is_declaration = ({id}) => [
    "Lexical declaration",
    "For variable declaration",
].includes(id);

module.exports = {
    id         : "For statement",
    type       : "Iteration statements",
    precedence : STATEMENT,

    is         : (_, {current_state: s}) => s === for_statement,
    initialize : (node, token, parser) => {
        const {
            id, open, keyword,
            initializer = null,
        } = get_last_non_comment_node(parser, true);
        const delimiters = [];
        let update    = null;
        let condition = null;
        parser.expect("ForHeader", id === "For header");

        if (initializer && is_declaration(initializer)) {
            parser.prepare_next_state("expression", true);
        } else {
            parser.expect(';', is_terminator);
            parser.change_state("punctuator");
            delimiters.push(parser.generate_next_node());
            parser.prepare_next_state("expression", true);
        }

        // Condition
        if (is_terminator(parser)) {
            delimiters.push(parser.generate_next_node());
            parser.prepare_next_state("expression", true);
        } else {
            parser.parse_next_node(TERMINATION);
            condition = get_last_non_comment_node(parser, true);

            parser.expect(';', is_terminator);
            delimiters.push(parser.generate_next_node());
            parser.prepare_next_state("expression", true);
        }

        if (! is_close_parenthesis(parser)) {
            parser.parse_next_node(TERMINATION);
            update = get_last_non_comment_node(parser, true);
        }

        parser.expect(')', is_close_parenthesis);
        const close = parser.generate_next_node();

        parser.context_stack.push(node.type);
        parser.prepare_next_state("statement", true);
        const stmt = parser.parse_next_node(TERMINATION);
        if (is_labelled_function(stmt)) {
            parser.throw_unexpected_token(
                "In non-strict mode code, functions can only be declared at " +
                "top level, inside a block, or as the body of an if statement.",
                stmt.item.keyword
            );
        }
        parser.context_stack.pop();

        node.keyword           = keyword;
        node.open_parenthesis  = open;
        node.initializer       = initializer;
        node.condition         = condition;
        node.update            = update;
        node.delimiters        = delimiters;
        node.close_parenthesis = close;
        node.statement         = stmt;
        node.start             = keyword.start;
        node.end               = stmt.end;
    }
};
