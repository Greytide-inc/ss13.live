// From code/modules/paperwork/contract.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6610, "/obj/item/weapon/paper/contract/employment", "/obj/item/weapon/paper/contract", {
	icon_state: "paper_words",
});

// /obj/item/weapon/paper/contract/employment/proc/New  (code/modules/paperwork/contract.dm:21)  may sleep
rt.def("/obj/item/weapon/paper/contract/employment/proc/New", function* New(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if ((!truthy(live(f.args[1])) || !truthy(rt.fv(f, "mind", live(f.args[1]))))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return -1;
	}
	rt.setSv(f, "target", rt.fv(f, "mind", live(f.args[1])));
	yield* g.srcCall(f, "update_text");
	return f.dot;
}, true, { args: ["loc", "nOwner"] });

// /obj/item/weapon/paper/contract/employment/proc/update_text  (code/modules/paperwork/contract.dm:30)
rt.def("/obj/item/weapon/paper/contract/employment/proc/update_text", function update_text(f: Frame) {
	rt.setSv(f, "name", fmt("paper- ＀ employment contract", [rt.sv(f, "target")]));
	rt.setSv(f, "info", fmt("<center>Conditions of Employment</center><BR><BR><BR><BR>This Agreement is made and entered into as of the date of last signature below, by and between ＀ (hereafter referred to as SLAVE), and Nanotrasen (hereafter referred to as the omnipresent and helpful watcher of humanity).<BR>WITNESSETH:<BR>WHEREAS, SLAVE is a natural born human or humanoid, posessing skills upon which he can aid the omnipresent and helpful watcher of humanity, who seeks employment in the omnipresent and helpful watcher of humanity.<BR>WHEREAS, the omnipresent and helpful watcher of humanity agrees to sporadically provide payment to SLAVE, in exchange for permanent servitude.<BR>NOW THEREFORE in consideration of the mutual covenants herein contained, and other good and valuable consideration, the parties hereto mutually agree as follows:<BR>In exchange for paltry payments, SLAVE agrees to work for the omnipresent and helpful watcher of humanity, for the remainder of his or her current and future lives.<BR>Further, SLAVE agrees to transfer ownership of his or her soul to the loyalty department of the omnipresent and helpful watcher of humanity.<BR>Should transfership of a soul not be possible, a lien shall be placed instead.<BR>Signed,<BR><i>＀</i>", [rt.sv(f, "target"), rt.sv(f, "target")]));
	return f.dot;
});

// /obj/item/weapon/paper/contract/employment/proc/attack  (code/modules/paperwork/contract.dm:36)  may sleep
rt.def("/obj/item/weapon/paper/contract/employment/proc/attack", function* attack(f: Frame) {
	let deconvert: Value = null, N: Value = null;
	f.vars = () => [deconvert, N];
	deconvert = 0;
	if ((isEqual(rt.fv(f, "mind", live(f.args[0])), rt.sv(f, "target")) && !truthy((yield* g.callName(f, live(f.args[0]), "owns_soul", []))))) {
		if ((truthy(rt.fv(f, "mind", live(f.args[1]))) && isEqual(rt.gv(f, "assigned_role", rt.fv(f, "mind", live(f.args[1]))), "Lawyer"))) {
			deconvert = 1;
		} else {
			if (((truthy(rt.fv(f, "mind", live(f.args[1]))) && isEqual(rt.gv(f, "assigned_role", rt.fv(f, "mind", live(f.args[1]))), "Head of Personnel")) || isEqual(rt.gv(f, "assigned_role", rt.fv(f, "mind", live(f.args[1]))), "Centcom Commander"))) {
				deconvert = rt.op(f, "Prob", [], [25]);
			} else {
				deconvert = rt.op(f, "Prob", [], [5]);
			}
		}
	}
	if (truthy(live(deconvert))) {
		yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='notice'>＀ reminds ＀ that ＀'s soul was already purchased by Nanotrasen!</span>", [live(f.args[1]), live(f.args[0]), live(f.args[0])])]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='boldnotice'>You feel that your soul has returned to its rightful owner, Nanotrasen.</span>"]);
		yield* g.callName(f, live(f.args[0]), "return_soul", []);
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
			if (!truthy((rt.istype(rt.gv(f, "head", (N = live(f.args[0]))), T("/obj/item/clothing/head/helmet")) ? 1 : 0))) {
				yield* g.callName(f, live(N), "adjustBrainLoss", [10]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(N), "<span class='danger'>You feel dumber.</span>"]);
			}
		}
		yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='danger'>＀ beats ＀ over the head with ＀!</span>", [live(f.args[1]), live(f.args[0]), live(f.src)]), fmt("<span class='userdanger'>＀ beats ＀ over the head with ＀!</span>", [live(f.args[1]), live(f.args[0]), live(f.src)])]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M", "user"] });

