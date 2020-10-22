/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : keyword.js
* Created at  : 2019-09-03
* Updated at  : 2020-09-11
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

const {IDENTIFIER}      = require("../enums/precedence_enum");
const {get_pre_comment} = require("../../helpers");
const {
    keyword,
    contextual_keyword,
    terminal_symbol_keyword,
} = require("../enums/states_enum");

const keywords = [
    "break",
    "case catch class const continue",
    "debugger default delete do",
    "else export extends",
    "finally for function",
    "if import in instanceof",
    "new",
    "return",
    "super switch",
    "this throw try typeof",
    "var void",
    "while with",
].reduce((result, value) => result.concat(value.split(' ')), []);

const strict_mode_keywords = [
    "let",
    "static",
];

const contextual_keywords = [
    "await",
    "yield",
];

const terminal_symbol_keywords = [
    "of",
    "get",
    "set",
    "async",
    "target",
];

const init = (node, token, comment) => {
    node.pre_comment = comment;
    node.value       = token.value;
    node.start       = token.start;
    node.end         = token.end;
};

module.exports = {
    id         : "Keyword",
    type       : "Names and Keywords",
    precedence : IDENTIFIER,

    is (token, {current_state, context_stack, suffixes}) {
        switch (current_state) {
            case keyword :
                if (keywords.includes(token.value)) return true;

                const is_strict_mode_keyword = (
                    context_stack.includes("strict mode") &&
                    strict_mode_keywords.includes(token.value)
                );
                if (is_strict_mode_keyword) {
                    token.is_strict = true;
                    return true;
                }

                if (contextual_keywords.includes(token.value)) {
                    return suffixes.includes(token.value);
                }
                break;
            case contextual_keyword: // depricated
                return true;
            case terminal_symbol_keyword: return true;
        }
    },

    initialize (node, token, parser) {
        if (parser.current_state === terminal_symbol_keyword) {
            if (! terminal_symbol_keywords.includes(token.value)) {
                parser.throw_unexpected_token();
            }
        } else {
            parser.expect("Identifier", token.id === "Identifier");
        }
        init(node, token, get_pre_comment(parser));
    },

    refine (node, expr, parser) {
        switch (expr.id) {
            case "Property name" :
                expr = expr.expression;
                break;
            case "Identifier reference" :
                expr = expr.identifier.identifier_name;
                break;
            case "Identifier name": break;
            default: parser.throw_unexpected_refine(node, expr);
        }
        if (! terminal_symbol_keywords.includes(expr.value)) {
            parser.throw_unexpected_refine(node, expr);
        }

        init(node, expr, expr.pre_comment);
    }
};
