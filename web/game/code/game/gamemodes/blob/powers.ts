// Based on /tg/station's code/game/gamemodes/blob/powers.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


// powers.dm:2
rt.def("/mob/camera/blob/proc/can_buy", function can_buy(f: Frame, cost: Value) {
	cost ??= 15;
	if (this.blob_points < cost) {
		to_chat(this, `<span class='warning'>You cannot afford this, you need at least ${cost} resources!</span>`);
		return 0;
	}
	this.add_points(-cost);
	return 1;
});

// powers.dm:11
rt.def("/mob/camera/blob/proc/place_blob_core", function* place_blob_core(f: Frame, point_rate: Value, placement_override: Value) {
	let M: Value = null, _T: Value = null, O: Value = null, core: Value = null;
	if (this.placed && placement_override != -1) {
		return 1;
	}
	if (!placement_override) {
		for (M of each(range(7, this), T("/mob/living"))) {
			if (rt.isIn(f, "blob", M.faction)) {
				continue;
			}
			if (M.client) {
				to_chat(this, "<span class='warning'>There is someone too close to place your blob core!</span>");
				return 0;
			}
		}
		M = null;
		for (M of each(view(13, this), T("/mob/living"))) {
			if (rt.isIn(f, "blob", M.faction)) {
				continue;
			}
			if (M.client) {
				to_chat(this, "<span class='warning'>Someone could see your blob core from here!</span>");
				return 0;
			}
		}
		if ((_T = rt.getStep(f, this, 0)).density) {
			to_chat(this, "<span class='warning'>This spot is too dense to place a blob core on!</span>");
			return 0;
		}
		for (O of each(_T, T("/obj"))) {
			if (rt.istype(O, T("/obj/structure/blob"))) {
				if (rt.istype(O, T("/obj/structure/blob/normal"))) {
					yield* qdel(O);
				} else {
					to_chat(this, "<span class='warning'>There is already a blob here!</span>");
					return 0;
				}
			} else if (O.density) {
				to_chat(this, "<span class='warning'>This spot is too dense to place a blob core on!</span>");
				return 0;
			}
		}
		if (rt.worldTime(f) <= this.manualplace_min_time && rt.worldTime(f) <= this.autoplace_max_time) {
			to_chat(this, "<span class='warning'>It is too early to place your blob core!</span>");
			return 0;
		}
	} else if (placement_override == 1) {
		this.loc = (_T = pick(GLOB.blobstart));
	}
	if (this.placed && this.blob_core) {
		yield* this.blob_core.forceMove(this.loc);
	} else {
		(core = (yield* new_(T("/obj/structure/blob/core"), rt.getStep(f, this, 0), null, point_rate, 1))).overmind = this;
		this.blob_core = core;
		yield* core.update_icon();
	}
	this.update_health_hud();
	this.placed = 1;
	return 1;
}, true);

// powers.dm:62
rt.def("/mob/camera/blob/verb/transport_core", function transport_core(f: Frame) {
	if (!this.blob_core) return f.dot;
	this.loc = this.blob_core.loc;
	return f.dot;
}, false, { verb: { name: "Jump to Core", category: "Blob", desc: "Move your camera to your core." } });

// powers.dm:68
rt.def("/mob/camera/blob/verb/jump_to_node", function* jump_to_node(f: Frame) {
	let i: Value = null, B: Value = null, chosen_node: Value = null;
	let $e: any;
	if (!rt.len(f, GLOB.blob_nodes)) return f.dot;
	let nodes: Value = list();
	rt.forRange(f, 0, 1, rt.len(f, GLOB.blob_nodes), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		B = rt.index(GLOB.blob_nodes, i);
		rt.setAt(nodes, `Blob Node #${i} (${B.overmind ? `${B.overmind.blob_reagent_datum.name}` : "No Chemical"})`, B);
	}
	rt.endFor(f, 0);
	let node_name: Value = (yield* g.op(f, "Prompt", [0], [null, "Node Jump", "Choose a node to jump to.", this, nodes]));
	if (!(chosen_node = rt.index(nodes, node_name))) return f.dot;
	this.loc = chosen_node.loc;
	return f.dot;
}, true, { verb: { name: "Jump to Node", category: "Blob", desc: "Move your camera to a selected node." } });

