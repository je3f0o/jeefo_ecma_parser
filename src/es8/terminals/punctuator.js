/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : punctuator.js
* Created at  : 2019-09-03
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

const { punctuator }      = require("../enums/states_enum");
const { TERMINAL_SYMBOL } = require("../enums/precedence_enum");

const valid_tokens = [
    "Rest",
    "Arrow",
    "Operator",
    "Delimiter",
];

module.exports = {
    id         : "Punctuator",
    type       : "Terminal symbol token",
	precedence : TERMINAL_SYMBOL,

    is (token, { current_state }) {
        return current_state === punctuator && valid_tokens.includes(token.id);
    },
	initialize (node, token) {
        node.value = token.value;
        node.start = token.start;
        node.end   = token.start;
    },
};
