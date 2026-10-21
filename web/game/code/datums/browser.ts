// From code/datums/browser.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(388, "/datum/browser", "/datum", {
	user: null,
	title: null,
	window_id: null,
	width: 0,
	height: 0,
	ref: null,
	window_options: "can_close=1;can_minimize=1;can_maximize=0;can_resize=1;titlebar=1;",
	stylesheets: null,
	scripts: null,
	title_image: null,
	head_elements: null,
	body_elements: null,
	head_content: "",
	content: "",
});

// /datum/browser/proc/set_title_image  empty
rt.def("/datum/browser/proc/set_title_image", undefined, false, { args: ["ntitle_image"] });

// /datum/browser/proc/<init>  (code/datums/browser.dm:9)
rt.def("/datum/browser/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "stylesheets", rt.op(f, "CreateMultidimensionalList", [1], [0]));
	$0 = $0;
	rt.setSv(f, "scripts", rt.op(f, "CreateMultidimensionalList", [1], [0]));
	return f.dot;
});

// /datum/browser/proc/New  (code/datums/browser.dm:20)
rt.def("/datum/browser/proc/New", function New(f: Frame, nuser: Value, nwindow_id: Value, ntitle: Value, nwidth: Value, nheight: Value, nref: Value) {
	f.vars = () => [ntitle, nwidth, nheight, nref];
	if (live(ntitle) === null) {
		ntitle = 0;
	}
	if (live(nwidth) === null) {
		nwidth = 0;
	}
	if (live(nheight) === null) {
		nheight = 0;
	}
	if (live(nref) === null) {
		nref = null;
	}
	rt.setSv(f, "user", live(nuser));
	rt.setSv(f, "window_id", live(nwindow_id));
	if (truthy(live(ntitle))) {
		rt.setSv(f, "title", rt.call(f, P("/proc/format_text"), null, [live(ntitle)]));
	}
	if (truthy(live(nwidth))) {
		rt.setSv(f, "width", live(nwidth));
	}
	if (truthy(live(nheight))) {
		rt.setSv(f, "height", live(nheight));
	}
	if (truthy(live(nref))) {
		rt.setSv(f, "ref", live(nref));
	}
	rt.callSrc(f, "add_stylesheet", ["common", rt.rsc("html/browser/common.css")]);
	return f.dot;
});

// /datum/browser/proc/add_head_content  (code/datums/browser.dm:33)
rt.def("/datum/browser/proc/add_head_content", function add_head_content(f: Frame, nhead_content: Value) {
	rt.setSv(f, "head_content", live(nhead_content));
	return f.dot;
});

// /datum/browser/proc/set_window_options  (code/datums/browser.dm:36)
rt.def("/datum/browser/proc/set_window_options", function set_window_options(f: Frame, nwindow_options: Value) {
	rt.setSv(f, "window_options", live(nwindow_options));
	return f.dot;
});

// /datum/browser/proc/add_stylesheet  (code/datums/browser.dm:42)
rt.def("/datum/browser/proc/add_stylesheet", function add_stylesheet(f: Frame, name: Value, file: Value) {
	rt.setAt(rt.sv(f, "stylesheets"), fmt("＀.css", [rt.call(f, P("/proc/ckey"), null, [live(name)])]), live(file));
	rt.call(f, P("/proc/register_asset"), null, [fmt("＀.css", [rt.call(f, P("/proc/ckey"), null, [live(name)])]), live(file)]);
	return f.dot;
});

// /datum/browser/proc/add_script  (code/datums/browser.dm:46)
rt.def("/datum/browser/proc/add_script", function add_script(f: Frame, name: Value, file: Value) {
	rt.setAt(rt.sv(f, "scripts"), fmt("＀.js", [rt.call(f, P("/proc/ckey"), null, [live(name)])]), live(file));
	rt.call(f, P("/proc/register_asset"), null, [fmt("＀.js", [rt.call(f, P("/proc/ckey"), null, [live(name)])]), live(file)]);
	return f.dot;
});

