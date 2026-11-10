// Based on /tg/station's code/modules/admin/verbs/debug.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


// debug.dm:4
rt.def("/client/proc/Debug2", function Debug2(f: Frame) {
	if (!check_rights(32)) {
		return f.dot;
	}
	if (GLOB.Debug2) {
		GLOB.Debug2 = 0;
		message_admins(`${key_name(this)} toggled debugging off.`);
		log_admin(`${key_name(this)} toggled debugging off.`);
	} else {
		GLOB.Debug2 = 1;
		message_admins(`${key_name(this)} toggled debugging on.`);
		log_admin(`${key_name(this)} toggled debugging on.`);
	}
	return f.dot;
}, false, { verb: { name: "Debug-Game", category: "Debug" } });

// debug.dm:34
rt.def("/client/proc/callproc", function* callproc(f: Frame) {
	let target: Value = null, returnval: Value = null, value: Value = null, procname: Value = null, procpath: Value = null, lst: Value = null, msg: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	if (!check_rights(32)) {
		return f.dot;
	}
	let targetselected: Value = 0;
	const subject = (yield* alert("Proc owned by something?", null, "Yes", "No"));
	if (subject === "Yes") {
		targetselected = 1;
		if (!rt.index((value = (yield* this.vv_get_value({ default_class: "Atom Reference", classes: list("Atom Reference", "Datum Reference", "Mob Reference", "Client") }))), "class") || !rt.at(value, "value")) {
			return f.dot;
		}
		target = rt.at(value, "value");
	} else if (subject === "No") {
		target = null;
		targetselected = 0;
	}
	if (!(procname = (yield* g.op(f, "Prompt", [3], [null, null, "Path:", "Proc path, eg: /proc/fake_blood", null])))) {
		return f.dot;
	}
	let testname: Value = procname;
	if (targetselected) {
		if (findtext(procname, "/proc/")) {
			testname = replacetext(procname, "/proc/", "");
		} else if (findtext(procname, "/proc")) {
			testname = replacetext(procname, "/proc", "");
		} else if (findtext(procname, "proc/")) {
			testname = replacetext(procname, "proc/", "");
		}
		testname = replacetext(testname, "()", "");
	}
	if (targetselected && !hascall(target, testname)) {
		to_chat(f.usr, `<font color='red'>Error: callproc(): type ${target.type} has no proc named ${procname}.</font>`);
		return f.dot;
	} else if (!(procpath = text2path(procname))) {
		to_chat(f.usr, `<font color='red'>Error: callproc(): proc ${procname} does not exist. (Did you forget the /proc/ part?)</font>`);
		return f.dot;
	}
	if (!(lst = (yield* this.get_callproc_args()))) {
		return f.dot;
	}
	if (targetselected) {
		if (!target) {
			to_chat(f.usr, "<font color='red'>Error: callproc(): owner of proc no longer exists.</font>");
			return f.dot;
		}
		$0 = key_name(this);
		$1 = target;
		$2 = procname;
		if (rt.len(f, lst)) {
			$3 = `the arguments ${list2params(lst)}`;
		} else {
			$3 = "no arguments";
		}
		log_admin((msg = `${$0} called ${$1}'s ${$2}() with ${$3}.`));
		message_admins(msg);
		admin_ticket_log(target, msg);
		returnval = (yield* WrapAdminProcCall(target, procname, lst));
	} else {
		log_admin(`${key_name(this)} called ${procname}() with ${rt.len(f, lst) ? `the arguments ${list2params(lst)}` : "no arguments"}.`);
		message_admins(`${key_name(this)} called ${procname}() with ${rt.len(f, lst) ? `the arguments ${list2params(lst)}` : "no arguments"}.`);
		returnval = (yield* WrapAdminProcCall("some_magic_bullshit", procname, lst));
	}
	f.dot = this.get_callproc_returnval(returnval, procname);
	if (f.dot) {
		to_chat(f.usr, f.dot);
	}
	return f.dot;
}, true, { waitfor: false, verb: { name: "Advanced ProcCall", category: "Debug" } });

// debug.dm:99
rt.def("/datum/controller/global_vars/proc/InitGlobalAdminProcCaller", function InitGlobalAdminProcCaller(f: Frame) {
	GLOB.AdminProcCaller = null;
	this.gvars_datum_init_order += "AdminProcCaller";
	return f.dot;
});

// debug.dm:100
rt.def("/datum/controller/global_vars/proc/InitGlobalAdminProcCaller", function InitGlobalAdminProcCaller(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "AdminProcCaller";
	return f.dot;
});

// debug.dm:101
rt.def("/datum/controller/global_vars/proc/InitGlobalAdminProcCallCount", function InitGlobalAdminProcCallCount(f: Frame) {
	GLOB.AdminProcCallCount = 0;
	this.gvars_datum_init_order += "AdminProcCallCount";
	return f.dot;
});

// debug.dm:102
rt.def("/datum/controller/global_vars/proc/InitGlobalAdminProcCallCount", function InitGlobalAdminProcCallCount(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "AdminProcCallCount";
	return f.dot;
});

