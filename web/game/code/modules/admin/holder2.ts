// Based on /tg/station's code/modules/admin/holder2.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


// holder2.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_datums", function InitGlobaladmin_datums(f: Frame) {
	GLOB.admin_datums = list();
	this.gvars_datum_init_order += "admin_datums";
	return f.dot;
});

// holder2.dm:2
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_datums", function InitGlobaladmin_datums(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "admin_datums";
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

// holder2.dm:15
rt.def("/datum/admins/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.admincaster_feed_message = new_(T("/datum/newscaster/feed_message"));

	this.admincaster_wanted_message = new_(T("/datum/newscaster/wanted_message"));

	this.admincaster_feed_channel = new_(T("/datum/newscaster/feed_channel"));
	return f.dot;
});

// holder2.dm:21
rt.def("/datum/admins/proc/New", function* New(f: Frame, R: Value, ckey: Value) {
	if (!ckey) {
		yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this)), 0, 8);
		rt.throw_(f, (yield* new_(T("/exception"), "Admin datum created without a ckey", "code/modules/admin/holder2.dm", 23)));
		return f.dot;
	}
	if (!rt.istype(R, T("/datum/admin_rank"))) {
		yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this)), 0, 8);
		rt.throw_(f, (yield* new_(T("/exception"), "Admin datum created without a rank", "code/modules/admin/holder2.dm", 27)));
		return f.dot;
	}
	this.rank = R;
	this.admin_signature = `Nanotrasen Officer #${rand(0, 9)}${rand(0, 9)}${rand(0, 9)}`;
	rt.setAt(GLOB.admin_datums, ckey, this);
	return f.dot;
}, true);

// holder2.dm:34
rt.def("/datum/admins/proc/associate", function associate(f: Frame, C: Value) {
	if (!rt.istype(C, T("/client"))) return f.dot;
	this.owner = C;
	this.owner.holder = this;
	this.owner.add_admin_verbs();
	this.owner.verbs -= P("/client/proc/readmin");
	(rt.modGl("admins", C, rt.bitOr));
	return f.dot;
});

// holder2.dm:43
rt.def("/datum/admins/proc/disassociate", function disassociate(f: Frame) {
	if (!this.owner) return f.dot;
	GLOB.admins -= this.owner;
	this.owner.remove_admin_verbs();
	this.owner.holder = null;
	this.owner = null;
	return f.dot;
});

// holder2.dm:49
rt.def("/datum/admins/proc/check_if_greater_rights_than_holder", function check_if_greater_rights_than_holder(f: Frame, other: Value) {
	if (!other) {
		return 1;
	}
	if (this.rank.rights == 65535) {
		return 1;
	}
	if (this == other) {
		return 1;
	}
	if (this.rank.rights != other.rank.rights) {
		if (rt.bitAnd(this.rank.rights, other.rank.rights) == other.rank.rights) {
			return 1;
		}
	}
	return 0;
});

// holder2.dm:77
rt.def("/proc/check_rights", function check_rights(f: Frame, rights_required: Value, show_msg: Value) {
	show_msg ??= 1;
	if (f.usr && f.usr.client) {
		if (check_rights_for(f.usr.client, rights_required)) {
			return 1;
		} else if (show_msg) {
			to_chat(f.usr, `<font color='red'>Error: You do not have sufficient rights to do that. You require one of the following flags:${rights2text(rights_required, " ")}.</font>`);
		}
	}
	return 0;
});

// holder2.dm:87
rt.def("/proc/check_if_greater_rights_than", function check_if_greater_rights_than(f: Frame, other: Value) {
	if (f.usr && f.usr.client) {
		if (f.usr.client.holder) {
			if (!other || !other.holder) {
				return 1;
			}
			return f.usr.client.holder.check_if_greater_rights_than_holder(other.holder);
		}
	}
	return 0;
});

// holder2.dm:96
rt.def("/proc/check_rights_for", function check_rights_for(f: Frame, subject: Value, rights_required: Value) {
	if (subject && subject.holder && subject.holder.rank) {
		if (rights_required && !rt.bitAnd(rights_required, subject.holder.rank.rights)) {
			return 0;
		}
		return 1;
	}
	return 0;
});
