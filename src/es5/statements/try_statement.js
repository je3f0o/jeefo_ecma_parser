/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : try_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-09-08
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

const { STATEMENT }                = require("../enums/precedence_enum");
const { statement, try_statement } = require("../enums/states_enum");

const finally_block = {
    id         : "Finally block",
    type       : "Statement",
    precedence : -1,

    is         : (_, { current_state : s }) => s === try_statement,
    initialize : (node, current_token, parser) => {
        parser.change_state("keyword");
        const keyword = parser.generate_next_node();

        parser.prepare_next_state(null, true);
        parser.expect('{', parser => parser.is_next_node("Block statement"));
        const block = parser.generate_next_node();

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

    is         : (_, { current_state : s }) => s === try_statement,
    initialize : (node, token, parser) => {
        parser.change_state("keyword");
        const keyword = parser.generate_next_node();

        // Parameter
        parser.prepare_next_state("catch_parameter", true);
        const parameter = parser.generate_next_node();

        // Block statement
        parser.prepare_next_state(null, true);
        parser.expect('{', parser => parser.is_next_node("Block statement"));
        const block = parser.generate_next_node();

        node.keyword   = keyword;
        node.parameter = parameter;
        node.block     = block;
        node.start     = keyword.start;
        node.end       = block.end;
    }
};

const try_statement_def = {
    id         : "Try statement",
    type       : "Statement",
    precedence : STATEMENT,

    is         : (_, { current_state : s }) => s === statement,
    initialize : (node, token, parser) => {
        parser.change_state("keyword");
        const keyword = parser.generate_next_node();
        let handler = null, finalizer = null;

        parser.prepare_next_state(null, true);
        parser.expect('{', parser => parser.is_next_node("Block statement"));
        const block = parser.generate_next_node();

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
