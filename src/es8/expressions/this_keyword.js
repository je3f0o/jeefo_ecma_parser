/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : this_keyword.js
* Created at  : 2019-09-04
* Updated at  : 2019-09-14
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

const { EXPRESSION }                     = require("../enums/precedence_enum");
const { get_pre_comment }                = require("../../helpers");
const { expression, primary_expression } = require("../enums/states_enum.js");

module.exports = {
    id         : "This keyword",
	type       : "Expression",
	precedence : EXPRESSION,

    is         : (_, parser) => parser.current_state === expression,
	initialize : (node, token, parser) => {
        node.pre_comment = get_pre_comment(parser);
        node.value       = "this";
        node.start       = token.start;
        node.end         = token.end;

        parser.ending_index -= 1;
        parser.current_state = primary_expression;
    },

    protos : {
        is_valid_simple_assignment_target () { return false; }
    }
};
