/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : binding_property_element.js
* Created at  : 2019-09-07
* Updated at  : 2019-09-07
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
const { binding_property_element } = require("../enums/states_enum");

module.exports = {
    id         : "Binding property element",
	type       : "Expression",
	precedence : EXPRESSION,
    is         : (_, { current_state : s }) => s === binding_property_element,

    initialize (node) {
        console.log(node.id);
        process.exit();
    },

	refine (node, property, parser) {
        const element = parser.refine("binding_element", property.expression);

        node.property_name = property.property_name;
        node.colon         = property.colon;
        node.element       = element;
        node.start         = property.start;
        node.end           = element.end;
    },
};
