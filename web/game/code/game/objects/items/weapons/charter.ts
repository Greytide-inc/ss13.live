// From code/game/objects/items/weapons/charter.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7124, "/obj/item/weapon/station_charter", "/obj/item/weapon", {
	used: 0,
	name_type: "station",
	unlimited_uses: 0,
	ignores_timeout: 0,
	response_timer_id: null,
	approval_time: 600,
	name: "station charter",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "scroll2",
	desc: "An official document entrusting the governance of the station and surrounding space to the Captain. ",
}, { global: { standard_station_regex: 731 } });

// /obj/item/weapon/station_charter/proc/Initialize  (code/game/objects/items/weapons/charter.dm:20)  may sleep
rt.def("/obj/item/weapon/station_charter/proc/Initialize", function* Initialize(f: Frame) {
	let prefixes: Value = null, names: Value = null, suffixes: Value = null, numerals: Value = null, regexstr: Value = null;
	f.vars = () => [prefixes, names, suffixes, numerals, regexstr];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.gl("standard_station_regex"))) return f.dot;
	prefixes = (yield* g.call(f, P("/proc/jointext"), null, [rt.gl("station_prefixes"), "|"]));
	names = (yield* g.call(f, P("/proc/jointext"), null, [rt.gl("station_names"), "|"]));
	suffixes = (yield* g.call(f, P("/proc/jointext"), null, [rt.gl("station_suffixes"), "|"]));
	numerals = (yield* g.call(f, P("/proc/jointext"), null, [rt.gl("station_numerals"), "|"]));
	rt.setGl("standard_station_regex", (yield* g.new_(f, T("/regex"), [(regexstr = fmt("((＀) )?((＀) ?)(＀) (＀)", [live(prefixes), live(names), live(suffixes), live(numerals)]))])));
	return f.dot;
}, true);

// /obj/item/weapon/station_charter/proc/attack_self  (code/game/objects/items/weapons/charter.dm:31)  may sleep
rt.def("/obj/item/weapon/station_charter/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let new_name: Value = null;
	f.vars = () => [user, new_name];
	if (truthy(rt.sv(f, "used"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("The ＀ has already been named.", [rt.sv(f, "name_type")])]);
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "ignores_timeout")) && rt.gt(subtract(rt.worldTime(f), rt.fv(f, "round_start_time", rt.gl("SSticker"))), 3000))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("The crew has already settled into the shift. It probably wouldn't be good to rename the ＀ right now.", [rt.sv(f, "name_type")])]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "response_timer_id"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "You're still waiting for approval from your employers about your proposed name change, it'd be best to wait for now."]);
		return live(f.dot);
	}
	new_name = (yield* g.call(f, P("/proc/stripped_input"), null, [null, live(user), "message", fmt("What do you want to name ＀? Keep in mind particularly terrible names may be rejected by your employers, while names using the standard format, will automatically be accepted.", [(yield* g.call(f, P("/proc/station_name"), null, []))]), "max_length", 80], rt.Args.Named));
	if (truthy(rt.sv(f, "response_timer_id"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "You're still waiting for approval from your employers about your proposed name change, it'd be best to wait for now."]);
		return live(f.dot);
	}
	if (!truthy(live(new_name))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ has proposed to name the station as ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), live(new_name)])]);
	if (truthy((yield* g.callName(f, rt.gl("standard_station_regex"), "Find", [live(new_name)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Your name has been automatically approved."]);
		yield* g.srcCall(f, "rename_station", live(new_name), rt.fv(f, "name", live(user)), rt.fv(f, "real_name", live(user)), (yield* g.call(f, P("/proc/key_name"), null, [live(user)])));
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Your name has been sent to your employers for approval."]);
	rt.setSv(f, "response_timer_id", (yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/weapon/station_charter/proc/rename_station"), live(new_name), rt.fv(f, "name", live(user)), rt.fv(f, "real_name", live(user)), (yield* g.call(f, P("/proc/key_name"), null, [live(user)]))])), rt.sv(f, "approval_time"), 8])));
	yield* g.call(f, P("/proc/to_chat"), null, [rt.gl("admins"), fmt("<span class='adminnotice'><b><font color=orange>CUSTOM STATION RENAME:</font></b>＀ proposes to rename the ＀ to ＀ (will autoapprove in ＀ seconds). ＀ (<A HREF='?_src_=holder;reject_custom_name=＃'>REJECT</A>) ＀</span>", [fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(user)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(user)])]), rt.sv(f, "name_type"), live(new_name), divide(rt.sv(f, "approval_time"), 10), fmt("(<a href='?_src_=holder;adminsmite=＃'>SMITE</a>)", [live(user)]), live(f.src), fmt("(<a href='?_src_=holder;CentcommReply=＃'>RPLY</a>)", [live(user)])])]);
	return f.dot;
}, true);

// /obj/item/weapon/station_charter/proc/reject_proposed  (code/game/objects/items/weapons/charter.dm:65)  may sleep
rt.def("/obj/item/weapon/station_charter/proc/reject_proposed", function* reject_proposed(f: Frame, user: Value) {
	let _T: Value = null, m: Value = null;
	f.vars = () => [user, _T, m];
	if (!truthy(live(user))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "response_timer_id"))) {
		return live(f.dot);
	}
	yield* g.callName(f, (_T = rt.getStep(f, live(f.src), 0)), "visible_message", [fmt("<span class='warning'>The proposed changes disappear from ＀; it looks like they've been rejected.</span>", [live(f.src)])]);
	yield* g.call(f, P("/proc/message_admins"), null, [(m = fmt("＀ has rejected the proposed station name.", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)]))]))]);
	yield* g.call(f, P("/proc/log_admin"), null, [live(m)]);
	yield* g.call(f, P("/proc/deltimer"), null, [rt.sv(f, "response_timer_id")]);
	rt.setSv(f, "response_timer_id", null);
	return f.dot;
}, true);

