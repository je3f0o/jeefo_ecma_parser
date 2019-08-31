/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : binding_rest_element.js
* Created at  : 2019-08-17
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

const { AST_Node_Definition } = require("@jeefo/parser");
const { terminal_definition } = require("../../common");

module.exports = new AST_Node_Definition({
    id         : "Binding rest element",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : (node, current_token, parser) => {
        let ellipsis, binding_id;

        if (parser.prev_node && parser.prev_node.ellipsis) {
            let expression;
            ({ ellipsis, expression } = parser.prev_node);
            parser.prev_node = expression;
            parser.change_state("binding_identifier");
        } else {
            ellipsis = terminal_definition.generate_new_node(parser);
            parser.prepare_next_state("binding_identifier", true);
        }

        binding_id = parser.generate_next_node();

        node.ellipsis           = ellipsis;
        node.binding_identifier = binding_id;
        node.start              = ellipsis.start;
        node.end                = binding_id.end;

        parser.ending_index = node.end.index;
    }
});
