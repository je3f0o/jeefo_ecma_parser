/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : computed_super_property.js
* Created at  : 2020-08-29
* Updated at  : 2020-09-10
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

const {MEMBER_EXPRESSION} = require("../enums/precedence_enum");
const {
    expression,
    computed_super_property,
} = require("../enums/states_enum");
const {
    is_identifier_token,
} = require("../../helpers");

module.exports = {
    id         : "Computed super property",
    type       : "Member expression",
    precedence : MEMBER_EXPRESSION,
    is         : (_, {current_state: s}) => s === computed_super_property,

    initialize (node, token, parser) {
        parser.expect("super", is_identifier_token(token, "super"));
        parser.change_state("keyword");
        const keyword = parser.generate_next_node();

        parser.prepare_next_state("computed_member_access", true);
        const member = parser.generate_next_node();

        node.keyword = keyword;
        node.member  = member;
        node.start   = keyword.start;
        node.end     = member.end;

        parser.end(node);
        parser.current_state = expression;
    }
};
