/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : this_keyword.js
* Created at  : 2019-09-04
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

const {EXPRESSION}      = require("../enums/precedence_enum");
const {expression}      = require("../enums/states_enum.js");
const {get_pre_comment} = require("../../helpers");

module.exports = {
    id         : "This keyword",
	type       : "Primary expression",
	precedence : EXPRESSION,

    is         : (_, {current_state: s}) => s === expression,
	initialize : (node, token, parser) => {
        node.pre_comment = get_pre_comment(parser);
        node.value       = "this";
        node.start       = token.start;
        node.end         = token.end;
    },
};
