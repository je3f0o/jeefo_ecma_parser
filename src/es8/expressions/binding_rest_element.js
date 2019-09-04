/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : binding_rest_element.js
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

const { EXPRESSION }           = require("../enums/precedence_enum");
const { binding_rest_element } = require("../enums/states_enum");

module.exports = {
    id         : "Binding rest element",
	type       : "Expression",
	precedence : EXPRESSION,

    is         : (_, { current_state :s }) => s === binding_rest_element,
	initialize : (node, token, parser) => {
        parser.change_state("punctuator");
        const ellipsis = parser.generate_next_node();

        node.ellipsis = ellipsis;
        node.start    = ellipsis.start;

        parser.prepare_next_state("binding_identifier", true);
        if (! parser.next_node_definition) {
            parser.change_state("binding_pattern");
        }
        const element = parser.generate_next_node();

        node.ellipsis = ellipsis;
        node.element  = element;
        node.start    = ellipsis.start;
        node.end      = element.start;
    },
};
