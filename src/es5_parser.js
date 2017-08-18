/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : es5_parser.js
* Created at  : 2017-05-22
* Updated at  : 2017-08-18
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var Parser           = require("./parser"),
	es5_tokenizer    = require("./es5/tokenizer"),
	es5_symbol_table = require("./es5/symbol_table");

module.exports = new Parser(es5_tokenizer, es5_symbol_table);

// ignore:start
// Debug {{{1
if (require.main === module) {

var parser = module.exports, source;
var print_substr = function (token) {
	console.log("-----------------------");
	console.log(source.substring(token.start.index, token.end.index));
	console.log("----------------------------------------");
};
var _print = function (token) {
	console.log("----------------------------------------");
	console.log(token);
	print_substr(token);
};

source = `
var core_module = jeefo.module("jeefo_core", []),
CAMEL_CASE_REGEXP = /[A-Z]/g,
snake_case = function (str) {
	return str.replace(CAMEL_CASE_REGEXP, function (letter, pos) {
		return (pos ? '_' : '') + letter.toLowerCase();
	});
};
delete ZZ.ff;
typeof x;
return zzz;
throw z,a,b;
function fn (param1, param2) {}
continue LABEL;
break LABEL;
switch (tokens[i].type) {
	case "Number":
	case "Identifier":
		if (tokens[i - 1].end.index === tokens[i].start.index) {
			this.name += tokens[i].value;
		} else {
			break LOOP;
		}
		break;
	case "SpecialCharacter":
		switch (tokens[i].value) {
			case '$':
			case '_':
				if (tokens[i - 1].end.index === tokens[i].start.index) {
					this.name += tokens[i].value;
				} else {
					break LOOP;
				}
				break;
			default:
				break LOOP;
		}
		break;
	default:
		break LOOP;
}
try {
	return zzz;
} catch (e) {
	return error;
} finally {
	return final;
}
for (var i = 0; i < 5; ++i) {
	zz = as, gg = aa;
}
for (;;) {
	zz = as, gg = aa;
}
for (var a in b) {
	zz = as, gg = aa;
}
/*                 comment            */
//ignore:start
{
	var a = c + b.c * d - f, z = rr; 
}
while (zzz) {}
if (true) {
	;
} else if (qqq) {
	var z = h;
} else {
	var zzz = zzz;
}
z = aa || bb && cc;
z in f;
z instanceof f;
f ** f;
++a;
a++;
o = { a_1 : 99, $b : 2 };
[1,2,3];
{};
function a () {}
new Fn(1.2E2,2,3);
PP.define("IS_NULL", function (x) { return x === null;   }, true);
instance.define("IS_OBJECT" , function (x) { return x !== null && typeof x === "object"; } , true);
instance.define("ARRAY_EXISTS" , function (arr, x) { return arr.indexOf(x) >= 0; } , true);

do console.log(a++); while(a < 3);
return {
	pre : (link && link.pre) ? link.pre : null,
	/**
	 * Compiles and re-adds the contents
	 */
	post : function(scope, element) {
		// Compile the contents
		if (! compiledContents) {
			compiledContents = $compile(contents);
		}
		// Re-add the compiled contents to the element
		compiledContents(scope, function(clone) {
			element.append(clone);
		});

		// Call the post-linking function, if any
		if (link && link.post) {
			link.post.apply(null, arguments);
		}
	}
};
var fields           = form.fields.filter(function (f) { return f; }),
	violations       = form.violations,
	oversighted_type = form.oversighted_type,
	total_fields     = fields.length + 4, // oversighted_type, violations, title, num_attachments
	counter          = 0;
false;
(function check_condition () {
	if (is_canceled) { return; }
	var result = callback();

	if (result) {
		deferred.resolve();
	} else if ((Date.now() + interval) < end_time) {
		setTimeout(check_condition, interval);
	} else {
		deferred.reject();
	}
}());
var EXTRACT_FILENAME = /filename[^;\\n=]*=((?:['\\"]).*?\\2|[^;\\n]*)/g;
var HOST_CONSTRUCTOR_REGEX = /^\[object .+?Constructor\]$/; // 40
match    = match[0].match(/filename="([^"\\\\]*(?:\\.[^"\\\\]*)*)"/i);
filename = (match && match[1]) ? decodeURI(match[1]) : fallback_filename;
$ngRedux.connect(function () {
	var state = $ngRedux.getState();
	if (state.backdrop) {
		$element.css({
			bottom  : 0,
			opacity : 0.6,
		});
	} else {
		$element.css({
			bottom  : "100%",
			opacity : 0,
		});
	}

	return { backdrop : state.backdrop };
})(dumb_state);
return {
	'collapse-handler-right'          : ! folder.is_loading && ! folder.is_collapsed,
	'icon-spin4 animate-spin'         : folder.is_loading,
	'icon-right-dir collapse-handler' : ! folder.is_loading
};
divider *= 1024;
size = (size / divider);

define([], function () {
	function compare_by_id (a, b) {
		var result = 0;
		if (a.conclusion_id < b.conclusion_id) {
			result = -1;
		} else if (a.conclusion_id > b.conclusion_id) {
			result = 1;
		}
		return result;
	}
	function compare_by_string (a, b) { return a.rate.localeCompare(b.rate); }
});

this.REGEX_FLAGS.indexOf(flags_value.charAt(i)) !== -1 && flags.indexOf(flags_value.charAt(i)) === -1;
`;

try {
	var r = parser.parse(source);
	_print(r[13]);
	_print(r[14]);
	_print(r[38]);
} catch(e) {
	console.log(e);
	console.log(e.stack);
}

//print(r[0].declarations[2].init.body.body[0].argument.arguments[1].body.body[0].argument);
//print(r[9].statement.body[0]);
//print(r[12].expression.arguments[2].body.body[0].declarations[0].init.body.body[3]);


//console.log(r);

//process.exit();

}
// }}}1
// ignore:end
