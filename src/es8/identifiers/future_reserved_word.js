/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : future_reserved_word.js
* Created at  : 2020-08-29
* Updated at  : 2020-08-29
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

const {IDENTIFIER}           = require("../enums/precedence_enum");
const {get_pre_comment}      = require("../../helpers");
const {future_reserved_word} = require("../enums/states_enum");

const keywords = [
    "enum",
];
const strict_mode_keywords = [
    "implements interface",
    "package private protected public",
].reduce((result, value) => result.concat(value.split(' ')), []);

module.exports = {
    id         : "Future reserved word",
    type       : "Names and Keywords",
    precedence : IDENTIFIER,

    is (token, {current_state, context_stack}) {
        if (current_state !== future_reserved_word) return;
        if (keywords.includes(token.value)) return true;

        const is_strict_mode_keyword = (
            context_stack.includes("strict mode") &&
            strict_mode_keywords.includes(token.value)
        );
        if (is_strict_mode_keyword) {
            token.is_strict = true;
            return true;
        }
    },
};
