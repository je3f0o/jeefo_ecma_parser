/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : async_arrow_binding_identifier.js
* Created at  : 2019-12-13
* Updated at  : 2019-12-14
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

const { ASYNC_ARROW_BINDING_IDENTIFIER } = require("../enums/precedence_enum");
const { async_arrow_binding_identifier } = require("../enums/states_enum");

module.exports = {
    id         : "Async arrow binding identifier",
    type       : "Expression",
    precedence : ASYNC_ARROW_BINDING_IDENTIFIER,

    is (token, { current_state }) {
        return current_state === async_arrow_binding_identifier;
    },

    initialize (node, token, parser) {
        parser.change_state("binding_identifier");

        node.identifier = parser.generate_next_node();
        node.start      = node.identifier.start;
        node.end        = node.identifier.end;
    }
};
