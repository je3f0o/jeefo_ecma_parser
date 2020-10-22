/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : binding_identifier.js
* Created at  : 2019-09-02
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

const {IDENTIFIER}         = require("../enums/precedence_enum");
const {binding_identifier} = require("../enums/states_enum");

const init = (node, identifier, parser) => {
    const is_disallowed_let = (
        identifier.identifier_name.value === "let" &&
        parser.context_stack.includes("Lexical declaration")
    );
    if (is_disallowed_let) {
        parser.throw_unexpected_token(
            "let is disallowed as a lexically bound name"
        );
    }

    node.identifier = identifier;
    node.start      = identifier.start;
    node.end        = identifier.end;
};

module.exports = {
    id         : "Binding identifier",
    type       : "ES6+ Identifiers",
    precedence : IDENTIFIER,
    is         : (_, {current_state: s}) => s === binding_identifier,

    initialize (node, {value}, parser) {
        parser.change_state("identifier");
        init(node, parser.generate_next_node(), parser);
    },

    refine (node, {id, identifier}, parser) {
        parser.expect("IdentifierReference", id === "Identifier reference");
        init(node, identifier, parser);
    }
};
