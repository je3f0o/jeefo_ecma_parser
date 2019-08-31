/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_binding.js
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

const { for_binding } = require("../enums/states_enum");
const { DECLARATION } = require("../enums/precedence_enum");

module.exports = {
    id         : "For binding",
    type       : "Declaration",
    precedence : DECLARATION,

    is         : (_, parser) => parser.current_state === for_binding,
    initialize : (node, token, parser) => {
        const { keyword, binding } = parser.prev_node;

        node.keyword = keyword;
        node.binding = binding;
        node.start   = keyword.start;
        node.end     = binding.end;
    }
};
