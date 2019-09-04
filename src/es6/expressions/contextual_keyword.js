/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : contextual_keyword.js
* Created at  : 2019-09-04
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

const { TERMINAL_SYMBOL }    = require("../enums/precedence_enum");
const { get_pre_comment }    = require("../../helpers");
const { contextual_keyword } = require("../enums/states_enum");

const keywords = [
    "async", "static", "get", "set"
];

module.exports = {
    id         : "Contextual keyword",
    type       : "Terminal symbol token",
    precedence : TERMINAL_SYMBOL,

    is (token, { current_state }) {
        if (current_state === contextual_keyword) {
            return token.id === "Identifier" && keywords.includes(token.value);
        }
    },
    initialize (node, token, parser) {
        node.pre_comment = get_pre_comment(parser);
        node.value       = token.value;
        node.start       = token.start;
        node.end         = token.end;
    },
};
