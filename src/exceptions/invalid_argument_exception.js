/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : invalid_argument_exception.js
* Created at  : 2019-01-05
* Updated at  : 2019-01-15
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

var style       = require("../misc/style"),
	jeefo_class = require("../misc/jeefo_class");

var CONSTRUCTOR_NAME = "InvalidArgumentException",
	FIRST_LINE_REGEX = /^.+[^\n]\n/;

module.exports = jeefo_class.create(CONSTRUCTOR_NAME, TypeError, {
	constructor : function (function_name, parameter_name, parameter_index, parameter_value, error_message) {
		Error.captureStackTrace(this, this.constructor);

		var description = [
			style(`${ function_name }(`, "magenta"),
			style("Parameter[", "gray"),
			style(`index:${ parameter_index }`, "green"),
			style('] => ', "gray"),
			style(parameter_name, "yellow"),
			style(") ", "magenta"),
			style("is called with invalid argument.", "gray"),
		].join('');

		var instance = [
			style("[Function: ", "gray"),
			style(CONSTRUCTOR_NAME, "magenta"),
			style("]", "gray"),
		].join('');

		var parameter = [
			style("Parameter[", "gray"),
			style(parameter_name, "yellow"),
			style(']', "gray"),
		].join(''), parameter_value_string;

		if (typeof parameter_value === "string") {
			parameter_value_string = `'${ parameter_value }'`;
		} else if (parameter_value === null) {
			parameter_value_string = "null";
		} else if (Array.isArray(parameter_value)) {
			parameter_value_string = `[${ parameter_value }]`;
		}

		this.stack = [
			`${ style("Error      ", "cyan") } : ${ style("TypeError", "red") }`,
			`${ style("Message", "cyan") }     : ${ style(error_message, "grey") }`,
			`${ style("Instanceof ", "cyan") } : ${ instance }`,
			`${ style("Description", "cyan") } : ${ description }`,
			style("------------------------------------------", "grey"),
			`${ parameter } => ${ parameter_value_string }`,
			`${ style("Stack trace", "red")  } =>\n${ this.stack.replace(FIRST_LINE_REGEX, '') }`,
		].join("\n");

		this.error_message   = error_message;
		this.function_name   = function_name;
		this.parameter_name  = parameter_name;
		this.parameter_index = parameter_index;
		this.parameter_value = parameter_value;
	}
});