// debug.dm:105
rt.def("/proc/WrapAdminProcCall", function* WrapAdminProcCall(f: Frame, target: Value, procname: Value, _arguments: Value) {
	let current_caller: Value = GLOB.AdminProcCaller;
	let ckey: Value = f.usr.client.ckey;
	if (current_caller && current_caller != ckey) {
		to_chat(f.usr, "<span class='adminnotice'>Another set of admin called procs are still running, your proc will be run after theirs finish.</span>");
		while (GLOB.AdminProcCaller) {
			yield* stoplag();
		}
		to_chat(f.usr, "<span class='adminnotice'>Running your proc</span>");
	}
	GLOB.AdminProcCaller = ckey;
	++GLOB.AdminProcCallCount;
	f.dot = (yield* rt.world().WrapAdminProcCall(target, procname, _arguments));
	if (rt.incGl("AdminProcCallCount", -1, false) != 0) return f.dot;
	GLOB.AdminProcCaller = null;
	return f.dot;
}, true);

// debug.dm:119
rt.def("/world/proc/WrapAdminProcCall", function* WrapAdminProcCall(f: Frame, target: Value, procname: Value, _arguments: Value) {
	if (target == "some_magic_bullshit") {
		return (yield* g.callDyn(f, procname, undefined, [_arguments], rt.Args.List));
	}
	return (yield* g.callDyn(f, target, procname, [_arguments], rt.Args.List));
}, true);

// debug.dm:136
rt.def("/client/proc/callproc_datum", function* callproc_datum(f: Frame, A: Value) {
	let procname: Value = null, lst: Value = null, msg: Value = null, returnval: Value = null;
	let $3: any;
	if (!check_rights(32)) {
		return f.dot;
	}
	if (!(procname = (yield* g.op(f, "Prompt", [3], [null, null, "Proc:", "Proc name, eg: fake_blood", null])))) {
		return f.dot;
	}
	if (!hascall(A, procname)) {
		to_chat(f.usr, `<font color='red'>Error: callproc_datum(): type ${A.type} has no proc named ${procname}.</font>`);
		return f.dot;
	}
	if (!(lst = (yield* this.get_callproc_args()))) {
		return f.dot;
	}
	if (!A || !IsValidSrc(A)) {
		to_chat(f.usr, "<span class='warning'>Error: callproc_datum(): owner of proc no longer exists.</span>");
		return f.dot;
	}
	let $0: any = key_name(this);
	let $1: any = A;
	let $2: any = procname;
	if (rt.len(f, lst)) {
		$3 = `the arguments ${list2params(lst)}`;
	} else {
		$3 = "no arguments";
	}
	log_admin(`${$0} called ${$1}'s ${$2}() with ${$3}.`);
	$0 = key_name(this);
	$1 = A;
	$2 = procname;
	if (rt.len(f, lst)) {
		$3 = `the arguments ${list2params(lst)}`;
	} else {
		$3 = "no arguments";
	}
	message_admins((msg = `${$0} called ${$1}'s ${$2}() with ${$3}.`));
	admin_ticket_log(A, msg);
	f.dot = this.get_callproc_returnval((returnval = (yield* WrapAdminProcCall(A, procname, lst))), procname);
	if (!f.dot) return f.dot;
	to_chat(f.usr, f.dot);
	return f.dot;
}, true, { waitfor: false, verb: { name: "Atom ProcCall", category: "Debug" }, argTypes: [{ type: 157, path: "/datum" }] });

// debug.dm:166
rt.def("/client/proc/get_callproc_args", function* get_callproc_args(f: Frame) {
	let argnum: Value = null, named_arg: Value = null, value: Value = null;
	let $t: any;
	if ((argnum = (yield* g.op(f, "Prompt", [33], [null, 0, "Number:", "Number of arguments", null]))) === null) {
		return f.dot;
	}
	f.dot = list();
	let named_args: Value = list();
	while (($t = argnum, argnum = rt.inc($t, -1), $t)) {
		named_arg = (yield* g.op(f, "Prompt", [3], [null, null, "Named argument", "Leave blank for positional argument. Positional arguments will be considered as if they were added first.", null]));
		if (!rt.index((value = (yield* this.vv_get_value({ restricted_classes: list("Restore to Default") }))), "class")) {
			return f.dot;
		}
		if (named_arg) {
			rt.setAt(named_args, named_arg, rt.at(value, "value"));
		} else {
			f.dot += rt.at(value, "value");
		}
	}
	if (!rt.length(named_args)) return f.dot;
	f.dot += named_args;
	return f.dot;
}, true);

// debug.dm:185
rt.def("/client/proc/get_callproc_returnval", function get_callproc_returnval(f: Frame, returnval: Value, procname: Value) {
	let returnedlist: Value = null, assoc_check: Value = null, key: Value = null, elem: Value = null;
	let $e: any;
	f.dot = "";
	if (rt.istype(returnval, T("/list"))) {
		returnedlist = returnval;
		f.dot = "<font color='blue'>";
		if (rt.len(f, returnedlist)) {
			if (istext((assoc_check = rt.index(returnedlist, 1))) && rt.index(returnedlist, assoc_check) !== null) {
				f.dot += `${procname} returned an associative list:`;
				for (key of each(returnedlist)) {
					f.dot += `\n${key} = ${rt.index(returnedlist, key)}`;
				}
			} else {
				f.dot += `${procname} returned a list:`;
				for (elem of each(returnedlist)) {
					f.dot += `\n${elem}`;
				}
			}
		} else {
			f.dot = `${procname} returned an empty list`;
		}
		f.dot += "</font>";
	} else {
		f.dot = `<font color='blue'>${procname} returned: ${returnval !== null ? returnval : "null"}</font>`;
	}
	return f.dot;
});