// /datum/browser/proc/set_content  (code/datums/browser.dm:50)
rt.def("/datum/browser/proc/set_content", function set_content(f: Frame, ncontent: Value) {
	rt.setSv(f, "content", live(ncontent));
	return f.dot;
});

// /datum/browser/proc/add_content  (code/datums/browser.dm:53)
rt.def("/datum/browser/proc/add_content", function add_content(f: Frame, ncontent: Value) {
	rt.modSrcVar(f, "content", live(ncontent), add);
	return f.dot;
});

// /datum/browser/proc/get_header  (code/datums/browser.dm:57)
rt.def("/datum/browser/proc/get_header", function get_header(f: Frame) {
	let file: Value = null, title_attributes: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [file, title_attributes, $0, $1, $e];
	file = null;
	rt.forList(f, 0, rt.sv(f, "stylesheets"));
	while (($e = rt.next(f, 0)) !== undefined) {
		file = $e;
		rt.modSrcVar(f, "head_content", fmt("<link rel='stylesheet' type='text/css' href='＀'>", [live(file)]), add);
	}
	rt.endFor(f, 0);
	rt.forList(f, 0, rt.sv(f, "scripts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		file = $e;
		rt.modSrcVar(f, "head_content", fmt("<script type='text/javascript' src='＀'></script>", [live(file)]), add);
	}
	rt.endFor(f, 0);
	title_attributes = "class='uiTitle'";
	if (truthy(rt.sv(f, "title_image"))) {
		title_attributes = fmt("class='uiTitle icon' style='background-image: url(＀);'", [rt.sv(f, "title_image")]);
	}
	$0 = rt.sv(f, "head_content");
	if (truthy(rt.sv(f, "title"))) {
		$1 = fmt("<div class='uiTitleWrapper'><div ＀><tt>＀</tt></div></div>", [live(title_attributes), rt.sv(f, "title")]);
	} else {
		$1 = "";
	}
	return fmt("<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\">\n<html>\n\t<meta http-equiv=\"Content-Type\" content=\"text/html; charset=ISO-8859-1\">\n\t<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n\t<head>\n\t\t＀\n\t</head>\n\t<body scroll=auto>\n\t\t<div class='uiWrapper'>\n\t\t\t＀\n\t\t\t<div class='uiContent'>\n\t", [$0, $1]);
	return f.dot;
});

// /datum/browser/proc/get_footer  (code/datums/browser.dm:81)
rt.def("/datum/browser/proc/get_footer", function get_footer(f: Frame) {
	return "\n\t\t\t</div>\n\t\t</div>\n\t</body>\n</html>";
});

// /datum/browser/proc/get_content  (code/datums/browser.dm:88)
rt.def("/datum/browser/proc/get_content", function get_content(f: Frame) {
	return fmt("\n\t＀\n\t＀\n\t＀\n\t", [rt.callSrc(f, "get_header", []), rt.sv(f, "content"), rt.callSrc(f, "get_footer", [])]);
});

// /datum/browser/proc/open  (code/datums/browser.dm:95)  may sleep
rt.def("/datum/browser/proc/open", function* open(f: Frame, use_onclose: Value) {
	let window_size: Value = null;
	f.vars = () => [use_onclose, window_size];
	if (live(use_onclose) === null) {
		use_onclose = 1;
	}
	if (rt.sv(f, "window_id") === null) {
		yield* g.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", [fmt("Browser ＀ tried to open with a null ID", [rt.sv(f, "title")]), "code/datums/browser.dm", 96, live(f.src), live(f.usr)])]);
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "user"), fmt("<span class='userdanger'>The ＀ browser you tried to open failed a sanity check! Please report this on github!</span>", [rt.sv(f, "title")])]);
		return live(f.dot);
	}
	window_size = "";
	if ((truthy(rt.sv(f, "width")) && truthy(rt.sv(f, "height")))) {
		window_size = fmt("size=＀x＀;", [rt.sv(f, "width"), rt.sv(f, "height")]);
	}
	if (truthy(rt.len(f, rt.sv(f, "stylesheets")))) {
		yield* g.call(f, P("/proc/send_asset_list"), null, [null, rt.sv(f, "user"), null, rt.sv(f, "stylesheets"), "verify", 0], rt.Args.Named);
	}
	if (truthy(rt.len(f, rt.sv(f, "scripts")))) {
		yield* g.call(f, P("/proc/send_asset_list"), null, [null, rt.sv(f, "user"), null, rt.sv(f, "scripts"), "verify", 0], rt.Args.Named);
	}
	rt.op(f, "Browse", [], [rt.sv(f, "user"), (yield* g.srcCall(f, "get_content")), fmt("window=＀;＀＀", [rt.sv(f, "window_id"), live(window_size), rt.sv(f, "window_options")])], false);
	if (!truthy(live(use_onclose))) return f.dot;
	yield* g.srcCall(f, "setup_onclose");
	return f.dot;
}, true);

