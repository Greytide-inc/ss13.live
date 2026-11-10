// Based on /tg/station's code/modules/client/asset_cache.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;


// asset_cache.dm:29
rt.def("/proc/send_asset", function* send_asset(f: Frame, client: Value, asset_name: Value, verify: Value) {
	let M: Value = null;
	verify ??= 1;
	if (!rt.istype(client, T("/client"))) {
		if (ismob(client)) {
			if ((M = client).client) {
				client = M.client;
			} else {
				return 0;
			}
		} else {
			return 0;
		}
	}
	if (client.cache.Find(asset_name) || client.sending.Find(asset_name)) {
		return 0;
	}
	rt.op(f, "BrowseResource", [], [client, rt.index(GLOB.SSassets.cache, asset_name), asset_name], false);
	if (!verify || !(yield* winexists(client, "asset_cache_browser"))) {
		if (client) {
			client.cache += asset_name;
		}
		return 1;
	}
	if (!client) {
		return 0;
	}
	(rt.modField(f, client, "sending", asset_name, rt.bitOr));
	let job: Value = ++client.last_asset_job;
	rt.op(f, "Browse", [], [client, `\n\t<script>\n\t\twindow.location.href="?asset_cache_confirm_arrival=${job}"\n\t</script>\n\t`, "window=asset_cache_browser"], false);
	let t: Value = 0;
	let timeout_time: Value = 7 * rt.len(f, client.sending) + 7;
	while (client && !client.completed_asset_jobs.Find(job) && t < timeout_time) {
		yield* sleep(1);
		t++;
	}
	if (client) {
		client.sending -= asset_name;
		(rt.modField(f, client, "cache", asset_name, rt.bitOr));
		client.completed_asset_jobs -= job;
	}
	return 1;
}, true);

// asset_cache.dm:76
rt.def("/proc/send_asset_list", function* send_asset_list(f: Frame, client: Value, asset_list: Value, verify: Value) {
	let M: Value = null, unreceived: Value = null, asset: Value = null;
	verify ??= 1;
	if (!rt.istype(client, T("/client"))) {
		if (ismob(client)) {
			if ((M = client).client) {
				client = M.client;
			} else {
				return 0;
			}
		} else {
			return 0;
		}
	}
	if (!(unreceived = asset_list - (client.cache + client.sending)) || !rt.len(f, unreceived)) {
		return 0;
	}
	if (rt.len(f, unreceived) >= 8) {
		to_chat(client, "Sending Resources...");
	}
	for (asset of each(unreceived)) {
		if (rt.isIn(f, asset, GLOB.SSassets.cache)) {
			rt.op(f, "BrowseResource", [], [client, rt.index(GLOB.SSassets.cache, asset), asset], false);
		}
	}
	if (!verify || !(yield* winexists(client, "asset_cache_browser"))) {
		if (client) {
			client.cache += unreceived;
		}
		return 1;
	}
	if (!client) {
		return 0;
	}
	(rt.modField(f, client, "sending", unreceived, rt.bitOr));
	let job: Value = ++client.last_asset_job;
	rt.op(f, "Browse", [], [client, `\n\t<script>\n\t\twindow.location.href="?asset_cache_confirm_arrival=${job}"\n\t</script>\n\t`, "window=asset_cache_browser"], false);
	let t: Value = 0;
	let timeout_time: Value = 7 * rt.len(f, client.sending);
	while (client && !client.completed_asset_jobs.Find(job) && t < timeout_time) {
		yield* sleep(1);
		t++;
	}
	if (client) {
		client.sending -= unreceived;
		(rt.modField(f, client, "cache", unreceived, rt.bitOr));
		client.completed_asset_jobs -= job;
	}
	return 1;
}, true);

// asset_cache.dm:128
rt.def("/proc/getFilesSlow", function* getFilesSlow(f: Frame, client: Value, files: Value, register_asset: Value) {
	let file: Value = null;
	register_asset ??= 1;
	for (file of each(files)) {
		if (!client) {
			break;
		}
		if (register_asset) {
			yield* g.call(f, P("/proc/register_asset"), null, [file, rt.index(files, file)]);
		}
		yield* send_asset(client, file);
		yield* sleep(0);
	}
	return f.dot;
}, true, { argTypes: [{ path: "/client" }, { path: "/list" }, {  }] });

