/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : cover_initialized_name.js
* Created at  : 2019-09-06
* Updated at  : 2020-09-10
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

const {EXPRESSION}             = require("../enums/precedence_enum");
const {cover_initialized_name} = require("../enums/states_enum");


module.exports = {
    id         : "Cover initialized name",
    type       : "Expression",
    precedence : EXPRESSION,
    is         : ({id}, {current_state: s}) =>
        id === "Identifier" && s === cover_initialized_name,

    initialize (node, token, parser) {
        parser.change_state("identifier_reference");
        const identifier = parser.generate_next_node();

        parser.prepare_next_state("initializer");
        const initializer = parser.generate_next_node();

        node.identifier  = identifier;
        node.initializer = initializer;
        node.start       = identifier.start;
        node.end         = initializer.end;
    }
};
