/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : class_statement.js
* Created at  : 2019-08-04
* Updated at  : 2019-08-22
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

const { AST_Node_Definition } = require("@jeefo/parser");
const { terminal_definition } = require("../../common");
const precedence_enum      = require("../../es6/enums/precedence_enum");
const static_method_def    = require("../common/static_method_definition");
const generate_next_method = require("../helpers/generate_method_definition");

const {
    property_name_definition : property_name,
} = require("../../es6/common");

const {
    is_identifier,
    is_terminator,
    is_open_curly,
    is_close_curly,
} = require("../../helpers");

const is_static = (parser) => {
    const { next_token : token } = parser;
    if (token.id === "Identifier" && token.value === "static") {
        const next_token = parser.look_ahead(true);
        return next_token.id !== "Delimiter" || next_token.value !== '(';
    }
};

const class_body = new AST_Node_Definition({
    id         : "Class body",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : (node, current_token, parser) => {
        const element_list = [];

        parser.change_state("delimiter");
        parser.expect('{', is_open_curly);
        const open_curly_bracket = parser.generate_next_node();

        parser.prepare_next_state("expression", true);
        while (! is_close_curly(parser)) {
            let element;
            if (is_terminator(parser)) {
                element = parser.generate_next_node();
            } else if (is_static(parser)) {
                element = static_method_def.generate_new_node(parser);
            } else {
                parser.prev_node = property_name.generate_new_node(parser);
                const next_token = parser.look_ahead(true);
                element = generate_next_method(parser, next_token);
            }

            element_list.push(element);
            parser.prepare_next_state("expression", true);
        }
        const close_curly_bracket = parser.generate_next_node();

        node.open_curly_bracket  = open_curly_bracket;
        node.element_list        = element_list;
        node.close_curly_bracket = close_curly_bracket;
        node.start               = open_curly_bracket.start;
        node.end                 = close_curly_bracket.end;
    }
});

const class_tail = new AST_Node_Definition({
    id         : "Class tail",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : (node, current_token, parser) => {
        let heritage = null;

        parser.prepare_next_state("class_heritage", true);
        if (parser.is_next_node("Class heritage")) {
            heritage = parser.generate_next_node();
        } else if (parser.next_token.id === "Identifier") {
            parser.throw_unexpected_token("Unexpected identifier");
        }

        const body = class_body.generate_new_node(parser);

        node.heritage = heritage;
        node.body     = body;
        node.start    = (heritage || body).start;
        node.end      = body.end;
    }
});

const class_statement = {
    id         : "Class statement",
    type       : "Statement",
    precedence : precedence_enum.STATEMENT,

    is         : () => true,
    initialize : (node, current_token, parser) => {
        const keyword = terminal_definition.generate_new_node(parser);

        parser.prepare_next_state("expression");
        parser.expect("identifier", is_identifier);
        const name = parser.generate_next_node();
        const tail = class_tail.generate_new_node(parser);

        node.keyword = keyword;
        node.name    = name;
        node.tail    = tail;
        node.start   = keyword.start;
        node.end     = tail.end;
    }
};

module.exports = ast_node_table => {
    delete ast_node_table.reserved_words.class;
    ast_node_table.register_reserved_word("class", class_statement);
};
