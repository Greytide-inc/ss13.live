// From code/modules/admin/verbs/randomverbs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /client/proc/cmd_admin_drop_everything  (code/modules/admin/verbs/randomverbs.dm:4)  may sleep
rt.def("/client/proc/cmd_admin_drop_everything", function* cmd_admin_drop_everything(f: Frame, M: Value) {
	let confirm: Value = null, W: Value = null, msg: Value = null;
	let $e: any;
	f.vars = () => [M, confirm, W, msg, $e];
	if (!truthy(rt.sv(f, "holder"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Only administrators may use this command."]);
		return live(f.dot);
	}
	if (!isEqual((confirm = (yield* g.call(f, P("/proc/alert"), null, [live(f.src), fmt("Make ＀ drop everything?", [live(M)]), "Message", "Yes", "No"]))), "Yes")) {
		return live(f.dot);
	}
	W = null;
	rt.forList(f, 0, live(M), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		W = $e;
		if (!truthy((yield* g.callName(f, live(M), "dropItemToGround", [live(W)])))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(W)]);
			yield* g.callName(f, live(M), "regenerate_icons", []);
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ made ＀ drop everything!", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(M)]))])]);
	yield* g.call(f, P("/proc/message_admins"), null, [(msg = fmt("＀ made ＀ drop everything!", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(M)]))]))]);
	yield* g.call(f, P("/proc/admin_ticket_log"), null, [live(M), live(msg)]);
	return f.dot;
}, true, { verb: { name: "Drop Everything", category: "" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// /client/proc/cmd_admin_subtle_message  (code/modules/admin/verbs/randomverbs.dm:27)  may sleep
rt.def("/client/proc/cmd_admin_subtle_message", function* cmd_admin_subtle_message(f: Frame, M: Value) {
	let msg: Value = null;
	f.vars = () => [M, msg];
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [live(M)])))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "holder"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Only administrators may use this command."]);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has started answering ＀'s prayer.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.src)])), (yield* g.call(f, P("/proc/key_name"), null, [rt.fv(f, "key", live(M)), 0, 0]))])]);
	if (!truthy((msg = (yield* g.op(f, "Prompt", [2], [null, null, fmt("Subtle PM to ＀", [rt.fv(f, "key", live(M))]), "Message:", null]))))) {
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ decided not to answer ＀'s prayer", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.src)])), (yield* g.call(f, P("/proc/key_name"), null, [rt.fv(f, "key", live(M)), 0, 0]))])]);
		return live(f.dot);
	}
	if (truthy(live(f.usr))) {
		if (truthy(rt.fv(f, "client", live(f.usr)))) {
			if (truthy(rt.gv(f, "holder", rt.fv(f, "client", live(f.usr))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<i>You hear a voice in your head... <b>＀</i></b>", [live(msg)])]);
			}
		}
	}
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("SubtlePM: ＀ -> ＀ : ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(M)])), live(msg)])]);
	yield* g.call(f, P("/proc/message_admins"), null, [(msg = fmt("<span class='adminnotice'><b> SubtleMessage: ＀ -> ＀ :</b> ＀</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(M)])), live(msg)]))]);
	yield* g.call(f, P("/proc/admin_ticket_log"), null, [live(M), live(msg)]);
	return f.dot;
}, true, { verb: { name: "Subtle Message", category: "Special Verbs" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// /client/proc/cmd_admin_world_narrate  (code/modules/admin/verbs/randomverbs.dm:54)  may sleep
rt.def("/client/proc/cmd_admin_world_narrate", function* cmd_admin_world_narrate(f: Frame) {
	let msg: Value = null;
	f.vars = () => [msg];
	if (!truthy(rt.sv(f, "holder"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Only administrators may use this command."]);
		return live(f.dot);
	}
	if (!truthy((msg = (yield* g.op(f, "Prompt", [2], [null, null, "Enter the text you wish to appear to everyone:", "Message:", null]))))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("＀", [live(msg)])]);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("GlobalNarrate: ＀ : ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(msg)])]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ Sent a global narrate</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
	return f.dot;
}, true, { verb: { name: "Global Narrate", category: "Special Verbs" } });

// /client/proc/cmd_admin_direct_narrate  (code/modules/admin/verbs/randomverbs.dm:71)  may sleep
rt.def("/client/proc/cmd_admin_direct_narrate", function* cmd_admin_direct_narrate(f: Frame, M: Value) {
	let msg: Value = null;
	f.vars = () => [M, msg];
	if (!truthy(rt.sv(f, "holder"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Only administrators may use this command."]);
		return live(f.dot);
	}
	if (!truthy(live(M))) {
		M = (yield* g.op(f, "Prompt", [1], [null, null, "Active Players", "Direct narrate to whom?", rt.gl("player_list")]));
	}
	if (!truthy(live(M))) {
		return live(f.dot);
	}
	if (!truthy((msg = (yield* g.op(f, "Prompt", [2], [null, null, "Enter the text you wish to appear to your target:", "Message:", null]))))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(M), live(msg)]);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("DirectNarrate: ＀ to (＀/＀): ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.fv(f, "name", live(M)), rt.fv(f, "key", live(M)), live(msg)])]);
	yield* g.call(f, P("/proc/message_admins"), null, [(msg = fmt("<span class='adminnotice'><b> DirectNarrate: ＀ to (＀/＀):</b> ＀<BR></span>", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.fv(f, "name", live(M)), rt.fv(f, "key", live(M)), live(msg)]))]);
	yield* g.call(f, P("/proc/admin_ticket_log"), null, [live(M), live(msg)]);
	return f.dot;
}, true, { verb: { name: "Direct Narrate", category: "Special Verbs" }, argTypes: [{ type: 8, path: "/mob" }] });

// /client/proc/cmd_admin_local_narrate  (code/modules/admin/verbs/randomverbs.dm:97)  may sleep
rt.def("/client/proc/cmd_admin_local_narrate", function* cmd_admin_local_narrate(f: Frame, A: Value) {
	let range: Value = null, msg: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [A, range, msg, M, $e];
	if (!truthy(rt.sv(f, "holder"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Only administrators may use this command."]);
		return live(f.dot);
	}
	if (!truthy(live(A))) {
		return live(f.dot);
	}
	if (!truthy((range = (yield* g.op(f, "Prompt", [32], [null, 7, "Narrate to mobs within how many tiles:", "Range:", null]))))) {
		return live(f.dot);
	}
	if (!truthy((msg = (yield* g.op(f, "Prompt", [2], [null, null, "Enter the text you wish to appear to everyone within view:", "Message:", null]))))) {
		return live(f.dot);
	}
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [live(range), live(A)])), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), live(msg)]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("LocalNarrate: ＀ at ＀＀: ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/get_area"), null, [live(A)])), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(A)), rt.fv(f, "y", live(A)), rt.fv(f, "z", live(A))]), live(msg)])]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'><b> LocalNarrate: ＀ at ＀＀:</b> ＀<BR></span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/get_area"), null, [live(A)])), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(A)), rt.fv(f, "y", live(A)), rt.fv(f, "z", live(A))]), live(msg)])]);
	return f.dot;
}, true, { verb: { name: "Local Narrate", category: "Special Verbs" }, argTypes: [{ path: "/atom" }] });

// /client/proc/cmd_admin_godmode  (code/modules/admin/verbs/randomverbs.dm:118)
rt.def("/client/proc/cmd_admin_godmode", function cmd_admin_godmode(f: Frame, M: Value) {
	let msg: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [msg, $0, $1, $2];
	if (!truthy(rt.sv(f, "holder"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "Only administrators may use this command."]);
		return live(f.dot);
	}
	(rt.modField(f, live(M), "status_flags", 4096, rt.bitXor));
	$0 = live(f.usr);
	if (truthy(rt.bitAnd(rt.fv(f, "status_flags", live(M)), 4096))) {
		$1 = "ON";
	} else {
		$1 = "OFF";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='adminnotice'>Toggled ＀</span>", [$1])]);
	$0 = rt.call(f, P("/proc/key_name"), null, [live(f.usr)]);
	$1 = rt.call(f, P("/proc/key_name"), null, [live(M)]);
	if (truthy(rt.bitAnd(rt.fv(f, "status_flags", live(M)), 4096))) {
		$2 = "On";
	} else {
		$2 = "Off";
	}
	rt.call(f, P("/proc/log_admin"), null, [fmt("＀ has toggled ＀'s nodamage to ＀", [$0, $1, $2])]);
	$0 = rt.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]);
	$1 = rt.call(f, P("/proc/key_name_admin"), null, [live(M)]);
	if (truthy(rt.bitAnd(rt.fv(f, "status_flags", live(M)), 4096))) {
		$2 = "On";
	} else {
		$2 = "Off";
	}
	rt.call(f, P("/proc/message_admins"), null, [(msg = fmt("＀ has toggled ＀'s nodamage to ＀", [$0, $1, $2]))]);
	rt.call(f, P("/proc/admin_ticket_log"), null, [live(M), live(msg)]);
	return f.dot;
}, false, { verb: { name: "Godmode", category: "Special Verbs" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// /proc/cmd_admin_mute  (code/modules/admin/verbs/randomverbs.dm:132)
rt.def("/proc/cmd_admin_mute", function cmd_admin_mute(f: Frame, whom: Value, mute_type: Value, automute: Value) {
	let muteunmute: Value = null, mute_string: Value = null, C: Value = null, _P: Value = null;
	let $0: any;
	f.vars = () => [automute, muteunmute, mute_string, C, _P, $0];
	if (live(automute) === null) {
		automute = 0;
	}
	if (!truthy(live(whom))) {
		return live(f.dot);
	}
	muteunmute = null;
	mute_string = null;
	$0 = live(mute_type);
	if ($0 === 1) {
		mute_string = "IC (say and emote)";
	} else if ($0 === 2) {
		mute_string = "OOC";
	} else if ($0 === 4) {
		mute_string = "pray";
	} else if ($0 === 8) {
		mute_string = "adminhelp, admin PM and ASAY";
	} else if ($0 === 16) {
		mute_string = "deadchat and DSAY";
	} else if ($0 === 31) {
		mute_string = "everything";
	} else {
		return live(f.dot);
	}
	C = null;
	if (truthy((rt.istype(live(whom), T("/client")) ? 1 : 0))) {
		C = live(whom);
	} else {
		if (truthy(rt.call(f, P("/proc/istext"), null, [live(whom)]))) {
			C = rt.index(rt.gl("directory"), live(whom));
		} else {
			return live(f.dot);
		}
	}
	_P = null;
	if (truthy(live(C))) {
		_P = rt.fv(f, "prefs", live(C));
	} else {
		_P = rt.index(rt.gl("preferences_datums"), live(whom));
	}
	if (!truthy(live(_P))) {
		return live(f.dot);
	}
	if (truthy(live(automute))) {
		if (!truthy(rt.fv(f, "automute_on", rt.gl("config")))) {
			return live(f.dot);
		}
	} else {
		if (!truthy(rt.call(f, P("/proc/check_rights"), null, []))) {
			return live(f.dot);
		}
	}
	if (truthy(live(automute))) {
		muteunmute = "auto-muted";
		(rt.modField(f, live(_P), "muted", live(mute_type), rt.bitOr));
		rt.call(f, P("/proc/log_admin"), null, [fmt("SPAM AUTOMUTE: ＀ ＀ from ＀", [live(muteunmute), rt.call(f, P("/proc/key_name"), null, [live(whom)]), live(mute_string)])]);
		rt.call(f, P("/proc/message_admins"), null, [fmt("SPAM AUTOMUTE: ＀ ＀ from ＀.", [live(muteunmute), rt.call(f, P("/proc/key_name_admin"), null, [live(whom)]), live(mute_string)])]);
		if (truthy(live(C))) {
			rt.call(f, P("/proc/to_chat"), null, [live(C), fmt("You have been ＀ from ＀ by the SPAM AUTOMUTE system. Contact an admin.", [live(muteunmute), live(mute_string)])]);
		}
		return live(f.dot);
	}
	if (truthy(rt.bitAnd(rt.fv(f, "muted", live(_P)), live(mute_type)))) {
		muteunmute = "unmuted";
		(rt.modField(f, live(_P), "muted", rt.op(f, "BitNot", [], [live(mute_type)]), rt.bitAnd));
	} else {
		muteunmute = "muted";
		(rt.modField(f, live(_P), "muted", live(mute_type), rt.bitOr));
	}
	rt.call(f, P("/proc/log_admin"), null, [fmt("＀ has ＀ ＀ from ＀", [rt.call(f, P("/proc/key_name"), null, [live(f.usr)]), live(muteunmute), rt.call(f, P("/proc/key_name"), null, [live(whom)]), live(mute_string)])]);
	rt.call(f, P("/proc/message_admins"), null, [fmt("＀ has ＀ ＀ from ＀.", [rt.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]), live(muteunmute), rt.call(f, P("/proc/key_name_admin"), null, [live(whom)]), live(mute_string)])]);
	if (truthy(live(C))) {
		rt.call(f, P("/proc/to_chat"), null, [live(C), fmt("You have been ＀ from ＀ by ＀.", [live(muteunmute), live(mute_string), rt.call(f, P("/proc/key_name"), null, [null, live(f.usr), "include_name", 0], rt.Args.Named)])]);
	}
	return f.dot;
});

// /proc/create_xeno  (code/modules/admin/verbs/randomverbs.dm:209)  may sleep
rt.def("/proc/create_xeno", function* create_xeno(f: Frame, ckey: Value) {
	let candidates: Value = null, M: Value = null, alien_caste: Value = null, spawn_here: Value = null, new_xeno: Value = null, msg: Value = null;
	let $0: any, $e: any;
	f.vars = () => [ckey, candidates, M, alien_caste, spawn_here, new_xeno, msg, $0, $e];
	if (!truthy(live(ckey))) {
		candidates = rt.list();
		M = null;
		rt.forList(f, 0, rt.gl("player_list"), T("/mob"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			if (!isEqual(rt.fv(f, "stat", live(M)), 2)) {
				continue;
			}
			if (!truthy((rt.isIn(f, "xenomorph", rt.gv(f, "be_special", rt.gv(f, "prefs", rt.fv(f, "client", live(M))))) ? 1 : 0))) {
				continue;
			}
			if (truthy((yield* g.callName(f, rt.fv(f, "client", live(M)), "is_afk", [])))) {
				continue;
			}
			if (((truthy(rt.fv(f, "mind", live(M))) && truthy(rt.gv(f, "current", rt.fv(f, "mind", live(M))))) && !isEqual(rt.gv(f, "stat", rt.gv(f, "current", rt.fv(f, "mind", live(M)))), 2))) {
				continue;
			}
			candidates = rt.modify(live(candidates), rt.fv(f, "ckey", live(M)), add);
		}
		rt.endFor(f, 0);
		if (truthy(rt.len(f, live(candidates)))) {
			ckey = (yield* g.op(f, "Prompt", [1], [null, null, "Suitable Candidates", "Pick the player you want to respawn as a xeno.", live(candidates)]));
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<font color='red'>Error: create_xeno(): no suitable candidates.</font>"]);
		}
	}
	if (!truthy((yield* g.call(f, P("/proc/istext"), null, [live(ckey)])))) {
		return 0;
	}
	alien_caste = (yield* g.op(f, "Prompt", [1], [null, "Pick a caste", "Please choose which caste to spawn.", live(f.usr), rt.list("Queen", "Praetorian", "Hunter", "Sentinel", "Drone", "Larva")]));
	if (truthy(rt.len(f, rt.gl("xeno_spawn")))) {
		$0 = rt.op(f, "PickUnweighted", [1], [rt.gl("xeno_spawn")]);
	} else {
		$0 = null;
	}
	spawn_here = $0;
	new_xeno = null;
	$0 = live(alien_caste);
	if ($0 === "Queen") {
		new_xeno = (yield* g.new_(f, T("/mob/living/carbon/alien/humanoid/royal/queen"), [live(spawn_here)]));
	} else if ($0 === "Praetorian") {
		new_xeno = (yield* g.new_(f, T("/mob/living/carbon/alien/humanoid/royal/praetorian"), [live(spawn_here)]));
	} else if ($0 === "Hunter") {
		new_xeno = (yield* g.new_(f, T("/mob/living/carbon/alien/humanoid/hunter"), [live(spawn_here)]));
	} else if ($0 === "Sentinel") {
		new_xeno = (yield* g.new_(f, T("/mob/living/carbon/alien/humanoid/sentinel"), [live(spawn_here)]));
	} else if ($0 === "Drone") {
		new_xeno = (yield* g.new_(f, T("/mob/living/carbon/alien/humanoid/drone"), [live(spawn_here)]));
	} else if ($0 === "Larva") {
		new_xeno = (yield* g.new_(f, T("/mob/living/carbon/alien/larva"), [live(spawn_here)]));
	} else {
		return 0;
	}
	if (!truthy(live(spawn_here))) {
		yield* g.callName(f, rt.gl("SSjob"), "SendToLateJoin", [live(new_xeno), 0]);
	}
	rt.setFv(f, "ckey", live(new_xeno), live(ckey));
	yield* g.call(f, P("/proc/message_admins"), null, [(msg = fmt("<span class='notice'>＀ has spawned ＀ as a filthy xeno ＀.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(ckey), live(alien_caste)]))]);
	yield* g.call(f, P("/proc/admin_ticket_log"), null, [live(new_xeno), live(msg)]);
	return 1;
}, true);

// /client/proc/respawn_character  (code/modules/admin/verbs/randomverbs.dm:264)  may sleep
rt.def("/client/proc/respawn_character", function* respawn_character(f: Frame) {
	let input: Value = null, G_found: Value = null, G: Value = null, _T: Value = null, new_xeno: Value = null, msg: Value = null, new_monkey: Value = null, msg_3: Value = null, new_character: Value = null, record_found: Value = null, id: Value = null, A: Value = null, admin: Value = null, player_key: Value = null, traitordatum: Value = null, synd_spawn: Value = null, ninja_spawn: Value = null, L: Value = null, ninjadatum: Value = null, ninja_spawn_here: Value = null, msg_7: Value = null;
	let $0: any, $e: any;
	f.vars = () => [input, G_found, G, _T, new_xeno, msg, new_monkey, msg_3, new_character, record_found, id, A, admin, player_key, traitordatum, synd_spawn, ninja_spawn, L, ninjadatum, ninja_spawn_here, msg_7, $0, $e];
	if (!truthy(rt.sv(f, "holder"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Only administrators may use this command."]);
		return live(f.dot);
	}
	if (!truthy((input = (yield* g.call(f, P("/proc/ckey"), null, [(yield* g.op(f, "Prompt", [2], ["", "Key", "Please specify which key will be respawned.", live(f.src), null]))]))))) {
		return live(f.dot);
	}
	G_found = null;
	G = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/dead/observer"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		if (isEqual(rt.fv(f, "ckey", live(G)), live(input))) {
			G_found = live(G);
			break;
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(G_found))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<font color='red'>There is no active key like that in the game or the person is not currently a ghost.</font>"]);
		return live(f.dot);
	}
	if ((truthy(rt.fv(f, "mind", live(G_found))) && !truthy(rt.gv(f, "active", rt.fv(f, "mind", live(G_found)))))) {
		if (isEqual(rt.gv(f, "assigned_role", rt.fv(f, "mind", live(G_found))), "Alien")) {
			if (isEqual((yield* g.call(f, P("/proc/alert"), null, ["This character appears to have been an alien. Would you like to respawn them as such?", null, "Yes", "No"])), "Yes")) {
				_T = null;
				if (truthy(rt.len(f, rt.gl("xeno_spawn")))) {
					_T = rt.op(f, "PickUnweighted", [1], [rt.gl("xeno_spawn")]);
				}
				new_xeno = null;
				$0 = rt.gv(f, "special_role", rt.fv(f, "mind", live(G_found)));
				if ($0 === "Hunter") {
					new_xeno = (yield* g.new_(f, T("/mob/living/carbon/alien/humanoid/hunter"), [live(_T)]));
				} else if ($0 === "Sentinel") {
					new_xeno = (yield* g.new_(f, T("/mob/living/carbon/alien/humanoid/sentinel"), [live(_T)]));
				} else if ($0 === "Drone") {
					new_xeno = (yield* g.new_(f, T("/mob/living/carbon/alien/humanoid/drone"), [live(_T)]));
				} else if ($0 === "Praetorian") {
					new_xeno = (yield* g.new_(f, T("/mob/living/carbon/alien/humanoid/royal/praetorian"), [live(_T)]));
				} else if ($0 === "Queen") {
					new_xeno = (yield* g.new_(f, T("/mob/living/carbon/alien/humanoid/royal/queen"), [live(_T)]));
				} else {
					yield* g.call(f, P("/proc/create_xeno"), null, [rt.fv(f, "ckey", live(G_found))]);
					return live(f.dot);
				}
				if (!truthy(live(_T))) {
					yield* g.callName(f, rt.gl("SSjob"), "SendToLateJoin", [live(new_xeno), 0]);
				}
				yield* g.callName(f, rt.fv(f, "mind", live(G_found)), "transfer_to", [live(new_xeno)]);
				rt.setFv(f, "key", live(new_xeno), rt.fv(f, "key", live(G_found)));
				yield* g.call(f, P("/proc/to_chat"), null, [live(new_xeno), "You have been fully respawned. Enjoy the game."]);
				yield* g.call(f, P("/proc/message_admins"), null, [(msg = fmt("<span class='adminnotice'>＀ has respawned ＀ as a filthy xeno.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.fv(f, "key", live(new_xeno))]))]);
				yield* g.call(f, P("/proc/admin_ticket_log"), null, [live(new_xeno), live(msg)]);
				return live(f.dot);
			}
		} else {
			if (truthy((yield* g.call(f, P("/proc/findtext"), null, [rt.fv(f, "real_name", live(G_found)), "monkey"])))) {
				if (isEqual((yield* g.call(f, P("/proc/alert"), null, ["This character appears to have been a monkey. Would you like to respawn them as such?", null, "Yes", "No"])), "Yes")) {
					new_monkey = (yield* g.new_(f, T("/mob/living/carbon/monkey"), []));
					yield* g.callName(f, rt.gl("SSjob"), "SendToLateJoin", [live(new_monkey)]);
					yield* g.callName(f, rt.fv(f, "mind", live(G_found)), "transfer_to", [live(new_monkey)]);
					rt.setFv(f, "key", live(new_monkey), rt.fv(f, "key", live(G_found)));
					yield* g.call(f, P("/proc/to_chat"), null, [live(new_monkey), "You have been fully respawned. Enjoy the game."]);
					yield* g.call(f, P("/proc/message_admins"), null, [(msg_3 = fmt("<span class='adminnotice'>＀ has respawned ＀ as a filthy xeno.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.fv(f, "key", live(new_monkey))]))]);
					yield* g.call(f, P("/proc/admin_ticket_log"), null, [live(new_monkey), live(msg_3)]);
					return live(f.dot);
				}
			}
		}
	}
	new_character = (yield* g.new_(f, T("/mob/living/carbon/human"), []));
	yield* g.callName(f, rt.gl("SSjob"), "SendToLateJoin", [live(new_character)]);
	record_found = null;
	if ((truthy(rt.fv(f, "mind", live(G_found))) && !truthy(rt.gv(f, "active", rt.fv(f, "mind", live(G_found)))))) {
		id = (yield* g.call(f, P("/proc/md5"), null, [fmt("＀＀", [rt.fv(f, "real_name", live(G_found)), rt.gv(f, "assigned_role", rt.fv(f, "mind", live(G_found)))])]));
		record_found = (yield* g.call(f, P("/proc/find_record"), null, ["id", live(id), rt.fv(f, "locked", rt.gl("data_core"))]));
	}
	if (truthy(live(record_found))) {
		rt.setFv(f, "real_name", live(new_character), rt.index(rt.fv(f, "fields", live(record_found)), "name"));
		rt.setFv(f, "gender", live(new_character), rt.index(rt.fv(f, "fields", live(record_found)), "sex"));
		rt.setFv(f, "age", live(new_character), rt.index(rt.fv(f, "fields", live(record_found)), "age"));
		yield* g.callName(f, live(new_character), "hardset_dna", [rt.index(rt.fv(f, "fields", live(record_found)), "identity"), rt.index(rt.fv(f, "fields", live(record_found)), "enzymes"), rt.index(rt.fv(f, "fields", live(record_found)), "name"), rt.index(rt.fv(f, "fields", live(record_found)), "blood_type"), rt.index(rt.fv(f, "fields", live(record_found)), "species"), rt.index(rt.fv(f, "fields", live(record_found)), "features")]);
	} else {
		yield* g.callName(f, (A = (yield* g.new_(f, T("/datum/preferences"), []))), "copy_to", [live(new_character)]);
		rt.setFv(f, "real_name", live(A), rt.fv(f, "real_name", live(G_found)));
		yield* g.callName(f, rt.fv(f, "dna", live(new_character)), "update_dna_identity", []);
	}
	rt.setFv(f, "name", live(new_character), rt.fv(f, "real_name", live(new_character)));
	if ((truthy(rt.fv(f, "mind", live(G_found))) && !truthy(rt.gv(f, "active", rt.fv(f, "mind", live(G_found)))))) {
		yield* g.callName(f, rt.fv(f, "mind", live(G_found)), "transfer_to", [live(new_character)]);
	} else {
		yield* g.callName(f, live(new_character), "mind_initialize", []);
	}
	if (!truthy(rt.gv(f, "assigned_role", rt.fv(f, "mind", live(new_character))))) {
		rt.setFv(f, "assigned_role", rt.fv(f, "mind", live(new_character)), "Assistant");
	}
	rt.setFv(f, "key", live(new_character), rt.fv(f, "key", live(G_found)));
	admin = (yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.src)]));
	player_key = rt.fv(f, "key", live(G_found));
	if (truthy((traitordatum = (yield* g.callName(f, rt.fv(f, "mind", live(new_character)), "has_antag_datum", [T("/datum/antagonist/traitor")]))))) {
		yield* g.callName(f, rt.gl("SSjob"), "EquipRank", [live(new_character), rt.gv(f, "assigned_role", rt.fv(f, "mind", live(new_character))), 1]);
		yield* g.callName(f, live(traitordatum), "equip", []);
	}
	$0 = rt.gv(f, "special_role", rt.fv(f, "mind", live(new_character)));
	if ($0 === "Wizard") {
		rt.setFv(f, "loc", live(new_character), rt.op(f, "PickUnweighted", [1], [rt.gl("wizardstart")]));
		yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "equip_wizard", [live(new_character)]);
	} else if ($0 === "Syndicate") {
		if (truthy((synd_spawn = rt.locateIn(f, "landmark*Syndicate-Spawn", rt.world())))) {
			rt.setFv(f, "loc", live(new_character), rt.getStep(f, live(synd_spawn), 0));
		}
		yield* g.callDyn(f, P("/datum/game_mode/proc/equip_syndicate"), undefined, [live(new_character)]);
	} else if ($0 === "Space Ninja") {
		ninja_spawn = rt.list();
		L = null;
		rt.forList(f, 0, rt.gl("landmarks_list"), T("/obj/effect/landmark"));
		while (($e = rt.next(f, 0)) !== undefined) {
			L = $e;
			if (isEqual(rt.fv(f, "name", live(L)), "carpspawn")) {
				ninja_spawn = rt.modify(live(ninja_spawn), live(L), add);
			}
		}
		rt.endFor(f, 0);
		yield* g.callName(f, (ninjadatum = (yield* g.callName(f, rt.fv(f, "mind", live(new_character)), "has_antag_datum", [T("/datum/antagonist/ninja")]))), "equip_space_ninja", []);
		if (truthy(rt.len(f, live(ninja_spawn)))) {
			ninja_spawn_here = rt.op(f, "PickUnweighted", [1], [live(ninja_spawn)]);
			rt.setFv(f, "loc", live(new_character), rt.fv(f, "loc", live(ninja_spawn_here)));
		}
	} else {
		$0 = rt.gv(f, "assigned_role", rt.fv(f, "mind", live(new_character)));
		if ($0 === "Cyborg") {
			new_character = (yield* g.callName(f, live(new_character), "Robotize", []));
		} else if ($0 === "AI") {
			new_character = (yield* g.callName(f, live(new_character), "AIize", []));
		} else {
			yield* g.callName(f, rt.gl("SSjob"), "EquipRank", [live(new_character), rt.gv(f, "assigned_role", rt.fv(f, "mind", live(new_character))), 1]);
		}
	}
	if (!truthy((rt.istype(live(new_character), T("/mob/living/silicon")) ? 1 : 0))) {
		if ((!truthy(live(record_found)) && !isEqual(rt.gv(f, "assigned_role", rt.fv(f, "mind", live(new_character))), rt.gv(f, "special_role", rt.fv(f, "mind", live(new_character)))))) {
			if (isEqual((yield* g.call(f, P("/proc/alert"), null, [live(new_character), "Warning: No data core entry detected. Would you like to announce the arrival of this character by adding them to various databases, such as medical records?", null, "No", "Yes"])), "Yes")) {
				yield* g.callName(f, rt.gl("data_core"), "manifest_inject", [live(new_character)]);
			}
			if (isEqual((yield* g.call(f, P("/proc/alert"), null, [live(new_character), "Would you like an active AI to announce this character?", null, "No", "Yes"])), "Yes")) {
				yield* g.call(f, P("/proc/AnnounceArrival"), null, [live(new_character), rt.gv(f, "assigned_role", rt.fv(f, "mind", live(new_character)))]);
			}
		}
	}
	yield* g.call(f, P("/proc/message_admins"), null, [(msg_7 = fmt("<span class='adminnotice'>＀ has respawned ＀ as ＀.</span>", [live(admin), live(player_key), rt.fv(f, "real_name", live(new_character))]))]);
	yield* g.call(f, P("/proc/admin_ticket_log"), null, [live(new_character), live(msg_7)]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(new_character), "You have been fully respawned. Enjoy the game."]);
	return live(new_character);
}, true, { verb: { name: "Respawn Character", category: "Special Verbs", desc: "Respawn a person that has been gibbed/dusted/killed. They must be a ghost for this to work and preferably should not have a body to go back into." } });

// /client/proc/cmd_admin_add_freeform_ai_law  (code/modules/admin/verbs/randomverbs.dm:434)  may sleep
rt.def("/client/proc/cmd_admin_add_freeform_ai_law", function* cmd_admin_add_freeform_ai_law(f: Frame) {
	let input: Value = null, show_log: Value = null, announce_ion_laws: Value = null, ion: Value = null;
	let $0: any;
	f.vars = () => [input, show_log, announce_ion_laws, ion, $0];
	if (!truthy(rt.sv(f, "holder"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Only administrators may use this command."]);
		return live(f.dot);
	}
	if (!truthy((input = (yield* g.op(f, "Prompt", [3], ["", "What?", "Please enter anything you want the AI to do. Anything. Serious.", live(f.usr), null]))))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("Admin ＀ has added a new AI law - ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(input)])]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("Admin ＀ has added a new AI law - ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(input)])]);
	show_log = (yield* g.call(f, P("/proc/alert"), null, [live(f.src), "Show ion message?", "Message", "Yes", "No"]));
	if (isEqual(live(show_log), "Yes")) {
		$0 = 1;
	} else {
		$0 = -1;
	}
	announce_ion_laws = $0;
	rt.setFv(f, "announceEvent", (ion = (yield* g.new_(f, T("/datum/round_event/ion_storm/add_law_only"), []))), live(announce_ion_laws));
	rt.setFv(f, "ionMessage", live(ion), live(input));
	return f.dot;
}, true, { verb: { name: "Add Custom AI law", category: "Fun" } });

// /client/proc/cmd_admin_rejuvenate  (code/modules/admin/verbs/randomverbs.dm:456)  may sleep
rt.def("/client/proc/cmd_admin_rejuvenate", function* cmd_admin_rejuvenate(f: Frame, M: Value) {
	let msg: Value = null;
	f.vars = () => [M, msg];
	if (!truthy(rt.sv(f, "holder"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Only administrators may use this command."]);
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "mob"))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(M), T("/mob/living")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/alert"), null, ["Cannot revive a ghost"]);
		return live(f.dot);
	}
	yield* g.callName(f, live(M), "revive", ["full_heal", 1, "admin_revive", 1], rt.Args.Named);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ healed / revived ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(M)]))])]);
	yield* g.call(f, P("/proc/message_admins"), null, [(msg = fmt("<span class='danger'>Admin ＀ healed / revived ＀!</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(M)]))]))]);
	yield* g.call(f, P("/proc/admin_ticket_log"), null, [live(M), live(msg)]);
	return f.dot;
}, true, { verb: { name: "Rejuvenate", category: "Special Verbs" }, argTypes: [{ type: 8, path: "/mob/living", source: "?" }] });

// /client/proc/cmd_admin_create_centcom_report  (code/modules/admin/verbs/randomverbs.dm:475)  may sleep
rt.def("/client/proc/cmd_admin_create_centcom_report", function* cmd_admin_create_centcom_report(f: Frame) {
	let input: Value = null, confirm: Value = null, announce_command_report: Value = null;
	let $0: any, $1: any;
	f.vars = () => [input, confirm, announce_command_report, $0, $1];
	if (!truthy(rt.sv(f, "holder"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Only administrators may use this command."]);
		return live(f.dot);
	}
	if (!truthy((input = (yield* g.op(f, "Prompt", [65], ["", "What?", "Please enter anything you want. Anything. Serious.", live(f.usr), null]))))) {
		return live(f.dot);
	}
	confirm = (yield* g.call(f, P("/proc/alert"), null, [live(f.src), "Do you want to announce the contents of the report to the crew?", "Announce", "Yes", "No", "Cancel"]));
	announce_command_report = 1;
	$0 = live(confirm);
	if ($0 === "Yes") {
		yield* g.call(f, P("/proc/priority_announce"), null, [live(input), null, rt.rsc("sound/ai/commandreport.ogg")]);
		announce_command_report = 0;
	} else if ($0 === "Cancel") {
		return live(f.dot);
	}
	$0 = live(input);
	if (truthy(live(announce_command_report))) {
		$1 = "Classified ";
	} else {
		$1 = "";
	}
	yield* g.call(f, P("/proc/print_command_report"), null, [$0, fmt("＀＀ Update", [$1, (yield* g.call(f, P("/proc/command_name"), null, []))]), live(announce_command_report)]);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has created a command report: ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)])), live(input)])]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has created a command report", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.src)]))])]);
	return f.dot;
}, true, { verb: { name: "Create Command Report", category: "Special Verbs" } });

// /client/proc/cmd_change_command_name  (code/modules/admin/verbs/randomverbs.dm:500)  may sleep
rt.def("/client/proc/cmd_change_command_name", function* cmd_change_command_name(f: Frame) {
	let input: Value = null;
	f.vars = () => [input];
	if (!truthy(rt.sv(f, "holder"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Only administrators may use this command."]);
		return live(f.dot);
	}
	if (!truthy((input = (yield* g.op(f, "Prompt", [3], ["", "What?", "Please input a new name for Central Command.", live(f.usr), null]))))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/change_command_name"), null, [live(input)]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has changed Central Command's name to ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.src)])), live(input)])]);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has changed the Central Command name to: ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)])), live(input)])]);
	return f.dot;
}, true, { verb: { name: "Change Command Name", category: "Special Verbs" } });

// /client/proc/cmd_admin_delete  (code/modules/admin/verbs/randomverbs.dm:514)  may sleep
rt.def("/client/proc/cmd_admin_delete", function* cmd_admin_delete(f: Frame, A: Value) {
	f.vars = () => [A];
	if (!truthy(rt.sv(f, "holder"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Only administrators may use this command."]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "admin_delete", live(A));
	return f.dot;
}, true, { verb: { name: "Delete", category: "Admin" }, argTypes: [{ type: 28, path: "/atom", source: "world" }] });

// /client/proc/admin_delete  (code/modules/admin/verbs/randomverbs.dm:521)  may sleep
rt.def("/client/proc/admin_delete", function* admin_delete(f: Frame, D: Value) {
	let A: Value = null, coords: Value = null, _T: Value = null;
	let $0: any;
	f.vars = () => [D, A, coords, _T, $0];
	A = live(D);
	if (truthy((rt.istype(live(A), T("/atom")) ? 1 : 0))) {
		$0 = fmt(" at (＀, ＀, ＀)", [rt.fv(f, "x", live(A)), rt.fv(f, "y", live(A)), rt.fv(f, "z", live(A))]);
	} else {
		$0 = "";
	}
	coords = $0;
	if (!isEqual((yield* g.call(f, P("/proc/alert"), null, [live(f.src), fmt("Are you sure you want to delete:\n＀\nat＀?", [live(D), live(coords)]), "Confirmation", "Yes", "No"])), "Yes")) return f.dot;
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ deleted ＀＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(D), live(coords)])]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ deleted ＀＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(D), live(coords)])]);
	if (truthy((yield* g.call(f, P("/proc/isturf"), null, [live(D)])))) {
		yield* g.callName(f, (_T = live(D)), "ChangeTurf", [rt.fv(f, "baseturf", live(_T))]);
	} else {
		yield* g.call(f, P("/proc/qdel"), null, [live(D)]);
	}
	return f.dot;
}, true);

// /client/proc/cmd_admin_list_open_jobs  (code/modules/admin/verbs/randomverbs.dm:537)  may sleep
rt.def("/client/proc/cmd_admin_list_open_jobs", function* cmd_admin_list_open_jobs(f: Frame) {
	if (!truthy(rt.sv(f, "holder"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Only administrators may use this command."]);
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "holder"), "manage_free_slots", []);
	return f.dot;
}, true, { verb: { name: "Manage Job Slots", category: "Admin" } });

// /client/proc/cmd_admin_explosion  (code/modules/admin/verbs/randomverbs.dm:547)  may sleep
rt.def("/client/proc/cmd_admin_explosion", function* cmd_admin_explosion(f: Frame, O: Value) {
	let devastation: Value = null, heavy: Value = null, light: Value = null, flash: Value = null, flames: Value = null;
	f.vars = () => [O, devastation, heavy, light, flash, flames];
	if (!truthy(rt.sv(f, "holder"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Only administrators may use this command."]);
		return live(f.dot);
	}
	if ((devastation = (yield* g.op(f, "Prompt", [33], [null, null, "Input", "Range of total devastation. -1 to none", null]))) === null) {
		return live(f.dot);
	}
	if ((heavy = (yield* g.op(f, "Prompt", [33], [null, null, "Input", "Range of heavy impact. -1 to none", null]))) === null) {
		return live(f.dot);
	}
	if ((light = (yield* g.op(f, "Prompt", [33], [null, null, "Input", "Range of light impact. -1 to none", null]))) === null) {
		return live(f.dot);
	}
	if ((flash = (yield* g.op(f, "Prompt", [33], [null, null, "Input", "Range of flash. -1 to none", null]))) === null) {
		return live(f.dot);
	}
	if ((flames = (yield* g.op(f, "Prompt", [33], [null, null, "Input", "Range of flames. -1 to none", null]))) === null) {
		return live(f.dot);
	}
	if (((((!isEqual(live(devastation), -1) || !isEqual(live(heavy), -1)) || !isEqual(live(light), -1)) || !isEqual(live(flash), -1)) || !isEqual(live(flames), -1))) {
		if ((((rt.gt(live(devastation), 20) || rt.gt(live(heavy), 20)) || rt.gt(live(light), 20)) || rt.gt(live(flames), 20))) {
			if (isEqual((yield* g.call(f, P("/proc/alert"), null, [live(f.src), "Are you sure you want to do this? It will laaag.", "Confirmation", "Yes", "No"])), "No")) {
				return live(f.dot);
			}
		}
		yield* g.call(f, P("/proc/explosion"), null, [live(O), live(devastation), live(heavy), live(light), live(flash), null, null, live(flames)]);
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ created an explosion (＀,＀,＀,＀) at (＀,＀,＀)", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(devastation), live(heavy), live(light), live(flames), rt.fv(f, "x", live(O)), rt.fv(f, "y", live(O)), rt.fv(f, "z", live(O))])]);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ created an explosion (＀,＀,＀,＀) at (＀,＀,＀)", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(devastation), live(heavy), live(light), live(flames), rt.fv(f, "x", live(O)), rt.fv(f, "y", live(O)), rt.fv(f, "z", live(O))])]);
		return live(f.dot);
	} else {
		return live(f.dot);
	}
	return f.dot;
}, true, { verb: { name: "Explosion", category: "Special Verbs" }, argTypes: [{ type: 28, path: "/atom", source: "world" }] });

