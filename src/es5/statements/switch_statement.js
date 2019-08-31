/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : switch_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-08-28
* Author      : jeefo
* Purpose     :
* Description :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { AST_Node_Definition }    = require("@jeefo/parser");
const { terminal_definition }    = require("../../common");
const { STATEMENT, TERMINATION } = require("../enums/precedence_enum");
const {
    statement,
    case_clause,
    default_clause,
} = require("../enums/states_enum");
const {
    is_colon,
    is_open_curly,
    is_close_curly,
} = require("../../helpers");

const break_keywords = ["case", "default"];
const is_break_point = token => {
    if (token.id === "Identifier") {
        return break_keywords.includes(token.value);
    }
};

const case_clause_def = {
    id         : "Case clause",
    type       : "Statement",
    precedence : STATEMENT,

    is         : (token, parser) => parser.current_state === case_clause,
    initialize : (node, current_token, parser) => {
        const keyword    = terminal_definition.generate_new_node(parser);
        const statements = [];

        parser.prepare_next_state("expression", true);
        const expression = parser.parse_next_node(TERMINATION);
        if (parser.next_token === null) {
            parser.throw_unexpected_end_of_stream();
        }
        parser.expect(':', is_colon);
        const delimiter = terminal_definition.generate_new_node(parser);

        parser.prepare_next_state(null, true);
        while (! is_close_curly(parser)) {
            if (is_break_point(parser.next_token)) {
                break;
            } else {
                statements.push(parser.parse_next_node(TERMINATION));
                parser.prepare_next_state(null, true);
            }
        }

        let end = delimiter.end;
        if (statements.length) {
            end = statements[statements.length - 1].end;
        }

        node.keyword    = keyword;
        node.expression = expression;
        node.delimiter  = delimiter;
        node.statements = statements;
        node.start      = keyword.start;
        node.end        = end;
    }
};

const default_clause_def = {
    id         : "Default clause",
    type       : "Statement",
    precedence : STATEMENT,

    is         : (token, parser) => parser.current_state === default_clause,
    initialize : (node, current_token, parser) => {
        const keyword    = terminal_definition.generate_new_node(parser);
        const statements = [];

        parser.prepare_next_state("delimiter", true);
        parser.expect(':', is_colon);
        const delimiter = terminal_definition.generate_new_node(parser);

        parser.prepare_next_state(null, true);
        while (parser.next_token.value !== '}') {
            if (is_break_point(parser.next_token)) {
                break;
            } else {
                statements.push(parser.parse_next_node(TERMINATION));
                parser.prepare_next_state(null, true);
            }
        }

        let end = delimiter.end;
        if (statements.length) {
            end = statements[statements.length - 1].end;
        }

        node.keyword    = keyword;
        node.delimiter  = delimiter;
        node.statements = statements;
        node.start      = keyword.start;
        node.end        = end;
    }
};

const case_block_definition = new AST_Node_Definition({
    id         : "Case block",
    type       : "Statement",
    precedence : -1,

    is         : () => {},
    initialize : (node, token, parser) => {
        const open         = terminal_definition.generate_new_node(parser);
        const case_clauses = [];

        parser.prepare_next_state(null, true);
        while (! is_close_curly(parser)) {
            switch (parser.next_token.value) {
                case "case" :
                    parser.change_state("case_clause");
                    break;
                case "default" :
                    parser.change_state("default_clause");
                    break;
                default:
                    parser.throw_unexpected_token();
            }
            case_clauses.push(parser.generate_next_node());
        }
        const close = terminal_definition.generate_new_node(parser);

        node.case_clauses = case_clauses;
        node.start        = open.start;
        node.end          = close.end;
    }
});

const switch_statement = {
    id         : "Switch statement",
    type       : "Statement",
    precedence : STATEMENT,

    is         : (token, parser) => parser.current_state === statement,
    initialize : (node, token, parser) => {
        const keyword = terminal_definition.generate_new_node(parser);

        parser.prepare_next_state("parenthesized_expression", true);
        const expression = parser.generate_next_node();

        parser.prepare_next_state("delimiter", true);
        parser.expect('{', is_open_curly);
        const case_block = case_block_definition.generate_new_node(parser);

        node.keyword    = keyword;
        node.expression = expression;
        node.case_block = case_block;
        node.start      = keyword.start;
        node.end        = case_block.end;

        parser.terminate(node);
    }
};

module.exports = ast_node_table => {
    ast_node_table.register_reserved_word("case"    , case_clause_def);
    ast_node_table.register_reserved_word("default" , default_clause_def);
    ast_node_table.register_reserved_word("switch"  , switch_statement);
};
