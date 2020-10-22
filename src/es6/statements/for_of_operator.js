/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_of_operator.js
* Created at  : 2020-09-07
* Updated at  : 2020-09-07
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

const {STRUCTURE}                 = require("../enums/precedence_enum");
const {expression}                = require("../enums/states_enum");
const {get_last_non_comment_node} = require("../../helpers");

module.exports = {
    id         : "For of operator",
    type       : "Iteration statements",
    precedence : STRUCTURE,

    is (_, parser) {
        const {current_state: s, context_stack: cs} = parser;
        if (s === expression && cs.includes("For header")) {
            const last = get_last_non_comment_node(parser, true);
            parser.terminate(last);
        }
    },

    initialize (node, token, parser) {
        parser.throw_unexpected_token(`${node.id} should not be initialized.`);
    },
};
