/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : generator_body.js
* Created at  : 2019-09-03
* Updated at  : 2019-09-03
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

const { EXPRESSION }     = require("../enums/precedence_enum");
const { generator_body } = require("../enums/states_enum");

module.exports = {
    id         : "Generator body",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, parser) => parser.current_state === generator_body,
    initialize : (node, token, parser) => {
        parser.change_state("function_body");
        parser.next_node_definition.initialize(node, token, parser);
    }
};
