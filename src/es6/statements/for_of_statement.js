/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_of_statement.js
* Created at  : 2020-08-27
* Updated at  : 2020-09-02
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

const {for_of_statement}       = require("../enums/states_enum");
const {STATEMENT, TERMINATION} = require("../enums/precedence_enum");
const {
    is_identifier_token,
    is_close_parenthesis,
    get_last_non_comment_node,
} = require("../../helpers");

module.exports = {
    id         : "For of statement",
    type       : "Iteration statements",
    precedence : STATEMENT,
    is         : (_, {current_state: s}) => s === for_of_statement,

    initialize (node, token, parser) {
        const {keyword, open, left} = get_last_non_comment_node(parser, true);

        parser.expect("of", is_identifier_token(token, "of"));
        parser.change_state("contextual_keyword");
        const op = parser.generate_next_node();

        parser.prepare_next_state("assignment_expression", true);
        const expr = parser.generate_next_node();

        parser.prepare_next_state("punctuator", true);
        parser.expect(')', is_close_parenthesis);
        parser.change_state("punctuator");
        const close = parser.generate_next_node();

        parser.prepare_next_state("statement", true);
        const stmt = parser.generate_next_node(TERMINATION);

        node.keyword           = keyword;
        node.open_parenthesis  = open;
        node.left              = left;
        node.operator          = op;
        node.right             = expr;
        node.close_parenthesis = close;
        node.statement         = stmt;
        node.start             = keyword.start;
        node.end               = stmt.end;
    }
};
