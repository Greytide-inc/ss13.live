// Based on /tg/station's code/datums/martial/wrestling.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;


// wrestling.dm:6
rt.def("/mob/living/carbon/human/proc/wrestling_help", function wrestling_help(f: Frame) {
	to_chat(f.usr, "<b><i>You flex your muscles and have a revelation...</i></b>");
	to_chat(f.usr, "<span class='notice'>Clinch</span>: Grab. Passively gives you a chance to immediately aggressively grab someone. Not always successful.");
	to_chat(f.usr, "<span class='notice'>Suplex</span>: Disarm someone you are grabbing. Suplexes your target to the floor. Greatly injures them and leaves both you and your target on the floor.");
	to_chat(f.usr, "<span class='notice'>Advanced grab</span>: Grab. Passively causes stamina damage when grabbing someone.");
	return f.dot;
}, false, { verb: { name: "Recall Teachings", category: "Wrestling", desc: "Remember how to wrestle." } });

rt.type(573, "/datum/martial_art/wrestling", "/datum/martial_art", {
	slam: null,
	throw_wrassle: null,
	kick: null,
	strike: null,
	drop: null,
	name: "Wrestling",
});

// wrestling.dm:13
rt.def("/datum/martial_art/wrestling/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.slam = (yield* new_(T("/datum/action/slam")));

	this.throw_wrassle = (yield* new_(T("/datum/action/throw_wrassle")));

	this.kick = (yield* new_(T("/datum/action/kick")));

	this.strike = (yield* new_(T("/datum/action/strike")));

	this.drop = (yield* new_(T("/datum/action/drop")));
	return f.dot;
}, true);

// wrestling.dm:20
rt.def("/datum/martial_art/wrestling/proc/check_streak", function* check_streak(f: Frame, A: Value, D: Value) {
	if (this.streak === "drop") {
		this.streak = "";
		yield* g.srcCall(f, "drop", A, D);
		return 1;
	} else if (this.streak === "strike") {
		this.streak = "";
		yield* g.srcCall(f, "strike", A, D);
		return 1;
	} else if (this.streak === "kick") {
		this.streak = "";
		yield* this.kick(A, D);
		return 1;
	} else if (this.streak === "throw") {
		this.streak = "";
		yield* this.throw_wrassle(A, D);
		return 1;
	} else if (this.streak === "slam") {
		this.streak = "";
		yield* this.slam(A, D);
		return 1;
	}
	return 0;
}, true);

rt.type(261, "/datum/action/slam", "/datum/action", {
	name: "Slam (Cinch) - Slam a grappled opponent into the floor.",
	button_icon_state: "wrassle_slam",
});

// wrestling.dm:48
rt.def("/datum/action/slam/proc/Trigger", function Trigger(f: Frame) {
	let H: Value = null;
	if (this.owner.incapacitated()) {
		to_chat(this.owner, "<span class='warning'>You can't WRESTLE while you're OUT FOR THE COUNT.</span>");
		return f.dot;
	}
	this.owner.visible_message(`<span class='danger'>${this.owner} prepares to BODY SLAM!</span>`, "<b><i>Your next attack will be a BODY SLAM.</i></b>");
	(H = this.owner).mind.martial_art.streak = "slam";
	return f.dot;
});

rt.type(262, "/datum/action/throw_wrassle", "/datum/action", {
	name: "Throw (Cinch) - Spin a cinched opponent around and throw them.",
	button_icon_state: "wrassle_throw",
});

// wrestling.dm:60
rt.def("/datum/action/throw_wrassle/proc/Trigger", function Trigger(f: Frame) {
	let H: Value = null;
	if (this.owner.incapacitated()) {
		to_chat(this.owner, "<span class='warning'>You can't WRESTLE while you're OUT FOR THE COUNT.</span>");
		return f.dot;
	}
	this.owner.visible_message(`<span class='danger'>${this.owner} prepares to THROW!</span>`, "<b><i>Your next attack will be a THROW.</i></b>");
	(H = this.owner).mind.martial_art.streak = "throw";
	return f.dot;
});

rt.type(263, "/datum/action/kick", "/datum/action", {
	name: "Kick - A powerful kick, sends people flying away from you. Also useful for escaping from bad situations.",
	button_icon_state: "wrassle_kick",
});

