/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : static_method.js
* Created at  : 2019-09-07
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

const {EXPRESSION}          = require("../enums/precedence_enum");
const {static_method}       = require("../enums/states_enum");
const {is_identifier_token} = require("../../helpers");

module.exports = {
    id         : "Static method",
    type       : "Class declarations",
    precedence : EXPRESSION,

    is         : (_, {current_state: s}) => s === static_method,
    initialize : (node, token, parser) => {
        parser.expect("static", is_identifier_token(token, "static"));
        parser.change_state("contextual_keyword");
        const keyword = parser.generate_next_node();

        parser.prepare_next_state("property_name", true);
        const property_name = parser.generate_next_node();
        parser.set_prev_node(property_name);
        parser.change_state("method_definition");
        const method = parser.generate_next_node();

        node.keyword = keyword;
        node.method  = method;
        node.start   = keyword.start;
        node.end     = method.end;
    }
};
