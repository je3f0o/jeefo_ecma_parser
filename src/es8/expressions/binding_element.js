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
            return parser.refine("binding_identifier", expression);
        case "Array literal"  :
        case "Object literal" :
            return parser.refine("binding_pattern", expression);
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
    let initializer = null, element;

    switch (expression.id) {
        case "Function rest parameter" :
            element = expression;
            break;
        case "Assignment element" :
            switch (expression.target.expression.id) {
                case "Left hand side expression":
                    element = refine_left_hand_side_exrepssion(
                        node,
                        expression.target.expression.expression,
                        parser
                    );
                    break;
                case "Assignment pattern":
                    element = parser.refine(
                        "binding_pattern",
                        expression.target.expression,
                    );
                    break;
                default:
                    parser.throw_unexpected_refine(node, expression.target);
            }
            initializer = expression.initializer;
            break;
        case "Assignment rest element" :
            element = parser.refine("binding_rest_element", expression);
            break;
        case "Assignment expression" :
            expression = expression.expression;
            switch (expression.id) {
                case "Primary expression" :
                    element = refine_primary_expression(
                        node, expression.expression, parser
                    );
                    break;
                case "Assignment operator" :
                    return refine_binding_element(node, expression, parser);
                default:
                    parser.throw_unexpected_refine(node, expression);
            }
            break;
        case "Assignment operator" :
            // Binding
            let left = expression.left;
            switch (left.id) {
                case "Assignment pattern" :
                    element = parser.refine("binding_pattern", left);
                    break;
                case "Left hand side expression":
                    element = refine_left_hand_side_exrepssion(
                        node, left.expression, parser
                    );
                    break;
            }

            // Initializer
            initializer = parser.refine("initializer", {
                operator   : expression.operator,
                expression : expression.right
            });
            break;
        default:
            parser.throw_unexpected_refine(node, expression);
    }

    return { element, initializer };
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
            parser. throw_unexpected_token(node.id);
            console.log(parser);
            console.log(node.id);
            console.log(token);
            process.exit();
            parser.change_state("binding_element_pattern");
        }
        const expression = parser.generate_next_node();

        node.expression = expression;
        node.start      = expression.start;
        node.end        = expression.end;

        parser.end(node);
    },

    refine (node, expression, parser) {
        const { element, initializer } = refine_binding_element(
            node, expression, parser
        );

        node.element     = element;
        node.initializer = initializer;
        node.start       = element.start;
        node.end         = (initializer || element).end;
    }
};