// /datum/browser/proc/setup_onclose  (code/datums/browser.dm:112)  may sleep
rt.def("/datum/browser/proc/setup_onclose", function* setup_onclose(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 10, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if ((truthy(rt.sv(f, "user")) && truthy((yield* g.call(f, P("/proc/winexists"), null, [rt.sv(f, "user"), rt.sv(f, "window_id")]))))) {
			yield* g.call(f, P("/proc/onclose"), null, [rt.sv(f, "user"), rt.sv(f, "window_id"), rt.sv(f, "ref")]);
			break;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });

// /datum/browser/proc/close  (code/datums/browser.dm:118)
rt.def("/datum/browser/proc/close", function close(f: Frame) {
	if (rt.sv(f, "window_id") !== null) {
		rt.op(f, "Browse", [], [rt.sv(f, "user"), null, fmt("window=＀", [rt.sv(f, "window_id")])], false);
	} else {
		rt.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", [fmt("Browser ＀ tried to close with a null ID", [rt.sv(f, "title")]), "code/datums/browser.dm", 121, live(f.src), live(f.usr)])]);
	}
	return f.dot;
});

rt.type(389, "/datum/browser/alert", "/datum/browser", {
	selectedbutton: 0,
	opentime: 0,
	timeout: null,
	stealfocus: null,
});

// /datum/browser/alert/proc/New  (code/datums/browser.dm:130)
rt.def("/datum/browser/alert/proc/New", function New(f: Frame, User: Value, Message: Value, Title: Value, Button1: Value, Button2: Value, Button3: Value, StealFocus: Value, Timeout: Value) {
	let output: Value = null;
	let $0: any, $1: any;
	f.vars = () => [Button1, StealFocus, Timeout, output, $0, $1];
	if (live(Button1) === null) {
		Button1 = "Ok";
	}
	if (live(StealFocus) === null) {
		StealFocus = 1;
	}
	if (live(Timeout) === null) {
		Timeout = 6000;
	}
	if (!truthy(live(User))) {
		return live(f.dot);
	}
	$0 = live(Message);
	if (truthy(live(Button2))) {
		$1 = "left";
	} else {
		$1 = "right";
	}
	output = fmt("<center><b>＀</b></center><br />\n\t\t<div style=\"text-align:center\">\n\t\t<a style=\"font-size:large;float:＀\" href=\"?src=＃;button=1\">＀</a>", [$0, $1, live(f.src), live(Button1)]);
	if (truthy(live(Button2))) {
		if (truthy(live(Button3))) {
			$0 = "";
		} else {
			$0 = "float:right";
		}
		output = rt.modify(live(output), fmt("<a style=\"font-size:large;＀\" href=\"?src=＃;button=2\">＀</a>", [$0, live(f.src), live(Button2)]), add);
	}
	if (truthy(live(Button3))) {
		output = rt.modify(live(output), fmt("<a style=\"font-size:large;float:right\" href=\"?src=＃;button=3\">＀</a>", [live(f.src), live(Button3)]), add);
	}
	output = rt.modify(live(output), "</div>", add);
	rt.callSuper(f, [live(User), rt.call(f, P("/proc/ckey"), null, [fmt("＀-＀-＀-＀-＀", [live(User), live(Message), live(Title), rt.worldTime(f), rt.call(f, P("/proc/rand"), null, [1, 10000])])]), live(Title), 350, 150, live(f.src)]);
	rt.callSrc(f, "set_content", [live(output)]);
	rt.setSv(f, "stealfocus", live(StealFocus));
	if (!truthy(live(StealFocus))) {
		rt.modSrcVar(f, "window_options", "focus=false;", add);
	}
	rt.setSv(f, "timeout", live(Timeout));
	return f.dot;
});

// /datum/browser/alert/proc/open  (code/datums/browser.dm:157)  may sleep
rt.def("/datum/browser/alert/proc/open", function* open(f: Frame) {
	let focusedwindow: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [focusedwindow, i, $e];
	rt.setSv(f, "opentime", rt.worldTime(f));
	if (truthy(rt.sv(f, "stealfocus"))) {
		f.dot = (yield* g.callSuper(f, ["use_onclose", 1], rt.Args.Named));
	} else {
		focusedwindow = (yield* g.call(f, P("/proc/winget"), null, [rt.sv(f, "user"), null, "focus"]));
		f.dot = (yield* g.callSuper(f, ["use_onclose", 1], rt.Args.Named));
		i = null;
		rt.forRange(f, 0, 1, 10, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			if ((truthy(rt.sv(f, "user")) && truthy((yield* g.call(f, P("/proc/winexists"), null, [rt.sv(f, "user"), rt.sv(f, "window_id")]))))) {
				if (truthy(live(focusedwindow))) {
					yield* g.call(f, P("/proc/winset"), null, [rt.sv(f, "user"), live(focusedwindow), "focus=true"]);
				} else {
					yield* g.call(f, P("/proc/winset"), null, [rt.sv(f, "user"), "mapwindow", "focus=true"]);
				}
				break;
			}
		}
		rt.endFor(f, 0);
	}
	if (!truthy(rt.sv(f, "timeout"))) return f.dot;
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/browser/alert/proc/close")])), rt.sv(f, "timeout")]);
	return f.dot;
}, true, { waitfor: false });

// /datum/browser/alert/proc/close  (code/datums/browser.dm:175)
rt.def("/datum/browser/alert/proc/close", function close(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "opentime", 0);
	return f.dot;
});

