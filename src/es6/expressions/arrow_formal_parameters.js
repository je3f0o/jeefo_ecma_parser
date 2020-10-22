/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : arrow_formal_parameters.js
* Created at  : 2019-09-04
* Updated at  : 2020-09-10
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

const {DECLARATION}             = require("../enums/precedence_enum");
const {arrow_formal_parameters} = require("../enums/states_enum");

const cover_paren = "Cover parenthesized expression and arrow parameter list";

module.exports = {
    id         : "Arrow formal parameters",
	type       : "Arrow function definitions",
	precedence : DECLARATION,

    is     : (_, {current_state: s}) => s === arrow_formal_parameters,
    initialize : (node) => {
        console.log(node.id);
        process.exit();
    },
	refine : (node, expr, parser) => {
        let open, close, rest, list, delimiters;

        switch (expr.id) {
            case "Async arrow head" :
                ({
                    list,
                    delimiters,
                    open_parenthesis  : open,
                    close_parenthesis : close,
                } = expr.args);

                // I'm gonna skip deep nested expressions doom.
                // Because it's esentially BindingElement.
                list = list.map(n => parser.refine("formal_parameter", n));
                break;
            case cover_paren:
                ({
                    expression        : expr,
                    rest_expression   : rest,
                    open_parenthesis  : open,
                    close_parenthesis : close,
                } = expr);
                list       = [];
                delimiters = [];

                // I'm gonna skip FormalParamter. Because it can be confusing
                // later. Which is esentially BindingElement.
                while (expr) {
                    switch (expr.id) {
                        case "Assignment expression" :
                            list.unshift(
                                parser.refine("formal_parameter", expr)
                            );
                            expr = null;
                            break;
                        case "Expression" :
                            list.unshift(
                                parser.refine("formal_parameter", expr.right)
                            );
                            expr = expr.left;
                            break;
                        default: parser.throw_unexpected_refine(node, expr);
                    }
                }

                //list = list.map(expr => parser.refine("binding_element", expr));
                if (rest) list.push(rest);
                break;
            default:
                debugger
                parser.throw_unexpected_refine(node, expr);
        }

        node.open_parenthesis  = open;
        node.list              = list;
        node.delimiters        = delimiters;
        node.close_parenthesis = close;
        node.start             = open.start;
        node.end               = close.end;
    },
};
