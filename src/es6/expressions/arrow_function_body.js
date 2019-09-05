/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : arrow_function_body.js
* Created at  : 2019-09-04
* Updated at  : 2019-09-05
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
const { arrow_function_body } = require("../enums/states_enum");

module.exports = {
    id         : "Arrow function body",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, { current_state : s }) => s === arrow_function_body,
    initialize : (node, token, parser) => {
        parser.change_state("function_body");
        parser.next_node_definition.initialize(node, token, parser);
    }
};
