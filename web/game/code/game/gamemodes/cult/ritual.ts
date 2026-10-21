// From code/game/gamemodes/cult/ritual.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6561, "/obj/item/weapon/tome", "/obj/item/weapon", {
	throw_speed: 2,
	throw_range: 5,
	name: "arcane tome",
	desc: "An old, dusty tome with frayed edges and a sinister-looking cover.",
	icon_state: "tome",
	w_class: 2,
});

// /obj/item/weapon/tome/proc/Initialize  (code/game/gamemodes/cult/ritual.dm:17)  may sleep
rt.def("/obj/item/weapon/tome/proc/Initialize", function* Initialize(f: Frame) {
	let i_can_do_loops_now_thanks_remie: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [i_can_do_loops_now_thanks_remie, R, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.length(rt.gl("rune_types")))) return f.dot;
	rt.setGl("rune_types", rt.list());
	i_can_do_loops_now_thanks_remie = null;
	rt.forList(f, 0, rt.gl("non_revealed_runes"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i_can_do_loops_now_thanks_remie = $e;
		R = live(i_can_do_loops_now_thanks_remie);
		rt.setAt(rt.gl("rune_types"), rt.initial(f, live(R), "cultist_name"), live(R));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/weapon/tome/proc/examine  (code/game/gamemodes/cult/ritual.dm:26)
rt.def("/obj/item/weapon/tome/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.call(f, P("/proc/iscultist"), null, [live(f.args[0])])) || truthy((rt.istype(live(f.args[0]), T("/mob/dead/observer")) ? 1 : 0)))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='cult'>The scriptures of the Geometer. Allows the scribing of runes and access to the knowledge archives of the cult of Nar-Sie.</span>"]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='cult'>Striking a cult structure will unanchor or reanchor it.</span>"]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='cult'>Striking another cultist with it will purge holy water from them.</span>"]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='cult'>Striking a noncultist, however, will sear their flesh.</span>"]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/tome/proc/attack  (code/game/gamemodes/cult/ritual.dm:34)  may sleep
rt.def("/obj/item/weapon/tome/proc/attack", function* attack(f: Frame) {
	let holy2unholy: Value = null;
	f.vars = () => [holy2unholy];
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(f.args[1])])))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(f.args[0])])))) {
		if ((truthy(rt.fv(f, "reagents", live(f.args[0]))) && truthy((yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "has_reagent", ["holywater"]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='cult'>You remove the taint from ＀.</span>", [live(f.args[0])])]);
			holy2unholy = (yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "get_reagent_amount", ["holywater"]));
			yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "del_reagent", ["holywater"]);
			yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "add_reagent", ["unholywater", live(holy2unholy)]);
			yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[1]), live(f.args[0]), "smacked", live(f.src), " removing the holy water from them"]);
		}
		return live(f.dot);
	}
	yield* g.callName(f, live(f.args[0]), "take_bodypart_damage", [0, 15]);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.args[0]), rt.rsc("sound/weapons/sear.ogg"), 50, 1]);
	yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='danger'>＀ strikes ＀ with the arcane tome!</span>", [live(f.args[1]), live(f.args[0])]), fmt("<span class='userdanger'>＀ strikes you with the tome, searing your flesh!</span>", [live(f.args[1])])]);
	yield* g.call(f, P("/proc/flick"), null, ["tome_attack", live(f.src)]);
	yield* g.callName(f, live(f.args[1]), "do_attack_animation", [live(f.args[0])]);
	yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[1]), live(f.args[0]), "smacked", live(f.src)]);
	return f.dot;
}, true, { args: ["M", "user"] });

// /obj/item/weapon/tome/proc/attack_self  (code/game/gamemodes/cult/ritual.dm:55)  may sleep
rt.def("/obj/item/weapon/tome/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(user)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ seems full of unintelligible shapes, scribbles, and notes. Is this some sort of joke?</span>", [live(f.src)])]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "open_tome", live(user));
	return f.dot;
}, true);

