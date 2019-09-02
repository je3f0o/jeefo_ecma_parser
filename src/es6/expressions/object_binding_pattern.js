/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : object_binding_pattern.js
* Created at  : 2019-08-24
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

const { AST_Node_Definition }       = require("@jeefo/parser");
const { EXPRESSION }                = require("../enums/precedence_enum");
const { object_binding_pattern }    = require("../enums/states_enum");
const { single_name_binding }       = require("../nodes");
const { get_last_non_comment_node } = require("../../helpers");

const refine_assignment_operator = require(
    "../helpers/refine_assignment_operator"
);

const generate_binding_element = (node, parser) => {
    switch (node.id) {
        case "Identifier" :
            parser.prev_node = {
                identifier  : node,
                initializer : null
            };
            return single_name_binding.generate_new_node(parser);
        case "Assignment expression":
            return refine_assignment_operator(node, parser);
        case "Array literal" :
        case "Object literal" :
            parser.prev_node = node;
            parser.previous_nodes.push(node);
            parser.change_state("binding_pattern");
            return parser.generate_next_node();
        default:
            parser.throw_unexpected_token(null, node);
    }
};

const binding_property = new AST_Node_Definition({
    id         : "Binding property",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : (node, token, parser) => {
        const { property_name, delimiter, expression } = parser.prev_node;

        const element = generate_binding_element(expression, parser);

        node.property_name   = property_name;
        node.delimiter       = delimiter;
        node.binding_element = element;
        node.start           = property_name.start;
        node.end             = element.end;
    }
});

module.exports = {
    id         : "Object binding pattern",
    type       : "Expression",
    precedence : EXPRESSION,

    is (token, parser) {
        return parser.current_state === object_binding_pattern;
    },
    initialize (node, token, parser) {
        const { prev_state } = parser;
        const {
            open_curly_bracket,
            properties,
            delimiters,
            close_curly_bracket
        } = get_last_non_comment_node(parser);

        const property_list = properties.map(property => {
            parser.prev_node = property;
            switch (property.id) {
                case "Identifier reference" :
                    parser.prev_node = {
                        identifier  : property,
                        initializer : null
                    };
                    return single_name_binding.generate_new_node(parser);
                case "Cover initialized name" :
                    parser.prev_node = {
                        identifier  : property.identifier_reference,
                        initializer : property.initializer
                    };
                    return single_name_binding.generate_new_node(parser);
                case "Property assignment" :
                    return binding_property.generate_new_node(parser);
                default:
                    parser.throw_unexpected_token(null, property);
            }
        });

        node.open_curly_bracket  = open_curly_bracket;
        node.property_list       = property_list;
        node.delimiters          = delimiters;
        node.close_curly_bracket = close_curly_bracket;
        node.start               = open_curly_bracket.start;
        node.end                 = close_curly_bracket.end;

        parser.ending_index  = node.end.index;
        parser.current_state = prev_state;
    }
};