// powers.dm:79
rt.def("/mob/camera/blob/proc/createSpecial", function* createSpecial(f: Frame, price: Value, blobType: Value, nearEquals: Value, needsNode: Value, _T: Value) {
	let B: Value = null, L: Value = null, N: Value = null;
	if (!_T) {
		_T = rt.getStep(f, this, 0);
	}
	if (!(B = rt.locateIn(f, T("/obj/structure/blob"), _T))) {
		to_chat(this, "<span class='warning'>There is no blob here!</span>");
		return f.dot;
	}
	if (!rt.istype(B, T("/obj/structure/blob/normal"))) {
		to_chat(this, "<span class='warning'>Unable to use this blob, find a normal one.</span>");
		return f.dot;
	}
	if (needsNode && this.nodes_required) {
		if (!rt.locateIn(f, T("/obj/structure/blob/node"), orange(3, _T)) && !rt.locateIn(f, T("/obj/structure/blob/core"), orange(4, _T))) {
			to_chat(this, "<span class='warning'>You need to place this blob closer to a node or core!</span>");
			return f.dot;
		}
	}
	if (nearEquals) {
		for (L of each(orange(nearEquals, _T), T("/obj/structure/blob"))) {
			if (L.type == blobType) {
				to_chat(this, `<span class='warning'>There is a similar blob nearby, move more than ${nearEquals} tiles away from it!</span>`);
				return f.dot;
			}
		}
	}
	if (!this.can_buy(price)) {
		return f.dot;
	}
	return (N = (yield* B.change_to(blobType, this)));
}, true);

// powers.dm:106
rt.def("/mob/camera/blob/verb/toggle_node_req", function toggle_node_req(f: Frame) {
	this.nodes_required = (!this.nodes_required ? 1 : 0);
	if (this.nodes_required) {
		to_chat(this, "<span class='warning'>You now require a nearby node or core to place factory and resource blobs.</span>");
	} else {
		to_chat(this, "<span class='warning'>You no longer require a nearby node or core to place factory and resource blobs.</span>");
	}
	return f.dot;
}, false, { verb: { name: "Toggle Node Requirement", category: "Blob", desc: "Toggle requiring nodes to place resource and factory blobs." } });

// powers.dm:116
rt.def("/mob/camera/blob/verb/create_shield_power", function* create_shield_power(f: Frame) {
	yield* this.create_shield();
	return f.dot;
}, true, { verb: { name: "Create Shield Blob (15)", category: "Blob", desc: "Create a shield blob, which will block fire and is hard to kill." } });

// powers.dm:119
rt.def("/mob/camera/blob/proc/create_shield", function* create_shield(f: Frame, _T: Value) {
	yield* this.createSpecial(15, T("/obj/structure/blob/shield"), 0, 0, _T);
	return f.dot;
}, true);

// powers.dm:125
rt.def("/mob/camera/blob/verb/create_resource", function* create_resource(f: Frame) {
	yield* this.createSpecial(40, T("/obj/structure/blob/resource"), 4, 1);
	return f.dot;
}, true, { verb: { name: "Create Resource Blob (40)", category: "Blob", desc: "Create a resource tower which will generate resources for you." } });

// powers.dm:131
rt.def("/mob/camera/blob/verb/create_node", function* create_node(f: Frame) {
	yield* this.createSpecial(50, T("/obj/structure/blob/node"), 5, 0);
	return f.dot;
}, true, { verb: { name: "Create Node Blob (50)", category: "Blob", desc: "Create a node, which will power nearby factory and resource blobs." } });

// powers.dm:137
rt.def("/mob/camera/blob/verb/create_factory", function* create_factory(f: Frame) {
	yield* this.createSpecial(60, T("/obj/structure/blob/factory"), 7, 1);
	return f.dot;
}, true, { verb: { name: "Create Factory Blob (60)", category: "Blob", desc: "Create a spore tower that will spawn spores to harass your enemies." } });