// /client/proc/cmd_admin_emp  (code/modules/admin/verbs/randomverbs.dm:579)  may sleep
rt.def("/client/proc/cmd_admin_emp", function* cmd_admin_emp(f: Frame, O: Value) {
	let heavy: Value = null, light: Value = null;
	f.vars = () => [O, heavy, light];
	if (!truthy(rt.sv(f, "holder"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Only administrators may use this command."]);
		return live(f.dot);
	}
	if ((heavy = (yield* g.op(f, "Prompt", [33], [null, null, "Input", "Range of heavy pulse.", null]))) === null) {
		return live(f.dot);
	}
	if ((light = (yield* g.op(f, "Prompt", [33], [null, null, "Input", "Range of light pulse.", null]))) === null) {
		return live(f.dot);
	}
	if ((truthy(live(heavy)) || truthy(live(light)))) {
		yield* g.call(f, P("/proc/empulse"), null, [live(O), live(heavy), live(light)]);
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ created an EM Pulse (＀,＀) at (＀,＀,＀)", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(heavy), live(light), rt.fv(f, "x", live(O)), rt.fv(f, "y", live(O)), rt.fv(f, "z", live(O))])]);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ created an EM Pulse (＀,＀) at (＀,＀,＀)", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(heavy), live(light), rt.fv(f, "x", live(O)), rt.fv(f, "y", live(O)), rt.fv(f, "z", live(O))])]);
		return live(f.dot);
	} else {
		return live(f.dot);
	}
	return f.dot;
}, true, { verb: { name: "EM Pulse", category: "Special Verbs" }, argTypes: [{ type: 28, path: "/atom", source: "world" }] });

