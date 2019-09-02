/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : async_function_body.js
* Created at  : 2019-08-27
* Updated at  : 2019-09-02
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

const { EXPRESSION }          = require("../enums/precedence_enum");
const { async_function_body } = require("../enums/states_enum");

module.exports = {
    id         : "Async function body",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, parser) => parser.current_state === async_function_body,
    initialize : (node, token, parser) => {
        parser.change_state("function_body");
        parser.next_node_definition.initialize(node, token, parser);
    }
};
