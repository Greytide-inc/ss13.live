// From code/modules/client/verbs/ooc.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /client/verb/ooc  (code/modules/client/verbs/ooc.dm:6)  may sleep
rt.def("/client/verb/ooc", function* ooc(f: Frame, msg: Value) {
	let raw_msg: Value = null, keyname: Value = null, C: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [msg, raw_msg, keyname, C, $0, $1, $2, $3, $e];
	if (truthy(rt.gl("say_disabled"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>Speech is currently admin-disabled.</span>"]);
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "mob"))) {
		return live(f.dot);
	}
	if (truthy((yield* g.call(f, P("/proc/IsGuestKey"), null, [rt.sv(f, "key")])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Guests may not use OOC."]);
		return live(f.dot);
	}
	msg = (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [live(msg)])), 1, 1024]));
	raw_msg = live(msg);
	if (!truthy(live(msg))) {
		return live(f.dot);
	}
	if ((truthy((rt.isIn(f, (yield* g.call(f, P("/proc/copytext"), null, [(msg = (yield* g.call(f, P("/proc/emoji_parse"), null, [live(msg)]))), 1, 2])), rt.list(".", ";", ":", "#")) ? 1 : 0)) || truthy((yield* g.call(f, P("/proc/findtext"), null, [(yield* g.call(f, P("/proc/lowertext"), null, [(yield* g.call(f, P("/proc/copytext"), null, [live(msg), 1, 5]))])), "say"]))))) {
		if (!isEqual((yield* g.call(f, P("/proc/alert"), null, [fmt("Your message \"＀\" looks like it was meant for in game communication, say it in OOC?", [live(raw_msg)]), "Meant for OOC?", "No", "Yes"])), "Yes")) {
			return live(f.dot);
		}
	}
	if (!truthy(rt.bitAnd(rt.fv(f, "chat_toggles", rt.sv(f, "prefs")), 1))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>You have OOC muted.</span>"]);
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "holder"))) {
		if (!truthy(rt.gl("ooc_allowed"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>OOC is globally muted.</span>"]);
			return live(f.dot);
		}
		if ((!truthy(rt.gl("dooc_allowed")) && isEqual(rt.fv(f, "stat", rt.sv(f, "mob")), 2))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>OOC for dead mobs has been turned off.</span>"]);
			return live(f.dot);
		}
		if (truthy(rt.bitAnd(rt.fv(f, "muted", rt.sv(f, "prefs")), 2))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>You cannot use OOC (muted).</span>"]);
			return live(f.dot);
		}
		if (truthy(rt.fv(f, "mob", live(f.src)))) {
			if (truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [rt.fv(f, "mob", live(f.src)), "OOC"])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>You have been banned from OOC.</span>"]);
				return live(f.dot);
			}
		}
		if (truthy(rt.gl("SSvote")) && truthy((yield* g.callName(f, rt.gl("SSvote"), "newcomer_refused", [live(f.src), "use OOC"])))) { // ss13.live: plans/server-rules.md step 4
			return live(f.dot);
		}
		if (truthy((yield* g.srcCall(f, "handle_spam_prevention", live(msg), 2)))) {
			return live(f.dot);
		}
		if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(msg), "byond://"])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<B>Advertising other servers is not allowed.</B>"]);
			yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has attempted to advertise in OOC: ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)])), live(msg)])]);
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has attempted to advertise in OOC: ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.src)])), live(msg)])]);
			return live(f.dot);
		}
	}
	yield* g.call(f, P("/proc/log_ooc"), null, [fmt("＀/＀ : ＀", [rt.fv(f, "name", rt.sv(f, "mob")), rt.sv(f, "key"), live(raw_msg)])]);
	yield* g.callName(f, rt.sv(f, "mob"), "log_message", [fmt("＀: ＀", [rt.sv(f, "key"), live(raw_msg)]), "OOC log"]);
	keyname = rt.sv(f, "key");
	if (truthy(rt.fv(f, "unlock_content", rt.sv(f, "prefs")))) {
		if (truthy(rt.bitAnd(rt.fv(f, "toggles", rt.sv(f, "prefs")), 16))) {
			if (truthy(rt.fv(f, "ooccolor", rt.sv(f, "prefs")))) {
				$0 = rt.fv(f, "ooccolor", rt.sv(f, "prefs"));
			} else {
				$0 = rt.gl("normal_ooc_colour");
			}
			keyname = fmt("<font color='＀'>＀＀</font>", [$0, (yield* g.call(f, P("/proc/bicon"), null, [(yield* g.call(f, P("/proc/icon"), null, [rt.rsc("icons/member_content.dmi"), "blag"]))])), live(keyname)]);
		}
	}
	C = null;
	rt.forList(f, 0, rt.gl("clients"), T("/client"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (truthy(rt.bitAnd(rt.gv(f, "chat_toggles", rt.fv(f, "prefs", live(C))), 1))) {
			if (truthy(rt.sv(f, "holder"))) {
				if ((!truthy(rt.fv(f, "fakekey", rt.sv(f, "holder"))) || truthy(rt.fv(f, "holder", live(C))))) {
					if (truthy((yield* g.call(f, P("/proc/check_rights_for"), null, [live(f.src), 2])))) {
						$0 = live(C);
						if ((truthy(rt.fv(f, "allow_admin_ooccolor", rt.gl("config"))) && truthy(rt.fv(f, "ooccolor", rt.sv(f, "prefs"))))) {
							$1 = fmt("<font color=＀>", [rt.fv(f, "ooccolor", rt.sv(f, "prefs"))]);
						} else {
							$1 = "";
						}
						$2 = live(keyname);
						if (truthy(rt.fv(f, "fakekey", rt.sv(f, "holder")))) {
							$3 = fmt("/(＀)", [rt.fv(f, "fakekey", rt.sv(f, "holder"))]);
						} else {
							$3 = "";
						}
						yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='adminooc'>＀<span class='prefix'>OOC:</span> <span class='adminbadge'>ADMIN</span> <EM>＀＀:</EM> <span class='message'>＀</span></span></font>", [$1, $2, $3, live(msg)])]);
					} else {
						$0 = live(C);
						$1 = live(keyname);
						if (truthy(rt.fv(f, "fakekey", rt.sv(f, "holder")))) {
							$2 = fmt("/(＀)", [rt.fv(f, "fakekey", rt.sv(f, "holder"))]);
						} else {
							$2 = "";
						}
						yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='adminobserverooc'><span class='prefix'>OOC:</span> <EM>＀＀:</EM> <span class='message'>＀</span></span>", [$1, $2, live(msg)])]);
					}
				} else {
					$0 = live(C);
					$1 = rt.gl("normal_ooc_colour");
					if (truthy(rt.fv(f, "fakekey", rt.sv(f, "holder")))) {
						$2 = rt.fv(f, "fakekey", rt.sv(f, "holder"));
					} else {
						$2 = rt.sv(f, "key");
					}
					yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<font color='＀'><span class='ooc'><span class='prefix'>OOC:</span> <EM>＀:</EM> <span class='message'>＀</span></span></font>", [$1, $2, live(msg)])]);
				}
			} else {
				if (!truthy((rt.isIn(f, rt.sv(f, "key"), rt.gv(f, "ignoring", rt.fv(f, "prefs", live(C)))) ? 1 : 0))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(C), fmt("<font color='＀'><span class='ooc'><span class='prefix'>OOC:</span> <EM>＀:</EM> <span class='message'>＀</span></span></font>", [rt.gl("normal_ooc_colour"), live(keyname), live(msg)])]);
				}
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { verb: { name: "OOC", category: "OOC" }, argTypes: [{ type: 2 }] });

// /proc/toggle_ooc  (code/modules/client/verbs/ooc.dm:76)
rt.def("/proc/toggle_ooc", function toggle_ooc(f: Frame, toggle: Value) {
	let $0: any, $1: any;
	f.vars = () => [toggle, $0, $1];
	if (live(toggle) === null) {
		toggle = null;
	}
	if (live(toggle) !== null) {
		if (!isEqual(live(toggle), rt.gl("ooc_allowed"))) {
			rt.setGl("ooc_allowed", live(toggle));
		} else {
			return live(f.dot);
		}
	} else {
		rt.setGl("ooc_allowed", (!truthy(rt.gl("ooc_allowed")) ? 1 : 0));
	}
	$0 = rt.world();
	if (truthy(rt.gl("ooc_allowed"))) {
		$1 = "enabled";
	} else {
		$1 = "disabled";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<B>The OOC channel has been globally ＀.</B>", [$1])]);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalnormal_ooc_colour  (code/modules/client/verbs/ooc.dm:85)
rt.def("/datum/controller/global_vars/proc/InitGlobalnormal_ooc_colour", function InitGlobalnormal_ooc_colour(f: Frame) {
	rt.setGl("normal_ooc_colour", "#002eb8");
	rt.modSrcVar(f, "gvars_datum_init_order", "normal_ooc_colour", add);
	return f.dot;
});

// /client/proc/set_ooc  (code/modules/client/verbs/ooc.dm:91)
rt.def("/client/proc/set_ooc", function set_ooc(f: Frame, newColor: Value) {
	rt.setGl("normal_ooc_colour", rt.call(f, P("/proc/sanitize_ooccolor"), null, [live(newColor)]));
	return f.dot;
}, false, { verb: { name: "Set Player OOC Color", category: "Fun", desc: "Modifies player OOC Color" }, argTypes: [{ type: 256 }] });

// /client/proc/reset_ooc  (code/modules/client/verbs/ooc.dm:97)
rt.def("/client/proc/reset_ooc", function reset_ooc(f: Frame) {
	rt.setGl("normal_ooc_colour", "#002eb8");
	return f.dot;
}, false, { verb: { name: "Reset Player OOC Color", category: "Fun", desc: "Returns player OOC Color to default" } });

// /client/verb/colorooc  (code/modules/client/verbs/ooc.dm:103)  may sleep
rt.def("/client/verb/colorooc", function* colorooc(f: Frame) {
	let new_ooccolor: Value = null;
	f.vars = () => [new_ooccolor];
	if ((!truthy(rt.sv(f, "holder")) || truthy((yield* g.call(f, P("/proc/check_rights_for"), null, [live(f.src), 2]))))) {
		if (!truthy((yield* g.srcCall(f, "is_content_unlocked")))) {
			return live(f.dot);
		}
	}
	if (truthy((new_ooccolor = (yield* g.op(f, "Prompt", [257], [rt.fv(f, "ooccolor", rt.sv(f, "prefs")), "OOC color", "Please select your OOC color.", live(f.src), null]))))) {
		rt.setFv(f, "ooccolor", rt.sv(f, "prefs"), (yield* g.call(f, P("/proc/sanitize_ooccolor"), null, [live(new_ooccolor)])));
		yield* g.callName(f, rt.sv(f, "prefs"), "save_preferences", []);
	}
	return live(f.dot);
}, true, { verb: { name: "Set Your OOC Color", category: "Preferences" } });

// /client/verb/resetcolorooc  (code/modules/client/verbs/ooc.dm:119)
rt.def("/client/verb/resetcolorooc", function resetcolorooc(f: Frame) {
	if (!(!truthy(rt.sv(f, "holder")) || truthy(rt.call(f, P("/proc/check_rights_for"), null, [live(f.src), 2])))) return f.dot;
	if (!truthy(rt.callSrc(f, "is_content_unlocked", []))) {
		return live(f.dot);
	}
	rt.setFv(f, "ooccolor", rt.sv(f, "prefs"), rt.initial(f, rt.sv(f, "prefs"), "ooccolor"));
	rt.callName(f, rt.sv(f, "prefs"), "save_preferences", []);
	return f.dot;
}, false, { verb: { name: "Reset Your OOC Color", category: "Preferences", desc: "Returns your OOC Color to default" } });

// /client/verb/admin_notice  (code/modules/client/verbs/ooc.dm:133)
rt.def("/client/verb/admin_notice", function admin_notice(f: Frame) {
	if (truthy(rt.gl("admin_notice"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='boldnotice'>Admin Notice:</span>\n \t ＀", [rt.gl("admin_notice")])]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>There are no admin notices at the moment.</span>"]);
	}
	return f.dot;
}, false, { verb: { name: "Adminnotice", category: "Admin", desc: "Check the admin notice if it has been set" } });

// /client/verb/fix_chat  (code/modules/client/verbs/ooc.dm:140)  may sleep
rt.def("/client/verb/fix_chat", function* fix_chat(f: Frame) {
	let action: Value = null;
	let $0: any;
	f.vars = () => [action, $0];
	if ((!truthy(rt.sv(f, "chatOutput")) || !truthy((rt.istype(rt.sv(f, "chatOutput"), T("/datum/chatOutput")) ? 1 : 0)))) {
		if (!isEqual((action = (yield* g.call(f, P("/proc/alert"), null, [live(f.src), "Invalid Chat Output data found!\nRecreate data?", "Wot?", "Recreate Chat Output data", "Cancel"]))), "Recreate Chat Output data")) {
			return live(f.dot);
		}
		rt.setSv(f, "chatOutput", (yield* g.new_(f, T("/datum/chatOutput"), [live(f.src)])));
		yield* g.callName(f, rt.sv(f, "chatOutput"), "start", []);
		if (isEqual((action = (yield* g.call(f, P("/proc/alert"), null, [live(f.src), "Goon chat reloading, wait a bit and tell me if it's fixed", "", "Fixed", "Nope"]))), "Fixed")) {
			yield* g.call(f, P("/proc/log_game"), null, [fmt("GOONCHAT: ＀ Had to fix their goonchat by re-creating the chatOutput datum", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)]))])]);
		} else {
			yield* g.callName(f, rt.sv(f, "chatOutput"), "load", []);
			if (isEqual((action = (yield* g.call(f, P("/proc/alert"), null, [live(f.src), "How about now? (give it a moment (it may also try to load twice))", "", "Yes", "No"]))), "Yes")) {
				yield* g.call(f, P("/proc/log_game"), null, [fmt("GOONCHAT: ＀ Had to fix their goonchat by re-creating the chatOutput datum and forcing a load()", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)]))])]);
			} else {
				if (isEqual((action = (yield* g.call(f, P("/proc/alert"), null, [live(f.src), "Welp, I'm all out of ideas. Try closing byond and reconnecting.\nWe could also disable fancy chat and re-enable oldchat", "", "Thanks anyways", "Switch to old chat"]))), "Switch to old chat")) {
					yield* g.call(f, P("/proc/winset"), null, [live(f.src), "output", "is-visible=true;is-disabled=false"]);
					yield* g.call(f, P("/proc/winset"), null, [live(f.src), "browseroutput", "is-visible=false"]);
				}
				yield* g.call(f, P("/proc/log_game"), null, [fmt("GOONCHAT: ＀ Failed to fix their goonchat window after recreating the chatOutput and forcing a load()", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)]))])]);
			}
		}
	} else {
		if (truthy(rt.fv(f, "loaded", rt.sv(f, "chatOutput")))) {
			$0 = (action = (yield* g.call(f, P("/proc/alert"), null, [live(f.src), "ChatOutput seems to be loaded\nDo you want me to force a reload, wiping the chat log or just refresh the chat window because it broke/went away?", "Hmmm", "Force Reload", "Refresh", "Cancel"])));
			if ($0 === "Force Reload") {
				rt.setFv(f, "loaded", rt.sv(f, "chatOutput"), 0);
				yield* g.callName(f, rt.sv(f, "chatOutput"), "start", []);
				if (isEqual((action = (yield* g.call(f, P("/proc/alert"), null, [live(f.src), "Goon chat reloading, wait a bit and tell me if it's fixed", "", "Fixed", "Nope"]))), "Fixed")) {
					yield* g.call(f, P("/proc/log_game"), null, [fmt("GOONCHAT: ＀ Had to fix their goonchat by forcing a start()", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)]))])]);
				} else {
					yield* g.callName(f, rt.sv(f, "chatOutput"), "load", []);
					if (isEqual((action = (yield* g.call(f, P("/proc/alert"), null, [live(f.src), "How about now? (give it a moment (it may also try to load twice))", "", "Yes", "No"]))), "Yes")) {
						yield* g.call(f, P("/proc/log_game"), null, [fmt("GOONCHAT: ＀ Had to fix their goonchat by forcing a load()", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)]))])]);
					} else {
						if (isEqual((action = (yield* g.call(f, P("/proc/alert"), null, [live(f.src), "Welp, I'm all out of ideas. Try closing byond and reconnecting.\nWe could also disable fancy chat and re-enable oldchat", "", "Thanks anyways", "Switch to old chat"]))), "Switch to old chat")) {
							yield* g.call(f, P("/proc/winset"), null, [live(f.src), "output", "is-visible=true;is-disabled=false"]);
							yield* g.call(f, P("/proc/winset"), null, [live(f.src), "browseroutput", "is-visible=false"]);
						}
						yield* g.call(f, P("/proc/log_game"), null, [fmt("GOONCHAT: ＀ Failed to fix their goonchat window forcing a start() and forcing a load()", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)]))])]);
					}
				}
			} else if ($0 === "Refresh") {
				yield* g.callName(f, rt.sv(f, "chatOutput"), "showChat", []);
				if (isEqual((action = (yield* g.call(f, P("/proc/alert"), null, [live(f.src), "Goon chat refreshing, wait a bit and tell me if it's fixed", "", "Fixed", "Nope, force a reload"]))), "Fixed")) {
					yield* g.call(f, P("/proc/log_game"), null, [fmt("GOONCHAT: ＀ Had to fix their goonchat by forcing a show()", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)]))])]);
				} else {
					rt.setFv(f, "loaded", rt.sv(f, "chatOutput"), 0);
					yield* g.callName(f, rt.sv(f, "chatOutput"), "load", []);
					if (isEqual((action = (yield* g.call(f, P("/proc/alert"), null, [live(f.src), "How about now? (give it a moment)", "", "Yes", "No"]))), "Yes")) {
						yield* g.call(f, P("/proc/log_game"), null, [fmt("GOONCHAT: ＀ Had to fix their goonchat by forcing a load()", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)]))])]);
					} else {
						if (isEqual((action = (yield* g.call(f, P("/proc/alert"), null, [live(f.src), "Welp, I'm all out of ideas. Try closing byond and reconnecting.\nWe could also disable fancy chat and re-enable oldchat", "", "Thanks anyways", "Switch to old chat"]))), "Switch to old chat")) {
							yield* g.call(f, P("/proc/winset"), null, [live(f.src), "output", "is-visible=true;is-disabled=false"]);
							yield* g.call(f, P("/proc/winset"), null, [live(f.src), "browseroutput", "is-visible=false"]);
						}
						yield* g.call(f, P("/proc/log_game"), null, [fmt("GOONCHAT: ＀ Failed to fix their goonchat window forcing a show() and forcing a load()", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)]))])]);
					}
				}
			}
			return live(f.dot);
		} else {
			yield* g.callName(f, rt.sv(f, "chatOutput"), "start", []);
			if (isEqual((action = (yield* g.call(f, P("/proc/alert"), null, [live(f.src), "Manually loading Chat, wait a bit and tell me if it's fixed", "", "Fixed", "Nope"]))), "Fixed")) {
				yield* g.call(f, P("/proc/log_game"), null, [fmt("GOONCHAT: ＀ Had to fix their goonchat by manually calling start()", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)]))])]);
			} else {
				yield* g.callName(f, rt.sv(f, "chatOutput"), "load", []);
				yield* g.call(f, P("/proc/alert"), null, [live(f.src), "How about now? (give it a moment (it may also try to load twice))", "", "Yes", "No"]);
				if (isEqual(live(action), "Yes")) {
					yield* g.call(f, P("/proc/log_game"), null, [fmt("GOONCHAT: ＀ Had to fix their goonchat by manually calling start() and forcing a load()", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)]))])]);
				} else {
					if (isEqual((action = (yield* g.call(f, P("/proc/alert"), null, [live(f.src), "Welp, I'm all out of ideas. Try closing byond and reconnecting.\nWe could also disable fancy chat and re-enable oldchat", "", "Thanks anyways", "Switch to old chat"]))), "Switch to old chat")) {
						yield* g.call(f, P("/proc/winset"), null, [live(f.src), "output", (yield* g.call(f, P("/proc/list2params"), null, [rt.alist(f, ["on-show", "", "is-disabled", "false", "is-visible", "true"])]))]);
						yield* g.call(f, P("/proc/winset"), null, [live(f.src), "browseroutput", "is-disabled=true;is-visible=false"]);
					}
					yield* g.call(f, P("/proc/log_game"), null, [fmt("GOONCHAT: ＀ Failed to fix their goonchat window after manually calling start() and forcing a load()", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)]))])]);
				}
			}
		}
	}
	return f.dot;
}, true, { verb: { name: "Fix chat", category: "OOC" } });

