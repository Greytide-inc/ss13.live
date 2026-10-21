// From code/game/gamemodes/clock_cult/clock_items/clock_components.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8935, "/obj/item/clockwork/component", "/obj/item/clockwork", {
	component_id: null,
	cultist_message: "You are not worthy of this meme.",
	servant_of_ratvar_messages: null,
	message_span: "heavy_brass",
	clockwork_desc: null,
	name: "meme component",
	desc: "A piece of a famous meme.",
	resistance_flags: 35,
});

// /obj/item/clockwork/component/proc/<init>  (code/game/gamemodes/clock_cult/clock_items/clock_components.dm:9)
rt.def("/obj/item/clockwork/component/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "servant_of_ratvar_messages", rt.alist(f, ["ayy", 0, "lmao", 1]));
	return f.dot;
});

// /obj/item/clockwork/component/proc/pickup  (code/game/gamemodes/clock_cult/clock_items/clock_components.dm:13)  may sleep
rt.def("/obj/item/clockwork/component/proc/pickup", function* pickup(f: Frame) {
	let wrath: Value = null, pickedmessage: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [wrath, pickedmessage, $0, $1, $2];
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(f.args[0])]))) || (truthy(rt.fv(f, "mind", live(f.args[0]))) && truthy(rt.gv(f, "isholy", rt.fv(f, "mind", live(f.args[0]))))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='＀'>＀</span>", [rt.sv(f, "message_span"), rt.sv(f, "cultist_message")])]);
		if ((truthy(rt.fv(f, "mind", live(f.args[0]))) && truthy(rt.gv(f, "isholy", rt.fv(f, "mind", live(f.args[0])))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='boldannounce'>The power of your faith melts away the ＀!</span>", [live(f.src)])]);
			wrath = (yield* g.new_(f, T("/obj/item/weapon/ore/slag"), []));
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			yield* g.callName(f, live(f.args[0]), "put_in_active_hand", [live(wrath)]);
		}
	}
	if (!(truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])]))) && truthy(rt.op(f, "Prob", [], [20])))) return f.dot;
	pickedmessage = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "servant_of_ratvar_messages")]);
	$0 = live(f.args[0]);
	$1 = rt.sv(f, "message_span");
	if (truthy(rt.index(rt.sv(f, "servant_of_ratvar_messages"), live(pickedmessage)))) {
		$2 = fmt("＀", [(yield* g.call(f, P("/proc/text2ratvar"), null, [live(pickedmessage)]))]);
	} else {
		$2 = live(pickedmessage);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='＀'>＀</span>", [$1, $2])]);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/clockwork/component/proc/examine  (code/game/gamemodes/clock_cult/clock_items/clock_components.dm:26)
rt.def("/obj/item/clockwork/component/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])]))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='＀'>You should put this in a slab or cache immediately.</span>", [rt.sv(f, "message_span")])]);
	return f.dot;
}, false, { args: ["user"] });

rt.type(8936, "/obj/item/clockwork/component/belligerent_eye", "/obj/item/clockwork/component", {
	component_id: "belligerent_eye",
	cultist_message: "The eye gives you an intensely hateful glare.",
	servant_of_ratvar_messages: null,
	message_span: "neovgre",
	name: "belligerent eye",
	desc: "A brass construct with a rotating red center. It's as though it's looking for something to hurt.",
	icon_state: "belligerent_eye",
});

// /obj/item/clockwork/component/belligerent_eye/proc/<init>  (code/game/gamemodes/clock_cult/clock_items/clock_components.dm:36)
rt.def("/obj/item/clockwork/component/belligerent_eye/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "servant_of_ratvar_messages", rt.alist(f, ["\"...\"", 0, "For a moment, your mind is flooded with extremely violent thoughts.", 0, "\"...Die.\"", 1]));
	return f.dot;
});

