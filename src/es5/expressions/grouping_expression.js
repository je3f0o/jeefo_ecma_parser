/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : grouping_expression.js
* Created at  : 2017-08-17
* Updated at  : 2019-08-28
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { GROUPING_EXPRESSION } = require("../enums/precedence_enum");
const { terminal_definition } = require("../../common");
const {
    is_expression,
    get_comma_separated_expressions,
} = require("../helpers");
const {
    is_open_parenthesis,
    get_last_non_comment_node,
} = require("../../helpers");

module.exports = {
	id         : "Grouping expression",
    type       : "Expression",
	precedence : GROUPING_EXPRESSION,

	is : (token, parser) => {
        if (is_expression(parser) && is_open_parenthesis(parser)) {
            return get_last_non_comment_node(parser) === null;
        }
    },
    initialize : (node, current_token, parser) => {
        const { current_state } = parser;

        const open = terminal_definition.generate_new_node(parser);
        const {
            delimiters, expressions
        } = get_comma_separated_expressions(parser, ')');
        const close = terminal_definition.generate_new_node(parser);

        node.open_parenthesis  = open;
        node.expressions_list  = expressions;
        node.delimiters        = delimiters;
        node.close_parenthesis = close;
        node.start             = open.start;
        node.end               = close.end;

        parser.ending_index  = node.end.index;
        parser.current_state = current_state;
    }
};