// asset_cache.dm:144
rt.def("/datum/controller/global_vars/proc/InitGlobalasset_datums", function InitGlobalasset_datums(f: Frame) {
	GLOB.asset_datums = list();
	this.gvars_datum_init_order += "asset_datums";
	return f.dot;
});

// asset_cache.dm:148
rt.def("/proc/get_asset_datum", function* get_asset_datum(f: Frame, type: Value) {
	if (!rt.isIn(f, type, GLOB.asset_datums)) {
		return (yield* new_(type));
	}
	return rt.index(GLOB.asset_datums, type);
}, true);

rt.type(2268, "/datum/asset/simple", "/datum/asset", {
	assets: null,
	verify: 0,
});

// asset_cache.dm:163
rt.def("/datum/asset/simple/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.assets = list();
	return f.dot;
});

// asset_cache.dm:167
rt.def("/datum/asset/simple/proc/register", function register(f: Frame) {
	let asset_name: Value = null;
	for (asset_name of each(this.assets)) {
		register_asset(asset_name, rt.index(this.assets, asset_name));
	}
	return f.dot;
});

// asset_cache.dm:170
rt.def("/datum/asset/simple/proc/send", function* send(f: Frame, client: Value) {
	yield* send_asset_list(client, this.assets, this.verify);
	return f.dot;
}, true);

rt.type(2269, "/datum/asset/simple/tgui", "/datum/asset/simple", {
	assets: null,
});

// asset_cache.dm:176
rt.def("/datum/asset/simple/tgui/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.assets = rt.alist(f, ["tgui.css", rt.rsc("tgui/assets/tgui.css"), "mat-metal.png", rt.rsc("tgui/assets/mat-metal.png"), "mat-glass.png", rt.rsc("tgui/assets/mat-glass.png"), "mat-silver.png", rt.rsc("tgui/assets/mat-silver.png"), "mat-gold.png", rt.rsc("tgui/assets/mat-gold.png"), "mat-diamond.png", rt.rsc("tgui/assets/mat-diamond.png"), "mat-plasma.png", rt.rsc("tgui/assets/mat-plasma.png"), "mat-uranium.png", rt.rsc("tgui/assets/mat-uranium.png"), "mat-bananium.png", rt.rsc("tgui/assets/mat-bananium.png"), "mat-titanium.png", rt.rsc("tgui/assets/mat-titanium.png"), "mat-bluespace.png", rt.rsc("tgui/assets/mat-bluespace.png"), "tgui.js", rt.rsc("tgui/assets/tgui.js"), "font-awesome.min.css", rt.rsc("tgui/assets/font-awesome.min.css"), "fontawesome-webfont.eot", rt.rsc("tgui/assets/fonts/fontawesome-webfont.eot"), "fontawesome-webfont.woff2", rt.rsc("tgui/assets/fonts/fontawesome-webfont.woff2"), "fontawesome-webfont.woff", rt.rsc("tgui/assets/fonts/fontawesome-webfont.woff"), "fontawesome-webfont.ttf", rt.rsc("tgui/assets/fonts/fontawesome-webfont.ttf"), "fontawesome-webfont.svg", rt.rsc("tgui/assets/fonts/fontawesome-webfont.svg")]);
	return f.dot;
});

rt.type(2270, "/datum/asset/simple/headers", "/datum/asset/simple", {
	assets: null,
});

