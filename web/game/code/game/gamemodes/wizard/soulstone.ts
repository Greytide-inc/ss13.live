// Based on /tg/station's code/game/gamemodes/wizard/soulstone.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(9218, "/obj/item/device/soulstone", "/obj/item/device", {
	usability: 0,
	reusable: 1,
	spent: 0,
	name: "soulstone shard",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "soulstone",
	item_state: "electronic",
	layer: 3.6,
	desc: "A fragment of the legendary treasure known simply as the 'Soul Stone'. The shard still flickers with a fraction of the full artefact's power.",
	w_class: 1,
	slot_flags: 512,
	origin_tech: "bluespace=4;materials=5",
});

// soulstone.dm:17
rt.def("/obj/item/device/soulstone/proc/was_used", function was_used(f: Frame) {
	if (this.reusable) return f.dot;
	this.spent = 1;
	this.name = `dull ${this.name}`;
	this.desc = "A fragment of the legendary treasure known simply as the 'Soul Stone'. The shard lies still, dull and lifeless; whatever spark it once held long extinguished.";
	return f.dot;
});

// soulstone.dm:32
rt.def("/obj/item/device/soulstone/proc/pickup", function pickup(f: Frame, user: Value) {
	parent_proc();
	if (!(!iscultist(user) && !iswizard(user) && !this.usability)) return f.dot;
	to_chat(user, "<span class='danger'>An overwhelming feeling of dread comes over you as you pick up the soulstone. It would be wise to be rid of this quickly.</span>");
	user.Dizzy(120);
	return f.dot;
}, false);

// soulstone.dm:38
rt.def("/obj/item/device/soulstone/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!(this.usability || iscultist(user) || iswizard(user) || rt.istype(user, T("/mob/dead/observer")))) return f.dot;
	to_chat(user, "<span class='cult'>A soulstone, used to capture souls, either from unconscious or sleeping humans or from freed shades.</span>");
	to_chat(user, "<span class='cult'>The captured soul can be placed into a construct shell to produce a construct, or released from the stone as a shade.</span>");
	if (!this.spent) return f.dot;
	to_chat(user, "<span class='cult'>This shard is spent; it is now just a creepy rock.</span>");
	return f.dot;
}, false);

// soulstone.dm:48
rt.def("/obj/item/device/soulstone/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	if (!iscultist(user) && !iswizard(user) && !this.usability) {
		yield* user.Unconscious(100);
		to_chat(user, "<span class='userdanger'>Your body is wracked with debilitating pain!</span>");
		return f.dot;
	}
	if (this.spent) {
		to_chat(user, "<span class='warning'>There is no power left in the shard.</span>");
		return f.dot;
	}
	if (!rt.istype(M, T("/mob/living/carbon/human"))) {
		return (yield* parent_proc());
	}
	if (iscultist(M)) {
		to_chat(user, "<span class='cultlarge'>\"Come now, do not capture your bretheren's soul.\"</span>");
		return f.dot;
	}
	add_logs(user, M, `captured ${M.name}'s soul`, this);
	yield* this.transfer_soul("VICTIM", M, user);
	return f.dot;
}, true);

// soulstone.dm:67
rt.def("/obj/item/device/soulstone/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (!(get_dist(this, user) <= 1)) {
		return f.dot;
	}
	if (!iscultist(user) && !iswizard(user) && !this.usability) {
		yield* user.Unconscious(100);
		to_chat(user, "<span class='userdanger'>Your body is wracked with debilitating pain!</span>");
		return f.dot;
	}
	yield* this.release_shades(user);
	return f.dot;
}, true);