// wrestling.dm:72
rt.def("/datum/action/kick/proc/Trigger", function Trigger(f: Frame) {
	let H: Value = null;
	if (this.owner.incapacitated()) {
		to_chat(this.owner, "<span class='warning'>You can't WRESTLE while you're OUT FOR THE COUNT.</span>");
		return f.dot;
	}
	this.owner.visible_message(`<span class='danger'>${this.owner} prepares to KICK!</span>`, "<b><i>Your next attack will be a KICK.</i></b>");
	(H = this.owner).mind.martial_art.streak = "kick";
	return f.dot;
});

rt.type(264, "/datum/action/strike", "/datum/action", {
	name: "Strike - Hit a neaby opponent with a quick attack.",
	button_icon_state: "wrassle_strike",
});

// wrestling.dm:84
rt.def("/datum/action/strike/proc/Trigger", function Trigger(f: Frame) {
	let H: Value = null;
	if (this.owner.incapacitated()) {
		to_chat(this.owner, "<span class='warning'>You can't WRESTLE while you're OUT FOR THE COUNT.</span>");
		return f.dot;
	}
	this.owner.visible_message(`<span class='danger'>${this.owner} prepares to STRIKE!</span>`, "<b><i>Your next attack will be a STRIKE.</i></b>");
	(H = this.owner).mind.martial_art.streak = "strike";
	return f.dot;
});

rt.type(265, "/datum/action/drop", "/datum/action", {
	name: "Drop - Smash down onto an opponent.",
	button_icon_state: "wrassle_drop",
});

// wrestling.dm:96
rt.def("/datum/action/drop/proc/Trigger", function Trigger(f: Frame) {
	let H: Value = null;
	if (this.owner.incapacitated()) {
		to_chat(this.owner, "<span class='warning'>You can't WRESTLE while you're OUT FOR THE COUNT.</span>");
		return f.dot;
	}
	this.owner.visible_message(`<span class='danger'>${this.owner} prepares to LEG DROP!</span>`, "<b><i>Your next attack will be a LEG DROP.</i></b>");
	(H = this.owner).mind.martial_art.streak = "drop";
	return f.dot;
});

// wrestling.dm:104
rt.def("/datum/martial_art/wrestling/proc/teach", function* teach(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	to_chat(f.args[0], "<span class = 'userdanger'>SNAP INTO A THIN TIM!</span>");
	to_chat(f.args[0], "<span class = 'danger'>Place your cursor over a move at the top of the screen to see what it does.</span>");
	yield* this.drop.Grant(f.args[0]);
	yield* this.kick.Grant(f.args[0]);
	yield* this.slam.Grant(f.args[0]);
	yield* this.throw_wrassle.Grant(f.args[0]);
	yield* this.strike.Grant(f.args[0]);
	return f.dot;
}, true, { args: ["H", "make_temporary"] });

// wrestling.dm:114
rt.def("/datum/martial_art/wrestling/proc/remove", function* remove(f: Frame, H: Value) {
	yield* parent_proc();
	to_chat(H, "<span class = 'userdanger'>You no longer feel that the tower of power is too sweet to be sour...</span>");
	yield* this.drop.Remove(H);
	yield* this.kick.Remove(H);
	yield* this.slam.Remove(H);
	yield* this.throw_wrassle.Remove(H);
	yield* this.strike.Remove(H);
	return f.dot;
}, true);

// wrestling.dm:123
rt.def("/datum/martial_art/wrestling/proc/harm_act", function* harm_act(f: Frame, A: Value, D: Value) {
	if (yield* this.check_streak(A, D)) {
		return 1;
	}
	add_logs(A, D, "punched with wrestling");
	yield* parent_proc();
	return f.dot;
}, true);