// /obj/item/weapon/tome/proc/open_tome  (code/game/gamemodes/cult/ritual.dm:61)  may sleep
rt.def("/obj/item/weapon/tome/proc/open_tome", function* open_tome(f: Frame, user: Value) {
	let choice: Value = null;
	let $0: any;
	f.vars = () => [user, choice, $0];
	$0 = (choice = (yield* g.call(f, P("/proc/alert"), null, [live(user), "You open the tome...", null, "Scribe Rune", "More Information", "Cancel"])));
	if ($0 === "More Information") {
		yield* g.srcCall(f, "read_tome", live(user));
	} else if ($0 === "Scribe Rune") {
		yield* g.srcCall(f, "scribe_rune", live(user));
	} else if ($0 === "Cancel") {
		return live(f.dot);
	}
	return f.dot;
}, true);

// /obj/item/weapon/tome/proc/read_tome  (code/game/gamemodes/cult/ritual.dm:71)  may sleep
rt.def("/obj/item/weapon/tome/proc/read_tome", function* read_tome(f: Frame, user: Value) {
	let text: Value = null, popup: Value = null;
	f.vars = () => [user, text, popup];
	text = "";
	text = rt.modify(live(text), "<center><font color='red' size=3><b><i>Archives of the Dark One</i></b></font></center><br><br><br>", add);
	text = rt.modify(live(text), "A rune's name and effects can be revealed by examining the rune.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>Create Talisman</b></font><br>This rune is one of the most important runes the cult has, being the only way to create new talismans. A blank sheet of paper must be on top of the rune. After invoking it and choosing which talisman you desire, the paper will be converted, after some delay into a talisman.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>Teleport</b></font><br>This rune is unique in that it requires a keyword before the scribing can begin. When invoked, it will find any other Teleport runes; If any are found, the user can choose which rune to send to. Upon activation, the rune teleports everything above it to the selected rune, provided the selected rune is unblocked.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>Offer</b></font><br><b>This rune is necessary to achieve your goals.</b> Placing a noncultist above it will convert them if it can and sacrifice them otherwise. It requires two invokers to convert a target and three to sacrifice a living target or the sacrifice target.<br>Successful conversions will produce a tome for the new cultist, in addition to healing them.<br> Successful sacrifices will please the Geometer, can complete your objective if it sacrificed the sacrifice target, and will attempt to place the target into a soulstone.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>Raise Dead</b></font><br>This rune requires the corpse of a cultist placed upon the rune, and one person sacrificed for each revival you wish to do.Provided there are remaining revivals from those sacrificed, invoking the rune will revive the cultist placed upon it.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>Electromagnetic Disruption</b></font><br>Robotic lifeforms have time and time again been the downfall of fledgling cults. This rune may allow you to gain the upper hand against these pests. By using the rune, a large electromagnetic pulse will be emitted from the rune's location. The size of the EMP will grow significantly for each additional adjacent cultist when the rune is activated.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>Astral Communion</b></font><br>This rune is perhaps the most ingenious rune that is usable by a single person. Upon invoking the rune, the user's spirit will be ripped from their body. In this state, the user's physical body will be locked in place to the rune itself - any attempts to move it will result in the rune pulling it back. The body will also take constant damage while in this form, and may even die. The user's spirit will contain their consciousness, and will allow them to freely wander the station as a ghost. This may also be used to commune with the dead.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>Form Barrier</b></font><br>While simple, this rune serves an important purpose in defense and hindering passage. When invoked, the rune will draw a small amount of blood from the user and make the space above the rune completely dense, rendering it impassable for about a minute and a half. This effect will spread to other nearby Barrier Runes. The rune may be invoked again to undo this effect and allow passage again.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>Summon Cultist</b></font><br>This rune allows the cult to free other cultists with ease. When invoked, it will allow the user to summon a single cultist to the rune from any location. It requires two invokers, and will damage each invoker slightly.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>Blood Boil</b></font><br>When invoked, this rune will rapidly do a massive amount of damage to all non-cultist viewers, but it will also emit a burst of flame once it finishes. It requires three invokers.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>Drain Life</b></font><br>This rune will drain the life of every living creature above the rune, healing the invoker for each creature drained by it.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>Manifest Spirit</b></font><br>This rune allows you to summon spirits as humanoid fighters. When invoked, a spirit above the rune will be brought to life as a human, wearing nothing, that seeks only to serve you and the Geometer. However, the spirit's link to reality is fragile - you must remain on top of the rune, and you will slowly take damage. Upon stepping off the rune, all summoned spirits will dissipate, dropping their items to the ground. You may manifest multiple spirits with one rune, but you will rapidly take damage in doing so.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b><i>Summon Nar-Sie</i></b></font><br><b>This rune is necessary to achieve your goals.</b> On attempting to scribe it, it will produce shields around you and alert everyone you are attempting to scribe it; it takes a very long time to scribe, and does massive damage to the one attempting to scribe it.<br>Invoking it requires 9 invokers and the sacrifice of a specific crewmember, and once invoked, will summon the Geometer, Nar-Sie herself. This will complete your objectives.<br><br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>Talisman of Teleportation</b></font><br>The talisman form of the Teleport rune will transport the invoker to a selected Teleport rune once.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>Talisman of Construction</b></font><br>This talisman is the main way of creating construct shells. To use it, one must strike 25 sheets of metal with the talisman. The sheets will then be twisted into a construct shell, ready to receive a soul to occupy it.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>Talisman of Tome Summoning</b></font><br>This talisman will produce a single tome at your feet.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>Talisman of Veiling/Revealing</b></font><br>This talisman will hide runes on its first use, and on the second, will reveal runes.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>Talisman of Disguising</b></font><br>This talisman will permanently disguise all nearby runes as crayon runes.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>Talisman of Electromagnetic Pulse</b></font><br>This talisman will EMP anything else nearby. It disappears after one use.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>Talisman of Stunning</b></font><br>Attacking a target will knock them down for a long duration in addition to inhibiting their speech. Robotic lifeforms will suffer the effects of a heavy electromagnetic pulse instead.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>Talisman of Armaments</b></font><br>The Talisman of Arming will equip the user with armored robes, a backpack, an eldritch longsword, an empowered bola, and a pair of boots. Any items that cannot be equipped will not be summoned. Attacking a fellow cultist with it will instead equip them.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>Talisman of Horrors</b></font><br>The Talisman of Horror, unlike other talismans, can be applied at range, without the victim noticing. It will cause the victim to have severe hallucinations after a short while.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>Talisman of Shackling</b></font><br>The Talisman of Shackling must be applied directly to the victim, it has 4 uses and cuffs victims with magic shackles that disappear when removed.<br><br>", add);
	text = rt.modify(live(text), "In addition to these runes, the cult has a small selection of equipment and constructs.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>Equipment:</b></font><br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>Cult Blade</b></font><br>Cult blades are sharp weapons that, notably, cannot be used by noncultists. These blades are produced by the Talisman of Arming.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>Cult Bola</b></font><br>Cult bolas are strong bolas, useful for snaring targets. These bolas are produced by the Talisman of Arming.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>Cult Robes</b></font><br>Cult robes are heavily armored robes. These robes are produced by the Talisman of Arming.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>Soulstone</b></font><br>A soulstone is a simple piece of magic, produced either via the starter talisman or by sacrificing humans. Using it on an unconscious or dead human, or on a Shade, will trap their soul in the stone, allowing its use in construct shells. <br>The soul within can also be released as a Shade by using it in-hand.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>Construct Shell</b></font><br>A construct shell is useless on its own, but placing a filled soulstone within it allows you to produce your choice of a <b>Wraith</b>, a <b>Juggernaut</b>, or an <b>Artificer</b>. <br>Each construct has uses, detailed below in Constructs. Construct shells can be produced via the starter talisman or the Rite of Fabrication.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>Constructs:</b></font><br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>Shade</b></font><br>While technically not a construct, the Shade is produced when released from a soulstone. It is quite fragile and has weak melee attacks, but is fully healed when recaptured by a soulstone.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>Wraith</b></font><br>The Wraith is a fast, lethal melee attacker which can jaunt through walls. However, it is only slightly more durable than a shade.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>Juggernaut</b></font><br>The Juggernaut is a slow, but durable, melee attacker which can produce temporary forcewalls. It will also reflect most lethal energy weapons.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>Artificer</b></font><br>The Artificer is a weak and fragile construct, able to heal other constructs, shades, or itself, produce more <font color='red'><b>soulstones</b></font> and <font color='red'><b>construct shells</b></font>, construct fortifying cult walls and flooring, and finally, it can release a few indiscriminate stunning missiles.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>Harvester</b></font><br>If you see one, know that you have done all you can and your life is void.<br><br>", add);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "tome", "", 800, 600]))), "set_content", [live(text)]);
	yield* g.callName(f, live(popup), "open", []);
	return 1;
}, true);