// /datum/browser/alert/proc/wait  (code/datums/browser.dm:179)  may sleep
rt.def("/datum/browser/alert/proc/wait", function* wait(f: Frame) {
	while ((truthy(rt.sv(f, "opentime")) && rt.le(rt.sv(f, "selectedbutton"), 0)) && (!truthy(rt.sv(f, "timeout")) || rt.gt(add(rt.sv(f, "opentime"), rt.sv(f, "timeout")), rt.worldTime(f)))) {
		yield* g.call(f, P("/proc/stoplag"), null, []);
	}
	return f.dot;
}, true);

// /datum/browser/alert/proc/Topic  (code/datums/browser.dm:183)
rt.def("/datum/browser/alert/proc/Topic", function Topic(f: Frame, href: Value, href_list: Value) {
	let button: Value = null;
	f.vars = () => [button];
	if (((truthy(rt.at(live(href_list), "close")) || !truthy(rt.sv(f, "user"))) || !truthy(rt.fv(f, "client", rt.sv(f, "user"))))) {
		rt.setSv(f, "opentime", 0);
		return live(f.dot);
	}
	if (truthy(rt.at(live(href_list), "button"))) {
		if ((rt.le((button = rt.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "button")])), 3) && rt.ge(live(button), 1))) {
			rt.setSv(f, "selectedbutton", live(button));
		}
	}
	rt.setSv(f, "opentime", 0);
	rt.callSrc(f, "close", []);
	return f.dot;
});