// wrestling.dm:129
rt.def("/datum/martial_art/wrestling/proc/throw_wrassle", function* throw_wrassle(f: Frame, A: Value, D: Value) {
	let delay: Value = null, _T: Value = null, S: Value = null, _T_0: Value = null;
	if (!D) {
		return f.dot;
	}
	if (!A.pulling || A.pulling != D) {
		to_chat(A, `You need to have ${D} in a cinch!`);
		return f.dot;
	}
	yield* D.forceMove(A.loc);
	yield* D.setDir(rt.getDir(f, D, A));
	yield* D.Stun(80);
	A.visible_message(`<span class = 'danger'><B>${A} starts spinning around with ${D}!</B></span>`);
	yield* A.emote("scream");
	let i: Value = 0;
	while (i < 20) {
		delay = 5;
		if (rt.inRange(i, 17, 1e+31)) {
			delay = 0.25;
		} else if (rt.inRange(i, 14, 16)) {
			delay = 0.5;
		} else if (rt.inRange(i, 9, 13)) {
			delay = 1;
		} else if (rt.inRange(i, 5, 8)) {
			delay = 2;
		} else if (rt.inRange(i, 0, 4)) {
			delay = 3;
		}
		if (A && D) {
			if (get_dist(A, D) > 1) {
				to_chat(A, `${D} is too far away!`);
				return 0;
			}
			if (!isturf(A.loc) || !isturf(D.loc)) {
				to_chat(A, `You can't throw ${D} from here!`);
				return 0;
			}
			yield* A.setDir(turn(A.dir, 90));
			_T = rt.getStep(f, A, A.dir);
			if ((S = D.loc) && isturf(S) && (yield* S.Exit(D)) && _T && isturf(_T) && (yield* _T.Enter(A))) {
				yield* D.forceMove(_T);
				yield* D.setDir(rt.getDir(f, D, A));
			}
		} else {
			return 0;
		}
		yield* sleep(delay);
		i++;
	}
	if (A && D) {
		if (get_dist(A, D) > 1) {
			to_chat(A, `${D} is too far away!`);
			return 0;
		}
		if (!isturf(A.loc) || !isturf(D.loc)) {
			to_chat(A, `You can't throw ${D} from here!`);
			return 0;
		}
		yield* D.forceMove(A.loc);
		A.visible_message(`<span class = 'danger'><B>${A} throws ${D}!</B></span>`);
		playsound(A.loc, "swing_hit", 50, 1);
		if ((_T_0 = get_edge_target_turf(A, A.dir)) && isturf(_T_0)) {
			if (!D.stat) {
				yield* D.emote("scream");
			}
			yield* D.throw_at(_T_0, 10, 4, { callback: (yield* new_(T("/datum/callback"), D, P("/mob/living/carbon/human/proc/Knockdown"), 20)) });
		}
	}
	add_logs(A, D, "has thrown with wrestling");
	return 0;
}, true);

// wrestling.dm:202
rt.def("/datum/martial_art/wrestling/proc/FlipAnimation", function* FlipAnimation(f: Frame, D: Value) {
	if (D) {
		rt.op(f, "Animate", [2, 8], [null, D, "transform", matrix(180, 5), "time", 1, "loop", 0]);
	}
	yield* sleep(15);
	if (!D) return f.dot;
	rt.op(f, "Animate", [2, 8], [null, D, "transform", null, "time", 1, "loop", 0]);
	return f.dot;
}, true, { waitfor: false });

