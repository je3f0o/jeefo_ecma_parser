/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : variable_declaration_list.js
* Created at  : 2019-09-01
* Updated at  : 2020-09-06
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

const { DECLARATION }               = require("../enums/precedence_enum");
const { is_comma, is_terminator }   = require("../../helpers");
const { variable_declaration_list } = require("../enums/states_enum");

module.exports = {
    id         : "Variable declaration list",
    type       : "Declaration",
    precedence : DECLARATION,

    is         : (_, { current_state : s }) => s === variable_declaration_list,
    initialize : (node, token, parser) => {
        debugger
        const list       = [];
        const delimiters = [];

        parser.change_state("variable_declaration");

        while (! is_terminator(parser)) {
            list.push(parser.generate_next_node());

            if (parser.next_token === null) { break; }
            else if (is_comma(parser)) {
                parser.change_state("punctuator");
                delimiters.push(parser.generate_next_node());
                parser.prepare_next_state("variable_declaration", true);
            }
        }

        node.list       = list;
        node.delimiters = delimiters;
        node.start      = list[0].start;
        node.end        = list[list.length - 1].end;
    }
};
