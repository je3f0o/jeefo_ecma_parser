/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : async_arrow_function.js
* Created at  : 2019-08-27
* Updated at  : 2019-09-07
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

const { ASYNC_ARROW_FUNCTION }      = require("../enums/precedence_enum");
const { get_last_non_comment_node } = require("../../helpers");
const {
    expression,
    async_arrow_function,
} = require("../enums/states_enum");

module.exports = {
    id         : "Async arrow function",
    type       : "Expression",
    precedence : ASYNC_ARROW_FUNCTION,

    is         : (_, { current_state : s }) => s === async_arrow_function,
    initialize : (node, token, parser) => {
        const { keyword, args } = get_last_non_comment_node(parser);

        parser.prepare_next_state("punctuator", true);
        const arrow_token = parser.generate_next_node();

        const prev_suffix = parser.suffixes;
        parser.suffixes = ["await"];

        const parameters = parser.refine("arrow_parameters", args);

        parser.prepare_next_state("async_concise_body", true);
        const body = parser.generate_next_node();

        node.keyword     = keyword;
        node.parameters  = parameters;
        node.arrow_token = arrow_token;
        node.body        = body;
        node.start       = keyword.start;
        node.end         = body.end;

        parser.suffixes      = prev_suffix;
        parser.current_state = expression;
    }
};
