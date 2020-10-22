/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : reserved_word.js
* Created at  : 2020-08-29
* Updated at  : 2020-08-29
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

const {IDENTIFIER}    = require("../enums/precedence_enum");
const {reserved_word} = require("../enums/states_enum");

module.exports = {
    id         : "Reserved word",
    type       : "Identifiers",
    precedence : IDENTIFIER,

    is ({value}, parser) {
        if (parser.current_state !== reserved_word) return;
        switch (value) {
            // Null literal
            case "null" :
            // Boolean literal
            case "true" :
            case "false":
                parser.change_state("expression");
                return true;
            default:
                return ["keyword", "future_reserved_word"].find(s => {
                    parser.change_state(s);
                    return parser.next_node_definition !== null;
                });
        }
    },
};
