/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : class_declaration.js
* Created at  : 2019-08-04
* Updated at  : 2020-09-08
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/6.0/#sec-class-definitions
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const {DECLARATION} = require("../enums/precedence_enum");
const {
    statement,
    expression,
    class_expression,
} = require("../enums/states_enum");

module.exports = {
    id         : "Class declaration",
    type       : "Class declarations",
    precedence : DECLARATION,

    is (token, parser) {
        switch (parser.current_state) {
            case statement  : return true;
            case expression :
                parser.current_state = class_expression;
                break;
        }
    },

    initialize (node, token, parser) {
        parser.change_state("keyword");
        const keyword = parser.generate_next_node();

        parser.prepare_next_state("binding_identifier", true);
        const name = parser.generate_next_node();

        parser.prepare_next_state("class_tail", true);
        const tail = parser.generate_next_node();

        node.keyword = keyword;
        node.name    = name;
        node.tail    = tail;
        node.start   = keyword.start;
        node.end     = tail.end;

        parser.terminate(node);
    }
};