// powers.dm:143
rt.def("/mob/camera/blob/verb/create_blobbernaut", function* create_blobbernaut(f: Frame) {
	let B: Value = null, candidates: Value = null, C: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	let _T: Value = rt.getStep(f, this, 0);
	if (!(B = rt.locateIn(f, T("/obj/structure/blob/factory"), _T))) {
		to_chat(this, "<span class='warning'>You must be on a factory blob!</span>");
		return f.dot;
	}
	if (B.naut) {
		to_chat(this, "<span class='warning'>This factory blob is already sustaining a blobbernaut.</span>");
		return f.dot;
	}
	if (B.obj_integrity < B.max_integrity * 0.5) {
		to_chat(this, "<span class='warning'>This factory blob is too damaged to sustain a blobbernaut.</span>");
		return f.dot;
	}
	if (!this.can_buy(40)) {
		return f.dot;
	}
	B.max_integrity = rt.initial(f, B, "max_integrity") * 0.25;
	B.obj_integrity = min(B.obj_integrity, B.max_integrity);
	yield* B.update_icon();
	B.visible_message(`<span class='warning'><b>The blobbernaut ${pick("rips", "tears", "shreds")} its way out of the factory blob!</b></span>`);
	playsound(B.loc, rt.rsc("sound/effects/splat.ogg"), 50, 1);
	let blobber: Value = (yield* new_(T("/mob/living/simple_animal/hostile/blob/blobbernaut"), rt.getStep(f, B, 0)));
	flick("blobbernaut_produce", blobber);
	B.naut = blobber;
	blobber.factory = B;
	blobber.overmind = this;
	yield* blobber.update_icons();
	blobber.notransform = 1;
	yield* blobber.adjustHealth(blobber.maxHealth * 0.5);
	this.blob_mobs += blobber;
	if (rt.len(f, (candidates = (yield* pollCandidatesForMob(`Do you want to play as a ${this.blob_reagent_datum.name} blobbernaut?`, "blob", null, "blob", 50, blobber))))) {
		C = pick(candidates);
		blobber.key = C.key;
		rt.op(f, "Output", [], [blobber, rt.rsc("sound/effects/blobattack.ogg")], false);
		rt.op(f, "Output", [], [blobber, rt.rsc("sound/effects/attackblob.ogg")], false);
		to_chat(blobber, "<b>You are a blobbernaut!</b>");
		to_chat(blobber, "You are powerful, hard to kill, and slowly regenerate near nodes and cores, but will slowly die if not near the blob or if the factory that made you is killed.");
		to_chat(blobber, "You can communicate with other blobbernauts and GLOB.overminds via <b>:b</b>");
		to_chat(blobber, `Your overmind's blob reagent is: <b><font color="${this.blob_reagent_datum.color}">${this.blob_reagent_datum.name}</b></font>!`);
		$0 = blobber;
		$1 = this.blob_reagent_datum.color;
		$2 = this.blob_reagent_datum.name;
		if (this.blob_reagent_datum.shortdesc) {
			$3 = `${this.blob_reagent_datum.shortdesc}`;
		} else {
			$3 = `${this.blob_reagent_datum.description}`;
		}
		to_chat($0, `The <b><font color="${$1}">${$2}</b></font> reagent ${$3}`);
	}
	if (!blobber) return f.dot;
	blobber.notransform = 0;
	return f.dot;
}, true, { verb: { name: "Create Blobbernaut (40)", category: "Blob", desc: "Create a powerful blobbernaut which is mildly smart and will attack enemies." } });

// powers.dm:188
rt.def("/mob/camera/blob/verb/relocate_core", function* relocate_core(f: Frame) {
	let B: Value = null;
	let _T: Value = rt.getStep(f, this, 0);
	if (!(B = rt.locateIn(f, T("/obj/structure/blob/node"), _T))) {
		to_chat(this, "<span class='warning'>You must be on a blob node!</span>");
		return f.dot;
	}
	if (!this.blob_core) {
		to_chat(this, "<span class='userdanger'>You have no core and are about to die! May you rest in peace.</span>");
		return f.dot;
	}
	let A: Value = get_area(_T);
	if (rt.istype(_T, T("/turf/open/space")) || A && !A.blob_allowed) {
		to_chat(this, "<span class='warning'>You cannot relocate your core here!</span>");
		return f.dot;
	}
	if (!this.can_buy(80)) {
		return f.dot;
	}
	let old_turf: Value = rt.getStep(f, this.blob_core, 0);
	let olddir: Value = this.blob_core.dir;
	yield* this.blob_core.forceMove(_T);
	yield* this.blob_core.setDir(B.dir);
	yield* B.forceMove(old_turf);
	yield* B.setDir(olddir);
	return f.dot;
}, true, { verb: { name: "Relocate Core (80)", category: "Blob", desc: "Swaps the locations of your core and the selected node." } });

