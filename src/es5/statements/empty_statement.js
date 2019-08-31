/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : empty_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-08-28
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-12.3
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { statement } = require("../enums/states_enum");
const { STATEMENT } = require("../enums/precedence_enum");
const {
    get_pre_comment,
    is_delimiter_token,
} = require("../../helpers");

module.exports = {
    id         : "Empty statement",
    type       : "Statement",
    precedence : STATEMENT,

    is : (token, parser) => {
        if (parser.current_state === statement) {
            return is_delimiter_token(token, ';');
        }
    },
    initialize : (node, token, parser) => {
        node.pre_comment = get_pre_comment(parser);
        node.value       = ';';
        node.start       = token.start;
        node.end         = token.end;

        parser.terminate(node);
    }
};
