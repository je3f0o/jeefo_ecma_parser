/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : binding_rest_element.js
* Created at  : 2019-09-04
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

const { EXPRESSION }           = require("../enums/precedence_enum");
const { binding_rest_element } = require("../enums/states_enum");

const identifier_tree = [
    "New expression",
    "Member expression",
    "Primary expression",
];

function refine_left_hand_side_exrepssion (expression, parser) {
    for (let id of identifier_tree) {
        if (expression.id === id) {
            expression = expression.expression;
        } else {
            break;
        }
    }
    if (expression.id !== "Identifier reference") {
        parser.throw_unexpected_token(
            "Illegal property in declaration context", expression
        );
    }
    return parser.refine("binding_identifier", expression);
}

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

    refine (node, expression, parser) {
        let ellipsis, element;
        switch (expression.id) {
            case "Assignment rest element" :
                ellipsis = expression.ellipsis;
                expression = expression.target.expression;
                if (expression.id === "Left hand side expression") {
                    element = refine_left_hand_side_exrepssion(
                        expression.expression, parser
                    );
                } else {
                    element = parser.refine("binding_pattern", expression);
                }
                break;
            default:
                parser.throw_unexpected_refine(node, expression);
        }

        node.ellipsis = ellipsis;
        node.element  = element;
        node.start    = ellipsis.start;
        node.end      = element.start;
    }
};