// asset_cache.dm:188
rt.def("/datum/asset/simple/headers/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.assets = rt.alist(f, ["alarm_green.gif", rt.rsc("icons/program_icons/alarm_green.gif"), "alarm_red.gif", rt.rsc("icons/program_icons/alarm_red.gif"), "batt_5.gif", rt.rsc("icons/program_icons/batt_5.gif"), "batt_20.gif", rt.rsc("icons/program_icons/batt_20.gif"), "batt_40.gif", rt.rsc("icons/program_icons/batt_40.gif"), "batt_60.gif", rt.rsc("icons/program_icons/batt_60.gif"), "batt_80.gif", rt.rsc("icons/program_icons/batt_80.gif"), "batt_100.gif", rt.rsc("icons/program_icons/batt_100.gif"), "charging.gif", rt.rsc("icons/program_icons/charging.gif"), "downloader_finished.gif", rt.rsc("icons/program_icons/downloader_finished.gif"), "downloader_running.gif", rt.rsc("icons/program_icons/downloader_running.gif"), "ntnrc_idle.gif", rt.rsc("icons/program_icons/ntnrc_idle.gif"), "ntnrc_new.gif", rt.rsc("icons/program_icons/ntnrc_new.gif"), "power_norm.gif", rt.rsc("icons/program_icons/power_norm.gif"), "power_warn.gif", rt.rsc("icons/program_icons/power_warn.gif"), "sig_high.gif", rt.rsc("icons/program_icons/sig_high.gif"), "sig_low.gif", rt.rsc("icons/program_icons/sig_low.gif"), "sig_lan.gif", rt.rsc("icons/program_icons/sig_lan.gif"), "sig_none.gif", rt.rsc("icons/program_icons/sig_none.gif"), "smmon_0.gif", rt.rsc("icons/program_icons/smmon_0.gif"), "smmon_1.gif", rt.rsc("icons/program_icons/smmon_1.gif"), "smmon_2.gif", rt.rsc("icons/program_icons/smmon_2.gif"), "smmon_3.gif", rt.rsc("icons/program_icons/smmon_3.gif"), "smmon_4.gif", rt.rsc("icons/program_icons/smmon_4.gif"), "smmon_5.gif", rt.rsc("icons/program_icons/smmon_5.gif"), "smmon_6.gif", rt.rsc("icons/program_icons/smmon_6.gif")]);
	return f.dot;
});

rt.type(2271, "/datum/asset/simple/pda", "/datum/asset/simple", {
	assets: null,
});

// asset_cache.dm:218
rt.def("/datum/asset/simple/pda/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.assets = rt.alist(f, ["pda_atmos.png", rt.rsc("icons/pda_icons/pda_atmos.png"), "pda_back.png", rt.rsc("icons/pda_icons/pda_back.png"), "pda_bell.png", rt.rsc("icons/pda_icons/pda_bell.png"), "pda_blank.png", rt.rsc("icons/pda_icons/pda_blank.png"), "pda_boom.png", rt.rsc("icons/pda_icons/pda_boom.png"), "pda_bucket.png", rt.rsc("icons/pda_icons/pda_bucket.png"), "pda_medbot.png", rt.rsc("icons/pda_icons/pda_medbot.png"), "pda_floorbot.png", rt.rsc("icons/pda_icons/pda_floorbot.png"), "pda_cleanbot.png", rt.rsc("icons/pda_icons/pda_cleanbot.png"), "pda_crate.png", rt.rsc("icons/pda_icons/pda_crate.png"), "pda_cuffs.png", rt.rsc("icons/pda_icons/pda_cuffs.png"), "pda_eject.png", rt.rsc("icons/pda_icons/pda_eject.png"), "pda_flashlight.png", rt.rsc("icons/pda_icons/pda_flashlight.png"), "pda_honk.png", rt.rsc("icons/pda_icons/pda_honk.png"), "pda_mail.png", rt.rsc("icons/pda_icons/pda_mail.png"), "pda_medical.png", rt.rsc("icons/pda_icons/pda_medical.png"), "pda_menu.png", rt.rsc("icons/pda_icons/pda_menu.png"), "pda_mule.png", rt.rsc("icons/pda_icons/pda_mule.png"), "pda_notes.png", rt.rsc("icons/pda_icons/pda_notes.png"), "pda_power.png", rt.rsc("icons/pda_icons/pda_power.png"), "pda_rdoor.png", rt.rsc("icons/pda_icons/pda_rdoor.png"), "pda_reagent.png", rt.rsc("icons/pda_icons/pda_reagent.png"), "pda_refresh.png", rt.rsc("icons/pda_icons/pda_refresh.png"), "pda_scanner.png", rt.rsc("icons/pda_icons/pda_scanner.png"), "pda_signaler.png", rt.rsc("icons/pda_icons/pda_signaler.png"), "pda_status.png", rt.rsc("icons/pda_icons/pda_status.png"), "pda_dronephone.png", rt.rsc("icons/pda_icons/pda_dronephone.png")]);
	return f.dot;
});

rt.type(2272, "/datum/asset/simple/paper", "/datum/asset/simple", {
	assets: null,
});

