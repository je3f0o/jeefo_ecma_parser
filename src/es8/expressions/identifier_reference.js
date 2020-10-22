/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : identifier_reference.js
* Created at  : 2019-09-03
* Updated at  : 2020-08-31
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

const {EXPRESSION}                = require("../enums/precedence_enum");
const {get_last_non_comment_node} = require("../../helpers");
const {
    expression,
    identifier_reference,
} = require("../enums/states_enum");

module.exports = {
    id         : "Identifier reference",
    type       : "Primary expression",
    precedence : EXPRESSION,

    is ({id}, parser) {
        switch (parser.current_state) {
            case expression :
                return id === "Identifier" &&
                       get_last_non_comment_node(parser) === null;
            case identifier_reference : return true;
        }
    },

    initialize (node, token, parser) {
        const prev_state = parser.current_state;

        parser.change_state("identifier");
        const identifier = parser.generate_next_node();

        node.identifier = identifier;
        node.start      = identifier.start;
        node.end        = identifier.end;

        parser.current_state = prev_state;
    },

    refine (node, expr, parser) {
        // i dont think expr always only IdentifierName
        const identifier = parser.refine("identifier", expr);
        node.identifier  = identifier;
        node.start       = identifier.start;
        node.end         = identifier.end;
    },
};
