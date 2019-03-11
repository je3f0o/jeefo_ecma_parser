/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : get_right_value.js
* Created at  : 2019-02-04
* Updated at  : 2019-02-04
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

module.exports = (parser, left_precedence) => {
    let right_value = parser.get_next_symbol(left_precedence);

    if (right_value.id === "Comment") {
        parser.post_comment = right_value; 

        let i = parser.previous_symbols.length;
        while (i--) {
            if (parser.previous_symbols[i].id === "Comment") {
                continue;
            }

            return parser.previous_symbols[i];
        }
    }

    return right_value;
};
