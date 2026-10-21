// From code/modules/paperwork/folders.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7607, "/obj/item/weapon/folder", "/obj/item/weapon", {
	pressure_resistance: 2,
	name: "folder",
	desc: "A folder.",
	icon: rt.rsc("icons/obj/bureaucracy.dmi"),
	icon_state: "folder",
	w_class: 2,
	resistance_flags: 4,
});

// /obj/item/weapon/folder/proc/update_icon  (code/modules/paperwork/folders.dm:28)
rt.def("/obj/item/weapon/folder/proc/update_icon", function update_icon(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	if (!truthy(rt.len(f, rt.sv(f, "contents")))) return f.dot;
	rt.callSrc(f, "add_overlay", ["folder_paper"]);
	return f.dot;
});

// /obj/item/weapon/folder/proc/attackby  (code/modules/paperwork/folders.dm:34)  may sleep
rt.def("/obj/item/weapon/folder/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let n_name: Value = null;
	let $0: any;
	f.vars = () => [W, user, params, n_name, $0];
	if (((truthy((rt.istype(live(W), T("/obj/item/weapon/paper")) ? 1 : 0)) || truthy((rt.istype(live(W), T("/obj/item/weapon/photo")) ? 1 : 0))) || truthy((rt.istype(live(W), T("/obj/item/documents")) ? 1 : 0)))) {
		if (!truthy((yield* g.callName(f, live(user), "transferItemToLoc", [live(W), live(f.src)])))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You put ＀ into ＀.</span>", [live(W), live(f.src)])]);
		yield* g.srcCall(f, "update_icon");
	} else {
		if (!truthy((rt.istype(live(W), T("/obj/item/weapon/pen")) ? 1 : 0))) return f.dot;
		n_name = (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [(yield* g.op(f, "Prompt", [2], [null, "Folder Labelling", "What would you like to label the folder?", live(user), null]))])), 1, 42]));
		if (!(rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(user)])), 1) && isEqual(rt.fv(f, "stat", live(user)), 0))) return f.dot;
		if (truthy(live(n_name))) {
			$0 = fmt(" - '＀'", [live(n_name)]);
		} else {
			$0 = null;
		}
		rt.setSv(f, "name", fmt("folder＀", [$0]));
	}
	return f.dot;
}, true);

// /obj/item/weapon/folder/proc/attack_self  (code/modules/paperwork/folders.dm:46)  may sleep
rt.def("/obj/item/weapon/folder/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let dat: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [user, dat, I, $e];
	dat = fmt("<title>＀</title>", [rt.sv(f, "name")]);
	I = null;
	rt.forList(f, 0, live(f.src), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;remove=＃'>Remove</A> - <A href='?src=＃;read=＃'>＀</A><BR>", [live(f.src), live(I), live(f.src), live(I), rt.fv(f, "name", live(I))]), add);
	}
	rt.endFor(f, 0);
	rt.op(f, "Browse", [], [live(user), live(dat), "window=folder"], false);
	yield* g.call(f, P("/proc/onclose"), null, [live(user), "folder"]);
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	return f.dot;
}, true);

// /obj/item/weapon/folder/proc/Topic  (code/modules/paperwork/folders.dm:56)  may sleep
rt.def("/obj/item/weapon/folder/proc/Topic", function* Topic(f: Frame) {
	let I: Value = null;
	f.vars = () => [I];
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((truthy(rt.fv(f, "stat", live(f.usr))) || truthy((yield* g.callName(f, live(f.usr), "restrained", []))))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, rt.fv(f, "contents", live(f.usr)), "Find", [live(f.src)])))) return f.dot;
	if (truthy(rt.at(live(f.args[1]), "remove"))) {
		if ((truthy((rt.istype((I = rt.locateIn(f, rt.at(live(f.args[1]), "remove"), rt.world())), T("/obj/item")) ? 1 : 0)) && isEqual(rt.fv(f, "loc", live(I)), live(f.src)))) {
			rt.setFv(f, "loc", live(I), rt.fv(f, "loc", live(f.usr)));
			yield* g.callName(f, live(f.usr), "put_in_hands", [live(I)]);
		}
	}
	if (truthy(rt.at(live(f.args[1]), "read"))) {
		if ((truthy((rt.istype((I = rt.locateIn(f, rt.at(live(f.args[1]), "read"), rt.world())), T("/obj/item")) ? 1 : 0)) && isEqual(rt.fv(f, "loc", live(I)), live(f.src)))) {
			yield* g.callName(f, live(f.usr), "examinate", [live(I)]);
		}
	}
	yield* g.srcCall(f, "attack_self", live(f.usr));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["href", "href_list"] });

rt.type(7612, "/obj/item/weapon/folder/documents", "/obj/item/weapon/folder", {
	name: "folder- 'TOP SECRET'",
	desc: "A folder stamped \"Top Secret - Property of Nanotrasen Corporation. Unauthorized distribution is punishable by death.\"",
});

// /obj/item/weapon/folder/documents/proc/Initialize  (code/modules/paperwork/folders.dm:82)  may sleep
rt.def("/obj/item/weapon/folder/documents/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.new_(f, T("/obj/item/documents/nanotrasen"), [live(f.src)]);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

rt.type(7614, "/obj/item/weapon/folder/syndicate/red", "/obj/item/weapon/folder/syndicate", {
	icon_state: "folder_sred",
});

// /obj/item/weapon/folder/syndicate/red/proc/Initialize  (code/modules/paperwork/folders.dm:95)  may sleep
rt.def("/obj/item/weapon/folder/syndicate/red/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.new_(f, T("/obj/item/documents/syndicate/red"), [live(f.src)]);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

rt.type(7615, "/obj/item/weapon/folder/syndicate/blue", "/obj/item/weapon/folder/syndicate", {
	icon_state: "folder_sblue",
});

// /obj/item/weapon/folder/syndicate/blue/proc/Initialize  (code/modules/paperwork/folders.dm:103)  may sleep
rt.def("/obj/item/weapon/folder/syndicate/blue/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.new_(f, T("/obj/item/documents/syndicate/blue"), [live(f.src)]);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

rt.type(7616, "/obj/item/weapon/folder/syndicate/mining", "/obj/item/weapon/folder/syndicate", {});

// /obj/item/weapon/folder/syndicate/mining/proc/Initialize  (code/modules/paperwork/folders.dm:108)  may sleep
rt.def("/obj/item/weapon/folder/syndicate/mining/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.new_(f, T("/obj/item/documents/syndicate/mining"), [live(f.src)]);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);
