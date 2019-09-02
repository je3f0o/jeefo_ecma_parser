/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : cover_parenthesized_expression_and_arrow_parameters.js
* Created at  : 2019-09-02
* Updated at  : 2019-09-03
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

const {EXPRESSION}                     = require("../enums/precedence_enum");
const {cover_parenthesized_expression} = require("../enums/states_enum");

module.exports = {
    id         : "Cover parenthesized expression and arrow parameter list",
	type       : "Expression",
	precedence : EXPRESSION,

    is (token, parser) {
        return parser.current_state === cover_parenthesized_expression;
    },
	initialize (node, token, parser) {
        console.log(node.id);
        const {
            list : input_list,
            delimiters,
            open_parenthesis,
            close_parenthesis,
        } = parser.prev_node;

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
        console.log(node.list);
        console.log("COVER");
        process.exit();
    },
};
