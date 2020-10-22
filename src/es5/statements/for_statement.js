/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_statement.js
* Created at  : 2019-08-23
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

const { statement }              = require("../enums/states_enum");
const { STATEMENT, TERMINATION } = require("../enums/precedence_enum");
const {
    is_open_parenthesis,
    is_close_parenthesis,
} = require("../../helpers");

module.exports = {
    id         : "For statement",
    type       : "Statement",
    precedence : STATEMENT,

    is         : (_, { current_state : s }) => s === statement,
    initialize : (node, token, parser) => {
        debugger
        parser.change_state("keyword");
        const keyword = parser.generate_next_node();

        parser.prepare_next_state("punctuator", true);
        parser.expect('(', is_open_parenthesis);
        const open = parser.generate_next_node();

        parser.prepare_next_state("whatever", true);
        switch (parser.next_token.id) {
            default:
                console.log(parser.next_token);
                debugger
        }

        const expression = parser.next_node_definition.parse(parser);

        if (! parser.next_token) {
            parser.throw_unexpected_end_of_stream();
        }
        parser.expect(')', is_close_parenthesis);
        parser.change_state("punctuator");
        const close = parser.generate_next_node();

        parser.prepare_next_state(null, true);
        const stmt = parser.parse_next_node(TERMINATION);

        node.keyword           = keyword;
        node.open_parenthesis  = open;
        node.expression        = expression;
        node.close_parenthesis = close;
        node.statement         = stmt;
        node.start             = keyword.start;
        node.end               = stmt.end;
    }
};
