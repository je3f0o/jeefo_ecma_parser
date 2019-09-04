/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : numeric_literal.js
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

const { EXPRESSION }          = require("../enums/precedence_enum");
const { get_pre_comment }     = require("../../helpers");
const { expression, literal } = require("../enums/states_enum.js");

module.exports = {
    id         : "Numeric literal",
	type       : "Expression",
	precedence : EXPRESSION,

    is (token, parser) {
        return parser.current_state === expression && token.id === "Number";
    },
	initialize (node, token, parser) {
        node.pre_comment = get_pre_comment(parser);
        node.value       = token.value;
        node.number_type = token.type;
        node.start       = token.start;
        node.end         = token.end;

        parser.ending_index -= 1;
        parser.current_state = literal;
    },
};
