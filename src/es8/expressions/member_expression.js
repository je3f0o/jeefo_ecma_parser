/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : member_expression.js
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
    member_expression,
} = require("../enums/states_enum");

module.exports = {
    id         : "Member expression",
    type       : "Expression",
    precedence : MEMBER_EXPRESSION,

    is (token, parser) {
        return parser.current_state === member_expression;
    },
    initialize (node, token, parser) {
        const expr = get_last_non_comment_node(parser);
        node.expression  = expr;
        node.start       = expr.start;
        node.end         = expr.end;

        parser.end(node);
        parser.current_state = expression;
    },

    refine (node, parser) {
        switch (node.id) {
            case "Meta property"      :
            case "Super property"     :
            case "Primary expression" : break;
            default:
                parser.throw_unexpected_token(
                    `Unexpected member expression refine: ${ node.id }`,
                    node
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
