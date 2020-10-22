/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : preparation_handler.js
* Created at  : 2019-06-28
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

const ignore_comments = require("./helpers/ignore_comments");
const {
    is_close_curly,
    is_operator_token,
    is_delimiter_token,
} = require("../helpers");

module.exports = parser => {
    if (is_close_curly(parser)) return parser.terminate(parser.next_token);

    let prev_node = null, prev_token;
    if (parser.prev_node && parser.prev_node.id !== "Comment") {
        ({prev_node, prev_token} = parser);
    }
    ignore_comments(parser);
    const {next_token} = parser;
    if (! prev_node || ! next_token) return;

    // ASI
    // Ignored 'Do-while' loop statement here.
    // Because 'Do-while' loop handle ASI itself.
    let is_terminated;
    if (parser.ASI && prev_node.end.line < next_token.start.line) {
        const ctx = parser.context_stack[parser.context_stack.length - 1] || {};
        if (ctx.id === "Expression statement") {
            is_terminated = true;
        } else if (! parser.next_node_definition) {
            is_terminated = true;
        } else if (! parser.next_node_definition.id.includes(" operator")) {
            is_terminated = true;
        }
    } else if (parser.new_operator && is_delimiter_token(next_token, '(')) {
        is_terminated = true;
    }
    if (is_terminated) parser.terminate(prev_node);

    /*
    const is_cancelable = (
        prev_node         === null ||
        parser.next_token === null ||
        parser.is_next_node("Binary operator")
    );
    if (is_cancelable || ! is_possible_ASI(prev_node, parser)) { return; }

    switch (parser.next_token.id) {
        case "Number" :
            try_terminate(prev_node, parser);
            break;
        case "Identifier" :
            switch (parser.next_token.value) {
                case "instanceof": return;
                case "in":
                    if (parser.context_stack.includes("for_header")) {
                        return parser.terminate(prev_node);
                    }
                    return;
                case "of":
                    if (parser.context_stack.includes("for_header")) {
                        return parser.terminate(prev_node);
                    }
                    break;
            }
            try_terminate(prev_node, parser);
            break;
        case "Delimiter" :
            if (! is_valid_delimiter(parser)) {
                try_terminate(prev_node, parser);
            }
            break;
        case "Operator" :
            let is_terminated = (
                operators.includes(parser.next_token.value) &&
                prev_node.end.line < parser.next_token.start.line
            );

            if (is_terminated) {
                parser.terminate(prev_node);
            }
            break;
        // TODO: what else it can be?
    }
    */
};
