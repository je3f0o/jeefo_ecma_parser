/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : expression.js
* Created at  : 2019-09-08
* Updated at  : 2019-09-08
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

const { is_comma }              = require("../../helpers");
const { EXPRESSION }            = require("../enums/precedence_enum");
const { expression_expression } = require("../enums/states_enum");

module.exports = {
    id         : "Expression",
    type       : "Expression",
    precedence : EXPRESSION,
    is         : (_, { current_state : s }) => s === expression_expression,

    initialize (node, token, parser) {
        const list       = [];
        const delimiters = [];

        parser.change_state("assignment_expression");
        while (parser.next_token) {
            list.push(parser.generate_next_node());

            if (is_comma(parser)) {
                parser.change_state("punctuator");
                delimiters.push(parser.generate_next_node());
                parser.prepare_next_state("assignment_expression", true);
            } else {
                break;
            }
        }

        node.list       = list;
        node.delimiters = delimiters;
        node.start      = list[0].start;
        node.end        = list[list.length - 1].end;
    },
};
