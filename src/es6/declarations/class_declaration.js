/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : class_declaration.js
* Created at  : 2019-08-04
* Updated at  : 2019-08-29
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

const { DECLARATION }                 = require("../enums/precedence_enum");
const { is_expression }               = require("../../es5/helpers");
const { terminal_definition }         = require("../../common");
const { statement, class_expression } = require("../enums/states_enum");

module.exports = {
    id         : "Class declaration",
    type       : "Declaration",
    precedence : DECLARATION,

    is : (token, parser) => {
        if (parser.current_state === statement) {
            return true;
        } else if (is_expression(parser)) {
            parser.prev_state    = parser.current_state;
            parser.current_state = class_expression;
        }
    },
    initialize : (node, token, parser) => {
        const keyword = terminal_definition.generate_new_node(parser);

        parser.prepare_next_state("binding_identifier", true);
        const name = parser.generate_next_node();

        parser.prepare_next_state("class_tail", true);
        const tail = parser.generate_next_node();

        node.keyword = keyword;
        node.name    = name;
        node.tail    = tail;
        node.start   = keyword.start;
        node.end     = tail.end;
    }
};
