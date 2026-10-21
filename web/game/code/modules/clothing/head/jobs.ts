// From code/modules/clothing/head/jobs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8111, "/obj/item/clothing/head/chefhat", "/obj/item/clothing/head", {
	name: "chef's hat",
	item_state: "chef",
	icon_state: "chef",
	desc: "The commander in chef's head wear.",
	strip_delay: 10,
	equip_delay_other: 10,
	dog_fashion: rt.typePath("/datum/dog_fashion/head/chef"),
});

// /obj/item/clothing/head/chefhat/proc/suicide_act  (code/modules/clothing/head/jobs.dm:13)  may sleep
rt.def("/obj/item/clothing/head/chefhat/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is donning ＀! It looks like ＀ trying to become a chef.</span>", [live(user), live(f.src), (yield* g.callName(f, live(user), "p_theyre", []))])]);
	yield* g.callName(f, live(user), "say", ["Bork Bork Bork!"]);
	yield* g.call(f, P("/proc/sleep"), null, [20]);
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ climbs into an imaginary oven!</span>", [live(user)])]);
	yield* g.callName(f, live(user), "say", ["BOOORK!"]);
	yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/machines/ding.ogg"), 50, 1]);
	return 2;
}, true);

rt.type(8112, "/obj/item/clothing/head/caphat", "/obj/item/clothing/head", {
	name: "captain's hat",
	desc: "It's good being the king.",
	icon_state: "captain",
	item_state: "that",
	flags_inv: 0,
	armor: null,
	strip_delay: 60,
	dog_fashion: rt.typePath("/datum/dog_fashion/head/captain"),
});

// /obj/item/clothing/head/caphat/proc/<init>  (code/modules/clothing/head/jobs.dm:28)
rt.def("/obj/item/clothing/head/caphat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 25, "bullet", 15, "laser", 25, "energy", 10, "bomb", 25, "bio", 0, "rad", 0, "fire", 50, "acid", 50]));
	return f.dot;
});

rt.type(8114, "/obj/item/clothing/head/hopcap", "/obj/item/clothing/head", {
	name: "head of personnel's cap",
	icon_state: "hopcap",
	desc: "The symbol of true bureaucratic micromanagement.",
	armor: null,
	dog_fashion: rt.typePath("/datum/dog_fashion/head/hop"),
});

// /obj/item/clothing/head/hopcap/proc/<init>  (code/modules/clothing/head/jobs.dm:46)
rt.def("/obj/item/clothing/head/hopcap/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 25, "bullet", 15, "laser", 25, "energy", 10, "bomb", 25, "bio", 0, "rad", 0, "fire", 50, "acid", 50]));
	return f.dot;
});

rt.type(8119, "/obj/item/clothing/head/fedora/det_hat", "/obj/item/clothing/head/fedora", {
	candy_cooldown: 0,
	name: "detective's fedora",
	desc: "There's only one man who can sniff out the dirty stench of crime, and he's likely wearing this hat.",
	icon_state: "detective",
	pockets: rt.typePath("/obj/item/weapon/storage/internal/pocket/small/detective"),
	dog_fashion: rt.typePath("/datum/dog_fashion/head/detective"),
});

// /obj/item/clothing/head/fedora/det_hat/proc/AltClick  (code/modules/clothing/head/jobs.dm:84)  may sleep
rt.def("/obj/item/clothing/head/fedora/det_hat/proc/AltClick", function* AltClick(f: Frame) {
	let M: Value = null, CC: Value = null;
	f.vars = () => [M, CC];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) return f.dot;
	M = rt.sv(f, "loc");
	if (rt.lt(rt.sv(f, "candy_cooldown"), rt.worldTime(f))) {
		CC = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/candy_corn"), [live(f.src)]));
		yield* g.callName(f, live(M), "put_in_hands", [live(CC)]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "You slip a candy corn from your hat."]);
		rt.setSv(f, "candy_cooldown", add(rt.worldTime(f), 1200));
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "You just took a candy corn! You should wait a couple minutes, lest you burn through your stash."]);
	}
	return f.dot;
}, true);

rt.type(8128, "/obj/item/clothing/head/HoS", "/obj/item/clothing/head", {
	name: "head of security cap",
	desc: "The robust standard-issue cap of the Head of Security. For showing the officers who's in charge.",
	icon_state: "hoscap",
	armor: null,
	strip_delay: 80,
});

// /obj/item/clothing/head/HoS/proc/<init>  (code/modules/clothing/head/jobs.dm:119)
rt.def("/obj/item/clothing/head/HoS/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 40, "bullet", 30, "laser", 25, "energy", 10, "bomb", 25, "bio", 10, "rad", 0, "fire", 50, "acid", 60]));
	return f.dot;
});

rt.type(8132, "/obj/item/clothing/head/warden", "/obj/item/clothing/head", {
	name: "warden's police hat",
	desc: "It's a special armored hat issued to the Warden of a security force. Protects the head from impacts.",
	icon_state: "policehelm",
	armor: null,
	strip_delay: 60,
	dog_fashion: rt.typePath("/datum/dog_fashion/head/warden"),
});

// /obj/item/clothing/head/warden/proc/<init>  (code/modules/clothing/head/jobs.dm:139)
rt.def("/obj/item/clothing/head/warden/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 40, "bullet", 30, "laser", 30, "energy", 10, "bomb", 25, "bio", 0, "rad", 0, "fire", 30, "acid", 60]));
	return f.dot;
});

rt.type(8124, "/obj/item/clothing/head/beret/sec", "/obj/item/clothing/head/beret", {
	name: "security beret",
	desc: "A robust beret with the security insignia emblazoned on it. Uses reinforced fabric to offer sufficent protection.",
	icon_state: "beret_badge",
	armor: null,
	strip_delay: 60,
	dog_fashion: null,
});

// /obj/item/clothing/head/beret/sec/proc/<init>  (code/modules/clothing/head/jobs.dm:147)
rt.def("/obj/item/clothing/head/beret/sec/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 40, "bullet", 30, "laser", 30, "energy", 10, "bomb", 25, "bio", 0, "rad", 0, "fire", 20, "acid", 50]));
	return f.dot;
});

rt.type(8126, "/obj/item/clothing/head/beret/sec/navywarden", "/obj/item/clothing/head/beret/sec", {
	name: "warden's beret",
	desc: "A special beret with the Warden's insignia emblazoned on it. For wardens with class.",
	icon_state: "wardenberet",
	armor: null,
	strip_delay: 60,
});

// /obj/item/clothing/head/beret/sec/navywarden/proc/<init>  (code/modules/clothing/head/jobs.dm:160)
rt.def("/obj/item/clothing/head/beret/sec/navywarden/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 40, "bullet", 30, "laser", 30, "energy", 10, "bomb", 25, "bio", 0, "rad", 0, "fire", 30, "acid", 50]));
	return f.dot;
});
