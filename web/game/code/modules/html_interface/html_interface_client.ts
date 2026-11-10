// Based on /tg/station's code/modules/html_interface/html_interface_client.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(2710, "/datum/html_interface_client", "/datum", {
	client: null,
	layout: null,
	title: null,
	is_loaded: 0,
	active: 1,
	extra_vars: null,
	content_elements: null,
});

// html_interface_client.dm:9
rt.def("/datum/html_interface_client/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.content_elements = new_(T("/list"));
	return f.dot;
});

// html_interface_client.dm:24
rt.def("/datum/html_interface_client/proc/New", function New(f: Frame, client: Value) {
	f.dot = parent_proc();
	this.client = client;
	return f.dot;
}, false);

// html_interface_client.dm:29
rt.def("/datum/html_interface_client/proc/putExtraVar", function putExtraVar(f: Frame, key: Value, value: Value) {
	if (!this.extra_vars) {
		this.extra_vars = new_(T("/list"));
	}
	rt.setAt(this.extra_vars, key, value);
	return f.dot;
});

// html_interface_client.dm:43
rt.def("/datum/html_interface_client/proc/getExtraVar", function getExtraVar(f: Frame, key: Value) {
	if (!this.extra_vars) return f.dot;
	return rt.index(this.extra_vars, key);
});
