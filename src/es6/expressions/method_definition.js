/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : method_definition.js
* Created at  : 2019-08-25
* Updated at  : 2020-09-02
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
const { method_definition } = require("../enums/states_enum");

const init = (node, property_name, parser) => {
    /*
    parser.change_state("formal_parameters");
    const parameters = parser.generate_next_node();

    const prev_suffixes = parser.suffixes;
    parser.suffixes = [];

    parser.prepare_next_state("method_body", true);
    const body = parser.generate_next_node();

    parser.suffixes = prev_suffixes;

    node.property_name = property_name;
    node.parameters    = parameters;
    node.body          = body;
    node.start         = property_name.start;
    node.end           = body.end;
    */
};

module.exports = {
    id         : "Method definition",
    type       : "Method definitions",
    precedence : METHOD_DEFINITION,

    is         : (_, {current_state: s}) => s === method_definition,
    initialize : (node, token, parser) => {
        console.log("DEAD");
        process.exit();
        parser.change_state("property_name");
        const property_name = parser.generate_next_node();

        parser.prepare_next_state("formal_parameters", true);
        init(node, property_name, parser);
    },

    refine (node, property_name, parser) {
        if (property_name.id !== "Property name") {
            parser.throw_unexpected_refine(node, property_name);
        }

        let expression_name;
        if (property_name.expression.id === "Identifier name") {
            switch (property_name.expression.value) {
                case "get" :
                    expression_name = "getter_method";
                    break;
                case "set" :
                    expression_name = "setter_method";
                    break;
                default:
                    expression_name = "method";
            }
        } else {
            expression_name = "method";
        }
        const expression = parser.refine(expression_name, property_name);

        node.expression = expression;
        node.start      = expression.start;
        node.end        = expression.end;
    }
};
