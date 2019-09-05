/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : array_binding_pattern.js
* Created at  : 2019-09-03
* Updated at  : 2019-09-05
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

const { EXPRESSION }            = require("../enums/precedence_enum");
const { array_binding_pattern } = require("../enums/states_enum");

module.exports = {
    id         : "Array binding pattern",
	type       : "Expression",
	precedence : EXPRESSION,

    is     : (_, { current_state : s }) => s === array_binding_pattern,
	refine : (node, array_literal, parser) => {
        const {
            delimiters,
            element_list,
            open_square_bracket,
            close_square_bracket,
        } = array_literal;

        let elision              = null;
        let binding_rest_element = null;

        const binding_element_list = element_list.map(element => {
            const elision = null;
            parser.prev_node = { elision, element };
            parser.change_state("assignment_elision_element");
            return parser.generate_next_node();
        });

        node.open_square_bracket  = open_square_bracket;
        node.elision              = elision;
        node.binding_element_list = binding_element_list;
        node.binding_rest_element = binding_rest_element;
        node.close_square_bracket = close_square_bracket;
        node.start                = open_square_bracket.start;
        node.end                  = close_square_bracket.end;
    },
};
