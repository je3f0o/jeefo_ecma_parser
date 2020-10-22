/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : identifier.js
* Created at  : 2020-08-29
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

const {IDENTIFIER} = require("../enums/precedence_enum");
const {identifier} = require("../enums/states_enum");

module.exports = {
    id         : "Identifier",
    type       : "Identifiers",
    precedence : IDENTIFIER,
    is         : (_, {current_state: s}) => s === identifier,

    initialize (node, token, parser) {
        parser.expect("Identifier", token.id === "Identifier");
        parser.change_state("reserved_word");
        if (parser.next_node_definition) {
            const strict = token.is_strict ? " strict mode" : '';
            parser.throw_unexpected_token(`Unexpected${strict} reserved word`);
        }

        parser.change_state("identifier_name");
        const id = parser.generate_next_node();
        node.identifier_name = id;
        node.start           = id.start;
        node.end             = id.end;
    },

    refine (node, id_name, parser) {
        if (id_name.id !== "Identifier name") {
            parser.throw_unexpected_refine(node, id_name);
        }
        node.identifier_name = id_name;
        node.start           = id_name.start;
        node.end             = id_name.end;
    }
};
