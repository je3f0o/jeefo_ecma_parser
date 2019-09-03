/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : keywords.js
* Created at  : 2019-09-03
* Updated at  : 2019-09-03
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

const { keyword }         = require("../enums/states_enum");
const { TERMINAL_SYMBOL } = require("../enums/precedence_enum");
const { get_pre_comment } = require("../../helpers");

const is_array = Array.isArray;

const keywords = [
    "await",
    "break",
    "case, catch, class, const, continue".split(", "),
    "debugger, default, delete, do".split(", "),
    "else, export, extends".split(", "),
    "finally, for, function".split(", "),
    "if, import, in, instanceof".split(", "),
    "new",
    "return",
    "super, switch".split(", "),
    "this, throw, trye, typeof".split(", "),
    "var, void".split(", "),
    "while, with".split(", "),
    "yield",
].reduce((result, value) => {
    if (is_array(value)) {
        result = result.concat(value);
    } else {
        result.push(value);
    }
    return result;
}, []);

module.exports = {
    id         : "Keyword",
    type       : "Terminal symbol token",
    precedence : TERMINAL_SYMBOL,

    is (token, parser) {
        if (parser.current_state === keyword && token.id === "Identifier") {
            return keywords.includes(token.value);
        }
    },
    initialize (node, token, parser) {
        node.pre_comment = get_pre_comment(parser);
        node.value       = token.value;
        node.start       = token.start;
        node.end         = token.end;
    }
};
