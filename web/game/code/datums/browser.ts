// Based on /tg/station's code/datums/browser.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


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

// Empty in tg.
rt.def("/datum/browser/proc/set_title_image", undefined, false, { args: ["ntitle_image"] });

// browser.dm:9
rt.def("/datum/browser/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.stylesheets = rt.op(f, "CreateMultidimensionalList", [1], [0]);

	this.scripts = rt.op(f, "CreateMultidimensionalList", [1], [0]);
	return f.dot;
});

// browser.dm:20
rt.def("/datum/browser/proc/New", function New(f: Frame, nuser: Value, nwindow_id: Value, ntitle: Value, nwidth: Value, nheight: Value, nref: Value) {
	ntitle ??= 0;
	nwidth ??= 0;
	nheight ??= 0;
	this.user = nuser;
	this.window_id = nwindow_id;
	if (ntitle) {
		this.title = format_text(ntitle);
	}
	if (nwidth) {
		this.width = nwidth;
	}
	if (nheight) {
		this.height = nheight;
	}
	if (nref) {
		this.ref = nref;
	}
	this.add_stylesheet("common", rt.rsc("html/browser/common.css"));
	return f.dot;
});

// browser.dm:33
rt.def("/datum/browser/proc/add_head_content", function add_head_content(f: Frame, nhead_content: Value) {
	this.head_content = nhead_content;
	return f.dot;
});

// browser.dm:36
rt.def("/datum/browser/proc/set_window_options", function set_window_options(f: Frame, nwindow_options: Value) {
	this.window_options = nwindow_options;
	return f.dot;
});

// browser.dm:42
rt.def("/datum/browser/proc/add_stylesheet", function add_stylesheet(f: Frame, name: Value, file: Value) {
	rt.setAt(this.stylesheets, `${ckey(name)}.css`, file);
	register_asset(`${ckey(name)}.css`, file);
	return f.dot;
});

// browser.dm:50
rt.def("/datum/browser/proc/set_content", function set_content(f: Frame, ncontent: Value) {
	this.content = ncontent;
	return f.dot;
});

// browser.dm:57
rt.def("/datum/browser/proc/get_header", function get_header(f: Frame) {
	let file: Value = null;
	let $1: any, $e: any;
	for (file of each(this.stylesheets)) {
		this.head_content += `<link rel='stylesheet' type='text/css' href='${file}'>`;
	}
	for (file of each(this.scripts)) {
		this.head_content += `<script type='text/javascript' src='${file}'></script>`;
	}
	let title_attributes: Value = "class='uiTitle'";
	if (this.title_image) {
		title_attributes = `class='uiTitle icon' style='background-image: url(${this.title_image});'`;
	}
	let $0: any = this.head_content;
	if (this.title) {
		$1 = `<div class='uiTitleWrapper'><div ${title_attributes}><tt>${this.title}</tt></div></div>`;
	} else {
		$1 = "";
	}
	return fmt("<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\">\n<html>\n\t<meta http-equiv=\"Content-Type\" content=\"text/html; charset=ISO-8859-1\">\n\t<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n\t<head>\n\t\t＀\n\t</head>\n\t<body scroll=auto>\n\t\t<div class='uiWrapper'>\n\t\t\t＀\n\t\t\t<div class='uiContent'>\n\t", [$0, $1]);
});

// browser.dm:81
rt.def("/datum/browser/proc/get_footer", function get_footer(f: Frame) {
	return "\n\t\t\t</div>\n\t\t</div>\n\t</body>\n</html>";
});

// browser.dm:88
rt.def("/datum/browser/proc/get_content", function get_content(f: Frame) {
	return `\n\t${this.get_header()}\n\t${this.content}\n\t${this.get_footer()}\n\t`;
});

