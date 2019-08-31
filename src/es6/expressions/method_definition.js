/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : method_definition.js
* Created at  : 2019-08-25
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

const { METHOD_DEFINITION } = require("../enums/precedence_enum");
const {
    class_body,
    method_definition,
} = require("../enums/states_enum");
const {
    is_open_curly,
    get_last_non_comment_node,
} = require("../../helpers");

module.exports = {
    id         : "Method definition",
    type       : "Expression",
    precedence : METHOD_DEFINITION,

    is         : (_, parser) => parser.current_state === method_definition,
    initialize : (node, token, parser) => {
        const property_name = get_last_non_comment_node(parser);

        parser.change_state("formal_parameter_list");
        const parameters = parser.generate_next_node();

        parser.prepare_next_state("function_body", true);
        parser.expect('{', is_open_curly);
        const body = parser.generate_next_node();

        node.property_name = property_name;
        node.parameters    = parameters;
        node.body          = body;
        node.start         = property_name.start;
        node.end           = body.end;

        if (parser.prev_state === class_body) {
            parser.terminate(node);
        }
    }
};
