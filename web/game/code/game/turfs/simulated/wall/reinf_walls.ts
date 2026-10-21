// From code/game/turfs/simulated/wall/reinf_walls.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4441, "/turf/closed/wall/r_wall", "/turf/closed/wall", {
	d_state: 0,
	name: "reinforced wall",
	desc: "A huge chunk of reinforced metal used to separate rooms.",
	icon: rt.rsc("icons/turf/walls/reinforced_wall.dmi"),
	icon_state: "r_wall",
	opacity: 1,
	density: 1,
	hardness: 10,
	sheet_amount: 1,
	explosion_block: 2,
	sheet_type: rt.typePath("/obj/item/stack/sheet/plasteel"),
	girder_type: rt.typePath("/obj/structure/girder/reinforced"),
});

// /turf/closed/wall/r_wall/proc/examine  (code/game/turfs/simulated/wall/reinf_walls.dm:17)
rt.def("/turf/closed/wall/r_wall/proc/examine", function examine(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "d_state");
	if ($0 === 0) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>The outer <b>grille</b> is fully intact.</span>"]);
	} else if ($0 === 1) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>The outer <i>grille</i> has been cut, and the support lines are <b>screwed</b> securely to the outer cover.</span>"]);
	} else if ($0 === 2) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>The support lines have been <i>unscrewed</i>, and the metal cover is <b>welded</b> firmly in place.</span>"]);
	} else if ($0 === 3) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>The metal cover has been <i>sliced through</i>, and is <b>connected loosely</b> to the girder.</span>"]);
	} else if ($0 === 4) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>The outer cover has been <i>pried away</i>, and the bolts anchoring the support rods are <b>wrenched</b> in place.</span>"]);
	} else if ($0 === 5) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>The bolts anchoring the support rods have been <i>loosened</i>, but are still <b>welded</b> firmly to the girder.</span>"]);
	} else if ($0 === 6) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>The support rods have been <i>sliced through</i>, and the outer sheath is <b>connected loosely</b> to the girder.</span>"]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /turf/closed/wall/r_wall/proc/devastate_wall  (code/game/turfs/simulated/wall/reinf_walls.dm:35)  may sleep
rt.def("/turf/closed/wall/r_wall/proc/devastate_wall", function* devastate_wall(f: Frame) {
	yield* g.new_(f, rt.sv(f, "sheet_type"), [live(f.src), rt.sv(f, "sheet_amount")]);
	yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [live(f.src), 2]);
	return f.dot;
}, true);

// /turf/closed/wall/r_wall/proc/attack_animal  (code/game/turfs/simulated/wall/reinf_walls.dm:39)  may sleep
rt.def("/turf/closed/wall/r_wall/proc/attack_animal", function* attack_animal(f: Frame, M: Value) {
	f.vars = () => [M];
	yield* g.callName(f, live(M), "changeNext_move", [8]);
	yield* g.callName(f, live(M), "do_attack_animation", [live(f.src)]);
	if (!truthy(rt.fv(f, "environment_smash", live(M)))) {
		return live(f.dot);
	}
	if (isEqual(rt.fv(f, "environment_smash", live(M)), 3)) {
		yield* g.srcCall(f, "dismantle_wall", 1);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/meteorimpact.ogg"), 100, 1]);
	} else {
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/bang.ogg"), 50, 1]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='warning'>This wall is far too strong for you to destroy.</span>"]);
	}
	return f.dot;
}, true);

// /turf/closed/wall/r_wall/proc/try_destroy  (code/game/turfs/simulated/wall/reinf_walls.dm:51)  may sleep
rt.def("/turf/closed/wall/r_wall/proc/try_destroy", function* try_destroy(f: Frame, W: Value, user: Value, _T: Value) {
	let D: Value = null;
	f.vars = () => [W, user, _T, D];
	if (truthy((rt.istype(live(W), T("/obj/item/weapon/pickaxe/drill/jackhammer")) ? 1 : 0))) {
		D = live(W);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You begin to smash though the ＀...</span>", [rt.sv(f, "name")])]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 50, "target", live(f.src)], rt.Args.Named)))) {
			if ((!truthy((rt.istype(live(f.src), T("/turf/closed/wall/r_wall")) ? 1 : 0)) || !truthy(live(W)))) {
				return 1;
			}
			yield* g.callName(f, live(D), "playDigSound", []);
			yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ smashes through the ＀ with the ＀!</span>", [live(user), rt.sv(f, "name"), rt.fv(f, "name", live(D))]), "<span class='italics'>You hear the grinding of metal.</span>");
			yield* g.srcCall(f, "dismantle_wall");
			return 1;
		}
	}
	return 0;
}, true);

