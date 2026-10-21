// From code/game/objects/items/devices/PDA/virus_cart.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7031, "/obj/item/weapon/cartridge/virus", "/obj/item/weapon/cartridge", {
	charges: 5,
	name: "Generic Virus PDA cart",
});

// /obj/item/weapon/cartridge/virus/proc/message_header  (code/game/objects/items/devices/PDA/virus_cart.dm:9)
rt.def("/obj/item/weapon/cartridge/virus/proc/message_header", function message_header(f: Frame) {
	return fmt("<b>＀ viral files left.</b><HR>", [rt.sv(f, "charges")]);
});

// /obj/item/weapon/cartridge/virus/proc/message_special  (code/game/objects/items/devices/PDA/virus_cart.dm:12)
rt.def("/obj/item/weapon/cartridge/virus/proc/message_special", function message_special(f: Frame, target: Value) {
	if (!truthy((rt.istype(rt.sv(f, "loc"), T("/obj/item/device/pda")) ? 1 : 0))) {
		return "";
	}
	return fmt(" (<a href='byond://?src=＃;choice=cart;special=virus;target=＃'>*Send Virus*</a>)", [rt.sv(f, "loc"), live(target)]);
	return f.dot;
});

// /obj/item/weapon/cartridge/virus/proc/special  (code/game/objects/items/devices/PDA/virus_cart.dm:17)  may sleep
rt.def("/obj/item/weapon/cartridge/virus/proc/special", function* special(f: Frame, user: Value, params: Value) {
	let _P: Value = null;
	f.vars = () => [user, params, _P];
	yield* g.srcCall(f, "send_virus", (_P = rt.locateIn(f, rt.at(live(params), "target"), rt.world())), live(user));
	return f.dot;
}, true);

rt.type(7032, "/obj/item/weapon/cartridge/virus/clown", "/obj/item/weapon/cartridge/virus", {
	access: 32,
	name: "１Honkworks 5.0 cartridge",
	icon_state: "cart-clown",
	desc: "A data cartridge for portable microcomputers. It smells vaguely of banannas",
});

// /obj/item/weapon/cartridge/virus/clown/proc/send_virus  (code/game/objects/items/devices/PDA/virus_cart.dm:27)
rt.def("/obj/item/weapon/cartridge/virus/clown/proc/send_virus", function send_virus(f: Frame, target: Value, U: Value) {
	if (rt.le(rt.sv(f, "charges"), 0)) {
		rt.call(f, P("/proc/to_chat"), null, [live(U), "<span class='notice'>Out of charges.</span>"]);
		return live(f.dot);
	}
	if ((live(target) !== null && !truthy(rt.fv(f, "toff", live(target))))) {
		rt.incSrcVar(f, "charges", -1, true);
		rt.call(f, P("/proc/to_chat"), null, [live(U), "<span class='notice'>Virus Sent!</span>"]);
		rt.setFv(f, "honkamt", live(target), rt.call(f, P("/proc/rand"), null, [15, 20]));
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(U), "PDA not found."]);
	}
	return f.dot;
});

rt.type(7033, "/obj/item/weapon/cartridge/virus/mime", "/obj/item/weapon/cartridge/virus", {
	access: 64,
	name: "１Gestur-O 1000 cartridge",
	icon_state: "cart-mi",
});

// /obj/item/weapon/cartridge/virus/mime/proc/send_virus  (code/game/objects/items/devices/PDA/virus_cart.dm:43)
rt.def("/obj/item/weapon/cartridge/virus/mime/proc/send_virus", function send_virus(f: Frame, target: Value, U: Value) {
	if (rt.le(rt.sv(f, "charges"), 0)) {
		rt.call(f, P("/proc/to_chat"), null, [live(U), "<span class='notice'>Out of charges.</span>"]);
		return live(f.dot);
	}
	if ((live(target) !== null && !truthy(rt.fv(f, "toff", live(target))))) {
		rt.incSrcVar(f, "charges", -1, true);
		rt.call(f, P("/proc/to_chat"), null, [live(U), "<span class='notice'>Virus Sent!</span>"]);
		rt.setFv(f, "silent", live(target), 1);
		rt.setFv(f, "ttone", live(target), "silence");
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(U), "PDA not found."]);
	}
	return f.dot;
});

rt.type(7034, "/obj/item/weapon/cartridge/virus/syndicate", "/obj/item/weapon/cartridge/virus", {
	access: 1024,
	remote_door_id: "smindicate",
	charges: 4,
	name: "１Detomatix cartridge",
	icon_state: "cart",
});

