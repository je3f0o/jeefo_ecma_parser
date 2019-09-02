/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : identifier_reference.js
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

const { REFERENCE_ID }         = require("../enums/precedence_enum");
const { identifier_reference } = require("../enums/states_enum.js");

module.exports = {
    id         : "Identifier reference",
    type       : "Primitive",
    precedence : REFERENCE_ID,

    is         : (_, parser) => parser.current_state === identifier_reference,
    initialize : (node, token, parser) => {
        console.log(parser.prev_node);
        node.identifier = parser.prev_node;
        node.start      = parser.prev_node.start;
        node.end        = parser.prev_node.end;
    }
};