// /client/proc/cmd_admin_gib  (code/modules/admin/verbs/randomverbs.dm:603)  may sleep
rt.def("/client/proc/cmd_admin_gib", function* cmd_admin_gib(f: Frame, M: Value) {
	let confirm: Value = null;
	f.vars = () => [M, confirm];
	if (!truthy(rt.sv(f, "holder"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Only administrators may use this command."]);
		return live(f.dot);
	}
	if (isEqual((confirm = (yield* g.call(f, P("/proc/alert"), null, [live(f.src), "Drop a brain?", "Confirm", "Yes", "No", "Cancel"]))), "Cancel")) {
		return live(f.dot);
	}
	if (!truthy(live(M))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has gibbed ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(M)]))])]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has gibbed ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(M)]))])]);
	if (truthy((rt.istype(live(M), T("/mob/dead/observer")) ? 1 : 0))) {
		yield* g.new_(f, T("/obj/effect/gibspawner/generic"), [rt.fv(f, "loc", live(M)), rt.fv(f, "viruses", live(M))]);
		return live(f.dot);
	}
	if (isEqual(live(confirm), "Yes")) {
		yield* g.callName(f, live(M), "gib", []);
	} else {
		yield* g.callName(f, live(M), "gib", [1]);
	}
	return f.dot;
}, true, { verb: { name: "Gib", category: "Special Verbs" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// /client/proc/cmd_admin_gib_self  (code/modules/admin/verbs/randomverbs.dm:630)  may sleep
rt.def("/client/proc/cmd_admin_gib_self", function* cmd_admin_gib_self(f: Frame) {
	let confirm: Value = null;
	f.vars = () => [confirm];
	if (!isEqual((confirm = (yield* g.call(f, P("/proc/alert"), null, [live(f.src), "You sure?", "Confirm", "Yes", "No"]))), "Yes")) return f.dot;
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ used gibself.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ used gibself.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
	yield* g.callName(f, rt.sv(f, "mob"), "gib", [1, 1, 1]);
	return f.dot;
}, true, { verb: { name: "Gibself", category: "Fun" } });

// /client/proc/cmd_admin_check_contents  (code/modules/admin/verbs/randomverbs.dm:641)
rt.def("/client/proc/cmd_admin_check_contents", function cmd_admin_check_contents(f: Frame, M: Value) {
	let L: Value = null, t: Value = null;
	let $e: any;
	f.vars = () => [L, t, $e];
	L = rt.callName(f, live(M), "get_contents", []);
	t = null;
	rt.forList(f, 0, live(L));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("＀", [live(t)])]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, false, { verb: { name: "Check Contents", category: "Special Verbs" }, argTypes: [{ type: 8, path: "/mob/living", source: "?" }] });

// /client/proc/toggle_view_range  (code/modules/admin/verbs/randomverbs.dm:651)  may sleep
rt.def("/client/proc/toggle_view_range", function* toggle_view_range(f: Frame) {
	if (truthy((yield* g.srcCall(f, "is_default_view")))) {
		yield* g.srcCall(f, "change_view", (yield* g.op(f, "Prompt", [0], [null, 7, "FUCK YE", "Select view range:", rt.list(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 128)])));
	} else {
		yield* g.srcCall(f, "change_view", (yield* g.srcCall(f, "default_view")));
	}
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ changed their view range to ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "view")])]);
	return f.dot;
}, true, { verb: { name: "Change View Range", category: "Special Verbs", desc: "switches between 1x and custom views" } });

