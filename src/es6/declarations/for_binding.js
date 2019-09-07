/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_binding.js
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

const { for_binding } = require("../enums/states_enum");
const { DECLARATION } = require("../enums/precedence_enum");

module.exports = {
    id         : "For binding",
    type       : "Declaration",
    precedence : DECLARATION,

    is         : (_, { current_state : s }) => s === for_binding,
    initialize : (node) => {
        console.log(node.id);
        process.exit();
    },

    refine : (node, var_stmt) => {
        const { keyword, declaration_list:[{ binding }] } = var_stmt;

        node.keyword = keyword;
        node.binding = binding;
        node.start   = keyword.start;
        node.end     = binding.end;
    }
};
