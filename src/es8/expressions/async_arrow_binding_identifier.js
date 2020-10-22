/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : async_arrow_binding_identifier.js
* Created at  : 2019-12-13
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

const {ASYNC_FUNCTION_DEFINITIONS} = require("../enums/precedence_enum");
const {
    async_arrow_binding_identifier: async_arrow_binding_id,
} = require("../enums/states_enum");

module.exports = {
    id         : "Async arrow binding identifier",
    type       : "Async function definitions",
    precedence : ASYNC_FUNCTION_DEFINITIONS,
    is         : (_, {current_state: s}) => s === async_arrow_binding_id,

    initialize (node, token, parser) {
        // I think there is no way to modify suffixes in BindingIdentifier
        // So im gonna use push, pop methods.
        parser.suffixes.push("await");
        parser.change_state("binding_identifier");
        parser.suffixes.pop();

        node.identifier = parser.generate_next_node();
        node.start      = node.identifier.start;
        node.end        = node.identifier.end;
    }
};
