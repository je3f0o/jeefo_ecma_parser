/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : contextual_keyword.js
* Created at  : 2019-09-04
* Updated at  : 2019-09-06
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

const { TERMINAL_SYMBOL }    = require("../enums/precedence_enum");
const { get_pre_comment }    = require("../../helpers");
const { contextual_keyword } = require("../enums/states_enum");

const keywords = [
    "get", "set", "static",
];

const is_keyword = node => {
    return node.id === "Identifier name" && keywords.includes(node.value);
};

module.exports = {
    id         : "Contextual keyword",
    type       : "Terminal symbol token",
    precedence : TERMINAL_SYMBOL,

    is         : (_, { current_state : s }) => s === contextual_keyword,
    initialize : (node, token, parser) => {
        node.pre_comment = get_pre_comment(parser);
        node.value       = token.value;
        node.start       = token.start;
        node.end         = token.end;
    },

    refine (node, property_name, parser) {
        if (property_name.id !== "Property name") {
            parser.throw_unexpected_refine(node, property_name);
        }
        const name = property_name.name;
        if (! is_keyword(name)) {
            parser.throw_unexpected_token(`Invalid keyword to refine in: ${
                node.id
            }`);
        }

        node.pre_comment = name.pre_comment;
        node.value       = name.value;
        node.start       = name.start;
        node.end         = name.end;
    }
};
