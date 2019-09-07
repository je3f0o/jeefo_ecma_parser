/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : method_definition.js
* Created at  : 2019-09-07
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

const { EXPRESSION }        = require("../enums/precedence_enum");
const { method_definition } = require("../enums/states_enum");
const {
    is_asterisk_token,
    is_delimiter_token,
} = require("../../helpers");

module.exports = {
    id         : "Method definition",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, { current_state : s }) => s === method_definition,
    initialize : (node, token, parser) => {
        if (token.id === "Identifier") {
            switch (token.value) {
                case "get" :
                    parser.change_state("getter_method");
                    break;
                case "set" :
                    parser.change_state("setter_method");
                    break;
                case "async" :
                    parser.change_state("async_method");
                    break;
                default:
                    parser.change_state("method");
            }
        } else if (is_asterisk_token(token)) {
            parser.change_state("generator_method");
        } else {
            parser.change_state("method");
        }
        const expression = parser.generate_next_node();

        node.expression = expression;
        node.start      = expression.start;
        node.end        = expression.end;
    },

    refine (node, property_name, parser) {
        if (property_name.id !== "Property name") {
            parser.throw_unexpected_refine(node, property_name);
        }

        let expression_name;
        if (property_name.expression.id === "Identifier name") {
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
