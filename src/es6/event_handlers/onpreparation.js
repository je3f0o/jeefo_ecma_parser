/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : onpreparation.js
* Created at  : 2019-08-21
* Updated at  : 2019-08-27
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

const ignore_comments = require("../../es5/helpers/ignore_comments");

const operators = "++,--".split(',');

function try_terminate (prev_node, parser) {
    if (prev_node.end.line < parser.next_token.start.line) {
        parser.terminate(prev_node);
    } else {
        parser.throw_unexpected_token();
    }
}

const is_valid_delimiter = (() => {
    const valid_terminal_values = ["class", "extends"];

    return parser => {
        if (parser.next_token.value === '{') {
            const node = parser.previous_nodes.find(node => {
                if (node.id === "Terminal symbol") {
                    return valid_terminal_values.includes(node.value);
                }
            });
            return node !== undefined;
        }

        return true;
    };
})();

const is_possible_ASI = (() => {
    const possible_ending_characters = "]})".split('');

    return (prev_node, parser) => {
        if (prev_node.type === "Primitive") { return true; }
        const last_char = parser.tokenizer.streamer.at(prev_node.end.index);
        return possible_ending_characters.includes(last_char);
    };
})();

const binary_identifies = [
    "in", "instanceof"
];

module.exports = parser => {
    let prev_node = null;
    if (parser.prev_node && parser.prev_node.id !== "Comment") {
        ({ prev_node } = parser);
    }
    ignore_comments(parser);

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
            if (binary_identifies.includes(parser.next_token.value)) {
                return;
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
};
