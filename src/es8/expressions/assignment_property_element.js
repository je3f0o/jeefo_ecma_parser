/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : assignment_property_element.js
* Created at  : 2019-09-06
* Updated at  : 2020-08-25
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

const { EXPRESSION }                  = require("../enums/precedence_enum");
const { assignment_property_element } = require("../enums/states_enum");

module.exports = {
    id         : "Assignment property element",
	type       : "Expression",
	precedence : EXPRESSION,
    is         : (_, {current_state: s}) => s === assignment_property_element,

	refine (node, property, parser) {
        const element = parser.refine(
            "assignment_element", property.expression
        );

        node.property_name = property.property_name;
        node.colon         = property.colon;
        node.element       = element;
        node.start         = property.start;
        node.end           = element.end;
    },
};
