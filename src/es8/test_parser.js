/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : test_parser.js
* Created at  : 2019-05-27
* Updated at  : 2020-09-09
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

const parser = require("./parser");

const print_node = (node, is_expression) => {
    if (!node || ! node.start || ! node.end) {
        console.log(node);
        throw new Error(1);
    }
    if (node.id !== "Comment") {
        console.log(`code: \`${ parser.tokenizer.streamer.substring_from_token(node) }\``);
        node.print();
    }

    if (! is_expression && node.id !== "Comment") {
        console.log("\n[END] -------------------------------------------------------\n");
    }
};

const fs = require("fs");
let source;
if (process.argv.length > 2) {
    source = fs.readFileSync("./test", "utf8");
} else {
    //source = fs.readFileSync("/home/jeefo/projects/@jeefo/ecma_parser/src/es6/expressions/initializer.js", "utf8");
    //source = fs.readFileSync("/home/jeefo/projects/wmc/service_worker/jeefo_router.js", "utf8");
    //source = fs.readFileSync("/home/jeefo/projects/wmc/service_worker/router.js", "utf8");
    //source = fs.readFileSync("/home/jeefo/projects/wmc/node_modules/@jeefo/parser/index.js", "utf8");
    //source = fs.readFileSync("/home/jeefo/projects/wmc/node_modules/@jeefo/parser/unexpected_token_exception.js", "utf8");
    //source = fs.readFileSync("/home/jeefo/projects/wmc/node_modules/@jeefo/utils/event_emitter.js", "utf8");
    //source = fs.readFileSync("/home/jeefo/projects/@jeefo/ecma_parser/src/es8/literals/numeric_literal.js", "utf8");
    //source = fs.readFileSync("/home/jeefo/projects/wmc/node_modules/@jeefo/jqlite/jeefo_element.js", "utf8");
    //source = fs.readFileSync("/home/jeefo/projects/wmc/front_end/libs/session/player.js", "utf8");
    source = fs.readFileSync("/home/jeefo/projects/wmc/node_modules/@jeefo/material/services/typography.js", "utf8");
    //source = fs.readFileSync("/home/jeefo/projects/@jeefo/ecma_parser/node_modules/@jeefo/parser/index.js", "utf8");
    //source = fs.readFileSync("/home/jeefo/projects/@jeefo/ecma_parser/node_modules/@jeefo/parser/ast_node_definition.js", "utf8");
}

const nodes = parser.parse(source);
//parser.tokenizer.init("async function async (z = 2) {}");
//parser.tokenizer.init("a = 2");
//parser.prepare_next_state("expression", true);
//const nodes = parser.parse("a=2");

console.log("===========================");
nodes.forEach(node => print_node(node));
//console.log(parser.node_table.get_reserved_words());