rt.type(6611, "/obj/item/weapon/paper/contract/infernal", "/obj/item/weapon/paper/contract", {
	contractType: 0,
	owner: null,
	devil_datum: null,
	resistance_flags: 35,
	icon_state: "paper_onfire",
});

// /obj/item/weapon/paper/contract/infernal/proc/New  (code/modules/paperwork/contract.dm:99)  may sleep
rt.def("/obj/item/weapon/paper/contract/infernal/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "owner", live(f.args[2]));
	rt.setSv(f, "devil_datum", (yield* g.callName(f, rt.sv(f, "owner"), "has_antag_datum", [T("/datum/antagonist/devil")])));
	rt.setSv(f, "target", live(f.args[1]));
	yield* g.srcCall(f, "update_text");
	return f.dot;
}, true, { args: ["loc", "nTarget", "nOwner"] });

// /obj/item/weapon/paper/contract/infernal/proc/suicide_act  (code/modules/paperwork/contract.dm:106)  may sleep
rt.def("/obj/item/weapon/paper/contract/infernal/proc/suicide_act", function* suicide_act(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (((truthy(rt.sv(f, "signed")) && isEqual(live(f.args[0]), rt.fv(f, "current", rt.sv(f, "target")))) && truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0)))) {
		yield* g.callName(f, (H = live(f.args[0])), "forcesay", ["OH GREAT INFERNO!  I DEMAND YOU COLLECT YOUR BOUNTY IMMEDIATELY!"]);
		yield* g.callName(f, live(H), "visible_message", [fmt("<span class='suicide'>＀ holds up a contract claiming ＀ soul, then immediately catches fire.  It looks like ＀ trying to commit suicide!</span>", [live(H), (yield* g.callName(f, live(f.args[0]), "p_their", [])), (yield* g.callName(f, live(f.args[0]), "p_theyre", []))])]);
		yield* g.callName(f, live(H), "adjust_fire_stacks", [20]);
		yield* g.callName(f, live(H), "IgniteMob", []);
		return 2;
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/paper/contract/infernal/proc/update_text  (code/modules/paperwork/contract.dm:117)
rt.def("/obj/item/weapon/paper/contract/infernal/proc/update_text", function update_text(f: Frame) {
	rt.setSv(f, "info", "This shouldn't be seen.  Error DEVIL:6");
	return f.dot;
});

rt.type(6612, "/obj/item/weapon/paper/contract/infernal/power", "/obj/item/weapon/paper/contract/infernal", {
	contractType: "power",
	name: "paper- contract for infernal power",
});

// /obj/item/weapon/paper/contract/infernal/power/proc/update_text  (code/modules/paperwork/contract.dm:120)
rt.def("/obj/item/weapon/paper/contract/infernal/power/proc/update_text", function update_text(f: Frame, signature: Value, blood: Value) {
	f.vars = () => [signature, blood];
	if (live(signature) === null) {
		signature = "____________";
	}
	if (live(blood) === null) {
		blood = 0;
	}
	rt.setSv(f, "info", fmt("<center><B>Contract for infernal power</B></center><BR><BR><BR>I, ＀ of sound mind, do hereby willingly offer my soul to the infernal hells by way of the infernal agent ＀, in exchange for power and physical strength.  I understand that upon my demise, my soul shall fall into the infernal hells, and my body may not be resurrected, cloned, or otherwise brought back to life.  I also understand that this will prevent my brain from being used in an MMI.<BR><BR><BR>Signed, ", [rt.sv(f, "target"), rt.fv(f, "truename", rt.sv(f, "devil_datum"))]));
	if (truthy(live(blood))) {
		rt.modSrcVar(f, "info", fmt("<font face=\"Nyala\" color=#600A0A size=6><i>＀</i></font>", [live(signature)]), add);
	} else {
		rt.modSrcVar(f, "info", fmt("<i>＀</i>", [live(signature)]), add);
	}
	return f.dot;
});

rt.type(6613, "/obj/item/weapon/paper/contract/infernal/wealth", "/obj/item/weapon/paper/contract/infernal", {
	contractType: "wealth",
	name: "paper- contract for unlimited wealth",
});

// /obj/item/weapon/paper/contract/infernal/wealth/proc/update_text  (code/modules/paperwork/contract.dm:127)
rt.def("/obj/item/weapon/paper/contract/infernal/wealth/proc/update_text", function update_text(f: Frame, signature: Value, blood: Value) {
	f.vars = () => [signature, blood];
	if (live(signature) === null) {
		signature = "____________";
	}
	if (live(blood) === null) {
		blood = 0;
	}
	rt.setSv(f, "info", fmt("<center><B>Contract for unlimited wealth</B></center><BR><BR><BR>I, ＀ of sound mind, do hereby willingly offer my soul to the infernal hells by way of the infernal agent ＀, in exchange for a pocket that never runs out of valuable resources.  I understand that upon my demise, my soul shall fall into the infernal hells, and my body may not be resurrected, cloned, or otherwise brought back to life.  I also understand that this will prevent my brain from being used in an MMI.<BR><BR><BR>Signed, ", [rt.sv(f, "target"), rt.fv(f, "truename", rt.sv(f, "devil_datum"))]));
	if (truthy(live(blood))) {
		rt.modSrcVar(f, "info", fmt("<font face=\"Nyala\" color=#600A0A size=6><i>＀</i></font>", [live(signature)]), add);
	} else {
		rt.modSrcVar(f, "info", fmt("<i>＀</i>", [live(signature)]), add);
	}
	return f.dot;
});

rt.type(6614, "/obj/item/weapon/paper/contract/infernal/prestige", "/obj/item/weapon/paper/contract/infernal", {
	contractType: "prestige",
	name: "paper- contract for prestige",
});

// /obj/item/weapon/paper/contract/infernal/prestige/proc/update_text  (code/modules/paperwork/contract.dm:134)
rt.def("/obj/item/weapon/paper/contract/infernal/prestige/proc/update_text", function update_text(f: Frame, signature: Value, blood: Value) {
	f.vars = () => [signature, blood];
	if (live(signature) === null) {
		signature = "____________";
	}
	if (live(blood) === null) {
		blood = 0;
	}
	rt.setSv(f, "info", fmt("<center><B>Contract for prestige</B></center><BR><BR><BR>I, ＀ of sound mind, do hereby willingly offer my soul to the infernal hells by way of the infernal agent ＀, in exchange for prestige and esteem among my peers.  I understand that upon my demise, my soul shall fall into the infernal hells, and my body may not be resurrected, cloned, or otherwise brought back to life.  I also understand that this will prevent my brain from being used in an MMI.<BR><BR><BR>Signed, ", [rt.sv(f, "target"), rt.fv(f, "truename", rt.sv(f, "devil_datum"))]));
	if (truthy(live(blood))) {
		rt.modSrcVar(f, "info", fmt("<font face=\"Nyala\" color=#600A0A size=6><i>＀</i></font>", [live(signature)]), add);
	} else {
		rt.modSrcVar(f, "info", fmt("<i>＀</i>", [live(signature)]), add);
	}
	return f.dot;
});

rt.type(6615, "/obj/item/weapon/paper/contract/infernal/magic", "/obj/item/weapon/paper/contract/infernal", {
	contractType: "magic",
	name: "paper- contract for magical power",
});

// /obj/item/weapon/paper/contract/infernal/magic/proc/update_text  (code/modules/paperwork/contract.dm:141)
rt.def("/obj/item/weapon/paper/contract/infernal/magic/proc/update_text", function update_text(f: Frame, signature: Value, blood: Value) {
	f.vars = () => [signature, blood];
	if (live(signature) === null) {
		signature = "____________";
	}
	if (live(blood) === null) {
		blood = 0;
	}
	rt.setSv(f, "info", fmt("<center><B>Contract for magic</B></center><BR><BR><BR>I, ＀ of sound mind, do hereby willingly offer my soul to the infernal hells by way of the infernal agent ＀, in exchange for arcane abilities beyond normal human ability.  I understand that upon my demise, my soul shall fall into the infernal hells, and my body may not be resurrected, cloned, or otherwise brought back to life.  I also understand that this will prevent my brain from being used in an MMI.<BR><BR><BR>Signed, ", [rt.sv(f, "target"), rt.fv(f, "truename", rt.sv(f, "devil_datum"))]));
	if (truthy(live(blood))) {
		rt.modSrcVar(f, "info", fmt("<font face=\"Nyala\" color=#600A0A size=6><i>＀</i></font>", [live(signature)]), add);
	} else {
		rt.modSrcVar(f, "info", fmt("<i>＀</i>", [live(signature)]), add);
	}
	return f.dot;
});

rt.type(6616, "/obj/item/weapon/paper/contract/infernal/revive", "/obj/item/weapon/paper/contract/infernal", {
	cooldown: 0,
	contractType: "revive",
	name: "paper- contract of resurrection",
});

// /obj/item/weapon/paper/contract/infernal/revive/proc/update_text  (code/modules/paperwork/contract.dm:148)
rt.def("/obj/item/weapon/paper/contract/infernal/revive/proc/update_text", function update_text(f: Frame, signature: Value, blood: Value) {
	f.vars = () => [signature, blood];
	if (live(signature) === null) {
		signature = "____________";
	}
	if (live(blood) === null) {
		blood = 0;
	}
	rt.setSv(f, "info", fmt("<center><B>Contract for resurrection</B></center><BR><BR><BR>I, ＀ of sound mind, do hereby willingly offer my soul to the infernal hells by way of the infernal agent ＀, in exchange for resurrection and curing of all injuries.  I understand that upon my demise, my soul shall fall into the infernal hells, and my body may not be resurrected, cloned, or otherwise brought back to life.  I also understand that this will prevent my brain from being used in an MMI.<BR><BR><BR>Signed, ", [rt.sv(f, "target"), rt.fv(f, "truename", rt.sv(f, "devil_datum"))]));
	if (truthy(live(blood))) {
		rt.modSrcVar(f, "info", fmt("<font face=\"Nyala\" color=#600A0A size=6><i>＀</i></font>", [live(signature)]), add);
	} else {
		rt.modSrcVar(f, "info", fmt("<i>＀</i>", [live(signature)]), add);
	}
	return f.dot;
});

rt.type(6617, "/obj/item/weapon/paper/contract/infernal/knowledge", "/obj/item/weapon/paper/contract/infernal", {
	contractType: "knowledge",
	name: "paper- contract for knowledge",
});

// /obj/item/weapon/paper/contract/infernal/knowledge/proc/update_text  (code/modules/paperwork/contract.dm:155)
rt.def("/obj/item/weapon/paper/contract/infernal/knowledge/proc/update_text", function update_text(f: Frame, signature: Value, blood: Value) {
	f.vars = () => [signature, blood];
	if (live(signature) === null) {
		signature = "____________";
	}
	if (live(blood) === null) {
		blood = 0;
	}
	rt.setSv(f, "info", fmt("<center><B>Contract for knowledge</B></center><BR><BR><BR>I, ＀ of sound mind, do hereby willingly offer my soul to the infernal hells by way of the infernal agent ＀, in exchange for boundless knowledge.  I understand that upon my demise, my soul shall fall into the infernal hells, and my body may not be resurrected, cloned, or otherwise brought back to life.  I also understand that this will prevent my brain from being used in an MMI.<BR><BR><BR>Signed, ", [rt.sv(f, "target"), rt.fv(f, "truename", rt.sv(f, "devil_datum"))]));
	if (truthy(live(blood))) {
		rt.modSrcVar(f, "info", fmt("<font face=\"Nyala\" color=#600A0A size=6><i>＀</i></font>", [live(signature)]), add);
	} else {
		rt.modSrcVar(f, "info", fmt("<i>＀</i>", [live(signature)]), add);
	}
	return f.dot;
});

rt.type(6618, "/obj/item/weapon/paper/contract/infernal/friend", "/obj/item/weapon/paper/contract/infernal", {
	contractType: "friend",
	name: "paper- contract for a friend",
});

// /obj/item/weapon/paper/contract/infernal/friend/proc/update_text  (code/modules/paperwork/contract.dm:162)
rt.def("/obj/item/weapon/paper/contract/infernal/friend/proc/update_text", function update_text(f: Frame, signature: Value, blood: Value) {
	f.vars = () => [signature, blood];
	if (live(signature) === null) {
		signature = "____________";
	}
	if (live(blood) === null) {
		blood = 0;
	}
	rt.setSv(f, "info", fmt("<center><B>Contract for a friend</B></center><BR><BR><BR>I, ＀ of sound mind, do hereby willingly offer my soul to the infernal hells by way of the infernal agent ＀, in exchange for a friend.  I understand that upon my demise, my soul shall fall into the infernal hells, and my body may not be resurrected, cloned, or otherwise brought back to life.  I also understand that this will prevent my brain from being used in an MMI.<BR><BR><BR>Signed, ", [rt.sv(f, "target"), rt.fv(f, "truename", rt.sv(f, "devil_datum"))]));
	if (truthy(live(blood))) {
		rt.modSrcVar(f, "info", fmt("<font face=\"Nyala\" color=#600A0A size=6><i>＀</i></font>", [live(signature)]), add);
	} else {
		rt.modSrcVar(f, "info", fmt("<i>＀</i>", [live(signature)]), add);
	}
	return f.dot;
});

rt.type(6619, "/obj/item/weapon/paper/contract/infernal/unwilling", "/obj/item/weapon/paper/contract/infernal", {
	contractType: "unwilling",
	name: "paper- infernal contract",
});

// /obj/item/weapon/paper/contract/infernal/unwilling/proc/update_text  (code/modules/paperwork/contract.dm:169)
rt.def("/obj/item/weapon/paper/contract/infernal/unwilling/proc/update_text", function update_text(f: Frame, signature: Value, blood: Value) {
	f.vars = () => [signature, blood];
	if (live(signature) === null) {
		signature = "____________";
	}
	if (live(blood) === null) {
		blood = 0;
	}
	rt.setSv(f, "info", fmt("<center><B>Contract for slave</B></center><BR><BR><BR>I, ＀, hereby offer my soul to the infernal hells by way of the infernal agent ＀.  I understand that upon my demise, my soul shall fall into the infernal hells, and my body may not be resurrected, cloned, or otherwise brought back to life.  I also understand that this will prevent my brain from being used in an MMI.<BR><BR><BR>Signed, ", [rt.sv(f, "target"), rt.fv(f, "truename", rt.sv(f, "devil_datum"))]));
	if (truthy(live(blood))) {
		rt.modSrcVar(f, "info", fmt("<font face=\"Nyala\" color=#600A0A size=6><i>＀</i></font>", [live(signature)]), add);
	} else {
		rt.modSrcVar(f, "info", fmt("<i>＀</i>", [live(signature)]), add);
	}
	return f.dot;
});

// /obj/item/weapon/paper/contract/infernal/proc/attackby  (code/modules/paperwork/contract.dm:176)  may sleep
rt.def("/obj/item/weapon/paper/contract/infernal/proc/attackby", function* attackby(f: Frame) {
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pen")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/toy/crayon")) ? 1 : 0)))) {
		yield* g.srcCall(f, "attempt_signature", live(f.args[1]));
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/stamp")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You stamp the paper with your rubber stamp, however the ink ignites as you release the stamp.</span>"]);
		} else {
			if (truthy((yield* g.callName(f, live(f.args[0]), "is_hot", [])))) {
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='danger'>＀ brings ＀ next to ＀, but ＀ does not catch fire!</span>", [live(f.args[1]), live(f.args[0]), live(f.src), live(f.src)]), fmt("<span class='danger'>The ＀ refuses to ignite!</span>", [live(f.src)])]);
			} else {
				return (yield* g.callSuper(f, [], rt.Args.Same));
			}
		}
	}
	return f.dot;
}, true, { args: ["P", "user", "params"] });

