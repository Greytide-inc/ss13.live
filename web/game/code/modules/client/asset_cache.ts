// From code/modules/client/asset_cache.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/send_asset  (code/modules/client/asset_cache.dm:29)  may sleep
rt.def("/proc/send_asset", function* send_asset(f: Frame, client: Value, asset_name: Value, verify: Value) {
	let M: Value = null, job: Value = null, t: Value = null, timeout_time: Value = null;
	f.vars = () => [client, asset_name, verify, M, job, t, timeout_time];
	if (live(verify) === null) {
		verify = 1;
	}
	if (!truthy((rt.istype(live(client), T("/client")) ? 1 : 0))) {
		if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(client)])))) {
			if (truthy(rt.gv(f, "client", (M = live(client))))) {
				client = rt.fv(f, "client", live(M));
			} else {
				return 0;
			}
		} else {
			return 0;
		}
	}
	if ((truthy((yield* g.callName(f, rt.fv(f, "cache", live(client)), "Find", [live(asset_name)]))) || truthy((yield* g.callName(f, rt.fv(f, "sending", live(client)), "Find", [live(asset_name)]))))) {
		return 0;
	}
	rt.op(f, "BrowseResource", [], [live(client), rt.index(rt.fv(f, "cache", rt.gl("SSassets")), live(asset_name)), live(asset_name)], false);
	if ((!truthy(live(verify)) || !truthy((yield* g.call(f, P("/proc/winexists"), null, [live(client), "asset_cache_browser"]))))) {
		if (truthy(live(client))) {
			rt.modField(f, live(client), "cache", live(asset_name), add);
		}
		return 1;
	}
	if (!truthy(live(client))) {
		return 0;
	}
	(rt.modField(f, live(client), "sending", live(asset_name), rt.bitOr));
	job = rt.incField(f, live(client), "last_asset_job", 1, false);
	rt.op(f, "Browse", [], [live(client), fmt("\n\t<script>\n\t\twindow.location.href=\"?asset_cache_confirm_arrival=＀\"\n\t</script>\n\t", [live(job)]), "window=asset_cache_browser"], false);
	t = 0;
	timeout_time = add(multiply(7, rt.getLen(f, rt.fv(f, "sending", live(client)))), 7);
	while ((truthy(live(client)) && !truthy((yield* g.callName(f, rt.fv(f, "completed_asset_jobs", live(client)), "Find", [live(job)])))) && rt.lt(live(t), live(timeout_time))) {
		yield* g.call(f, P("/proc/sleep"), null, [1]);
		t = rt.inc(live(t), 1);
	}
	if (truthy(live(client))) {
		(rt.modField(f, live(client), "sending", live(asset_name), subtract));
		(rt.modField(f, live(client), "cache", live(asset_name), rt.bitOr));
		(rt.modField(f, live(client), "completed_asset_jobs", live(job), subtract));
	}
	return 1;
}, true);

