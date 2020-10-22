/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : numeric_literal.js
* Created at  : 2019-09-04
* Updated at  : 2020-08-31
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

const {EXPRESSION} = require("../enums/precedence_enum");
const {expression} = require("../enums/states_enum.js");
const {
    get_pre_comment,
    get_last_non_comment_node,
} = require("../../helpers");

module.exports = {
    id         : "Numeric literal",
	type       : "Literal",
	precedence : EXPRESSION,

    is : ({id}, parser) => (
        parser.current_state === expression
        && id === "Number" &&
        get_last_non_comment_node(parser) === null
    ),

	initialize (node, token, parser) {
        node.pre_comment = get_pre_comment(parser);
        node.value       = token.value;
        node.number_type = token.type;
        node.start       = token.start;
        node.end         = token.end;
    },
};
