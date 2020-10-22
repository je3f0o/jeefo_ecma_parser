/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : getter_method.js
* Created at  : 2019-08-25
* Updated at  : 2020-09-01
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

const {EXPRESSION}    = require("../enums/precedence_enum");
const {getter_method} = require("../enums/states_enum");

const init = (node, keyword, parser) => {
    const property_name = parser.generate_next_node();

    // Parameter
    parser.prepare_next_state("empty_parameter_list");
    const parameters = parser.generate_next_node();

    // Body
    parser.prepare_next_state("method_body");
    const body = parser.generate_next_node();

    node.keyword       = keyword;
    node.property_name = property_name;
    node.parameters    = parameters;
    node.body          = body;
    node.start         = keyword.start;
    node.end           = body.end;
};

module.exports = {
    id         : "Getter method",
    type       : "Method definitions",
    precedence : EXPRESSION,

    is         : (_, { current_state : s }) => s === getter_method,
    initialize : (node, token, parser) => {
        parser.change_state("contextual_keyword");
        const keyword  = parser.generate_next_node();

        // Property
        parser.prepare_next_state("property_name", true);
        init(node, keyword, parser);
    },

    refine (node, property_name, parser) {
        console.log(property_name);
        debugger
        const keyword = parser.refine(
            "contextual_keyword", property_name
        );

        // Property
        parser.change_state("property_name");
        init(node, keyword, parser);
    }
};
