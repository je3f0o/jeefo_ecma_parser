/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_declaration.js
* Created at  : 2019-09-01
* Updated at  : 2019-09-08
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

module.exports = {
    id         : "For declaration",
    type       : "Declaration",
    precedence : DECLARATION,

    is         : (_, { current_state : s }) => s === for_declaration,
    initialize : (node) => {
        console.log(node.id);
        process.exit();
    },

    refine (node, lexical_declaration, parser) {
        const {
            keyword,
            binding_list : [binding_element]
        } = lexical_declaration;

        if (binding_element.initializer) {
            parser.throw_unexpected_token(
                `for-${
                    parser.next_token.value
                } loop variable declaration may not have an initializer.`,
                binding_element
            );
        }

        node.keyword = keyword;
        node.binding = binding_element.binding;
        node.start   = keyword.start;
        node.end     = binding_element.end;

    }
};
