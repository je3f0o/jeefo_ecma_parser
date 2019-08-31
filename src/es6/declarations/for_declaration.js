/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_declaration.js
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

const { DECLARATION }     = require("../enums/precedence_enum");
const { for_declaration } = require("../enums/states_enum");

const error_message = (
    "for-in loop variable declaration may not have an initializer."
);

module.exports = {
    id         : "For declaration",
    type       : "Declaration",
    precedence : DECLARATION,

    is         : (_, parser) => parser.current_state === for_declaration,
    initialize : (node, token, parser) => {
        const { keyword, binding, initializer } = parser.prev_node;

        if (initializer) {
            parser.throw_unexpected_token(error_message, initializer);
        }

        node.keyword = keyword;
        node.binding = binding;
        node.start   = keyword.start;
        node.end     = binding.end;
    }
};
