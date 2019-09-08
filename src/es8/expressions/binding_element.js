/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : binding_element.js
* Created at  : 2019-09-02
* Updated at  : 2019-09-09
* Author      : jeefo
* Purpose     :
* Description : I discarded SingleNameBinding. Maybe i will add later or not...
* Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { EXPRESSION }          = require("../enums/precedence_enum");
const { binding_element }     = require("../enums/states_enum");
const { is_identifier_token } = require("../../helpers");

function refine_primary_expression (node, expression, parser) {
    switch (expression.id) {
        case "Identifier reference":
            return parser.refine("single_name_binding", expression);
        case "Array literal"  :
        case "Object literal" :
            return parser.refine("binding_element_pattern", expression);
    }
    parser.throw_unexpected_refine(node, expression);
}

function refine_left_hand_side_exrepssion (node, expression, parser) {
    [
        "New expression",
        "Member expression",
        "Primary expression",
    ].forEach(id => {
        if (expression.id === id) {
            expression = expression.expression;
        } else {
            parser.throw_unexpected_token(
                "Illegal property in declaration context", expression
            );
        }
    });
    return refine_primary_expression(node, expression, parser);
}

function refine_binding_element (node, expression, parser) {
    switch (expression.id) {
        case "Function rest parameter" :
            return expression;
        case "Assignment element" :
            expression = expression.target.expression;
            switch (expression.id) {
                case "Left hand side expression":
                    return refine_left_hand_side_exrepssion(
                        node,
                        expression.expression,
                        parser
                    );
                case "Assignment pattern":
                    return parser.refine(
                        "binding_element_pattern", expression
                    );
            }
            break;
        case "Assignment expression" :
            expression = expression.expression;
            switch (expression.id) {
                case "Primary expression" :
                    return refine_primary_expression(
                        node, expression.expression, parser
                    );
                case "Assignment operator" :
                    return refine_binding_element(node, expression, parser);
            }
            break;
        case "Assignment operator" :
            switch (expression.left.id) {
                case "Assignment pattern" :
                    return parser.refine(
                        "binding_element_pattern", expression
                    );
                case "Left hand side expression":
                    return parser.refine(
                        "single_name_binding", expression
                    );
            }
            break;
    }
    parser.throw_unexpected_refine(node, expression);
}

module.exports = {
    id         : "Binding element",
	type       : "Expression",
	precedence : EXPRESSION,

    is         : (_, { current_state : s }) => s === binding_element,
	initialize : (node, token, parser) => {
        if (is_identifier_token(token)) {
            parser.change_state("single_name_binding");
        } else {
            parser.change_state("binding_element_pattern");
        }
        const expression = parser.generate_next_node();

        node.expression = expression;
        node.start      = expression.start;
        node.end        = expression.end;

        parser.end(node);
    },

    refine (node, input_node, parser) {
        const expression = refine_binding_element(node, input_node, parser);

        node.expression = expression;
        node.start      = expression.start;
        node.end        = expression.end;
    }
};
