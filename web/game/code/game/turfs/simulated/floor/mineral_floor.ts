// From code/game/turfs/simulated/floor/mineral_floor.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4568, "/turf/open/floor/mineral", "/turf/open/floor", {
	icons: null,
	name: "mineral floor",
	icon_state: "",
});

// /turf/open/floor/mineral/proc/Initialize  (code/game/turfs/simulated/floor/mineral_floor.dm:20)  may sleep
rt.def("/turf/open/floor/mineral/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "broken_states", rt.list(fmt("＀_dam", [rt.initial(f, live(f.src), "icon_state")])));
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "icons"))) return f.dot;
	rt.setSv(f, "icons", rt.list());
	return f.dot;
}, true);

// /turf/open/floor/mineral/proc/update_icon  (code/game/turfs/simulated/floor/mineral_floor.dm:27)
rt.def("/turf/open/floor/mineral/proc/update_icon", function update_icon(f: Frame) {
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return 0;
	}
	if (!(!truthy(rt.sv(f, "broken")) && !truthy(rt.sv(f, "burnt")))) return f.dot;
	if (truthy((rt.isIn(f, rt.sv(f, "icon_state"), rt.sv(f, "icons")) ? 1 : 0))) return f.dot;
	rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
	return f.dot;
});

rt.type(4569, "/turf/open/floor/mineral/plasma", "/turf/open/floor/mineral", {
	icons: null,
	name: "plasma floor",
	icon_state: "plasma",
	floor_tile: rt.typePath("/obj/item/stack/tile/mineral/plasma"),
});

// /turf/open/floor/mineral/plasma/proc/temperature_expose  (code/game/turfs/simulated/floor/mineral_floor.dm:42)  may sleep
rt.def("/turf/open/floor/mineral/plasma/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	f.vars = () => [air, exposed_temperature, exposed_volume];
	if (!rt.gt(live(exposed_temperature), 300)) return f.dot;
	yield* g.srcCall(f, "PlasmaBurn", live(exposed_temperature));
	return f.dot;
}, true);

// /turf/open/floor/mineral/plasma/proc/attackby  (code/game/turfs/simulated/floor/mineral_floor.dm:46)  may sleep
rt.def("/turf/open/floor/mineral/plasma/proc/attackby", function* attackby(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (rt.gt((yield* g.callName(f, live(f.args[0]), "is_hot", [])), 300)) {
		$0 = fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.args[1])])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(f.args[1])]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(f.args[1])])]);
		if (truthy(live(f.src))) {
			$1 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))])]);
		} else {
			$1 = "nonexistent location";
		}
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("Plasma flooring was ignited by ＀ in ＀", [$0, fmt("＀", [$1])]), 0, 1]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("Plasma flooring was ignited by ＀ in ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.args[1])])), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))])])]);
		yield* g.srcCall(f, "ignite", (yield* g.callName(f, live(f.args[0]), "is_hot", [])));
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /turf/open/floor/mineral/plasma/proc/PlasmaBurn  (code/game/turfs/simulated/floor/mineral_floor.dm:54)  may sleep
rt.def("/turf/open/floor/mineral/plasma/proc/PlasmaBurn", function* PlasmaBurn(f: Frame, temperature: Value) {
	f.vars = () => [temperature];
	yield* g.srcCall(f, "make_plating");
	yield* g.srcCall(f, "atmos_spawn_air", fmt("plasma=20;TEMP=＀", [live(temperature)]));
	return f.dot;
}, true);

// /turf/open/floor/mineral/plasma/proc/ignite  (code/game/turfs/simulated/floor/mineral_floor.dm:58)  may sleep
rt.def("/turf/open/floor/mineral/plasma/proc/ignite", function* ignite(f: Frame, exposed_temperature: Value) {
	f.vars = () => [exposed_temperature];
	if (!rt.gt(live(exposed_temperature), 300)) return f.dot;
	yield* g.srcCall(f, "PlasmaBurn", live(exposed_temperature));
	return f.dot;
}, true);

rt.type(4583, "/turf/open/floor/mineral/bananium", "/turf/open/floor/mineral", {
	spam_flag: 0,
	icons: null,
	name: "bananium floor",
	icon_state: "bananium",
	floor_tile: rt.typePath("/obj/item/stack/tile/mineral/bananium"),
});

// /turf/open/floor/mineral/bananium/proc/Entered  (code/game/turfs/simulated/floor/mineral_floor.dm:133)  may sleep
rt.def("/turf/open/floor/mineral/bananium/proc/Entered", function* Entered(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.dot))) return f.dot;
	if (!truthy((rt.istype(live(f.args[0]), T("/mob")) ? 1 : 0))) return f.dot;
	yield* g.srcCall(f, "squeek");
	return f.dot;
}, true, { args: ["AM"] });

// /turf/open/floor/mineral/bananium/proc/attackby  (code/game/turfs/simulated/floor/mineral_floor.dm:139)  may sleep
rt.def("/turf/open/floor/mineral/bananium/proc/attackby", function* attackby(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.dot))) return f.dot;
	yield* g.srcCall(f, "honk");
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /turf/open/floor/mineral/bananium/proc/attack_hand  (code/game/turfs/simulated/floor/mineral_floor.dm:144)  may sleep
rt.def("/turf/open/floor/mineral/bananium/proc/attack_hand", function* attack_hand(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.dot))) return f.dot;
	yield* g.srcCall(f, "honk");
	return f.dot;
}, true, { args: ["user"] });

