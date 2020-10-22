/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : left_hand_side_expression.js
* Created at  : 2020-08-23
* Updated at  : 2020-08-29
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

const {LEFT_HAND_SIDE_EXPRESSION} = require("../enums/precedence_enum");

const valid_lhs_expression_types = [
    "Member expression",
    "Primary expression",
];

class LeftHandSideExpression {
    is_valid_simple_assignment_target (node, parser) {
        if (node.left < LEFT_HAND_SIDE_EXPRESSION) return;

        switch (node.type) {
            case "Member expression" :
                return true;
            case "Primary expression" :
                return node.id === "Identifier reference";
            //case "Assignment pattern" :
                //return true;
            default:
                debugger
                parser.throw_unexpected_token("Unexpected lvalue");
        }
    }

    is_destructuring_target (node) {
        return node.id === "Assignment pattern";
    }

    is_valid_lhs_expr (expression) {
        if (! valid_lhs_expression_types.includes(expression.type)) {
            debugger
        }
        return valid_lhs_expression_types.includes(expression.type);
    }
}

module.exports = new LeftHandSideExpression();
