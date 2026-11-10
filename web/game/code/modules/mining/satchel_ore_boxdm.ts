// Based on /tg/station's code/modules/mining/satchel_ore_boxdm.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(12956, "/obj/structure/ore_box", "/obj/structure", {
	pressure_resistance: 506.625,
	icon: rt.rsc("icons/obj/mining.dmi"),
	icon_state: "orebox",
	name: "ore box",
	desc: "A heavy wooden box, which can be filled with a lot of ores.",
	density: 1,
});

// satchel_ore_boxdm.dm:13
rt.def("/obj/structure/ore_box/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let S: Value = null, O: Value = null, C: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/ore"))) {
		if (!(yield* user.drop_item())) {
			return f.dot;
		}
		yield* W.forceMove(this);
	} else if (rt.istype(W, T("/obj/item/weapon/storage"))) {
		S = W;
		for (O of each(S.contents, T("/obj/item/weapon/ore"))) {
			yield* S.remove_from_storage(O, this);
		}
		to_chat(user, fmt("<span class='notice'>You empty the ore in ＀ into ％！.</span>", [S, this]));
	} else if (rt.istype(W, T("/obj/item/weapon/crowbar"))) {
		playsound(this.loc, W.usesound, 50, 1);
		C = W;
		if (yield* do_after(user, 50 * C.toolspeed, { target: this })) {
			user.visible_message(fmt("＀ pries ％！ apart.", [user, this]), fmt("<span class='notice'>You pry apart ％！.</span>", [this]), "<span class='italics'>You hear splitting wood.</span>");
			yield* this.deconstruct(1, user);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// satchel_ore_boxdm.dm:32
rt.def("/obj/structure/ore_box/proc/examine", function examine(f: Frame, user: Value) {
	if (this.Adjacent(user) && rt.istype(user, T("/mob/living"))) {
		this.show_contents(user);
	}
	f.dot = parent_proc();
	return f.dot;
}, false);

// satchel_ore_boxdm.dm:37
rt.def("/obj/structure/ore_box/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	if (!this.Adjacent(user)) return f.dot;
	this.show_contents(user);
	return f.dot;
});

// satchel_ore_boxdm.dm:41
rt.def("/obj/structure/ore_box/proc/attack_robot", function attack_robot(f: Frame, user: Value) {
	if (!this.Adjacent(user)) return f.dot;
	this.show_contents(user);
	return f.dot;
});

// satchel_ore_boxdm.dm:45
rt.def("/obj/structure/ore_box/proc/show_contents", function show_contents(f: Frame, user: Value) {
	let O: Value = null, i: Value = null, _T: Value = null;
	let dat: Value = "<b>The contents of the ore box reveal...</b><br>";
	let oretypes: Value = list();
	for (O of each(this.contents, T("/obj/item/weapon/ore"))) {
		(oretypes = rt.modify(oretypes, O.type, rt.bitOr));
	}
	for (i of each(oretypes)) {
		dat += `${capitalize((_T = rt.locateIn(f, i, this.contents)).name)}: ${count_by_type(this.contents, _T.type)}<br>`;
	}
	dat += fmt("<br><br><A href='?src=＃;removeall=1'>Empty box</A>", [this]);
	rt.op(f, "Browse", [], [user, dat, "window=orebox"], false);
	return f.dot;
});

// satchel_ore_boxdm.dm:56
rt.def("/obj/structure/ore_box/proc/dump_box_contents", function* dump_box_contents(f: Frame) {
	let O: Value = null;
	for (O of each(this.contents, T("/obj/item/weapon/ore"))) {
		yield* O.forceMove(this.loc);
	}
	return f.dot;
}, true);

// satchel_ore_boxdm.dm:60
rt.def("/obj/structure/ore_box/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (!this.Adjacent(f.usr)) {
		return f.dot;
	}
	yield* f.usr.set_machine(this);
	yield* this.add_fingerprint(f.usr);
	if (rt.at(href_list, "removeall")) {
		yield* this.dump_box_contents();
		to_chat(f.usr, "<span class='notice'>You empty the box.</span>");
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// satchel_ore_boxdm.dm:74
rt.def("/obj/structure/ore_box/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value, user: Value) {
	disassembled ??= 1;
	let WD: Value = (yield* new_(T("/obj/item/stack/sheet/mineral/wood"), this.loc, 4));
	if (user) {
		yield* WD.add_fingerprint(user);
	}
	yield* this.dump_box_contents();
	yield* qdel(this);
	return f.dot;
}, true);
