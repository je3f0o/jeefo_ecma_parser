/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : async_function_body.js
* Created at  : 2019-08-27
* Updated at  : 2020-09-06
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

const {SYNTAX}              = require("../enums/precedence_enum");
const {async_function_body} = require("../enums/states_enum");

module.exports = {
    id         : "Async function body",
    type       : "Async function definitions",
    precedence : SYNTAX,
    is         : (_, {current_state: s}) => s === async_function_body,
    initialize : (node, token, parser) => {
        token.on_looping = () => parser.suffixes.push("await");
        parser.change_state("function_body");
        parser.next_node_definition.initialize(node, token, parser);
    }
};