// asset_cache.dm:249
rt.def("/datum/asset/simple/paper/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.assets = rt.alist(f, ["large_stamp-clown.png", rt.rsc("icons/stamp_icons/large_stamp-clown.png"), "large_stamp-deny.png", rt.rsc("icons/stamp_icons/large_stamp-deny.png"), "large_stamp-ok.png", rt.rsc("icons/stamp_icons/large_stamp-ok.png"), "large_stamp-hop.png", rt.rsc("icons/stamp_icons/large_stamp-hop.png"), "large_stamp-cmo.png", rt.rsc("icons/stamp_icons/large_stamp-cmo.png"), "large_stamp-ce.png", rt.rsc("icons/stamp_icons/large_stamp-ce.png"), "large_stamp-hos.png", rt.rsc("icons/stamp_icons/large_stamp-hos.png"), "large_stamp-rd.png", rt.rsc("icons/stamp_icons/large_stamp-rd.png"), "large_stamp-cap.png", rt.rsc("icons/stamp_icons/large_stamp-cap.png"), "large_stamp-qm.png", rt.rsc("icons/stamp_icons/large_stamp-qm.png"), "large_stamp-law.png", rt.rsc("icons/stamp_icons/large_stamp-law.png")]);
	return f.dot;
});

rt.type(2273, "/datum/asset/simple/IRV", "/datum/asset/simple", {
	assets: null,
});

// asset_cache.dm:264
rt.def("/datum/asset/simple/IRV/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.assets = rt.alist(f, ["jquery-ui.custom-core-widgit-mouse-sortable-min.js", rt.rsc("html/IRV/jquery-ui.custom-core-widgit-mouse-sortable-min.js"), "jquery-1.10.2.min.js", rt.rsc("html/IRV/jquery-1.10.2.min.js")]);
	return f.dot;
});

rt.type(2274, "/datum/asset/simple/changelog", "/datum/asset/simple", {
	assets: null,
});

// asset_cache.dm:270
rt.def("/datum/asset/simple/changelog/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.assets = rt.alist(f, ["88x31.png", rt.rsc("html/88x31.png"), "bug-minus.png", rt.rsc("html/bug-minus.png"), "cross-circle.png", rt.rsc("html/cross-circle.png"), "hard-hat-exclamation.png", rt.rsc("html/hard-hat-exclamation.png"), "image-minus.png", rt.rsc("html/image-minus.png"), "image-plus.png", rt.rsc("html/image-plus.png"), "music-minus.png", rt.rsc("html/music-minus.png"), "music-plus.png", rt.rsc("html/music-plus.png"), "tick-circle.png", rt.rsc("html/tick-circle.png"), "wrench-screwdriver.png", rt.rsc("html/wrench-screwdriver.png"), "spell-check.png", rt.rsc("html/spell-check.png"), "burn-exclamation.png", rt.rsc("html/burn-exclamation.png"), "chevron.png", rt.rsc("html/chevron.png"), "chevron-expand.png", rt.rsc("html/chevron-expand.png"), "scales.png", rt.rsc("html/scales.png"), "changelog.css", rt.rsc("html/changelog.css")]);
	return f.dot;
});

rt.type(2275, "/datum/asset/simple/goonchat", "/datum/asset/simple", {
	verify: 0,
	assets: null,
});

// asset_cache.dm:291
rt.def("/datum/asset/simple/goonchat/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	// tg_js: goonchat's own js and css are gone (the page's output pane stands in for the goonchat window); the shared files stay.
	this.assets = rt.alist(f, ["jquery.min.js", rt.rsc("code/modules/html_interface/js/jquery.min.js"), "fontawesome-webfont.eot", rt.rsc("tgui/assets/fonts/fontawesome-webfont.eot"), "fontawesome-webfont.svg", rt.rsc("tgui/assets/fonts/fontawesome-webfont.svg"), "fontawesome-webfont.ttf", rt.rsc("tgui/assets/fonts/fontawesome-webfont.ttf"), "fontawesome-webfont.woff", rt.rsc("tgui/assets/fonts/fontawesome-webfont.woff")]);
	return f.dot;
});

rt.type(2276, "/datum/asset/HTML_interface", "/datum/asset", {});

// asset_cache.dm:306
rt.def("/datum/asset/HTML_interface/proc/register", function* register(f: Frame) {
	let path: Value = null, hi: Value = null;
	for (path of each(typesof(T("/datum/html_interface")))) {
		(hi = (yield* new_(path))).registerResources();
	}
	return f.dot;
}, true);
