/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : if_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-08-28
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

const { terminal_definition }     = require("../../common");
const { STATEMENT, TERMINATION }  = require("../enums/precedence_enum");
const { statement, if_statement } = require("../enums/states_enum");

const else_statement = {
    id         : "Else statement",
    type       : "Statement",
    precedence : -1,

    is         : (token, parser) => parser.current_state === if_statement,
    initialize : (node, current_token, parser) => {
        const keyword = terminal_definition.generate_new_node(parser);
        parser.prepare_next_state(null, true);
        const statement = parser.parse_next_node(TERMINATION);

        node.keyword   = keyword;
        node.statement = statement;
        node.start     = keyword.start;
        node.end       = statement.end;
    }
};

const if_statement_def = {
    id         : "If statement",
    type       : "Statement",
    precedence : STATEMENT,

    is         : (token, parser) => parser.current_state === statement,
    initialize : (node, current_token, parser) => {
        const keyword      = terminal_definition.generate_new_node(parser);
        let else_statement = null;

        parser.prepare_next_state("parenthesized_expression", true);
        const expression = parser.generate_next_node();

        // Statement
        parser.prepare_next_state(null, true);
        const statement = parser.parse_next_node(TERMINATION);

        // Else statement
        parser.prepare_next_state("if_statement");
        if (parser.is_next_node("Else statement")) {
            else_statement = parser.generate_next_node();
        }

        node.keyword        = keyword;
        node.expression     = expression;
        node.statement      = statement;
        node.else_statement = else_statement;
        node.start          = keyword.start;
        node.end            = (else_statement || statement).end;

        parser.terminate(node);
    }
};

module.exports = ast_node_table => {
    ast_node_table.register_reserved_word("if"   , if_statement_def);
    ast_node_table.register_reserved_word("else" , else_statement);
};
