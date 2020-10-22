/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : binding_property.js
* Created at  : 2019-09-07
* Updated at  : 2020-09-09
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

const {is_assign}        = require("../../helpers");
const {EXPRESSION}       = require("../enums/precedence_enum");
const {binding_property} = require("../enums/states_enum");

module.exports = {
    id         : "Binding property",
	type       : "Destructuring binding patterns",
	precedence : EXPRESSION,
    is         : (_, {current_state: s}) => s === binding_property,

    initialize (node, token, parser) {
        let expr, state_name;
        const temp_node = {id: node.id};

        switch (token.id) {
            // { x ...
            case "Identifier" :
                parser.change_state("binding_identifier");
                let identifier = parser.generate_next_node();

                parser.prepare_next_state("punctuator", true);
                switch (parser.next_token.id) {
                    // { x = ...
                    case "Operator" :
                        parser.expect('=', is_assign);
                        state_name           = "single_name_binding";
                        temp_node.identifier = identifier;
                        break;

                    case "Delimiter" :
                        switch (parser.next_token.value) {
                            // { x }
                            // { x, ...
                            case ',' :
                            case '}' :
                                state_name           = "single_name_binding";
                                temp_node.identifier = identifier;
                                parser.is_terminated = false;
                                break;
                            // { x : ...
                            case ':' :
                                state_name = "binding_property_element";
                                temp_node.prop_name = identifier;
                                break;
                            default: parser.throw_unexpected_token();
                        }
                        break;
                    default: parser.throw_unexpected_token();
                }
                break;

            // PropertyName : BindingElement
            case "Number" :
            case "String" :
            case "Delimiter" :
                state_name = "binding_property_element";
                temp_node.prop_name = token;
                break;
            default: parser.throw_unexpected_token();
        }

        expr = parser.refine(state_name, temp_node);

        node.expression = expr;
        node.start      = expr.start;
        node.end        = expr.end;

        parser.end(node);
    },

	refine (node, expr, parser) {
        switch (expr.id) {
            case "Assignment property" :
                expr = expr.expression;
                switch (expr.id) {
                    case "Identifier reference" :
                    case "Cover initialized name" :
                    case "Assignment property identifier":
                        expr = parser.refine("single_name_binding", expr);
                        break;
                    default:
                        console.log(expr);
                        debugger
                        parser.throw_unexpected_refine(node, expr);
                }
                break;
            case "Property definition" :
                expr = expr.expression;
                switch (expr.id) {
                    case "Identifier reference" :
                    case "Cover initialized name" :
                        expr = parser.refine("single_name_binding", expr);
                        break;
                    case "Property assignment" :
                        expr = parser.refine("binding_property_element", expr);
                        break;
                    default:
                        console.log(expr);
                        debugger
                        parser.throw_unexpected_refine(node, expr);
                }
                break;
            default:
                console.log(expr);
                debugger
                parser.throw_unexpected_refine(node, expr);
        }

        node.expression = expr;
        node.start      = expr.start;
        node.end        = expr.end;
    },
};
