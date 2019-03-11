/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : style.js
* Created at  : 2017-08-31
* Updated at  : 2017-08-31
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var colors   = require("./colors"),
	is_array = Array.isArray,
	//colors_support = +(require("child_process").execSync("tput colors").toString()),

apply_style = function (message, style) {
	return colors[style](message);
};

module.exports = function style (message, styles) {
	if (typeof styles === "string") {
		message = apply_style(message, styles);
	} else if (is_array(styles)) {
		var i = styles.length;
		while (i--) {
			message = apply_style(message, styles[i]);
		}
	}

	return message;
};
