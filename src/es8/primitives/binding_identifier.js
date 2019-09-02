/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : binding_identifier.js
* Created at  : 2019-09-02
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

const { PRIMITIVE }          = require("../enums/precedence_enum");
const { binding_identifier } = require("../enums/states_enum");

module.exports = {
    id         : "Binding identifier",
    type       : "Primitive",
    precedence : PRIMITIVE,

    is         : (_, parser) => parser.current_state === binding_identifier,
    initialize : (node, token, parser) => {
        node.identifier = parser.prev_node;
        node.start      = parser.prev_node.start;
        node.end        = parser.prev_node.end;
    }
};
