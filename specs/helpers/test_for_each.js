/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : test_for_each.js
* Created at  : 2019-08-08
* Updated at  : 2019-08-08
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

module.exports = (test_cases, callback) => {
    test_cases.forEach(test_case => {
        const source = test_case.source.replace(/\n/g, "\\n");
        describe(`Test against source text: ${source}`, () => {
            callback(test_case);
        });
    });
};
