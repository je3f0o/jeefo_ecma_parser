/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : es5_legacy_variable_declaration_no_in.js
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

const { DECLARATION } = require("../enums/precedence_enum");
const {
    es5_legacy_variable_declaration_no_in,
} = require("../enums/states_enum");

module.exports = {
    id         : "ES5 legacy variable declaration no in",
    type       : "Declaration",
    precedence : DECLARATION,

    is : (_, parser) => {
        return parser.current_state === es5_legacy_variable_declaration_no_in;
    },
    initialize : (node, token, parser) => {
        const { keyword, binding, initializer } = parser.prev_node;

        node.keyword     = keyword;
        node.binding     = binding;
        node.initializer = initializer;
        node.start       = keyword.start;
        node.end         = initializer.end;
    }
};