// /obj/item/weapon/tome/proc/scribe_rune  (code/game/gamemodes/cult/ritual.dm:175)  may sleep
rt.def("/obj/item/weapon/tome/proc/scribe_rune", function* scribe_rune(f: Frame, user: Value) {
	let Turf: Value = null, chosen_keyword: Value = null, rune_to_scribe: Value = null, entered_rune_name: Value = null, shields: Value = null, A: Value = null, confirm_final: Value = null, B: Value = null, N: Value = null, scribe_mod: Value = null, V: Value = null, S: Value = null, R: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [user, Turf, chosen_keyword, rune_to_scribe, entered_rune_name, shields, A, confirm_final, B, N, scribe_mod, V, S, R, $0, $1, $2, $e];
	Turf = rt.getStep(f, live(user), 0);
	chosen_keyword = null;
	rune_to_scribe = null;
	entered_rune_name = null;
	shields = rt.list();
	A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]));
	if (!truthy((yield* g.srcCall(f, "check_rune_turf", live(Turf), live(user))))) {
		return live(f.dot);
	}
	entered_rune_name = (yield* g.op(f, "Prompt", [1], [null, "Sigils of Power", "Choose a rite to scribe.", live(user), rt.gl("rune_types")]));
	if (((((!truthy(live(f.src)) || (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) || !truthy((yield* g.srcCall(f, "Adjacent", live(user))))) || truthy((yield* g.callName(f, live(user), "incapacitated", [])))) || !truthy((yield* g.srcCall(f, "check_rune_turf", live(Turf), live(user)))))) {
		return live(f.dot);
	}
	if (!truthy((rune_to_scribe = rt.index(rt.gl("rune_types"), live(entered_rune_name))))) {
		return live(f.dot);
	}
	if (truthy(rt.initial(f, live(rune_to_scribe), "req_keyword"))) {
		if (!truthy((chosen_keyword = (yield* g.call(f, P("/proc/stripped_input"), null, [live(user), "Enter a keyword for the new rune.", "Words of Power"]))))) {
			yield* g.srcCall(f, "scribe_rune", live(user));
			return live(f.dot);
		}
	}
	Turf = rt.getStep(f, live(user), 0);
	A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]));
	if (((((!truthy(live(f.src)) || (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) || !truthy((yield* g.srcCall(f, "Adjacent", live(user))))) || truthy((yield* g.callName(f, live(user), "incapacitated", [])))) || !truthy((yield* g.srcCall(f, "check_rune_turf", live(Turf), live(user)))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.call(f, P("/proc/ispath"), null, [live(rune_to_scribe), T("/obj/effect/rune/narsie")])))) {
		if (!truthy((rt.isIn(f, "eldergod", rt.gv(f, "cult_objectives", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Nar-Sie does not wish to be summoned!</span>"]);
			return live(f.dot);
		}
		if (!truthy(rt.gl("sac_complete"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The sacrifice is not complete. The portal would lack the power to open if you tried!</span>"]);
			return live(f.dot);
		}
		if (!truthy(rt.gv(f, "eldergod", rt.fv(f, "mode", rt.gl("SSticker"))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='cultlarge'>\"I am already here. There is no need to try to summon me now.\"</span>"]);
			return live(f.dot);
		}
		if (!truthy((rt.isIn(f, live(A), rt.gl("summon_spots")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='cultlarge'>The Geometer can only be summoned where the veil is weak - in ＀!</span>", [(yield* g.call(f, P("/proc/english_list"), null, [rt.gl("summon_spots")]))])]);
			return live(f.dot);
		}
		if (isEqual((confirm_final = (yield* g.call(f, P("/proc/alert"), null, [live(user), "This is the FINAL step to summon Nar-Sie; it is a long, painful ritual and the crew will be alerted to your presence", "Are you prepared for the final battle?", "My life for Nar-Sie!", "No"]))), "No")) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='cult'>You decide to prepare further before scribing the rune.</span>"]);
			return live(f.dot);
		}
		Turf = rt.getStep(f, live(user), 0);
		if (!truthy((rt.isIn(f, (A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))), rt.gl("summon_spots")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='cultlarge'>The Geometer can only be summoned where the veil is weak - in ＀!</span>", [(yield* g.call(f, P("/proc/english_list"), null, [rt.gl("summon_spots")]))])]);
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/priority_announce"), null, [fmt("Figments from an eldritch god are being summoned by ＀ into ＀ from an unknown dimension. Disrupt the ritual at all costs!", [live(user), rt.fv(f, "map_name", live(A))]), "Central Command Higher Dimensional Affairs", rt.rsc("sound/ai/spanomalies.ogg")]);
		B = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/spiral_range_turfs"), null, [1, live(user), 1])));
		while (($e = rt.next(f, 0)) !== undefined) {
			B = $e;
			shields = rt.modify(live(shields), (N = (yield* g.new_(f, T("/obj/structure/emergency_shield/sanguine"), [live(B)]))), add);
		}
		rt.endFor(f, 0);
	}
	$0 = live(user);
	$1 = live(user);
	if (truthy(rt.fv(f, "blood_volume", live(user)))) {
		$2 = "cuts open their arm and begins writing in their own blood";
	} else {
		$2 = "begins sketching out a strange design";
	}
	$1 = fmt("<span class='warning'>＀ ＀!</span>", [$1, $2]);
	if (truthy(rt.fv(f, "blood_volume", live(user)))) {
		$2 = "slice open your arm and ";
	} else {
		$2 = "";
	}
	yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='cult'>You ＀begin drawing a sigil of the Geometer.</span>", [$2])]);
	if (truthy(rt.fv(f, "blood_volume", live(user)))) {
		yield* g.callName(f, live(user), "apply_damage", [rt.initial(f, live(rune_to_scribe), "scribe_damage"), "brute", rt.op(f, "PickUnweighted", [2], ["l_arm", "r_arm"])]);
	}
	scribe_mod = rt.initial(f, live(rune_to_scribe), "scribe_delay");
	if (truthy((rt.istype(rt.getStep(f, live(user), 0), T("/turf/open/floor/engine/cult")) ? 1 : 0))) {
		(scribe_mod = rt.modify(live(scribe_mod), 0.5, multiply));
	}
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, live(scribe_mod), "target", rt.getStep(f, live(user), 0)], rt.Args.Named)))) {
		V = null;
		rt.forList(f, 0, live(shields));
		while (($e = rt.next(f, 0)) !== undefined) {
			V = $e;
			if ((truthy((S = live(V))) && !(!truthy(live(S)) || truthy(rt.fv(f, "gc_destroyed", live(S)))))) {
				yield* g.call(f, P("/proc/qdel"), null, [live(S)]);
			}
		}
		rt.endFor(f, 0);
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "check_rune_turf", live(Turf), live(user))))) {
		return live(f.dot);
	}
	$0 = live(user);
	$1 = live(user);
	if (truthy(rt.fv(f, "blood_volume", live(user)))) {
		$2 = " in their own blood";
	} else {
		$2 = "";
	}
	yield* g.callName(f, $0, "visible_message", [fmt("<span class='warning'>＀ creates a strange circle＀.</span>", [$1, $2]), "<span class='cult'>You finish drawing the arcane markings of the Geometer.</span>"]);
	V = null;
	rt.forList(f, 0, live(shields));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		if ((truthy((S = live(V))) && !(!truthy(live(S)) || truthy(rt.fv(f, "gc_destroyed", live(S)))))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(S)]);
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, (R = (yield* g.new_(f, live(rune_to_scribe), [live(Turf), live(chosen_keyword)]))), "add_mob_blood", [live(user)]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='cult'>The ＀ rune ＀</span>", [(yield* g.call(f, P("/proc/lowertext"), null, [rt.fv(f, "cultist_name", live(R))])), rt.fv(f, "cultist_desc", live(R))])]);
	return f.dot;
}, true);

// /obj/item/weapon/tome/proc/check_rune_turf  (code/game/gamemodes/cult/ritual.dm:252)
rt.def("/obj/item/weapon/tome/proc/check_rune_turf", function check_rune_turf(f: Frame, _T: Value, user: Value) {
	if (truthy((rt.istype(live(_T), T("/turf/open/space")) ? 1 : 0))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You cannot scribe runes in space!</span>"]);
		return 0;
	}
	if (truthy(rt.locateIn(f, T("/obj/effect/rune"), live(_T)))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='cult'>There is already a rune here.</span>"]);
		return 0;
	}
	if ((!isEqual(rt.fv(f, "z", live(_T)), 2) && !isEqual(rt.fv(f, "z", live(_T)), 5))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The veil is not weak enough here."]);
		return 0;
	}
	return 1;
});
