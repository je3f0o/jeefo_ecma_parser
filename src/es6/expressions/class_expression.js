/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : class_expression.js
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

const { EXPRESSION }          = require("../enums/precedence_enum");
const { is_identifier }       = require("../../helpers");
const { class_expression }    = require("../enums/states_enum");
const { terminal_definition } = require("../../common");

module.exports = {
    id         : "Class expression",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, parser) => parser.current_state === class_expression,
    initialize : (node, token, parser) => {
        let name             = null;
        const keyword        = terminal_definition.generate_new_node(parser);
        const { prev_state } = parser;

        parser.prepare_next_state("expression", true);
        if (is_identifier(parser)) {
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

        parser.ending_index  = node.end.index;
        parser.current_state = prev_state;
    }
};
