/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : object_binding_pattern.js
* Created at  : 2019-09-05
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

const { EXPRESSION }             = require("../enums/precedence_enum");
const { object_binding_pattern } = require("../enums/states_enum");

module.exports = {
    id         : "Object binding pattern",
	type       : "Expression",
	precedence : EXPRESSION,
    is         : (_, { current_state : s }) => s === object_binding_pattern,

	initialize (node, token, parser) {
        parser.change_state("expression");
        // Trick to skip object validation in ObjectLiteral
        parser.context_stack.push("Object literal");
        const object_literal = parser.generate_next_node();
        parser.context_stack.pop();

        this.refine(node, object_literal, parser);
    },

    refine : (node, expression, parser) => {
        let list;
        switch (expression.id) {
            case "Object literal" :
                list = expression.property_definition_list;
                break;
            case "Object assignment pattern" :
                list = expression.property_list;
                break;
            default :
                parser.throw_unexpected_refine(node, expression);
        }
        const {
            delimiters,
            open_curly_bracket  : open,
            close_curly_bracket : close,
        } = expression;

        const property_list = list.map(property => {
            return parser.refine("binding_property", property);
        });

        node.open_curly_bracket  = open;
        node.property_list       = property_list;
        node.delimiters          = delimiters;
        node.close_curly_bracket = close;
        node.start               = open.start;
        node.end                 = close.end;
    }
};
