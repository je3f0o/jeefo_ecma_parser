/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : binding_element.js
* Created at  : 2019-09-02
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

const { EXPRESSION }      = require("../enums/precedence_enum");
const { binding_element } = require("../enums/states_enum");

function refine_binding_element (parser) {
    let initializer = null, element;
            console.log(parser.prev_node);
            process.exit();

    switch (parser.prev_node.id) {
        case "Identifier":
            element = parser.refine("binding_identifier", parser.prev_node);
            break;
        case "Array literal"  :
        case "Object literal" :
            parser.change_state("assignment_pattern");
            element = parser.generate_next_node();
            break;
        case "Assignment expression" :
            parser.prev_node = parser.prev_node.expression;
            return refine_binding_element(parser);
        case "Assignment operator" :
            const assign_expr = parser.prev_node;
            if (assign_expr.operator.value !== '=') {
                parser.throw_unexpected_token(null, assign_expr.operator);
            }

            // Binding
            parser.prev_node = assign_expr.left;
            ({ element } = refine_binding_element(parser));

            // Initializer
            parser.prev_node = {
                assign_operator : assign_expr.operator,
                expression      : assign_expr.right
            };
            parser.change_state("initializer");
            initializer = parser.generate_next_node();
            break;
        default:
            parser.throw_unexpected_token(null, parser.prev_node);
    }

    return { element, initializer };
}

module.exports = {
    id         : "Binding element",
	type       : "Expression",
	precedence : EXPRESSION,

    is         : (_, parser) => parser.current_state === binding_element,
	initialize : (node, token, parser) => {
        const { element, initializer } = refine_binding_element(parser);

        node.element     = element;
        node.initializer = initializer;
        node.start       = element.start;
        node.end         = (initializer || element).end;
    },
};
