/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : assignment_element.js
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

const { EXPRESSION }         = require("../enums/precedence_enum");
const { assignment_element } = require("../enums/states_enum");

module.exports = {
    id         : "Assignment element",
	type       : "Expression",
	precedence : EXPRESSION,

    is         : (_, parser) => parser.current_state === assignment_element,
	initialize : (node, token, parser) => {
        //const { elision, element } = parser.prev_node;

        //parser.prev_node = element;
        //parser.change_state("assignment_element");
        const target = 11;//parser.generate_next_node();
        const initializer = 22;

        node.destructuring_assignment_target = target;
        node.initializer                     = initializer;
        node.start                           = target.start;
        node.end                             = (initializer || target).end;
    },
};
