/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : new_member_expression.js
* Created at  : 2020-08-23
* Updated at  : 2020-08-23
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

const { NEW_MEMBER_EXPRESSION }   = require("../enums/precedence_enum");
const { get_last_non_comment_node } = require("../../helpers");
const {
    member_expression,
    new_member_expression,
} = require("../enums/states_enum");

module.exports = {
    id         : "New member expression",
    type       : "Expression",
    precedence : NEW_MEMBER_EXPRESSION,
    is         : (_, {current_state:s}) => s === new_member_expression,

    initialize (node, token, parser) {
        const expr = get_last_non_comment_node(parser);

        parser.change_state("arguments_state");
        const args = parser.generate_next_node();

        node.keyword    = expr.keyword;
        node.expression = expr.expression;
        node.arguments  = args;
        node.start      = expr.keyword.start;
        node.end        = args.end;

        parser.end(node);
        parser.current_state = member_expression;
    },

    refine (node, expression, parser) {
        console.log(expression);
        console.log("HELLOO new OP ?????");
        process.exit();
        switch (expression.id) {
            case "Meta property"      :
            case "Super property"     :
            case "Primary expression" :
                expression = parser.refine("member_expression", expression);
                break;
            case "Member expression" : break;
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