rt.type(8937, "/obj/item/clockwork/component/belligerent_eye/blind_eye", "/obj/item/clockwork/component/belligerent_eye", {
	clockwork_desc: "A smashed ocular warden covered in dents. <b>Serviceable as a substitute for a belligerent eye.</b>",
	cultist_message: "The eye flickers at you with intense hate before falling dark.",
	servant_of_ratvar_messages: null,
	name: "blind eye",
	desc: "A heavy brass eye, its red iris fallen dark.",
	icon_state: "blind_eye",
	w_class: 3,
});

// /obj/item/clockwork/component/belligerent_eye/blind_eye/proc/<init>  (code/game/gamemodes/clock_cult/clock_items/clock_components.dm:45)
rt.def("/obj/item/clockwork/component/belligerent_eye/blind_eye/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "servant_of_ratvar_messages", rt.alist(f, ["The eye flickers before falling dark.", 0, "You feel watched.", 0, "\"...\"", 0]));
	return f.dot;
});

rt.type(8938, "/obj/item/clockwork/component/belligerent_eye/lens_gem", "/obj/item/clockwork/component/belligerent_eye", {
	clockwork_desc: "The gem from an interdiction lens. <b>Serviceable as a substitute for a belligerent eye.</b>",
	cultist_message: "The gem turns black and cold for a moment before its normal glow returns.",
	servant_of_ratvar_messages: null,
	light_range: 1.4,
	light_power: 0.4,
	light_color: "#F42B9D",
	name: "lens gem",
	desc: "A tiny pinkish gem. It catches the light oddly, almost glowing.",
	icon_state: "lens_gem",
	w_class: 1,
});

// /obj/item/clockwork/component/belligerent_eye/lens_gem/proc/<init>  (code/game/gamemodes/clock_cult/clock_items/clock_components.dm:54)
rt.def("/obj/item/clockwork/component/belligerent_eye/lens_gem/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "servant_of_ratvar_messages", rt.alist(f, ["\"Disgusting failure.\"", 1, "You feel scrutinized.", 0, "\"Weaklings.\"", 1, "\"Pathetic defenses.\"", 1]));
	return f.dot;
});

rt.type(8939, "/obj/item/clockwork/component/vanguard_cogwheel", "/obj/item/clockwork/component", {
	component_id: "vanguard_cogwheel",
	cultist_message: "\"Pray to your god that we never meet.\"",
	servant_of_ratvar_messages: null,
	message_span: "inathneq",
	name: "vanguard cogwheel",
	desc: "A sturdy brass cog with a faintly glowing blue gem in its center.",
	icon_state: "vanguard_cogwheel",
});

// /obj/item/clockwork/component/vanguard_cogwheel/proc/<init>  (code/game/gamemodes/clock_cult/clock_items/clock_components.dm:66)
rt.def("/obj/item/clockwork/component/vanguard_cogwheel/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "servant_of_ratvar_messages", rt.alist(f, ["\"Be safe, child.\"", 0, "You feel unexplainably comforted.", 0, "\"Never forget: Pain is temporary. What you do for the Justiciar is eternal.\"", 0]));
	return f.dot;
});

rt.type(8940, "/obj/item/clockwork/component/vanguard_cogwheel/onyx_prism", "/obj/item/clockwork/component/vanguard_cogwheel", {
	clockwork_desc: "A broken prism from a prolonging prism. <b>Serviceable as a substitute for a vanguard cogwheel.</b>",
	cultist_message: "The prism grows painfully hot in your hands.",
	servant_of_ratvar_messages: null,
	name: "onyx prism",
	desc: "An onyx prism with a small aperture. It's very heavy.",
	icon_state: "onyx_prism",
	w_class: 3,
});

// /obj/item/clockwork/component/vanguard_cogwheel/onyx_prism/proc/<init>  (code/game/gamemodes/clock_cult/clock_items/clock_components.dm:75)
rt.def("/obj/item/clockwork/component/vanguard_cogwheel/onyx_prism/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "servant_of_ratvar_messages", rt.alist(f, ["The prism isn't getting any lighter.", 0, "\"So... you haven't failed yet. Have hope, child.\"", 1, "\"Better these machines break than you do.\"", 1]));
	return f.dot;
});

