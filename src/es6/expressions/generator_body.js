/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : generator_body.js
* Created at  : 2019-09-03
* Updated at  : 2020-08-31
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

const {EXPRESSION}     = require("../enums/precedence_enum");
const {generator_body} = require("../enums/states_enum");

module.exports = {
    id         : "Generator body",
    type       : "Generator function definitions",
    precedence : EXPRESSION,
    is         : (_, {current_state: s}) => s === generator_body,
    initialize : (node, token, parser) => {
        token.on_looping = () => parser.suffixes.push("yield");
        parser.change_state("function_body");
        parser.next_node_definition.initialize(node, token, parser);
    }
};