// soulstone.dm:76
rt.def("/obj/item/device/soulstone/proc/release_shades", function* release_shades(f: Frame, user: Value) {
	let A: Value = null;
	for (A of each(this, T("/mob/living/simple_animal/shade"))) {
		(rt.modField(f, A, "status_flags", 16773119, rt.bitAnd));
		A.canmove = 1;
		yield* A.forceMove(rt.getStep(f, user, 0));
		yield* A.cancel_camera();
		this.icon_state = "soulstone";
		this.name = rt.initial(f, this, "name");
		if (iswizard(user) || this.usability) {
			to_chat(A, `<b>You have been released from your prison, but you are still bound to ${user.real_name}'s will. Help them succeed in their goals at all costs.</b>`);
		} else if (iscultist(user)) {
			to_chat(A, "<b>You have been released from your prison, but you are still bound to the cult's will. Help them succeed in their goals at all costs.</b>");
		}
		this.was_used();
	}
	return f.dot;
}, true);

rt.type(12540, "/obj/structure/constructshell", "/obj/structure", {
	name: "empty shell",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "construct-cult",
	desc: "A wicked machine used by those skilled in magical arts. It is inactive.",
});

// soulstone.dm:97
rt.def("/obj/structure/constructshell/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!(iscultist(user) || iswizard(user) || user.stat == 2)) return f.dot;
	to_chat(user, "<span class='cult'>A construct shell, used to house bound souls from a soulstone.</span>");
	to_chat(user, "<span class='cult'>Placing a soulstone with a soul into this shell allows you to produce your choice of the following:</span>");
	to_chat(user, "<span class='cult'>An <b>Artificer</b>, which can produce <b>more shells and soulstones</b>, as well as fortifications.</span>");
	to_chat(user, "<span class='cult'>A <b>Wraith</b>, which does high damage and can jaunt through walls, though it is quite fragile.</span>");
	to_chat(user, "<span class='cult'>A <b>Juggernaut</b>, which is very hard to kill and can produce temporary walls, but is slow.</span>");
	return f.dot;
}, false);

