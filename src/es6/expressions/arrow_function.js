/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : arrow_function.js
* Created at  : 2019-08-12
* Updated at  : 2020-09-01
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

const {EXPRESSION} = require("../enums/precedence_enum");
const {expression} = require("../enums/states_enum");
const {
    is_arrow_token,
    has_no_line_terminator,
    get_last_non_comment_node,
} = require("../../helpers");

const cover_id = "Cover parenthesized expression and arrow parameter list";

module.exports = {
    id         : "Arrow function",
    type       : "Arrow function definitions",
    precedence : EXPRESSION,

    is (token, parser) {
        if (parser.current_state === expression && is_arrow_token(token)) {
            const last = get_last_non_comment_node(parser);
            if (! last) return;
            switch (last.id) {
                case "Identifier reference" :
                case cover_id : return has_no_line_terminator(last, token);
                default: parser.throw_unexpected_token();
            }
        }
    },
    initialize (node, token, parser) {
        parser.change_state("punctuator");
        const arrow_token = parser.generate_next_node();

        const last = get_last_non_comment_node(parser);
        const parameters = parser.refine("arrow_parameters", last);

        parser.prepare_next_state("concise_body", true);
        const body = parser.generate_next_node();

        node.parameters  = parameters;
        node.arrow_token = arrow_token;
        node.body        = body;
        node.start       = parameters.start;
        node.end         = body.end;

        parser.terminate(node);
    }
};
