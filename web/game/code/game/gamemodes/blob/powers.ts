// From code/game/gamemodes/blob/powers.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/camera/blob/proc/can_buy  (code/game/gamemodes/blob/powers.dm:2)
rt.def("/mob/camera/blob/proc/can_buy", function can_buy(f: Frame, cost: Value) {
	f.vars = () => [cost];
	if (live(cost) === null) {
		cost = 15;
	}
	if (rt.lt(rt.sv(f, "blob_points"), live(cost))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='warning'>You cannot afford this, you need at least ＀ resources!</span>", [live(cost)])]);
		return 0;
	}
	rt.callSrc(f, "add_points", [rt.neg(live(cost))]);
	return 1;
});

// /mob/camera/blob/proc/place_blob_core  (code/game/gamemodes/blob/powers.dm:11)  may sleep
rt.def("/mob/camera/blob/proc/place_blob_core", function* place_blob_core(f: Frame, point_rate: Value, placement_override: Value) {
	let M: Value = null, _T: Value = null, O: Value = null, core: Value = null;
	let $e: any;
	f.vars = () => [point_rate, placement_override, M, _T, O, core, $e];
	if ((truthy(rt.sv(f, "placed")) && !isEqual(live(placement_override), -1))) {
		return 1;
	}
	if (!truthy(live(placement_override))) {
		M = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [7, live(f.src)])), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			if (truthy((rt.isIn(f, "blob", rt.fv(f, "faction", live(M))) ? 1 : 0))) {
				continue;
			}
			if (truthy(rt.fv(f, "client", live(M)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>There is someone too close to place your blob core!</span>"]);
				return 0;
			}
		}
		rt.endFor(f, 0);
		M = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [13, live(f.src)])), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			if (truthy((rt.isIn(f, "blob", rt.fv(f, "faction", live(M))) ? 1 : 0))) {
				continue;
			}
			if (truthy(rt.fv(f, "client", live(M)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>Someone could see your blob core from here!</span>"]);
				return 0;
			}
		}
		rt.endFor(f, 0);
		if (truthy(rt.gv(f, "density", (_T = rt.getStep(f, live(f.src), 0))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>This spot is too dense to place a blob core on!</span>"]);
			return 0;
		}
		O = null;
		rt.forList(f, 0, live(_T), T("/obj"));
		while (($e = rt.next(f, 0)) !== undefined) {
			O = $e;
			if (truthy((rt.istype(live(O), T("/obj/structure/blob")) ? 1 : 0))) {
				if (truthy((rt.istype(live(O), T("/obj/structure/blob/normal")) ? 1 : 0))) {
					yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>There is already a blob here!</span>"]);
					return 0;
				}
			} else {
				if (truthy(rt.fv(f, "density", live(O)))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>This spot is too dense to place a blob core on!</span>"]);
					return 0;
				}
			}
		}
		rt.endFor(f, 0);
		if ((rt.le(rt.worldTime(f), rt.sv(f, "manualplace_min_time")) && rt.le(rt.worldTime(f), rt.sv(f, "autoplace_max_time")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>It is too early to place your blob core!</span>"]);
			return 0;
		}
	} else {
		if (isEqual(live(placement_override), 1)) {
			rt.setSv(f, "loc", (_T = rt.op(f, "PickUnweighted", [1], [rt.gl("blobstart")])));
		}
	}
	if ((truthy(rt.sv(f, "placed")) && truthy(rt.sv(f, "blob_core")))) {
		yield* g.callName(f, rt.sv(f, "blob_core"), "forceMove", [rt.sv(f, "loc")]);
	} else {
		rt.setFv(f, "overmind", (core = (yield* g.new_(f, T("/obj/structure/blob/core"), [rt.getStep(f, live(f.src), 0), null, live(point_rate), 1]))), live(f.src));
		rt.setSv(f, "blob_core", live(core));
		yield* g.callName(f, live(core), "update_icon", []);
	}
	yield* g.srcCall(f, "update_health_hud");
	rt.setSv(f, "placed", 1);
	return 1;
}, true);

// /mob/camera/blob/verb/transport_core  (code/game/gamemodes/blob/powers.dm:62)
rt.def("/mob/camera/blob/verb/transport_core", function transport_core(f: Frame) {
	if (!truthy(rt.sv(f, "blob_core"))) return f.dot;
	rt.setFv(f, "loc", live(f.src), rt.fv(f, "loc", rt.sv(f, "blob_core")));
	return f.dot;
}, false, { verb: { name: "Jump to Core", category: "Blob", desc: "Move your camera to your core." } });

// /mob/camera/blob/verb/jump_to_node  (code/game/gamemodes/blob/powers.dm:68)  may sleep
rt.def("/mob/camera/blob/verb/jump_to_node", function* jump_to_node(f: Frame) {
	let nodes: Value = null, i: Value = null, B: Value = null, node_name: Value = null, chosen_node: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [nodes, i, B, node_name, chosen_node, $0, $1, $2, $e];
	if (!truthy(rt.len(f, rt.gl("blob_nodes")))) return f.dot;
	nodes = rt.list();
	i = null;
	rt.forRange(f, 0, 1, rt.len(f, rt.gl("blob_nodes")), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		B = rt.index(rt.gl("blob_nodes"), live(i));
		$0 = live(nodes);
		$1 = live(i);
		if (truthy(rt.fv(f, "overmind", live(B)))) {
			$2 = fmt("＀", [rt.gv(f, "name", rt.gv(f, "blob_reagent_datum", rt.fv(f, "overmind", live(B))))]);
		} else {
			$2 = "No Chemical";
		}
		rt.setAt($0, fmt("Blob Node #＀ (＀)", [$1, $2]), live(B));
	}
	rt.endFor(f, 0);
	node_name = (yield* g.op(f, "Prompt", [0], [null, "Node Jump", "Choose a node to jump to.", live(f.src), live(nodes)]));
	if (!truthy((chosen_node = rt.index(live(nodes), live(node_name))))) return f.dot;
	rt.setSv(f, "loc", rt.fv(f, "loc", live(chosen_node)));
	return f.dot;
}, true, { verb: { name: "Jump to Node", category: "Blob", desc: "Move your camera to a selected node." } });

// /mob/camera/blob/proc/createSpecial  (code/game/gamemodes/blob/powers.dm:79)  may sleep
rt.def("/mob/camera/blob/proc/createSpecial", function* createSpecial(f: Frame, price: Value, blobType: Value, nearEquals: Value, needsNode: Value, _T: Value) {
	let B: Value = null, L: Value = null, N: Value = null;
	let $e: any;
	f.vars = () => [price, blobType, nearEquals, needsNode, _T, B, L, N, $e];
	if (!truthy(live(_T))) {
		_T = rt.getStep(f, live(f.src), 0);
	}
	if (!truthy((B = rt.locateIn(f, T("/obj/structure/blob"), live(_T))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>There is no blob here!</span>"]);
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(B), T("/obj/structure/blob/normal")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>Unable to use this blob, find a normal one.</span>"]);
		return live(f.dot);
	}
	if ((truthy(live(needsNode)) && truthy(rt.sv(f, "nodes_required")))) {
		if ((!truthy(rt.locateIn(f, T("/obj/structure/blob/node"), (yield* g.call(f, P("/proc/orange"), null, [3, live(_T)])))) && !truthy(rt.locateIn(f, T("/obj/structure/blob/core"), (yield* g.call(f, P("/proc/orange"), null, [4, live(_T)])))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You need to place this blob closer to a node or core!</span>"]);
			return live(f.dot);
		}
	}
	if (truthy(live(nearEquals))) {
		L = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [live(nearEquals), live(_T)])), T("/obj/structure/blob"));
		while (($e = rt.next(f, 0)) !== undefined) {
			L = $e;
			if (isEqual(rt.fv(f, "type", live(L)), live(blobType))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='warning'>There is a similar blob nearby, move more than ＀ tiles away from it!</span>", [live(nearEquals)])]);
				return live(f.dot);
			}
		}
		rt.endFor(f, 0);
	}
	if (!truthy((yield* g.srcCall(f, "can_buy", live(price))))) {
		return live(f.dot);
	}
	return (N = (yield* g.callName(f, live(B), "change_to", [live(blobType), live(f.src)])));
}, true);

// /mob/camera/blob/verb/toggle_node_req  (code/game/gamemodes/blob/powers.dm:106)
rt.def("/mob/camera/blob/verb/toggle_node_req", function toggle_node_req(f: Frame) {
	rt.setSv(f, "nodes_required", (!truthy(rt.sv(f, "nodes_required")) ? 1 : 0));
	if (truthy(rt.sv(f, "nodes_required"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You now require a nearby node or core to place factory and resource blobs.</span>"]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You no longer require a nearby node or core to place factory and resource blobs.</span>"]);
	}
	return f.dot;
}, false, { verb: { name: "Toggle Node Requirement", category: "Blob", desc: "Toggle requiring nodes to place resource and factory blobs." } });

// /mob/camera/blob/verb/create_shield_power  (code/game/gamemodes/blob/powers.dm:116)  may sleep
rt.def("/mob/camera/blob/verb/create_shield_power", function* create_shield_power(f: Frame) {
	yield* g.srcCall(f, "create_shield");
	return f.dot;
}, true, { verb: { name: "Create Shield Blob (15)", category: "Blob", desc: "Create a shield blob, which will block fire and is hard to kill." } });

// /mob/camera/blob/proc/create_shield  (code/game/gamemodes/blob/powers.dm:119)  may sleep
rt.def("/mob/camera/blob/proc/create_shield", function* create_shield(f: Frame, _T: Value) {
	f.vars = () => [_T];
	yield* g.srcCall(f, "createSpecial", 15, T("/obj/structure/blob/shield"), 0, 0, live(_T));
	return f.dot;
}, true);

// /mob/camera/blob/verb/create_resource  (code/game/gamemodes/blob/powers.dm:125)  may sleep
rt.def("/mob/camera/blob/verb/create_resource", function* create_resource(f: Frame) {
	yield* g.srcCall(f, "createSpecial", 40, T("/obj/structure/blob/resource"), 4, 1);
	return f.dot;
}, true, { verb: { name: "Create Resource Blob (40)", category: "Blob", desc: "Create a resource tower which will generate resources for you." } });

// /mob/camera/blob/verb/create_node  (code/game/gamemodes/blob/powers.dm:131)  may sleep
rt.def("/mob/camera/blob/verb/create_node", function* create_node(f: Frame) {
	yield* g.srcCall(f, "createSpecial", 50, T("/obj/structure/blob/node"), 5, 0);
	return f.dot;
}, true, { verb: { name: "Create Node Blob (50)", category: "Blob", desc: "Create a node, which will power nearby factory and resource blobs." } });

// /mob/camera/blob/verb/create_factory  (code/game/gamemodes/blob/powers.dm:137)  may sleep
rt.def("/mob/camera/blob/verb/create_factory", function* create_factory(f: Frame) {
	yield* g.srcCall(f, "createSpecial", 60, T("/obj/structure/blob/factory"), 7, 1);
	return f.dot;
}, true, { verb: { name: "Create Factory Blob (60)", category: "Blob", desc: "Create a spore tower that will spawn spores to harass your enemies." } });

// /mob/camera/blob/verb/create_blobbernaut  (code/game/gamemodes/blob/powers.dm:143)  may sleep
rt.def("/mob/camera/blob/verb/create_blobbernaut", function* create_blobbernaut(f: Frame) {
	let _T: Value = null, B: Value = null, blobber: Value = null, candidates: Value = null, C: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [_T, B, blobber, candidates, C, $0, $1, $2, $3];
	_T = rt.getStep(f, live(f.src), 0);
	if (!truthy((B = rt.locateIn(f, T("/obj/structure/blob/factory"), live(_T))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You must be on a factory blob!</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "naut", live(B)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>This factory blob is already sustaining a blobbernaut.</span>"]);
		return live(f.dot);
	}
	if (rt.lt(rt.fv(f, "obj_integrity", live(B)), multiply(rt.fv(f, "max_integrity", live(B)), 0.5))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>This factory blob is too damaged to sustain a blobbernaut.</span>"]);
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "can_buy", 40)))) {
		return live(f.dot);
	}
	rt.setFv(f, "max_integrity", live(B), multiply(rt.initial(f, live(B), "max_integrity"), 0.25));
	rt.setFv(f, "obj_integrity", live(B), (yield* g.call(f, P("/proc/min"), null, [rt.fv(f, "obj_integrity", live(B)), rt.fv(f, "max_integrity", live(B))])));
	yield* g.callName(f, live(B), "update_icon", []);
	yield* g.callName(f, live(B), "visible_message", [fmt("<span class='warning'><b>The blobbernaut ＀ its way out of the factory blob!</b></span>", [rt.op(f, "PickUnweighted", [3], ["rips", "tears", "shreds"])])]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(B)), rt.rsc("sound/effects/splat.ogg"), 50, 1]);
	blobber = (yield* g.new_(f, T("/mob/living/simple_animal/hostile/blob/blobbernaut"), [rt.getStep(f, live(B), 0)]));
	yield* g.call(f, P("/proc/flick"), null, ["blobbernaut_produce", live(blobber)]);
	rt.setFv(f, "naut", live(B), live(blobber));
	rt.setFv(f, "factory", live(blobber), live(B));
	rt.setFv(f, "overmind", live(blobber), live(f.src));
	yield* g.callName(f, live(blobber), "update_icons", []);
	rt.setFv(f, "notransform", live(blobber), 1);
	yield* g.callName(f, live(blobber), "adjustHealth", [multiply(rt.fv(f, "maxHealth", live(blobber)), 0.5)]);
	rt.modSrcVar(f, "blob_mobs", live(blobber), add);
	if (truthy(rt.getLen(f, (candidates = (yield* g.call(f, P("/proc/pollCandidatesForMob"), null, [fmt("Do you want to play as a ＀ blobbernaut?", [rt.fv(f, "name", rt.sv(f, "blob_reagent_datum"))]), "blob", null, "blob", 50, live(blobber)])))))) {
		C = rt.op(f, "PickUnweighted", [1], [live(candidates)]);
		rt.setFv(f, "key", live(blobber), rt.fv(f, "key", live(C)));
		rt.op(f, "Output", [], [live(blobber), rt.rsc("sound/effects/blobattack.ogg")], false);
		rt.op(f, "Output", [], [live(blobber), rt.rsc("sound/effects/attackblob.ogg")], false);
		yield* g.call(f, P("/proc/to_chat"), null, [live(blobber), "<b>You are a blobbernaut!</b>"]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(blobber), "You are powerful, hard to kill, and slowly regenerate near nodes and cores, but will slowly die if not near the blob or if the factory that made you is killed."]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(blobber), "You can communicate with other blobbernauts and GLOB.overminds via <b>:b</b>"]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(blobber), fmt("Your overmind's blob reagent is: <b><font color=\"＀\">＀</b></font>!", [rt.fv(f, "color", rt.sv(f, "blob_reagent_datum")), rt.fv(f, "name", rt.sv(f, "blob_reagent_datum"))])]);
		$0 = live(blobber);
		$1 = rt.fv(f, "color", rt.sv(f, "blob_reagent_datum"));
		$2 = rt.fv(f, "name", rt.sv(f, "blob_reagent_datum"));
		if (truthy(rt.fv(f, "shortdesc", rt.sv(f, "blob_reagent_datum")))) {
			$3 = fmt("＀", [rt.fv(f, "shortdesc", rt.sv(f, "blob_reagent_datum"))]);
		} else {
			$3 = fmt("＀", [rt.fv(f, "description", rt.sv(f, "blob_reagent_datum"))]);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("The <b><font color=\"＀\">＀</b></font> reagent ＀", [$1, $2, $3])]);
	}
	if (!truthy(live(blobber))) return f.dot;
	rt.setFv(f, "notransform", live(blobber), 0);
	return f.dot;
}, true, { verb: { name: "Create Blobbernaut (40)", category: "Blob", desc: "Create a powerful blobbernaut which is mildly smart and will attack enemies." } });