// tg_js: Debug > Zoom In / Zoom Out / Reset Zoom. Steps the view's height through ZOOM_STEPS (15 is normal) and keeps
// the default view's shape; the map canvas scales to fit its window, so a bigger view draws smaller tiles. 257 tall
// shows a whole 255x255 station from its middle. A view is a whole, odd number of tiles wide, so its width is the first such
// that covers the default shape (19x15 -> 27x21, not 26.6): the page shows the default shape and cuts the bit over off both sides
// (client-scene.ts boxWidth, the same rule), so the map pane keeps its width while zooming.
const ZOOM_STEPS = [7, 11, 15, 21, 29, 41, 57, 81, 113, 161, 257];
function* zoomView(f: Frame, dir: number, quiet = false) {
	const def = yield* g.srcCall(f, "default_view");
	const ds = rt.call(f, P("/proc/getviewsize"), null, [live(def)]), cs = rt.call(f, P("/proc/getviewsize"), null, [rt.sv(f, "view")]);
	const dw = Number(rt.index(ds, 1)), dh = Number(rt.index(ds, 2)), ch = Number(rt.index(cs, 2));
	let h = dh;
	if (dir > 0 && rt.onServer() && !truthy(rt.sv(f, "holder"))) { // online, admins only: a zoomed-out view is costly for a server to send
		if (!quiet) rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Online, zooming out is for admins only.</span>"]);
		return f.dot;
	}
	if (dir > 0) h = ZOOM_STEPS.find(s => s > ch) ?? ZOOM_STEPS[ZOOM_STEPS.length - 1];
	else if (dir < 0) h = [...ZOOM_STEPS].reverse().find(s => s < ch) ?? ZOOM_STEPS[0];
	let w = Math.ceil(h * dw / dh - 1e-9);
	if (w % 2 === 0) w++;
	if (quiet && h === ch) return f.dot;
	yield* g.srcCall(f, "change_view", h === dh ? live(def) : `${w}x${h}`);
	if (!quiet) rt.call(f, P("/proc/to_chat"), null, [live(f.usr), `<span class='notice'>View: ${w}x${h} tiles${h === dh ? " (normal)" : ""}.</span>`]);
	return f.dot;
}
// Shared by the Debug verbs and the ghost HUD buttons: client.zoom_view(dir, quiet): 1 = out, -1 = in, 0 = reset. Per client.
rt.def("/client/proc/zoom_view", function* zoom_view(f: Frame, dir: Value, quiet: Value) {
	f.vars = () => [dir, quiet];
	return yield* zoomView(f, Number(live(dir)), truthy(quiet));
}, true, { args: ["dir", "quiet"] });
rt.def("/client/proc/zoom_out", function* zoom_out(f: Frame) {
	return yield* zoomView(f, 1);
}, true, { verb: { name: "Zoom Out", category: "Debug", desc: "Show more tiles, drawn smaller" } });
rt.def("/client/proc/zoom_in", function* zoom_in(f: Frame) {
	return yield* zoomView(f, -1);
}, true, { verb: { name: "Zoom In", category: "Debug", desc: "Show fewer tiles, drawn bigger" } });
rt.def("/client/proc/zoom_reset", function* zoom_reset(f: Frame) {
	return yield* zoomView(f, 0);
}, true, { verb: { name: "Reset Zoom", category: "Debug", desc: "Back to the normal view size" } });

