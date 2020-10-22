/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : identifier_name.js
* Created at  : 2019-09-03
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

const {IDENTIFIER}      = require("../enums/precedence_enum");
const {identifier_name} = require("../enums/states_enum");
const {get_pre_comment} = require("../../helpers");

module.exports = {
    id         : "Identifier name",
    type       : "Identifiers",
    precedence : IDENTIFIER,

    is: ({id}, parser) => {
        const {current_state: s} = parser;
        if (s === identifier_name && id === "Idenitifier") {
            parser.change_state("reserved_words");
            return parser.next_node_definition !== null;
        }
    },

    initialize : (node, token, parser) => {
        node.pre_comment = get_pre_comment(parser);
        node.value       = token.value;
        node.start       = token.start;
        node.end         = token.end;
    },
};
