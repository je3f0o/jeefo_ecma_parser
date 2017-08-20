/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : es6_parser.js
* Created at  : 2017-05-23
* Updated at  : 2017-08-20
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var Parser       = require("./parser"),
	tokenizer    = require("./es6/tokenizer"),
	symbol_table = require("./es6/symbol_table");

module.exports = new Parser(tokenizer, symbol_table);

// ignore:start
// Debug {{{1
if (require.main === module) {
	
	var p = module.exports, source;
	var print_substr = function (token) {
		console.log("-----------------------");
		console.log(source.slice(token.start.index, token.end.index));
		console.log("----------------------------------------");
	};
	var _print = function (token) {
		console.log("----------------------------------------");
		console.log(token);
		print_substr(token);
	};

	var fs       = require("fs");
	var path     = require("path");
	var filename = path.join(__dirname, "./es6_parser.js");
	source       = fs.readFileSync(filename, "utf8");

	source = `
	export default function () {}
	export default a = 2;
	searchables.push({
		type          : header.type,
		model         : header.model,
		attrs         : { ngIf : \`configs.\${ header.model }.is_renderable\` },
		is_searchable : index > 0,
	});
	\`Hello??\${ namespace }\${ other }\`;
	jt\`hello\`;
	x => {

	};
	(x, y) => {
		x = y;
	};
	a + 1 
	return function (d) {
		return (d.values.length > 1) ? liner(d.values) : null;
	};
	do console.log(123)
		while (true)
	break b
	return z
	var a =
		b
	z = {
		// "wheel.zoom"      : { is_enabled : false },
		"dblclick.zoom"   : { is_enabled : false },
		// "mousewheel.zoom" : { is_enabled : false }
	}
`;

try {
	var r = p.parse(source);
	for (var i = 0; i < r.length; ++i) {
		_print(r[i]);
	}
	//print(r[13].expression.right);
} catch(e) {
	console.log(e);
	console.log(e.stack);
}

	//process.exit();
}
// }}}1
// ignore:end
