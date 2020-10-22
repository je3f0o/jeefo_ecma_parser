/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : class_expression.js
* Created at  : 2019-08-23
* Updated at  : 2020-08-27
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

const {EXPRESSION}       = require("../enums/precedence_enum");
const {class_expression} = require("../enums/states_enum");

module.exports = {
    id         : "Class expression",
    type       : "Primary expression",
    precedence : EXPRESSION,

    is         : (_, {current_state: s}) => s === class_expression,
    initialize : (node, token, parser) => {
        let name = null;

        parser.change_state("keyword");
        const keyword = parser.generate_next_node();

        parser.prepare_next_state("binding_identifier", true);
        const has_identifier = (
            parser.next_token.id    === "Identifier" &&
            parser.next_token.value !== "extends"
        );
        if (has_identifier) {
            name = parser.generate_next_node();
            parser.prepare_next_state("class_tail", true);
        } else {
            parser.change_state("class_tail");
        }
        const tail = parser.generate_next_node();

        node.keyword = keyword;
        node.name    = name;
        node.tail    = tail;
        node.start   = keyword.start;
        node.end     = tail.end;

        parser.end(node);
    }
};
