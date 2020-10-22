/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : binding_element_pattern.js
* Created at  : 2019-09-09
* Updated at  : 2020-08-28
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

const {EXPRESSION}              = require("../enums/precedence_enum");
const {is_assign_token}         = require("../../helpers");
const {binding_element_pattern} = require("../enums/states_enum");

const init = (node, pattern, initializer) => {
    node.binding_pattern = pattern;
    node.initializer     = initializer;
    node.start           = pattern.start;
    node.end             = (initializer || pattern).end;
};

const refine_pattern_from_assignment_pattern = (expression, parser) => {
    switch (expression.id) {
        case "Array assignment pattern" :
            return parser.refine("array_binding_pattern", expression);
        case "Object assignment pattern" :
            return parser.refine("object_binding_pattern", expression);
        default:
            debugger
            throw expression;
    }
};

const assert = (condition, error_node) => {
    if (! condition) throw error_node;
};

module.exports = {
    id         : "Binding element pattern",
	type       : "Expression",
	precedence : EXPRESSION,

    is         : (_, {current_state: s}) => s === binding_element_pattern,
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

    refine (node, expr, parser) {
        let initializer = null, pattern;

        try {
            switch (expr.id) {
                case "Assignment operator" :
                    const {left} = expr;
                    switch (left.id) {
                        case "Assignment pattern":
                            pattern = refine_pattern_from_assignment_pattern(
                                left.pattern, parser
                            );
                            initializer = parser.refine("initializer", expr);
                            break;
                        default: throw left;
                    }
                    break;
                case "Array literal":
                    pattern = parser.refine("array_binding_pattern", expr);
                    break;
                case "Object literal":
                    pattern = parser.refine("object_binding_pattern", expr);
                    break;
                case "Assignment element":
                    const {target} = expr;
                    assert(target.id === "Assignment pattern", target);
                    pattern = refine_pattern_from_assignment_pattern(
                        target.pattern, parser
                    );
                    ({initializer} = expr);
                    break;
                default: throw expr;
            }
        } catch (error_node) {
            console.log(error_node);
            debugger
            parser.throw_unexpected_refine(node, error_node);
        }

        init(node, pattern, initializer);
    }
};