// /proc/send_asset_list  (code/modules/client/asset_cache.dm:76)  may sleep
rt.def("/proc/send_asset_list", function* send_asset_list(f: Frame, client: Value, asset_list: Value, verify: Value) {
	let M: Value = null, unreceived: Value = null, asset: Value = null, job: Value = null, t: Value = null, timeout_time: Value = null;
	let $e: any;
	f.vars = () => [client, asset_list, verify, M, unreceived, asset, job, t, timeout_time, $e];
	if (live(verify) === null) {
		verify = 1;
	}
	if (!truthy((rt.istype(live(client), T("/client")) ? 1 : 0))) {
		if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(client)])))) {
			if (truthy(rt.gv(f, "client", (M = live(client))))) {
				client = rt.fv(f, "client", live(M));
			} else {
				return 0;
			}
		} else {
			return 0;
		}
	}
	if ((!truthy((unreceived = subtract(live(asset_list), add(rt.fv(f, "cache", live(client)), rt.fv(f, "sending", live(client)))))) || !truthy(rt.len(f, live(unreceived))))) {
		return 0;
	}
	if (rt.ge(rt.len(f, live(unreceived)), 8)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(client), "Sending Resources..."]);
	}
	asset = null;
	rt.forList(f, 0, live(unreceived));
	while (($e = rt.next(f, 0)) !== undefined) {
		asset = $e;
		if (truthy((rt.isIn(f, live(asset), rt.fv(f, "cache", rt.gl("SSassets"))) ? 1 : 0))) {
			rt.op(f, "BrowseResource", [], [live(client), rt.index(rt.fv(f, "cache", rt.gl("SSassets")), live(asset)), live(asset)], false);
		}
	}
	rt.endFor(f, 0);
	if ((!truthy(live(verify)) || !truthy((yield* g.call(f, P("/proc/winexists"), null, [live(client), "asset_cache_browser"]))))) {
		if (truthy(live(client))) {
			rt.modField(f, live(client), "cache", live(unreceived), add);
		}
		return 1;
	}
	if (!truthy(live(client))) {
		return 0;
	}
	(rt.modField(f, live(client), "sending", live(unreceived), rt.bitOr));
	job = rt.incField(f, live(client), "last_asset_job", 1, false);
	rt.op(f, "Browse", [], [live(client), fmt("\n\t<script>\n\t\twindow.location.href=\"?asset_cache_confirm_arrival=＀\"\n\t</script>\n\t", [live(job)]), "window=asset_cache_browser"], false);
	t = 0;
	timeout_time = multiply(7, rt.getLen(f, rt.fv(f, "sending", live(client))));
	while ((truthy(live(client)) && !truthy((yield* g.callName(f, rt.fv(f, "completed_asset_jobs", live(client)), "Find", [live(job)])))) && rt.lt(live(t), live(timeout_time))) {
		yield* g.call(f, P("/proc/sleep"), null, [1]);
		t = rt.inc(live(t), 1);
	}
	if (truthy(live(client))) {
		(rt.modField(f, live(client), "sending", live(unreceived), subtract));
		(rt.modField(f, live(client), "cache", live(unreceived), rt.bitOr));
		(rt.modField(f, live(client), "completed_asset_jobs", live(job), subtract));
	}
	return 1;
}, true);

