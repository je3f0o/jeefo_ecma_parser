/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : try_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-08-28
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-12.14
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { terminal_definition }      = require("../../common");
const { STATEMENT, TERMINATION }   = require("../enums/precedence_enum");
const { statement, try_statement } = require("../enums/states_enum");
const {
    is_identifier,
    is_open_curly,
    is_close_parenthesis,
} = require("../../helpers");

const finally_block = {
    id         : "Finally block",
    type       : "Statement",
    precedence : -1,

    is         : (token, parser) => parser.current_state === try_statement,
    initialize : (node, current_token, parser) => {
        const keyword = terminal_definition.generate_new_node(parser);

        parser.prepare_next_state(null, true);
        parser.expect('{', is_open_curly);
        const block = parser.parse_next_node(TERMINATION);

        node.keyword = keyword;
        node.block   = block;
        node.start   = keyword.start;
        node.end     = block.end;
    }
};

const catch_block = {
    id         : "Catch block",
    type       : "Statement",
    precedence : -1,

    is         : (token, parser) => parser.current_state === try_statement,
    initialize : (node, current_token, parser) => {
        const keyword = terminal_definition.generate_new_node(parser);

        // Parameter
        parser.prepare_next_state("delimiter", true);
        parser.expect('(', parser => parser.next_token.value === '(');
        const open = parser.generate_next_node();

        parser.prepare_next_state("expression", true);
        if (is_close_parenthesis(parser)) {
            parser.throw_unexpected_token("Missing identifier");
        }
        parser.expect("identifier", is_identifier);
        const parameter = parser.generate_next_node();

        parser.prepare_next_state("delimiter", true);
        parser.expect(')', is_close_parenthesis);
        const close = parser.generate_next_node();

        // Block statement
        parser.prepare_next_state("block_statement", true);
        parser.expect('{', parser => parser.next_token.value === '{');
        const block = parser.generate_next_node();

        node.keyword           = keyword;
        node.open_parenthesis  = open;
        node.parameter         = parameter;
        node.close_parenthesis = close;
        node.block             = block;
        node.start             = keyword.start;
        node.end               = block.end;
    }
};

const try_statement_def = {
    id         : "Try statement",
    type       : "Statement",
    precedence : STATEMENT,

    is         : (token, parser) => parser.current_state === statement,
    initialize : (node, token, parser) => {
        const keyword = terminal_definition.generate_new_node(parser);
        let handler = null, finalizer = null;

        parser.prepare_next_state(null, true);
        parser.expect('{', is_open_curly);
        const block = parser.parse_next_node(TERMINATION);

        parser.prepare_next_state("try_statement", true);
        if (parser.is_next_node("Catch block")) {
            handler = parser.generate_next_node();
            parser.prepare_next_state("try_statement");
        }

        if (parser.is_next_node("Finally block")) {
            finalizer = parser.generate_next_node();
        }

        parser.expect("catch or finally after try", () => {
            return handler || finalizer;
        });

        node.keyword   = keyword;
        node.block     = block;
        node.handler   = handler;
        node.finalizer = finalizer;
        node.start     = keyword.start;
        node.end       = (finalizer || handler).end;

        parser.terminate(node);
    }
};

module.exports = ast_node_table => {
    ast_node_table.register_reserved_word("try"     , try_statement_def);
    ast_node_table.register_reserved_word("catch"   , catch_block);
    ast_node_table.register_reserved_word("finally" , finally_block);
};
