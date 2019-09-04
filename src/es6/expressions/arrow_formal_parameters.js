/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : arrow_formal_parameters.js
* Created at  : 2019-09-04
* Updated at  : 2019-09-04
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

const { EXPRESSION }                = require("../enums/precedence_enum");
const { get_last_non_comment_node } = require("../../helpers");
const {
    expression,
    arrow_formal_parameters,
} = require("../enums/states_enum");

module.exports = {
    id         : "Arrow formal parameters",
	type       : "Expression",
	precedence : EXPRESSION,

    is (token, parser) {
        return parser.current_state === arrow_formal_parameters;
    },
	initialize (node, token, parser) {
        const {
            open,
            expression_list,
            delimiters,
            close,
        } = get_last_non_comment_node(parser);

        const list = expression_list.map(expr => {
            return parser.refine("formal_parameter", expr);
        });

        node.open_parenthesis  = open;
        node.list              = list;
        node.delimiters        = delimiters;
        node.close_parenthesis = close;
        node.start             = open.start;
        node.end               = close.end;

        parser.ending_index -= 1;
        parser.current_state = expression;
    },
};
