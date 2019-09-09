/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : null_literal.js
* Created at  : 2019-09-04
* Updated at  : 2019-09-09
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

const { EXPRESSION }          = require("../enums/precedence_enum");
const { get_pre_comment }     = require("../../helpers");
const { expression, literal } = require("../enums/states_enum.js");

module.exports = {
    id         : "Null literal",
	type       : "Expression",
	precedence : EXPRESSION,

    is         : (_, parser) => parser.current_state === expression,
	initialize : (node, token, parser) => {
        node.pre_comment = get_pre_comment(parser);
        node.value       = token.value;
        node.start       = token.start;
        node.end         = token.end;

        parser.ending_index -= 1;
        parser.current_state = literal;
    },
};
