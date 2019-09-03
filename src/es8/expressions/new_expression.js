/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : new_expression.js
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

const { MEMBER_EXPRESSION }         = require("../enums/precedence_enum");
const { get_last_non_comment_node } = require("../../helpers");
const {
    expression,
    new_expression,
} = require("../enums/states_enum");

module.exports = {
    id         : "New expression",
    type       : "Expression",
    precedence : MEMBER_EXPRESSION,

    is (token, parser) {
        return parser.current_state === new_expression;
    },

    initialize (node, token, parser) {
        const last_expr = get_last_non_comment_node(parser);
        node.expression = last_expr;
        node.start      = last_expr.start;
        node.end        = last_expr.end;

        parser.end(node);
        parser.current_state = expression;
    },

    refine (node, parser) {
        switch (node.id) {
            case "Meta property"      :
            case "Super property"     :
            case "Primary expression" :
                parser.change_state("member_expression", false);
                node = parser.next_node_definition.refine(
                    node, parser
                );
                break;
            case "Member expression" : break;
            default:
                parser.throw_unexpected_token(
                    `Unexpected NewExpression refine: ${ node.id }`, node
                );
        }
        const new_member = new this.AST_Node();
        new_member.expression = node;
        new_member.start      = node.start;
        new_member.end        = node.end;
        return new_member;
    },

    protos : {
        is_valid_simple_assignment_target () { return true; }
    }
};
