/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : binding_list.js
* Created at  : 2019-09-02
* Updated at  : 2019-09-07
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

const { DECLARATION }             = require("../enums/precedence_enum");
const { binding_list }            = require("../enums/states_enum");
const { validate_const_binding }  = require("../helpers");
const { is_comma, is_terminator } = require("../../helpers");

module.exports = {
    id         : "Binding list",
    type       : "Declaration",
    precedence : DECLARATION,

    is         : (_, { current_state : s }) => s === binding_list,
    initialize : (node, token, parser) => {
        const { keyword, prev_node } = parser.prev_node;
        const list       = [];
        const is_const   = keyword.value === "const";
        const delimiters = [];

        parser.prev_node = prev_node;
        parser.change_state("lexical_binding");

        while (! is_terminator(parser)) {
            const binding = parser.generate_next_node();
            if (is_const) { validate_const_binding(binding, parser); }
            list.push(binding);

            if (parser.next_token === null) { break; }
            else if (is_comma(parser)) {
                parser.change_state("delimiter");
                delimiters.push(parser.generate_next_node());
                parser.prepare_next_state("lexical_binding", true);
            }
        }

        node.list       = list;
        node.delimiters = delimiters;
        node.start      = list[0].start;
        node.end        = list[list.length - 1].end;
    }
};