// /obj/item/weapon/cartridge/virus/syndicate/proc/send_virus  (code/game/objects/items/devices/PDA/virus_cart.dm:62)  may sleep
rt.def("/obj/item/weapon/cartridge/virus/syndicate/proc/send_virus", function* send_virus(f: Frame, target: Value, U: Value) {
	let difficulty: Value = null;
	f.vars = () => [target, U, difficulty];
	if (rt.le(rt.sv(f, "charges"), 0)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(U), "<span class='notice'>Out of charges.</span>"]);
		return live(f.dot);
	}
	if ((live(target) !== null && !truthy(rt.fv(f, "toff", live(target))))) {
		rt.incSrcVar(f, "charges", -1, true);
		difficulty = 0;
		if (truthy(rt.fv(f, "cartridge", live(target)))) {
			difficulty = rt.modify(live(difficulty), (yield* g.call(f, P("/proc/BitCount"), null, [rt.bitAnd(rt.gv(f, "access", rt.fv(f, "cartridge", live(target))), 187)])), add);
		}
		if (truthy(rt.bitAnd(rt.gv(f, "access", rt.fv(f, "cartridge", live(target))), 16))) {
			difficulty = rt.inc(live(difficulty), 1);
		} else {
			difficulty = rt.modify(live(difficulty), 2, add);
		}
		if (((!truthy(rt.fv(f, "detonatable", live(target))) || truthy(rt.op(f, "Prob", [], [multiply(live(difficulty), 15)]))) || truthy(rt.fv(f, "hidden_uplink", live(target))))) {
			yield* g.callName(f, live(U), "show_message", [fmt("<span class='danger'>An error flashes on your ＀.</span>", [live(f.src)]), 1]);
		} else {
			yield* g.callName(f, live(U), "show_message", ["<span class='notice'>Success!</span>", 1]);
			yield* g.callName(f, live(target), "explode", []);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(U), "PDA not found."]);
	}
	return f.dot;
}, true);

rt.type(7035, "/obj/item/weapon/cartridge/virus/frame", "/obj/item/weapon/cartridge/virus", {
	telecrystals: 0,
	name: "１F.R.A.M.E. cartridge",
	icon_state: "cart",
});

// /obj/item/weapon/cartridge/virus/frame/proc/send_virus  (code/game/objects/items/devices/PDA/virus_cart.dm:88)  may sleep
rt.def("/obj/item/weapon/cartridge/virus/frame/proc/send_virus", function* send_virus(f: Frame, target: Value, U: Value) {
	let lock_code: Value = null, uplink: Value = null;
	f.vars = () => [target, U, lock_code, uplink];
	if (rt.le(rt.sv(f, "charges"), 0)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(U), "<span class='notice'>Out of charges.</span>"]);
		return live(f.dot);
	}
	if ((live(target) !== null && !truthy(rt.fv(f, "toff", live(target))))) {
		rt.incSrcVar(f, "charges", -1, true);
		lock_code = fmt("＀ ＀", [(yield* g.call(f, P("/proc/rand"), null, [100, 999])), rt.op(f, "PickUnweighted", [26], ["Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", "Juliet", "Kilo", "Lima", "Mike", "November", "Oscar", "Papa", "Quebec", "Romeo", "Sierra", "Tango", "Uniform", "Victor", "Whiskey", "X-ray", "Yankee", "Zulu"])]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(U), fmt("<span class='notice'>Virus Sent!  The unlock code to the target is: ＀</span>", [live(lock_code)])]);
		if (!truthy(rt.fv(f, "hidden_uplink", live(target)))) {
			uplink = (yield* g.new_(f, T("/obj/item/device/uplink"), [live(target)]));
			rt.setFv(f, "hidden_uplink", live(target), live(uplink));
			rt.setFv(f, "lock_code", live(target), live(lock_code));
		} else {
			rt.modField(f, rt.fv(f, "hidden_uplink", live(target)), "hidden_crystals", rt.gv(f, "telecrystals", rt.fv(f, "hidden_uplink", live(target))), add);
		}
		rt.setFv(f, "telecrystals", rt.fv(f, "hidden_uplink", live(target)), rt.sv(f, "telecrystals"));
		rt.setSv(f, "telecrystals", 0);
		rt.setFv(f, "active", rt.fv(f, "hidden_uplink", live(target)), 1);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(U), "PDA not found."]);
	}
	return f.dot;
}, true);