// powers.dm:213
rt.def("/mob/camera/blob/verb/revert", function* revert(f: Frame) {
	let _T: Value = null;
	yield* this.remove_blob((_T = rt.getStep(f, this, 0)));
	return f.dot;
}, true, { verb: { name: "Remove Blob", category: "Blob", desc: "Removes a blob, giving you back some resources." } });

// powers.dm:217
rt.def("/mob/camera/blob/proc/remove_blob", function* remove_blob(f: Frame, _T: Value) {
	let B: Value = null;
	if (!(B = rt.locateIn(f, T("/obj/structure/blob"), _T))) {
		to_chat(this, "<span class='warning'>There is no blob there!</span>");
		return f.dot;
	}
	if (B.point_return < 0) {
		to_chat(this, "<span class='warning'>Unable to remove this blob.</span>");
		return f.dot;
	}
	if (this.max_blob_points < B.point_return + this.blob_points) {
		to_chat(this, "<span class='warning'>You have too many resources to remove this blob!</span>");
		return f.dot;
	}
	if (B.point_return) {
		this.add_points(B.point_return);
		to_chat(this, fmt("<span class='notice'>Gained ＀ resources from removing ％！.</span>", [B.point_return, B]));
	}
	yield* qdel(B);
	return f.dot;
}, true);

// powers.dm:236
rt.def("/mob/camera/blob/verb/expand_blob_power", function* expand_blob_power(f: Frame) {
	let _T: Value = null;
	yield* this.expand_blob((_T = rt.getStep(f, this, 0)));
	return f.dot;
}, true, { verb: { name: "Expand/Attack Blob (4)", category: "Blob", desc: "Attempts to create a new blob in this tile. If the tile isn't clear, instead attacks it, damaging mobs and objects." } });

// powers.dm:240
rt.def("/mob/camera/blob/proc/expand_blob", function* expand_blob(f: Frame, _T: Value) {
	let AB: Value = null, L: Value = null, mob_protection: Value = null, B: Value = null, cardinalblobs: Value = null, diagonalblobs: Value = null, I: Value = null, IB: Value = null, OB: Value = null;
	if (rt.worldTime(f) < this.last_attack) {
		return f.dot;
	}
	let possibleblobs: Value = list();
	for (AB of each(range(_T, 1), T("/obj/structure/blob"))) {
		possibleblobs += AB;
	}
	if (!rt.len(f, possibleblobs)) {
		to_chat(this, "<span class='warning'>There is no blob adjacent to the target tile!</span>");
		return f.dot;
	}
	if (!this.can_buy(4)) return f.dot;
	let attacksuccess: Value = 0;
	for (L of each(_T, T("/mob/living"))) {
		if (rt.isIn(f, "blob", L.faction)) {
			continue;
		}
		if (L.stat != 2) {
			attacksuccess = 1;
		}
		mob_protection = L.get_permeability_protection();
		yield* this.blob_reagent_datum.reaction_mob(L, VAPOR, 25, 1, mob_protection, this);
		yield* this.blob_reagent_datum.send_message(L);
	}
	if (B = rt.locateIn(f, T("/obj/structure/blob"), _T)) {
		if (attacksuccess) {
			yield* B.blob_attack_animation(_T, this);
		} else {
			to_chat(this, "<span class='warning'>There is a blob there!</span>");
			this.add_points(4);
		}
	} else {
		cardinalblobs = list();
		diagonalblobs = list();
		for (I of each(possibleblobs)) {
			if (rt.isIn(f, rt.getDir(f, (IB = I), _T), GLOB.cardinal)) {
				cardinalblobs += IB;
			} else {
				diagonalblobs += IB;
			}
		}
		if (rt.len(f, cardinalblobs)) {
			yield* (OB = pick(cardinalblobs)).expand(_T, this);
		} else {
			OB = pick(diagonalblobs);
			if (attacksuccess) {
				yield* OB.blob_attack_animation(_T, this);
				playsound(OB, rt.rsc("sound/effects/splat.ogg"), 50, 1);
			} else {
				this.add_points(4);
			}
		}
	}
	if (attacksuccess) {
		this.last_attack = rt.worldTime(f) + 8;
	} else {
		this.last_attack = rt.worldTime(f) + 2;
	}
	return f.dot;
}, true);

