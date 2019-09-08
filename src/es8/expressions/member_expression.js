/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : member_expression.js
* Created at  : 2019-09-03
* Updated at  : 2019-09-08
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

const { MEMBER_EXPRESSION }         = require("../enums/precedence_enum");
const { get_last_non_comment_node } = require("../../helpers");
const {
    expression,
    member_expression,
} = require("../enums/states_enum");

const is_null = expr => {
    return expr.id === "Literal" && expr.expression.id === "Null literal";
};

module.exports = {
    id         : "Member expression",
    type       : "Expression",
    precedence : MEMBER_EXPRESSION,
    is         : (_, { current_state : s }) => s === member_expression,

    initialize (node, token, parser) {
        const expr = get_last_non_comment_node(parser);
        node.expression  = expr;
        node.start       = expr.start;
        node.end         = expr.end;

        parser.end(node);
        parser.current_state = expression;
    },

    refine (node, expression, parser) {
        switch (expression.id) {
            case "Meta property"  :
            case "Super property" : break;
            case "Primary expression" :
                if (is_null(expression.expression)) {
                    parser.throw_unexpected_token(
                        "Cannot read property of null"
                    );
                }
                break;
            default:
                parser.throw_unexpected_refine(node, expression);
        }

        node.expression = expression;
        node.start      = expression.start;
        node.end        = expression.end;
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
            return this.expression.is_valid_simple_assignment_target(parser);
        }
    }
};
