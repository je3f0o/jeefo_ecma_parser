/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : super_call.js
* Created at  : 2019-09-08
* Updated at  : 2019-09-08
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

const { CALL_EXPRESSION }             = require("../enums/precedence_enum");
const { super_call, call_expression } = require("../enums/states_enum");

module.exports = {
    id         : "Super call",
    type       : "Expression",
    precedence : CALL_EXPRESSION,
    is         : (_, { current_state : s }) => s === super_call,

    initialize (node, token, parser) {
        parser.change_state("keyword");
        const keyword = parser.generate_next_node();

        parser.prepare_next_state("arguments_state", true);
        const args = parser.generate_next_node();

        node.keyword   = keyword;
        node.arguments = args;
        node.start     = keyword.start;
        node.end       = args.end;

        parser.current_state = call_expression;
    },

    protos : {
        is_valid_simple_assignment_target () { return false; }
    }
};
