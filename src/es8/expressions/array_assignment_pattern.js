/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : array_assignment_pattern.js
* Created at  : 2019-09-05
* Updated at  : 2020-08-24
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

const { EXPRESSION }               = require("../enums/precedence_enum");
const { array_assignment_pattern } = require("../enums/states_enum");

module.exports = {
    id         : "Array assignment pattern",
	type       : "Expression",
	precedence : EXPRESSION,

    is     : (_, {current_state: s}) => s === array_assignment_pattern,
	refine : (node, array_literal, parser) => {
        let {
            delimiters,
            element_list,
            open_square_bracket,
            close_square_bracket,
        } = array_literal;

        element_list = element_list.map(expression => {
            if (expression.id === "Assignment expression") {
                return parser.refine("assignment_element", expression);
            }
            return parser.refine("assignment_rest_element", expression);
        });

        node.open_square_bracket  = open_square_bracket;
        node.element_list         = element_list;
        node.delimiters           = delimiters;
        node.close_square_bracket = close_square_bracket;
        node.start                = array_literal.start;
        node.end                  = array_literal.end;
    },
};
