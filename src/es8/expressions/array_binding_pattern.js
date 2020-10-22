/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : array_binding_pattern.js
* Created at  : 2019-09-03
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

const { EXPRESSION }            = require("../enums/precedence_enum");
const { array_binding_pattern } = require("../enums/states_enum");

module.exports = {
    id         : "Array binding pattern",
	type       : "Expression",
	precedence : EXPRESSION,
    is         : (_, {current_state: s}) => s === array_binding_pattern,

	initialize (node, token, parser) {
        parser.change_state("expression");
        this.refine(node, parser.generate_next_node(), parser);
    },

	refine (node, expression, parser) {
        let list;
        switch (expression.id) {
            case "Array literal" :
            case "Array assignment pattern" :
                list = expression.element_list;
                break;
            default :
                parser.throw_unexpected_refine(node, expression);
        }
        const {
            delimiters,
            open_square_bracket  : open,
            close_square_bracket : close,
        } = expression;

        const element_list = list.map(element => {
            switch (element.id) {
                case "Assignment rest element" :
                    return parser.refine("binding_rest_element", element);

            }
            return parser.refine("binding_element", element);
        });

        node.open_square_bracket  = open;
        node.element_list         = element_list;
        node.delimiters           = delimiters;
        node.close_square_bracket = close;
        node.start                = open.start;
        node.end                  = close.end;
    },
};
