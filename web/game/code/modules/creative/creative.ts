// tg_js: creative mode's game code (the map itself: src/vm/creative-map.ts). Not from tg.
// You start as a ghost (new_player.ts), and the ghost's button row gets shortcuts to the admin tools (hud/ghost.ts):
// Become human (the Re-enter corpse button), Spawn, Spawn Rings, Drop DynEx Bomb and the mob fight mode.
// No CentCom announcements (priority_announce.ts, game_mode.ts's intercept report) and no random events (creative-map.ts's config).
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;

/** True on the Creative map. */
rt.def("/proc/is_creative", function is_creative(f: Frame) {
	return GLOB.SSmapping.config.map_name == "Creative" ? 1 : 0;
});

// A ghost becomes a human where it floats: its old body is brought over if it still has a living one,
// else a new Assistant with the player's own look (character setup) is made, unhurtable like every creative player (job.ts).
rt.def("/mob/dead/observer/proc/become_human", function* become_human(f: Frame) {
	let here: Value = null;
	if (!this.client || !(here = rt.getStep(f, this, 0))) return 0;
	const mind: Value = this.mind;
	const body: Value = mind ? mind.current : null;
	if (rt.istype(body, T("/mob/living")) && !body.gc_destroyed) {
		yield* body.forceMove(here);
		this.can_reenter_corpse = 1;
		return yield* this.reenter_corpse();
	}
	const key: Value = this.key;
	const H: Value = yield* new_(T("/mob/living/carbon/human"), here);
	yield* this.client.prefs.copy_to(H);
	yield* H.dna.update_dna_identity();
	H.name = H.real_name;
	if (mind) yield* mind.transfer_to(H);
	else yield* H.mind_initialize();
	H.key = key;
	yield* GLOB.SSjob.EquipRank(H, "Assistant", 1);
	return H;
}, true);

// Creative mode's ghost buttons (hud/ghost.ts): Re-enter corpse renamed, then the four shortcuts left of the row.
rt.def("/datum/hud/ghost/proc/add_creative_buttons", function* add_creative_buttons(f: Frame, reenter: Value) {
	let using: Value = null;
	reenter.name = "Become human";
	(using = (yield* new_(T("/obj/screen/ghost/creative_spawn")))).screen_loc = "SOUTH:6,CENTER-6:24";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/ghost/creative_rings")))).screen_loc = "SOUTH:6,CENTER-5:24";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/ghost/creative_bomb")))).screen_loc = "SOUTH:6,CENTER-4:24";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/ghost/creative_fight")))).screen_loc = "SOUTH:6,CENTER-3:24";
	using.look();
	this.static_inventory += using;
	return f.dot;
}, true);

// The ghost's admin shortcut buttons (sprites: icons/mob/screen_ghost.dmi creative_spawn, creative_rings, creative_bomb).
// Each asks what it needs and runs the admin tool, so they work only for an admin (solo: always).
function* adminOf(f: Frame) {
	const holder = rt.fv(f, "holder", rt.fv(f, "client", f.usr));
	if (!holder) yield* g.call(f, P("/proc/to_chat"), null, [f.usr, "<span class='warning'>Only admins can use this.</span>"]);
	return holder;
}
function* askWhat(f: Frame, title: string) {
	return yield* g.op(f, "Prompt", [3], [null, null, title, "What? Part of a name or a type path (toolbox, /obj/item/weapon/bikehorn)", null]);
}

rt.type("/obj/screen/ghost/creative_spawn", "/obj/screen/ghost", { name: "Spawn", icon_state: "creative_spawn" });
rt.def("/obj/screen/ghost/creative_spawn/proc/Click", function* Click(f: Frame) {
	const holder = yield* adminOf(f);
	if (!holder) return f.dot;
	const what = yield* askWhat(f, "Spawn");
	if (what) yield* holder.spawn_atom(what);
	return f.dot;
}, true);

rt.type("/obj/screen/ghost/creative_rings", "/obj/screen/ghost", { name: "Spawn Rings", icon_state: "creative_rings" });
rt.def("/obj/screen/ghost/creative_rings/proc/Click", function* Click(f: Frame) {
	const holder = yield* adminOf(f);
	if (!holder) return f.dot;
	const what = yield* askWhat(f, "Spawn Rings");
	if (what) yield* holder.spawn_grid(what);
	return f.dot;
}, true);