rt.type(8941, "/obj/item/clockwork/component/geis_capacitor", "/obj/item/clockwork/component", {
	component_id: "geis_capacitor",
	cultist_message: "\"Try not to lose your mind - I'll need it. Heh heh...\"",
	servant_of_ratvar_messages: null,
	message_span: "sevtug",
	name: "geis capacitor",
	desc: "A curiously cold brass doodad. It seems as though it really doesn't appreciate being held.",
	icon_state: "geis_capacitor",
});

// /obj/item/clockwork/component/geis_capacitor/proc/<init>  (code/game/gamemodes/clock_cult/clock_items/clock_components.dm:85)
rt.def("/obj/item/clockwork/component/geis_capacitor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "servant_of_ratvar_messages", rt.alist(f, ["\"Disgusting.\"", 0, "\"Well, aren't you an inquisitive fellow?\"", 0, "A foul presence pervades your mind, then vanishes.", 0, "\"The fact that Ratvar has to depend on simpletons like you is appalling.\"", 0]));
	return f.dot;
});

rt.type(8942, "/obj/item/clockwork/component/geis_capacitor/fallen_armor", "/obj/item/clockwork/component/geis_capacitor", {
	clockwork_desc: "The armor from a former clockwork marauder. <b>Serviceable as a substitute for a geis capacitor.</b>",
	cultist_message: "Red flame sputters from the mask's eye before winking out.",
	servant_of_ratvar_messages: null,
	name: "fallen armor",
	desc: "Lifeless chunks of armor. They're designed in a strange way and won't fit on you.",
	icon_state: "fallen_armor",
	w_class: 3,
});

// /obj/item/clockwork/component/geis_capacitor/fallen_armor/proc/<init>  (code/game/gamemodes/clock_cult/clock_items/clock_components.dm:95)
rt.def("/obj/item/clockwork/component/geis_capacitor/fallen_armor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "servant_of_ratvar_messages", rt.alist(f, ["A piece of armor hovers away from the others for a moment.", 0, "Red flame appears in the cuirass before sputtering out.", 0]));
	return f.dot;
});

rt.type(8943, "/obj/item/clockwork/component/geis_capacitor/antennae", "/obj/item/clockwork/component/geis_capacitor", {
	clockwork_desc: "The antennae from a mania motor. <b>Serviceable as a substitute for a geis capacitor.</b>",
	cultist_message: "Your head is filled with a burst of static.",
	servant_of_ratvar_messages: null,
	name: "mania motor antennae",
	desc: "A pair of dented and bent antennae. They constantly emit a static hiss.",
	icon_state: "mania_motor_antennae",
});

// /obj/item/clockwork/component/geis_capacitor/antennae/proc/<init>  (code/game/gamemodes/clock_cult/clock_items/clock_components.dm:104)
rt.def("/obj/item/clockwork/component/geis_capacitor/antennae/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "servant_of_ratvar_messages", rt.alist(f, ["\"Who broke this.\"", 1, "\"Did you break these off YOURSELF?\"", 1, "\"Why did we give this to such simpletons, anyway?\"", 1, "\"At least we can use these for something - unlike you.\"", 1]));
	return f.dot;
});

rt.type(8944, "/obj/item/clockwork/component/replicant_alloy", "/obj/item/clockwork/component", {
	component_id: "replicant_alloy",
	cultist_message: "The alloy takes on the appearance of a screaming face for a moment.",
	servant_of_ratvar_messages: null,
	message_span: "nezbere",
	name: "replicant alloy",
	desc: "A seemingly strong but very malleable chunk of metal. It seems as though it wants to be molded into something greater.",
	icon_state: "replicant_alloy",
});

// /obj/item/clockwork/component/replicant_alloy/proc/<init>  (code/game/gamemodes/clock_cult/clock_items/clock_components.dm:113)
rt.def("/obj/item/clockwork/component/replicant_alloy/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "servant_of_ratvar_messages", rt.alist(f, ["\"There's always something to be done. Get to it.\"", 0, "\"Idle hands are worse than broken ones. Get to work.\"", 0, "A detailed image of Ratvar appears in the alloy for a moment.", 0]));
	return f.dot;
});