// /turf/closed/wall/r_wall/proc/try_decon  (code/game/turfs/simulated/wall/reinf_walls.dm:65)  may sleep
rt.def("/turf/closed/wall/r_wall/proc/try_decon", function* try_decon(f: Frame, W: Value, user: Value, _T: Value) {
	let WT: Value = null;
	let $0: any;
	f.vars = () => [W, user, _T, WT, $0];
	$0 = rt.sv(f, "d_state");
	if ($0 === 0) {
		if (truthy((rt.istype(live(W), T("/obj/item/weapon/wirecutters")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(W)), 100, 1]);
			rt.setSv(f, "d_state", 1);
			yield* g.srcCall(f, "update_icon");
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You cut the outer grille.</span>"]);
			return 1;
		}
	} else if ($0 === 1) {
		if (truthy((rt.istype(live(W), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You begin unsecuring the support lines...</span>"]);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(W)), 100, 1]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(40, rt.fv(f, "toolspeed", live(W))), "target", live(f.src)], rt.Args.Named)))) {
				if (((!truthy((rt.istype(live(f.src), T("/turf/closed/wall/r_wall")) ? 1 : 0)) || !truthy(live(W))) || !isEqual(rt.sv(f, "d_state"), 1))) {
					return 1;
				}
				rt.setSv(f, "d_state", 2);
				yield* g.srcCall(f, "update_icon");
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You unsecure the support lines.</span>"]);
			}
			return 1;
		} else {
			if (truthy((rt.istype(live(W), T("/obj/item/weapon/wirecutters")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(W)), 100, 1]);
				rt.setSv(f, "d_state", 0);
				yield* g.srcCall(f, "update_icon");
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You repair the outer grille.</span>"]);
				return 1;
			}
		}
	} else if ($0 === 2) {
		if (truthy((rt.istype(live(W), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
			if (truthy((yield* g.callName(f, (WT = live(W)), "remove_fuel", [0, live(user)])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You begin slicing through the metal cover...</span>"]);
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(W)), 100, 1]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(60, rt.fv(f, "toolspeed", live(W))), "target", live(f.src)], rt.Args.Named)))) {
					if ((((!truthy((rt.istype(live(f.src), T("/turf/closed/wall/r_wall")) ? 1 : 0)) || !truthy(live(WT))) || !truthy((yield* g.callName(f, live(WT), "isOn", [])))) || !isEqual(rt.sv(f, "d_state"), 2))) {
						return 1;
					}
					rt.setSv(f, "d_state", 3);
					yield* g.srcCall(f, "update_icon");
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You press firmly on the cover, dislodging it.</span>"]);
				}
			}
			return 1;
		}
		if (truthy((rt.istype(live(W), T("/obj/item/weapon/gun/energy/plasmacutter")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You begin slicing through the metal cover...</span>"]);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/welder.ogg"), 100, 1]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(60, rt.fv(f, "toolspeed", live(W))), "target", live(f.src)], rt.Args.Named)))) {
				if (((!truthy((rt.istype(live(f.src), T("/turf/closed/wall/r_wall")) ? 1 : 0)) || !truthy(live(W))) || !isEqual(rt.sv(f, "d_state"), 2))) {
					return 1;
				}
				rt.setSv(f, "d_state", 3);
				yield* g.srcCall(f, "update_icon");
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You press firmly on the cover, dislodging it.</span>"]);
			}
			return 1;
		}
		if (truthy((rt.istype(live(W), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You begin securing the support lines...</span>"]);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(W)), 100, 1]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(40, rt.fv(f, "toolspeed", live(W))), "target", live(f.src)], rt.Args.Named)))) {
				if (((!truthy((rt.istype(live(f.src), T("/turf/closed/wall/r_wall")) ? 1 : 0)) || !truthy(live(W))) || !isEqual(rt.sv(f, "d_state"), 2))) {
					return 1;
				}
				rt.setSv(f, "d_state", 1);
				yield* g.srcCall(f, "update_icon");
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>The support lines have been secured.</span>"]);
			}
			return 1;
		}
	} else if ($0 === 3) {
		if (truthy((rt.istype(live(W), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You struggle to pry off the cover...</span>"]);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(W)), 100, 1]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(100, rt.fv(f, "toolspeed", live(W))), "target", live(f.src)], rt.Args.Named)))) {
				if (((!truthy((rt.istype(live(f.src), T("/turf/closed/wall/r_wall")) ? 1 : 0)) || !truthy(live(W))) || !isEqual(rt.sv(f, "d_state"), 3))) {
					return 1;
				}
				rt.setSv(f, "d_state", 4);
				yield* g.srcCall(f, "update_icon");
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You pry off the cover.</span>"]);
			}
			return 1;
		}
		if (truthy((rt.istype(live(W), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
			if (truthy((yield* g.callName(f, (WT = live(W)), "remove_fuel", [0, live(user)])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You begin welding the metal cover back to the frame...</span>"]);
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(WT)), 100, 1]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(60, rt.fv(f, "toolspeed", live(WT))), "target", live(f.src)], rt.Args.Named)))) {
					if ((((!truthy((rt.istype(live(f.src), T("/turf/closed/wall/r_wall")) ? 1 : 0)) || !truthy(live(WT))) || !truthy((yield* g.callName(f, live(WT), "isOn", [])))) || !isEqual(rt.sv(f, "d_state"), 3))) {
						return 1;
					}
					rt.setSv(f, "d_state", 2);
					yield* g.srcCall(f, "update_icon");
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>The metal cover has been welded securely to the frame.</span>"]);
				}
			}
			return 1;
		}
	} else if ($0 === 4) {
		if (truthy((rt.istype(live(W), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You start loosening the anchoring bolts which secure the support rods to their frame...</span>"]);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(W)), 100, 1]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(40, rt.fv(f, "toolspeed", live(W))), "target", live(f.src)], rt.Args.Named)))) {
				if (((!truthy((rt.istype(live(f.src), T("/turf/closed/wall/r_wall")) ? 1 : 0)) || !truthy(live(W))) || !isEqual(rt.sv(f, "d_state"), 4))) {
					return 1;
				}
				rt.setSv(f, "d_state", 5);
				yield* g.srcCall(f, "update_icon");
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You remove the bolts anchoring the support rods.</span>"]);
			}
			return 1;
		}
		if (truthy((rt.istype(live(W), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You start to pry the cover back into place...</span>"]);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(W)), 100, 1]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(20, rt.fv(f, "toolspeed", live(W))), "target", live(f.src)], rt.Args.Named)))) {
				if (((!truthy((rt.istype(live(f.src), T("/turf/closed/wall/r_wall")) ? 1 : 0)) || !truthy(live(W))) || !isEqual(rt.sv(f, "d_state"), 4))) {
					return 1;
				}
				rt.setSv(f, "d_state", 3);
				yield* g.srcCall(f, "update_icon");
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>The metal cover has been pried back into place.</span>"]);
			}
			return 1;
		}
	} else if ($0 === 5) {
		if (truthy((rt.istype(live(W), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
			if (truthy((yield* g.callName(f, (WT = live(W)), "remove_fuel", [0, live(user)])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You begin slicing through the support rods...</span>"]);
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(W)), 100, 1]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(100, rt.fv(f, "toolspeed", live(W))), "target", live(f.src)], rt.Args.Named)))) {
					if ((((!truthy((rt.istype(live(f.src), T("/turf/closed/wall/r_wall")) ? 1 : 0)) || !truthy(live(WT))) || !truthy((yield* g.callName(f, live(WT), "isOn", [])))) || !isEqual(rt.sv(f, "d_state"), 5))) {
						return 1;
					}
					rt.setSv(f, "d_state", 6);
					yield* g.srcCall(f, "update_icon");
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You slice through the support rods.</span>"]);
				}
			}
			return 1;
		}
		if (truthy((rt.istype(live(W), T("/obj/item/weapon/gun/energy/plasmacutter")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You begin slicing through the support rods...</span>"]);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/welder.ogg"), 100, 1]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(100, rt.fv(f, "toolspeed", live(W))), "target", live(f.src)], rt.Args.Named)))) {
				if (((!truthy((rt.istype(live(f.src), T("/turf/closed/wall/r_wall")) ? 1 : 0)) || !truthy(live(W))) || !isEqual(rt.sv(f, "d_state"), 5))) {
					return 1;
				}
				rt.setSv(f, "d_state", 6);
				yield* g.srcCall(f, "update_icon");
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You slice through the support rods.</span>"]);
			}
			return 1;
		}
		if (truthy((rt.istype(live(W), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You start tightening the bolts which secure the support rods to their frame...</span>"]);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(W)), 100, 1]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(40, rt.fv(f, "toolspeed", live(W))), "target", live(f.src)], rt.Args.Named)))) {
				if (((!truthy((rt.istype(live(f.src), T("/turf/closed/wall/r_wall")) ? 1 : 0)) || !truthy(live(W))) || !isEqual(rt.sv(f, "d_state"), 5))) {
					return 1;
				}
				rt.setSv(f, "d_state", 4);
				yield* g.srcCall(f, "update_icon");
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You tighten the bolts anchoring the support rods.</span>"]);
			}
			return 1;
		}
	} else if ($0 === 6) {
		if (truthy((rt.istype(live(W), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You struggle to pry off the outer sheath...</span>"]);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(W)), 100, 1]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(100, rt.fv(f, "toolspeed", live(W))), "target", live(f.src)], rt.Args.Named)))) {
				if (((!truthy((rt.istype(live(f.src), T("/turf/closed/wall/r_wall")) ? 1 : 0)) || !truthy(live(W))) || !isEqual(rt.sv(f, "d_state"), 6))) {
					return 1;
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You pry off the outer sheath.</span>"]);
				yield* g.srcCall(f, "dismantle_wall");
			}
			return 1;
		}
		if (truthy((rt.istype(live(W), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
			if (truthy((yield* g.callName(f, (WT = live(W)), "remove_fuel", [0, live(user)])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You begin welding the support rods back together...</span>"]);
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(WT)), 100, 1]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(100, rt.fv(f, "toolspeed", live(WT))), "target", live(f.src)], rt.Args.Named)))) {
					if ((((!truthy((rt.istype(live(f.src), T("/turf/closed/wall/r_wall")) ? 1 : 0)) || !truthy(live(WT))) || !truthy((yield* g.callName(f, live(WT), "isOn", [])))) || !isEqual(rt.sv(f, "d_state"), 6))) {
						return 1;
					}
					rt.setSv(f, "d_state", 5);
					yield* g.srcCall(f, "update_icon");
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You weld the support rods back together.</span>"]);
				}
				return 1;
			}
		}
	}
	return 0;
}, true);