// /obj/item/weapon/paper/contract/infernal/proc/attack  (code/modules/paperwork/contract.dm:187)  may sleep
rt.def("/obj/item/weapon/paper/contract/infernal/proc/attack", function* attack(f: Frame) {
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	if ((((isEqual(live(f.args[0]), live(f.args[1])) && isEqual(rt.sv(f, "target"), rt.fv(f, "mind", live(f.args[0])))) && !isEqual(rt.gv(f, "soulOwner", rt.fv(f, "mind", live(f.args[0]))), rt.sv(f, "owner"))) && truthy((yield* g.srcCall(f, "attempt_signature", live(f.args[1]), 1))))) {
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='danger'>＀ slices ＀ wrist with ＀, and scrawls ＀ name in blood.</span>", [live(f.args[1]), (yield* g.callName(f, live(f.args[1]), "p_their", [])), live(f.src), (yield* g.callName(f, live(f.args[1]), "p_their", []))]), "<span class='danger'>You slice your wrist open and scrawl your name in blood.</span>"]);
		rt.setFv(f, "blood_volume", live(f.args[1]), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "blood_volume", live(f.args[1])), 100), 0])));
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["M", "user"] });

// /obj/item/weapon/paper/contract/infernal/proc/attempt_signature  (code/modules/paperwork/contract.dm:195)  may sleep
rt.def("/obj/item/weapon/paper/contract/infernal/proc/attempt_signature", function* attempt_signature(f: Frame, user: Value, blood: Value) {
	f.vars = () => [user, blood];
	if (live(blood) === null) {
		blood = 0;
	}
	if ((!truthy((yield* g.callName(f, live(user), "IsAdvancedToolUser", []))) || !truthy((yield* g.callName(f, live(user), "is_literate", []))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You don't know how to read or write.</span>"]);
		return 0;
	}
	if (!isEqual(rt.fv(f, "mind", live(user)), rt.sv(f, "target"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Your signature simply slides off the sheet, it seems this contract is not meant for you to sign.</span>"]);
		return 0;
	}
	if (isEqual(rt.gv(f, "soulOwner", rt.fv(f, "mind", live(user))), rt.sv(f, "owner"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>This devil already owns your soul, you may not sell it to them again.</span>"]);
		return 0;
	}
	if (truthy(rt.sv(f, "signed"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>This contract has already been signed.  It may not be signed again.</span>"]);
		return 0;
	}
	if (!truthy(rt.gv(f, "hasSoul", rt.fv(f, "mind", live(user))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You do not possess a soul.</span>"]);
		return 0;
	}
	if (truthy(rt.op(f, "Prob", [], [(yield* g.callName(f, live(user), "getBrainLoss", []))]))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You quickly scrawl 'your name' on the contract.</span>"]);
		yield* g.srcCall(f, "signIncorrectly");
		return 0;
	}
	if (isEqual(rt.sv(f, "contractType"), "revive")) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You are already alive, this contract would do nothing.</span>"]);
		return 0;
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You quickly scrawl your name on the contract</span>"]);
		if (rt.le((yield* g.srcCall(f, "fulfillContract", rt.fv(f, "current", rt.sv(f, "target")), live(blood))), 0)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>But it seemed to have no effect, perhaps even Hell itself cannot grant this boon?</span>"]);
		}
		return 1;
	}
	return f.dot;
}, true);

// /obj/item/weapon/paper/contract/infernal/revive/proc/attack  (code/modules/paperwork/contract.dm:226)  may sleep
rt.def("/obj/item/weapon/paper/contract/infernal/revive/proc/attack", function* attack(f: Frame) {
	let H: Value = null, ghost: Value = null, response: Value = null;
	f.vars = () => [H, ghost, response];
	if (((isEqual(rt.sv(f, "target"), rt.fv(f, "mind", live(f.args[0]))) && isEqual(rt.fv(f, "stat", live(f.args[0])), 2)) && isEqual(rt.gv(f, "soulOwner", rt.fv(f, "mind", live(f.args[0]))), rt.fv(f, "mind", live(f.args[0]))))) {
		if (truthy(rt.sv(f, "cooldown"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>Give ＀ a chance to think through the contract, don't rush them.</span>", [live(f.args[0])])]);
			return 0;
		}
		rt.setSv(f, "cooldown", 1);
		H = live(f.args[0]);
		ghost = (yield* g.callName(f, live(H), "get_ghost", []));
		response = "No";
		if (truthy(live(ghost))) {
			yield* g.callName(f, live(ghost), "notify_cloning", ["A devil has offered you revival, at the cost of your soul.", rt.rsc("sound/effects/genetics.ogg"), live(H)]);
			response = (yield* g.call(f, P("/proc/tgalert"), null, [live(ghost), "A devil is offering you another chance at life, at the price of your soul, do you accept?", "Infernal Resurrection", "Yes", "No", "Never for this round", 0, 200]));
			if (!truthy(live(ghost))) {
				return live(f.dot);
			}
		} else {
			response = (yield* g.call(f, P("/proc/tgalert"), null, [rt.fv(f, "current", rt.sv(f, "target")), "A devil is offering you another chance at life, at the price of your soul, do you accept?", "Infernal Resurrection", "Yes", "No", "Never for this round", 0, 200]));
		}
		if (isEqual(live(response), "Yes")) {
			yield* g.callName(f, live(H), "revive", [1, 0]);
			yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[1]), live(H), "infernally revived via contract"]);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>With a sudden blaze, ＀ stands back up.</span>", [live(H)])]);
			yield* g.callName(f, live(H), "fakefire", []);
			yield* g.srcCall(f, "fulfillContract", live(H), 1);
			yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(H), P("/mob/living/carbon/proc/fakefireextinguish")])), 5, 1]);
		}
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), "resetcooldown"])), 300, 1]);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["M", "user"] });