// /client/proc/admin_call_shuttle  (code/modules/admin/verbs/randomverbs.dm:666)  may sleep
rt.def("/client/proc/admin_call_shuttle", function* admin_call_shuttle(f: Frame) {
	let confirm: Value = null;
	f.vars = () => [confirm];
	if ((((truthy(rt.fv(f, "emergency", rt.gl("SSshuttle"))) && !isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "idle")) && !isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "recall")) && !isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "call"))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "holder"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Only administrators may use this command."]);
		return live(f.dot);
	}
	if (!isEqual((confirm = (yield* g.call(f, P("/proc/alert"), null, [live(f.src), "You sure?", "Confirm", "Yes", "No"]))), "Yes")) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "request", []);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ admin-called the emergency shuttle.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ admin-called the emergency shuttle.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
	return live(f.dot);
}, true, { verb: { name: "Call Shuttle", category: "Admin" } });

// /client/proc/admin_cancel_shuttle  (code/modules/admin/verbs/randomverbs.dm:686)  may sleep
rt.def("/client/proc/admin_cancel_shuttle", function* admin_cancel_shuttle(f: Frame) {
	if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [0])))) {
		return live(f.dot);
	}
	if (!isEqual((yield* g.call(f, P("/proc/alert"), null, [live(f.src), "You sure?", "Confirm", "Yes", "No"])), "Yes")) {
		return live(f.dot);
	}
	if ((((truthy(rt.fv(f, "emergency", rt.gl("SSshuttle"))) && !isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "idle")) && !isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "recall")) && !isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "call"))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "cancel", []);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ admin-recalled the emergency shuttle.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ admin-recalled the emergency shuttle.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
	return live(f.dot);
}, true, { verb: { name: "Cancel Shuttle", category: "Admin" } });

