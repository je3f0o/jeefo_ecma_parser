/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : array_binding_pattern.js
* Created at  : 2019-08-24
* Updated at  : 2019-08-28
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
const { binding_pattern } = require("../enums/states_enum");
const {
    single_name_binding,
    binding_rest_element,
} = require("../nodes");

const refine_assignment_operator = require(
    "../helpers/refine_assignment_operator"
);

module.exports = {
    id         : "Array binding pattern",
    type       : "Expression",
    precedence : EXPRESSION,

    is : (token, parser) => {
        if (parser.current_state === binding_pattern) {
            return parser.prev_node.id === "Array literal";
        }
    },
    initialize : (node, token, parser) => {
        const { prev_state } = parser;
        const {
            open_square_bracket,
            element_list,
            delimiters,
            close_square_bracket
        } = parser.prev_node;

        const list = element_list.map(element => {
            parser.prev_node = element;
            switch (element.id) {
                case "Identifier" :
                    parser.prev_node = {
                        identifier  : element,
                        initializer : null
                    };
                    return single_name_binding.generate_new_node(parser);
                case "Assignment expression" :
                    return refine_assignment_operator(element, parser);
                case "Spread element" :
                    parser.prev_node = element;
                    return binding_rest_element.generate_new_node(parser);
                case "Array literal"  :
                case "Object literal" :
                    parser.prev_node = element;
                    parser.previous_nodes.push(element);
                    parser.change_state("binding_pattern");
                    return parser.generate_next_node();
                default:
                    parser.throw_unexpected_token(null, element);
            }
        });

        node.open_square_bracket  = open_square_bracket;
        node.property_list        = list;
        node.delimiters           = delimiters;
        node.close_square_bracket = close_square_bracket;
        node.start                = open_square_bracket.start;
        node.end                  = close_square_bracket.end;

        parser.ending_index  = node.end.index;
        parser.current_state = prev_state;
    }
};