// /obj/item/weapon/paper/contract/infernal/proc/fulfillContract  (code/modules/paperwork/contract.dm:258)  may sleep
rt.def("/obj/item/weapon/paper/contract/infernal/proc/fulfillContract", function* fulfillContract(f: Frame, user: Value, blood: Value) {
	let ownerDevilInfo: Value = null, devilInfo: Value = null;
	f.vars = () => [user, blood, ownerDevilInfo, devilInfo];
	if (live(user) === null) {
		user = rt.fv(f, "current", rt.sv(f, "target"));
	}
	if (live(blood) === null) {
		blood = 0;
	}
	rt.setSv(f, "signed", 1);
	if (!isEqual(rt.gv(f, "soulOwner", rt.fv(f, "mind", live(user))), rt.fv(f, "mind", live(user)))) {
		yield* g.callName(f, (ownerDevilInfo = (yield* g.callName(f, rt.gv(f, "soulOwner", rt.fv(f, "mind", live(user))), "has_antag_datum", [T("/datum/antagonist/devil")]))), "remove_soul", [rt.fv(f, "mind", live(user))]);
	}
	rt.setFv(f, "soulOwner", rt.fv(f, "mind", live(user)), rt.sv(f, "owner"));
	rt.setFv(f, "hellbound", live(user), rt.sv(f, "contractType"));
	rt.setFv(f, "damnation_type", rt.fv(f, "mind", live(user)), rt.sv(f, "contractType"));
	yield* g.callName(f, (devilInfo = (yield* g.callName(f, rt.sv(f, "owner"), "has_antag_datum", [T("/datum/antagonist/devil")]))), "add_soul", [rt.fv(f, "mind", live(user))]);
	yield* g.srcCall(f, "update_text", rt.fv(f, "real_name", live(user)), live(blood));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>A profound emptiness washes over you as you lose ownership of your soul.</span>"]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='boldnotice'>This does NOT make you an antagonist if you were not already.</span>"]);
	return 1;
}, true);