// /turf/open/floor/mineral/bananium/proc/attack_paw  (code/game/turfs/simulated/floor/mineral_floor.dm:149)  may sleep
rt.def("/turf/open/floor/mineral/bananium/proc/attack_paw", function* attack_paw(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.dot))) return f.dot;
	yield* g.srcCall(f, "honk");
	return f.dot;
}, true, { args: ["user"] });

// /turf/open/floor/mineral/bananium/proc/honk  (code/game/turfs/simulated/floor/mineral_floor.dm:154)
rt.def("/turf/open/floor/mineral/bananium/proc/honk", function honk(f: Frame) {
	if (!rt.lt(rt.sv(f, "spam_flag"), rt.worldTime(f))) return f.dot;
	rt.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/bikehorn.ogg"), 50, 1]);
	rt.setSv(f, "spam_flag", add(rt.worldTime(f), 20));
	return f.dot;
});

// /turf/open/floor/mineral/bananium/proc/squeek  (code/game/turfs/simulated/floor/mineral_floor.dm:159)
rt.def("/turf/open/floor/mineral/bananium/proc/squeek", function squeek(f: Frame) {
	if (!rt.lt(rt.sv(f, "spam_flag"), rt.worldTime(f))) return f.dot;
	rt.call(f, P("/proc/playsound"), null, [live(f.src), "clownstep", 50, 1]);
	rt.setSv(f, "spam_flag", add(rt.worldTime(f), 10));
	return f.dot;
});

rt.type(4586, "/turf/open/floor/mineral/uranium", "/turf/open/floor/mineral", {
	last_event: 0,
	active: null,
	icons: null,
	name: "uranium floor",
	icon_state: "uranium",
	floor_tile: rt.typePath("/obj/item/stack/tile/mineral/uranium"),
});

// /turf/open/floor/mineral/uranium/proc/Entered  (code/game/turfs/simulated/floor/mineral_floor.dm:185)  may sleep
rt.def("/turf/open/floor/mineral/uranium/proc/Entered", function* Entered(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.dot))) return f.dot;
	if (!truthy((rt.istype(live(f.args[0]), T("/mob")) ? 1 : 0))) return f.dot;
	yield* g.srcCall(f, "radiate");
	return f.dot;
}, true, { args: ["AM"] });

// /turf/open/floor/mineral/uranium/proc/attackby  (code/game/turfs/simulated/floor/mineral_floor.dm:191)  may sleep
rt.def("/turf/open/floor/mineral/uranium/proc/attackby", function* attackby(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.dot))) return f.dot;
	yield* g.srcCall(f, "radiate");
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /turf/open/floor/mineral/uranium/proc/attack_hand  (code/game/turfs/simulated/floor/mineral_floor.dm:196)  may sleep
rt.def("/turf/open/floor/mineral/uranium/proc/attack_hand", function* attack_hand(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.dot))) return f.dot;
	yield* g.srcCall(f, "radiate");
	return f.dot;
}, true, { args: ["user"] });

// /turf/open/floor/mineral/uranium/proc/attack_paw  (code/game/turfs/simulated/floor/mineral_floor.dm:201)  may sleep
rt.def("/turf/open/floor/mineral/uranium/proc/attack_paw", function* attack_paw(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.dot))) return f.dot;
	yield* g.srcCall(f, "radiate");
	return f.dot;
}, true, { args: ["user"] });

// /turf/open/floor/mineral/uranium/proc/radiate  (code/game/turfs/simulated/floor/mineral_floor.dm:206)  may sleep
rt.def("/turf/open/floor/mineral/uranium/proc/radiate", function* radiate(f: Frame) {
	let _T: Value = null;
	let $e: any;
	f.vars = () => [_T, $e];
	if (truthy(rt.sv(f, "active"))) return f.dot;
	if (!rt.gt(rt.worldTime(f), add(rt.sv(f, "last_event"), 15))) return f.dot;
	rt.setSv(f, "active", 1);
	yield* g.call(f, P("/proc/radiation_pulse"), null, [rt.getStep(f, live(f.src), 0), 3, 3, 1, 0]);
	_T = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [1, live(f.src)])), T("/turf/open/floor/mineral/uranium"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		yield* g.callName(f, live(_T), "radiate", []);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "last_event", rt.worldTime(f));
	rt.setSv(f, "active", 0);
	return live(f.dot);
}, true);

rt.type(4587, "/turf/open/floor/mineral/abductor", "/turf/open/floor/mineral", {
	icons: null,
	name: "alien floor",
	icon_state: "alienpod1",
	floor_tile: rt.typePath("/obj/item/stack/tile/mineral/abductor"),
});

// /turf/open/floor/mineral/abductor/proc/Initialize  (code/game/turfs/simulated/floor/mineral_floor.dm:224)  may sleep
rt.def("/turf/open/floor/mineral/abductor/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("alienpod＀", [(yield* g.call(f, P("/proc/rand"), null, [1, 9]))]));
	return f.dot;
}, true);

// /turf/open/floor/mineral/abductor/proc/make_plating  (code/game/turfs/simulated/floor/mineral_floor.dm:234)  may sleep
rt.def("/turf/open/floor/mineral/abductor/proc/make_plating", function* make_plating(f: Frame) {
	return (yield* g.srcCall(f, "ChangeTurf", T("/turf/open/floor/plating/abductor2")));
}, true);