// /client/proc/everyone_random  (code/modules/admin/verbs/randomverbs.dm:706)  may sleep
rt.def("/client/proc/everyone_random", function* everyone_random(f: Frame) {
	let notifyplayers: Value = null;
	f.vars = () => [notifyplayers];
	if (truthy((yield* g.callName(f, rt.gl("SSticker"), "HasRoundStarted", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Nope you can't do this, the game's already started. This only works before rounds!"]);
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "force_random_names", rt.gl("config")))) {
		rt.setFv(f, "force_random_names", rt.gl("config"), 0);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("Admin ＀ has disabled \"Everyone is Special\" mode.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Disabled."]);
		return live(f.dot);
	}
	if (isEqual((notifyplayers = (yield* g.call(f, P("/proc/alert"), null, [live(f.src), "Do you want to notify the players?", "Options", "Yes", "No", "Cancel"]))), "Cancel")) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("Admin ＀ has forced the players to have random appearances.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)]))])]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("Admin ＀ has forced the players to have random appearances.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
	if (isEqual(live(notifyplayers), "Yes")) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<span class='adminnotice'>Admin ＀ has forced the players to have completely random identities!</span>", [rt.fv(f, "key", live(f.usr))])]);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<i>Remember: you can always disable the randomness by using the verb again, assuming the round hasn't started yet</i>."]);
	rt.setFv(f, "force_random_names", rt.gl("config"), 1);
	return f.dot;
}, true, { verb: { name: "Make Everyone Random", category: "Fun", desc: "Make everyone have a random appearance. You can only use this before rounds!" } });

// /client/proc/toggle_random_events  (code/modules/admin/verbs/randomverbs.dm:737)
rt.def("/client/proc/toggle_random_events", function toggle_random_events(f: Frame) {
	if (!truthy(rt.fv(f, "allow_random_events", rt.gl("config")))) {
		rt.setFv(f, "allow_random_events", rt.gl("config"), 1);
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "Random events enabled"]);
		rt.call(f, P("/proc/message_admins"), null, [fmt("Admin ＀ has enabled random events.", [rt.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])])]);
	} else {
		rt.setFv(f, "allow_random_events", rt.gl("config"), 0);
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "Random events disabled"]);
		rt.call(f, P("/proc/message_admins"), null, [fmt("Admin ＀ has disabled random events.", [rt.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])])]);
	}
	return f.dot;
}, false, { verb: { name: "Toggle random events on/off", category: "Server", desc: "Toggles random events such as meteors, black holes, blob (but not space dust) on/off" } });

// /client/proc/admin_change_sec_level  (code/modules/admin/verbs/randomverbs.dm:753)  may sleep
rt.def("/client/proc/admin_change_sec_level", function* admin_change_sec_level(f: Frame) {
	let level: Value = null;
	f.vars = () => [level];
	if (!truthy(rt.sv(f, "holder"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Only administrators may use this command."]);
		return live(f.dot);
	}
	if (!truthy((level = (yield* g.op(f, "Prompt", [1], [null, null, "Set Security Level", "Select security level to change to", rt.list("green", "blue", "red", "delta")]))))) return f.dot;
	yield* g.call(f, P("/proc/set_security_level"), null, [live(level)]);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ changed the security level to ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(level)])]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ changed the security level to ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(level)])]);
	return f.dot;
}, true, { verb: { name: "Set Security Level", category: "Special Verbs", desc: "Changes the security level. Announcement only, i.e. setting to Delta won't activate nuke" } });

// /client/proc/toggle_nuke  (code/modules/admin/verbs/randomverbs.dm:769)  may sleep
rt.def("/client/proc/toggle_nuke", function* toggle_nuke(f: Frame, N: Value) {
	let newtime: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [N, newtime, $0, $1, $2];
	if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [32])))) {
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "timing", live(N)))) {
		if (!truthy((newtime = (yield* g.op(f, "Prompt", [32], [fmt("＀", [rt.fv(f, "timer_set", live(N))]), "Activate Nuke", "Set activation timer.", live(f.usr), null]))))) {
			return live(f.dot);
		}
		rt.setFv(f, "timer_set", live(N), live(newtime));
	}
	yield* g.callName(f, live(N), "set_safety", []);
	yield* g.callName(f, live(N), "set_active", []);
	$0 = (yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]));
	if (truthy(rt.fv(f, "timing", live(N)))) {
		$1 = "activated";
	} else {
		$1 = "deactivated";
	}
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ ＀ a nuke at (＀,＀,＀).", [$0, $1, rt.fv(f, "x", live(N)), rt.fv(f, "y", live(N)), rt.fv(f, "z", live(N))])]);
	$0 = fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(f.usr)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(f.usr)])]);
	if (truthy(rt.fv(f, "timing", live(N)))) {
		$1 = "activated";
	} else {
		$1 = "deactivated";
	}
	if (truthy(live(N))) {
		$2 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(N)), rt.fv(f, "y", live(N)), rt.fv(f, "z", live(N))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(N)), rt.fv(f, "y", live(N)), rt.fv(f, "z", live(N))])]);
	} else {
		$2 = "nonexistent location";
	}
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ ＀ a nuke at ＀.", [$0, $1, fmt("＀", [$2])])]);
	return f.dot;
}, true, { hidePopup: true, verb: { name: "Toggle Nuke", category: "Fun" }, argTypes: [{ type: 4, path: "/obj/machinery/nuclearbomb", source: "?" }] });

// /datum/controller/global_vars/proc/InitGlobalcustom_outfits  (code/modules/admin/verbs/randomverbs.dm:784)
rt.def("/datum/controller/global_vars/proc/InitGlobalcustom_outfits", function InitGlobalcustom_outfits(f: Frame) {
	rt.setGl("custom_outfits", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "custom_outfits", add);
	return f.dot;
});

// /client/proc/create_outfits  (code/modules/admin/verbs/randomverbs.dm:790)
rt.def("/client/proc/create_outfits", function create_outfits(f: Frame) {
	if (!truthy(rt.call(f, P("/proc/check_rights"), null, [32]))) {
		return live(f.dot);
	}
	rt.callName(f, rt.sv(f, "holder"), "create_outfit", []);
	return f.dot;
}, false, { verb: { name: "Create Custom Outfit", category: "Debug" } });

