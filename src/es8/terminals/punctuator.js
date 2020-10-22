/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : punctuator.js
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

const {TERMINAL_SYMBOL} = require("../enums/precedence_enum");
const {get_pre_comment} = require("../../helpers");

module.exports = {
    id         : "Punctuator",
    type       : "Terminal symbol token",
	precedence : TERMINAL_SYMBOL,

    is: ({id}) => [
        "Rest",
        "Arrow",
        "Slash",
        "Operator",
        "Delimiter",
    ].includes(id),

	initialize (node, token, parser) {
        node.pre_comment = get_pre_comment(parser);
        node.value       = token.value;
        node.start       = token.start;
        node.end         = token.start;
    },
};