// /client/verb/motd  (code/modules/client/verbs/ooc.dm:226)
rt.def("/client/verb/motd", function motd(f: Frame) {
	if (truthy(rt.gl("join_motd"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<div class=\"motd\">＀</div>", [rt.gl("join_motd")])]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>The Message of the Day has not been set.</span>"]);
	}
	return f.dot;
}, false, { verb: { name: "MOTD", category: "OOC", desc: "Check the Message of the Day" } });

// /client/proc/ignore_key  (code/modules/client/verbs/ooc.dm:242)
rt.def("/client/proc/ignore_key", function ignore_key(f: Frame, client: Value) {
	let C: Value = null;
	let $0: any, $1: any;
	f.vars = () => [C, $0, $1];
	if (truthy((rt.isIn(f, rt.gv(f, "key", (C = live(client))), rt.fv(f, "ignoring", rt.sv(f, "prefs"))) ? 1 : 0))) {
		(rt.modField(f, rt.sv(f, "prefs"), "ignoring", rt.fv(f, "key", live(C)), subtract));
	} else {
		(rt.modField(f, rt.sv(f, "prefs"), "ignoring", rt.fv(f, "key", live(C)), rt.bitOr));
	}
	$0 = live(f.src);
	if (truthy((rt.isIn(f, rt.fv(f, "key", live(C)), rt.fv(f, "ignoring", rt.sv(f, "prefs"))) ? 1 : 0))) {
		$1 = "now";
	} else {
		$1 = "no longer";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("You are ＀ ignoring ＀ on the OOC channel.", [$1, rt.fv(f, "key", live(C))])]);
	rt.callName(f, rt.sv(f, "prefs"), "save_preferences", []);
	return f.dot;
});