// /proc/getFilesSlow  (code/modules/client/asset_cache.dm:128)  may sleep
rt.def("/proc/getFilesSlow", function* getFilesSlow(f: Frame, client: Value, files: Value, register_asset: Value) {
	let file: Value = null;
	let $e: any;
	f.vars = () => [client, files, register_asset, file, $e];
	if (live(register_asset) === null) {
		register_asset = 1;
	}
	file = null;
	rt.forList(f, 0, live(files));
	while (($e = rt.next(f, 0)) !== undefined) {
		file = $e;
		if (!truthy(live(client))) {
			break;
		}
		if (truthy(live(register_asset))) {
			yield* g.call(f, P("/proc/register_asset"), null, [live(file), rt.index(live(files), live(file))]);
		}
		yield* g.call(f, P("/proc/send_asset"), null, [live(client), live(file)]);
		yield* g.call(f, P("/proc/sleep"), null, [0]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { argTypes: [{ path: "/client" }, { path: "/list" }, {  }] });

// /datum/controller/global_vars/proc/InitGlobalasset_datums  (code/modules/client/asset_cache.dm:144)
rt.def("/datum/controller/global_vars/proc/InitGlobalasset_datums", function InitGlobalasset_datums(f: Frame) {
	rt.setGl("asset_datums", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "asset_datums", add);
	return f.dot;
});

// /proc/get_asset_datum  (code/modules/client/asset_cache.dm:148)  may sleep
rt.def("/proc/get_asset_datum", function* get_asset_datum(f: Frame, type: Value) {
	f.vars = () => [type];
	if (!truthy((rt.isIn(f, live(type), rt.gl("asset_datums")) ? 1 : 0))) {
		return (yield* g.new_(f, live(type), []));
	}
	return rt.index(rt.gl("asset_datums"), live(type));
}, true);

rt.type(2268, "/datum/asset/simple", "/datum/asset", {
	assets: null,
	verify: 0,
});

// /datum/asset/simple/proc/<init>  (code/modules/client/asset_cache.dm:163)
rt.def("/datum/asset/simple/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "assets", rt.list());
	return f.dot;
});

// /datum/asset/simple/proc/register  (code/modules/client/asset_cache.dm:167)
rt.def("/datum/asset/simple/proc/register", function register(f: Frame) {
	let asset_name: Value = null;
	let $e: any;
	f.vars = () => [asset_name, $e];
	asset_name = null;
	rt.forList(f, 0, rt.sv(f, "assets"));
	while (($e = rt.next(f, 0)) !== undefined) {
		asset_name = $e;
		rt.call(f, P("/proc/register_asset"), null, [live(asset_name), rt.index(rt.sv(f, "assets"), live(asset_name))]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/asset/simple/proc/send  (code/modules/client/asset_cache.dm:170)  may sleep
rt.def("/datum/asset/simple/proc/send", function* send(f: Frame, client: Value) {
	f.vars = () => [client];
	yield* g.call(f, P("/proc/send_asset_list"), null, [live(client), rt.sv(f, "assets"), rt.sv(f, "verify")]);
	return f.dot;
}, true);

rt.type(2269, "/datum/asset/simple/tgui", "/datum/asset/simple", {
	assets: null,
});

// /datum/asset/simple/tgui/proc/<init>  (code/modules/client/asset_cache.dm:176)
rt.def("/datum/asset/simple/tgui/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "assets", rt.alist(f, ["tgui.css", rt.rsc("tgui/assets/tgui.css"), "mat-metal.png", rt.rsc("tgui/assets/mat-metal.png"), "mat-glass.png", rt.rsc("tgui/assets/mat-glass.png"), "mat-silver.png", rt.rsc("tgui/assets/mat-silver.png"), "mat-gold.png", rt.rsc("tgui/assets/mat-gold.png"), "mat-diamond.png", rt.rsc("tgui/assets/mat-diamond.png"), "mat-plasma.png", rt.rsc("tgui/assets/mat-plasma.png"), "mat-uranium.png", rt.rsc("tgui/assets/mat-uranium.png"), "mat-bananium.png", rt.rsc("tgui/assets/mat-bananium.png"), "mat-titanium.png", rt.rsc("tgui/assets/mat-titanium.png"), "mat-bluespace.png", rt.rsc("tgui/assets/mat-bluespace.png"), "tgui.js", rt.rsc("tgui/assets/tgui.js"), "font-awesome.min.css", rt.rsc("tgui/assets/font-awesome.min.css"), "fontawesome-webfont.eot", rt.rsc("tgui/assets/fonts/fontawesome-webfont.eot"), "fontawesome-webfont.woff2", rt.rsc("tgui/assets/fonts/fontawesome-webfont.woff2"), "fontawesome-webfont.woff", rt.rsc("tgui/assets/fonts/fontawesome-webfont.woff"), "fontawesome-webfont.ttf", rt.rsc("tgui/assets/fonts/fontawesome-webfont.ttf"), "fontawesome-webfont.svg", rt.rsc("tgui/assets/fonts/fontawesome-webfont.svg")]));
	return f.dot;
});

rt.type(2270, "/datum/asset/simple/headers", "/datum/asset/simple", {
	assets: null,
});

// /datum/asset/simple/headers/proc/<init>  (code/modules/client/asset_cache.dm:188)
rt.def("/datum/asset/simple/headers/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "assets", rt.alist(f, ["alarm_green.gif", rt.rsc("icons/program_icons/alarm_green.gif"), "alarm_red.gif", rt.rsc("icons/program_icons/alarm_red.gif"), "batt_5.gif", rt.rsc("icons/program_icons/batt_5.gif"), "batt_20.gif", rt.rsc("icons/program_icons/batt_20.gif"), "batt_40.gif", rt.rsc("icons/program_icons/batt_40.gif"), "batt_60.gif", rt.rsc("icons/program_icons/batt_60.gif"), "batt_80.gif", rt.rsc("icons/program_icons/batt_80.gif"), "batt_100.gif", rt.rsc("icons/program_icons/batt_100.gif"), "charging.gif", rt.rsc("icons/program_icons/charging.gif"), "downloader_finished.gif", rt.rsc("icons/program_icons/downloader_finished.gif"), "downloader_running.gif", rt.rsc("icons/program_icons/downloader_running.gif"), "ntnrc_idle.gif", rt.rsc("icons/program_icons/ntnrc_idle.gif"), "ntnrc_new.gif", rt.rsc("icons/program_icons/ntnrc_new.gif"), "power_norm.gif", rt.rsc("icons/program_icons/power_norm.gif"), "power_warn.gif", rt.rsc("icons/program_icons/power_warn.gif"), "sig_high.gif", rt.rsc("icons/program_icons/sig_high.gif"), "sig_low.gif", rt.rsc("icons/program_icons/sig_low.gif"), "sig_lan.gif", rt.rsc("icons/program_icons/sig_lan.gif"), "sig_none.gif", rt.rsc("icons/program_icons/sig_none.gif"), "smmon_0.gif", rt.rsc("icons/program_icons/smmon_0.gif"), "smmon_1.gif", rt.rsc("icons/program_icons/smmon_1.gif"), "smmon_2.gif", rt.rsc("icons/program_icons/smmon_2.gif"), "smmon_3.gif", rt.rsc("icons/program_icons/smmon_3.gif"), "smmon_4.gif", rt.rsc("icons/program_icons/smmon_4.gif"), "smmon_5.gif", rt.rsc("icons/program_icons/smmon_5.gif"), "smmon_6.gif", rt.rsc("icons/program_icons/smmon_6.gif")]));
	return f.dot;
});

rt.type(2271, "/datum/asset/simple/pda", "/datum/asset/simple", {
	assets: null,
});

// /datum/asset/simple/pda/proc/<init>  (code/modules/client/asset_cache.dm:218)
rt.def("/datum/asset/simple/pda/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "assets", rt.alist(f, ["pda_atmos.png", rt.rsc("icons/pda_icons/pda_atmos.png"), "pda_back.png", rt.rsc("icons/pda_icons/pda_back.png"), "pda_bell.png", rt.rsc("icons/pda_icons/pda_bell.png"), "pda_blank.png", rt.rsc("icons/pda_icons/pda_blank.png"), "pda_boom.png", rt.rsc("icons/pda_icons/pda_boom.png"), "pda_bucket.png", rt.rsc("icons/pda_icons/pda_bucket.png"), "pda_medbot.png", rt.rsc("icons/pda_icons/pda_medbot.png"), "pda_floorbot.png", rt.rsc("icons/pda_icons/pda_floorbot.png"), "pda_cleanbot.png", rt.rsc("icons/pda_icons/pda_cleanbot.png"), "pda_crate.png", rt.rsc("icons/pda_icons/pda_crate.png"), "pda_cuffs.png", rt.rsc("icons/pda_icons/pda_cuffs.png"), "pda_eject.png", rt.rsc("icons/pda_icons/pda_eject.png"), "pda_flashlight.png", rt.rsc("icons/pda_icons/pda_flashlight.png"), "pda_honk.png", rt.rsc("icons/pda_icons/pda_honk.png"), "pda_mail.png", rt.rsc("icons/pda_icons/pda_mail.png"), "pda_medical.png", rt.rsc("icons/pda_icons/pda_medical.png"), "pda_menu.png", rt.rsc("icons/pda_icons/pda_menu.png"), "pda_mule.png", rt.rsc("icons/pda_icons/pda_mule.png"), "pda_notes.png", rt.rsc("icons/pda_icons/pda_notes.png"), "pda_power.png", rt.rsc("icons/pda_icons/pda_power.png"), "pda_rdoor.png", rt.rsc("icons/pda_icons/pda_rdoor.png"), "pda_reagent.png", rt.rsc("icons/pda_icons/pda_reagent.png"), "pda_refresh.png", rt.rsc("icons/pda_icons/pda_refresh.png"), "pda_scanner.png", rt.rsc("icons/pda_icons/pda_scanner.png"), "pda_signaler.png", rt.rsc("icons/pda_icons/pda_signaler.png"), "pda_status.png", rt.rsc("icons/pda_icons/pda_status.png"), "pda_dronephone.png", rt.rsc("icons/pda_icons/pda_dronephone.png")]));
	return f.dot;
});

rt.type(2272, "/datum/asset/simple/paper", "/datum/asset/simple", {
	assets: null,
});

// /datum/asset/simple/paper/proc/<init>  (code/modules/client/asset_cache.dm:249)
rt.def("/datum/asset/simple/paper/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "assets", rt.alist(f, ["large_stamp-clown.png", rt.rsc("icons/stamp_icons/large_stamp-clown.png"), "large_stamp-deny.png", rt.rsc("icons/stamp_icons/large_stamp-deny.png"), "large_stamp-ok.png", rt.rsc("icons/stamp_icons/large_stamp-ok.png"), "large_stamp-hop.png", rt.rsc("icons/stamp_icons/large_stamp-hop.png"), "large_stamp-cmo.png", rt.rsc("icons/stamp_icons/large_stamp-cmo.png"), "large_stamp-ce.png", rt.rsc("icons/stamp_icons/large_stamp-ce.png"), "large_stamp-hos.png", rt.rsc("icons/stamp_icons/large_stamp-hos.png"), "large_stamp-rd.png", rt.rsc("icons/stamp_icons/large_stamp-rd.png"), "large_stamp-cap.png", rt.rsc("icons/stamp_icons/large_stamp-cap.png"), "large_stamp-qm.png", rt.rsc("icons/stamp_icons/large_stamp-qm.png"), "large_stamp-law.png", rt.rsc("icons/stamp_icons/large_stamp-law.png")]));
	return f.dot;
});

rt.type(2273, "/datum/asset/simple/IRV", "/datum/asset/simple", {
	assets: null,
});

// /datum/asset/simple/IRV/proc/<init>  (code/modules/client/asset_cache.dm:264)
rt.def("/datum/asset/simple/IRV/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "assets", rt.alist(f, ["jquery-ui.custom-core-widgit-mouse-sortable-min.js", rt.rsc("html/IRV/jquery-ui.custom-core-widgit-mouse-sortable-min.js"), "jquery-1.10.2.min.js", rt.rsc("html/IRV/jquery-1.10.2.min.js")]));
	return f.dot;
});

rt.type(2274, "/datum/asset/simple/changelog", "/datum/asset/simple", {
	assets: null,
});

// /datum/asset/simple/changelog/proc/<init>  (code/modules/client/asset_cache.dm:270)
rt.def("/datum/asset/simple/changelog/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "assets", rt.alist(f, ["88x31.png", rt.rsc("html/88x31.png"), "bug-minus.png", rt.rsc("html/bug-minus.png"), "cross-circle.png", rt.rsc("html/cross-circle.png"), "hard-hat-exclamation.png", rt.rsc("html/hard-hat-exclamation.png"), "image-minus.png", rt.rsc("html/image-minus.png"), "image-plus.png", rt.rsc("html/image-plus.png"), "music-minus.png", rt.rsc("html/music-minus.png"), "music-plus.png", rt.rsc("html/music-plus.png"), "tick-circle.png", rt.rsc("html/tick-circle.png"), "wrench-screwdriver.png", rt.rsc("html/wrench-screwdriver.png"), "spell-check.png", rt.rsc("html/spell-check.png"), "burn-exclamation.png", rt.rsc("html/burn-exclamation.png"), "chevron.png", rt.rsc("html/chevron.png"), "chevron-expand.png", rt.rsc("html/chevron-expand.png"), "scales.png", rt.rsc("html/scales.png"), "changelog.css", rt.rsc("html/changelog.css")]));
	return f.dot;
});

