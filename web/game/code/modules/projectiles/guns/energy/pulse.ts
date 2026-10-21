// From code/modules/projectiles/guns/energy/pulse.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5174, "/obj/item/weapon/gun/energy/pulse", "/obj/item/weapon/gun/energy", {
	modifystate: 1,
	flags: 64,
	name: "pulse rifle",
	desc: "A heavy-duty, multifaceted energy rifle with three modes. Preferred by front-line combat personnel.",
	icon_state: "pulse",
	item_state: null,
	w_class: 4,
	force: 10,
	slot_flags: 1024,
	ammo_type: null,
	cell_type: "/obj/item/weapon/stock_parts/cell/pulse",
});

// /obj/item/weapon/gun/energy/pulse/proc/<init>  (code/modules/projectiles/guns/energy/pulse.dm:11)
rt.def("/obj/item/weapon/gun/energy/pulse/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/laser/pulse"), T("/obj/item/ammo_casing/energy/electrode"), T("/obj/item/ammo_casing/energy/laser")));
	return f.dot;
});

rt.type(5175, "/obj/item/weapon/gun/energy/pulse/prize", "/obj/item/weapon/gun/energy/pulse", {
	pin: rt.typePath("/obj/item/device/firing_pin"),
});

// /obj/item/weapon/gun/energy/pulse/prize/proc/Initialize  (code/modules/projectiles/guns/energy/pulse.dm:21)  may sleep
rt.def("/obj/item/weapon/gun/energy/pulse/prize/proc/Initialize", function* Initialize(f: Frame) {
	let msg: Value = null;
	let $0: any;
	f.vars = () => [msg, $0];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.modGl("poi_list", live(f.src), add);
	if (truthy(live(f.src))) {
		$0 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))])]);
	} else {
		$0 = "nonexistent location";
	}
	yield* g.call(f, P("/proc/message_admins"), null, [(msg = fmt("A pulse rifle prize has been created at ＀", [fmt("＀", [$0])]))]);
	yield* g.call(f, P("/proc/log_game"), null, [live(msg)]);
	yield* g.call(f, P("/proc/notify_ghosts"), null, [null, "Someone won a pulse rifle as a prize!", "source", live(f.src), "action", "orbit"], rt.Args.Named);
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/pulse/prize/proc/Destroy  (code/modules/projectiles/guns/energy/pulse.dm:31)  may sleep
rt.def("/obj/item/weapon/gun/energy/pulse/prize/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("poi_list", live(f.src), subtract));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

rt.type(5182, "/obj/item/weapon/gun/energy/pulse/destroyer", "/obj/item/weapon/gun/energy/pulse", {
	name: "pulse destroyer",
	desc: "A heavy-duty energy rifle built for pure destruction.",
	cell_type: "/obj/item/weapon/stock_parts/cell/infinite",
	ammo_type: null,
});

// /obj/item/weapon/gun/energy/pulse/destroyer/proc/<init>  (code/modules/projectiles/guns/energy/pulse.dm:68)
rt.def("/obj/item/weapon/gun/energy/pulse/destroyer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/laser/pulse")));
	return f.dot;
});

// /obj/item/weapon/gun/energy/pulse/destroyer/proc/attack_self  (code/modules/projectiles/guns/energy/pulse.dm:71)
rt.def("/obj/item/weapon/gun/energy/pulse/destroyer/proc/attack_self", function attack_self(f: Frame, user: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='danger'>＀ has three settings, and they are all DESTROY.</span>", [rt.fv(f, "name", live(f.src))])]);
	return f.dot;
});
