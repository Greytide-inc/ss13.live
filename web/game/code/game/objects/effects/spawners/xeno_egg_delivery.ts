// From code/game/objects/effects/spawners/xeno_egg_delivery.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11890, "/obj/effect/spawner/xeno_egg_delivery", "/obj/effect/spawner", {
	announcement_time: 1200,
	name: "xeno egg delivery",
	icon: rt.rsc("icons/mob/alien.dmi"),
	icon_state: "egg_growing",
});

// /obj/effect/spawner/xeno_egg_delivery/proc/Initialize  (code/game/objects/effects/spawners/xeno_egg_delivery.dm:8)  may sleep
rt.def("/obj/effect/spawner/xeno_egg_delivery/proc/Initialize", function* Initialize(f: Frame) {
	let _T: Value = null, A: Value = null, message: Value = null;
	let $0: any, $1: any;
	f.vars = () => [_T, A, message, $0, $1];
	yield* g.callSuper(f, [], rt.Args.Same);
	_T = rt.getStep(f, live(f.src), 0);
	A = (yield* g.call(f, P("/proc/get_area"), null, [live(_T)]));
	yield* g.new_(f, T("/obj/structure/alien/egg"), [live(_T)]);
	yield* g.new_(f, T("/obj/effect/temp_visual/gravpush"), [live(_T)]);
	yield* g.call(f, P("/proc/playsound"), null, [live(_T), rt.rsc("sound/items/party_horn.ogg"), 50, 1, -1]);
	$0 = live(A);
	if (truthy(live(_T))) {
		$1 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])]);
	} else {
		$1 = "nonexistent location";
	}
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("An alien egg has been delivered to ＀ at ＀.", [$0, fmt("＀", [$1])])]);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("An alien egg has been delivered to ＀ at ＀", [live(A), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])])]);
	message = fmt("Attention ＀, we have entrusted you with a research specimen in ＀. Remember to follow all safety precautions when dealing with the specimen.", [(yield* g.call(f, P("/proc/station_name"), null, [])), live(A)]);
	yield* g.callName(f, rt.gl("SSticker"), "OnRoundstart", [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/addtimer"), (yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/print_command_report"), live(message)])), rt.sv(f, "announcement_time")]))]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["mapload"] });