// /turf/closed/wall/r_wall/proc/update_icon  (code/game/turfs/simulated/wall/reinf_walls.dm:239)
rt.def("/turf/closed/wall/r_wall/proc/update_icon", function update_icon(f: Frame) {
	if (!isEqual(rt.sv(f, "d_state"), 0)) {
		rt.setSv(f, "smooth", 0);
		rt.callSrc(f, "clear_smooth_overlays", []);
		rt.setSv(f, "icon_state", fmt("r_wall-＀", [rt.sv(f, "d_state")]));
	} else {
		rt.setSv(f, "smooth", 1);
		rt.call(f, P("/proc/queue_smooth_neighbors"), null, [live(f.src)]);
		rt.call(f, P("/proc/queue_smooth"), null, [live(f.src)]);
		rt.setSv(f, "icon_state", "r_wall");
	}
	return f.dot;
});

// /turf/closed/wall/r_wall/proc/singularity_pull  (code/game/turfs/simulated/wall/reinf_walls.dm:250)  may sleep
rt.def("/turf/closed/wall/r_wall/proc/singularity_pull", function* singularity_pull(f: Frame, S: Value, current_size: Value) {
	f.vars = () => [S, current_size];
	if (!rt.ge(live(current_size), 9)) return f.dot;
	if (!truthy(rt.op(f, "Prob", [], [30]))) return f.dot;
	yield* g.srcCall(f, "dismantle_wall");
	return f.dot;
}, true);

// /turf/closed/wall/r_wall/proc/rcd_vals  (code/game/turfs/simulated/wall/reinf_walls.dm:255)
rt.def("/turf/closed/wall/r_wall/proc/rcd_vals", function rcd_vals(f: Frame) {
	if (!truthy(rt.fv(f, "canRturf", live(f.args[1])))) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["user", "the_rcd"] });

// /turf/closed/wall/r_wall/proc/rcd_act  (code/game/turfs/simulated/wall/reinf_walls.dm:260)  may sleep
rt.def("/turf/closed/wall/r_wall/proc/rcd_act", function* rcd_act(f: Frame) {
	if (!truthy(rt.fv(f, "canRturf", live(f.args[1])))) {
		return 0;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["user", "the_rcd", "passed_mode"] });