// browser.dm:95
rt.def("/datum/browser/proc/open", function* open(f: Frame, use_onclose: Value) {
	use_onclose ??= 1;
	if (this.window_id === null) {
		warning(`${`Browser ${this.title} tried to open with a null ID`} in ${"code/datums/browser.dm"} at line ${96} src: ${this} usr: ${f.usr}.`);
		to_chat(this.user, `<span class='userdanger'>The ${this.title} browser you tried to open failed a sanity check! Please report this on github!</span>`);
		return f.dot;
	}
	let window_size: Value = "";
	if (this.width && this.height) {
		window_size = `size=${this.width}x${this.height};`;
	}
	if (rt.len(f, this.stylesheets)) {
		yield* send_asset_list(this.user, this.stylesheets, { verify: 0 });
	}
	if (rt.len(f, this.scripts)) {
		yield* send_asset_list(this.user, this.scripts, { verify: 0 });
	}
	rt.op(f, "Browse", [], [this.user, this.get_content(), `window=${this.window_id};${window_size}${this.window_options}`], false);
	if (!use_onclose) return f.dot;
	yield* this.setup_onclose();
	return f.dot;
}, true);

// browser.dm:112
rt.def("/datum/browser/proc/setup_onclose", function* setup_onclose(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 10, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (this.user && (yield* winexists(this.user, this.window_id))) {
			onclose(this.user, this.window_id, this.ref);
			break;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });

// browser.dm:118
rt.def("/datum/browser/proc/close", function close(f: Frame) {
	if (this.window_id !== null) {
		rt.op(f, "Browse", [], [this.user, null, `window=${this.window_id}`], false);
	} else {
		warning(`${`Browser ${this.title} tried to close with a null ID`} in ${"code/datums/browser.dm"} at line ${121} src: ${this} usr: ${f.usr}.`);
	}
	return f.dot;
});

rt.type(389, "/datum/browser/alert", "/datum/browser", {
	selectedbutton: 0,
	opentime: 0,
	timeout: null,
	stealfocus: null,
});

// browser.dm:130
rt.def("/datum/browser/alert/proc/New", function New(f: Frame, User: Value, Message: Value, Title: Value, Button1: Value, Button2: Value, Button3: Value, StealFocus: Value, Timeout: Value) {
	let $1: any;
	Button1 ??= "Ok";
	StealFocus ??= 1;
	Timeout ??= 6000;
	if (!User) {
		return f.dot;
	}
	let $0: any = Message;
	if (Button2) {
		$1 = "left";
	} else {
		$1 = "right";
	}
	let output: Value = fmt("<center><b>＀</b></center><br />\n\t\t<div style=\"text-align:center\">\n\t\t<a style=\"font-size:large;float:＀\" href=\"?src=＃;button=1\">＀</a>", [$0, $1, this, Button1]);
	if (Button2) {
		if (Button3) {
			$0 = "";
		} else {
			$0 = "float:right";
		}
		output += fmt("<a style=\"font-size:large;＀\" href=\"?src=＃;button=2\">＀</a>", [$0, this, Button2]);
	}
	if (Button3) {
		output += fmt("<a style=\"font-size:large;float:right\" href=\"?src=＃;button=3\">＀</a>", [this, Button3]);
	}
	output += "</div>";
	parent_proc(User, ckey(`${User}-${Message}-${Title}-${rt.worldTime(f)}-${rand(1, 10000)}`), Title, 350, 150, this);
	this.set_content(output);
	this.stealfocus = StealFocus;
	if (!StealFocus) {
		this.window_options += "focus=false;";
	}
	this.timeout = Timeout;
	return f.dot;
});

// browser.dm:157
rt.def("/datum/browser/alert/proc/open", function* open(f: Frame) {
	let focusedwindow: Value = null, i: Value = null;
	let $e: any;
	this.opentime = rt.worldTime(f);
	if (this.stealfocus) {
		f.dot = (yield* parent_proc({ use_onclose: 1 }));
	} else {
		focusedwindow = (yield* winget(this.user, null, "focus"));
		f.dot = (yield* parent_proc({ use_onclose: 1 }));
		rt.forRange(f, 0, 1, 10, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			if (this.user && (yield* winexists(this.user, this.window_id))) {
				if (focusedwindow) {
					winset(this.user, focusedwindow, "focus=true");
				} else {
					winset(this.user, "mapwindow", "focus=true");
				}
				break;
			}
		}
		rt.endFor(f, 0);
	}
	if (!this.timeout) return f.dot;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/browser/alert/proc/close"))), this.timeout);
	return f.dot;
}, true, { waitfor: false });

// browser.dm:175
rt.def("/datum/browser/alert/proc/close", function close(f: Frame) {
	f.dot = parent_proc();
	this.opentime = 0;
	return f.dot;
});

// browser.dm:179
rt.def("/datum/browser/alert/proc/wait", function* wait(f: Frame) {
	while (this.opentime && this.selectedbutton <= 0 && (!this.timeout || this.opentime + this.timeout > rt.worldTime(f))) {
		yield* stoplag();
	}
	return f.dot;
}, true);

// browser.dm:183
rt.def("/datum/browser/alert/proc/Topic", function Topic(f: Frame, href: Value, href_list: Value) {
	let button: Value = null;
	if (rt.at(href_list, "close") || !this.user || !this.user.client) {
		this.opentime = 0;
		return f.dot;
	}
	if (rt.at(href_list, "button")) {
		if ((button = text2num(rt.at(href_list, "button"))) <= 3 && button >= 1) {
			this.selectedbutton = button;
		}
	}
	this.opentime = 0;
	this.close();
	return f.dot;
});

// browser.dm:195
rt.def("/proc/tgalert", function* tgalert(f: Frame, User: Value, Message: Value, Title: Value, Button1: Value, Button2: Value, Button3: Value, StealFocus: Value, Timeout: Value) {
	Button1 ??= "Ok";
	StealFocus ??= 1;
	Timeout ??= 6000;
	if (!User) {
		User = f.usr;
	}
	const subject = (yield* askuser(User, Message, Title, Button1, Button2, Button3, StealFocus, Timeout));
	if (subject === 1) {
		return Button1;
	} else if (subject === 2) {
		return Button2;
	} else if (subject === 3) {
		return Button3;
	}
	return f.dot;
}, true);

// browser.dm:207
rt.def("/proc/askuser", function* askuser(f: Frame, User: Value, Message: Value, Title: Value, Button1: Value, Button2: Value, Button3: Value, StealFocus: Value, Timeout: Value) {
	let C: Value = null, A: Value = null;
	Button1 ??= "Ok";
	StealFocus ??= 1;
	Timeout ??= 6000;
	if (!rt.istype(User, T("/mob"))) {
		if (rt.istype(User, T("/client"))) {
			User = (C = User).mob;
		} else {
			return f.dot;
		}
	}
	yield* (A = (yield* new_(T("/datum/browser/alert"), User, Message, Title, Button1, Button2, Button3, StealFocus, Timeout))).open();
	yield* A.wait();
	if (!A.selectedbutton) return f.dot;
	return A.selectedbutton;
}, true);

// browser.dm:252
rt.def("/proc/onclose", function onclose(f: Frame, user: Value, windowid: Value, ref: Value) {
	if (!user.client) {
		return f.dot;
	}
	let param: Value = "null";
	if (ref) {
		param = fmt("＃", [ref]);
	}
	winset(user, windowid, `on-close=".windowclose ${param}"`);
	return f.dot;
});

// browser.dm:272
rt.def("/client/verb/windowclose", function* windowclose(f: Frame, atomref: Value) {
	let hsrc: Value = null, href: Value = null;
	if (atomref != "null") {
		hsrc = rt.locateIn(f, atomref, rt.world());
		href = "close=1";
		if (hsrc) {
			f.usr = this.mob;
			yield* this.Topic(href, params2list(href), hsrc);
			return f.dot;
		}
	}
	if (this && this.mob) {
		yield* this.mob.unset_machine();
	}
	return f.dot;
}, true, { hidden: true, verb: { name: ".windowclose" }, argTypes: [{ type: 2 }] });
