/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : terminal_symbol.js
* Created at  : 2019-09-01
* Updated at  : 2019-09-03
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

const { TERMINAL_SYMBOL } = require("../enums/precedence_enum");
const { get_pre_comment } = require("../../helpers");
const {
    async_state,
    expression_no_in,
} = require("../enums/states_enum");

const delimiters = [
    '(', ')',
    '[', ']',
    '{', '}',
    ':', ';',
    ',',
];

module.exports = {
    id         : "Terminal symbol",
    type       : "Terminal symbol token",
    precedence : TERMINAL_SYMBOL - 1,

    is : (token, parser) => {
        switch (token.id) {
            case "Rest":
            case "Arrow":
            case "Operator":
                return true;
            case "Delimiter":
                return delimiters.includes(token.value);
            case "Identifier":
                switch (parser.current_state) {
                    case async_state      : return true;
                    case expression_no_in :
                        return token.value === "of";
                }
                return parser.is_reserved_word(token.value);
        }
    },
    initialize : (node, token, parser) => {
        node.pre_comment = get_pre_comment(parser);
        node.value       = token.value;
        node.start       = token.start;
        node.end         = token.end;
    }
};
