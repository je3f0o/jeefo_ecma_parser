/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : function_body.js
* Created at  : 2019-08-27
* Updated at  : 2020-09-08
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

const {STRUCTURE}     = require("../enums/precedence_enum");
const {function_body} = require("../enums/states_enum");

module.exports = {
    id         : "Function body",
    type       : "Function definitions",
    precedence : STRUCTURE,
    is         : (_, {current_state: s}) => s === function_body,

    initialize (node, token, parser) {
        const prev_suffix = parser.suffixes;
        parser.suffixes = ["in"];
        if (token.on_looping) token.on_looping();

        parser.change_state("block_statement");
        parser.next_node_definition.initialize(node, token, parser);

        parser.suffixes = prev_suffix;
    }
};
