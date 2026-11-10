// Based on /tg/station's code/controllers/subsystem/stickyban.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(42, "/datum/controller/subsystem/stickyban", "/datum/controller/subsystem", {
	cache: null,
	name: "Sticky Ban",
	init_order: -10,
	flags: 2,
});

// stickyban.dm:1
rt.def("/datum/controller/subsystem/stickyban/proc/New", function* New(f: Frame) {
	if (GLOB.SSstickyban != this) {
		if (rt.istype(GLOB.SSstickyban, T("/datum/controller/subsystem/stickyban"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSstickyban);
		}
		GLOB.SSstickyban = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// stickyban.dm:6
rt.def("/datum/controller/subsystem/stickyban/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.cache = list();
	return f.dot;
});

// stickyban.dm:9
rt.def("/datum/controller/subsystem/stickyban/proc/Initialize", function Initialize(f: Frame, timeofday: Value) {
	let bannedkey: Value = null, ckey: Value = null, ban: Value = null, bannedckey: Value = null;
	let bannedkeys: Value = rt.world().GetConfig("ban");
	for (bannedkey of each(bannedkeys)) {
		ckey = rt.call(f, P("/proc/ckey"), null, [bannedkey]);
		ban = stickyban2list(rt.world().GetConfig("ban", bannedkey));
		rt.world().SetConfig("ban", bannedkey, null);
		if (!rt.at(ban, "ckey")) {
			rt.setAt(ban, "ckey", ckey);
		}
		ban -= "IP";
		ban -= "computer_id";
		rt.setAt(ban, "matches_this_round", list());
		rt.setAt(ban, "existing_user_matches_this_round", list());
		rt.setAt(ban, "admin_matches_this_round", list());
		rt.setAt(this.cache, ckey, ban);
	}
	for (bannedckey of each(this.cache)) {
		rt.world().SetConfig("ban", bannedckey, list2stickyban(rt.index(this.cache, bannedckey)));
	}
	return f.dot;
});
