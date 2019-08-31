/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : test_initializer.js
* Created at  : 2019-08-12
* Updated at  : 2019-08-12
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

const expect         = require("expect.js");
const test_substring = require("../../helpers/test_substring");

module.exports = (spec, node, streamer) => {
    expect(node).not.to.be(null);
    expect(node.id).to.be("Initializer");
    expect(node.type).to.be("Expression");
    expect(node.precedence).to.be(-1);

    test_substring(spec.operator   , streamer , node.assign_operator);
    test_substring(spec.expression , streamer , node.expression);
    test_substring(spec.str, streamer, node);
};
