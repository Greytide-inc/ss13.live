// Based on /tg/station's code/modules/admin/verbs/adminjump.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


// adminjump.dm:5
rt.def("/client/proc/jumptoarea", function* jumptoarea(f: Frame, A: Value) {
	let Ar: Value = null, _T: Value = null, _T_1: Value = null;
	if (!this.holder) {
		to_chat(this, "Only administrators may use this command.");
		return f.dot;
	}
	if (!A) {
		return f.dot;
	}
	let turfs: Value = list();
	for (Ar of each(A.related, T("/area"))) {
		_T = null;
		for (_T of each(Ar, T("/turf"))) {
			if (_T.density) {
				continue;
			}
			turfs.Add(_T);
		}
	}
	if (!(_T_1 = safepick(turfs))) {
		to_chat(this, "Nowhere to jump to!");
		return f.dot;
	}
	yield* f.usr.forceMove(_T_1);
	log_admin(`${key_name(f.usr)} jumped to ${A}`);
	message_admins(`${key_name_admin(f.usr)} jumped to ${A}`);
	return f.dot;
}, true, { verb: { name: "Jump to Area", category: "Admin", desc: "Area to jump to" }, argTypes: [{ type: 128, path: "/area", source: "?" }] });

// adminjump.dm:31
rt.def("/client/proc/jumptoturf", function jumptoturf(f: Frame, _T: Value) {
	if (!this.holder) {
		to_chat(this, "Only administrators may use this command.");
		return f.dot;
	}
	log_admin(`${key_name(f.usr)} jumped to ${_T.x},${_T.y},${_T.z} in ${_T.loc}`);
	message_admins(`${key_name_admin(f.usr)} jumped to ${_T.x},${_T.y},${_T.z} in ${_T.loc}`);
	f.usr.loc = _T;
	return f.dot;
}, false, { verb: { name: "Jump to Turf", category: "Admin" }, argTypes: [{ path: "/turf", source: "world" }] });

