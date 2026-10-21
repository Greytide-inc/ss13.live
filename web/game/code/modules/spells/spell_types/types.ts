// Types declared in code/modules/spells/spell_types that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(11282, "/obj/effect/proc_holder/spell/targeted/area_teleport/teleport", "/obj/effect/proc_holder/spell/targeted/area_teleport", {
	include_user: 1,
	sound1: rt.rsc("sound/magic/teleport_diss.ogg"),
	sound2: rt.rsc("sound/magic/teleport_app.ogg"),
	name: "Teleport",
	desc: "This spell teleports you to a type of area of your selection.",
	school: "abjuration",
	charge_max: 600,
	clothes_req: 1,
	invocation: "SCYAR NILA",
	invocation_type: "shout",
	range: -1,
	cooldown_min: 200,
	smoke_spread: 1,
	smoke_amt: 2,
});
rt.type(11286, "/obj/effect/proc_holder/spell/targeted/conjure_item/summon_pitchfork", "/obj/effect/proc_holder/spell/targeted/conjure_item", {
	include_user: 1,
	item_type: rt.typePath("/obj/item/weapon/twohanded/pitchfork/demonic"),
	name: "Summon Pitchfork",
	desc: "A devil's weapon of choice.  Use this to summon/unsummon your pitchfork.",
	invocation_type: "none",
	range: -1,
	clothes_req: 0,
	school: "conjuration",
	charge_max: 150,
	cooldown_min: 10,
	action_icon_state: "pitchfork",
	action_background_icon_state: "bg_demon",
});
rt.type(11287, "/obj/effect/proc_holder/spell/targeted/conjure_item/summon_pitchfork/greater", "/obj/effect/proc_holder/spell/targeted/conjure_item/summon_pitchfork", {
	item_type: rt.typePath("/obj/item/weapon/twohanded/pitchfork/demonic/greater"),
});
rt.type(11288, "/obj/effect/proc_holder/spell/targeted/conjure_item/summon_pitchfork/ascended", "/obj/effect/proc_holder/spell/targeted/conjure_item/summon_pitchfork", {
	item_type: rt.typePath("/obj/item/weapon/twohanded/pitchfork/demonic/ascended"),
});
rt.type(11289, "/obj/effect/proc_holder/spell/targeted/conjure_item/violin", "/obj/effect/proc_holder/spell/targeted/conjure_item", {
	item_type: rt.typePath("/obj/item/device/instrument/violin/golden"),
	desc: "A devil's instrument of choice.  Use this to summon/unsummon your golden violin.",
	invocation_type: "whisper",
	invocation: "I aint have this much fun since Georgia.",
	action_icon_state: "golden_violin",
	name: "Summon golden violin",
	action_background_icon_state: "bg_demon",
});
rt.type(11291, "/obj/effect/proc_holder/spell/targeted/conjure_item/spellpacket/robeless", "/obj/effect/proc_holder/spell/targeted/conjure_item/spellpacket", {
	clothes_req: 0,
});
rt.type(11293, "/obj/effect/proc_holder/spell/targeted/ethereal_jaunt/shift", "/obj/effect/proc_holder/spell/targeted/ethereal_jaunt", {
	include_user: 1,
	name: "Phase Shift",
	desc: "This spell allows you to pass through walls",
	school: "transmutation",
	charge_max: 250,
	clothes_req: 0,
	invocation: "none",
	invocation_type: "none",
	range: -1,
	jaunt_duration: 50,
	action_icon_state: "phaseshift",
	action_background_icon_state: "bg_demon",
	jaunt_in_time: 12,
	jaunt_in_type: rt.typePath("/obj/effect/temp_visual/dir_setting/wraith"),
	jaunt_out_type: rt.typePath("/obj/effect/temp_visual/dir_setting/wraith/out"),
});
rt.type(11294, "/obj/effect/proc_holder/spell/targeted/ethereal_jaunt/shift/golem", "/obj/effect/proc_holder/spell/targeted/ethereal_jaunt/shift", {
	charge_max: 800,
	jaunt_in_type: rt.typePath("/obj/effect/temp_visual/dir_setting/cult/phase"),
	jaunt_out_type: rt.typePath("/obj/effect/temp_visual/dir_setting/cult/phase/out"),
});
rt.type(11296, "/obj/effect/proc_holder/spell/targeted/projectile/magic_missile", "/obj/effect/proc_holder/spell/targeted/projectile", {
	max_targets: 0,
	name: "Magic Missile",
	desc: "This spell fires several, slow moving, magic projectiles at nearby targets.",
	school: "evocation",
	charge_max: 200,
	clothes_req: 1,
	invocation: "FORTI GY AMA",
	invocation_type: "shout",
	range: 7,
	cooldown_min: 60,
	proj_icon_state: "magicm",
	proj_name: "a magic missile",
	proj_lingering: 1,
	proj_type: "/obj/effect/proc_holder/spell/targeted/inflict_handler/magic_missile",
	proj_lifespan: 20,
	proj_step_delay: 5,
	proj_trail: 1,
	proj_trail_lifespan: 5,
	proj_trail_icon_state: "magicmd",
	action_icon_state: "magicm",
	sound: rt.rsc("sound/magic/magic_missile.ogg"),
});
rt.type(11297, "/obj/effect/proc_holder/spell/targeted/projectile/magic_missile/lesser", "/obj/effect/proc_holder/spell/targeted/projectile/magic_missile", {
	max_targets: 6,
	name: "Lesser Magic Missile",
	desc: "This spell fires several, slow moving, magic projectiles at nearby targets.",
	school: "evocation",
	charge_max: 400,
	clothes_req: 0,
	invocation: "none",
	invocation_type: "none",
	proj_lifespan: 10,
	action_icon_state: "magicm",
	action_background_icon_state: "bg_demon",
});
rt.type(11306, "/obj/effect/proc_holder/spell/targeted/sintouch/ascended", "/obj/effect/proc_holder/spell/targeted/sintouch", {
	max_targets: 10,
	name: "Greater sin touch",
	charge_max: 100,
	range: 7,
});
rt.type(11312, "/obj/effect/proc_holder/spell/targeted/emplosion/disable_tech", "/obj/effect/proc_holder/spell/targeted/emplosion", {
	include_user: 1,
	emp_heavy: 6,
	emp_light: 10,
	name: "Disable Tech",
	desc: "This spell disables all weapons, cameras and most other technology in range.",
	charge_max: 400,
	clothes_req: 1,
	invocation: "NEC CANTIO",
	invocation_type: "shout",
	range: -1,
	cooldown_min: 200,
	sound: rt.rsc("sound/magic/disable_tech.ogg"),
});
rt.type(11317, "/obj/effect/proc_holder/spell/targeted/genetic/mutate", "/obj/effect/proc_holder/spell/targeted/genetic", {
	include_user: 1,
	mutations: null,
	duration: 300,
	name: "Mutate",
	desc: "This spell causes you to turn into a hulk and gain laser vision for a short while.",
	school: "transmutation",
	charge_max: 400,
	clothes_req: 1,
	invocation: "BIRUZ BENNAR",
	invocation_type: "shout",
	range: -1,
	cooldown_min: 300,
	action_icon_state: "mutate",
	sound: rt.rsc("sound/magic/mutate.ogg"),
});
rt.type(11320, "/obj/effect/proc_holder/spell/targeted/infinite_guns/gun", "/obj/effect/proc_holder/spell/targeted/infinite_guns", {});
rt.type(11321, "/obj/effect/proc_holder/spell/targeted/infinite_guns/arcane_barrage", "/obj/effect/proc_holder/spell/targeted/infinite_guns", {
	summon_path: rt.typePath("/obj/item/weapon/gun/ballistic/shotgun/boltaction/enchanted/arcane_barrage"),
	name: "Arcane Barrage",
	desc: "Fire a torrent of arcane energy at your foes with this (powerful) spell. Requires both hands free to use. Learning this spell makes you unable to learn Lesser Summon Gun.",
	action_icon_state: "arcane_barrage",
});
rt.type(11323, "/obj/effect/proc_holder/spell/targeted/inflict_handler/magic_missile", "/obj/effect/proc_holder/spell/targeted/inflict_handler", {
	amt_knockdown: 60,
	sound: rt.rsc("sound/magic/mm_hit.ogg"),
});
rt.type(11324, "/obj/effect/proc_holder/spell/targeted/inflict_handler/blind", "/obj/effect/proc_holder/spell/targeted/inflict_handler", {
	amt_eye_blind: 10,
	amt_eye_blurry: 20,
	sound: rt.rsc("sound/magic/blind.ogg"),
});
rt.type(11332, "/obj/effect/proc_holder/spell/targeted/shapeshift/dragon", "/obj/effect/proc_holder/spell/targeted/shapeshift", {
	shapeshift_type: rt.typePath("/mob/living/simple_animal/hostile/megafauna/dragon/lesser"),
	name: "Dragon Form",
	desc: "Take on the shape a lesser ash drake.",
	invocation: "RAAAAAAAAWR!",
});
rt.type(11336, "/obj/effect/proc_holder/spell/targeted/touch/disintegrate", "/obj/effect/proc_holder/spell/targeted/touch", {
	hand_path: "/obj/item/weapon/melee/touch_attack/disintegrate",
	name: "Disintegrate",
	desc: "This spell charges your hand with vile energy that can be used to violently explode victims.",
	school: "evocation",
	charge_max: 600,
	clothes_req: 1,
	cooldown_min: 200,
	action_icon_state: "gib",
});
rt.type(11337, "/obj/effect/proc_holder/spell/targeted/touch/flesh_to_stone", "/obj/effect/proc_holder/spell/targeted/touch", {
	hand_path: "/obj/item/weapon/melee/touch_attack/fleshtostone",
	name: "Flesh to Stone",
	desc: "This spell charges your hand with the power to turn victims into inert statues for a long period of time.",
	school: "transmutation",
	charge_max: 600,
	clothes_req: 1,
	cooldown_min: 200,
	action_icon_state: "statue",
	sound: rt.rsc("sound/magic/fleshtostone.ogg"),
});
rt.type(11339, "/obj/effect/proc_holder/spell/targeted/trigger/blind", "/obj/effect/proc_holder/spell/targeted/trigger", {
	starting_spells: null,
	name: "Blind",
	desc: "This spell temporarily blinds a single person and does not require wizard garb.",
	school: "transmutation",
	charge_max: 300,
	clothes_req: 0,
	invocation: "STI KALY",
	invocation_type: "whisper",
	message: "<span class='notice'>Your eyes cry out in pain!</span>",
	cooldown_min: 50,
	action_icon_state: "blind",
});
rt.type(11341, "/obj/effect/proc_holder/spell/targeted/turf_teleport/blink", "/obj/effect/proc_holder/spell/targeted/turf_teleport", {
	include_user: 1,
	inner_tele_radius: 0,
	outer_tele_radius: 6,
	sound1: rt.rsc("sound/magic/blink.ogg"),
	sound2: rt.rsc("sound/magic/blink.ogg"),
	name: "Blink",
	desc: "This spell randomly teleports you a short distance.",
	school: "abjuration",
	charge_max: 20,
	clothes_req: 1,
	invocation: "none",
	invocation_type: "none",
	range: -1,
	cooldown_min: 5,
	smoke_spread: 1,
	smoke_amt: 0,
	action_icon_state: "blink",
});
rt.type(11342, "/obj/effect/proc_holder/spell/targeted/turf_teleport/blink/cult", "/obj/effect/proc_holder/spell/targeted/turf_teleport/blink", {
	name: "quickstep",
	charge_max: 100,
	clothes_req: 0,
	cult_req: 1,
});
rt.type(11355, "/obj/effect/proc_holder/spell/aoe_turf/conjure/construct/lesser", "/obj/effect/proc_holder/spell/aoe_turf/conjure/construct", {
	charge_max: 1800,
	action_icon_state: "artificer",
	action_background_icon_state: "bg_demon",
});
rt.type(11356, "/obj/effect/proc_holder/spell/aoe_turf/conjure/construct/lesser/cult", "/obj/effect/proc_holder/spell/aoe_turf/conjure/construct/lesser", {
	cult_req: 1,
	charge_max: 2500,
});
rt.type(11361, "/obj/effect/proc_holder/spell/aoe_turf/conjure/soulstone/cult", "/obj/effect/proc_holder/spell/aoe_turf/conjure/soulstone", {
	cult_req: 1,
	charge_max: 4000,
});
rt.type(11370, "/obj/effect/proc_holder/spell/aoe_turf/conjure/creature/cult", "/obj/effect/proc_holder/spell/aoe_turf/conjure/creature", {
	summon_amt: 2,
	name: "Summon Creatures (DANGEROUS)",
	cult_req: 1,
	charge_max: 5000,
});
rt.type(11379, "/obj/effect/proc_holder/spell/aimed/fireball", "/obj/effect/proc_holder/spell/aimed", {
	school: "evocation",
	charge_max: 60,
	clothes_req: 0,
	invocation: "ONI SOMA",
	invocation_type: "shout",
	range: 20,
	cooldown_min: 20,
	projectile_type: rt.typePath("/obj/item/projectile/magic/aoe/fireball"),
	base_icon_state: "fireball",
	action_icon_state: "fireball0",
	sound: rt.rsc("sound/magic/fireball.ogg"),
	active_msg: "You prepare to cast your fireball spell!",
	deactive_msg: "You extinguish your fireball... for now.",
	name: "Fireball",
	desc: "This spell fires a fireball at a target and does not require wizard garb.",
	active: 0,
});
rt.type(11380, "/obj/effect/proc_holder/spell/aimed/fireball/hellish", "/obj/effect/proc_holder/spell/aimed/fireball", {
	school: "evocation",
	charge_max: 80,
	clothes_req: 0,
	invocation: "Your very soul will catch fire!",
	invocation_type: "shout",
	range: 2,
	projectile_type: rt.typePath("/obj/item/projectile/magic/aoe/fireball/infernal"),
	action_background_icon_state: "bg_demon",
	name: "Hellfire",
	desc: "This spell launches hellfire at the target.",
});
