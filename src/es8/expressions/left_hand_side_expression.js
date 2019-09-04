/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : left_hand_side_expression.js
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
const { left_hand_side_expression } = require("../enums/states_enum");

module.exports = {
    id         : "Left hand side expression",
    type       : "Expression",
    precedence : EXPRESSION,

    is (token, parser) {
        return parser.current_state === left_hand_side_expression;
    },

    initialize () {},

    refine (node, expression, parser) {
        switch (expression.id) {
            case "Super property"     :
            case "Member expression"  :
            case "Primary expression" :
                expression = parser.refine("new_expression", expression);
                break;
            case "New expression"  :
            case "Call expression" : break;
            default:
                parser.throw_unexpected_refine(node, expression);
        }

        node.expression = expression;
        node.start      = expression.start;
        node.end        = expression.end;
    },

    protos : {
        is_valid_simple_assignment_target (parser) {
            return this.expression.is_valid_simple_assignment_target(parser);
        }
    }
};
