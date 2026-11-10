// Based on /tg/station's code/modules/error_handler/error_viewer.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// error_viewer.dm:11
rt.def("/datum/controller/global_vars/proc/InitGlobalerror_cache", function InitGlobalerror_cache(f: Frame) {
	GLOB.error_cache = new_(T("/datum/error_viewer/error_cache"));
	this.gvars_datum_init_order += "error_cache";
	return f.dot;
});

rt.type(2293, "/datum/error_viewer", "/datum", {
	name: "",
});

// error_viewer.dm:28
rt.def("/datum/error_viewer/proc/browse_to", function* browse_to(f: Frame, user: Value, html: Value) {
	let browser: Value = null;
	(browser = (yield* new_(T("/datum/browser"), user.mob, "error_viewer", null, 600, 400))).set_content(html);
	browser.add_head_content("\n\t<style>\n\t.runtime\n\t{\n\t\tbackground-color: #171717;\n\t\tborder: solid 1px #202020;\n\t\tfont-family: \"Courier New\";\n\t\tpadding-left: 10px;\n\t\tcolor: #CCCCCC;\n\t}\n\t.runtime_line\n\t{\n\t\tmargin-bottom: 10px;\n\t\tdisplay: inline-block;\n\t}\n\t</style>\n\t");
	yield* browser.open();
	return f.dot;
}, true);

// error_viewer.dm:52
rt.def("/datum/error_viewer/proc/build_header", function build_header(f: Frame, back_to: Value, linear: Value) {
	f.dot = "";
	if (rt.istype(back_to, T("/datum/error_viewer"))) {
		f.dot += back_to.make_link("<b>&lt;&lt;&lt;</b>", null, linear);
	}
	f.dot += `${this.make_link("Refresh")}<br><br>`;
	return f.dot;
});

// error_viewer.dm:64
rt.def("/datum/error_viewer/proc/make_link", function make_link(f: Frame, linktext: Value, back_to: Value, linear: Value) {
	let back_to_param: Value = "";
	if (!linktext) {
		linktext = this.name;
	}
	if (rt.istype(back_to, T("/datum/error_viewer"))) {
		back_to_param = fmt(";viewruntime_backto=＃", [back_to]);
	}
	if (linear) {
		back_to_param += ";viewruntime_linear=1";
	}
	return fmt("<a href='?_src_=holder;viewruntime=＃＀'>＀</a>", [this, back_to_param, linktext]);
});

rt.type(2294, "/datum/error_viewer/error_cache", "/datum/error_viewer", {
	errors: null,
	error_sources: null,
	errors_silenced: null,
});

// error_viewer.dm:77
rt.def("/datum/error_viewer/error_cache/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.errors = list();

	this.error_sources = list();

	this.errors_silenced = list();
	return f.dot;
});

// error_viewer.dm:82
rt.def("/datum/error_viewer/error_cache/proc/show_to", function* show_to(f: Frame, user: Value, back_to: Value, linear: Value) {
	let error_source: Value = null, erroruid: Value = null, error_entry: Value = null;
	let html: Value = this.build_header();
	html += `<b>${GLOB.total_runtimes}</b> runtimes, <b>${GLOB.total_runtimes_skipped}</b> skipped<br><br>`;
	if (!linear) {
		html += `organized | ${this.make_link("linear", null, 1)}<hr>`;
		for (erroruid of each(this.error_sources)) {
			html += `${(error_source = rt.index(this.error_sources, erroruid)).make_link(null, this)}<br>`;
		}
	} else {
		html += `${this.make_link("organized", null)} | linear<hr>`;
		for (error_entry of each(this.errors, T("/datum/error_viewer/error_entry"))) {
			html += `${error_entry.make_link(null, this, 1)}<br>`;
		}
	}
	yield* this.browse_to(user, html);
	return f.dot;
}, true);

// error_viewer.dm:99
rt.def("/datum/error_viewer/error_cache/proc/log_error", function log_error(f: Frame, e: Value, desclines: Value, skip_count: Value) {
	let error_source: Value = null, error_entry: Value = null, err_msg_delay: Value = null;
	if (!rt.istype(e, T("/exception"))) {
		return f.dot;
	}
	let erroruid: Value = `${e.file}${e.line}`;
	if (!(error_source = rt.index(this.error_sources, erroruid))) {
		error_source = new_(T("/datum/error_viewer/error_source"), e);
		rt.setAt(this.error_sources, erroruid, error_source);
	}
	(error_entry = new_(T("/datum/error_viewer/error_entry"), e, desclines, skip_count)).error_source = error_source;
	this.errors += error_entry;
	error_source.errors += error_entry;
	if (skip_count) {
		return f.dot;
	}
	if (!(error_source.next_message_at <= rt.worldTime(f))) return f.dot;
	let viewtext: Value = "[view]";
	if (GLOB.config) {
		err_msg_delay = GLOB.config.error_msg_delay;
	} else {
		err_msg_delay = rt.initial(f, GLOB.config, "error_msg_delay");
	}
	error_source.next_message_at = rt.worldTime(f) + err_msg_delay;
	return f.dot;
});

