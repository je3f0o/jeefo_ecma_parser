/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : binding_property.js
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

const { EXPRESSION }       = require("../enums/precedence_enum");
const { binding_property } = require("../enums/states_enum");

module.exports = {
    id         : "Binding property",
	type       : "Expression",
	precedence : EXPRESSION,
    is         : (_, { current_state : s }) => s === binding_property,

    initialize (node) {
        console.log(node.id);
        process.exit();
    },

	refine (node, property, parser) {
        if (property.id !== "Property definition") {
            parser.throw_unexpected_refine(node, property);
        }

        let expression;
        switch (property.definition.id) {
            case "Identifier reference" :
            case "Cover initialized name" :
                expression = parser.refine(
                    "single_name_binding",
                    property.definition
                );
                break;
            case "Property assignment":
                expression = parser.refine(
                    "binding_property_element",
                    property.definition
                );
                return;
            default:
                parser.throw_unexpected_refine(node, property.definition);
        }

        node.expression = expression;
        node.start      = expression.start;
        node.end        = expression.end;
    },
};
