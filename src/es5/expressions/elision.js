/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : elision.js
* Created at  : 2019-09-05
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

const {elision}         = require("../enums/states_enum");
const {TERMINAL_SYMBOL} = require("../enums/precedence_enum");
const {get_pre_comment} = require("../../helpers");

module.exports = {
    id         : "Elision",
    type       : "Terminal symbol token",
    precedence : TERMINAL_SYMBOL,

    is         : (_, {current_state: s}) => s === elision,
    initialize : (node, token, parser) => {
        node.pre_comment = get_pre_comment(parser);
        node.start       = token.start;
        node.end         = token.end;
    }
};
