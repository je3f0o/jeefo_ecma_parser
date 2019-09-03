/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : binding_element.js
* Created at  : 2019-08-28
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

const { EXPRESSION }                 = require("../enums/precedence_enum");
const { binding_element }            = require("../enums/states_enum");
const { initializer_definition }     = require("../nodes");
const { parse_asignment_expression } = require("../../helpers");

function parse_binding_and_initializer (node, parser) {
    let initializer = null, binding;

    switch (node.id) {
        case "Identifier":
            let { is_terminated } = parser;

            if (is_terminated) {
                parser.next_token    = {};
                parser.is_terminated = false;
            } else {
                parser.prev_node = node;
                parser.previous_nodes.push(node);
            }
            parser.change_state("binding_identifier");
            binding = parser.generate_next_node();

            if (is_terminated) {
                parser.next_token    = null;
                parser.is_terminated = true;
            }
            break;
        case "Assignment expression" :
            if (node.operator.value !== '=') {
                parser.throw_unexpected_token(null, node.operator);
            }

            binding = node.left;

            parser.prev_node = {
                assign_operator : node.operator,
                expression      : node.right
            };
            initializer = initializer_definition.generate_new_node(parser);
            break;
        case "Array literal"  :
        case "Object literal" :
            parser.set_prev_node(node);
            parser.change_state("binding_pattern");
            binding = parser.generate_next_node();
            break;
        default:
            parser.throw_unexpected_token(null, node);
    }

    return { binding, initializer };
}

module.exports = {
    id         : "Binding element",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, parser) => parser.current_state === binding_element,
    initialize : (node, token, parser) => {
        parser.change_state("expression");
        const expression = parse_asignment_expression(parser);
        if (! expression) {
            parser.throw_unexpected_token();
        }
        const { binding, initializer } = parse_binding_and_initializer(
            expression, parser
        );

        node.binding     = binding;
        node.initializer = initializer;
        node.start       = binding.start;
        node.end         = (initializer || binding).end;
    }
};