// wrestling.dm:208
rt.def("/datum/martial_art/wrestling/proc/slam", function* slam(f: Frame, A: Value, D: Value) {
	let fluff: Value = null;
	if (!D) {
		return f.dot;
	}
	if (!A.pulling || A.pulling != D) {
		to_chat(A, `You need to have ${D} in a cinch!`);
		return f.dot;
	}
	yield* D.forceMove(A.loc);
	yield* A.setDir(rt.getDir(f, A, D));
	yield* D.setDir(rt.getDir(f, D, A));
	A.visible_message(`<span class = 'danger'><B>${A} lifts ${D} up!</B></span>`);
	yield* this.FlipAnimation();
	let i: Value = 0;
	while (i < 3) {
		if (A && D) {
			A.pixel_y += 3;
			D.pixel_y += 3;
			yield* A.setDir(turn(A.dir, 90));
			yield* D.setDir(turn(D.dir, 90));
			if (A.dir === 1) {
				D.pixel_x = A.pixel_x;
			} else if (A.dir === 2) {
				D.pixel_x = A.pixel_x;
			} else if (A.dir === 4) {
				D.pixel_x = A.pixel_x - 8;
			} else if (A.dir === 8) {
				D.pixel_x = A.pixel_x + 8;
			}
			if (get_dist(A, D) > 1) {
				to_chat(A, `${D} is too far away!`);
				A.pixel_x = 0;
				A.pixel_y = 0;
				D.pixel_x = 0;
				D.pixel_y = 0;
				return 0;
			}
			if (!isturf(A.loc) || !isturf(D.loc)) {
				to_chat(A, `You can't slam ${D} here!`);
				A.pixel_x = 0;
				A.pixel_y = 0;
				D.pixel_x = 0;
				D.pixel_y = 0;
				return 0;
			}
		} else {
			if (A) {
				A.pixel_x = 0;
				A.pixel_y = 0;
			}
			if (D) {
				D.pixel_x = 0;
				D.pixel_y = 0;
			}
			return 0;
		}
		yield* sleep(1);
		i++;
	}
	if (A && D) {
		A.pixel_x = 0;
		A.pixel_y = 0;
		D.pixel_x = 0;
		D.pixel_y = 0;
		if (get_dist(A, D) > 1) {
			to_chat(A, `${D} is too far away!`);
			return 0;
		}
		if (!isturf(A.loc) || !isturf(D.loc)) {
			to_chat(A, `You can't slam ${D} here!`);
			return 0;
		}
		yield* D.forceMove(A.loc);
		fluff = "body-slam";
		const chosen = pick(2, 3);
		if (chosen === 2) {
			fluff = `turbo ${fluff}`;
		} else if (chosen === 3) {
			fluff = `atomic ${fluff}`;
		}
		A.visible_message(`<span class = 'danger'><B>${A} ${fluff} ${D}!</B></span>`);
		playsound(A.loc, "swing_hit", 50, 1);
		if (!D.stat) {
			yield* D.emote("scream");
			yield* D.Knockdown(40);
			const die = rand(1, 3);
			if (die === 2) {
				yield* D.adjustBruteLoss(rand(20, 30));
			} else if (die === 3) {
				yield* D.ex_act(3);
			} else {
				yield* D.adjustBruteLoss(rand(10, 20));
			}
		} else {
			yield* D.ex_act(3);
		}
	} else {
		if (A) {
			A.pixel_x = 0;
			A.pixel_y = 0;
		}
		if (D) {
			D.pixel_x = 0;
			D.pixel_y = 0;
		}
	}
	add_logs(A, D, "body-slammed");
	return 0;
}, true);

