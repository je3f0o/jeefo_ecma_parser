/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : lexical_declaration.js
* Created at  : 2019-08-24
* Updated at  : 2020-10-23
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

const {DECLARATION}                    = require("../enums/precedence_enum");
const {statement, lexical_declaration} = require("../enums/states_enum");
const {
    is_assign_token,
    is_delimiter_token,
    has_no_line_terminator,
} = require("../../helpers");

const is_strict = ({context_stack}) => context_stack.includes("strict mode");
const is_let_or_const = ({id, value}) =>
    id === "Identifier" && ["let", "const"].includes(value);

const validate_binding = (node, is_const, parser) => {
    if (! node.initializer) {
        if (is_const) {
            parser.throw_unexpected_token(
                "Missing initializer in const declaration", node
            );
        } else if (node.binding.id === "Binding pattern") {
            parser.throw_unexpected_token(
                "Missing initializer in destructuring declaration", node
            );
        }
    }
};

module.exports = {
    id         : "Lexical declaration",
    type       : "Let and Const declarations",
    precedence : DECLARATION,

    is ({value}, parser) {
        switch (parser.current_state) {
            case statement:
                if (value === "let" && ! is_strict(parser)) {
                    const next_token = parser.look_ahead();
                    return next_token && !is_assign_token(next_token);
                }
                return true;
            case lexical_declaration: return true;
        }
    },

    initialize (node, token, parser) {
        parser.expect("LetOrConst", is_let_or_const(parser.next_token));
        if (token.value === "let") {
            parser.change_state("contextual_keyword");
        } else {
            parser.change_state("keyword");
        }
        const keyword = parser.generate_next_node();

        const list       = [];
        const is_const   = keyword.value === "const";
        const delimiters = [];
        let   terminator = null;

        do {
            const prev_ASI = parser.ASI;
            parser.ASI = true;
            parser.prepare_next_state("lexical_binding", true);
            const binding = parser.generate_next_node();
            validate_binding(binding, is_const, parser);
            list.push(binding);
            parser.ASI = prev_ASI;

            const next_token = parser.look_ahead();
            if (! next_token) break;
            if (is_delimiter_token(next_token, ',')) {
                parser.prepare_next_state("punctuator", true);
                delimiters.push(parser.generate_next_node());
            } else if (has_no_line_terminator(binding, next_token)) {
                parser.expect(';', is_delimiter_token(next_token, ';'));
                parser.prepare_next_state("punctuator", true);
                terminator = parser.generate_next_node();
                break;
            } else {
                // ASI
                break;
            }
        } while (true);

        node.keyword      = keyword;
        node.binding_list = list;
        node.delimiters   = delimiters;
        node.terminator   = terminator;
        node.start        = keyword.start;
        node.end          = (terminator || list[list.length - 1]).end;

        parser.terminate(node);
    },

    refine (node, whatever, parser) {
        parser.expect("LetOrConst", is_let_or_const(parser.next_token));
        if (parser.next_token.value === "let") {
            parser.change_state("contextual_keyword");
        } else {
            parser.change_state("keyword");
        }

        const list       = [];
        const keyword    = parser.generate_next_node();
        const is_const   = keyword.value === "const";
        const delimiters = [];
        let   terminator = null;
        let   validated_first_binging;

        LOOP:
        do {
            parser.prepare_next_state("lexical_binding", true);
            const binding = parser.generate_next_node();
            if (list.length > 1) validate_binding(binding, is_const, parser);
            list.push(binding);

            const {id, value} = parser.look_ahead(true);
            switch (id) {
                case "Delimiter" :
                    switch (value) {
                        case ',' :
                            validate_binding(list[0], is_const, parser);
                            validated_first_binging = true;
                            parser.prepare_next_state("punctuator", true);
                            delimiters.push(parser.generate_next_node());
                            break;
                        case ';' :
                            if (! validated_first_binging) {
                                validate_binding(list[0], is_const, parser);
                            }
                            parser.prepare_next_state("punctuator", true);
                            terminator = parser.generate_next_node();
                            break LOOP;
                        default: parser.throw_unexpected_token();
                    }
                    break;
                case "Identifier" :
                    if (["in", "of"].includes(value)) break LOOP;
                    parser.throw_unexpected_token();
                    break;
                default: parser.throw_unexpected_token();
            }
        } while (true);

        node.keyword      = keyword;
        node.binding_list = list;
        node.delimiters   = delimiters;
        node.terminator   = terminator;
        node.start        = keyword.start;
        node.end          = (terminator || list[list.length - 1]).end;
    }
};
