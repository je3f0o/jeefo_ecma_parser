/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : error_reporter.js
* Created at  : 2019-09-01
* Updated at  : 2019-09-01
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

const invalid_next_operator = ["in", "of"];
const is_invalid_next_operator = token => {
    if (token.id === "Identifier") {
        return invalid_next_operator.includes(token.value);
    }
};

module.exports = {
    invalid_left_hand_ForIn_or_ForOf (parser, list) {
        if (is_invalid_next_operator(parser.next_token)) {
            const error_message = `Invalid left-hand side in for-${
                parser.next_token.value
            } loop: Must have a single binding.`;

            parser.throw_unexpected_token(error_message, {
                start : list[0].start,
                end   : list[list.length - 1].end
            });
        } else {
            parser.throw_unexpected_token();
        }
    },

    missing_initializer_in_destructuring (parser) {
        parser.throw_unexpected_token(
            "Missing initializer in destructuring declaration"
        );
    },

    missing_initializer_in_const (parser, node) {
        parser.throw_unexpected_token(
            "Missing initializer in const declaration", node
        );
    }
};
