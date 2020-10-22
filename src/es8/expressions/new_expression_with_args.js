/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : new_expression_with_args.js
* Created at  : 2020-08-23
* Updated at  : 2020-09-01
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

const {NEW_WITH_ARGS}              = require("../enums/precedence_enum");
const {get_last_non_comment_node}  = require("../../helpers");
const {expression, new_expression} = require("../enums/states_enum");

module.exports = {
    id         : "New operator with arguments",
    type       : "Member expression",
    precedence : NEW_WITH_ARGS,
    is         : (_, {current_state: s}) => s === new_expression,

    initialize (node, token, parser) {
        const prev = get_last_non_comment_node(parser);
        parser.change_state("arguments_state");

        node.keyword    = prev.keyword;
        node.expression = prev.expression;
        node.arguments  = parser.generate_next_node();
        node.start      = prev.start;
        node.end        = node.arguments.end;

        parser.end(node);
        parser.current_state = expression;
    },

    refine (node, expression, parser) {
        switch (expression.id) {
            case "Member expression" : break;
            case "Primary expression":
                expression = parser.refine("member_expression", expression);
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
            return this.expression.is_valid_simple_assignment_target(parser);
        }
    }
};
