/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : identifier_name.js
* Created at  : 2020-08-29
* Updated at  : 2020-08-30
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
    is         : (_, {current_state: s}) => s === identifier_name,

    initialize (node, token, parser) {
        parser.expect("Identifier", token.id === "Identifier");
        node.pre_comment = get_pre_comment(parser);
        node.value       = token.value;
        node.start       = token.start;
        node.end         = token.end;
    },
};
