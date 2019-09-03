/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : primary_expression.js
* Created at  : 2019-09-03
* Updated at  : 2019-09-04
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

const { EXPRESSION }                = require("../enums/precedence_enum");
const { get_last_non_comment_node } = require("../../helpers");
const {
    expression,
    primary_expression,
} = require("../enums/states_enum");
/*
const {
    is_asterisk,
    is_identifier_value,
    has_no_line_terminator,
} = require("../../helpers");

const is_async_function = (token, next_token) => {
    // TODO: later figure out do i need to require
    // next_token `look_ahead(true)`
    if (next_token && is_identifier_value(next_token, "function")) {
        return has_no_line_terminator(token, next_token);
    }
};
*/

module.exports = {
    id         : "Primary expression",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, parser) => parser.current_state === primary_expression,
    initialize : (node, token, parser) => {
        const last_expr = get_last_non_comment_node(parser);
        switch (last_expr.id) {
            // Identifiers
            case "Identifier reference"      :
            // Functions
            case "Function expression"       :
            case "Generator expression"      :
            case "Async function expression" :
                break;
                    /*
                switch (expression.value) {
                    case "this" :
                        parser.change_state("keyword");
                        break;
                    case "class" :
                        parser.change_state("class_expression");
                        break;
                    case "function" : {
                        const next_node = parser.look_ahead(true);
                        if (is_asterisk(next_node)) {
                            parser.change_state("generator_expression");
                        } else {
                            parser.change_state("function_expression");
                        }
                    }
                    break;
                    case "async" : {
                        // TODO: later figure out do i need to require
                        // next_token `look_ahead(true)`
                        const next_token = parser.look_ahead();
                        if (is_async_function(token, next_token)) {
                            parser.change_state("async_function_expression");
                        } else {
                            parser.change_state("identifier_reference");
                        }
                    }
                    break;
                    default:
                        parser.change_state("identifier_reference", false);
                }
                    */
            default:
                parser.throw_unexpected_token(
                    `Invalid expression in primary_expression: ${
                        last_expr.id
                    }`, last_expr
                );
        }

        node.expression = last_expr;
        node.start      = last_expr.start;
        node.end        = last_expr.end;

        parser.end(node);
        parser.current_state = expression;
    },

    protos : {
        is_valid_simple_assignment_target (parser) {
            return this.expression.is_valid_simple_assignment_target(parser);
        }
    }
};
