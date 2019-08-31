/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : object_literal.js
* Created at  : 2019-08-21
* Updated at  : 2019-08-28
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
const { PRIMITIVE }           = require("../enums/precedence_enum");
const { is_expression }       = require("../../es5/helpers");
const { terminal_definition } = require("../../common");
const {
    initializer_definition,
    property_name_definition : property_name
} = require("../nodes");
const {
    is_comma,
    is_asterisk,
    is_identifier,
    is_close_curly,
    is_delimiter_token,
    get_last_non_comment_node,
    parse_asignment_expression,
} = require("../../helpers");

const is_possible_reference_id = (() => {
    const valid_values = ",}".split('');
    return token => {
        return token.id === "Delimiter" && valid_values.includes(token.value);
    };
})();

const property_definition = new AST_Node_Definition({
    id         : "Property definition",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : (node, current_token, parser) => {
        const property_name = parser.prev_node;

        parser.prepare_next_state("delimiter", true);
        parser.expect(':', parser => parser.next_token.value === ':');
        const delimiter = parser.generate_next_node();

        parser.prepare_next_state("expression", true);
        const initializer = parse_asignment_expression(parser);

        node.property_name = property_name;
        node.delimiter     = delimiter;
        node.initializer   = initializer;
        node.start         = property_name.start;
        node.end           = initializer.end;
    }
});

const cover_initialized_name = new AST_Node_Definition({
    id         : "Cover initialized name",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : (node, current_token, parser) => {
        const identifier = parser.generate_next_node();

        parser.prepare_next_state("expression", true);
        const initializer = initializer_definition.generate_new_node(parser);

        node.identifier  = identifier;
        node.initializer = initializer;
        node.start       = identifier.start;
        node.end         = initializer.end;
    }
});

const parse_property_definition = parser => {
    let property;
    const next_token = parser.look_ahead(true);

    if (next_token.id === "Operator" && next_token.value === '=') {
        if (! is_identifier(parser)) {
            parser.throw_unexpected_token(null, next_token);
        }
        property = cover_initialized_name.generate_new_node(parser);
    } else if (is_possible_reference_id(next_token)) {
        if (! is_identifier(parser)) {
            parser.throw_unexpected_token(null, next_token);
        }
        property = parser.generate_next_node();
        parser.prepare_next_state("expression", true);
    } else if (is_asterisk(parser.next_token)) {
        parser.change_state("method_definition");
        property = parser.generate_next_node();
        parser.prepare_next_state("delimiter", true);
    } else {
        parser.prev_node = property_name.generate_new_node(parser);
        const next_token = parser.look_ahead(true);

        if (next_token.id === "Delimiter" && next_token.value === ':') {
            property = property_definition.generate_new_node(parser);
        } else {
            parser.change_state("method_definition");
            property = parser.generate_next_node();
            parser.prepare_next_state("delimiter", true);
        }
    }

    return property;
};

module.exports = {
    id         : "Object literal",
    type       : "Primitive",
    precedence : PRIMITIVE,

    is : (token, parser) => {
        if (is_expression(parser) && is_delimiter_token(token, '{')) {
            return get_last_non_comment_node(parser) === null;
        }
    },
    initialize : (node, token, parser) => {
        const properties        = [];
        const delimiters        = [];
        const { current_state } = parser;

        const open = terminal_definition.generate_new_node(parser);

        let cover_name;
        parser.prepare_next_state("expression", true);
        while (! is_close_curly(parser)) {
            const property = parse_property_definition(parser);
            if (! cover_name && property.id === "Cover initialized name") {
                cover_name = property;
            }
            properties.push(property);

            if (parser.next_token === null) {
                parser.throw_unexpected_end_of_stream();
            } else if (is_comma(parser)) {
                delimiters.push(
                    terminal_definition.generate_new_node(parser)
                );

                parser.prepare_next_state("expression", true);
            }
        }
        const close = terminal_definition.generate_new_node(parser);

        node.open_curly_bracket  = open;
        node.properties          = properties;
        node.delimiters          = delimiters;
        node.close_curly_bracket = close;
        node.start               = open.start;
        node.end                 = close.end;

        // Check cover
        const next_token = parser.look_ahead(cover_name !== undefined);
        const has_cover = (
            next_token &&
            next_token.id    === "Operator" &&
            next_token.value === '='
        );

        if (cover_name && ! has_cover) {
            parser.throw_unexpected_token(
                null, cover_name.initializer.assign_operator
            );
        }

        if (has_cover) {
            parser.prev_node  = node;
            parser.prev_state = current_state;
            parser.change_state("binding_pattern");
        } else {
            parser.next_token    = token;
            parser.current_state = current_state;
        }
    }
};