// /datum/admins/proc/create_outfit  (code/modules/admin/verbs/randomverbs.dm:796)
rt.def("/datum/admins/proc/create_outfit", function create_outfit(f: Frame) {
	let uniforms: Value = null, suits: Value = null, gloves: Value = null, shoes: Value = null, headwear: Value = null, glasses: Value = null, masks: Value = null, ids: Value = null, uniform_select: Value = null, path: Value = null, suit_select: Value = null, path_10: Value = null, gloves_select: Value = null, path_11: Value = null, shoes_select: Value = null, path_12: Value = null, head_select: Value = null, path_13: Value = null, glasses_select: Value = null, path_14: Value = null, mask_select: Value = null, path_15: Value = null, id_select: Value = null, path_16: Value = null, dat: Value = null;
	let $e: any;
	f.vars = () => [uniforms, suits, gloves, shoes, headwear, glasses, masks, ids, uniform_select, path, suit_select, path_10, gloves_select, path_11, shoes_select, path_12, head_select, path_13, glasses_select, path_14, mask_select, path_15, id_select, path_16, dat, $e];
	uniforms = rt.call(f, P("/proc/typesof"), null, [T("/obj/item/clothing/under")]);
	suits = rt.call(f, P("/proc/typesof"), null, [T("/obj/item/clothing/suit")]);
	gloves = rt.call(f, P("/proc/typesof"), null, [T("/obj/item/clothing/gloves")]);
	shoes = rt.call(f, P("/proc/typesof"), null, [T("/obj/item/clothing/shoes")]);
	headwear = rt.call(f, P("/proc/typesof"), null, [T("/obj/item/clothing/head")]);
	glasses = rt.call(f, P("/proc/typesof"), null, [T("/obj/item/clothing/glasses")]);
	masks = rt.call(f, P("/proc/typesof"), null, [T("/obj/item/clothing/mask")]);
	ids = rt.call(f, P("/proc/typesof"), null, [T("/obj/item/weapon/card/id")]);
	uniform_select = "<select name=\"outfit_uniform\"><option value=\"\">None</option>";
	path = null;
	rt.forList(f, 0, live(uniforms));
	while (($e = rt.next(f, 0)) !== undefined) {
		path = $e;
		uniform_select = rt.modify(live(uniform_select), fmt("<option value=\"＀\">＀</option>", [live(path), live(path)]), add);
	}
	rt.endFor(f, 0);
	uniform_select = rt.modify(live(uniform_select), "</select>", add);
	suit_select = "<select name=\"outfit_suit\"><option value=\"\">None</option>";
	path_10 = null;
	rt.forList(f, 0, live(suits));
	while (($e = rt.next(f, 0)) !== undefined) {
		path_10 = $e;
		suit_select = rt.modify(live(suit_select), fmt("<option value=\"＀\">＀</option>", [live(path_10), live(path_10)]), add);
	}
	rt.endFor(f, 0);
	suit_select = rt.modify(live(suit_select), "</select>", add);
	gloves_select = "<select name=\"outfit_gloves\"><option value=\"\">None</option>";
	path_11 = null;
	rt.forList(f, 0, live(gloves));
	while (($e = rt.next(f, 0)) !== undefined) {
		path_11 = $e;
		gloves_select = rt.modify(live(gloves_select), fmt("<option value=\"＀\">＀</option>", [live(path_11), live(path_11)]), add);
	}
	rt.endFor(f, 0);
	gloves_select = rt.modify(live(gloves_select), "</select>", add);
	shoes_select = "<select name=\"outfit_shoes\"><option value=\"\">None</option>";
	path_12 = null;
	rt.forList(f, 0, live(shoes));
	while (($e = rt.next(f, 0)) !== undefined) {
		path_12 = $e;
		shoes_select = rt.modify(live(shoes_select), fmt("<option value=\"＀\">＀</option>", [live(path_12), live(path_12)]), add);
	}
	rt.endFor(f, 0);
	shoes_select = rt.modify(live(shoes_select), "</select>", add);
	head_select = "<select name=\"outfit_head\"><option value=\"\">None</option>";
	path_13 = null;
	rt.forList(f, 0, live(headwear));
	while (($e = rt.next(f, 0)) !== undefined) {
		path_13 = $e;
		head_select = rt.modify(live(head_select), fmt("<option value=\"＀\">＀</option>", [live(path_13), live(path_13)]), add);
	}
	rt.endFor(f, 0);
	head_select = rt.modify(live(head_select), "</select>", add);
	glasses_select = "<select name=\"outfit_glasses\"><option value=\"\">None</option>";
	path_14 = null;
	rt.forList(f, 0, live(glasses));
	while (($e = rt.next(f, 0)) !== undefined) {
		path_14 = $e;
		glasses_select = rt.modify(live(glasses_select), fmt("<option value=\"＀\">＀</option>", [live(path_14), live(path_14)]), add);
	}
	rt.endFor(f, 0);
	glasses_select = rt.modify(live(glasses_select), "</select>", add);
	mask_select = "<select name=\"outfit_mask\"><option value=\"\">None</option>";
	path_15 = null;
	rt.forList(f, 0, live(masks));
	while (($e = rt.next(f, 0)) !== undefined) {
		path_15 = $e;
		mask_select = rt.modify(live(mask_select), fmt("<option value=\"＀\">＀</option>", [live(path_15), live(path_15)]), add);
	}
	rt.endFor(f, 0);
	mask_select = rt.modify(live(mask_select), "</select>", add);
	id_select = "<select name=\"outfit_id\"><option value=\"\">None</option>";
	path_16 = null;
	rt.forList(f, 0, live(ids));
	while (($e = rt.next(f, 0)) !== undefined) {
		path_16 = $e;
		id_select = rt.modify(live(id_select), fmt("<option value=\"＀\">＀</option>", [live(path_16), live(path_16)]), add);
	}
	rt.endFor(f, 0);
	id_select = rt.modify(live(id_select), "</select>", add);
	dat = fmt("\n\t<html><head><title>Create Outfit</title></head><body>\n\t<form name=\"outfit\" action=\"byond://?src=＃\" method=\"get\">\n\t<input type=\"hidden\" name=\"src\" value=\"＃\">\n\t<input type=\"hidden\" name=\"create_outfit\" value=\"1\">\n\t<table>\n\t\t<tr>\n\t\t\t<th>Name:</th>\n\t\t\t<td>\n\t\t\t\t<input type=\"text\" name=\"outfit_name\" value=\"Custom Outfit\">\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th>Uniform:</th>\n\t\t\t<td>\n\t\t\t   ＀\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th>Suit:</th>\n\t\t\t<td>\n\t\t\t\t＀\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th>Back:</th>\n\t\t\t<td>\n\t\t\t\t<input type=\"text\" name=\"outfit_back\" value=\"\">\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th>Belt:</th>\n\t\t\t<td>\n\t\t\t\t<input type=\"text\" name=\"outfit_belt\" value=\"\">\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th>Gloves:</th>\n\t\t\t<td>\n\t\t\t\t＀\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th>Shoes:</th>\n\t\t\t<td>\n\t\t\t\t＀\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th>Head:</th>\n\t\t\t<td>\n\t\t\t\t＀\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th>Mask:</th>\n\t\t\t<td>\n\t\t\t\t＀\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th>Ears:</th>\n\t\t\t<td>\n\t\t\t\t<input type=\"text\" name=\"outfit_ears\" value=\"\">\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th>Glasses:</th>\n\t\t\t<td>\n\t\t\t\t＀\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th>ID:</th>\n\t\t\t<td>\n\t\t\t\t＀\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th>Left Pocket:</th>\n\t\t\t<td>\n\t\t\t\t<input type=\"text\" name=\"outfit_l_pocket\" value=\"\">\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th>Right Pocket:</th>\n\t\t\t<td>\n\t\t\t\t<input type=\"text\" name=\"outfit_r_pocket\" value=\"\">\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th>Suit Store:</th>\n\t\t\t<td>\n\t\t\t\t<input type=\"text\" name=\"outfit_s_store\" value=\"\">\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th>Right Hand:</th>\n\t\t\t<td>\n\t\t\t\t<input type=\"text\" name=\"outfit_r_hand\" value=\"\">\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th>Left Hand:</th>\n\t\t\t<td>\n\t\t\t\t<input type=\"text\" name=\"outfit_l_hand\" value=\"\">\n\t\t\t</td>\n\t\t</tr>\n\t</table>\n\t<br>\n\t<input type=\"submit\" value=\"Save\">\n\t</form></body></html>\n\t", [live(f.src), live(f.src), live(uniform_select), live(suit_select), live(gloves_select), live(shoes_select), live(head_select), live(mask_select), live(glasses_select), live(id_select)]);
	rt.op(f, "Browse", [], [live(f.usr), live(dat), "window=dressup;size=550x600"], false);
	return f.dot;
});

// /client/proc/toggle_antag_hud  (code/modules/admin/verbs/randomverbs.dm:965)
rt.def("/client/proc/toggle_antag_hud", function toggle_antag_hud(f: Frame) {
	let adding_hud: Value = null, H: Value = null, G: Value = null, H_2: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [adding_hud, H, G, H_2, $0, $1, $e];
	if (!truthy(rt.sv(f, "holder"))) {
		return live(f.dot);
	}
	adding_hud = (!truthy(rt.callSrc(f, "has_antag_hud", [])) ? 1 : 0);
	H = null;
	rt.forList(f, 0, rt.gl("huds"), T("/datum/atom_hud"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		if (truthy((rt.istype(live(H), T("/datum/atom_hud/antag")) ? 1 : 0))) {
			if (truthy(live(adding_hud))) {
				$0 = rt.callName(f, live(H), "add_hud_to", [live(f.usr)]);
			} else {
				$0 = rt.callName(f, live(H), "remove_hud_from", [live(f.usr)]);
			}
		}
	}
	rt.endFor(f, 0);
	G = null;
	rt.forList(f, 0, rt.gv(f, "gangs", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/gang"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		H_2 = rt.fv(f, "ganghud", live(G));
		if (truthy(live(adding_hud))) {
			$0 = rt.callName(f, live(H_2), "add_hud_to", [live(f.usr)]);
		} else {
			$0 = rt.callName(f, live(H_2), "remove_hud_from", [live(f.usr)]);
		}
	}
	rt.endFor(f, 0);
	$0 = live(f.usr);
	if (truthy(live(adding_hud))) {
		$1 = "ON";
	} else {
		$1 = "OFF";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("You toggled your admin antag HUD ＀.", [$1])]);
	$0 = rt.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]);
	if (truthy(live(adding_hud))) {
		$1 = "ON";
	} else {
		$1 = "OFF";
	}
	rt.call(f, P("/proc/message_admins"), null, [fmt("＀ toggled their admin antag HUD ＀.", [$0, $1])]);
	$0 = rt.call(f, P("/proc/key_name"), null, [live(f.usr)]);
	if (truthy(live(adding_hud))) {
		$1 = "ON";
	} else {
		$1 = "OFF";
	}
	rt.call(f, P("/proc/log_admin"), null, [fmt("＀ toggled their admin antag HUD ＀.", [$0, $1])]);
	return f.dot;
}, false, { verb: { name: "Toggle AntagHUD", category: "Admin", desc: "Toggles the Admin AntagHUD" } });

// /client/proc/has_antag_hud  (code/modules/admin/verbs/randomverbs.dm:983)
rt.def("/client/proc/has_antag_hud", function has_antag_hud(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	return rt.index(rt.gv(f, "hudusers", (A = rt.index(rt.gl("huds"), 11))), rt.sv(f, "mob"));
});

