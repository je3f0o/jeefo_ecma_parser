/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : class_tail.js
* Created at  : 2019-08-23
* Updated at  : 2019-08-29
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

const { EXPRESSION } = require("../enums/precedence_enum");
const { class_tail } = require("../enums/states_enum");

module.exports = {
    id         : "Class tail",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, parser) => parser.current_state === class_tail,
    initialize : (node, current_token, parser) => {
        let heritage = null;
        parser.change_state("class_heritage");
        if (parser.is_next_node("Class heritage")) {
            heritage = parser.generate_next_node();
        } else if (parser.next_token.id === "Identifier") {
            parser.throw_unexpected_token("Unexpected identifier");
        }

        parser.change_state("class_body");
        const body = parser.generate_next_node();

        node.heritage = heritage;
        node.body     = body;
        node.start    = (heritage || body).start;
        node.end      = body.end;
    }
};
