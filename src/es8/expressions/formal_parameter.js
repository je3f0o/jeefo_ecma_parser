/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : formal_parameter.js
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

const { EXPRESSION }       = require("../enums/precedence_enum");
const { formal_parameter } = require("../enums/states_enum");

module.exports = {
    id         : "Formal parameter",
	type       : "Expression",
	precedence : EXPRESSION,

    is         : (_, parser) => parser. current_state === formal_parameter,
	initialize : (node, token, parser) => {
        if (! parser.prev_node) {
            parser.change_state("assignment_expression");
            parser.set_prev_node(parser.generate_next_node());
        }
        parser.change_state("binding_element");
        const binding_element = parser.generate_next_node();

        node.binding_element = binding_element;
        node.start           = binding_element.start;
        node.end             = binding_element.end;
        console.log(binding_element);
    },
};
