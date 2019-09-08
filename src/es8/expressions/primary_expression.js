/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : primary_expression.js
* Created at  : 2019-09-03
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

const { EXPRESSION }                     = require("../enums/precedence_enum");
const { expression, primary_expression } = require("../enums/states_enum");

module.exports = {
    id         : "Primary expression",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, { current_state : s }) => s === primary_expression,
    initialize : (node, token, parser) => {
        const { prev_node } = parser;
        switch (prev_node.id) {
            // Primitives
            case "Literal"                   :
            case "This keyword"              :
            case "Array literal"             :
            case "Object literal"            :
            case "Template literal"          :
            case "Identifier reference"      :
            // Cover parenthesized expression
            case "Grouping expression"       :
            // Functions
            case "Function expression"       :
            case "Generator expression"      :
            case "Async function expression" :
                break;
            default:
            console.log(prev_node);
            process.exit();
                parser.throw_unexpected_token(
                    `Invalid expression in primary_expression: ${
                        prev_node.id
                    }`, prev_node
                );
        }

        node.expression = prev_node;
        node.start      = prev_node.start;
        node.end        = prev_node.end;

        parser.end(node);
        parser.current_state = expression;
    },

    protos : {
        is_valid_simple_assignment_target (parser) {
            if (! this.expression.is_valid_simple_assignment_target) {
                parser.throw_unexpected_token(
                    `${
                        this.expression.constructor.name
                    }.IsValidSimpleAssignmentTarget() is not implemented in: ${
                        this.constructor.name
                    }.IsValidSimpleAssignmentTarget()`
                );
            }
            // 12.2.1.5 - Static Semantics: IsValidSimpleAssignmentTarget
            /* Speed is not constant this way
             *
            switch (this.expression.id) {
                case "Literal"                    :
                case "This keyword"               :
                case "Array literal"              :
                case "Object literal"             :
                case "Template literal"           :
                case "Class expression"           :
                case "Function expression"        :
                case "Generator expression"       :
                case "Async function expression"  :
                case "Regular expression literal" :
                    return false;
            }
            */
            return this.expression.is_valid_simple_assignment_target(parser);
        }
    }
};