// /client/proc/open_shuttle_manipulator  (code/modules/admin/verbs/randomverbs.dm:991)  may sleep
rt.def("/client/proc/open_shuttle_manipulator", function* open_shuttle_manipulator(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	M = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/shuttle_manipulator"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.callName(f, live(M), "ui_interact", [live(f.usr)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { verb: { name: "Shuttle Manipulator", category: "Admin", desc: "Opens the shuttle manipulator UI." } });

// /client/proc/mass_zombie_infection  (code/modules/admin/verbs/randomverbs.dm:1000)  may sleep
rt.def("/client/proc/mass_zombie_infection", function* mass_zombie_infection(f: Frame) {
	let confirm: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [confirm, H, $e];
	if (!truthy(rt.sv(f, "holder"))) {
		return live(f.dot);
	}
	if (!isEqual((confirm = (yield* g.call(f, P("/proc/alert"), null, [live(f.src), "Please confirm you want to add latent zombie organs in all humans?", "Confirm Zombies", "Yes", "No"]))), "Yes")) {
		return live(f.dot);
	}
	H = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		yield* g.new_(f, T("/obj/item/organ/zombie_infection"), [live(H)]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ added a latent zombie infection to all humans.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ added a latent zombie infection to all humans.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
	return f.dot;
}, true, { verb: { name: "Mass Zombie Infection", category: "Fun", desc: "Infects all humans with a latent organ that will zombify them on death." } });

// /client/proc/mass_zombie_cure  (code/modules/admin/verbs/randomverbs.dm:1018)  may sleep
rt.def("/client/proc/mass_zombie_cure", function* mass_zombie_cure(f: Frame) {
	let confirm: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [confirm, I, $e];
	if (!truthy(rt.sv(f, "holder"))) {
		return live(f.dot);
	}
	if (!isEqual((confirm = (yield* g.call(f, P("/proc/alert"), null, [live(f.src), "Please confirm you want to cure all zombies?", "Confirm Zombie Cure", "Yes", "No"]))), "Yes")) {
		return live(f.dot);
	}
	I = null;
	rt.forList(f, 0, rt.gl("zombie_infection_list"), T("/obj/item/organ/zombie_infection"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ cured all zombies.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ cured all zombies.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
	return f.dot;
}, true, { verb: { name: "Mass Zombie Cure", category: "Fun", desc: "Removes the zombie infection from all humans, returning them to normal." } });

// /client/proc/polymorph_all  (code/modules/admin/verbs/randomverbs.dm:1037)  may sleep
rt.def("/client/proc/polymorph_all", function* polymorph_all(f: Frame) {
	let confirm: Value = null, mobs: Value = null, who_did_it: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [confirm, mobs, who_did_it, M, $e];
	if (!truthy(rt.sv(f, "holder"))) {
		return live(f.dot);
	}
	if (!isEqual((confirm = (yield* g.call(f, P("/proc/alert"), null, [live(f.src), "Please confirm you want polymorph all mobs?", "Confirm Polymorph", "Yes", "No"]))), "Yes")) {
		return live(f.dot);
	}
	mobs = (yield* g.call(f, P("/proc/shuffle"), null, [(yield* g.callName(f, rt.gl("living_mob_list"), "Copy", []))]));
	who_did_it = (yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]));
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ started polymorphed all living mobs.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ polymorphed all living mobs.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
	M = null;
	rt.forList(f, 0, live(mobs), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
		if (!truthy(live(M))) {
			continue;
		}
		yield* g.callName(f, live(M), "audible_message", ["<span class='italics'>...wabbajack...wabbajack...</span>"]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(M)), rt.rsc("sound/magic/staff_change.ogg"), 50, 1, -1]);
		yield* g.call(f, P("/proc/wabbajack"), null, [live(M)]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("Mass polymorph started by ＀ is complete.", [live(who_did_it)])]);
	return f.dot;
}, true, { verb: { name: "Polymorph All", category: "Fun", desc: "Applies the effects of the bolt of change to every single mob." } });

// /client/proc/show_tip  (code/modules/admin/verbs/randomverbs.dm:1071)  may sleep
rt.def("/client/proc/show_tip", function* show_tip(f: Frame) {
	let input: Value = null;
	f.vars = () => [input];
	if (!truthy(rt.sv(f, "holder"))) {
		return live(f.dot);
	}
	if (!truthy((input = (yield* g.op(f, "Prompt", [65], ["", "Tip", "Please specify your tip that you want to send to the players.", live(f.usr), null]))))) {
		return live(f.dot);
	}
	if (!truthy(rt.gl("SSticker"))) {
		return live(f.dot);
	}
	rt.setFv(f, "selected_tip", rt.gl("SSticker"), live(input));
	if (truthy(rt.fv(f, "tipped", rt.gl("SSticker")))) {
		yield* g.callName(f, rt.gl("SSticker"), "send_tip_of_the_round", []);
	}
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ sent a tip of the round.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ sent \"＀\" as the Tip of the Round.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(input)])]);
	return f.dot;
}, true, { verb: { name: "Show Tip", category: "Admin", desc: "Sends a tip (that you specify) to all players. After all you're the experienced player here." } });

// /proc/mass_purrbation  (code/modules/admin/verbs/randomverbs.dm:1095)  may sleep
rt.def("/proc/mass_purrbation", function* mass_purrbation(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	M = null;
	rt.forList(f, 0, rt.gl("mob_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy((yield* g.call(f, P("/proc/is_species"), null, [live(M), T("/datum/species/human")])))) {
			yield* g.call(f, P("/proc/purrbation_apply"), null, [live(M)]);
		}
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /proc/mass_remove_purrbation  (code/modules/admin/verbs/randomverbs.dm:1101)  may sleep
rt.def("/proc/mass_remove_purrbation", function* mass_remove_purrbation(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	M = null;
	rt.forList(f, 0, rt.gl("mob_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy((yield* g.call(f, P("/proc/is_species"), null, [live(M), T("/datum/species/human")])))) {
			yield* g.call(f, P("/proc/purrbation_remove"), null, [live(M)]);
		}
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /proc/purrbation_toggle  (code/modules/admin/verbs/randomverbs.dm:1107)  may sleep
rt.def("/proc/purrbation_toggle", function* purrbation_toggle(f: Frame, H: Value) {
	f.vars = () => [H];
	if (!truthy((yield* g.call(f, P("/proc/is_species"), null, [live(H), T("/datum/species/human")])))) {
		return live(f.dot);
	}
	if (isEqual(rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "tail_human"), "None") && isEqual(rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "ears"), "None")) {
		yield* g.call(f, P("/proc/purrbation_apply"), null, [live(H)]);
		f.dot = 1;
	} else {
		yield* g.call(f, P("/proc/purrbation_remove"), null, [live(H)]);
		f.dot = 0;
	}
	return f.dot;
}, true);

// /proc/purrbation_apply  (code/modules/admin/verbs/randomverbs.dm:1117)  may sleep
rt.def("/proc/purrbation_apply", function* purrbation_apply(f: Frame, H: Value) {
	f.vars = () => [H];
	if (!truthy((rt.istype(live(H), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!(isEqual(rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "tail_human"), "None") && isEqual(rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "ears"), "None"))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(H), "Something is nya~t right."]);
	rt.setAt(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "tail_human", "Cat");
	rt.setAt(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "ears", "Cat");
	yield* g.callName(f, live(H), "regenerate_icons", []);
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(H), 0), rt.rsc("sound/effects/meow1.ogg"), 50, 1, -1]);
	return f.dot;
}, true);

// /proc/purrbation_remove  (code/modules/admin/verbs/randomverbs.dm:1128)  may sleep
rt.def("/proc/purrbation_remove", function* purrbation_remove(f: Frame, H: Value) {
	f.vars = () => [H];
	if (!truthy((rt.istype(live(H), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (isEqual(rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "tail_human"), "None") && isEqual(rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "ears"), "None")) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(H), "You are no longer a cat."]);
	rt.setAt(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "tail_human", "None");
	rt.setAt(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "ears", "None");
	yield* g.callName(f, live(H), "regenerate_icons", []);
	return f.dot;
}, true);

// /client/proc/modify_goals  (code/modules/admin/verbs/randomverbs.dm:1143)
rt.def("/client/proc/modify_goals", function modify_goals(f: Frame) {
	if (!truthy(rt.call(f, P("/proc/check_rights"), null, [2]))) {
		return live(f.dot);
	}
	rt.callName(f, rt.sv(f, "holder"), "modify_goals", []);
	return f.dot;
}, false, { verb: { name: "Modify goals", category: "Debug" } });

// /datum/admins/proc/modify_goals  (code/modules/admin/verbs/randomverbs.dm:1149)
rt.def("/datum/admins/proc/modify_goals", function modify_goals(f: Frame) {
	let dat: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [dat, S, $e];
	dat = "";
	S = null;
	rt.forList(f, 0, rt.gv(f, "station_goals", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/station_goal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		dat = rt.modify(live(dat), fmt("＀ - <a href='?src=＃;announce=1'>Announce</a> | <a href='?src=＃;remove=1'>Remove</a><br>", [rt.fv(f, "name", live(S)), live(S), live(S)]), add);
	}
	rt.endFor(f, 0);
	dat = rt.modify(live(dat), fmt("<br><a href='?src=＃;add_station_goal=1'>Add New Goal</a>", [live(f.src)]), add);
	rt.op(f, "Browse", [], [live(f.usr), live(dat), "window=goals;size=400x400"], false);
	return f.dot;
});

// /client/proc/smite  (code/modules/admin/verbs/randomverbs.dm:1172)  may sleep
rt.def("/client/proc/smite", function* smite(f: Frame, target: Value) {
	let punishment_list: Value = null, punishment: Value = null, _T: Value = null, msg: Value = null;
	let $0: any;
	f.vars = () => [target, punishment_list, punishment, _T, msg, $0];
	if (!truthy(rt.sv(f, "holder"))) {
		return live(f.dot);
	}
	punishment_list = rt.list("Lightning bolt", "Brain damage", "Gib", "Bluespace Artillery Device");
	punishment = (yield* g.op(f, "Prompt", [1], [null, null, "DIVINE SMITING", "Choose a punishment", live(punishment_list)]));
	if (((!truthy(live(target)) || truthy(rt.fv(f, "gc_destroyed", live(target)))) || !truthy(live(punishment)))) {
		return live(f.dot);
	}
	$0 = live(punishment);
	if ($0 === "Lightning bolt") {
		yield* g.callName(f, (_T = rt.getStep(f, rt.getStep(f, live(target), 1), 1)), "Beam", [null, live(target), "icon_state", fmt("lightning＀", [(yield* g.call(f, P("/proc/rand"), null, [1, 12]))]), "time", 5], rt.Args.Named);
		yield* g.callName(f, live(target), "adjustFireLoss", [75]);
		yield* g.callName(f, live(target), "electrocution_animation", [40]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(target), "<span class='userdanger'>The gods have punished you for your sins!</span>"]);
	} else if ($0 === "Brain damage") {
		yield* g.callName(f, live(target), "adjustBrainLoss", [75]);
	} else if ($0 === "Gib") {
		yield* g.callName(f, live(target), "gib", [0]);
	} else if ($0 === "Bluespace Artillery Device") {
		yield* g.srcCall(f, "bluespace_artillery", live(target));
	}
	yield* g.call(f, P("/proc/message_admins"), null, [(msg = fmt("＀ punished ＀ with ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(target)])), live(punishment)]))]);
	yield* g.call(f, P("/proc/admin_ticket_log"), null, [live(target), live(msg)]);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ punished ＀ with ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(target)])), live(punishment)])]);
	return f.dot;
}, true, { verb: { name: "Smite", category: "Fun" }, argTypes: [{ type: 8, path: "/mob/living/carbon/human" }] });

// /client/proc/trigger_centcom_recall  (code/modules/admin/verbs/randomverbs.dm:1203)  may sleep
rt.def("/client/proc/trigger_centcom_recall", function* trigger_centcom_recall(f: Frame) {
	let message: Value = null;
	f.vars = () => [message];
	if (!truthy(rt.sv(f, "holder"))) {
		return live(f.dot);
	}
	message = rt.op(f, "PickUnweighted", [1], [rt.gl("admiral_messages")]);
	if (!truthy((message = (yield* g.op(f, "Prompt", [3], [null, live(message), "Admiral Message", "Enter message from the on-call admiral to be put in the recall report.", null]))))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ triggered a Centcom recall, with the admiral message of: ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(message)])]);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ triggered a Centcom recall, with the message of: ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(message)])]);
	yield* g.callName(f, rt.gl("SSshuttle"), "centcom_recall", [rt.gv(f, "timer", rt.fv(f, "emergency", rt.gl("SSshuttle"))), live(message)]);
	return f.dot;
}, true);
