/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : single_name_binding.js
* Created at  : 2019-09-07
* Updated at  : 2019-09-09
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/6.0/#sec-destructuring-binding-patterns
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { EXPRESSION }          = require("../enums/precedence_enum");
const { is_assign_token }     = require("../../helpers");
const { single_name_binding } = require("../enums/states_enum");

function refine_left_hand_side_exrepssion (node, expression, parser) {
    [
        "Left hand side expression",
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
    return parser.refine("single_name_binding", expression);
}

const init = (node, identifier, initializer) => {
    node.binding_identifier = identifier;
    node.initializer        = initializer;
    node.start              = identifier.start;
    node.end                = (initializer || identifier).end;
};

module.exports = {
    id         : "Single name binding",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, { current_state : s }) => s === single_name_binding,
    initialize : (node, token, parser) => {
        let initializer = null;
        parser.change_state("binding_identifier");
        const identifier = parser.generate_next_node();

        parser.prepare_next_state("initializer");
        if (is_assign_token(parser.next_token)) {
            initializer = parser.generate_next_node();
        }

        init(node, identifier, initializer);
    },

    refine : (node, input_node, parser) => {
        let initializer = null, identifier;
        switch (input_node.id) {
            case "Identifier reference" :
                identifier = input_node;
                break;
            case "Cover initialized name" :
                identifier  = input_node.identifier;
                initializer = input_node.initializer;
                break;
            case "Assignment operator" :
                identifier = refine_left_hand_side_exrepssion(
                    node, input_node.left, parser
                );
                if (input_node.operator.value !== '=') {
                    parser.throw_unexpected_token(null, input_node);
                }
                initializer = parser.refine("initializer", {
                    operator   : input_node.operator,
                    expression : input_node.right
                });
                break;
            default:
                parser.throw_unexpected_refine(node, input_node);
        }

        init(node, identifier, initializer);
    }
};
