// From code/modules/error_handler/error_viewer.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalerror_cache  (code/modules/error_handler/error_viewer.dm:11)
rt.def("/datum/controller/global_vars/proc/InitGlobalerror_cache", function InitGlobalerror_cache(f: Frame) {
	rt.setGl("error_cache", rt.new_(f, T("/datum/error_viewer/error_cache"), []));
	rt.modSrcVar(f, "gvars_datum_init_order", "error_cache", add);
	return f.dot;
});

rt.type(2293, "/datum/error_viewer", "/datum", {
	name: "",
});

// /datum/error_viewer/proc/browse_to  (code/modules/error_handler/error_viewer.dm:28)  may sleep
rt.def("/datum/error_viewer/proc/browse_to", function* browse_to(f: Frame, user: Value, html: Value) {
	let browser: Value = null;
	f.vars = () => [user, html, browser];
	yield* g.callName(f, (browser = (yield* g.new_(f, T("/datum/browser"), [rt.fv(f, "mob", live(user)), "error_viewer", null, 600, 400]))), "set_content", [live(html)]);
	yield* g.callName(f, live(browser), "add_head_content", ["\n\t<style>\n\t.runtime\n\t{\n\t\tbackground-color: #171717;\n\t\tborder: solid 1px #202020;\n\t\tfont-family: \"Courier New\";\n\t\tpadding-left: 10px;\n\t\tcolor: #CCCCCC;\n\t}\n\t.runtime_line\n\t{\n\t\tmargin-bottom: 10px;\n\t\tdisplay: inline-block;\n\t}\n\t</style>\n\t"]);
	yield* g.callName(f, live(browser), "open", []);
	return f.dot;
}, true);

// /datum/error_viewer/proc/build_header  (code/modules/error_handler/error_viewer.dm:52)
rt.def("/datum/error_viewer/proc/build_header", function build_header(f: Frame, back_to: Value, linear: Value) {
	f.dot = "";
	if (truthy((rt.istype(live(back_to), T("/datum/error_viewer")) ? 1 : 0))) {
		f.dot = rt.modify(live(f.dot), rt.callName(f, live(back_to), "make_link", ["<b>&lt;&lt;&lt;</b>", null, live(linear)]), add);
	}
	f.dot = rt.modify(live(f.dot), fmt("＀<br><br>", [rt.callSrc(f, "make_link", ["Refresh"])]), add);
	return f.dot;
});

// /datum/error_viewer/proc/make_link  (code/modules/error_handler/error_viewer.dm:64)
rt.def("/datum/error_viewer/proc/make_link", function make_link(f: Frame, linktext: Value, back_to: Value, linear: Value) {
	let back_to_param: Value = null;
	f.vars = () => [linktext, back_to_param];
	back_to_param = "";
	if (!truthy(live(linktext))) {
		linktext = rt.sv(f, "name");
	}
	if (truthy((rt.istype(live(back_to), T("/datum/error_viewer")) ? 1 : 0))) {
		back_to_param = fmt(";viewruntime_backto=＃", [live(back_to)]);
	}
	if (truthy(live(linear))) {
		back_to_param = rt.modify(live(back_to_param), ";viewruntime_linear=1", add);
	}
	return fmt("<a href='?_src_=holder;viewruntime=＃＀'>＀</a>", [live(f.src), live(back_to_param), live(linktext)]);
	return f.dot;
});

rt.type(2294, "/datum/error_viewer/error_cache", "/datum/error_viewer", {
	errors: null,
	error_sources: null,
	errors_silenced: null,
});

// /datum/error_viewer/error_cache/proc/<init>  (code/modules/error_handler/error_viewer.dm:77)
rt.def("/datum/error_viewer/error_cache/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "errors", rt.list());
	$0 = $0;
	rt.setSv(f, "error_sources", rt.list());
	$0 = $0;
	rt.setSv(f, "errors_silenced", rt.list());
	return f.dot;
});

// /datum/error_viewer/error_cache/proc/show_to  (code/modules/error_handler/error_viewer.dm:82)  may sleep
rt.def("/datum/error_viewer/error_cache/proc/show_to", function* show_to(f: Frame, user: Value, back_to: Value, linear: Value) {
	let html: Value = null, error_source: Value = null, erroruid: Value = null, error_entry: Value = null;
	let $e: any;
	f.vars = () => [user, back_to, linear, html, error_source, erroruid, error_entry, $e];
	html = (yield* g.srcCall(f, "build_header"));
	html = rt.modify(live(html), fmt("<b>＀</b> runtimes, <b>＀</b> skipped<br><br>", [rt.gl("total_runtimes"), rt.gl("total_runtimes_skipped")]), add);
	if (!truthy(live(linear))) {
		html = rt.modify(live(html), fmt("organized | ＀<hr>", [(yield* g.srcCall(f, "make_link", "linear", null, 1))]), add);
		error_source = null;
		erroruid = null;
		rt.forList(f, 0, rt.sv(f, "error_sources"));
		while (($e = rt.next(f, 0)) !== undefined) {
			erroruid = $e;
			html = rt.modify(live(html), fmt("＀<br>", [(yield* g.callName(f, (error_source = rt.index(rt.sv(f, "error_sources"), live(erroruid))), "make_link", [null, live(f.src)]))]), add);
		}
		rt.endFor(f, 0);
	} else {
		html = rt.modify(live(html), fmt("＀ | linear<hr>", [(yield* g.srcCall(f, "make_link", "organized", null))]), add);
		error_entry = null;
		rt.forList(f, 0, rt.sv(f, "errors"), T("/datum/error_viewer/error_entry"));
		while (($e = rt.next(f, 0)) !== undefined) {
			error_entry = $e;
			html = rt.modify(live(html), fmt("＀<br>", [(yield* g.callName(f, live(error_entry), "make_link", [null, live(f.src), 1]))]), add);
		}
		rt.endFor(f, 0);
	}
	yield* g.srcCall(f, "browse_to", live(user), live(html));
	return f.dot;
}, true);

