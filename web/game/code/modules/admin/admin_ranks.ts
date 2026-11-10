// Based on /tg/station's code/modules/admin/admin_ranks.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// admin_ranks.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_ranks", function InitGlobaladmin_ranks(f: Frame) {
	GLOB.admin_ranks = list();
	this.gvars_datum_init_order += "admin_ranks";
	return f.dot;
});

// admin_ranks.dm:2
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_ranks", function InitGlobaladmin_ranks(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "admin_ranks";
	return f.dot;
});

rt.type(1838, "/datum/admin_rank", "/datum", {
	name: "NoRank",
	rights: 0,
	adds: null,
	subs: null,
});

// admin_ranks.dm:11
rt.def("/datum/admin_rank/proc/New", function New(f: Frame, init_name: Value, init_rights: Value, init_adds: Value, init_subs: Value) {
	this.name = init_name;
	if (this.name === "Removed" || this.name == null || this.name === "") {
		rt.spawnTail(f, 0, "/datum/admin_rank/proc/New: spawn at modules/admin/admin_ranks.dm:14", init_name, init_rights, init_adds, init_subs);
		rt.throw_(f, new_(T("/exception"), "invalid admin-rank name", "code/modules/admin/admin_ranks.dm", 16));
		return f.dot;
	}
	if (init_rights) {
		this.rights = init_rights;
	}
	if (!init_adds) {
		init_adds = list();
	}
	if (!init_subs) {
		init_subs = list();
	}
	this.adds = init_adds;
	this.subs = init_subs;
	return f.dot;
});

// a spawn(0) body of /datum/admin_rank/proc/New, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/admin_rank/proc/New: spawn at modules/admin/admin_ranks.dm:14", function* (f: Frame, init_name: Value, init_rights: Value, init_adds: Value, init_subs: Value) {
	yield* qdel(this);
	return null;
});

// admin_ranks.dm:35
rt.def("/proc/admin_keyword_to_flag", function admin_keyword_to_flag(f: Frame, word: Value, previous_rights: Value) {
	previous_rights ??= 0;
	let flag: Value = 0;
	const ckey_2 = ckey(word);
	if (ckey_2 === "buildmode" || ckey_2 === "build") {
		flag = 1;
	} else if (ckey_2 === "admin") {
		flag = 2;
	} else if (ckey_2 === "ban") {
		flag = 4;
	} else if (ckey_2 === "fun") {
		flag = 8;
	} else if (ckey_2 === "server") {
		flag = 16;
	} else if (ckey_2 === "debug") {
		flag = 32;
	} else if (ckey_2 === "permissions" || ckey_2 === "rights") {
		flag = 128;
	} else if (ckey_2 === "possess") {
		flag = 64;
	} else if (ckey_2 === "stealth") {
		flag = 256;
	} else if (ckey_2 === "poll") {
		flag = 512;
	} else if (ckey_2 === "varedit") {
		flag = 1024;
	} else if (ckey_2 === "everything" || ckey_2 === "host" || ckey_2 === "all") {
		flag = 65535;
	} else if (ckey_2 === "sound" || ckey_2 === "sounds") {
		flag = 2048;
	} else if (ckey_2 === "spawn" || ckey_2 === "create") {
		flag = 4096;
	} else if (ckey_2 === "@" || ckey_2 === "prev") {
		flag = previous_rights;
	} else if (ckey_2 === "rejuv" || ckey_2 === "rejuvinate") {
		stack_trace("Legacy keyword rejuvinate used defaulting to R_ADMIN");
		flag = 2;
	}
	return flag;
});

// admin_ranks.dm:72
rt.def("/proc/admin_keyword_to_path", function admin_keyword_to_path(f: Frame, word: Value) {
	return text2path(copytext(word, 2, findtext(word, " ", 2, 0)));
});

// admin_ranks.dm:76
rt.def("/datum/admin_rank/proc/process_keyword", function process_keyword(f: Frame, word: Value, previous_rights: Value) {
	let flag: Value = null, path: Value = null;
	previous_rights ??= 0;
	if (flag = admin_keyword_to_flag(word, previous_rights)) {
		const text2ascii_2 = text2ascii(word, 1);
		if (text2ascii_2 === 43) {
			(rt.modSrcVar(f, "rights", flag, rt.bitOr));
		} else if (text2ascii_2 === 45) {
			(rt.modSrcVar(f, "rights", rt.op(f, "BitNot", [], [flag]), rt.bitAnd));
		}
	} else {
		if (!(path = admin_keyword_to_path(word))) return f.dot;
		const text2ascii_2 = text2ascii(word, 1);
		if (text2ascii_2 === 43) {
			if (!this.subs.Remove(path)) {
				this.adds += path;
			}
		} else if (text2ascii_2 === 45) {
			if (this.adds.Remove(path)) return f.dot;
			this.subs += path;
		}
	}
	return f.dot;
});

// admin_ranks.dm:109
rt.def("/proc/load_admin_ranks", function load_admin_ranks(f: Frame) {
	let line: Value = null, next: Value = null, R: Value = null, prev: Value = null;
	GLOB.admin_ranks.Cut();
	let previous_rights: Value = 0;
	for (line of each(rt.world().file2list("config/admin_ranks.txt"))) {
		if (!line) {
			continue;
		}
		if (findtextEx(line, "#", 1, 2)) {
			continue;
		}
		next = findtext(line, "=");
		if (!(R = new_(T("/datum/admin_rank"), ckeyEx(copytext(line, 1, next))))) {
			continue;
		}
		GLOB.admin_ranks += R;
		prev = findchar(line, "+-", next, 0);
		while (prev) {
			next = findchar(line, "+-", prev + 1, 0);
			R.process_keyword(copytext(line, prev, next), previous_rights);
			prev = next;
		}
		previous_rights = R.rights;
	}
	return f.dot;
});

// admin_ranks.dm:167
rt.def("/proc/load_admins", function* load_admins(f: Frame, target: Value) {
	let C: Value = null, A: Value = null;
	if (!target) {
		GLOB.admin_datums.Cut();
		for (C of each(GLOB.admins, T("/client"))) {
			C.remove_admin_verbs();
			C.holder = null;
		}
		GLOB.admins.Cut();
		load_admin_ranks();
		for (A of each(rt.world().GetConfig("admin"))) {
			rt.world().SetConfig("APP/admin", A, null);
		}
	}
	return f.dot;
}, true);
