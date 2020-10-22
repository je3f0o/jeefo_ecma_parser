/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : string_literal.js
* Created at  : 2019-09-04
* Updated at  : 2020-09-01
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
    id         : "String literal",
	type       : "Literal",
	precedence : EXPRESSION,

    is : ({id}, {current_state: s}) => s === expression && id === "String",

	initialize (node, token, parser) {
        node.pre_comment = get_pre_comment(parser);
        node.value       = token.value;
        node.quote       = token.quote;
        node.start       = token.start;
        node.end         = token.end;
    },
};
