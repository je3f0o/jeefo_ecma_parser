/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : binding_rest_element.js
* Created at  : 2019-09-04
* Updated at  : 2020-08-26
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

const {EXPRESSION}           = require("../enums/precedence_enum");
const {binding_rest_element} = require("../enums/states_enum");

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
        switch (parser.next_token.id) {
            case "Identifier": break;
            case "Delimiter":
                if (['{', '['].includes(parser.next_token.value)) {
                    parser.change_state("binding_pattern");
                } else {
                    parser.throw_unexpected_token();
                }
                break;
            default:
                parser.throw_unexpected_token();
        }
        const element = parser.generate_next_node();

        node.ellipsis = ellipsis;
        node.element  = element;
        node.start    = ellipsis.start;
        node.end      = element.end;
    },

    refine (node, expression, parser) {
        let ellipsis, element;

        try {
            switch (expression.id) {
                case "Assignment rest element" :
                    ({ellipsis} = expression);
                    const {target}   = expression;
                    const state_name = target.id === "Identifier reference"
                        ? "binding_identifier"
                        : "binding_pattern";
                    element = parser.refine(state_name, target);
                    break;
                default: throw expression;
            }
        } catch (error_node) {
            console.log(error_node);
            debugger
            parser.throw_unexpected_refine(node, error_node);
        }

        node.ellipsis = ellipsis;
        node.element  = element;
        node.start    = ellipsis.start;
        node.end      = element.start;
    }
};
