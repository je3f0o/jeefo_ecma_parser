/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : async_method_body.js
* Created at  : 2019-09-06
* Updated at  : 2020-09-02
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

const {STRUCTURE}         = require("../enums/precedence_enum");
const {async_method_body} = require("../enums/states_enum");

module.exports = {
    id         : "Async method body",
    type       : "Method definitions",
    precedence : STRUCTURE,

    is         : (_, {current_state: s}) => s === async_method_body,
    initialize : (node, token, parser) => {
        token.on_looping = () => parser.suffixes.push("await");
        parser.change_state("function_body");
        parser.next_node_definition.initialize(node, token, parser);
    }
};
