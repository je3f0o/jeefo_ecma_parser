/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : computed_member_expression.js
* Created at  : 2019-03-19
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

const {expression}        = require("../enums/states_enum");
const {MEMBER_EXPRESSION} = require("../enums/precedence_enum");
const {
    is_open_square_bracket: is_open_sqr,
    get_last_non_comment_node,
} = require("../../helpers");

module.exports = {
    id         : "Computed member expression",
	type       : "Member expression",
	precedence : MEMBER_EXPRESSION,

    is (token, parser) {
        if (parser.current_state === expression && is_open_sqr(parser)) {
            const last = get_last_non_comment_node(parser);
            return last && [
                "Call expression",
                "Member expression",
                "Primary expression"
            ].includes(last.type);
        }
    },

	initialize (node, token, parser) {
        const object = get_last_non_comment_node(parser, true);

        parser.change_state("computed_member_access");
        const member = parser.generate_next_node();

        node.object = object;
        node.member = member;
        node.start  = object.start;
        node.end    = member.end;
        parser.current_state = expression;
    },
};
