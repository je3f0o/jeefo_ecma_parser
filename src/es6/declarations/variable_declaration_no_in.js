/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : variable_declaration_no_in.js
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

const { DECLARATION }                = require("../enums/precedence_enum");
const { variable_declaration_no_in } = require("../enums/states_enum");

module.exports = {
    id         : "Variable declaration no in",
    type       : "Declaration",
    precedence : DECLARATION,

    is (_, { current_state }) {
        return current_state === variable_declaration_no_in;
    },
    initialize : (node) => {
        console.log(node.id);
        process.exit();
    },

    refine (node, var_stmt) {
        const {
            keyword,
            declaration_list :[{ binding, initializer }]
        } = var_stmt;

        node.keyword     = keyword;
        node.binding     = binding;
        node.initializer = initializer;
        node.start       = keyword.start;
        node.end         = initializer.end;
    }
};