// /client/verb/select_ignore  (code/modules/client/verbs/ooc.dm:255)  may sleep
rt.def("/client/verb/select_ignore", function* select_ignore(f: Frame) {
	let selection: Value = null;
	f.vars = () => [selection];
	if (!truthy((selection = (yield* g.op(f, "Prompt", [1], [null, null, "Ignore", "Please, select a player!", (yield* g.call(f, P("/proc/sortKey"), null, [rt.gl("clients")]))]))))) {
		return live(f.dot);
	}
	if (isEqual(live(selection), live(f.src))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "You can't ignore yourself."]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "ignore_key", live(selection));
	return f.dot;
}, true, { verb: { name: "Ignore", category: "OOC", desc: "Ignore a player's messages on the OOC channel" } });

// /client/verb/stop_all_sounds  (ss13.live, not in tg 2017; modern tg's OOC "Stop Sounds"): stops every sound playing for you now, new ones still play
rt.def("/client/verb/stop_all_sounds", function stop_all_sounds(f: Frame) {
	rt.op(f, "Output", [], [live(f.src), rt.call(f, P("/proc/sound"), null, [null])], false);
	return f.dot;
}, false, { verb: { name: "Stop All Sounds", category: "OOC", desc: "Stop the sounds playing for you now; new ones still play" } });
