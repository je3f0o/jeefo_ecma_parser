/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : arrow_formal_parameters.js
* Created at  : 2019-09-03
* Updated at  : 2020-08-22
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

const { EXPRESSION }              = require("../enums/precedence_enum");
const { arrow_formal_parameters } = require("../enums/states_enum");

module.exports = {
    id         : "Arrow formal parameters",
	type       : "Expression",
	precedence : EXPRESSION,

    is (token, parser) {
        return parser.current_state === arrow_formal_parameters;
    },
	initialize (node, token, parser) {
        const {
            list : input_list,
            delimiters,
            open_parenthesis,
            close_parenthesis,
        } = parser.prev_node;
        console.log(parser.prev_node);
        process.exit();

        const list = input_list.map(element => {
            parser.prev_node = element.expression;
            parser.change_state("formal_parameter");
            return parser.generate_next_node();
        });

        node.open_parenthesis  = open_parenthesis;
        node.list              = list;
        node.delimiters        = delimiters;
        node.close_parenthesis = close_parenthesis;
        node.start             = open_parenthesis.start;
        node.end               = close_parenthesis.start;
    },
};