// debug.dm:211
rt.def("/client/proc/Cell", function Cell(f: Frame) {
	let _T: Value = null, id: Value = null;
	if (!this.mob) {
		return f.dot;
	}
	if (!isturf((_T = this.mob.loc))) {
		return f.dot;
	}
	let env: Value = _T.return_air();
	let env_gases: Value = env.gases;
	let t: Value = "";
	for (id of each(env_gases)) {
		if (rt.isIn(f, id, (GLOB.hardcoded_gases || rt.index(rt.index(env_gases, id), 1)))) {
			t += `${rt.index(rt.index(rt.index(env_gases, id), 3), 2)} : ${rt.index(rt.index(env_gases, id), 1)}\n`;
		}
	}
	to_chat(f.usr, t);
	return f.dot;
}, false, { verb: { name: "Air Status in Location", category: "Debug" } });

// debug.dm:233
rt.def("/client/proc/cmd_admin_robotize", function* cmd_admin_robotize(f: Frame, M: Value) {
	let H: Value = null;
	if (!GLOB.SSticker.HasRoundStarted()) {
		yield* alert("Wait until the game starts");
		return f.dot;
	}
	if (rt.istype(M, T("/mob/living/carbon/human"))) {
		log_admin(`${key_name(this)} has robotized ${M.key}.`);
		H = M;
		rt.spawnTail(f, 0, "/client/proc/cmd_admin_robotize: spawn at modules/admin/verbs/debug.dm:239", M, H);
	} else {
		yield* alert("Invalid mob");
	}
	return f.dot;
}, true, { verb: { name: "Make Robot", category: "Fun" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// a spawn(0) body of /client/proc/cmd_admin_robotize, a named tail so a world snapshot can hold it while it waits.
rt.tail("/client/proc/cmd_admin_robotize: spawn at modules/admin/verbs/debug.dm:239", function* (f: Frame, M: Value, H: Value) {
	yield* H.Robotize();
	return null;
});

// debug.dm:249
rt.def("/client/proc/cmd_admin_blobize", function* cmd_admin_blobize(f: Frame, M: Value) {
	let H: Value = null, B: Value = null;
	if (!GLOB.SSticker.HasRoundStarted()) {
		yield* alert("Wait until the game starts");
		return f.dot;
	}
	if (rt.istype(M, T("/mob/living/carbon/human"))) {
		log_admin(`${key_name(this)} has blobized ${M.key}.`);
		H = M;
		rt.spawnTail(f, 0, "/client/proc/cmd_admin_blobize: spawn at modules/admin/verbs/debug.dm:255", M, H, B);
	} else {
		yield* alert("Invalid mob");
	}
	return f.dot;
}, true, { verb: { name: "Make Blob", category: "Fun" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// a spawn(0) body of /client/proc/cmd_admin_blobize, a named tail so a world snapshot can hold it while it waits.
rt.tail("/client/proc/cmd_admin_blobize: spawn at modules/admin/verbs/debug.dm:255", function* (f: Frame, M: Value, H: Value, B: Value) {
	yield* (B = (yield* H.become_overmind(0))).place_blob_core(B.base_point_rate, -1);
	return null;
});

// debug.dm:267
rt.def("/client/proc/cmd_admin_animalize", function* cmd_admin_animalize(f: Frame, M: Value) {
	if (!GLOB.SSticker.HasRoundStarted()) {
		yield* alert("Wait until the game starts");
		return f.dot;
	}
	if (!M) {
		yield* alert("That mob doesn't seem to exist, close the panel and try again.");
		return f.dot;
	}
	if (rt.istype(M, T("/mob/dead/new_player"))) {
		yield* alert("The mob must not be a new_player.");
		return f.dot;
	}
	log_admin(`${key_name(this)} has animalized ${M.key}.`);
	rt.spawnTail(f, 0, "/client/proc/cmd_admin_animalize: spawn at modules/admin/verbs/debug.dm:280", M);
	return f.dot;
}, true, { verb: { name: "Make Simple Animal", category: "Fun" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// a spawn(0) body of /client/proc/cmd_admin_animalize, a named tail so a world snapshot can hold it while it waits.
rt.tail("/client/proc/cmd_admin_animalize: spawn at modules/admin/verbs/debug.dm:280", function* (f: Frame, M: Value) {
	yield* M.Animalize();
	return null;
});

// debug.dm:289
rt.def("/client/proc/makepAI", function* makepAI(f: Frame, _T: Value) {
	let C: Value = null, choice: Value = null, confirm: Value = null, pai: Value = null, candidate: Value = null;
	let available: Value = list();
	for (C of each(GLOB.mob_list, T("/mob"))) {
		if (C.key) {
			available.Add(C);
		}
	}
	if (!(choice = (yield* g.op(f, "Prompt", [0], [null, null, "Spawn pAI", "Choose a player to play the pAI", available])))) {
		return 0;
	}
	if (!rt.istype(choice, T("/mob/dead/observer"))) {
		if ((confirm = (yield* g.op(f, "Prompt", [0], [null, "No", "Spawn pAI Confirmation", `${choice.key} isn't ghosting right now. Are you sure you want to yank him out of them out of their body and place them in this pAI?`, list("Yes", "No")]))) != "Yes") {
			return 0;
		}
	}
	let card: Value = (yield* new_(T("/obj/item/device/paicard"), _T));
	(pai = (yield* new_(T("/mob/living/silicon/pai"), card))).name = (yield* g.op(f, "Prompt", [2], ["Personal AI", "pAI Name", "Enter your pAI name:", choice, null]));
	pai.real_name = pai.name;
	pai.key = choice.key;
	card.setPersonality(pai);
	for (candidate of each(GLOB.SSpai.candidates, T("/datum/paiCandidate"))) {
		if (candidate.key == choice.key) {
			yield* GLOB.SSpai.candidates.Remove(candidate);
		}
	}
	return f.dot;
}, true, { verb: { name: "Make pAI", category: "Fun", desc: "Specify a location to spawn a pAI device, then specify a key to play that pAI" }, argTypes: [{ path: "/turf", source: "?" }] });

// debug.dm:315
rt.def("/client/proc/cmd_admin_alienize", function* cmd_admin_alienize(f: Frame, M: Value) {
	if (!GLOB.SSticker.HasRoundStarted()) {
		yield* alert("Wait until the game starts");
		return f.dot;
	}
	if (rt.istype(M, T("/mob/living/carbon/human"))) {
		log_admin(`${key_name(this)} has alienized ${M.key}.`);
		rt.spawnTail(f, 0, "/client/proc/cmd_admin_alienize: spawn at modules/admin/verbs/debug.dm:320", M);
		log_admin(`${key_name(f.usr)} made ${key_name(M)} into an alien.`);
		message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} made ${key_name(M)} into an alien.</span>`);
	} else {
		yield* alert("Invalid mob");
	}
	return f.dot;
}, true, { verb: { name: "Make Alien", category: "Fun" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// a spawn(0) body of /client/proc/cmd_admin_alienize, a named tail so a world snapshot can hold it while it waits.
rt.tail("/client/proc/cmd_admin_alienize: spawn at modules/admin/verbs/debug.dm:320", function* (f: Frame, M: Value) {
	yield* M.Alienize();
	return null;
});

// debug.dm:332
rt.def("/client/proc/cmd_admin_slimeize", function* cmd_admin_slimeize(f: Frame, M: Value) {
	if (!GLOB.SSticker.HasRoundStarted()) {
		yield* alert("Wait until the game starts");
		return f.dot;
	}
	if (rt.istype(M, T("/mob/living/carbon/human"))) {
		log_admin(`${key_name(this)} has slimeized ${M.key}.`);
		rt.spawnTail(f, 0, "/client/proc/cmd_admin_slimeize: spawn at modules/admin/verbs/debug.dm:337", M);
		log_admin(`${key_name(f.usr)} made ${key_name(M)} into a slime.`);
		message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} made ${key_name(M)} into a slime.</span>`);
	} else {
		yield* alert("Invalid mob");
	}
	return f.dot;
}, true, { verb: { name: "Make slime", category: "Fun" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// a spawn(0) body of /client/proc/cmd_admin_slimeize, a named tail so a world snapshot can hold it while it waits.
rt.tail("/client/proc/cmd_admin_slimeize: spawn at modules/admin/verbs/debug.dm:337", function* (f: Frame, M: Value) {
	yield* M.slimeize();
	return null;
});

// debug.dm:346
rt.def("/proc/make_types_fancy", function make_types_fancy(f: Frame, types: Value) {
	let type: Value = null, typename: Value = null, tn: Value = null;
	if (ispath(types)) {
		types = list(types);
	}
	f.dot = list();
	for (type of each(types)) {
		typename = `${type}`;
		tn = null;
		for (tn of each(GLOB.TYPES_SHORTCUTS)) {
			if (copytext(typename, 1, rt.length(`${tn}/`) + 1) == `${tn}/`) {
				typename = rt.index(GLOB.TYPES_SHORTCUTS, tn) + copytext(typename, rt.length(`${tn}/`));
				break;
			}
		}
		rt.setAt(f.dot, typename, type);
	}
	return f.dot;
});

// debug.dm:386
rt.def("/proc/get_fancy_list_of_atom_types", function get_fancy_list_of_atom_types(f: Frame) {
	if (!GLOB.pre_generated_list) {
		GLOB.pre_generated_list = make_types_fancy(typesof(T("/atom")));
	}
	return GLOB.pre_generated_list;
});

// debug.dm:393
rt.def("/proc/get_fancy_list_of_datum_types", function* get_fancy_list_of_datum_types(f: Frame) {
	if (!rt.gl("pre_generated_list#2")) {
		rt.setGl("pre_generated_list#2", make_types_fancy((yield* sortList(typesof(T("/datum")) - typesof(T("/atom"))))));
	}
	return rt.gl("pre_generated_list#2");
}, true);

// debug.dm:399
rt.def("/proc/filter_fancy_list", function filter_fancy_list(f: Frame, L: Value, filter: Value) {
	let key: Value = null, value: Value = null;
	let matches: Value = new_(T("/list"));
	for (key of each(L)) {
		value = rt.index(L, key);
		if (findtext(`${key}`, filter) || findtext(`${value}`, filter)) {
			rt.setAt(matches, key, value);
		}
	}
	return matches;
});

// debug.dm:411
rt.def("/client/proc/cmd_debug_del_all", function* cmd_debug_del_all(f: Frame, object: Value) {
	let hsbitem: Value = null, O: Value = null;
	let matches: Value = get_fancy_list_of_atom_types();
	if (object !== null && object != "") {
		matches = filter_fancy_list(matches, object);
	}
	if (rt.len(f, matches) == 0) {
		return f.dot;
	}
	if (!(hsbitem = (yield* g.op(f, "Prompt", [1], [null, "Delete:", "Choose an object to delete.", f.usr, matches])))) return f.dot;
	hsbitem = rt.index(matches, hsbitem);
	let counter: Value = 0;
	for (O of each(rt.world(), T("/atom"))) {
		if (rt.op(f, "IsType", [], [O, hsbitem])) {
			counter++;
			yield* qdel(O);
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	log_admin(`${key_name(this)} has deleted all (${counter}) instances of ${hsbitem}.`);
	message_admins(`${key_name_admin(this)} has deleted all (${counter}) instances of ${hsbitem}.`, 0);
	return f.dot;
}, true, { verb: { name: "Del-All", category: "Debug" }, argTypes: [{ type: 2 }] });

// debug.dm:434
rt.def("/client/proc/cmd_debug_make_powernets", function* cmd_debug_make_powernets(f: Frame) {
	yield* GLOB.SSmachines.makepowernets();
	log_admin(`${key_name(this)} has remade the powernet. makepowernets() called.`);
	message_admins(`${key_name_admin(this)} has remade the powernets. makepowernets() called.`, 0);
	return f.dot;
}, true, { verb: { name: "Make Powernets", category: "Debug" } });

// debug.dm:443
rt.def("/client/proc/cmd_admin_grantfullaccess", function* cmd_admin_grantfullaccess(f: Frame, M: Value) {
	let H: Value = null, worn: Value = null, id: Value = null;
	if (!GLOB.SSticker.HasRoundStarted()) {
		yield* alert("Wait until the game starts");
		return f.dot;
	}
	if (rt.istype(M, T("/mob/living/carbon/human"))) {
		H = M;
		worn = H.wear_id;
		if (worn) {
			id = worn.GetID();
		}
		if (id) {
			id.icon_state = "gold";
			id.access = get_all_accesses() + get_all_centcom_access() + get_all_syndicate_access();
		} else {
			(id = (yield* new_(T("/obj/item/weapon/card/id/gold"), H.loc))).access = get_all_accesses() + get_all_centcom_access() + get_all_syndicate_access();
			id.registered_name = H.real_name;
			id.assignment = "Captain";
			id.update_label();
			if (worn) {
				if (rt.istype(worn, T("/obj/item/device/pda"))) {
					worn.id = id;
					id.loc = worn;
				} else if (rt.istype(worn, T("/obj/item/weapon/storage/wallet"))) {
					worn.front_id = id;
					id.loc = worn;
					yield* worn.update_icon();
				}
			} else {
				yield* H.equip_to_slot(id, slot_wear_id);
			}
		}
	} else {
		yield* alert("Invalid mob");
	}
	log_admin(`${key_name(this)} has granted ${M.key} full access.`);
	message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} has granted ${M.key} full access.</span>`);
	return f.dot;
}, true, { verb: { name: "Grant Full Access", category: "Admin" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// debug.dm:484
rt.def("/client/proc/cmd_assume_direct_control", function* cmd_assume_direct_control(f: Frame, M: Value) {
	let ghost: Value = null;
	if (M.ckey) {
		if ((yield* alert(`This mob is being controlled by ${M.ckey}. Are you sure you wish to assume control of it? ${M.ckey} will be made a ghost.`, null, "Yes", "No")) != "Yes") {
			return f.dot;
		} else {
			(ghost = (yield* new_(T("/mob/dead/observer"), M, 1))).ckey = M.ckey;
		}
	}
	message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} assumed direct control of ${M}.</span>`);
	log_admin(`${key_name(f.usr)} assumed direct control of ${M}.`);
	let adminmob: Value = this.mob;
	M.ckey = this.ckey;
	if (rt.istype(adminmob, T("/mob/dead/observer"))) {
		yield* qdel(adminmob);
	}
	return f.dot;
}, true, { verb: { name: "Assume direct control", category: "Admin", desc: "Direct intervention" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// debug.dm:502
rt.def("/client/proc/cmd_admin_areatest", function cmd_admin_areatest(f: Frame) {
	let A: Value = null, APC: Value = null, A_9: Value = null, AA: Value = null, RC: Value = null, L: Value = null, LS: Value = null, I: Value = null, C: Value = null, areatype: Value = null;
	let areas_all: Value = list();
	let areas_with_APC: Value = list();
	let areas_with_air_alarm: Value = list();
	let areas_with_RC: Value = list();
	let areas_with_light: Value = list();
	let areas_with_LS: Value = list();
	let areas_with_intercom: Value = list();
	let areas_with_camera: Value = list();
	for (A of each(rt.world(), T("/area"))) {
		if (!rt.isIn(f, A.type, areas_all)) {
			areas_all.Add(A.type);
		}
	}
	for (APC of each(GLOB.apcs_list, T("/obj/machinery/power/apc"))) {
		if (!rt.isIn(f, (A_9 = get_area(APC)).type, areas_with_APC)) {
			areas_with_APC.Add(A_9.type);
		}
	}
	for (AA of each(GLOB.machines, T("/obj/machinery/airalarm"))) {
		if (!rt.isIn(f, (A_9 = get_area(AA)).type, areas_with_air_alarm)) {
			areas_with_air_alarm.Add(A_9.type);
		}
	}
	for (RC of each(GLOB.machines, T("/obj/machinery/requests_console"))) {
		if (!rt.isIn(f, (A_9 = get_area(RC)).type, areas_with_RC)) {
			areas_with_RC.Add(A_9.type);
		}
	}
	for (L of each(GLOB.machines, T("/obj/machinery/light"))) {
		if (!rt.isIn(f, (A_9 = get_area(L)).type, areas_with_light)) {
			areas_with_light.Add(A_9.type);
		}
	}
	for (LS of each(GLOB.machines, T("/obj/machinery/light_switch"))) {
		if (!rt.isIn(f, (A_9 = get_area(LS)).type, areas_with_LS)) {
			areas_with_LS.Add(A_9.type);
		}
	}
	for (I of each(GLOB.machines, T("/obj/item/device/radio/intercom"))) {
		if (!rt.isIn(f, (A_9 = get_area(I)).type, areas_with_intercom)) {
			areas_with_intercom.Add(A_9.type);
		}
	}
	for (C of each(GLOB.machines, T("/obj/machinery/camera"))) {
		if (!rt.isIn(f, (A_9 = get_area(C)).type, areas_with_camera)) {
			areas_with_camera.Add(A_9.type);
		}
	}
	let areas_without_APC: Value = areas_all - areas_with_APC;
	let areas_without_air_alarm: Value = areas_all - areas_with_air_alarm;
	let areas_without_RC: Value = areas_all - areas_with_RC;
	let areas_without_light: Value = areas_all - areas_with_light;
	let areas_without_LS: Value = areas_all - areas_with_LS;
	let areas_without_intercom: Value = areas_all - areas_with_intercom;
	let areas_without_camera: Value = areas_all - areas_with_camera;
	to_chat(rt.world(), "<b>AREAS WITHOUT AN APC:</b>");
	for (areatype of each(areas_without_APC)) {
		to_chat(rt.world(), `* ${areatype}`);
	}
	to_chat(rt.world(), "<b>AREAS WITHOUT AN AIR ALARM:</b>");
	areatype = null;
	for (areatype of each(areas_without_air_alarm)) {
		to_chat(rt.world(), `* ${areatype}`);
	}
	to_chat(rt.world(), "<b>AREAS WITHOUT A REQUEST CONSOLE:</b>");
	areatype = null;
	for (areatype of each(areas_without_RC)) {
		to_chat(rt.world(), `* ${areatype}`);
	}
	to_chat(rt.world(), "<b>AREAS WITHOUT ANY LIGHTS:</b>");
	areatype = null;
	for (areatype of each(areas_without_light)) {
		to_chat(rt.world(), `* ${areatype}`);
	}
	to_chat(rt.world(), "<b>AREAS WITHOUT A LIGHT SWITCH:</b>");
	areatype = null;
	for (areatype of each(areas_without_LS)) {
		to_chat(rt.world(), `* ${areatype}`);
	}
	to_chat(rt.world(), "<b>AREAS WITHOUT ANY INTERCOMS:</b>");
	areatype = null;
	for (areatype of each(areas_without_intercom)) {
		to_chat(rt.world(), `* ${areatype}`);
	}
	to_chat(rt.world(), "<b>AREAS WITHOUT ANY CAMERAS:</b>");
	areatype = null;
	for (areatype of each(areas_without_camera)) {
		to_chat(rt.world(), `* ${areatype}`);
	}
	return f.dot;
}, false, { verb: { name: "Test areas", category: "Mapping" } });

// debug.dm:589
rt.def("/client/proc/cmd_admin_dress", function* cmd_admin_dress(f: Frame, M: Value) {
	let path: Value = null, O: Value = null, dresscode: Value = null, job_paths: Value = null, job_outfits: Value = null, path_5: Value = null, O_6: Value = null, custom: Value = null, custom_names: Value = null, D: Value = null, selected_name: Value = null, I: Value = null;
	let $e: any;
	if (!rt.istype(M, T("/mob/living/carbon/human"))) {
		yield* alert("Invalid mob");
		return f.dot;
	}
	let outfits: Value = list("Naked", "Custom", "As Job...");
	let paths: Value = typesof(T("/datum/outfit")) - T("/datum/outfit") - typesof(T("/datum/outfit/job"));
	for (path of each(paths)) {
		if (rt.initial(f, (O = path), "can_be_admin_equipped")) {
			rt.setAt(outfits, rt.initial(f, O, "name"), path);
		}
	}
	if ((dresscode = (yield* g.op(f, "Prompt", [1], [null, null, "Robust quick dress shop", `Select dress for ${M}`, outfits]))) === null) {
		return f.dot;
	}
	if (rt.index(outfits, dresscode)) {
		dresscode = rt.index(outfits, dresscode);
	}
	if (dresscode == "As Job...") {
		job_paths = typesof(T("/datum/outfit/job")) - T("/datum/outfit/job");
		job_outfits = list();
		for (path_5 of each(job_paths)) {
			if (rt.initial(f, (O_6 = path_5), "can_be_admin_equipped")) {
				rt.setAt(job_outfits, rt.initial(f, O_6, "name"), path_5);
			}
		}
		dresscode = (yield* g.op(f, "Prompt", [1], [null, null, "Robust quick dress shop", "Select job equipment", job_outfits]));
		if ((dresscode = rt.index(job_outfits, dresscode)) === null) {
			return f.dot;
		}
	}
	if (dresscode == "Custom") {
		custom_names = list();
		for (D of each(GLOB.custom_outfits, T("/datum/outfit"))) {
			rt.setAt(custom_names, D.name, D);
		}
		selected_name = (yield* g.op(f, "Prompt", [1], [null, null, "Robust quick dress shop", "Select outfit", custom_names]));
		if ((custom = rt.index(custom_names, selected_name)) === null) {
			return f.dot;
		}
	}
	for (I of each(M.get_equipped_items(), T("/obj/item"))) {
		yield* qdel(I);
	}
	if (dresscode === "Naked") {
	} else if (dresscode === "Custom") {
		yield* M.equipOutfit(custom);
	} else {
		yield* M.equipOutfit(dresscode);
	}
	yield* M.regenerate_icons();
	log_admin(`${key_name(f.usr)} changed the equipment of ${key_name(M)} to ${dresscode}.`);
	message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} changed the equipment of ${key_name_admin(M)} to ${dresscode}.</span>`);
	return f.dot;
}, true, { verb: { name: "Select equipment", category: "Fun" }, argTypes: [{ type: 8, path: "/mob/living/carbon/human", source: "?" }] });

// debug.dm:657
rt.def("/client/proc/startSinglo", function* startSinglo(f: Frame) {
	let E: Value = null, F: Value = null, G: Value = null, S: Value = null, Rad: Value = null, Plasma: Value = null, SMES: Value = null;
	if ((yield* alert("Are you sure? This will start up the engine. Should only be used during debug!", null, "Yes", "No")) != "Yes") {
		return f.dot;
	}
	for (E of each(GLOB.machines, T("/obj/machinery/power/emitter"))) {
		if (E.anchored) {
			E.active = 1;
		}
	}
	for (F of each(GLOB.machines, T("/obj/machinery/field/generator"))) {
		if (F.active == 0) {
			F.active = 1;
			F.state = 2;
			F.power = 250;
			F.anchored = 1;
			F.warming_up = 3;
			F.start_fields();
			yield* F.update_icon();
		}
	}
	rt.spawnTail(f, 30, "/client/proc/startSinglo: spawn at modules/admin/verbs/debug.dm:674", E, F, G, S, Rad, Plasma, SMES);
	for (Rad of each(GLOB.machines, T("/obj/machinery/power/rad_collector"))) {
		if (Rad.anchored) {
			if (!Rad.loaded_tank) {
				(Plasma = (yield* new_(T("/obj/item/weapon/tank/internals/plasma"), Rad))).air_contents.assert_gas("plasma");
				rt.setAt(rt.index(Plasma.air_contents.gases, "plasma"), 1, 70);
				Rad.drainratio = 0;
				Rad.loaded_tank = Plasma;
				Plasma.loc = Rad;
			}
			if (!Rad.active) {
				yield* Rad.toggle_power();
			}
		}
	}
	for (SMES of each(GLOB.machines, T("/obj/machinery/power/smes"))) {
		if (SMES.anchored) {
			SMES.input_attempt = 1;
		}
	}
	return f.dot;
}, true, { verb: { name: "Start Singularity", category: "Debug", desc: "Sets up the singularity and all machines to get power flowing through the station" } });

// a spawn(30) body of /client/proc/startSinglo, a named tail so a world snapshot can hold it while it waits.
rt.tail("/client/proc/startSinglo: spawn at modules/admin/verbs/debug.dm:674", function* (f: Frame, E: Value, F: Value, G: Value, S: Value, Rad: Value, Plasma: Value, SMES: Value) {
	G = null;
	for (G of each(GLOB.machines, T("/obj/machinery/the_singularitygen"))) {
		if (G.anchored) {
			(S = (yield* new_(T("/obj/singularity"), rt.getStep(f, G, 0), 50))).energy = 1750;
			S.current_size = 7;
			S.icon = rt.rsc("icons/effects/224x224.dmi");
			S.icon_state = "singularity_s7";
			S.pixel_x = -96;
			S.pixel_y = -96;
			S.grav_pull = 0;
			S.dissipate = 0;
		}
	}
	return null;
});

// debug.dm:714
rt.def("/client/proc/cmd_debug_mob_lists", function* cmd_debug_mob_lists(f: Frame) {
	const subject = (yield* g.op(f, "Prompt", [0], [null, null, null, "Which list?", list("Players", "Admins", "Mobs", "Living Mobs", "Dead Mobs", "Clients", "Joined Clients")]));
	if (subject === "Players") {
		to_chat(f.usr, jointext(GLOB.player_list, ","));
	} else if (subject === "Admins") {
		to_chat(f.usr, jointext(GLOB.admins, ","));
	} else if (subject === "Mobs") {
		to_chat(f.usr, jointext(GLOB.mob_list, ","));
	} else if (subject === "Living Mobs") {
		to_chat(f.usr, jointext(GLOB.living_mob_list, ","));
	} else if (subject === "Dead Mobs") {
		to_chat(f.usr, jointext(GLOB.dead_mob_list, ","));
	} else if (subject === "Clients") {
		to_chat(f.usr, jointext(GLOB.clients, ","));
	} else if (subject === "Joined Clients") {
		to_chat(f.usr, jointext(GLOB.joined_player_list, ","));
	}
	return f.dot;
}, true, { verb: { name: "Debug Mob Lists", category: "Debug", desc: "For when you just gotta know" } });

// debug.dm:735
rt.def("/client/proc/cmd_display_del_log", function cmd_display_del_log(f: Frame) {
	let path: Value = null;
	let dat: Value = "<B>List of things that failed to GC this round</B><BR><BR>";
	for (path of each(GLOB.SSgarbage.didntgc)) {
		dat += `${path} - ${rt.index(GLOB.SSgarbage.didntgc, path)} times<BR>`;
	}
	dat += "<B>List of paths that did not return a qdel hint in Destroy()</B><BR><BR>";
	path = null;
	for (path of each(GLOB.SSgarbage.noqdelhint)) {
		dat += `${path}<BR>`;
	}
	dat += "<B>List of paths that slept in Destroy()</B><BR><BR>";
	path = null;
	for (path of each(GLOB.SSgarbage.sleptDestroy)) {
		dat += `${path}<BR>`;
	}
	rt.op(f, "Browse", [], [f.usr, dat, "window=dellog"], false);
	return f.dot;
}, false, { verb: { name: "Display del() Log", category: "Debug", desc: "Displays a list of things that have failed to GC this round" } });

// debug.dm:754
rt.def("/client/proc/cmd_display_init_log", function cmd_display_init_log(f: Frame) {
	rt.op(f, "Browse", [], [f.usr, replacetext(GLOB.SSatoms.InitLog(), "\n", "<br>"), "window=initlog"], false);
	return f.dot;
}, false, { verb: { name: "Display Initialzie() Log", category: "Debug", desc: "Displays a list of things that didn't handle Initialize() properly" } });

// debug.dm:761
rt.def("/client/proc/debug_huds", function* debug_huds(f: Frame, i: Value) {
	if (!this.holder) {
		return f.dot;
	}
	yield* this.debug_variables(rt.index(GLOB.huds, i));
	return f.dot;
}, true, { verb: { name: "Debug HUDs", category: "Debug", desc: "Debug the data or antag HUDs" }, argTypes: [{ type: 32 }] });

// debug.dm:769
rt.def("/client/proc/jump_to_ruin", function* jump_to_ruin(f: Frame) {
	let i: Value = null, ruin_landmark: Value = null, template: Value = null, count: Value = null, name: Value = null, original_name: Value = null, landmark: Value = null;
	if (!this.holder) {
		return f.dot;
	}
	let names: Value = list();
	for (i of each(GLOB.ruin_landmarks)) {
		ruin_landmark = i;
		template = ruin_landmark.ruin_template;
		count = 1;
		name = template.name;
		original_name = name;
		while (rt.isIn(f, name, names)) {
			count++;
			name = `${original_name} (${count})`;
		}
		rt.setAt(names, name, ruin_landmark);
	}
	let ruinname: Value = (yield* g.op(f, "Prompt", [1], [null, null, "Jump to Ruin", "Select ruin", names]));
	if (!rt.istype((landmark = rt.index(names, ruinname)), T("/obj/effect/landmark/ruin"))) return f.dot;
	template = landmark.ruin_template;
	yield* f.usr.forceMove(rt.getStep(f, landmark, 0));
	to_chat(f.usr, `<span class='name'>${template.name}</span>`);
	to_chat(f.usr, `<span class='italics'>${template.description}</span>`);
	return f.dot;
}, true, { verb: { name: "Jump to Ruin", category: "Debug", desc: "Displays a list of all placed ruins to teleport to." } });

// debug.dm:801
rt.def("/client/proc/clear_dynamic_transit", function clear_dynamic_transit(f: Frame) {
	if (!this.holder) {
		return f.dot;
	}
	GLOB.SSshuttle.clear_transit = 1;
	message_admins(`<span class='adminnotice'>${key_name_admin(this)} cleared dynamic transit space.</span>`);
	log_admin(`${key_name(this)} cleared dynamic transit space.`);
	return f.dot;
}, false, { verb: { name: "Clear Dynamic Transit", category: "Debug", desc: "Deallocates all transit space, restoring it to round start conditions." } });

// debug.dm:827
rt.def("/client/proc/view_runtimes", function* view_runtimes(f: Frame) {
	if (!this.holder) {
		return f.dot;
	}
	yield* GLOB.error_cache.show_to(this);
	return f.dot;
}, true, { verb: { name: "View Runtimes", category: "Debug", desc: "Open the runtime Viewer" } });

// debug.dm:836
rt.def("/client/proc/pump_random_event", function pump_random_event(f: Frame) {
	if (!this.holder) {
		return f.dot;
	}
	GLOB.SSevents.scheduled = rt.worldTime(f);
	message_admins(`<span class='adminnotice'>${key_name_admin(this)} pumped a random event.</span>`);
	log_admin(`${key_name(this)} pumped a random event.`);
	return f.dot;
}, false, { verb: { name: "Pump Random Event", category: "Debug", desc: "Schedules the event subsystem to fire a new random event immediately. Some events may fire without notification." } });
