/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : async_arrow_function_body.js
* Created at  : 2019-09-21
* Updated at  : 2019-09-21
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

const { ASYNC_ARROW_FUNCTION }      = require("../enums/precedence_enum");
const { async_arrow_function_body } = require("../enums/states_enum");

module.exports = {
    id         : "Async arrow function body",
    type       : "Expression",
    precedence : ASYNC_ARROW_FUNCTION,

    is         : (_, { current_state:s }) => s === async_arrow_function_body,
    initialize : (node, token, parser) => {
        parser.suffixes.push("await");
        parser.change_state("function_body");
        parser.next_node_definition.initialize(node, token, parser);
        parser.suffixes.pop();
    }
};