// /proc/tgalert  (code/datums/browser.dm:195)  may sleep
rt.def("/proc/tgalert", function* tgalert(f: Frame, User: Value, Message: Value, Title: Value, Button1: Value, Button2: Value, Button3: Value, StealFocus: Value, Timeout: Value) {
	let $0: any;
	f.vars = () => [User, Message, Title, Button1, Button2, Button3, StealFocus, Timeout, $0];
	if (live(Button1) === null) {
		Button1 = "Ok";
	}
	if (live(StealFocus) === null) {
		StealFocus = 1;
	}
	if (live(Timeout) === null) {
		Timeout = 6000;
	}
	if (!truthy(live(User))) {
		User = live(f.usr);
	}
	$0 = (yield* g.call(f, P("/proc/askuser"), null, [live(User), live(Message), live(Title), live(Button1), live(Button2), live(Button3), live(StealFocus), live(Timeout)]));
	if ($0 === 1) {
		return live(Button1);
	} else if ($0 === 2) {
		return live(Button2);
	} else if ($0 === 3) {
		return live(Button3);
	}
	return f.dot;
}, true);

// /proc/askuser  (code/datums/browser.dm:207)  may sleep
rt.def("/proc/askuser", function* askuser(f: Frame, User: Value, Message: Value, Title: Value, Button1: Value, Button2: Value, Button3: Value, StealFocus: Value, Timeout: Value) {
	let C: Value = null, A: Value = null;
	f.vars = () => [User, Message, Title, Button1, Button2, Button3, StealFocus, Timeout, C, A];
	if (live(Button1) === null) {
		Button1 = "Ok";
	}
	if (live(StealFocus) === null) {
		StealFocus = 1;
	}
	if (live(Timeout) === null) {
		Timeout = 6000;
	}
	if (!truthy((rt.istype(live(User), T("/mob")) ? 1 : 0))) {
		if (truthy((rt.istype(live(User), T("/client")) ? 1 : 0))) {
			User = rt.gv(f, "mob", (C = live(User)));
		} else {
			return live(f.dot);
		}
	}
	yield* g.callName(f, (A = (yield* g.new_(f, T("/datum/browser/alert"), [live(User), live(Message), live(Title), live(Button1), live(Button2), live(Button3), live(StealFocus), live(Timeout)]))), "open", []);
	yield* g.callName(f, live(A), "wait", []);
	if (!truthy(rt.fv(f, "selectedbutton", live(A)))) return f.dot;
	return rt.fv(f, "selectedbutton", live(A));
}, true);

// /proc/onclose  (code/datums/browser.dm:252)
rt.def("/proc/onclose", function onclose(f: Frame, user: Value, windowid: Value, ref: Value) {
	let param: Value = null;
	f.vars = () => [ref, param];
	if (live(ref) === null) {
		ref = null;
	}
	if (!truthy(rt.fv(f, "client", live(user)))) {
		return live(f.dot);
	}
	param = "null";
	if (truthy(live(ref))) {
		param = fmt("＃", [live(ref)]);
	}
	rt.call(f, P("/proc/winset"), null, [live(user), live(windowid), fmt("on-close=\".windowclose ＀\"", [live(param)])]);
	return f.dot;
});

// /client/verb/windowclose  (code/datums/browser.dm:272)  may sleep
rt.def("/client/verb/windowclose", function* windowclose(f: Frame, atomref: Value) {
	let hsrc: Value = null, href: Value = null;
	f.vars = () => [atomref, hsrc, href];
	if (!isEqual(live(atomref), "null")) {
		hsrc = rt.locateIn(f, live(atomref), rt.world());
		href = "close=1";
		if (truthy(live(hsrc))) {
			f.usr = rt.fv(f, "mob", live(f.src));
			yield* g.callName(f, live(f.src), "Topic", [live(href), (yield* g.call(f, P("/proc/params2list"), null, [live(href)])), live(hsrc)]);
			return live(f.dot);
		}
	}
	if ((truthy(live(f.src)) && truthy(rt.fv(f, "mob", live(f.src))))) {
		yield* g.callName(f, rt.fv(f, "mob", live(f.src)), "unset_machine", []);
	}
	return live(f.dot);
}, true, { hidden: true, verb: { name: ".windowclose" }, argTypes: [{ type: 2 }] });