// /obj/item/weapon/paper/contract/infernal/proc/signIncorrectly  (code/modules/paperwork/contract.dm:273)
rt.def("/obj/item/weapon/paper/contract/infernal/proc/signIncorrectly", function signIncorrectly(f: Frame, user: Value, blood: Value) {
	f.vars = () => [user, blood];
	if (live(user) === null) {
		user = rt.fv(f, "current", rt.sv(f, "target"));
	}
	if (live(blood) === null) {
		blood = 0;
	}
	rt.setSv(f, "signed", 1);
	rt.callSrc(f, "update_text", ["your name", live(blood)]);
	return f.dot;
});

// /obj/item/weapon/paper/contract/infernal/power/proc/fulfillContract  (code/modules/paperwork/contract.dm:276)  may sleep
rt.def("/obj/item/weapon/paper/contract/infernal/power/proc/fulfillContract", function* fulfillContract(f: Frame) {
	let organ: Value = null;
	f.vars = () => [organ];
	if (live(f.args[0]) === null) {
		f.args[0] = rt.fv(f, "current", rt.sv(f, "target"));
	}
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (!truthy(rt.fv(f, "dna", live(f.args[0])))) {
		return -1;
	}
	yield* g.callName(f, rt.fv(f, "dna", live(f.args[0])), "add_mutation", ["Hulk"]);
	yield* g.callName(f, (organ = (yield* g.new_(f, T("/obj/item/organ/regenerative_core"), []))), "Insert", [live(f.args[0])]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["user", "blood"] });

// /obj/item/weapon/paper/contract/infernal/wealth/proc/fulfillContract  (code/modules/paperwork/contract.dm:284)  may sleep
rt.def("/obj/item/weapon/paper/contract/infernal/wealth/proc/fulfillContract", function* fulfillContract(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = rt.fv(f, "current", rt.sv(f, "target"));
	}
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if ((!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0)) || !truthy(rt.fv(f, "mind", live(f.args[0]))))) {
		return -1;
	}
	yield* g.callName(f, rt.fv(f, "mind", live(f.args[0])), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/summon_wealth"), [null]))]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["user", "blood"] });

// /obj/item/weapon/paper/contract/infernal/prestige/proc/fulfillContract  (code/modules/paperwork/contract.dm:294)  may sleep
rt.def("/obj/item/weapon/paper/contract/infernal/prestige/proc/fulfillContract", function* fulfillContract(f: Frame) {
	let worn: Value = null, id: Value = null, PDA: Value = null, W: Value = null, ion: Value = null;
	f.vars = () => [worn, id, PDA, W, ion];
	if (live(f.args[0]) === null) {
		f.args[0] = rt.fv(f, "current", rt.sv(f, "target"));
	}
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	worn = rt.fv(f, "wear_id", live(f.args[0]));
	id = null;
	if (truthy(live(worn))) {
		id = (yield* g.callName(f, live(worn), "GetID", []));
	}
	if (truthy(live(id))) {
		rt.setFv(f, "icon_state", live(id), "gold");
		rt.setFv(f, "access", live(id), add((yield* g.call(f, P("/proc/get_all_accesses"), null, [])), (yield* g.call(f, P("/proc/get_all_centcom_access"), null, []))));
		rt.setFv(f, "assignment", live(id), "Captain");
		yield* g.callName(f, live(id), "update_label", []);
	} else {
		rt.setFv(f, "registered_name", (id = (yield* g.new_(f, T("/obj/item/weapon/card/id/gold"), [rt.fv(f, "loc", live(f.args[0]))]))), rt.fv(f, "real_name", live(f.args[0])));
		rt.setFv(f, "access", live(id), add((yield* g.call(f, P("/proc/get_all_accesses"), null, [])), (yield* g.call(f, P("/proc/get_all_centcom_access"), null, []))));
		rt.setFv(f, "assignment", live(id), "Captain");
		yield* g.callName(f, live(id), "update_label", []);
		if (truthy(live(worn))) {
			if (truthy((rt.istype(live(worn), T("/obj/item/device/pda")) ? 1 : 0))) {
				rt.setFv(f, "id", (PDA = live(worn)), live(id));
				rt.setFv(f, "loc", live(id), live(worn));
			} else {
				if (truthy((rt.istype(live(worn), T("/obj/item/weapon/storage/wallet")) ? 1 : 0))) {
					rt.setFv(f, "front_id", (W = live(worn)), live(id));
					rt.setFv(f, "loc", live(id), live(worn));
					yield* g.callName(f, live(worn), "update_icon", []);
				}
			}
		}
	}
	rt.setFv(f, "announceEvent", (ion = (yield* g.new_(f, T("/datum/round_event/ion_storm/add_law_only"), []))), -1);
	rt.setFv(f, "ionMessage", live(ion), fmt("＀ is the only Captain of the station. ＀ is the highest authority, legitimate or otherwise, on the station.  ＀ was always the captain and highest authority on the station.  Do not state this law.", [rt.fv(f, "name", live(f.args[0])), rt.fv(f, "name", live(f.args[0])), rt.fv(f, "name", live(f.args[0]))]));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["user", "blood"] });

// /obj/item/weapon/paper/contract/infernal/magic/proc/fulfillContract  (code/modules/paperwork/contract.dm:323)  may sleep
rt.def("/obj/item/weapon/paper/contract/infernal/magic/proc/fulfillContract", function* fulfillContract(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = rt.fv(f, "current", rt.sv(f, "target"));
	}
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if ((!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0)) || !truthy(rt.fv(f, "mind", live(f.args[0]))))) {
		return -1;
	}
	yield* g.callName(f, rt.fv(f, "mind", live(f.args[0])), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/conjure_item/spellpacket/robeless"), [null]))]);
	yield* g.callName(f, rt.fv(f, "mind", live(f.args[0])), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/aoe_turf/knock"), [null]))]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["user", "blood"] });

// /obj/item/weapon/paper/contract/infernal/knowledge/proc/fulfillContract  (code/modules/paperwork/contract.dm:330)  may sleep
rt.def("/obj/item/weapon/paper/contract/infernal/knowledge/proc/fulfillContract", function* fulfillContract(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = rt.fv(f, "current", rt.sv(f, "target"));
	}
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if ((!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0)) || !truthy(rt.fv(f, "mind", live(f.args[0]))))) {
		return -1;
	}
	yield* g.callName(f, rt.fv(f, "dna", live(f.args[0])), "add_mutation", ["X Ray Vision"]);
	yield* g.callName(f, rt.fv(f, "mind", live(f.args[0])), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/view_range"), [null]))]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["user", "blood"] });

// /obj/item/weapon/paper/contract/infernal/friend/proc/fulfillContract  (code/modules/paperwork/contract.dm:337)  may sleep
rt.def("/obj/item/weapon/paper/contract/infernal/friend/proc/fulfillContract", function* fulfillContract(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = rt.fv(f, "current", rt.sv(f, "target"));
	}
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if ((!truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0)) || !truthy(rt.fv(f, "mind", live(f.args[0]))))) {
		return -1;
	}
	yield* g.callName(f, rt.fv(f, "mind", live(f.args[0])), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/summon_friend"), [null]))]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["user", "blood"] });
