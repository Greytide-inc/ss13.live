// Types declared in code/game/objects/effects/temporary_visuals that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";

rt.type(11529, "/obj/effect/temp_visual/swarmer", "/obj/effect/temp_visual", {
	icon: rt.rsc("icons/mob/swarmer.dmi"),
	layer: 3.7,
});
rt.type(11531, "/obj/effect/temp_visual/swarmer/dismantle", "/obj/effect/temp_visual/swarmer", {
	icon_state: "dismantle",
	duration: 25,
});
rt.type(11532, "/obj/effect/temp_visual/swarmer/integrate", "/obj/effect/temp_visual/swarmer", {
	icon_state: "integrate",
	duration: 5,
});
rt.type(11535, "/obj/effect/temp_visual/ratvar", "/obj/effect/temp_visual", {
	name: "ratvar's light",
	icon: rt.rsc("icons/effects/clockwork_effects.dmi"),
	duration: 8,
	randomdir: 0,
	layer: 2.08,
});
rt.type(11536, "/obj/effect/temp_visual/ratvar/door", "/obj/effect/temp_visual/ratvar", {
	icon_state: "ratvardoorglow",
	layer: 3.1,
});
rt.type(11537, "/obj/effect/temp_visual/ratvar/door/window", "/obj/effect/temp_visual/ratvar/door", {
	icon_state: "ratvarwindoorglow",
	layer: 3.3,
});
rt.type(11538, "/obj/effect/temp_visual/ratvar/beam", "/obj/effect/temp_visual/ratvar", {
	icon_state: "ratvarbeamglow",
});
rt.type(11539, "/obj/effect/temp_visual/ratvar/beam/door", "/obj/effect/temp_visual/ratvar/beam", {
	layer: 3.1,
});
rt.type(11540, "/obj/effect/temp_visual/ratvar/beam/grille", "/obj/effect/temp_visual/ratvar/beam", {
	layer: 2.9,
});
rt.type(11541, "/obj/effect/temp_visual/ratvar/beam/itemconsume", "/obj/effect/temp_visual/ratvar/beam", {
	layer: 3.6,
});
rt.type(11542, "/obj/effect/temp_visual/ratvar/beam/falsewall", "/obj/effect/temp_visual/ratvar/beam", {
	layer: 3,
});
rt.type(11543, "/obj/effect/temp_visual/ratvar/beam/catwalk", "/obj/effect/temp_visual/ratvar/beam", {
	layer: 2.2,
});
rt.type(11544, "/obj/effect/temp_visual/ratvar/wall", "/obj/effect/temp_visual/ratvar", {
	icon_state: "ratvarwallglow",
});
rt.type(11545, "/obj/effect/temp_visual/ratvar/wall/false", "/obj/effect/temp_visual/ratvar/wall", {
	layer: 3,
});
rt.type(11546, "/obj/effect/temp_visual/ratvar/floor", "/obj/effect/temp_visual/ratvar", {
	icon_state: "ratvarfloorglow",
});
rt.type(11547, "/obj/effect/temp_visual/ratvar/floor/catwalk", "/obj/effect/temp_visual/ratvar/floor", {
	layer: 2.2,
});
rt.type(11548, "/obj/effect/temp_visual/ratvar/window", "/obj/effect/temp_visual/ratvar", {
	icon_state: "ratvarwindowglow",
	layer: 3.2,
});
rt.type(11549, "/obj/effect/temp_visual/ratvar/window/single", "/obj/effect/temp_visual/ratvar/window", {
	icon_state: "ratvarwindowglow_s",
});
rt.type(11550, "/obj/effect/temp_visual/ratvar/gear", "/obj/effect/temp_visual/ratvar", {
	icon_state: "ratvargearglow",
	layer: 2.9,
});
rt.type(11551, "/obj/effect/temp_visual/ratvar/grille", "/obj/effect/temp_visual/ratvar", {
	icon_state: "ratvargrilleglow",
	layer: 2.9,
});
rt.type(11552, "/obj/effect/temp_visual/ratvar/grille/broken", "/obj/effect/temp_visual/ratvar/grille", {
	icon_state: "ratvarbrokengrilleglow",
});
rt.type(11557, "/obj/effect/temp_visual/ratvar/spearbreak", "/obj/effect/temp_visual/ratvar", {
	icon: rt.rsc("icons/effects/64x64.dmi"),
	icon_state: "ratvarspearbreak",
	layer: 3.7,
	pixel_y: -16,
	pixel_x: -16,
});
rt.type(11558, "/obj/effect/temp_visual/ratvar/geis_binding", "/obj/effect/temp_visual/ratvar", {
	icon_state: "geisbinding",
});
rt.type(11559, "/obj/effect/temp_visual/ratvar/geis_binding/top", "/obj/effect/temp_visual/ratvar/geis_binding", {
	icon_state: "geisbinding_top",
});
rt.type(11561, "/obj/effect/temp_visual/ratvar/component/cogwheel", "/obj/effect/temp_visual/ratvar/component", {
	icon_state: "vanguard_cogwheel",
});
rt.type(11562, "/obj/effect/temp_visual/ratvar/component/capacitor", "/obj/effect/temp_visual/ratvar/component", {
	icon_state: "geis_capacitor",
});
rt.type(11563, "/obj/effect/temp_visual/ratvar/component/alloy", "/obj/effect/temp_visual/ratvar/component", {
	icon_state: "replicant_alloy",
});
rt.type(11564, "/obj/effect/temp_visual/ratvar/component/ansible", "/obj/effect/temp_visual/ratvar/component", {
	icon_state: "hierophant_ansible",
});
rt.type(11565, "/obj/effect/temp_visual/ratvar/sigil", "/obj/effect/temp_visual/ratvar", {
	name: "glowing circle",
	icon_state: "sigildull",
});
rt.type(11567, "/obj/effect/temp_visual/ratvar/sigil/vitality", "/obj/effect/temp_visual/ratvar/sigil", {
	light_range: 1.4,
	light_power: 0.5,
	light_color: "#1E8CE1",
	color: "#1E8CE1",
	icon_state: "sigilactivepulse",
	layer: 4.1,
});
rt.type(11568, "/obj/effect/temp_visual/ratvar/sigil/accession", "/obj/effect/temp_visual/ratvar/sigil", {
	color: "#AF0AAF",
	layer: 4.1,
	duration: 70,
	icon_state: "sigilactiveoverlay",
	alpha: 0,
});
rt.type(11569, "/obj/effect/temp_visual/cult", "/obj/effect/temp_visual", {
	icon: rt.rsc("icons/effects/cult_effects.dmi"),
	randomdir: 0,
	duration: 10,
});
rt.type(11570, "/obj/effect/temp_visual/cult/sparks", "/obj/effect/temp_visual/cult", {
	randomdir: 1,
	name: "blood sparks",
	icon_state: "bloodsparkles",
});
rt.type(11571, "/obj/effect/temp_visual/cult/blood", "/obj/effect/temp_visual/cult", {
	name: "blood jaunt",
	duration: 12,
	icon_state: "bloodin",
});
rt.type(11572, "/obj/effect/temp_visual/cult/blood/out", "/obj/effect/temp_visual/cult/blood", {
	icon_state: "bloodout",
});
rt.type(11573, "/obj/effect/temp_visual/cult/sac", "/obj/effect/temp_visual/cult", {
	name: "maw of Nar-Sie",
	icon_state: "sacconsume",
});
rt.type(11574, "/obj/effect/temp_visual/cult/door", "/obj/effect/temp_visual/cult", {
	name: "unholy glow",
	icon_state: "doorglow",
	layer: 3.11,
});
rt.type(11575, "/obj/effect/temp_visual/cult/door/unruned", "/obj/effect/temp_visual/cult/door", {
	icon_state: "unruneddoorglow",
});
rt.type(11576, "/obj/effect/temp_visual/cult/turf", "/obj/effect/temp_visual/cult", {
	name: "unholy glow",
	icon_state: "wallglow",
	layer: 2.08,
});
rt.type(11577, "/obj/effect/temp_visual/cult/turf/floor", "/obj/effect/temp_visual/cult/turf", {
	icon_state: "floorglow",
	duration: 5,
});
rt.type(11579, "/obj/effect/temp_visual/cult/rune_spawn/rune1", "/obj/effect/temp_visual/cult/rune_spawn", {
	turnedness: 181,
	icon_state: "rune1words",
});
rt.type(11580, "/obj/effect/temp_visual/cult/rune_spawn/rune1/inner", "/obj/effect/temp_visual/cult/rune_spawn/rune1", {
	turnedness: 179,
	icon_state: "rune1inner",
});
rt.type(11581, "/obj/effect/temp_visual/cult/rune_spawn/rune1/center", "/obj/effect/temp_visual/cult/rune_spawn/rune1", {
	icon_state: "rune1center",
});
rt.type(11582, "/obj/effect/temp_visual/cult/rune_spawn/rune2", "/obj/effect/temp_visual/cult/rune_spawn", {
	turnedness: 181,
	icon_state: "rune2words",
});
rt.type(11583, "/obj/effect/temp_visual/cult/rune_spawn/rune2/inner", "/obj/effect/temp_visual/cult/rune_spawn/rune2", {
	turnedness: 179,
	icon_state: "rune2inner",
});
rt.type(11584, "/obj/effect/temp_visual/cult/rune_spawn/rune2/center", "/obj/effect/temp_visual/cult/rune_spawn/rune2", {
	icon_state: "rune2center",
});
rt.type(11585, "/obj/effect/temp_visual/cult/rune_spawn/rune3", "/obj/effect/temp_visual/cult/rune_spawn", {
	turnedness: 181,
	icon_state: "rune3words",
});
rt.type(11586, "/obj/effect/temp_visual/cult/rune_spawn/rune3/inner", "/obj/effect/temp_visual/cult/rune_spawn/rune3", {
	turnedness: 179,
	icon_state: "rune3inner",
});
rt.type(11587, "/obj/effect/temp_visual/cult/rune_spawn/rune3/center", "/obj/effect/temp_visual/cult/rune_spawn/rune3", {
	icon_state: "rune3center",
});
rt.type(11588, "/obj/effect/temp_visual/cult/rune_spawn/rune4", "/obj/effect/temp_visual/cult/rune_spawn", {
	turnedness: 181,
	icon_state: "rune4words",
});
rt.type(11589, "/obj/effect/temp_visual/cult/rune_spawn/rune4/inner", "/obj/effect/temp_visual/cult/rune_spawn/rune4", {
	turnedness: 179,
	icon_state: "rune4inner",
});
rt.type(11590, "/obj/effect/temp_visual/cult/rune_spawn/rune4/center", "/obj/effect/temp_visual/cult/rune_spawn/rune4", {
	icon_state: "rune4center",
});
rt.type(11591, "/obj/effect/temp_visual/cult/rune_spawn/rune5", "/obj/effect/temp_visual/cult/rune_spawn", {
	turnedness: 181,
	icon_state: "rune5words",
});
rt.type(11592, "/obj/effect/temp_visual/cult/rune_spawn/rune5/inner", "/obj/effect/temp_visual/cult/rune_spawn/rune5", {
	turnedness: 179,
	icon_state: "rune5inner",
});
rt.type(11593, "/obj/effect/temp_visual/cult/rune_spawn/rune5/center", "/obj/effect/temp_visual/cult/rune_spawn/rune5", {
	icon_state: "rune5center",
});
rt.type(11594, "/obj/effect/temp_visual/cult/rune_spawn/rune6", "/obj/effect/temp_visual/cult/rune_spawn", {
	turnedness: 181,
	icon_state: "rune6words",
});
rt.type(11595, "/obj/effect/temp_visual/cult/rune_spawn/rune6/inner", "/obj/effect/temp_visual/cult/rune_spawn/rune6", {
	turnedness: 179,
	icon_state: "rune6inner",
});
rt.type(11596, "/obj/effect/temp_visual/cult/rune_spawn/rune6/center", "/obj/effect/temp_visual/cult/rune_spawn/rune6", {
	icon_state: "rune6center",
});
rt.type(11597, "/obj/effect/temp_visual/cult/rune_spawn/rune7", "/obj/effect/temp_visual/cult/rune_spawn", {
	turnedness: 181,
	icon_state: "rune7words",
});
rt.type(11598, "/obj/effect/temp_visual/cult/rune_spawn/rune7/inner", "/obj/effect/temp_visual/cult/rune_spawn/rune7", {
	turnedness: 179,
	icon_state: "rune7inner",
});
rt.type(11599, "/obj/effect/temp_visual/cult/rune_spawn/rune7/center", "/obj/effect/temp_visual/cult/rune_spawn/rune7", {
	icon_state: "rune7center",
});
rt.type(11601, "/obj/effect/temp_visual/dir_setting/cult", "/obj/effect/temp_visual/dir_setting", {});
rt.type(11602, "/obj/effect/temp_visual/dir_setting/cult/phase", "/obj/effect/temp_visual/dir_setting/cult", {
	icon: rt.rsc("icons/effects/cult_effects.dmi"),
	name: "phase glow",
	duration: 7,
	icon_state: "cultin",
});
rt.type(11603, "/obj/effect/temp_visual/dir_setting/cult/phase/out", "/obj/effect/temp_visual/dir_setting/cult/phase", {
	icon: rt.rsc("icons/effects/cult_effects.dmi"),
	icon_state: "cultout",
});
rt.type(11605, "/obj/effect/temp_visual/dir_setting/bloodsplatter/xenosplatter", "/obj/effect/temp_visual/dir_setting/bloodsplatter", {
	splatter_type: "xsplatter",
});
rt.type(11606, "/obj/effect/temp_visual/dir_setting/speedbike_trail", "/obj/effect/temp_visual/dir_setting", {
	name: "speedbike trails",
	icon_state: "ion_fade",
	layer: 3.7,
	duration: 10,
	randomdir: 0,
});
rt.type(11608, "/obj/effect/temp_visual/dir_setting/firing_effect/energy", "/obj/effect/temp_visual/dir_setting/firing_effect", {
	icon_state: "firing_effect_energy",
	duration: 3,
});
rt.type(11609, "/obj/effect/temp_visual/dir_setting/firing_effect/magic", "/obj/effect/temp_visual/dir_setting/firing_effect", {
	icon_state: "shieldsparkles",
	duration: 3,
});
rt.type(11610, "/obj/effect/temp_visual/dir_setting/ninja", "/obj/effect/temp_visual/dir_setting", {
	name: "ninja shadow",
	icon: rt.rsc("icons/mob/mob.dmi"),
	icon_state: "uncloak",
	duration: 9,
});
rt.type(11611, "/obj/effect/temp_visual/dir_setting/ninja/cloak", "/obj/effect/temp_visual/dir_setting/ninja", {
	icon_state: "cloak",
});
rt.type(11612, "/obj/effect/temp_visual/dir_setting/ninja/shadow", "/obj/effect/temp_visual/dir_setting/ninja", {
	icon_state: "shadow",
});
rt.type(11613, "/obj/effect/temp_visual/dir_setting/ninja/phase", "/obj/effect/temp_visual/dir_setting/ninja", {
	name: "ninja energy",
	icon_state: "phasein",
});
rt.type(11614, "/obj/effect/temp_visual/dir_setting/ninja/phase/out", "/obj/effect/temp_visual/dir_setting/ninja/phase", {
	icon_state: "phaseout",
});
rt.type(11615, "/obj/effect/temp_visual/dir_setting/wraith", "/obj/effect/temp_visual/dir_setting", {
	name: "blood",
	icon: rt.rsc("icons/mob/mob.dmi"),
	icon_state: "phase_shift2",
	duration: 12,
});
rt.type(11616, "/obj/effect/temp_visual/dir_setting/wraith/out", "/obj/effect/temp_visual/dir_setting/wraith", {
	icon_state: "phase_shift",
});
rt.type(11617, "/obj/effect/temp_visual/dir_setting/tailsweep", "/obj/effect/temp_visual/dir_setting", {
	icon_state: "tailsweep",
	duration: 4,
});
rt.type(11619, "/obj/effect/temp_visual/wizard", "/obj/effect/temp_visual", {
	name: "water",
	icon: rt.rsc("icons/mob/mob.dmi"),
	icon_state: "reappear",
	duration: 5,
});
rt.type(11620, "/obj/effect/temp_visual/wizard/out", "/obj/effect/temp_visual/wizard", {
	icon_state: "liquify",
	duration: 12,
});
rt.type(11621, "/obj/effect/temp_visual/monkeyify", "/obj/effect/temp_visual", {
	icon: rt.rsc("icons/mob/mob.dmi"),
	icon_state: "h2monkey",
	duration: 22,
});
rt.type(11622, "/obj/effect/temp_visual/monkeyify/humanify", "/obj/effect/temp_visual/monkeyify", {
	icon_state: "monkey2h",
});
rt.type(11623, "/obj/effect/temp_visual/borgflash", "/obj/effect/temp_visual", {
	icon: rt.rsc("icons/mob/mob.dmi"),
	icon_state: "blspell",
	duration: 5,
});
rt.type(11624, "/obj/effect/temp_visual/guardian", "/obj/effect/temp_visual", {
	randomdir: 0,
});
rt.type(11625, "/obj/effect/temp_visual/guardian/phase", "/obj/effect/temp_visual/guardian", {
	duration: 5,
	icon_state: "phasein",
});
rt.type(11626, "/obj/effect/temp_visual/guardian/phase/out", "/obj/effect/temp_visual/guardian/phase", {
	icon_state: "phaseout",
});
rt.type(11629, "/obj/effect/temp_visual/decoy/fading/fivesecond", "/obj/effect/temp_visual/decoy/fading", {
	duration: 50,
});
rt.type(11630, "/obj/effect/temp_visual/decoy/fading/halfsecond", "/obj/effect/temp_visual/decoy/fading", {
	duration: 5,
});
rt.type(11631, "/obj/effect/temp_visual/small_smoke", "/obj/effect/temp_visual", {
	icon_state: "smoke",
	duration: 50,
});
rt.type(11632, "/obj/effect/temp_visual/small_smoke/halfsecond", "/obj/effect/temp_visual/small_smoke", {
	duration: 5,
});
rt.type(11633, "/obj/effect/temp_visual/fire", "/obj/effect/temp_visual", {
	light_range: 3,
	light_color: "#FAA019",
	icon: rt.rsc("icons/effects/fire.dmi"),
	icon_state: "3",
	duration: 10,
});
rt.type(11634, "/obj/effect/temp_visual/revenant", "/obj/effect/temp_visual", {
	name: "spooky lights",
	icon_state: "purplesparkles",
});
rt.type(11635, "/obj/effect/temp_visual/revenant/cracks", "/obj/effect/temp_visual/revenant", {
	name: "glowing cracks",
	icon_state: "purplecrack",
	duration: 6,
});
rt.type(11636, "/obj/effect/temp_visual/gravpush", "/obj/effect/temp_visual", {
	name: "gravity wave",
	icon_state: "shieldsparkles",
	duration: 5,
});
rt.type(11637, "/obj/effect/temp_visual/telekinesis", "/obj/effect/temp_visual", {
	name: "telekinetic force",
	icon_state: "empdisable",
	duration: 5,
});
rt.type(11638, "/obj/effect/temp_visual/emp", "/obj/effect/temp_visual", {
	name: "emp sparks",
	icon_state: "empdisable",
});
rt.type(11639, "/obj/effect/temp_visual/emp/pulse", "/obj/effect/temp_visual/emp", {
	name: "emp pulse",
	icon_state: "emppulse",
	duration: 8,
	randomdir: 0,
});
rt.type(11641, "/obj/effect/temp_visual/gib_animation/animal", "/obj/effect/temp_visual/gib_animation", {
	icon: rt.rsc("icons/mob/animal.dmi"),
});
rt.type(11643, "/obj/effect/temp_visual/mummy_animation", "/obj/effect/temp_visual", {
	icon: rt.rsc("icons/mob/mob.dmi"),
	icon_state: "mummy_revive",
	duration: 20,
});
rt.type(11645, "/obj/effect/temp_visual/kinetic_blast", "/obj/effect/temp_visual", {
	name: "kinetic explosion",
	icon: rt.rsc("icons/obj/projectiles.dmi"),
	icon_state: "kinetic_blast",
	layer: 4.5,
	duration: 4,
});
rt.type(11646, "/obj/effect/temp_visual/explosion", "/obj/effect/temp_visual", {
	name: "explosion",
	icon: rt.rsc("icons/effects/96x96.dmi"),
	icon_state: "explosion",
	pixel_x: -32,
	pixel_y: -32,
	duration: 8,
});
rt.type(11647, "/obj/effect/temp_visual/explosion/fast", "/obj/effect/temp_visual/explosion", {
	icon_state: "explosionfast",
	duration: 4,
});
rt.type(11648, "/obj/effect/temp_visual/blob", "/obj/effect/temp_visual", {
	name: "blob",
	icon_state: "blob_attack",
	alpha: 140,
	randomdir: 0,
	duration: 6,
});
rt.type(11650, "/obj/effect/temp_visual/impact_effect/red_laser", "/obj/effect/temp_visual/impact_effect", {
	icon_state: "impact_laser",
	duration: 4,
});
rt.type(11651, "/obj/effect/temp_visual/impact_effect/red_laser/wall", "/obj/effect/temp_visual/impact_effect/red_laser", {
	icon_state: "impact_laser_wall",
	duration: 10,
});
rt.type(11652, "/obj/effect/temp_visual/impact_effect/blue_laser", "/obj/effect/temp_visual/impact_effect", {
	icon_state: "impact_laser_blue",
	duration: 4,
});
rt.type(11653, "/obj/effect/temp_visual/impact_effect/green_laser", "/obj/effect/temp_visual/impact_effect", {
	icon_state: "impact_laser_green",
	duration: 4,
});
rt.type(11654, "/obj/effect/temp_visual/impact_effect/purple_laser", "/obj/effect/temp_visual/impact_effect", {
	icon_state: "impact_laser_purple",
	duration: 4,
});
rt.type(11655, "/obj/effect/temp_visual/impact_effect/ion", "/obj/effect/temp_visual/impact_effect", {
	icon_state: "shieldsparkles",
	duration: 6,
});
rt.type(11658, "/obj/effect/temp_visual/bleed/explode", "/obj/effect/temp_visual/bleed", {
	shrink: 0,
	icon_state: "bleed10",
	duration: 12,
});
rt.type(11674, "/obj/effect/temp_visual/lavastaff", "/obj/effect/temp_visual", {
	duration: 50,
	icon_state: "lavastaff_warn",
});
rt.type(11675, "/obj/effect/temp_visual/paper_scatter", "/obj/effect/temp_visual", {
	anchored: 1,
	duration: 5,
	randomdir: 0,
	name: "scattering paper",
	desc: "Pieces of paper scattering to the wind.",
	layer: 2.04,
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "paper_scatter",
});
rt.type(11677, "/obj/effect/temp_visual/dragon_swoop", "/obj/effect/temp_visual", {
	duration: 5,
	name: "certain death",
	desc: "Don't just stand there, move!",
	icon: rt.rsc("icons/effects/96x96.dmi"),
	icon_state: "landing",
	layer: 3.7,
	pixel_x: -32,
	pixel_y: -32,
	color: "#FF0000",
});
rt.type(11678, "/obj/effect/temp_visual/dragon_swoop/bubblegum", "/obj/effect/temp_visual/dragon_swoop", {
	duration: 10,
});
rt.type(11679, "/obj/effect/temp_visual/bubblegum_hands", "/obj/effect/temp_visual", {
	duration: 9,
	icon: rt.rsc("icons/effects/bubblegum.dmi"),
});
rt.type(11680, "/obj/effect/temp_visual/bubblegum_hands/rightthumb", "/obj/effect/temp_visual/bubblegum_hands", {
	icon_state: "rightthumbgrab",
});
rt.type(11681, "/obj/effect/temp_visual/bubblegum_hands/leftthumb", "/obj/effect/temp_visual/bubblegum_hands", {
	icon_state: "leftthumbgrab",
});
rt.type(11682, "/obj/effect/temp_visual/bubblegum_hands/rightpaw", "/obj/effect/temp_visual/bubblegum_hands", {
	icon_state: "rightpawgrab",
	layer: 3.7,
});
rt.type(11683, "/obj/effect/temp_visual/bubblegum_hands/leftpaw", "/obj/effect/temp_visual/bubblegum_hands", {
	icon_state: "leftpawgrab",
	layer: 3.7,
});
rt.type(11684, "/obj/effect/temp_visual/bubblegum_hands/rightsmack", "/obj/effect/temp_visual/bubblegum_hands", {
	icon_state: "rightsmack",
});
rt.type(11685, "/obj/effect/temp_visual/bubblegum_hands/leftsmack", "/obj/effect/temp_visual/bubblegum_hands", {
	icon_state: "leftsmack",
});
rt.type(11694, "/obj/effect/temp_visual/necropolis", "/obj/effect/temp_visual", {
	duration: 6,
	icon: rt.rsc("icons/effects/96x96.dmi"),
	icon_state: "door_closing",
	appearance_flags: 0,
	layer: 4.3,
	pixel_x: -32,
	pixel_y: -32,
});
rt.type(11695, "/obj/effect/temp_visual/necropolis/open", "/obj/effect/temp_visual/necropolis", {
	duration: 38,
	icon_state: "door_opening",
});