// /datum/error_viewer/error_cache/proc/log_error  (code/modules/error_handler/error_viewer.dm:99)
rt.def("/datum/error_viewer/error_cache/proc/log_error", function log_error(f: Frame, e: Value, desclines: Value, skip_count: Value) {
	let erroruid: Value = null, error_source: Value = null, error_entry: Value = null, viewtext: Value = null, err_msg_delay: Value = null;
	f.vars = () => [erroruid, error_source, error_entry, viewtext, err_msg_delay];
	if (!truthy((rt.istype(live(e), T("/exception")) ? 1 : 0))) {
		return live(f.dot);
	}
	erroruid = fmt("＀＀", [rt.fv(f, "file", live(e)), rt.fv(f, "line", live(e))]);
	if (!truthy((error_source = rt.index(rt.sv(f, "error_sources"), live(erroruid))))) {
		error_source = rt.new_(f, T("/datum/error_viewer/error_source"), [live(e)]);
		rt.setAt(rt.sv(f, "error_sources"), live(erroruid), live(error_source));
	}
	rt.setFv(f, "error_source", (error_entry = rt.new_(f, T("/datum/error_viewer/error_entry"), [live(e), live(desclines), live(skip_count)])), live(error_source));
	rt.modSrcVar(f, "errors", live(error_entry), add);
	rt.modField(f, live(error_source), "errors", live(error_entry), add);
	if (truthy(live(skip_count))) {
		return live(f.dot);
	}
	if (!rt.le(rt.fv(f, "next_message_at", live(error_source)), rt.worldTime(f))) return f.dot;
	viewtext = "[view]";
	err_msg_delay = null;
	if (truthy(rt.gl("config"))) {
		err_msg_delay = rt.fv(f, "error_msg_delay", rt.gl("config"));
	} else {
		err_msg_delay = rt.initial(f, rt.gl("config"), "error_msg_delay");
	}
	rt.setFv(f, "next_message_at", live(error_source), add(rt.worldTime(f), live(err_msg_delay)));
	return f.dot;
});

rt.type(2295, "/datum/error_viewer/error_source", "/datum/error_viewer", {
	errors: null,
	next_message_at: 0,
});

// /datum/error_viewer/error_source/proc/<init>  (code/modules/error_handler/error_viewer.dm:128)
rt.def("/datum/error_viewer/error_source/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "errors", rt.list());
	return f.dot;
});

// /datum/error_viewer/error_source/proc/New  (code/modules/error_handler/error_viewer.dm:132)
rt.def("/datum/error_viewer/error_source/proc/New", function New(f: Frame, e: Value) {
	if (!truthy((rt.istype(live(e), T("/exception")) ? 1 : 0))) {
		rt.setSv(f, "name", fmt("[＀] Uncaught exceptions", [rt.call(f, P("/proc/time_stamp"), null, [])]));
		return live(f.dot);
	}
	rt.setSv(f, "name", fmt("<b>[＀]</b> Runtime in <b>＀</b>, line <b>＀</b>: <b>＀</b>", [rt.call(f, P("/proc/time_stamp"), null, []), rt.fv(f, "file", live(e)), rt.fv(f, "line", live(e)), rt.call(f, P("/proc/html_encode"), null, [rt.fv(f, "name", live(e))])]));
	return f.dot;
});