// adminjump.dm:45
rt.def("/client/proc/jumptomob", function* jumptomob(f: Frame, M: Value) {
	let _T: Value = null;
	if (!this.holder) {
		to_chat(this, "Only administrators may use this command.");
		return f.dot;
	}
	log_admin(`${key_name(f.usr)} jumped to ${key_name(M)}`);
	message_admins(`${key_name_admin(f.usr)} jumped to ${key_name_admin(M)}`);
	if (!this.mob) return f.dot;
	let A: Value = this.mob;
	if ((_T = rt.getStep(f, M, 0)) && isturf(_T)) {
		yield* A.forceMove(M.loc);
	} else {
		to_chat(A, "This mob is not located in the game world.");
	}
	return f.dot;
}, true, { verb: { name: "Jump to Mob", category: "Admin" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// adminjump.dm:64
rt.def("/client/proc/jumptocoord", function jumptocoord(f: Frame, tx: Value, ty: Value, tz: Value) {
	let A: Value = null;
	if (!this.holder) {
		to_chat(this, "Only administrators may use this command.");
		return f.dot;
	}
	if (this.mob) {
		(A = this.mob).x = tx;
		A.y = ty;
		A.z = tz;
	}
	message_admins(`${key_name_admin(f.usr)} jumped to coordinates ${tx}, ${ty}, ${tz}`);
	return f.dot;
}, false, { verb: { name: "Jump to Coordinate", category: "Admin" }, argTypes: [{ type: 32 }, { type: 32 }, { type: 32 }] });

// adminjump.dm:80
rt.def("/client/proc/jumptokey", function* jumptokey(f: Frame) {
	let M: Value = null, selection: Value = null;
	if (!this.holder) {
		to_chat(this, "Only administrators may use this command.");
		return f.dot;
	}
	let keys: Value = list();
	for (M of each(GLOB.player_list, T("/mob"))) {
		keys += M.client;
	}
	if (!(selection = (yield* g.op(f, "Prompt", [1], [null, null, "Admin Jumping", "Please, select a player!", (yield* sortKey(keys))])))) {
		to_chat(this, "No keys found.");
		return f.dot;
	}
	let M_2: Value = selection.mob;
	log_admin(`${key_name(f.usr)} jumped to ${key_name(M_2)}`);
	message_admins(`${key_name_admin(f.usr)} jumped to ${key_name_admin(M_2)}`);
	yield* f.usr.forceMove(M_2.loc);
	return f.dot;
}, true, { verb: { name: "Jump to Key", category: "Admin" } });

// adminjump.dm:103
rt.def("/client/proc/Getmob", function* Getmob(f: Frame, M: Value) {
	let msg: Value = null;
	let $2: any;
	if (!this.holder) {
		to_chat(this, "Only administrators may use this command.");
		return f.dot;
	}
	let loc: Value = rt.getStep(f, f.usr, 0);
	log_admin(`${key_name(f.usr)} teleported ${key_name(M)} to ${`(${loc.x},${loc.y},${loc.z})`}`);
	let $0: any = key_name_admin(f.usr);
	let $1: any = key_name_admin(M);
	if (loc) {
		$2 = `${`(${loc.x},${loc.y},${loc.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${loc.x};Y=${loc.y};Z=${loc.z}'>JMP</a>)`}`;
	} else {
		$2 = "nonexistent location";
	}
	message_admins((msg = `${$0} teleported ${$1} to ${`${$2}`}`));
	admin_ticket_log(M, msg);
	yield* M.forceMove(loc);
	return f.dot;
}, true, { verb: { name: "Get Mob", category: "Admin", desc: "Mob to teleport" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// adminjump.dm:120
rt.def("/client/proc/Getkey", function* Getkey(f: Frame) {
	let M: Value = null, selection: Value = null, M_2: Value = null, msg: Value = null;
	if (!this.holder) {
		to_chat(this, "Only administrators may use this command.");
		return f.dot;
	}
	let keys: Value = list();
	for (M of each(GLOB.player_list, T("/mob"))) {
		keys += M.client;
	}
	if (!(selection = (yield* g.op(f, "Prompt", [1], [null, null, "Admin Jumping", "Please, select a player!", (yield* sortKey(keys))])))) {
		return f.dot;
	}
	if (!(M_2 = selection.mob)) {
		return f.dot;
	}
	log_admin(`${key_name(f.usr)} teleported ${key_name(M_2)}`);
	message_admins((msg = `${key_name_admin(f.usr)} teleported ${key_name_admin(M_2)}`));
	admin_ticket_log(M_2, msg);
	if (!M_2) return f.dot;
	yield* M_2.forceMove(rt.getStep(f, f.usr, 0));
	f.usr.loc = M_2.loc;
	return f.dot;
}, true, { verb: { name: "Get Key", category: "Admin", desc: "Key to teleport" } });

// adminjump.dm:146
rt.def("/client/proc/sendmob", function* sendmob(f: Frame, M: Value) {
	let A: Value = null, msg: Value = null;
	if (!this.holder) {
		to_chat(this, "Only administrators may use this command.");
		return f.dot;
	}
	if (!((A = (yield* g.op(f, "Prompt", [0], [null, "Pick an area", "Pick an area.", f.usr, rt.bitOr(GLOB.sortedAreas, null)]))) && rt.istype(A, T("/area")))) return f.dot;
	if (yield* M.forceMove(safepick(get_area_turfs(A)))) {
		log_admin(`${key_name(f.usr)} teleported ${key_name(M)} to ${A}`);
		message_admins((msg = `${key_name_admin(f.usr)} teleported ${key_name_admin(M)} to ${A}`));
		admin_ticket_log(M, msg);
	} else {
		to_chat(this, "Failed to move mob to a valid location.");
	}
	return f.dot;
}, true, { verb: { name: "Send Mob", category: "Admin" }, argTypes: [{ type: 8, path: "/mob", source: "sortmobs" }] });