// /mob/camera/blob/verb/relocate_core  (code/game/gamemodes/blob/powers.dm:188)  may sleep
rt.def("/mob/camera/blob/verb/relocate_core", function* relocate_core(f: Frame) {
	let _T: Value = null, B: Value = null, A: Value = null, old_turf: Value = null, olddir: Value = null;
	f.vars = () => [_T, B, A, old_turf, olddir];
	_T = rt.getStep(f, live(f.src), 0);
	if (!truthy((B = rt.locateIn(f, T("/obj/structure/blob/node"), live(_T))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You must be on a blob node!</span>"]);
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "blob_core"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='userdanger'>You have no core and are about to die! May you rest in peace.</span>"]);
		return live(f.dot);
	}
	A = (yield* g.call(f, P("/proc/get_area"), null, [live(_T)]));
	if ((truthy((rt.istype(live(_T), T("/turf/open/space")) ? 1 : 0)) || (truthy(live(A)) && !truthy(rt.fv(f, "blob_allowed", live(A)))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You cannot relocate your core here!</span>"]);
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "can_buy", 80)))) {
		return live(f.dot);
	}
	old_turf = rt.getStep(f, rt.sv(f, "blob_core"), 0);
	olddir = rt.fv(f, "dir", rt.sv(f, "blob_core"));
	yield* g.callName(f, rt.sv(f, "blob_core"), "forceMove", [live(_T)]);
	yield* g.callName(f, rt.sv(f, "blob_core"), "setDir", [rt.fv(f, "dir", live(B))]);
	yield* g.callName(f, live(B), "forceMove", [live(old_turf)]);
	yield* g.callName(f, live(B), "setDir", [live(olddir)]);
	return f.dot;
}, true, { verb: { name: "Relocate Core (80)", category: "Blob", desc: "Swaps the locations of your core and the selected node." } });

// /mob/camera/blob/verb/revert  (code/game/gamemodes/blob/powers.dm:213)  may sleep
rt.def("/mob/camera/blob/verb/revert", function* revert(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	yield* g.srcCall(f, "remove_blob", (_T = rt.getStep(f, live(f.src), 0)));
	return f.dot;
}, true, { verb: { name: "Remove Blob", category: "Blob", desc: "Removes a blob, giving you back some resources." } });

// /mob/camera/blob/proc/remove_blob  (code/game/gamemodes/blob/powers.dm:217)  may sleep
rt.def("/mob/camera/blob/proc/remove_blob", function* remove_blob(f: Frame, _T: Value) {
	let B: Value = null;
	f.vars = () => [_T, B];
	if (!truthy((B = rt.locateIn(f, T("/obj/structure/blob"), live(_T))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>There is no blob there!</span>"]);
		return live(f.dot);
	}
	if (rt.lt(rt.fv(f, "point_return", live(B)), 0)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>Unable to remove this blob.</span>"]);
		return live(f.dot);
	}
	if (rt.lt(rt.sv(f, "max_blob_points"), add(rt.fv(f, "point_return", live(B)), rt.sv(f, "blob_points")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You have too many resources to remove this blob!</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "point_return", live(B)))) {
		yield* g.srcCall(f, "add_points", rt.fv(f, "point_return", live(B)));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='notice'>Gained ＀ resources from removing ％！.</span>", [rt.fv(f, "point_return", live(B)), live(B)])]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(B)]);
	return f.dot;
}, true);

// /mob/camera/blob/verb/expand_blob_power  (code/game/gamemodes/blob/powers.dm:236)  may sleep
rt.def("/mob/camera/blob/verb/expand_blob_power", function* expand_blob_power(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	yield* g.srcCall(f, "expand_blob", (_T = rt.getStep(f, live(f.src), 0)));
	return f.dot;
}, true, { verb: { name: "Expand/Attack Blob (4)", category: "Blob", desc: "Attempts to create a new blob in this tile. If the tile isn't clear, instead attacks it, damaging mobs and objects." } });

// /mob/camera/blob/proc/expand_blob  (code/game/gamemodes/blob/powers.dm:240)  may sleep
rt.def("/mob/camera/blob/proc/expand_blob", function* expand_blob(f: Frame, _T: Value) {
	let possibleblobs: Value = null, AB: Value = null, attacksuccess: Value = null, L: Value = null, mob_protection: Value = null, B: Value = null, cardinalblobs: Value = null, diagonalblobs: Value = null, I: Value = null, IB: Value = null, OB: Value = null;
	let $e: any;
	f.vars = () => [_T, possibleblobs, AB, attacksuccess, L, mob_protection, B, cardinalblobs, diagonalblobs, I, IB, OB, $e];
	if (rt.lt(rt.worldTime(f), rt.sv(f, "last_attack"))) {
		return live(f.dot);
	}
	possibleblobs = rt.list();
	AB = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [live(_T), 1])), T("/obj/structure/blob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AB = $e;
		possibleblobs = rt.modify(live(possibleblobs), live(AB), add);
	}
	rt.endFor(f, 0);
	if (!truthy(rt.len(f, live(possibleblobs)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>There is no blob adjacent to the target tile!</span>"]);
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "can_buy", 4)))) return f.dot;
	attacksuccess = 0;
	L = null;
	rt.forList(f, 0, live(_T), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (truthy((rt.isIn(f, "blob", rt.fv(f, "faction", live(L))) ? 1 : 0))) {
			continue;
		}
		if (!isEqual(rt.fv(f, "stat", live(L)), 2)) {
			attacksuccess = 1;
		}
		mob_protection = (yield* g.callName(f, live(L), "get_permeability_protection", []));
		yield* g.callName(f, rt.sv(f, "blob_reagent_datum"), "reaction_mob", [live(L), 3, 25, 1, live(mob_protection), live(f.src)]);
		yield* g.callName(f, rt.sv(f, "blob_reagent_datum"), "send_message", [live(L)]);
	}
	rt.endFor(f, 0);
	if (truthy((B = rt.locateIn(f, T("/obj/structure/blob"), live(_T))))) {
		if (truthy(live(attacksuccess))) {
			yield* g.callName(f, live(B), "blob_attack_animation", [live(_T), live(f.src)]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>There is a blob there!</span>"]);
			yield* g.srcCall(f, "add_points", 4);
		}
	} else {
		cardinalblobs = rt.list();
		diagonalblobs = rt.list();
		I = null;
		rt.forList(f, 0, live(possibleblobs));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			if (truthy((rt.isIn(f, rt.getDir(f, (IB = live(I)), live(_T)), rt.gl("cardinal")) ? 1 : 0))) {
				cardinalblobs = rt.modify(live(cardinalblobs), live(IB), add);
			} else {
				diagonalblobs = rt.modify(live(diagonalblobs), live(IB), add);
			}
		}
		rt.endFor(f, 0);
		OB = null;
		if (truthy(rt.len(f, live(cardinalblobs)))) {
			yield* g.callName(f, (OB = rt.op(f, "PickUnweighted", [1], [live(cardinalblobs)])), "expand", [live(_T), live(f.src)]);
		} else {
			OB = rt.op(f, "PickUnweighted", [1], [live(diagonalblobs)]);
			if (truthy(live(attacksuccess))) {
				yield* g.callName(f, live(OB), "blob_attack_animation", [live(_T), live(f.src)]);
				yield* g.call(f, P("/proc/playsound"), null, [live(OB), rt.rsc("sound/effects/splat.ogg"), 50, 1]);
			} else {
				yield* g.srcCall(f, "add_points", 4);
			}
		}
	}
	if (truthy(live(attacksuccess))) {
		rt.setSv(f, "last_attack", add(rt.worldTime(f), 8));
	} else {
		rt.setSv(f, "last_attack", add(rt.worldTime(f), 2));
	}
	return f.dot;
}, true);

// /mob/camera/blob/verb/rally_spores_power  (code/game/gamemodes/blob/powers.dm:294)
rt.def("/mob/camera/blob/verb/rally_spores_power", function rally_spores_power(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	rt.callSrc(f, "rally_spores", [(_T = rt.getStep(f, live(f.src), 0))]);
	return f.dot;
}, false, { verb: { name: "Rally Spores", category: "Blob", desc: "Rally your spores to move to a target location." } });

// /mob/camera/blob/proc/rally_spores  (code/game/gamemodes/blob/powers.dm:298)
rt.def("/mob/camera/blob/proc/rally_spores", function rally_spores(f: Frame, _T: Value) {
	let surrounding_turfs: Value = null, BS: Value = null;
	let $e: any;
	f.vars = () => [surrounding_turfs, BS, $e];
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), "You rally your spores."]);
	if (!truthy(rt.getLen(f, (surrounding_turfs = rt.call(f, P("/proc/block"), null, [rt.locate(subtract(rt.fv(f, "x", live(_T)), 1), subtract(rt.fv(f, "y", live(_T)), 1), rt.fv(f, "z", live(_T))), rt.locate(add(rt.fv(f, "x", live(_T)), 1), add(rt.fv(f, "y", live(_T)), 1), rt.fv(f, "z", live(_T)))]))))) {
		return live(f.dot);
	}
	BS = null;
	rt.forList(f, 0, rt.sv(f, "blob_mobs"), T("/mob/living/simple_animal/hostile/blob/blobspore"));
	while (($e = rt.next(f, 0)) !== undefined) {
		BS = $e;
		if ((truthy(rt.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(BS))])) && rt.le(rt.call(f, P("/proc/get_dist"), null, [live(BS), live(_T)]), 35))) {
			rt.callName(f, live(BS), "LoseTarget", []);
			rt.callName(f, live(BS), "Goto", [rt.op(f, "PickUnweighted", [1], [live(surrounding_turfs)]), rt.fv(f, "move_to_delay", live(BS))]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/camera/blob/verb/blob_broadcast  (code/game/gamemodes/blob/powers.dm:311)  may sleep
rt.def("/mob/camera/blob/verb/blob_broadcast", function* blob_broadcast(f: Frame) {
	let speak_text: Value = null, BLO: Value = null, BM: Value = null;
	let $e: any;
	f.vars = () => [speak_text, BLO, BM, $e];
	if (!truthy((speak_text = (yield* g.op(f, "Prompt", [2], [null, "Blob Broadcast", "What would you like to say with your minions?", live(f.src), null]))))) {
		return live(f.dot);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("You broadcast with your minions, <B>＀</B>", [live(speak_text)])]);
	}
	BLO = null;
	rt.forList(f, 0, rt.sv(f, "blob_mobs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		BLO = $e;
		if (isEqual(rt.gv(f, "stat", (BM = live(BLO))), 0)) {
			yield* g.callName(f, live(BM), "say", [live(speak_text)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { verb: { name: "Blob Broadcast", category: "Blob", desc: "Speak with your blob spores and blobbernauts as your mouthpieces." } });

// /mob/camera/blob/verb/chemical_reroll  (code/game/gamemodes/blob/powers.dm:325)  may sleep
rt.def("/mob/camera/blob/verb/chemical_reroll", function* chemical_reroll(f: Frame) {
	if (!(truthy(rt.sv(f, "free_chem_rerolls")) || truthy((yield* g.srcCall(f, "can_buy", 40))))) return f.dot;
	yield* g.srcCall(f, "set_chemical");
	if (!truthy(rt.sv(f, "free_chem_rerolls"))) return f.dot;
	rt.incSrcVar(f, "free_chem_rerolls", -1, true);
	return f.dot;
}, true, { verb: { name: "Reactive Chemical Adaptation (40)", category: "Blob", desc: "Replaces your chemical with a random, different one." } });

// /mob/camera/blob/proc/set_chemical  (code/game/gamemodes/blob/powers.dm:331)  may sleep
rt.def("/mob/camera/blob/proc/set_chemical", function* set_chemical(f: Frame) {
	let BC: Value = null, BL: Value = null, B: Value = null, BLO: Value = null, BM: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [BC, BL, B, BLO, BM, $0, $1, $2, $3, $e];
	BC = rt.op(f, "PickUnweighted", [1], [subtract(subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/reagent/blob")])), T("/datum/reagent/blob")), rt.fv(f, "type", rt.sv(f, "blob_reagent_datum")))]);
	rt.setSv(f, "blob_reagent_datum", (yield* g.new_(f, live(BC), [])));
	rt.setSv(f, "color", rt.fv(f, "complementary_color", rt.sv(f, "blob_reagent_datum")));
	BL = null;
	rt.forList(f, 0, rt.gl("blobs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		BL = $e;
		yield* g.callName(f, (B = live(BL)), "update_icon", []);
	}
	rt.endFor(f, 0);
	BLO = null;
	rt.forList(f, 0, rt.sv(f, "blob_mobs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		BLO = $e;
		yield* g.callName(f, (BM = live(BLO)), "update_icons", []);
		yield* g.call(f, P("/proc/to_chat"), null, [live(BM), fmt("Your overmind's blob reagent is now: <b><font color=\"＀\">＀</b></font>!", [rt.fv(f, "color", rt.sv(f, "blob_reagent_datum")), rt.fv(f, "name", rt.sv(f, "blob_reagent_datum"))])]);
		$0 = live(BM);
		$1 = rt.fv(f, "color", rt.sv(f, "blob_reagent_datum"));
		$2 = rt.fv(f, "name", rt.sv(f, "blob_reagent_datum"));
		if (truthy(rt.fv(f, "shortdesc", rt.sv(f, "blob_reagent_datum")))) {
			$3 = fmt("＀", [rt.fv(f, "shortdesc", rt.sv(f, "blob_reagent_datum"))]);
		} else {
			$3 = fmt("＀", [rt.fv(f, "description", rt.sv(f, "blob_reagent_datum"))]);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("The <b><font color=\"＀\">＀</b></font> reagent ＀", [$1, $2, $3])]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("Your reagent is now: <b><font color=\"＀\">＀</b></font>!", [rt.fv(f, "color", rt.sv(f, "blob_reagent_datum")), rt.fv(f, "name", rt.sv(f, "blob_reagent_datum"))])]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("The <b><font color=\"＀\">＀</b></font> reagent ＀", [rt.fv(f, "color", rt.sv(f, "blob_reagent_datum")), rt.fv(f, "name", rt.sv(f, "blob_reagent_datum")), rt.fv(f, "description", rt.sv(f, "blob_reagent_datum"))])]);
	if (!truthy(rt.fv(f, "effectdesc", rt.sv(f, "blob_reagent_datum")))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("The <b><font color=\"＀\">＀</b></font> reagent ＀", [rt.fv(f, "color", rt.sv(f, "blob_reagent_datum")), rt.fv(f, "name", rt.sv(f, "blob_reagent_datum")), rt.fv(f, "effectdesc", rt.sv(f, "blob_reagent_datum"))])]);
	return f.dot;
}, true);

// /mob/camera/blob/verb/blob_help  (code/game/gamemodes/blob/powers.dm:351)
rt.def("/mob/camera/blob/verb/blob_help", function blob_help(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<b>As the overmind, you can control the blob!</b>"]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("Your blob reagent is: <b><font color=\"＀\">＀</b></font>!", [rt.fv(f, "color", rt.sv(f, "blob_reagent_datum")), rt.fv(f, "name", rt.sv(f, "blob_reagent_datum"))])]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("The <b><font color=\"＀\">＀</b></font> reagent ＀", [rt.fv(f, "color", rt.sv(f, "blob_reagent_datum")), rt.fv(f, "name", rt.sv(f, "blob_reagent_datum")), rt.fv(f, "description", rt.sv(f, "blob_reagent_datum"))])]);
	if (truthy(rt.fv(f, "effectdesc", rt.sv(f, "blob_reagent_datum")))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("The <b><font color=\"＀\">＀</b></font> reagent ＀", [rt.fv(f, "color", rt.sv(f, "blob_reagent_datum")), rt.fv(f, "name", rt.sv(f, "blob_reagent_datum")), rt.fv(f, "effectdesc", rt.sv(f, "blob_reagent_datum"))])]);
	}
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<b>You can expand, which will attack people, damage objects, or place a Normal Blob if the tile is clear.</b>"]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<i>Normal Blobs</i> will expand your reach and can be upgraded into special blobs that perform certain functions."]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<b>You can upgrade normal blobs into the following types of blob:</b>"]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<i>Shield Blobs</i> are strong and expensive blobs which take more damage. In additon, they are fireproof and can block air, use these to protect yourself from station fires."]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<i>Resource Blobs</i> are blobs which produce more resources for you, build as many of these as possible to consume the station. This type of blob must be placed near node blobs or your core to work."]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<i>Factory Blobs</i> are blobs that spawn blob spores which will attack nearby enemies. This type of blob must be placed near node blobs or your core to work."]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<i>Blobbernauts</i> can be produced from factories for a cost, and are hard to kill, powerful, and moderately smart. The factory used to create one will become fragile and briefly unable to produce spores."]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<i>Node Blobs</i> are blobs which grow, like the core. Like the core it can activate resource and factory blobs."]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<b>In addition to the buttons on your HUD, there are a few click shortcuts to speed up expansion and defense.</b>"]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<b>Shortcuts:</b> Click = Expand Blob <b>|</b> Middle Mouse Click = Rally Spores <b>|</b> Ctrl Click = Create Shield Blob <b>|</b> Alt Click = Remove Blob"]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), "Attempting to talk will send a message to all other GLOB.overminds, allowing you to coordinate with them."]);
	if (!(!truthy(rt.sv(f, "placed")) && rt.le(rt.sv(f, "autoplace_max_time"), rt.worldTime(f)))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='big'><font color=\"#EE4000\">You will automatically place your blob core in ＀ minutes.</font></span>", [rt.call(f, P("/proc/round"), null, [divide(subtract(rt.sv(f, "autoplace_max_time"), rt.worldTime(f)), 600), 0.5])])]);
	$0 = live(f.src);
	if (truthy(rt.sv(f, "manualplace_min_time"))) {
		$1 = "will be able to";
	} else {
		$1 = "can";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='big'><font color=\"#EE4000\">You ＀ manually place your blob core by pressing the Place Blob Core button in the bottom right corner of the screen.</font></span>", [$1])]);
	return f.dot;
}, false, { verb: { name: "*Blob Help*", category: "Blob", desc: "Help on how to blob." } });
