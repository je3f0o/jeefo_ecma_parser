/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_binding.js
* Created at  : 2019-09-01
* Updated at  : 2020-09-07
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

const {STATEMENT}   = require("../enums/precedence_enum");
const {for_binding} = require("../enums/states_enum");

module.exports = {
    id         : "For binding",
    type       : "Iteration statements",
    precedence : STATEMENT,
    is         : (_, {current_state: s}) => s === for_binding,

    initialize (node, token, parser) {
        switch (token.id) {
            case "Identifier" :
                parser.change_state("binding_identifier");
                break;
            case "Delimiter" :
                if (['{','['].includes(token.value)) {
                    parser.change_state("binding_pattern");
                } else {
                    parser.throw_unexpected_token();
                }
                break;
            default: parser.throw_unexpected_token();
        }

        node.binding = parser.generate_next_node();
        node.start   = node.binding.start;
        node.end     = node.binding.end;
    },

    refine (node, var_stmt) {
        console.log("DEPRECATED");
        debugger
        const { keyword, declaration_list:[{ binding }] } = var_stmt;

        node.keyword = keyword;
        node.binding = binding;
        node.start   = keyword.start;
        node.end     = binding.end;
    }
};
