/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : binding_element_pattern.js
* Created at  : 2019-09-09
* Updated at  : 2019-09-09
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

const { EXPRESSION }              = require("../enums/precedence_enum");
const { is_assign_token }         = require("../../helpers");
const { binding_element_pattern } = require("../enums/states_enum");

const init = (node, pattern, initializer) => {
    node.binding_pattern = pattern;
    node.initializer     = initializer;
    node.start           = pattern.start;
    node.end             = (initializer || pattern).end;
};

module.exports = {
    id         : "Binding element pattern",
	type       : "Expression",
	precedence : EXPRESSION,

    is         : (_, { current_state : s }) => s === binding_element_pattern,
	initialize : (node, token, parser) => {
        let initializer = null;
        parser.change_state("binding_pattern");
        const pattern = parser.generate_next_node();

        parser.prepare_next_state("initializer");
        if (is_assign_token(parser.next_token)) {
            initializer = parser.generate_next_node();
        }

        init(node, pattern, initializer);
    },

    refine (node, input_node, parser) {
        let initializer = null, pattern;
        switch (input_node.id) {
            case "Array literal" :
                pattern = parser.refine("array_binding_pattern", input_node);
                break;
            case "Object literal" :
                pattern = parser.refine("object_binding_pattern", input_node);
                break;
            case "Assignment operator" :
                pattern = parser.refine("binding_pattern", input_node.left);
                if (input_node.operator.value !== '=') {
                    parser.throw_unexpected_token(null, input_node);
                }
                initializer = parser.refine("initializer", {
                    operator   : input_node.operator,
                    expression : input_node.right
                });
                break;
            case "Assignment pattern" :
                pattern = parser.refine("binding_pattern", input_node);
                break;
            default:
                parser.throw_unexpected_refine(node, input_node);
        }

        init(node, pattern, initializer);
    }
};
