/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : terminal_symbol.js
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

const { TERMINAL_TOKEN }   = require("../enums/precedence_enum");
const { get_pre_comment }  = require("../../helpers");
const { expression_no_in } = require("../enums/states_enum");

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
    precedence : TERMINAL_TOKEN,

    is : (token, parser) => {
        switch (token.id) {
            case "Operator":
                return token.value === '=';
            case "Delimiter":
                return delimiters.includes(token.value);
            case "Identifier":
                if (parser.current_state === expression_no_in) {
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