rt.type(2275, "/datum/asset/simple/goonchat", "/datum/asset/simple", {
	verify: 0,
	assets: null,
});

// /datum/asset/simple/goonchat/proc/<init>  (code/modules/client/asset_cache.dm:291)
rt.def("/datum/asset/simple/goonchat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	// tg_js: goonchat's own js and css are gone (the page's output pane stands in for the goonchat window); the shared files stay.
	rt.setSv(f, "assets", rt.alist(f, ["jquery.min.js", rt.rsc("code/modules/html_interface/js/jquery.min.js"), "fontawesome-webfont.eot", rt.rsc("tgui/assets/fonts/fontawesome-webfont.eot"), "fontawesome-webfont.svg", rt.rsc("tgui/assets/fonts/fontawesome-webfont.svg"), "fontawesome-webfont.ttf", rt.rsc("tgui/assets/fonts/fontawesome-webfont.ttf"), "fontawesome-webfont.woff", rt.rsc("tgui/assets/fonts/fontawesome-webfont.woff")]));
	return f.dot;
});

rt.type(2276, "/datum/asset/HTML_interface", "/datum/asset", {});

// /datum/asset/HTML_interface/proc/register  (code/modules/client/asset_cache.dm:306)  may sleep
rt.def("/datum/asset/HTML_interface/proc/register", function* register(f: Frame) {
	let path: Value = null, hi: Value = null;
	let $e: any;
	f.vars = () => [path, hi, $e];
	path = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/typesof"), null, [T("/datum/html_interface")])));
	while (($e = rt.next(f, 0)) !== undefined) {
		path = $e;
		yield* g.callName(f, (hi = (yield* g.new_(f, live(path), []))), "registerResources", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
