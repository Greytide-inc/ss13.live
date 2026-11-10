// Based on /tg/station's code/game/gamemodes/nuclear/nuclear_challenge.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9215, "/obj/item/device/nuclear_challenge", "/obj/item/device", {
	declaring_war: 0,
	name: "Declaration of War (Challenge Mode)",
	icon_state: "gangtool-red",
	item_state: "walkietalkie",
	desc: "Use to send a declaration of hostilities to the target, delaying your shuttle departure for 20 minutes while they prepare for your assault.  Such a brazen move will attract the attention of powerful benefactors within the Syndicate, who will supply your team with a massive amount of bonus telecrystals.  Must be used within five minutes, or your benefactors will lose interest.",
});

// nuclear_challenge.dm:16
rt.def("/obj/item/device/nuclear_challenge/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let V: Value = null, board: Value = null, U: Value = null;
	if (!this.check_allowed(user)) {
		return f.dot;
	}
	this.declaring_war = 1;
	let are_you_sure: Value = (yield* alert(user, `Consult your team carefully before you declare war on ${station_name()}]. Are you sure you want to alert the enemy crew? You have ${-round((rt.worldTime(f) - GLOB.SSticker.round_start_time - CHALLENGE_TIME_LIMIT) / 10)} seconds to decide`, "Declare war?", "Yes", "No"));
	this.declaring_war = 0;
	if (!this.check_allowed(user)) {
		return f.dot;
	}
	if (are_you_sure == "No") {
		to_chat(user, "On second thought, the element of surprise isn't so bad after all.");
		return f.dot;
	}
	let war_declaration: Value = `${user.real_name} has declared his intent to utterly destroy ${station_name()} with a nuclear device, and dares the crew to try and stop them.`;
	this.declaring_war = 1;
	let custom_threat: Value = (yield* alert(user, "Do you want to customize your declaration?", "Customize?", "Yes", "No"));
	this.declaring_war = 0;
	if (!this.check_allowed(user)) {
		return f.dot;
	}
	if (custom_threat == "Yes") {
		this.declaring_war = 1;
		war_declaration = (yield* stripped_input(user, "Insert your custom declaration", "Declaration"));
		this.declaring_war = 0;
	}
	if (!this.check_allowed(user) || !war_declaration) {
		return f.dot;
	}
	yield* priority_announce(war_declaration, { title: "Declaration of War", sound: rt.rsc("sound/machines/alarm.ogg") });
	to_chat(user, "You've attracted the attention of powerful forces within the syndicate. A bonus bundle of telecrystals has been granted to your team. Great things await you if you complete the mission.");
	for (V of each(GLOB.syndicate_shuttle_boards)) {
		(board = V).challenge = 1;
	}
	(U = (yield* new_(T("/obj/item/device/radio/uplink/nuclear"), rt.getStep(f, user, 0)))).hidden_uplink.owner = `${user.key}`;
	U.hidden_uplink.telecrystals = CHALLENGE_TELECRYSTALS;
	yield* U.hidden_uplink.set_gamemode(T("/datum/game_mode/nuclear"));
	GLOB.config.shuttle_refuel_delay = max(GLOB.config.shuttle_refuel_delay, CHALLENGE_SHUTTLE_DELAY);
	yield* qdel(this);
	return f.dot;
}, true);

// nuclear_challenge.dm:65
rt.def("/obj/item/device/nuclear_challenge/proc/check_allowed", function check_allowed(f: Frame, user: Value) {
	let V: Value = null, board: Value = null;
	if (this.declaring_war) {
		to_chat(user, "You are already in the process of declaring war! Make your mind up.");
		return 0;
	}
	if (rt.len(f, GLOB.player_list) < 50) {
		to_chat(user, "The enemy crew is too small to be worth declaring war on.");
		return 0;
	}
	if (user.z != 1) {
		to_chat(user, "You have to be at your base to use this.");
		return 0;
	}
	if (rt.worldTime(f) - GLOB.SSticker.round_start_time > 3000) {
		to_chat(user, "It's too late to declare hostilities. Your benefactors are already busy with other schemes. You'll have to make do with what you have on hand.");
		return 0;
	}
	for (V of each(GLOB.syndicate_shuttle_boards)) {
		if ((board = V).moved) {
			to_chat(user, "The shuttle has already been moved! You have forfeit the right to declare war.");
			return 0;
		}
	}
	return 1;
});
