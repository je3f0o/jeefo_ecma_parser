/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : new_expression.js
* Created at  : 2019-09-03
* Updated at  : 2020-09-09
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

const {NEW_WITHOUT_ARGS}       = require("../enums/precedence_enum");
const {expression, new_target} = require("../enums/states_enum");
const {
    is_operator_token,
    is_delimiter_token,
    is_identifier_token,
    get_last_non_comment_node,
} = require("../../helpers");

module.exports = {
    id         : "New operator without arguments",
    type       : "New expression",
    precedence : NEW_WITHOUT_ARGS,

    is (_, parser) {
        if (parser.current_state === expression) {
            const next_token = parser.look_ahead(true);
            if (next_token && is_operator_token(next_token, '.')) {
                parser.current_state = new_target;
            } else {
                return true;
            }
        }
    },

    initialize (node, token, parser) {
        parser.expect("new", is_identifier_token(token, "new"));
        parser.change_state("keyword");
        const keyword = parser.generate_next_node();

        parser.new_operator = true;
        parser.prepare_next_state("expression", true);
        parser.parse_next_node(NEW_WITHOUT_ARGS);
        const expr = get_last_non_comment_node(parser, true);
        parser.new_operator = false;

        node.keyword    = keyword;
        node.expression = expr;
        node.start      = keyword.start;
        node.end        = expr.end;

        if (parser.is_terminated) {
            const next_token = parser.look_ahead();
            if (next_token && is_delimiter_token(next_token, '(')) {
                parser.is_terminated = false;
                parser.change_state("new_expression");
                parser.prepare_next_node_definition();
                parser.prepare_next_node = false;
            }
        } else {
            parser.current_state = expression;
        }
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
