/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : binding_property_element.js
* Created at  : 2019-09-07
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

const {EXPRESSION}               = require("../enums/precedence_enum");
const {binding_property_element} = require("../enums/states_enum");
const {
    is_colon,
} = require("../../helpers");

module.exports = {
    id         : "Binding property element",
	type       : "Destructuring binding patterns",
	precedence : EXPRESSION,
    is         : (_, {current_state: s}) => s === binding_property_element,

    initialize () {},

	refine (node, expr, parser) {
        let prop_name, colon, element;
        switch (expr.id) {
            case "Binding property" :
                ({prop_name} = expr);
                switch (prop_name.id) {
                    case "Number" :
                    case "String" :
                    case "Delimiter" :
                        prop_name = parser.refine("property_name", prop_name);
                        parser.prepare_next_state("punctuator", true);
                        parser.expect(':', is_colon);
                        break;
                    case "Binding identifier" :
                        prop_name = parser.refine("property_name", prop_name);
                        parser.change_state("punctuator");
                        break;
                    default: parser.throw_unexpected_token();
                }
                colon = parser.generate_next_node();
                parser.prepare_next_state("binding_element", true);
                element = parser.generate_next_node();
                break;
            case "Property assignment" :
                ({ colon, property_name: prop_name } = expr);
                element = parser.refine("binding_element", expr.expression);
                break;
            default:
                console.log(expr);
                debugger
                parser.throw_unexpected_refine(node, expr);
        }
        //element = parser.refine("binding_element", property.expression);

        node.property_name = prop_name;
        node.colon         = colon;
        node.element       = element;
        node.start         = prop_name.start;
        node.end           = element.end;
    },
};