rt.type(8945, "/obj/item/clockwork/component/replicant_alloy/smashed_anima_fragment", "/obj/item/clockwork/component/replicant_alloy", {
	clockwork_desc: "The sad remains of an anima fragment. <b>Serviceable as a substitute for replicant alloy.</b>",
	cultist_message: "The shards vibrate in your hands for a moment.",
	servant_of_ratvar_messages: null,
	name: "smashed anima fragment",
	desc: "Shattered chunks of metal. Damaged beyond repair and completely unusable.",
	icon_state: "smashed_anime_fragment",
	w_class: 3,
});

// /obj/item/clockwork/component/replicant_alloy/smashed_anima_fragment/proc/<init>  (code/game/gamemodes/clock_cult/clock_items/clock_components.dm:123)
rt.def("/obj/item/clockwork/component/replicant_alloy/smashed_anima_fragment/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "servant_of_ratvar_messages", rt.alist(f, ["\"...still fight...\"", 0, "\"...where am I...?\"", 0, "\"...put me... slab...\"", 0]));
	return f.dot;
});

rt.type(8946, "/obj/item/clockwork/component/replicant_alloy/replication_plate", "/obj/item/clockwork/component/replicant_alloy", {
	clockwork_desc: "The replication plate from a tinkerer's daemon. <b>Serviceable as a substitute for replicant alloy.</b>",
	cultist_message: "The plate shudders in your hands, as though trying to get away.",
	servant_of_ratvar_messages: null,
	name: "replication plate",
	desc: "A flat, heavy disc of metal with a triangular formation on its surface.",
	icon_state: "replication_plate",
	w_class: 3,
});

// /obj/item/clockwork/component/replicant_alloy/replication_plate/proc/<init>  (code/game/gamemodes/clock_cult/clock_items/clock_components.dm:132)
rt.def("/obj/item/clockwork/component/replicant_alloy/replication_plate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "servant_of_ratvar_messages", rt.alist(f, ["\"Put this in a slab and get back to work.\"", 0, "\"Worse servants than you have held these.\"", 1, "\"It would be wise to protect these better, friend.\"", 1]));
	return f.dot;
});

rt.type(8947, "/obj/item/clockwork/component/hierophant_ansible", "/obj/item/clockwork/component", {
	component_id: "hierophant_ansible",
	cultist_message: "\"Gur obff fnlf vg'f abg ntnvafg gur ehyrf gb-xvyy lbh.\"",
	servant_of_ratvar_messages: null,
	message_span: "nzcrentr",
	name: "hierophant ansible",
	desc: "Some sort of transmitter? It seems as though it's trying to say something.",
	icon_state: "hierophant_ansible",
});

// /obj/item/clockwork/component/hierophant_ansible/proc/<init>  (code/game/gamemodes/clock_cult/clock_items/clock_components.dm:142)
rt.def("/obj/item/clockwork/component/hierophant_ansible/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "servant_of_ratvar_messages", rt.alist(f, ["\"Exile is such a bore. There's nothing I can hunt in here.\"", 1, "\"What's keeping you? I want to go kill something.\"", 1, "\"HEHEHEHEHEHEH!\"", 0, "\"If I killed you fast enough, do you think the boss would notice?\"", 1]));
	return f.dot;
});

rt.type(8948, "/obj/item/clockwork/component/hierophant_ansible/obelisk", "/obj/item/clockwork/component/hierophant_ansible", {
	clockwork_desc: "The prism from a clockwork obelisk. <b>Serviceable as a substitute for a hierophant ansible.</b>",
	cultist_message: "The prism flickers wildly in your hands before resuming its normal glow.",
	servant_of_ratvar_messages: null,
	name: "obelisk prism",
	desc: "A prism that occasionally glows brightly. It seems not-quite there.",
	icon_state: "obelisk_prism",
	w_class: 3,
});