// wrestling.dm:316
rt.def("/datum/martial_art/wrestling/proc/CheckStrikeTurf", function* CheckStrikeTurf(f: Frame, A: Value, _T: Value) {
	if (!(A && _T && isturf(_T) && get_dist(A, _T) <= 1)) return f.dot;
	yield* A.forceMove(_T);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon/human" }, { path: "/turf" }] });

// wrestling.dm:320
rt.def("/datum/martial_art/wrestling/proc/strike", function* strike(f: Frame, A: Value, D: Value) {
	let _T: Value = null, i: Value = null;
	if (!D) {
		return f.dot;
	}
	if ((_T = rt.getStep(f, A, 0)) && isturf(_T) && D && isturf(D.loc)) {
		i = 0;
		while (i < 4) {
			yield* A.setDir(turn(A.dir, 90));
			i++;
		}
		yield* A.forceMove(D.loc);
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/martial_art/wrestling/proc/CheckStrikeTurf"), A, _T)), 4);
		A.visible_message(`<span class = 'danger'><b>${A} headbutts ${D}!</b></span>`);
		yield* D.adjustBruteLoss(rand(10, 20));
		playsound(A.loc, "swing_hit", 50, 1);
		yield* D.Unconscious(20);
	}
	add_logs(A, D, "headbutted");
	return f.dot;
}, true);

// wrestling.dm:337
rt.def("/datum/martial_art/wrestling/proc/kick", function* kick(f: Frame, A: Value, D: Value) {
	let _T: Value = null;
	if (!D) {
		return f.dot;
	}
	yield* A.emote("scream");
	yield* A.emote("flip");
	yield* A.setDir(turn(A.dir, 90));
	A.visible_message(`<span class = 'danger'><B>${A} roundhouse-kicks ${D}!</B></span>`);
	playsound(A.loc, "swing_hit", 50, 1);
	yield* D.adjustBruteLoss(rand(10, 20));
	if ((_T = get_edge_target_turf(A, rt.getDir(f, A, get_step_away(D, A)))) && isturf(_T)) {
		yield* D.Knockdown(20);
		yield* D.throw_at(_T, 3, 2);
	}
	add_logs(A, D, "roundhouse-kicked");
	return f.dot;
}, true);

// wrestling.dm:354
rt.def("/datum/martial_art/wrestling/proc/drop", function* drop(f: Frame, A: Value, D: Value) {
	let surface: Value = null, ST: Value = null, O: Value = null;
	if (!D) {
		return f.dot;
	}
	let falling: Value = 0;
	for (O of each(oview(1, A), T("/obj"))) {
		if (O.density == 1) {
			if (O == A) {
				continue;
			}
			if (O == D) {
				continue;
			}
			if (O.opacity) {
				continue;
			}
			surface = O;
			ST = rt.getStep(f, O, 0);
			break;
		}
	}
	if (surface && ST && isturf(ST)) {
		yield* A.forceMove(ST);
		A.visible_message(`<span class = 'danger'><B>${A} climbs onto ${surface}!</b></span>`);
		A.pixel_y = 10;
		falling = 1;
		yield* sleep(10);
	}
	if (A && D) {
		if (falling == 0 && get_dist(A, D) > 1 || falling == 1 && get_dist(A, D) > 2) {
			A.pixel_y = 0;
			if (falling == 1) {
				A.visible_message("<span class = 'danger'><B>...and dives head-first into the ground, ouch!</b></span>");
				yield* A.adjustBruteLoss(rand(10, 20));
				yield* A.Knockdown(60);
			}
			to_chat(A, `${D} is too far away!`);
			return 0;
		}
		if (!isturf(A.loc) || !isturf(D.loc)) {
			A.pixel_y = 0;
			to_chat(A, `You can't drop onto ${D} from here!`);
			return 0;
		}
		if (A) {
			rt.op(f, "Animate", [2, 8], [null, A, "transform", matrix(90, 5), "time", 1, "loop", 0]);
		}
		yield* sleep(10);
		if (A) {
			rt.op(f, "Animate", [2, 8], [null, A, "transform", null, "time", 1, "loop", 0]);
		}
		yield* A.forceMove(D.loc);
		A.visible_message(`<span class = 'danger'><B>${A} leg-drops ${D}!</B></span>`);
		playsound(A.loc, "swing_hit", 50, 1);
		yield* A.emote("scream");
		if (falling == 1) {
			if (prob(33) || D.stat) {
				yield* D.ex_act(3);
			} else {
				yield* D.adjustBruteLoss(rand(20, 30));
			}
		} else {
			yield* D.adjustBruteLoss(rand(20, 30));
		}
		yield* D.Knockdown(40);
		A.pixel_y = 0;
	} else if (A) {
		A.pixel_y = 0;
	}
	add_logs(A, D, "leg-dropped");
	return f.dot;
}, true);

// wrestling.dm:425
rt.def("/datum/martial_art/wrestling/proc/disarm_act", function* disarm_act(f: Frame, A: Value, D: Value) {
	if (yield* this.check_streak(A, D)) {
		return 1;
	}
	add_logs(A, D, "wrestling-disarmed");
	yield* parent_proc();
	return f.dot;
}, true);

// wrestling.dm:431
rt.def("/datum/martial_art/wrestling/proc/grab_act", function* grab_act(f: Frame, A: Value, D: Value) {
	if (yield* this.check_streak(A, D)) {
		return 1;
	}
	if (A.pulling == D) {
		return 1;
	}
	yield* A.start_pulling(D);
	D.visible_message(`<span class='danger'>${A} gets ${D} in a cinch!</span>`, `<span class='userdanger'>${A} gets ${D} in a cinch!</span>`);
	yield* D.Stun(rand(60, 100));
	add_logs(A, D, "cinched");
	return 1;
}, true);

rt.type(5289, "/obj/item/weapon/storage/belt/champion/wrestling", "/obj/item/weapon/storage/belt/champion", {
	style: null,
	name: "Wrestling Belt",
});

// wrestling.dm:444
rt.def("/obj/item/weapon/storage/belt/champion/wrestling/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.style = (yield* new_(T("/datum/martial_art/wrestling")));
	return f.dot;
}, true);

// wrestling.dm:447
rt.def("/obj/item/weapon/storage/belt/champion/wrestling/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	let H: Value = null;
	if (!rt.istype(user, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	if (slot == slot_belt) {
		H = user;
		yield* this.style.teach(H, 1);
	}
	return f.dot;
}, true);

// wrestling.dm:455
rt.def("/obj/item/weapon/storage/belt/champion/wrestling/proc/dropped", function* dropped(f: Frame, user: Value) {
	let H: Value = null;
	if (!rt.istype(user, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	if ((H = user).get_item_by_slot(slot_belt) == this) {
		yield* this.style.remove(H);
	}
	return f.dot;
}, true);
