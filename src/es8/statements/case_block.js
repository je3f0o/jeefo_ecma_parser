/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : case_block.js
* Created at  : 2020-09-07
* Updated at  : 2020-09-07
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

const {STRUCTURE}  = require("../enums/precedence_enum");
const {case_block} = require("../enums/states_enum");
const {
    is_open_curly,
    is_close_curly,
} = require("../../helpers");

module.exports = {
    id         : "Case block",
    type       : "The switch statement",
    precedence : STRUCTURE,

    is         : (_, {current_state: s}) => s === case_block,
    initialize : (node, token, parser) => {
        parser.expect('{', is_open_curly);
        parser.change_state("punctuator");
        const open    = parser.generate_next_node();
        const clauses = [];

        parser.prepare_next_state("switch_statement", true);
        while (! is_close_curly(parser)) {
            clauses.push(parser.generate_next_node());
            parser.prepare_next_state("switch_statement", true);
        }
        parser.is_terminated = false;
        parser.change_state("punctuator");
        const close = parser.generate_next_node();

        node.clauses = clauses;
        node.start        = open.start;
        node.end          = close.end;
    }
};
