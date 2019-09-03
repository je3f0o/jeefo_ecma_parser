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

    refine (expression, parser) {
        switch (expression.id) {
            /*
            case "Super call"        :
            case "New target"        :
            case "Meta property"     :
            case "New expression"    :
            case "Call expression"   :
                parser.change_state("member_expression", false);
                expression = parser.next_node_definition.refine(
                    expression, parser
                );
                break;
            */
            case "Super property"     :
            case "Member expression"  :
            case "Primary expression" :
                parser.change_state("new_expression", false);
                expression = parser.next_node_definition.refine(
                    expression, parser
                );
                break;
            case "New expression"  :
            case "Call expression" : break;
            default:
                parser.throw_unexpected_token(
                    `Unexpected LeftHandSideExpression refine: ${
                        expression.id
                    }`,
                    expression
                );
        }

        const new_node = new this.AST_Node();
        new_node.expression = expression;
        new_node.start      = expression.start;
        new_node.end        = expression.end;

        return new_node;
    },

    protos : {
        is_valid_simple_assignment_target (parser) {
            return this.expression.is_valid_simple_assignment_target(parser);
        }
    }
};
