/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : delimiters.js
* Created at  : 2019-03-05
* Updated at  : 2019-03-31
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-7.7
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

module.exports = [
    '.', ',',
    '/', '?',
    ';', ':',
    "'", '"',
    '`', '~',
    '-', '*',
    '=', '+',
    '(', ')',
    '[', ']',
    '{', '}',
    '<', '>',
    '!', '%',
    '^', '&',
    '|',
    // unused characters, but useful for identifiers.
    '#',
    '\\',
    '@',
];
