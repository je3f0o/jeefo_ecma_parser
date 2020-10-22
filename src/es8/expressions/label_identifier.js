/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : label_identifier.js
* Created at  : 2019-09-03
* Updated at  : 2020-09-07
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

const {EXPRESSION}       = require("../enums/precedence_enum");
const {label_identifier} = require("../enums/states_enum");

module.exports = {
    id         : "Label identifier",
    type       : "Expression",
    precedence : EXPRESSION,

    is: ({id}, {current_state: s}) =>
        s === label_identifier && id === "Identifier",

    initialize (node, token, parser) {
        parser.change_state("identifier");
        const identifier = parser.generate_next_node();

        node.identifier = identifier;
        node.start      = identifier.start;
        node.end        = identifier.end;
    }
};
