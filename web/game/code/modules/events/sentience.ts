// Based on /tg/station's code/modules/events/sentience.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(283, "/datum/round_event/ghost_role/sentience", "/datum/round_event/ghost_role", {
	animals: 1,
	one: "one",
	minimum_required: 1,
	role_name: "random animal",
});

// sentience.dm:14
rt.def("/datum/round_event/ghost_role/sentience/proc/start", function* start(f: Frame) {
	let sentience_report: Value = `<font size=3><b>${command_name()} Medium-Priority Update</b></font>`;
	let data: Value = pick("scans from our long-range sensors", "our sophisticated probabilistic models", "our omnipotence", "the communications traffic on your station", "energy emissions we detected", "[REDACTED]");
	let pets: Value = pick("animals/bots", "bots/animals", "pets", "simple animals", "lesser lifeforms", "[REDACTED]");
	let strength: Value = pick("human", "moderate", "lizard", "security", "command", "clown", "low", "very low", "[REDACTED]");
	sentience_report += `<br><br>Based on ${data}, we believe that ${this.one} of the station's ${pets} has developed ${strength} level intelligence, and the ability to communicate.`;
	yield* print_command_report({ text: sentience_report });
	yield* parent_proc();
	return f.dot;
}, true);

// sentience.dm:27
rt.def("/datum/round_event/ghost_role/sentience/proc/spawn_role", function* spawn_role(f: Frame) {
	let L: Value = null, _T: Value = null, SA: Value = null, SG: Value = null;
	let candidates: Value = (yield* this.get_candidates("xenomorph", null, "xenomorph"));
	let potential: Value = list();
	for (L of each(GLOB.living_mob_list, T("/mob/living/simple_animal"))) {
		if ((_T = rt.getStep(f, L, 0)).z != ZLEVEL_STATION) {
			continue;
		}
		if (!rt.isIn(f, L, GLOB.player_list) && !L.mind) {
			potential += L;
		}
	}
	if (!rt.len(f, potential)) {
		return WAITING_FOR_SOMETHING;
	}
	if (!rt.len(f, candidates)) {
		return NOT_ENOUGH_PLAYERS;
	}
	let spawned_animals: Value = 0;
	while (spawned_animals < this.animals && rt.len(f, candidates) && rt.len(f, potential)) {
		SA = pick_n_take(potential);
		SG = pick_n_take(candidates);
		spawned_animals++;
		SA.key = SG.key;
		yield* SA.grant_language(T("/datum/language/common"));
		if (!SA.secondary_flags) {
			SA.secondary_flags = list();
		}
		rt.setAt(SA.secondary_flags, "omnitongue", 1);
		SA.sentience_act();
		SA.maxHealth = max(SA.maxHealth, 200);
		SA.health = SA.maxHealth;
		SA.del_on_death = 0;
		this.spawned_mobs += SA;
		to_chat(SA, "<span class='userdanger'>Hello world!</span>");
		to_chat(SA, "<span class='warning'>Due to freak radiation and/or chemicals and/or lucky chance, you have gained human level intelligence and the ability to speak and understand human language!</span>");
	}
	return SUCCESSFUL_SPAWN;
}, true);