rt.type(2295, "/datum/error_viewer/error_source", "/datum/error_viewer", {
	errors: null,
	next_message_at: 0,
});

// error_viewer.dm:128
rt.def("/datum/error_viewer/error_source/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.errors = list();
	return f.dot;
});

// error_viewer.dm:132
rt.def("/datum/error_viewer/error_source/proc/New", function New(f: Frame, e: Value) {
	if (!rt.istype(e, T("/exception"))) {
		this.name = `[${time_stamp()}] Uncaught exceptions`;
		return f.dot;
	}
	this.name = `<b>[${time_stamp()}]</b> Runtime in <b>${e.file}</b>, line <b>${e.line}</b>: <b>${html_encode(e.name)}</b>`;
	return f.dot;
});

// error_viewer.dm:139
rt.def("/datum/error_viewer/error_source/proc/show_to", function* show_to(f: Frame, user: Value, back_to: Value, linear: Value) {
	let error_entry: Value = null;
	if (!rt.istype(back_to, T("/datum/error_viewer"))) {
		back_to = GLOB.error_cache;
	}
	let html: Value = this.build_header(back_to);
	for (error_entry of each(this.errors, T("/datum/error_viewer/error_entry"))) {
		html += `${error_entry.make_link(null, this)}<br>`;
	}
	yield* this.browse_to(user, html);
	return f.dot;
}, true);

rt.type(2296, "/datum/error_viewer/error_entry", "/datum/error_viewer", {
	error_source: null,
	exc: null,
	desc: "",
	usr_ref: null,
	usr_loc: null,
	is_skip_count: null,
});

// error_viewer.dm:157
rt.def("/datum/error_viewer/error_entry/proc/New", function New(f: Frame, e: Value, desclines: Value, skip_count: Value) {
	let line: Value = null;
	if (!rt.istype(e, T("/exception"))) {
		this.name = `<b>[${time_stamp()}]</b> Uncaught exception: <b>${html_encode(e.name)}</b>`;
		return f.dot;
	}
	if (skip_count) {
		this.name = `[${time_stamp()}] Skipped ${skip_count} runtimes in ${e.file},${e.line}.`;
		this.is_skip_count = 1;
		return f.dot;
	}
	this.name = `<b>[${time_stamp()}]</b> Runtime in <b>${e.file}</b>, line <b>${e.line}</b>: <b>${html_encode(e.name)}</b>`;
	this.exc = e;
	if (rt.istype(desclines, T("/list"))) {
		for (line of each(desclines)) {
			this.desc += `<span class='runtime_line'>${html_encode(line)}</span><br>`;
		}
	}
	if (!f.usr) return f.dot;
	this.usr_ref = fmt("＃", [f.usr]);
	this.usr_loc = rt.getStep(f, f.usr, 0);
	return f.dot;
});

// error_viewer.dm:178
rt.def("/datum/error_viewer/error_entry/proc/show_to", function* show_to(f: Frame, user: Value, back_to: Value, linear: Value) {
	if (!rt.istype(back_to, T("/datum/error_viewer"))) {
		back_to = this.error_source;
	}
	let html: Value = this.build_header(back_to, linear);
	html += `${this.name}<div class='runtime'>${this.desc}</div>`;
	if (this.usr_ref) {
		html += `<br><b>usr</b>: <a href='?_src_=vars;Vars=${this.usr_ref}'>VV</a>`;
		html += ` <a href='?_src_=holder;adminplayeropts=${this.usr_ref}'>PP</a>`;
		html += ` <a href='?_src_=holder;adminplayerobservefollow=${this.usr_ref}'>Follow</a>`;
		if (rt.istype(this.usr_loc, T("/turf"))) {
			html += fmt("<br><b>usr.loc</b>: <a href='?_src_=vars;Vars=＃'>VV</a>", [this.usr_loc]);
			html += ` <a href='?_src_=holder;adminplayerobservecoodjump=1;X=${this.usr_loc.x};Y=${this.usr_loc.y};Z=${this.usr_loc.z}'>JMP</a>`;
		}
	}
	yield* this.browse_to(user, html);
	return f.dot;
}, true);

// error_viewer.dm:194
rt.def("/datum/error_viewer/error_entry/proc/make_link", function make_link(f: Frame, linktext: Value, back_to: Value, linear: Value) {
	return this.is_skip_count ? this.name : parent_proc();
}, false);
