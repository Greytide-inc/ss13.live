// From code/modules/awaymissions/bluespaceartillery.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10886, "/obj/machinery/artillerycontrol", "/obj/machinery", {
	reload: 60,
	reload_cooldown: 60,
	explosiondev: 3,
	explosionmed: 6,
	explosionlight: 12,
	anchored: 1,
	name: "bluespace artillery control",
	icon_state: "control_boxp1",
	icon: rt.rsc("icons/obj/machines/particle_accelerator.dmi"),
	density: 1,
});

// /obj/machinery/artillerycontrol/proc/process  (code/modules/awaymissions/bluespaceartillery.dm:16)
rt.def("/obj/machinery/artillerycontrol/proc/process", function process(f: Frame) {
	if (!rt.lt(rt.sv(f, "reload"), rt.sv(f, "reload_cooldown"))) return f.dot;
	rt.incSrcVar(f, "reload", 1, true);
	return f.dot;
}, false, { waitfor: false });

// /obj/machinery/artillerycontrol/proc/attack_hand  (code/modules/awaymissions/bluespaceartillery.dm:29)  may sleep
rt.def("/obj/machinery/artillerycontrol/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let dat: Value = null;
	f.vars = () => [user, dat];
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	dat = "<B>Bluespace Artillery Control:</B><BR>";
	dat = rt.modify(live(dat), "Locked on<BR>", add);
	dat = rt.modify(live(dat), fmt("<B>Charge progress: ＀/＀:</B><BR>", [rt.sv(f, "reload"), rt.sv(f, "reload_cooldown")]), add);
	dat = rt.modify(live(dat), fmt("<A href='byond://?src=＃;fire=1'>Open Fire</A><BR>", [live(f.src)]), add);
	dat = rt.modify(live(dat), "Deployment of weapon authorized by <br>Nanotrasen Naval Command<br><br>Remember, friendly fire is grounds for termination of your contract and life.<HR>", add);
	rt.op(f, "Browse", [], [live(user), live(dat), "window=scroll"], false);
	yield* g.call(f, P("/proc/onclose"), null, [live(user), "scroll"]);
	return live(f.dot);
}, true);

// /obj/machinery/artillerycontrol/proc/Topic  (code/modules/awaymissions/bluespaceartillery.dm:40)  may sleep
rt.def("/obj/machinery/artillerycontrol/proc/Topic", function* Topic(f: Frame) {
	let A: Value = null, thearea: Value = null, L: Value = null, _T: Value = null, loc: Value = null;
	let $e: any;
	f.vars = () => [A, thearea, L, _T, loc, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	A = null;
	A = (yield* g.op(f, "Prompt", [0], [null, live(A), "Open Fire", "Area to bombard", rt.gl("teleportlocs")]));
	thearea = rt.index(rt.gl("teleportlocs"), live(A));
	if ((truthy(rt.fv(f, "stat", live(f.usr))) || truthy((yield* g.callName(f, live(f.usr), "restrained", []))))) {
		return live(f.dot);
	}
	if (rt.lt(rt.sv(f, "reload"), rt.sv(f, "reload_cooldown"))) {
		return live(f.dot);
	}
	if (!((truthy((yield* g.callName(f, rt.fv(f, "contents", live(f.usr)), "Find", [live(f.src)]))) || (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")]))))) || truthy((rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0)))) return f.dot;
	yield* g.call(f, P("/proc/priority_announce"), null, ["Bluespace artillery fire detected. Brace for impact."]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has launched an artillery strike.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
	L = rt.list();
	_T = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/get_area_turfs"), null, [rt.fv(f, "type", live(thearea))])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		L = rt.modify(live(L), live(_T), add);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/explosion"), null, [(loc = rt.op(f, "PickUnweighted", [1], [live(L)])), rt.sv(f, "explosiondev"), rt.sv(f, "explosionmed"), rt.sv(f, "explosionlight")]);
	rt.setSv(f, "reload", 0);
	return f.dot;
}, true, { args: ["href", "href_list"] });
