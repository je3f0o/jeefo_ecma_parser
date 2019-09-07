/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : preparation_handler.js
* Created at  : 2019-06-28
* Updated at  : 2019-09-08
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

const operators = "++,--".split(',');

function try_terminate (prev_node, parser) {
    if (prev_node.end.line < parser.next_token.start.line) {
        parser.terminate(prev_node);
    } else {
        parser.throw_unexpected_token();
    }
}

const is_valid_delimiter = (() => {
    return parser => {
        if (parser.next_token.value === '{') {
            return parser.context_stack.includes("Class heritage");
        }

        return true;
    };
})();

const is_possible_ASI = (() => {
    const possible_ending_characters = "]})".split('');

    return (prev_node, parser) => {
        switch (prev_node.id) {
            case "Binding identifier" :
            case "Primary expression" :
                return true;
        }
        const last_char = parser.tokenizer.streamer.at(prev_node.end.index);
        return possible_ending_characters.includes(last_char);
    };
})();

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
            switch (parser.next_token.value) {
                case "instanceof": return;
                case "in":
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
};
