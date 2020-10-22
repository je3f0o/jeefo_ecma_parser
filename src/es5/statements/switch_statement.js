/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : switch_statement.js
* Created at  : 2017-08-17
* Updated at  : 2020-09-07
* Author      : jeefo
* Purpose     :
* Description :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const {STATEMENT}           = require("../enums/precedence_enum");
const {statement}           = require("../enums/states_enum");
const {is_identifier_token} = require("../../helpers");

module.exports = {
    id         : "Switch statement",
    type       : "The switch statement",
    precedence : STATEMENT,
    is         : (_, {current_state: s}) => s === statement,

    initialize (node, token, parser) {
        parser.expect("switch", is_identifier_token(token, "switch"));
        parser.change_state("keyword");
        const keyword = parser.generate_next_node();

        parser.prepare_next_state("parenthesized_expression", true);
        const expr = parser.generate_next_node();

        parser.prepare_next_state("case_block", true);
        const block = parser.generate_next_node();

        node.keyword    = keyword;
        node.expression = expr;
        node.case_block = block;
        node.start      = keyword.start;
        node.end        = block.end;

        parser.terminate(node);
    }
};
