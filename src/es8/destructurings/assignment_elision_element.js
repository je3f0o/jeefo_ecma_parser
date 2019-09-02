/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : assignment_elision_element.js
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

const { EXPRESSION }                 = require("../enums/precedence_enum");
const { assignment_elision_element } = require("../enums/states_enum");

module.exports = {
    id         : "Assignment property",
	type       : "Expression",
	precedence : EXPRESSION,

    is (_, parser) {
        return parser.current_state === assignment_elision_element;
    },
	initialize : (node, token, parser) => {
        const { elision, element } = parser.prev_node;

        parser.prev_node = element;
        parser.change_state("assignment_element");
        const assignment_element = parser.generate_next_node();

        node.elision            = elision;
        node.assignment_element = assignment_element;
        node.start              = elision.start;
        node.end                = assignment_element.end;
    },
};
