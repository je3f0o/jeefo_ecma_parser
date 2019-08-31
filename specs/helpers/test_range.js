/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : test_range.js
* Created at  : 2019-08-08
* Updated at  : 2019-08-30
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

const expect = require("expect.js");

module.exports = (test_case, node, streamer) => {
    it("should be in correct range", () => {
        const string = streamer.substring_from_token(node);
        expect(string).to.be(test_case.code);
    });
};
