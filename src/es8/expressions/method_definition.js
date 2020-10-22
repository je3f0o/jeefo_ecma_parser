/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : method_definition.js
* Created at  : 2019-09-07
* Updated at  : 2020-09-08
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

const {STRUCTURE} = require("../enums/precedence_enum");
const {
    method_definition,
    method_definition_async,
    method_definition_getter,
    method_definition_setter,
    method_definition_generator,
} = require("../enums/states_enum");
const {
    is_asterisk_token,
    is_delimiter_token,
    get_last_non_comment_node,
} = require("../../helpers");

const is_special_word = ({id, value}) =>
    id === "Identifier name" && ["get", "set", "async"].includes(value);

const parse_special_word = parser => {
};

module.exports = {
    id         : "Method definition",
    type       : "Method definitions",
    precedence : STRUCTURE,
    is         : (_, {current_state: s}) => s === method_definition,

    initialize (node, token, parser) {
        if (is_asterisk_token(token)) {
            parser.change_state("generator_method");
        } else {
            const property_name = get_last_non_comment_node(parser, true);
            if (is_special_word(property_name.expression)) {
                const next_token = parser.look_ahead(true);
                if (is_delimiter_token(next_token, '(')) {
                    parser.change_state("method");
                } else {
                    switch (property_name.expression.value) {
                        case "get" :
                            parser.change_state("getter_method");
                            break;
                        case "set" :
                            parser.change_state("setter_method");
                            break;
                        case "async" :
                            parser.change_state("async_method");
                            break;
                    }
                }
            } else {
                parser.change_state("method");
            }
        }

        const method = parser.generate_next_node();
        node.method  = method;
        node.start   = method.start;
        node.end     = method.end;
    },

    refine (node, property_name, parser) {
        if (property_name.id !== "Property name") {
            parser.throw_unexpected_refine(node, property_name);
        }

        let expression_name;
        if (is_delimiter_token(parser.next_token, '(')) {
            expression_name = "method";
        } else if (property_name.expression.id === "Identifier name") {
            switch (property_name.expression.value) {
                case "get" :
                    expression_name = "getter_method";
                    break;
                case "set" :
                    expression_name = "setter_method";
                    break;
                case "async" :
                    if (is_delimiter_token(parser.next_token, '(')) {
                        expression_name = "method";
                    } else {
                        expression_name = "async_method";
                    }
                    break;
                default:
                    expression_name = "method";
            }
        } else {
            expression_name = "method";
        }
        const expression = parser.refine(expression_name, property_name);

        node.expression = expression;
        node.start      = expression.start;
        node.end        = expression.end;
    }
};
