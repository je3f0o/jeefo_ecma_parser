/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : array_assignment_pattern.js
* Created at  : 2019-09-03
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

const { EXPRESSION }               = require("../enums/precedence_enum");
const { array_assignment_pattern } = require("../enums/states_enum");

module.exports = {
    id         : "Array assignment pattern",
	type       : "Expression",
	precedence : EXPRESSION,

    is (_, parser) {
        return parser.current_state === array_assignment_pattern;
    },
	initialize (node, token, parser) {
        const {
            delimiters,
            element_list,
            open_square_bracket,
            close_square_bracket,
        } = parser.prev_node;

        let elision                 = null;
        let assignment_rest_element = null;

        const assignment_element_list = element_list.map(element => {
            const elision = null;
            parser.prev_node = { elision, element };
            parser.change_state("assignment_elision_element");
            return parser.generate_next_node();
        });

        node.open_square_bracket     = open_square_bracket;
        node.elision                 = elision;
        node.assignment_element_list = assignment_element_list;
        node.assignment_rest_element = assignment_rest_element;
        node.close_square_bracket    = close_square_bracket;
        node.start                   = open_square_bracket.start;
        node.end                 = close_square_bracket.end;
    },
};