// soulstone.dm:106
rt.def("/obj/structure/constructshell/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	let SS: Value = null;
	if (rt.istype(O, T("/obj/item/device/soulstone"))) {
		SS = O;
		if (!iscultist(user) && !iswizard(user) && !SS.usability) {
			to_chat(user, "<span class='danger'>An overwhelming feeling of dread comes over you as you attempt to place the soulstone into the shell. It would be wise to be rid of this quickly.</span>");
			user.Dizzy(120);
			return f.dot;
		}
		yield* SS.transfer_soul("CONSTRUCT", this, user);
		SS.was_used();
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// soulstone.dm:121
rt.def("/obj/item/device/soulstone/proc/transfer_soul", function* transfer_soul(f: Frame, choice: Value, target: Value, user: Value) {
	let _T: Value = null, W: Value = null, A: Value = null, construct_class: Value = null, B: Value = null;
	let $e: any;
	if (choice === "FORCE") {
		if (!rt.istype(target, T("/mob/living/carbon"))) {
			return 0;
		}
		if (rt.len(f, this.contents)) {
			return 0;
		}
		if ((_T = target).client !== null) {
			for (W of each(_T, T("/obj/item"))) {
				yield* _T.dropItemToGround(W);
			}
			yield* this.init_shade(_T, user);
			return 1;
		} else {
			to_chat(user, "<span class='userdanger'>Capture failed!</span>: The soul has already fled its mortal frame. You attempt to bring it back...");
			return (yield* this.getCultGhost(_T, user));
		}
	} else if (choice === "VICTIM") {
		if (is_sacrifice_target((_T = target).mind)) {
			if (iscultist(user)) {
				to_chat(user, "<span class='cult'><b>\"This soul is mine.</b></span> <span class='cultlarge'>SACRIFICE THEM!\"</span>");
			} else {
				to_chat(user, "<span class='danger'>The soulstone seems to reject this soul.</span>");
			}
			return 0;
		}
		if (rt.len(f, this.contents)) {
			to_chat(user, "<span class='userdanger'>Capture failed!</span>: The soulstone is full! Free an existing soul to make room.");
		} else if (_T.stat != 0) {
			if (_T.client === null) {
				to_chat(user, "<span class='userdanger'>Capture failed!</span>: The soul has already fled its mortal frame. You attempt to bring it back...");
				yield* this.getCultGhost(_T, user);
			} else {
				W = null;
				for (W of each(_T, T("/obj/item"))) {
					yield* _T.dropItemToGround(W);
				}
				yield* this.init_shade(_T, user, { vic: 1 });
				yield* qdel(_T);
			}
		} else {
			to_chat(user, "<span class='userdanger'>Capture failed!</span>: Kill or maim the victim first!");
		}
	} else if (choice === "SHADE") {
		_T = target;
		if (rt.len(f, this.contents)) {
			to_chat(user, "<span class='userdanger'>Capture failed!</span>: The soulstone is full! Free an existing soul to make room.");
		} else {
			_T.loc = this;
			(rt.modField(f, _T, "status_flags", 4096, rt.bitOr));
			_T.canmove = 0;
			_T.health = _T.maxHealth;
			this.icon_state = "soulstone2";
			this.name = `soulstone: Shade of ${_T.real_name}`;
			to_chat(_T, "<span class='notice'>Your soul has been captured by the soulstone. Its arcane energies are reknitting your ethereal form.</span>");
			if (user != _T) {
				to_chat(user, `<span class='info'><b>Capture successful!</b>:</span> ${_T.real_name}'s soul has been captured and stored within the soulstone.`);
			}
		}
	} else if (choice === "CONSTRUCT") {
		_T = target;
		if (A = rt.locateIn(f, T("/mob/living/simple_animal/shade"), this)) {
			construct_class = (yield* alert(user, "Please choose which type of construct you wish to create.", null, "Juggernaut", "Wraith", "Artificer"));
			if (!_T || !_T.loc) {
				return f.dot;
			}
			if (construct_class === "Juggernaut") {
				yield* makeNewConstruct(T("/mob/living/simple_animal/hostile/construct/armored"), A, user, 0, _T.loc);
			} else if (construct_class === "Wraith") {
				yield* makeNewConstruct(T("/mob/living/simple_animal/hostile/construct/wraith"), A, user, 0, _T.loc);
			} else if (construct_class === "Artificer") {
				if (iscultist(user) || iswizard(user)) {
					yield* makeNewConstruct(T("/mob/living/simple_animal/hostile/construct/builder"), A, user, 0, _T.loc);
				} else {
					yield* makeNewConstruct(T("/mob/living/simple_animal/hostile/construct/builder/noncult"), A, user, 0, _T.loc);
				}
			}
			for (B of each(GLOB.SSticker.mode.cult, T("/datum/mind"))) {
				if (B == A.mind) {
					GLOB.SSticker.mode.cult -= A.mind;
					GLOB.SSticker.mode.update_cult_icons_removed(A.mind);
				}
			}
			yield* qdel(_T);
			yield* user.drop_item();
			yield* qdel(this);
		} else {
			to_chat(user, "<span class='userdanger'>Creation failed!</span>: The soul stone is empty! Go kill someone!");
		}
	}
	return f.dot;
}, true);

// soulstone.dm:207
rt.def("/proc/makeNewConstruct", function* makeNewConstruct(f: Frame, ctype: Value, target: Value, stoner: Value, cultoverride: Value, loc_override: Value) {
	let SM: Value = null, BS: Value = null;
	let $0: any, $1: any;
	cultoverride ??= 0;
	if (loc_override) {
		$0 = loc_override;
	} else {
		$0 = rt.getStep(f, target, 0);
	}
	let newstruct: Value = (yield* new_(ctype, $0));
	if (stoner) {
		(rt.modField(f, newstruct, "faction", fmt("＃", [stoner]), rt.bitOr));
		newstruct.master = stoner;
		yield* (SM = (yield* new_(T("/datum/action/innate/seek_master")))).Grant(newstruct);
	}
	newstruct.key = target.key;
	if (newstruct.mind && (stoner && iscultist(stoner) || cultoverride) && GLOB.SSticker && GLOB.SSticker.mode) {
		yield* GLOB.SSticker.mode.add_cultist(newstruct.mind, 0);
	}
	if (iscultist(stoner) || cultoverride) {
		$0 = newstruct;
		if (stoner) {
			$1 = ` and ${stoner}`;
		} else {
			$1 = "";
		}
		to_chat($0, `<b>You are still bound to serve the cult${$1}, follow their orders and help them complete their goals at all costs.</b>`);
	} else if (stoner) {
		to_chat(newstruct, `<b>You are still bound to serve your creator, ${stoner}, follow their orders and help them complete their goals at all costs.</b>`);
	}
	yield* newstruct.clear_alert("bloodsense");
	if (BS = (yield* newstruct.throw_alert("bloodsense", T("/obj/screen/alert/bloodsense")))) {
		BS.Cviewer = newstruct;
	}
	yield* newstruct.cancel_camera();
	return f.dot;
}, true);

// soulstone.dm:229
rt.def("/obj/item/device/soulstone/proc/init_shade", function* init_shade(f: Frame, _T: Value, U: Value, vic: Value) {
	let S: Value = null;
	vic ??= 0;
	yield* new_(T("/obj/effect/decal/remains/human"), _T.loc);
	_T.invisibility = INVISIBILITY_ABSTRACT;
	yield* _T.dust_animation();
	(rt.modField(f, (S = (yield* new_(T("/mob/living/simple_animal/shade"), this))), "status_flags", 4096, rt.bitOr));
	S.canmove = 0;
	S.name = `Shade of ${_T.real_name}`;
	S.real_name = `Shade of ${_T.real_name}`;
	S.key = _T.key;
	if (U) {
		(rt.modField(f, S, "faction", fmt("＃", [U]), rt.bitOr));
	}
	if (U && iscultist(U)) {
		yield* GLOB.SSticker.mode.add_cultist(S.mind, 0);
	}
	yield* S.cancel_camera();
	this.name = `soulstone: Shade of ${_T.real_name}`;
	this.icon_state = "soulstone2";
	if (U && (iswizard(U) || this.usability)) {
		to_chat(S, `Your soul has been captured! You are now bound to ${U.real_name}'s will. Help them succeed in their goals at all costs.`);
	} else if (U && iscultist(U)) {
		to_chat(S, "Your soul has been captured! You are now bound to the cult's will. Help them succeed in their goals at all costs.");
	}
	if (!(vic && U)) return f.dot;
	to_chat(U, `<span class='info'><b>Capture successful!</b>:</span> ${_T.real_name}'s soul has been ripped from their body and stored within the soul stone.`);
	return f.dot;
}, true);

// soulstone.dm:256
rt.def("/obj/item/device/soulstone/proc/getCultGhost", function* getCultGhost(f: Frame, _T: Value, U: Value) {
	let chosen_ghost: Value = null, ghost: Value = null, consenting_candidates: Value = null, W: Value = null;
	for (ghost of each(GLOB.player_list, T("/mob/dead/observer"))) {
		if (ghost.mind && ghost.mind.current == _T && ghost.client) {
			chosen_ghost = ghost;
			break;
		}
	}
	if (!chosen_ghost) {
		if (rt.len(f, (consenting_candidates = (yield* pollGhostCandidates("Would you like to play as a Shade?", "Cultist", null, "cultist", { poll_time: 50 }))))) {
			chosen_ghost = pick(consenting_candidates);
		}
	}
	if (!_T) {
		return 0;
	}
	if (!chosen_ghost) {
		to_chat(U, "<span class='danger'>There were no spirits willing to become a shade.</span>");
		return 0;
	}
	if (rt.len(f, this.contents)) {
		return 0;
	}
	_T.ckey = chosen_ghost.ckey;
	for (W of each(_T, T("/obj/item"))) {
		yield* _T.dropItemToGround(W);
	}
	yield* this.init_shade(_T, U);
	yield* qdel(_T);
	return 1;
}, true);
