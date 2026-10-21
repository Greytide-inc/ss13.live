// From code/modules/admin/holder2.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobaladmin_datums  (code/modules/admin/holder2.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_datums", function InitGlobaladmin_datums(f: Frame) {
	rt.setGl("admin_datums", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "admin_datums", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaladmin_datums  (code/modules/admin/holder2.dm:2)
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_datums", function InitGlobaladmin_datums(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "admin_datums", add);
	return f.dot;
});

rt.type(358, "/datum/admins", "/datum", {
	rank: null,
	owner: null,
	fakekey: null,
	marked_datum: null,
	spamcooldown: 0,
	admincaster_screen: 0,
	admin_signature: null,
	admincaster_feed_message: null,
	admincaster_wanted_message: null,
	admincaster_feed_channel: null,
});

// /datum/admins/proc/<init>  (code/modules/admin/holder2.dm:15)
rt.def("/datum/admins/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "admincaster_feed_message", rt.new_(f, T("/datum/newscaster/feed_message"), []));
	$0 = $0;
	rt.setSv(f, "admincaster_wanted_message", rt.new_(f, T("/datum/newscaster/wanted_message"), []));
	$0 = $0;
	rt.setSv(f, "admincaster_feed_channel", rt.new_(f, T("/datum/newscaster/feed_channel"), []));
	return f.dot;
});

// /datum/admins/proc/New  (code/modules/admin/holder2.dm:21)  may sleep
rt.def("/datum/admins/proc/New", function* New(f: Frame, R: Value, ckey: Value) {
	f.vars = () => [R, ckey];
	if (!truthy(live(ckey))) {
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(f.src)])), 0, 8]);
		rt.throw_(f, (yield* g.new_(f, T("/exception"), ["Admin datum created without a ckey", "code/modules/admin/holder2.dm", 23])));
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(R), T("/datum/admin_rank")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(f.src)])), 0, 8]);
		rt.throw_(f, (yield* g.new_(f, T("/exception"), ["Admin datum created without a rank", "code/modules/admin/holder2.dm", 27])));
		return live(f.dot);
	}
	rt.setSv(f, "rank", live(R));
	rt.setSv(f, "admin_signature", fmt("Nanotrasen Officer #＀＀＀", [(yield* g.call(f, P("/proc/rand"), null, [0, 9])), (yield* g.call(f, P("/proc/rand"), null, [0, 9])), (yield* g.call(f, P("/proc/rand"), null, [0, 9]))]));
	rt.setAt(rt.gl("admin_datums"), live(ckey), live(f.src));
	return f.dot;
}, true);

// /datum/admins/proc/associate  (code/modules/admin/holder2.dm:34)
rt.def("/datum/admins/proc/associate", function associate(f: Frame, C: Value) {
	if (!truthy((rt.istype(live(C), T("/client")) ? 1 : 0))) return f.dot;
	rt.setSv(f, "owner", live(C));
	rt.setFv(f, "holder", rt.sv(f, "owner"), live(f.src));
	rt.callName(f, rt.sv(f, "owner"), "add_admin_verbs", []);
	(rt.modField(f, rt.sv(f, "owner"), "verbs", P("/client/proc/readmin"), subtract));
	(rt.modGl("admins", live(C), rt.bitOr));
	return f.dot;
});

// /datum/admins/proc/disassociate  (code/modules/admin/holder2.dm:43)
rt.def("/datum/admins/proc/disassociate", function disassociate(f: Frame) {
	if (!truthy(rt.sv(f, "owner"))) return f.dot;
	(rt.modGl("admins", rt.sv(f, "owner"), subtract));
	rt.callName(f, rt.sv(f, "owner"), "remove_admin_verbs", []);
	rt.setFv(f, "holder", rt.sv(f, "owner"), null);
	rt.setSv(f, "owner", null);
	return f.dot;
});

// /datum/admins/proc/check_if_greater_rights_than_holder  (code/modules/admin/holder2.dm:49)
rt.def("/datum/admins/proc/check_if_greater_rights_than_holder", function check_if_greater_rights_than_holder(f: Frame, other: Value) {
	if (!truthy(live(other))) {
		return 1;
	}
	if (isEqual(rt.fv(f, "rights", rt.sv(f, "rank")), 65535)) {
		return 1;
	}
	if (isEqual(live(f.src), live(other))) {
		return 1;
	}
	if (!isEqual(rt.fv(f, "rights", rt.sv(f, "rank")), rt.gv(f, "rights", rt.fv(f, "rank", live(other))))) {
		if (isEqual(rt.bitAnd(rt.fv(f, "rights", rt.sv(f, "rank")), rt.gv(f, "rights", rt.fv(f, "rank", live(other)))), rt.gv(f, "rights", rt.fv(f, "rank", live(other))))) {
			return 1;
		}
	}
	return 0;
});

// /proc/check_rights  (code/modules/admin/holder2.dm:77)
rt.def("/proc/check_rights", function check_rights(f: Frame, rights_required: Value, show_msg: Value) {
	f.vars = () => [show_msg];
	if (live(show_msg) === null) {
		show_msg = 1;
	}
	if ((truthy(live(f.usr)) && truthy(rt.fv(f, "client", live(f.usr))))) {
		if (truthy(rt.call(f, P("/proc/check_rights_for"), null, [rt.fv(f, "client", live(f.usr)), live(rights_required)]))) {
			return 1;
		} else {
			if (truthy(live(show_msg))) {
				rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<font color='red'>Error: You do not have sufficient rights to do that. You require one of the following flags:＀.</font>", [rt.call(f, P("/proc/rights2text"), null, [live(rights_required), " "])])]);
			}
		}
	}
	return 0;
});

// /proc/check_if_greater_rights_than  (code/modules/admin/holder2.dm:87)
rt.def("/proc/check_if_greater_rights_than", function check_if_greater_rights_than(f: Frame, other: Value) {
	if ((truthy(live(f.usr)) && truthy(rt.fv(f, "client", live(f.usr))))) {
		if (truthy(rt.gv(f, "holder", rt.fv(f, "client", live(f.usr))))) {
			if ((!truthy(live(other)) || !truthy(rt.fv(f, "holder", live(other))))) {
				return 1;
			}
			return rt.callName(f, rt.gv(f, "holder", rt.fv(f, "client", live(f.usr))), "check_if_greater_rights_than_holder", [rt.fv(f, "holder", live(other))]);
		}
	}
	return 0;
});

// /proc/check_rights_for  (code/modules/admin/holder2.dm:96)
rt.def("/proc/check_rights_for", function check_rights_for(f: Frame, subject: Value, rights_required: Value) {
	if (((truthy(live(subject)) && truthy(rt.fv(f, "holder", live(subject)))) && truthy(rt.gv(f, "rank", rt.fv(f, "holder", live(subject)))))) {
		if ((truthy(live(rights_required)) && !truthy(rt.bitAnd(live(rights_required), rt.gv(f, "rights", rt.gv(f, "rank", rt.fv(f, "holder", live(subject)))))))) {
			return 0;
		}
		return 1;
	}
	return 0;
});