// /datum/error_viewer/error_source/proc/show_to  (code/modules/error_handler/error_viewer.dm:139)  may sleep
rt.def("/datum/error_viewer/error_source/proc/show_to", function* show_to(f: Frame, user: Value, back_to: Value, linear: Value) {
	let html: Value = null, error_entry: Value = null;
	let $e: any;
	f.vars = () => [user, back_to, linear, html, error_entry, $e];
	if (!truthy((rt.istype(live(back_to), T("/datum/error_viewer")) ? 1 : 0))) {
		back_to = rt.gl("error_cache");
	}
	html = (yield* g.srcCall(f, "build_header", live(back_to)));
	error_entry = null;
	rt.forList(f, 0, rt.sv(f, "errors"), T("/datum/error_viewer/error_entry"));
	while (($e = rt.next(f, 0)) !== undefined) {
		error_entry = $e;
		html = rt.modify(live(html), fmt("＀<br>", [(yield* g.callName(f, live(error_entry), "make_link", [null, live(f.src)]))]), add);
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "browse_to", live(user), live(html));
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

// /datum/error_viewer/error_entry/proc/New  (code/modules/error_handler/error_viewer.dm:157)
rt.def("/datum/error_viewer/error_entry/proc/New", function New(f: Frame, e: Value, desclines: Value, skip_count: Value) {
	let line: Value = null;
	let $e: any;
	f.vars = () => [line, $e];
	if (!truthy((rt.istype(live(e), T("/exception")) ? 1 : 0))) {
		rt.setSv(f, "name", fmt("<b>[＀]</b> Uncaught exception: <b>＀</b>", [rt.call(f, P("/proc/time_stamp"), null, []), rt.call(f, P("/proc/html_encode"), null, [rt.fv(f, "name", live(e))])]));
		return live(f.dot);
	}
	if (truthy(live(skip_count))) {
		rt.setSv(f, "name", fmt("[＀] Skipped ＀ runtimes in ＀,＀.", [rt.call(f, P("/proc/time_stamp"), null, []), live(skip_count), rt.fv(f, "file", live(e)), rt.fv(f, "line", live(e))]));
		rt.setSv(f, "is_skip_count", 1);
		return live(f.dot);
	}
	rt.setSv(f, "name", fmt("<b>[＀]</b> Runtime in <b>＀</b>, line <b>＀</b>: <b>＀</b>", [rt.call(f, P("/proc/time_stamp"), null, []), rt.fv(f, "file", live(e)), rt.fv(f, "line", live(e)), rt.call(f, P("/proc/html_encode"), null, [rt.fv(f, "name", live(e))])]));
	rt.setSv(f, "exc", live(e));
	if (truthy((rt.istype(live(desclines), T("/list")) ? 1 : 0))) {
		line = null;
		rt.forList(f, 0, live(desclines));
		while (($e = rt.next(f, 0)) !== undefined) {
			line = $e;
			rt.modSrcVar(f, "desc", fmt("<span class='runtime_line'>＀</span><br>", [rt.call(f, P("/proc/html_encode"), null, [live(line)])]), add);
		}
		rt.endFor(f, 0);
	}
	if (!truthy(live(f.usr))) return f.dot;
	rt.setSv(f, "usr_ref", fmt("＃", [live(f.usr)]));
	rt.setSv(f, "usr_loc", rt.getStep(f, live(f.usr), 0));
	return f.dot;
});

// /datum/error_viewer/error_entry/proc/show_to  (code/modules/error_handler/error_viewer.dm:178)  may sleep
rt.def("/datum/error_viewer/error_entry/proc/show_to", function* show_to(f: Frame, user: Value, back_to: Value, linear: Value) {
	let html: Value = null;
	f.vars = () => [user, back_to, linear, html];
	if (!truthy((rt.istype(live(back_to), T("/datum/error_viewer")) ? 1 : 0))) {
		back_to = rt.sv(f, "error_source");
	}
	html = (yield* g.srcCall(f, "build_header", live(back_to), live(linear)));
	html = rt.modify(live(html), fmt("＀<div class='runtime'>＀</div>", [rt.sv(f, "name"), rt.sv(f, "desc")]), add);
	if (truthy(rt.sv(f, "usr_ref"))) {
		html = rt.modify(live(html), fmt("<br><b>usr</b>: <a href='?_src_=vars;Vars=＀'>VV</a>", [rt.sv(f, "usr_ref")]), add);
		html = rt.modify(live(html), fmt(" <a href='?_src_=holder;adminplayeropts=＀'>PP</a>", [rt.sv(f, "usr_ref")]), add);
		html = rt.modify(live(html), fmt(" <a href='?_src_=holder;adminplayerobservefollow=＀'>Follow</a>", [rt.sv(f, "usr_ref")]), add);
		if (truthy((rt.istype(rt.sv(f, "usr_loc"), T("/turf")) ? 1 : 0))) {
			html = rt.modify(live(html), fmt("<br><b>usr.loc</b>: <a href='?_src_=vars;Vars=＃'>VV</a>", [rt.sv(f, "usr_loc")]), add);
			html = rt.modify(live(html), fmt(" <a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>", [rt.fv(f, "x", rt.sv(f, "usr_loc")), rt.fv(f, "y", rt.sv(f, "usr_loc")), rt.fv(f, "z", rt.sv(f, "usr_loc"))]), add);
		}
	}
	yield* g.srcCall(f, "browse_to", live(user), live(html));
	return f.dot;
}, true);

// /datum/error_viewer/error_entry/proc/make_link  (code/modules/error_handler/error_viewer.dm:194)
rt.def("/datum/error_viewer/error_entry/proc/make_link", function make_link(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(rt.sv(f, "is_skip_count"))) {
		$0 = rt.sv(f, "name");
	} else {
		$0 = rt.callSuper(f, [], rt.Args.Same);
	}
	return $0;
}, false, { args: ["linktext", "back_to", "linear"] });
