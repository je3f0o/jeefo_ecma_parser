/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_statement.js
* Created at  : 2019-08-23
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

    is         : (_, parser) => parser.current_state === statement,
    initialize : (node, token, parser) => {
        parser.change_state("delimiter");
        const keyword = parser.generate_next_node();

        parser.prepare_next_state("delimiter", true);
        parser.expect('(', is_open_parenthesis);
        const open = parser.generate_next_node();

        parser.prepare_next_state("for_header_controller", true);
        const expression = parser.parse_next_node(TERMINATION);

        if (! parser.next_token) {
            parser.throw_unexpected_end_of_stream();
        }
        parser.expect(')', is_close_parenthesis);
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