rt.type("/obj/screen/ghost/creative_bomb", "/obj/screen/ghost", { name: "Drop DynEx Bomb", icon_state: "creative_bomb" });
rt.def("/obj/screen/ghost/creative_bomb/proc/Click", function* Click(f: Frame) {
	if (!(yield* adminOf(f))) return f.dot;
	yield* f.usr.client.drop_dynex_bomb();
	return f.dot;
}, true);

// Only the floor (creative-mode-2.md step 3): CentCom (z1) stays loaded, because tg's code counts z-levels and keeps the backup
// shuttle, admin rooms and antag spawns there, but Creative's lists leave it out. True when A isn't on the creative floor (z2).
rt.def("/proc/creative_off_floor", function creative_off_floor(f: Frame, A: Value) {
	const t: Value = rt.getStep(f, A, 0);
	return !t || t.z != 2 ? 1 : 0;
});

// At round start: CentCom's own mobs (the wizard den's pets, Cayenne, the ERT closet's Medibots) are deleted,
// so no mob list (the ghost's Jump to Mob and Orbit, the admin's Jump to Mob) can take you there.
rt.def("/proc/creative_clear_off_floor", function* creative_clear_off_floor(f: Frame) {
	let M: Value = null;
	for (M of each(GLOB.mob_list, T("/mob/living"))) {
		if (!M.ckey && creative_off_floor(M)) yield* qdel(M);
	}
	return f.dot;
}, true);

// The ghost's Teleport on Creative: straight back to the middle of the floor, no area list (the way back from anywhere).
rt.def("/mob/dead/observer/proc/creative_teleport", function* creative_teleport(f: Frame) {
	const spots: Value = GLOB.SSjob.latejoin_trackers;
	const t: Value = spots && rt.len(f, spots) ? rt.index(spots, 1) : null;
	if (!t) return 0;
	rt.setSv(f, "loc", t);
	yield* this.update_parallax_contents();
	return 1;
}, true);

// Mob fight mode (creative-mode-2.md step 4). The ghost's fight button cycles the mode; hostile mobs spawned after that (hostile.ts Initialize
// calls creative_fight_setup) get a faction and attack_same that make them fight as set. Mobs already spawned keep theirs.
// creative_fight_mode: 1 = attack everything (own kind too), 2 = attack all but own kind (the start, nearest to tg), 3 = never attack. Unset counts as 2.
const FIGHT_MODES = ["attack everything", "attack all but own kind", "never attack"];
const FIGHT_ICONS = ["creative_fight_own", "creative_fight_all", "creative_fight_off"];
function fightMode() {
	const m = rt.gl("creative_fight_mode");
	return typeof m === "number" && m >= 1 && m <= 3 ? m : 2;
}

// Own kind = same type. Mode 2 gives each kind its own faction with attack_same 0 (only other factions). Modes 1 and 3 give every mob a
// faction of its own: attack_same 0 (mode 1) makes everyone else a target, attack_same 2 (mode 3, only the same faction) leaves nobody. robust_searching makes CanAttack read attack_same.
rt.def("/proc/creative_fight_setup", function creative_fight_setup(f: Frame, M: Value) {
	const mode = fightMode();
	const id = mode !== 2 ? fmt("＃", [M]) : fmt("＀", [M.type]);
	M.faction = list(fmt("creative ＀", [id]));
	M.robust_searching = 1;
	M.attack_same = mode === 3 ? 2 : 0;
	return 0;
});

rt.type("/obj/screen/ghost/creative_fight", "/obj/screen/ghost", { name: "Mob fight mode", icon_state: "creative_fight_all" });
rt.def("/obj/screen/ghost/creative_fight/proc/look", function look(f: Frame) {
	this.icon_state = FIGHT_ICONS[fightMode() - 1];
	rt.setSv(f, "name", `Mob fight mode: ${FIGHT_MODES[fightMode() - 1]}`);
	return 0;
});
rt.def("/obj/screen/ghost/creative_fight/proc/Click", function* Click(f: Frame) {
	if (!(yield* adminOf(f))) return f.dot;
	rt.setGl("creative_fight_mode", fightMode() % 3 + 1);
	this.look();
	to_chat(f.usr, fmt("<span class='notice'>Mob fight mode: new mobs ＀.</span>", [FIGHT_MODES[fightMode() - 1]]));
	return f.dot;
}, true);
