/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : test_parser.js
* Created at  : 2019-05-27
* Updated at  : 2019-10-11
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
    //source = fs.readFileSync("/Users/jeefo/projects/my_own_secret_project/public/js/peer.js", "utf8");
    //source = fs.readFileSync("/Users/jeefo/projects/my_own_secret_project/public/js/bootstrap.js", "utf8");
    //source = fs.readFileSync("/Users/jeefo/projects/my_own_secret_project/public/js/main.js", "utf8");
    //source = fs.readFileSync("/Users/jeefo/projects/javascript_parser/src/es5/operators/binary_operators.js", "utf8");
    //source = fs.readFileSync("/Users/jeefo/projects/javascript_parser/src/es5/delimiters.js", "utf8");
    //source = fs.readFileSync("/Users/jeefo/projects/javascript_parser/src/es5/tokenizer.js", "utf8");
    //source = fs.readFileSync("/Users/jeefo/projects/jeefo_parser/src/unexpected_token_exception.js", "utf8");
    //source = fs.readFileSync("/Users/jeefo/projects/jeefo_parser/src/ast_node_table.js", "utf8");
    //source = fs.readFileSync("/Users/jeefo/projects/jeefo_parser/index.js", "utf8");
    //source = fs.readFileSync("/Users/jeefo/projects/jeefo_modules/jqlite/src/event_methods.js", "utf8");
    //source = fs.readFileSync("/Users/jeefo/projects/jeefo_modules/jqlite/src/index.js", "utf8");
    //source = fs.readFileSync("/Users/jeefo/projects/jeefo_modules/template/tokens/element.js", "utf8");
    //source = fs.readFileSync("/Users/jeefo/projects/jeefo_modules/resource/index.js", "utf8");
    //source = fs.readFileSync("/Users/jeefo/projects/javascript_parser/src/es5/statements/throw_statement.js", "utf8");
    //source = fs.readFileSync("/Users/jeefo/projects/my_own_secret_project/public/js/services/session_manager.js", "utf8");
    //source = fs.readFileSync("/Users/jeefo/projects/my_own_secret_project/public/js/uuid_v4.js", "utf8");
    //source = fs.readFileSync("/Users/jeefo/projects/jeefo_modules/component/src/component_definition.js", "utf8");
    //source = fs.readFileSync("/Users/jeefo/projects/jeefo_modules/component/src/structure_component.js", "utf8");
    //source = fs.readFileSync("/Users/jeefo/projects/my_own_secret_project/front_end/components/shaders/basic_2d_shader.js", "utf8");
    source = fs.readFileSync("/Users/jeefo/projects/my_own_secret_project/front_end/components/main_component.js", "utf8");
    //source = fs.readFileSync("/Users/jeefo/projects/my_own_secret_project/front_end/components/player.js", "utf8");
    //source = fs.readFileSync("/Users/jeefo/projects/my_own_secret_project/front_end/services/session_manager.js", "utf8");
}

const nodes = parser.parse(source);
//parser.tokenizer.init("async function async (z = 2) {}");
//parser.tokenizer.init("a = 2");
//parser.prepare_next_state("expression", true);
//const nodes = parser.parse("a=2");

console.log("===========================");
nodes.forEach(node => print_node(node));
//console.log(parser.node_table.get_reserved_words());
