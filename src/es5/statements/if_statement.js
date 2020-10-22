/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : if_statement.js
* Created at  : 2017-08-17
* Updated at  : 2020-09-09
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-12.5
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const {STATEMENT, TERMINATION}  = require("../enums/precedence_enum");
const {statement, if_statement} = require("../enums/states_enum");
const {
    is_identifier_token,
    get_last_non_comment_node,
} = require("../../helpers");

const else_statement = {
    id         : "Else statement",
    type       : "The if statement",
    precedence : STATEMENT,

    is         : (_, {current_state: s}) => s === if_statement,
    initialize : (node, token, parser) => {
        parser.expect("else", is_identifier_token(token, "else"));
        parser.change_state("keyword");
        const keyword = parser.generate_next_node();

        parser.prepare_next_state("statement", true);
        parser.parse_next_node(TERMINATION);
        const stmt = get_last_non_comment_node(parser, true);

        node.keyword   = keyword;
        node.statement = stmt;
        node.start     = keyword.start;
        node.end       = stmt.end;
    }
};

const if_statement_def = {
    id         : "If statement",
    type       : "The if statement",
    precedence : STATEMENT,

    is         : (_, {current_state: s}) => s === statement,
    initialize : (node, token, parser) => {
        parser.expect("if", is_identifier_token(token, "if"));
        parser.change_state("keyword");
        const keyword = parser.generate_next_node();

        parser.prepare_next_state("parenthesized_expression", true);
        const expr = parser.generate_next_node();

        // Statement
        parser.prepare_next_state("statement", true);
        parser.parse_next_node(TERMINATION);
        const stmt = get_last_non_comment_node(parser, true);

        // Else statement
        let else_statement = null;
        const next_token   = parser.look_ahead();
        if (next_token && is_identifier_token(next_token, "else")) {
            parser.prepare_next_state("if_statement");
            else_statement = parser.generate_next_node();
        }

        node.keyword        = keyword;
        node.expression     = expr;
        node.statement      = stmt;
        node.else_statement = else_statement;
        node.start          = keyword.start;
        node.end            = (else_statement || stmt).end;

        parser.terminate(node);
    }
};

module.exports = ast_node_table => {
    ast_node_table.register_reserved_word("if"   , if_statement_def);
    ast_node_table.register_reserved_word("else" , else_statement);
};
