/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : labelled_statement.js
* Created at  : 2017-08-17
* Updated at  : 2020-09-09
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-12.12
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const {statement}              = require("../enums/states_enum");
const {STATEMENT, TERMINATION} = require("../enums/precedence_enum");
const {
    is_delimiter_token,
    get_last_non_comment_node,
} = require("../../helpers");

module.exports = {
    id         : "Labelled statement",
    type       : "Statement",
	precedence : STATEMENT,

    is ({id}, parser) {
        if (parser.current_state === statement && id === "Identifier") {
            const next_token = parser.look_ahead();
            return next_token && is_delimiter_token(next_token, ':');
        }
    },
    initialize (node, token, parser) {
        parser.change_state("label_identifier");
        const label = parser.generate_next_node();

        parser.prepare_next_state("punctuator", true);
        const colon = parser.generate_next_node();

        parser.prepare_next_state("statement", true);
        parser.parse_next_node(TERMINATION);
        const item = get_last_non_comment_node(parser, true);

        node.label  = label;
        node.colon  = colon;
        node.item   = item;
        node.start  = label.start;
        node.end    = item.end;
    }
};
