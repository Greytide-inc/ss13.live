// Based on /tg/station's code/game/objects/items/devices/PDA/virus_cart.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(7031, "/obj/item/weapon/cartridge/virus", "/obj/item/weapon/cartridge", {
	charges: 5,
	name: "Generic Virus PDA cart",
});

// virus_cart.dm:9
rt.def("/obj/item/weapon/cartridge/virus/proc/message_header", function message_header(f: Frame) {
	return `<b>${this.charges} viral files left.</b><HR>`;
});

// virus_cart.dm:12
rt.def("/obj/item/weapon/cartridge/virus/proc/message_special", function message_special(f: Frame, target: Value) {
	if (!rt.istype(this.loc, T("/obj/item/device/pda"))) {
		return "";
	}
	return fmt(" (<a href='byond://?src=＃;choice=cart;special=virus;target=＃'>*Send Virus*</a>)", [this.loc, target]);
});

// virus_cart.dm:17
rt.def("/obj/item/weapon/cartridge/virus/proc/special", function* special(f: Frame, user: Value, params: Value) {
	let _P: Value = null;
	yield* this.send_virus((_P = rt.locateIn(f, rt.at(params, "target"), rt.world())), user);
	return f.dot;
}, true);

rt.type(7032, "/obj/item/weapon/cartridge/virus/clown", "/obj/item/weapon/cartridge/virus", {
	access: 32,
	name: "１Honkworks 5.0 cartridge",
	icon_state: "cart-clown",
	desc: "A data cartridge for portable microcomputers. It smells vaguely of banannas",
});

// virus_cart.dm:27
rt.def("/obj/item/weapon/cartridge/virus/clown/proc/send_virus", function send_virus(f: Frame, target: Value, U: Value) {
	if (this.charges <= 0) {
		to_chat(U, "<span class='notice'>Out of charges.</span>");
		return f.dot;
	}
	if (target !== null && !target.toff) {
		this.charges--;
		to_chat(U, "<span class='notice'>Virus Sent!</span>");
		target.honkamt = rand(15, 20);
	} else {
		to_chat(U, "PDA not found.");
	}
	return f.dot;
});

rt.type(7033, "/obj/item/weapon/cartridge/virus/mime", "/obj/item/weapon/cartridge/virus", {
	access: 64,
	name: "１Gestur-O 1000 cartridge",
	icon_state: "cart-mi",
});

// virus_cart.dm:43
rt.def("/obj/item/weapon/cartridge/virus/mime/proc/send_virus", function send_virus(f: Frame, target: Value, U: Value) {
	if (this.charges <= 0) {
		to_chat(U, "<span class='notice'>Out of charges.</span>");
		return f.dot;
	}
	if (target !== null && !target.toff) {
		this.charges--;
		to_chat(U, "<span class='notice'>Virus Sent!</span>");
		target.silent = 1;
		target.ttone = "silence";
	} else {
		to_chat(U, "PDA not found.");
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

// virus_cart.dm:62
rt.def("/obj/item/weapon/cartridge/virus/syndicate/proc/send_virus", function* send_virus(f: Frame, target: Value, U: Value) {
	let difficulty: Value = null;
	if (this.charges <= 0) {
		to_chat(U, "<span class='notice'>Out of charges.</span>");
		return f.dot;
	}
	if (target !== null && !target.toff) {
		this.charges--;
		difficulty = 0;
		if (target.cartridge) {
			difficulty += BitCount(rt.bitAnd(target.cartridge.access, 187));
		}
		if (rt.bitAnd(target.cartridge.access, 16)) {
			difficulty++;
		} else {
			difficulty += 2;
		}
		if (!target.detonatable || prob(difficulty * 15) || target.hidden_uplink) {
			U.show_message(`<span class='danger'>An error flashes on your ${this}.</span>`, 1);
		} else {
			U.show_message("<span class='notice'>Success!</span>", 1);
			yield* target.explode();
		}
	} else {
		to_chat(U, "PDA not found.");
	}
	return f.dot;
}, true);

rt.type(7035, "/obj/item/weapon/cartridge/virus/frame", "/obj/item/weapon/cartridge/virus", {
	telecrystals: 0,
	name: "１F.R.A.M.E. cartridge",
	icon_state: "cart",
});

// virus_cart.dm:88
rt.def("/obj/item/weapon/cartridge/virus/frame/proc/send_virus", function* send_virus(f: Frame, target: Value, U: Value) {
	let lock_code: Value = null, uplink: Value = null;
	if (this.charges <= 0) {
		to_chat(U, "<span class='notice'>Out of charges.</span>");
		return f.dot;
	}
	if (target !== null && !target.toff) {
		this.charges--;
		lock_code = `${rand(100, 999)} ${pick("Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", "Juliet", "Kilo", "Lima", "Mike", "November", "Oscar", "Papa", "Quebec", "Romeo", "Sierra", "Tango", "Uniform", "Victor", "Whiskey", "X-ray", "Yankee", "Zulu")}`;
		to_chat(U, `<span class='notice'>Virus Sent!  The unlock code to the target is: ${lock_code}</span>`);
		if (!target.hidden_uplink) {
			uplink = (yield* new_(T("/obj/item/device/uplink"), target));
			target.hidden_uplink = uplink;
			target.lock_code = lock_code;
		} else {
			target.hidden_uplink.hidden_crystals += target.hidden_uplink.telecrystals;
		}
		target.hidden_uplink.telecrystals = this.telecrystals;
		this.telecrystals = 0;
		target.hidden_uplink.active = 1;
	} else {
		to_chat(U, "PDA not found.");
	}
	return f.dot;
}, true);