// /obj/item/clockwork/component/hierophant_ansible/obelisk/proc/<init>  (code/game/gamemodes/clock_cult/clock_items/clock_components.dm:151)
rt.def("/obj/item/clockwork/component/hierophant_ansible/obelisk/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "servant_of_ratvar_messages", rt.alist(f, ["You hear the distinctive sound of the Hierophant Network for a moment.", 0, "\"Hieroph'ant Br'o'adcas't fail'ure.\"", 1, "The obelisk flickers wildly, as if trying to open a gateway.", 0, "\"Spa'tial Ga'tewa'y fai'lure.\"", 1]));
	return f.dot;
});

rt.type(8928, "/obj/item/clockwork/alloy_shards", "/obj/item/clockwork", {
	randomsinglesprite: 0,
	randomspritemax: 2,
	sprite_shift: 9,
	clockwork_desc: "Broken shards of replicant alloy.",
	name: "replicant alloy shards",
	desc: "Broken shards of some oddly malleable metal. They occasionally move and seem to glow.",
	icon_state: "alloy_shards",
	resistance_flags: 35,
});

// /obj/item/clockwork/alloy_shards/proc/Initialize  (code/game/gamemodes/clock_cult/clock_items/clock_components.dm:168)  may sleep
rt.def("/obj/item/clockwork/alloy_shards/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.sv(f, "randomsinglesprite"))) return f.dot;
	yield* g.srcCall(f, "replace_name_desc");
	rt.setSv(f, "icon_state", fmt("＀＀", [rt.sv(f, "icon_state"), (yield* g.call(f, P("/proc/rand"), null, [1, rt.sv(f, "randomspritemax")]))]));
	rt.setSv(f, "pixel_x", (yield* g.call(f, P("/proc/rand"), null, [rt.neg(rt.sv(f, "sprite_shift")), rt.sv(f, "sprite_shift")])));
	rt.setSv(f, "pixel_y", (yield* g.call(f, P("/proc/rand"), null, [rt.neg(rt.sv(f, "sprite_shift")), rt.sv(f, "sprite_shift")])));
	return f.dot;
}, true);

// /obj/item/clockwork/alloy_shards/proc/examine  (code/game/gamemodes/clock_cult/clock_items/clock_components.dm:176)
rt.def("/obj/item/clockwork/alloy_shards/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])])) || truthy((rt.istype(live(f.args[0]), T("/mob/dead/observer")) ? 1 : 0)))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='brass'>Can be consumed by a replica fabricator as a source of power.</span>"]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/clockwork/alloy_shards/proc/replace_name_desc  (code/game/gamemodes/clock_cult/clock_items/clock_components.dm:181)
rt.def("/obj/item/clockwork/alloy_shards/proc/replace_name_desc", function replace_name_desc(f: Frame) {
	rt.setSv(f, "name", "replicant alloy shard");
	rt.setSv(f, "desc", "A broken shard of some oddly malleable metal. It occasionally moves and seems to glow.");
	rt.setSv(f, "clockwork_desc", "A broken shard of replicant alloy.");
	return f.dot;
});

rt.type(8930, "/obj/item/clockwork/alloy_shards/medium/gear_bit", "/obj/item/clockwork/alloy_shards/medium", {
	randomspritemax: 4,
	icon_state: "gear_bit",
	sprite_shift: 12,
});

// /obj/item/clockwork/alloy_shards/medium/gear_bit/proc/replace_name_desc  (code/game/gamemodes/clock_cult/clock_items/clock_components.dm:203)
rt.def("/obj/item/clockwork/alloy_shards/medium/gear_bit/proc/replace_name_desc", function replace_name_desc(f: Frame) {
	rt.setSv(f, "name", "gear bit");
	rt.setSv(f, "desc", "A broken chunk of a gear. You want it.");
	rt.setSv(f, "clockwork_desc", "A broken chunk of a gear.");
	return f.dot;
});

// /obj/item/clockwork/alloy_shards/medium/gear_bit/large/proc/replace_name_desc  (code/game/gamemodes/clock_cult/clock_items/clock_components.dm:210)
rt.def("/obj/item/clockwork/alloy_shards/medium/gear_bit/large/proc/replace_name_desc", function replace_name_desc(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "name", "complex gear bit");
	return f.dot;
});