// /obj/item/weapon/station_charter/proc/rename_station  (code/game/objects/items/weapons/charter.dm:81)
rt.def("/obj/item/weapon/station_charter/proc/rename_station", function rename_station(f: Frame, designation: Value, uname: Value, ureal_name: Value, ukey: Value) {
	rt.call(f, P("/proc/set_station_name"), null, [live(designation)]);
	rt.call(f, P("/proc/minor_announce"), null, [fmt("＀ has designated your station as ＀", [live(ureal_name), rt.call(f, P("/proc/station_name"), null, [])]), "Captain's Charter", 0]);
	rt.call(f, P("/proc/log_game"), null, [fmt("＀ has renamed the station as ＀.", [live(ukey), rt.call(f, P("/proc/station_name"), null, [])])]);
	rt.setSv(f, "name", fmt("station charter for ＀", [rt.call(f, P("/proc/station_name"), null, [])]));
	rt.setSv(f, "desc", fmt("An official document entrusting the governance of ＀ and surrounding space to Captain ＀.", [rt.call(f, P("/proc/station_name"), null, []), live(uname)]));
	if (truthy(rt.sv(f, "unlimited_uses"))) return f.dot;
	rt.setSv(f, "used", 1);
	return f.dot;
});

rt.type(7126, "/obj/item/weapon/station_charter/flag", "/obj/item/weapon/station_charter", {
	name_type: "planet",
	name: "nanotrasen banner",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "banner",
	item_state: "banner",
	desc: "A cunning device used to claim ownership of planets.",
	w_class: 5,
	force: 15,
});

// /obj/item/weapon/station_charter/flag/proc/rename_station  (code/game/objects/items/weapons/charter.dm:108)
rt.def("/obj/item/weapon/station_charter/flag/proc/rename_station", function rename_station(f: Frame, designation: Value, uname: Value, ureal_name: Value, ukey: Value) {
	rt.call(f, P("/proc/set_station_name"), null, [live(designation)]);
	rt.call(f, P("/proc/minor_announce"), null, [fmt("＀ has designated the planet as ＀", [live(ureal_name), rt.call(f, P("/proc/station_name"), null, [])]), "Captain's Banner", 0]);
	rt.call(f, P("/proc/log_game"), null, [fmt("＀ has renamed the planet as ＀.", [live(ukey), rt.call(f, P("/proc/station_name"), null, [])])]);
	rt.setSv(f, "name", fmt("banner of ＀", [rt.call(f, P("/proc/station_name"), null, [])]));
	rt.setSv(f, "desc", fmt("The banner bears the official coat of arms of Nanotrasen, signifying that ＀ has been claimed by Captain ＀ in the name of the company.", [rt.call(f, P("/proc/station_name"), null, []), live(uname)]));
	if (truthy(rt.sv(f, "unlimited_uses"))) return f.dot;
	rt.setSv(f, "used", 1);
	return f.dot;
});
