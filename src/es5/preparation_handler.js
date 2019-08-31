/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : preparation_handler.js
* Created at  : 2019-06-28
* Updated at  : 2019-08-29
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
    of_operator,
    expression_no_in,
} = require("./enums/states_enum");

const operators = "++,--".split(',');

function try_terminate (prev_node, parser) {
    if (prev_node.end.line < parser.next_token.start.line) {
        parser.terminate(prev_node);
    } else {
        parser.throw_unexpected_token();
    }
}

const is_valid_delimiter = (() => {
    const valid_terminal_values = ["extends"];

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

const is_of_operator = parser => {
    const _is_of_operator = (
        parser.current_state    === expression_no_in &&
        parser.next_token.value === "of"
    );
    if (_is_of_operator) {
        parser.current_state = of_operator;
        return true;
    }
};

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
            if (is_of_operator(parser)) { return; }
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
