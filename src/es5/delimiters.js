/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : delimiters.js
* Created at  : 2017-08-17
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

const delimiters = [
    '(', ')',
    '[', ']',
    '{', '}',
    ',', ':', ';',
];

module.exports = {
    id         : "Delimiter",
    type       : "Delimiter",
    precedence : -1,

    is : token => {
        return token.id === "Delimiter" && delimiters.includes(token.value);
    },
    initialize : (_, __, parser) => {
        parser.throw_unexpected_token(
            "Delimiter tokens cannot be initialized"
        );
    }
};
