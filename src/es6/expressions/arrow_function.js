/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : arrow_function.js
* Created at  : 2019-08-12
* Updated at  : 2019-12-14
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/6.0/#sec-arrow-function-definitions
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { EXPRESSION } = require("../enums/precedence_enum");
const { expression } = require("../enums/states_enum");
const {
    is_arrow_token,
    has_no_line_terminator,
    get_last_non_comment_node,
} = require("../../helpers");

module.exports = {
    id         : "Arrow function",
    type       : "Expression",
    precedence : EXPRESSION,

    is (token, parser) {
        if (parser.current_state === expression && is_arrow_token(token)) {
            const last_node = get_last_non_comment_node(parser);
            return last_node && has_no_line_terminator(last_node, token);
        }
    },
    initialize (node, token, parser) {
        const last_node = get_last_non_comment_node(parser);

        parser.change_state("punctuator");
        const arrow_token = parser.generate_next_node();

        const parameters = parser.refine("arrow_parameters", last_node);

        parser.prepare_next_state("concise_body", true);
        const body = parser.generate_next_node();

        node.parameters  = parameters;
        node.arrow_token = arrow_token;
        node.body        = body;
        node.start       = parameters.start;
        node.end         = body.end;

        parser.end(node);
        parser.current_state = expression;
    }
};