// powers.dm:294
rt.def("/mob/camera/blob/verb/rally_spores_power", function rally_spores_power(f: Frame) {
	let _T: Value = null;
	this.rally_spores((_T = rt.getStep(f, this, 0)));
	return f.dot;
}, false, { verb: { name: "Rally Spores", category: "Blob", desc: "Rally your spores to move to a target location." } });

// powers.dm:298
rt.def("/mob/camera/blob/proc/rally_spores", function rally_spores(f: Frame, _T: Value) {
	let surrounding_turfs: Value = null, BS: Value = null;
	to_chat(this, "You rally your spores.");
	if (!rt.len(f, (surrounding_turfs = block(rt.locate(_T.x - 1, _T.y - 1, _T.z), rt.locate(_T.x + 1, _T.y + 1, _T.z))))) {
		return f.dot;
	}
	for (BS of each(this.blob_mobs, T("/mob/living/simple_animal/hostile/blob/blobspore"))) {
		if (isturf(BS.loc) && get_dist(BS, _T) <= 35) {
			BS.LoseTarget();
			BS.Goto(pick(surrounding_turfs), BS.move_to_delay);
		}
	}
	return f.dot;
});

// powers.dm:311
rt.def("/mob/camera/blob/verb/blob_broadcast", function* blob_broadcast(f: Frame) {
	let speak_text: Value = null, BLO: Value = null, BM: Value = null;
	if (!(speak_text = (yield* g.op(f, "Prompt", [2], [null, "Blob Broadcast", "What would you like to say with your minions?", this, null])))) {
		return f.dot;
	} else {
		to_chat(this, `You broadcast with your minions, <B>${speak_text}</B>`);
	}
	for (BLO of each(this.blob_mobs)) {
		if ((BM = BLO).stat == 0) {
			yield* BM.say(speak_text);
		}
	}
	return f.dot;
}, true, { verb: { name: "Blob Broadcast", category: "Blob", desc: "Speak with your blob spores and blobbernauts as your mouthpieces." } });

// powers.dm:325
rt.def("/mob/camera/blob/verb/chemical_reroll", function* chemical_reroll(f: Frame) {
	if (!(this.free_chem_rerolls || this.can_buy(40))) return f.dot;
	yield* this.set_chemical();
	if (!this.free_chem_rerolls) return f.dot;
	this.free_chem_rerolls--;
	return f.dot;
}, true, { verb: { name: "Reactive Chemical Adaptation (40)", category: "Blob", desc: "Replaces your chemical with a random, different one." } });

// powers.dm:331
rt.def("/mob/camera/blob/proc/set_chemical", function* set_chemical(f: Frame) {
	let BL: Value = null, B: Value = null, BLO: Value = null, BM: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	let BC: Value = pick(typesof(T("/datum/reagent/blob")) - T("/datum/reagent/blob") - this.blob_reagent_datum.type);
	this.blob_reagent_datum = (yield* new_(BC));
	this.color = this.blob_reagent_datum.complementary_color;
	for (BL of each(GLOB.blobs)) {
		yield* (B = BL).update_icon();
	}
	for (BLO of each(this.blob_mobs)) {
		yield* (BM = BLO).update_icons();
		to_chat(BM, `Your overmind's blob reagent is now: <b><font color="${this.blob_reagent_datum.color}">${this.blob_reagent_datum.name}</b></font>!`);
		$0 = BM;
		$1 = this.blob_reagent_datum.color;
		$2 = this.blob_reagent_datum.name;
		if (this.blob_reagent_datum.shortdesc) {
			$3 = `${this.blob_reagent_datum.shortdesc}`;
		} else {
			$3 = `${this.blob_reagent_datum.description}`;
		}
		to_chat($0, `The <b><font color="${$1}">${$2}</b></font> reagent ${$3}`);
	}
	to_chat(this, `Your reagent is now: <b><font color="${this.blob_reagent_datum.color}">${this.blob_reagent_datum.name}</b></font>!`);
	to_chat(this, `The <b><font color="${this.blob_reagent_datum.color}">${this.blob_reagent_datum.name}</b></font> reagent ${this.blob_reagent_datum.description}`);
	if (!this.blob_reagent_datum.effectdesc) return f.dot;
	to_chat(this, `The <b><font color="${this.blob_reagent_datum.color}">${this.blob_reagent_datum.name}</b></font> reagent ${this.blob_reagent_datum.effectdesc}`);
	return f.dot;
}, true);

