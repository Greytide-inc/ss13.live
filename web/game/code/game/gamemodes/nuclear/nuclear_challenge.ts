// From code/game/gamemodes/nuclear/nuclear_challenge.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9215, "/obj/item/device/nuclear_challenge", "/obj/item/device", {
	declaring_war: 0,
	name: "Declaration of War (Challenge Mode)",
	icon_state: "gangtool-red",
	item_state: "walkietalkie",
	desc: "Use to send a declaration of hostilities to the target, delaying your shuttle departure for 20 minutes while they prepare for your assault.  Such a brazen move will attract the attention of powerful benefactors within the Syndicate, who will supply your team with a massive amount of bonus telecrystals.  Must be used within five minutes, or your benefactors will lose interest.",
});

// /obj/item/device/nuclear_challenge/proc/attack_self  (code/game/gamemodes/nuclear/nuclear_challenge.dm:16)  may sleep
rt.def("/obj/item/device/nuclear_challenge/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let are_you_sure: Value = null, war_declaration: Value = null, custom_threat: Value = null, V: Value = null, board: Value = null, U: Value = null;
	let $e: any;
	f.vars = () => [user, are_you_sure, war_declaration, custom_threat, V, board, U, $e];
	if (!truthy((yield* g.srcCall(f, "check_allowed", live(user))))) {
		return live(f.dot);
	}
	rt.setSv(f, "declaring_war", 1);
	are_you_sure = (yield* g.call(f, P("/proc/alert"), null, [live(user), fmt("Consult your team carefully before you declare war on ＀]. Are you sure you want to alert the enemy crew? You have ＀ seconds to decide", [(yield* g.call(f, P("/proc/station_name"), null, [])), rt.neg((yield* g.call(f, P("/proc/round"), null, [divide(subtract(subtract(rt.worldTime(f), rt.fv(f, "round_start_time", rt.gl("SSticker"))), 3000), 10)])))]), "Declare war?", "Yes", "No"]));
	rt.setSv(f, "declaring_war", 0);
	if (!truthy((yield* g.srcCall(f, "check_allowed", live(user))))) {
		return live(f.dot);
	}
	if (isEqual(live(are_you_sure), "No")) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "On second thought, the element of surprise isn't so bad after all."]);
		return live(f.dot);
	}
	war_declaration = fmt("＀ has declared his intent to utterly destroy ＀ with a nuclear device, and dares the crew to try and stop them.", [rt.fv(f, "real_name", live(user)), (yield* g.call(f, P("/proc/station_name"), null, []))]);
	rt.setSv(f, "declaring_war", 1);
	custom_threat = (yield* g.call(f, P("/proc/alert"), null, [live(user), "Do you want to customize your declaration?", "Customize?", "Yes", "No"]));
	rt.setSv(f, "declaring_war", 0);
	if (!truthy((yield* g.srcCall(f, "check_allowed", live(user))))) {
		return live(f.dot);
	}
	if (isEqual(live(custom_threat), "Yes")) {
		rt.setSv(f, "declaring_war", 1);
		war_declaration = (yield* g.call(f, P("/proc/stripped_input"), null, [live(user), "Insert your custom declaration", "Declaration"]));
		rt.setSv(f, "declaring_war", 0);
	}
	if ((!truthy((yield* g.srcCall(f, "check_allowed", live(user)))) || !truthy(live(war_declaration)))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/priority_announce"), null, [null, live(war_declaration), "title", "Declaration of War", "sound", rt.rsc("sound/machines/alarm.ogg")], rt.Args.Named);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "You've attracted the attention of powerful forces within the syndicate. A bonus bundle of telecrystals has been granted to your team. Great things await you if you complete the mission."]);
	V = null;
	rt.forList(f, 0, rt.gl("syndicate_shuttle_boards"));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		rt.setFv(f, "challenge", (board = live(V)), 1);
	}
	rt.endFor(f, 0);
	rt.setFv(f, "owner", rt.gv(f, "hidden_uplink", (U = (yield* g.new_(f, T("/obj/item/device/radio/uplink/nuclear"), [rt.getStep(f, live(user), 0)])))), fmt("＀", [rt.fv(f, "key", live(user))]));
	rt.setFv(f, "telecrystals", rt.fv(f, "hidden_uplink", live(U)), 280);
	yield* g.callName(f, rt.fv(f, "hidden_uplink", live(U)), "set_gamemode", [T("/datum/game_mode/nuclear")]);
	rt.setFv(f, "shuttle_refuel_delay", rt.gl("config"), (yield* g.call(f, P("/proc/max"), null, [rt.fv(f, "shuttle_refuel_delay", rt.gl("config")), 15000])));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/device/nuclear_challenge/proc/check_allowed  (code/game/gamemodes/nuclear/nuclear_challenge.dm:65)
rt.def("/obj/item/device/nuclear_challenge/proc/check_allowed", function check_allowed(f: Frame, user: Value) {
	let V: Value = null, board: Value = null;
	let $e: any;
	f.vars = () => [V, board, $e];
	if (truthy(rt.sv(f, "declaring_war"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "You are already in the process of declaring war! Make your mind up."]);
		return 0;
	}
	if (rt.lt(rt.len(f, rt.gl("player_list")), 50)) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "The enemy crew is too small to be worth declaring war on."]);
		return 0;
	}
	if (!isEqual(rt.fv(f, "z", live(user)), 1)) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "You have to be at your base to use this."]);
		return 0;
	}
	if (rt.gt(subtract(rt.worldTime(f), rt.fv(f, "round_start_time", rt.gl("SSticker"))), 3000)) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "It's too late to declare hostilities. Your benefactors are already busy with other schemes. You'll have to make do with what you have on hand."]);
		return 0;
	}
	V = null;
	rt.forList(f, 0, rt.gl("syndicate_shuttle_boards"));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		if (truthy(rt.gv(f, "moved", (board = live(V))))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), "The shuttle has already been moved! You have forfeit the right to declare war."]);
			return 0;
		}
	}
	rt.endFor(f, 0);
	return 1;
});
