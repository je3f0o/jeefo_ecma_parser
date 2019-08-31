/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : test_keyword.js
* Created at  : 2019-04-02
* Updated at  : 2019-08-06
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

const expect         = require("expect.js"),
      test_substring = require("./test_substring");

module.exports = (keyword, comment, node, streamer) => {
    expect(node).not.to.be(null);
    expect(node.id).to.be("Keyword");
    expect(node.type).to.be("Keyword");
    expect(node.precedence).to.be(-1);

    if (comment === null) {
        expect(node.pre_comment).to.be(null);
    } else {
        expect(node.pre_comment).not.to.be(null);
        test_substring(comment, streamer, node.pre_comment);
    }

    expect(node.value).to.be(keyword);
    test_substring(keyword, streamer, node);
};
