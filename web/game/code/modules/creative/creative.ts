// tg_js: creative mode's game code (the map itself: src/vm/creative-map.ts). Not from tg.
// You start as a ghost (new_player.ts), and the ghost's button row gets shortcuts to the admin tools (hud/ghost.ts):
// Become human (the Re-enter corpse button), Spawn, Spawn Rings and Drop DynEx Bomb.
// No CentCom announcements (priority_announce.ts, game_mode.ts's intercept report) and no random events (creative-map.ts's config).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual } = rt;

/** True on the Creative map. */
rt.def("/proc/is_creative", function is_creative(f: Frame) {
	return isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "Creative") ? 1 : 0;
});

// A ghost becomes a human where it floats: its old body is brought over if it still has a living one,
// else a new Assistant with the player's own look (character setup) is made, unhurtable like every creative player (job.ts).
rt.def("/mob/dead/observer/proc/become_human", function* become_human(f: Frame) {
	let here: Value = null, mind: Value = null, body: Value = null, H: Value = null, key: Value = null;
	f.vars = () => [here, mind, body, H, key];
	if (!truthy(rt.sv(f, "client")) || !truthy(here = rt.getStep(f, live(f.src), 0))) return 0;
	mind = rt.sv(f, "mind");
	body = truthy(mind) ? rt.fv(f, "current", live(mind)) : null;
	if (rt.istype(live(body), T("/mob/living")) && !truthy(rt.fv(f, "gc_destroyed", live(body)))) {
		yield* g.callName(f, live(body), "forceMove", [live(here)]);
		rt.setSv(f, "can_reenter_corpse", 1);
		return yield* g.srcCall(f, "reenter_corpse");
	}
	key = rt.sv(f, "key");
	H = yield* g.new_(f, T("/mob/living/carbon/human"), [live(here)]);
	yield* g.callName(f, rt.gv(f, "prefs", rt.sv(f, "client")), "copy_to", [live(H)]);
	yield* g.callName(f, rt.fv(f, "dna", live(H)), "update_dna_identity", []);
	rt.setFv(f, "name", live(H), rt.fv(f, "real_name", live(H)));
	if (truthy(mind)) yield* g.callName(f, live(mind), "transfer_to", [live(H)]);
	else yield* g.callName(f, live(H), "mind_initialize", []);
	rt.setFv(f, "key", live(H), live(key));
	yield* g.callName(f, rt.gl("SSjob"), "EquipRank", [live(H), "Assistant", 1]);
	return live(H);
}, true);

// Creative mode's ghost buttons (hud/ghost.ts): Re-enter corpse renamed, then the three shortcuts left of the row.
rt.def("/datum/hud/ghost/proc/add_creative_buttons", function* add_creative_buttons(f: Frame, reenter: Value) {
	let using: Value = null;
	f.vars = () => [reenter, using];
	rt.setFv(f, "name", live(reenter), "Become human");
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/ghost/creative_spawn"), []))), "SOUTH:6,CENTER-6:24");
	rt.modSrcVar(f, "static_inventory", live(using), rt.add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/ghost/creative_rings"), []))), "SOUTH:6,CENTER-5:24");
	rt.modSrcVar(f, "static_inventory", live(using), rt.add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/ghost/creative_bomb"), []))), "SOUTH:6,CENTER-4:24");
	rt.modSrcVar(f, "static_inventory", live(using), rt.add);
	return f.dot;
}, true);

// The ghost's admin shortcut buttons (sprites: icons/mob/screen_ghost.dmi creative_spawn, creative_rings, creative_bomb).
// Each asks what it needs and runs the admin tool, so they work only for an admin (solo: always).
function* adminOf(f: Frame) {
	const holder = rt.gv(f, "holder", rt.fv(f, "client", live(f.usr)));
	if (!truthy(holder)) yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Only admins can use this.</span>"]);
	return holder;
}
function* askWhat(f: Frame, title: string) {
	return yield* g.op(f, "Prompt", [3], [null, null, title, "What? Part of a name or a type path (toolbox, /obj/item/weapon/bikehorn)", null]);
}

rt.type("/obj/screen/ghost/creative_spawn", "/obj/screen/ghost", { name: "Spawn", icon_state: "creative_spawn" });
rt.def("/obj/screen/ghost/creative_spawn/proc/Click", function* Click(f: Frame) {
	const holder = yield* adminOf(f);
	if (!truthy(holder)) return f.dot;
	const what = yield* askWhat(f, "Spawn");
	if (truthy(what)) yield* g.callName(f, holder, "spawn_atom", [what]);
	return f.dot;
}, true);

rt.type("/obj/screen/ghost/creative_rings", "/obj/screen/ghost", { name: "Spawn Rings", icon_state: "creative_rings" });
rt.def("/obj/screen/ghost/creative_rings/proc/Click", function* Click(f: Frame) {
	const holder = yield* adminOf(f);
	if (!truthy(holder)) return f.dot;
	const what = yield* askWhat(f, "Spawn Rings");
	if (truthy(what)) yield* g.callName(f, holder, "spawn_grid", [what]);
	return f.dot;
}, true);

rt.type("/obj/screen/ghost/creative_bomb", "/obj/screen/ghost", { name: "Drop DynEx Bomb", icon_state: "creative_bomb" });
rt.def("/obj/screen/ghost/creative_bomb/proc/Click", function* Click(f: Frame) {
	if (!truthy(yield* adminOf(f))) return f.dot;
	yield* g.callName(f, rt.fv(f, "client", live(f.usr)), "drop_dynex_bomb", []);
	return f.dot;
}, true);