// powers.dm:351
rt.def("/mob/camera/blob/verb/blob_help", function blob_help(f: Frame) {
	let $1: any;
	to_chat(this, "<b>As the overmind, you can control the blob!</b>");
	to_chat(this, `Your blob reagent is: <b><font color="${this.blob_reagent_datum.color}">${this.blob_reagent_datum.name}</b></font>!`);
	to_chat(this, `The <b><font color="${this.blob_reagent_datum.color}">${this.blob_reagent_datum.name}</b></font> reagent ${this.blob_reagent_datum.description}`);
	if (this.blob_reagent_datum.effectdesc) {
		to_chat(this, `The <b><font color="${this.blob_reagent_datum.color}">${this.blob_reagent_datum.name}</b></font> reagent ${this.blob_reagent_datum.effectdesc}`);
	}
	to_chat(this, "<b>You can expand, which will attack people, damage objects, or place a Normal Blob if the tile is clear.</b>");
	to_chat(this, "<i>Normal Blobs</i> will expand your reach and can be upgraded into special blobs that perform certain functions.");
	to_chat(this, "<b>You can upgrade normal blobs into the following types of blob:</b>");
	to_chat(this, "<i>Shield Blobs</i> are strong and expensive blobs which take more damage. In additon, they are fireproof and can block air, use these to protect yourself from station fires.");
	to_chat(this, "<i>Resource Blobs</i> are blobs which produce more resources for you, build as many of these as possible to consume the station. This type of blob must be placed near node blobs or your core to work.");
	to_chat(this, "<i>Factory Blobs</i> are blobs that spawn blob spores which will attack nearby enemies. This type of blob must be placed near node blobs or your core to work.");
	to_chat(this, "<i>Blobbernauts</i> can be produced from factories for a cost, and are hard to kill, powerful, and moderately smart. The factory used to create one will become fragile and briefly unable to produce spores.");
	to_chat(this, "<i>Node Blobs</i> are blobs which grow, like the core. Like the core it can activate resource and factory blobs.");
	to_chat(this, "<b>In addition to the buttons on your HUD, there are a few click shortcuts to speed up expansion and defense.</b>");
	to_chat(this, "<b>Shortcuts:</b> Click = Expand Blob <b>|</b> Middle Mouse Click = Rally Spores <b>|</b> Ctrl Click = Create Shield Blob <b>|</b> Alt Click = Remove Blob");
	to_chat(this, "Attempting to talk will send a message to all other GLOB.overminds, allowing you to coordinate with them.");
	if (!(!this.placed && this.autoplace_max_time <= rt.worldTime(f))) return f.dot;
	to_chat(this, `<span class='big'><font color="#EE4000">You will automatically place your blob core in ${round((this.autoplace_max_time - rt.worldTime(f)) / 600, 0.5)} minutes.</font></span>`);
	let $0: any = this;
	if (this.manualplace_min_time) {
		$1 = "will be able to";
	} else {
		$1 = "can";
	}
	to_chat($0, `<span class='big'><font color="#EE4000">You ${$1} manually place your blob core by pressing the Place Blob Core button in the bottom right corner of the screen.</font></span>`);
	return f.dot;
}, false, { verb: { name: "*Blob Help*", category: "Blob", desc: "Help on how to blob." } });
