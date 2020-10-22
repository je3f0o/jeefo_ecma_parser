/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : object_binding_pattern.js
* Created at  : 2019-09-05
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

const {EXPRESSION}             = require("../enums/precedence_enum");
const {object_binding_pattern} = require("../enums/states_enum");
const {
    is_comma,
    is_open_curly,
    is_close_curly,
} = require("../../helpers");

const init = (node, {open, close, list, delimiters}) => {
    node.open_curly_bracket  = open;
    node.property_list       = list;
    node.delimiters          = delimiters;
    node.close_curly_bracket = close;
    node.start               = open.start;
    node.end                 = close.end;
};

module.exports = {
    id         : "Object binding pattern",
	type       : "Destructuring binding patterns",
	precedence : EXPRESSION,
    is         : (_, {current_state: s}) => s === object_binding_pattern,

	initialize (node, token, parser) {
        const list       = [];
        const delimiters = [];
        parser.expect('{', is_open_curly);

        parser.change_state("punctuator");
        const open = parser.generate_next_node();
        parser.prepare_next_state("binding_property", true);

        while (! parser.is_terminated) {
            list.push(parser.generate_next_node());
            parser.prepare_next_state("punctuator", true);
            if (is_comma(parser)) {
                delimiters.push(parser.generate_next_node());
                parser.prepare_next_state("binding_property", true);
            }
        }

        parser.expect('}', is_close_curly);
        parser.is_terminated = false;
        parser.change_state("punctuator");
        const close = parser.generate_next_node();

        init(node, {open, close, list, delimiters});
    },

    refine : (node, expression, parser) => {
        let list;
        switch (expression.id) {
            case "Object literal" :
                list = expression.property_definition_list;
                break;
            case "Object assignment pattern" :
                list = expression.property_list;
                break;
            default :
                parser.throw_unexpected_refine(node, expression);
        }
        const {
            delimiters,
            open_curly_bracket  : open,
            close_curly_bracket : close,
        } = expression;

        list = list.map(expr => parser.refine("binding_property", expr));

        init(node, {open, close, list, delimiters});
    }
};
