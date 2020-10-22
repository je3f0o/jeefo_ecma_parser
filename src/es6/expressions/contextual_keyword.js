/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : contextual_keyword.js
* Created at  : 2019-09-04
* Updated at  : 2020-08-30
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

const {TERMINAL_SYMBOL}    = require("../enums/precedence_enum");
const {get_pre_comment}    = require("../../helpers");
const {contextual_keyword} = require("../enums/states_enum");

const keywords = [
    "of",
    "let",
    "get",
    "set",
    "async",
    "static",
];

const init = (node, token, comment, parser) => {
    if (! keywords.includes(token.value)) {
        parser.throw_unexpected_token(`Invalid '${ node.id }'`, token);
    }

    node.pre_comment = comment;
    node.value       = token.value;
    node.start       = token.start;
    node.end         = token.end;
};

module.exports = {
    id         : "Contextual keyword",
    type       : "Terminal symbol token",
    precedence : TERMINAL_SYMBOL,
    is         : (_, { current_state : s }) => s === contextual_keyword,

    initialize (node, token, parser) {
        if (token.id !== "Identifier") {
            parser.throw_unexpected_token(`Invalid token to passed in '${
                node.id
            }'`);
        }
        init(node, token, get_pre_comment(parser), parser);
    },

    refine (node, expression, parser) {
        switch (expression.id) {
            case "Property name" :
                expression = expression.expression;
                break;
            case "Identifier reference" :
                break;
            default:
                parser.throw_unexpected_refine(node, expression);
        }
        console.log(expression);
        debugger

        init(node, expression, expression.pre_comment, parser);
    },
};
