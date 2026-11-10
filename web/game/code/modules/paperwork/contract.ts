// Based on /tg/station's code/modules/paperwork/contract.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(6610, "/obj/item/weapon/paper/contract/employment", "/obj/item/weapon/paper/contract", {
	icon_state: "paper_words",
});

// contract.dm:21
rt.def("/obj/item/weapon/paper/contract/employment/proc/New", function* New(f: Frame, loc: Value, nOwner: Value) {
	f.dot = (yield* parent_proc());
	if (!nOwner || !nOwner.mind) {
		yield* qdel(this);
		return -1;
	}
	this.target = nOwner.mind;
	this.update_text();
	return f.dot;
}, true);

// contract.dm:30
rt.def("/obj/item/weapon/paper/contract/employment/proc/update_text", function update_text(f: Frame) {
	this.name = `paper- ${this.target} employment contract`;
	this.info = `<center>Conditions of Employment</center><BR><BR><BR><BR>This Agreement is made and entered into as of the date of last signature below, by and between ${this.target} (hereafter referred to as SLAVE), and Nanotrasen (hereafter referred to as the omnipresent and helpful watcher of humanity).<BR>WITNESSETH:<BR>WHEREAS, SLAVE is a natural born human or humanoid, posessing skills upon which he can aid the omnipresent and helpful watcher of humanity, who seeks employment in the omnipresent and helpful watcher of humanity.<BR>WHEREAS, the omnipresent and helpful watcher of humanity agrees to sporadically provide payment to SLAVE, in exchange for permanent servitude.<BR>NOW THEREFORE in consideration of the mutual covenants herein contained, and other good and valuable consideration, the parties hereto mutually agree as follows:<BR>In exchange for paltry payments, SLAVE agrees to work for the omnipresent and helpful watcher of humanity, for the remainder of his or her current and future lives.<BR>Further, SLAVE agrees to transfer ownership of his or her soul to the loyalty department of the omnipresent and helpful watcher of humanity.<BR>Should transfership of a soul not be possible, a lien shall be placed instead.<BR>Signed,<BR><i>${this.target}</i>`;
	return f.dot;
});

// contract.dm:36
rt.def("/obj/item/weapon/paper/contract/employment/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let N: Value = null;
	let deconvert: Value = 0;
	if (M.mind == this.target && !M.owns_soul()) {
		if (user.mind && user.mind.assigned_role == "Lawyer") {
			deconvert = 1;
		} else if (user.mind && user.mind.assigned_role == "Head of Personnel" || user.mind.assigned_role == "Centcom Commander") {
			deconvert = prob(25);
		} else {
			deconvert = prob(5);
		}
	}
	if (deconvert) {
		M.visible_message(`<span class='notice'>${user} reminds ${M} that ${M}'s soul was already purchased by Nanotrasen!</span>`);
		to_chat(M, "<span class='boldnotice'>You feel that your soul has returned to its rightful owner, Nanotrasen.</span>");
		yield* M.return_soul();
	} else {
		if (rt.istype(M, T("/mob/living/carbon/human"))) {
			if (!rt.istype((N = M).head, T("/obj/item/clothing/head/helmet"))) {
				yield* N.adjustBrainLoss(10);
				to_chat(N, "<span class='danger'>You feel dumber.</span>");
			}
		}
		M.visible_message(`<span class='danger'>${user} beats ${M} over the head with ${this}!</span>`, `<span class='userdanger'>${user} beats ${M} over the head with ${this}!</span>`);
	}
	return (yield* parent_proc());
}, true);

rt.type(6611, "/obj/item/weapon/paper/contract/infernal", "/obj/item/weapon/paper/contract", {
	contractType: 0,
	owner: null,
	devil_datum: null,
	resistance_flags: 35,
	icon_state: "paper_onfire",
});

// contract.dm:99
rt.def("/obj/item/weapon/paper/contract/infernal/proc/New", function* New(f: Frame, loc: Value, nTarget: Value, nOwner: Value) {
	yield* parent_proc();
	this.owner = nOwner;
	this.devil_datum = this.owner.has_antag_datum(T("/datum/antagonist/devil"));
	this.target = nTarget;
	this.update_text();
	return f.dot;
}, true);

// contract.dm:106
rt.def("/obj/item/weapon/paper/contract/infernal/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	let H: Value = null;
	if (this.signed && user == this.target.current && rt.istype(user, T("/mob/living/carbon/human"))) {
		yield* (H = user).forcesay("OH GREAT INFERNO!  I DEMAND YOU COLLECT YOUR BOUNTY IMMEDIATELY!");
		H.visible_message(`<span class='suicide'>${H} holds up a contract claiming ${user.p_their()} soul, then immediately catches fire.  It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
		yield* H.adjust_fire_stacks(20);
		yield* H.IgniteMob();
		return 2;
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// contract.dm:117
rt.def("/obj/item/weapon/paper/contract/infernal/proc/update_text", function update_text(f: Frame) {
	this.info = "This shouldn't be seen.  Error DEVIL:6";
	return f.dot;
});

rt.type(6612, "/obj/item/weapon/paper/contract/infernal/power", "/obj/item/weapon/paper/contract/infernal", {
	contractType: "power",
	name: "paper- contract for infernal power",
});

// contract.dm:120
rt.def("/obj/item/weapon/paper/contract/infernal/power/proc/update_text", function update_text(f: Frame, signature: Value, blood: Value) {
	signature ??= "____________";
	blood ??= 0;
	this.info = `<center><B>Contract for infernal power</B></center><BR><BR><BR>I, ${this.target} of sound mind, do hereby willingly offer my soul to the infernal hells by way of the infernal agent ${this.devil_datum.truename}, in exchange for power and physical strength.  I understand that upon my demise, my soul shall fall into the infernal hells, and my body may not be resurrected, cloned, or otherwise brought back to life.  I also understand that this will prevent my brain from being used in an MMI.<BR><BR><BR>Signed, `;
	if (blood) {
		this.info += `<font face="Nyala" color=#600A0A size=6><i>${signature}</i></font>`;
	} else {
		this.info += `<i>${signature}</i>`;
	}
	return f.dot;
});

rt.type(6613, "/obj/item/weapon/paper/contract/infernal/wealth", "/obj/item/weapon/paper/contract/infernal", {
	contractType: "wealth",
	name: "paper- contract for unlimited wealth",
});

// contract.dm:127
rt.def("/obj/item/weapon/paper/contract/infernal/wealth/proc/update_text", function update_text(f: Frame, signature: Value, blood: Value) {
	signature ??= "____________";
	blood ??= 0;
	this.info = `<center><B>Contract for unlimited wealth</B></center><BR><BR><BR>I, ${this.target} of sound mind, do hereby willingly offer my soul to the infernal hells by way of the infernal agent ${this.devil_datum.truename}, in exchange for a pocket that never runs out of valuable resources.  I understand that upon my demise, my soul shall fall into the infernal hells, and my body may not be resurrected, cloned, or otherwise brought back to life.  I also understand that this will prevent my brain from being used in an MMI.<BR><BR><BR>Signed, `;
	if (blood) {
		this.info += `<font face="Nyala" color=#600A0A size=6><i>${signature}</i></font>`;
	} else {
		this.info += `<i>${signature}</i>`;
	}
	return f.dot;
});

rt.type(6614, "/obj/item/weapon/paper/contract/infernal/prestige", "/obj/item/weapon/paper/contract/infernal", {
	contractType: "prestige",
	name: "paper- contract for prestige",
});

// contract.dm:134
rt.def("/obj/item/weapon/paper/contract/infernal/prestige/proc/update_text", function update_text(f: Frame, signature: Value, blood: Value) {
	signature ??= "____________";
	blood ??= 0;
	this.info = `<center><B>Contract for prestige</B></center><BR><BR><BR>I, ${this.target} of sound mind, do hereby willingly offer my soul to the infernal hells by way of the infernal agent ${this.devil_datum.truename}, in exchange for prestige and esteem among my peers.  I understand that upon my demise, my soul shall fall into the infernal hells, and my body may not be resurrected, cloned, or otherwise brought back to life.  I also understand that this will prevent my brain from being used in an MMI.<BR><BR><BR>Signed, `;
	if (blood) {
		this.info += `<font face="Nyala" color=#600A0A size=6><i>${signature}</i></font>`;
	} else {
		this.info += `<i>${signature}</i>`;
	}
	return f.dot;
});

rt.type(6615, "/obj/item/weapon/paper/contract/infernal/magic", "/obj/item/weapon/paper/contract/infernal", {
	contractType: "magic",
	name: "paper- contract for magical power",
});

// contract.dm:141
rt.def("/obj/item/weapon/paper/contract/infernal/magic/proc/update_text", function update_text(f: Frame, signature: Value, blood: Value) {
	signature ??= "____________";
	blood ??= 0;
	this.info = `<center><B>Contract for magic</B></center><BR><BR><BR>I, ${this.target} of sound mind, do hereby willingly offer my soul to the infernal hells by way of the infernal agent ${this.devil_datum.truename}, in exchange for arcane abilities beyond normal human ability.  I understand that upon my demise, my soul shall fall into the infernal hells, and my body may not be resurrected, cloned, or otherwise brought back to life.  I also understand that this will prevent my brain from being used in an MMI.<BR><BR><BR>Signed, `;
	if (blood) {
		this.info += `<font face="Nyala" color=#600A0A size=6><i>${signature}</i></font>`;
	} else {
		this.info += `<i>${signature}</i>`;
	}
	return f.dot;
});

rt.type(6616, "/obj/item/weapon/paper/contract/infernal/revive", "/obj/item/weapon/paper/contract/infernal", {
	cooldown: 0,
	contractType: "revive",
	name: "paper- contract of resurrection",
});

// contract.dm:148
rt.def("/obj/item/weapon/paper/contract/infernal/revive/proc/update_text", function update_text(f: Frame, signature: Value, blood: Value) {
	signature ??= "____________";
	blood ??= 0;
	this.info = `<center><B>Contract for resurrection</B></center><BR><BR><BR>I, ${this.target} of sound mind, do hereby willingly offer my soul to the infernal hells by way of the infernal agent ${this.devil_datum.truename}, in exchange for resurrection and curing of all injuries.  I understand that upon my demise, my soul shall fall into the infernal hells, and my body may not be resurrected, cloned, or otherwise brought back to life.  I also understand that this will prevent my brain from being used in an MMI.<BR><BR><BR>Signed, `;
	if (blood) {
		this.info += `<font face="Nyala" color=#600A0A size=6><i>${signature}</i></font>`;
	} else {
		this.info += `<i>${signature}</i>`;
	}
	return f.dot;
});

rt.type(6617, "/obj/item/weapon/paper/contract/infernal/knowledge", "/obj/item/weapon/paper/contract/infernal", {
	contractType: "knowledge",
	name: "paper- contract for knowledge",
});

// contract.dm:155
rt.def("/obj/item/weapon/paper/contract/infernal/knowledge/proc/update_text", function update_text(f: Frame, signature: Value, blood: Value) {
	signature ??= "____________";
	blood ??= 0;
	this.info = `<center><B>Contract for knowledge</B></center><BR><BR><BR>I, ${this.target} of sound mind, do hereby willingly offer my soul to the infernal hells by way of the infernal agent ${this.devil_datum.truename}, in exchange for boundless knowledge.  I understand that upon my demise, my soul shall fall into the infernal hells, and my body may not be resurrected, cloned, or otherwise brought back to life.  I also understand that this will prevent my brain from being used in an MMI.<BR><BR><BR>Signed, `;
	if (blood) {
		this.info += `<font face="Nyala" color=#600A0A size=6><i>${signature}</i></font>`;
	} else {
		this.info += `<i>${signature}</i>`;
	}
	return f.dot;
});

rt.type(6618, "/obj/item/weapon/paper/contract/infernal/friend", "/obj/item/weapon/paper/contract/infernal", {
	contractType: "friend",
	name: "paper- contract for a friend",
});

// contract.dm:162
rt.def("/obj/item/weapon/paper/contract/infernal/friend/proc/update_text", function update_text(f: Frame, signature: Value, blood: Value) {
	signature ??= "____________";
	blood ??= 0;
	this.info = `<center><B>Contract for a friend</B></center><BR><BR><BR>I, ${this.target} of sound mind, do hereby willingly offer my soul to the infernal hells by way of the infernal agent ${this.devil_datum.truename}, in exchange for a friend.  I understand that upon my demise, my soul shall fall into the infernal hells, and my body may not be resurrected, cloned, or otherwise brought back to life.  I also understand that this will prevent my brain from being used in an MMI.<BR><BR><BR>Signed, `;
	if (blood) {
		this.info += `<font face="Nyala" color=#600A0A size=6><i>${signature}</i></font>`;
	} else {
		this.info += `<i>${signature}</i>`;
	}
	return f.dot;
});

rt.type(6619, "/obj/item/weapon/paper/contract/infernal/unwilling", "/obj/item/weapon/paper/contract/infernal", {
	contractType: "unwilling",
	name: "paper- infernal contract",
});

// contract.dm:169
rt.def("/obj/item/weapon/paper/contract/infernal/unwilling/proc/update_text", function update_text(f: Frame, signature: Value, blood: Value) {
	signature ??= "____________";
	blood ??= 0;
	this.info = `<center><B>Contract for slave</B></center><BR><BR><BR>I, ${this.target}, hereby offer my soul to the infernal hells by way of the infernal agent ${this.devil_datum.truename}.  I understand that upon my demise, my soul shall fall into the infernal hells, and my body may not be resurrected, cloned, or otherwise brought back to life.  I also understand that this will prevent my brain from being used in an MMI.<BR><BR><BR>Signed, `;
	if (blood) {
		this.info += `<font face="Nyala" color=#600A0A size=6><i>${signature}</i></font>`;
	} else {
		this.info += `<i>${signature}</i>`;
	}
	return f.dot;
});

// contract.dm:176
rt.def("/obj/item/weapon/paper/contract/infernal/proc/attackby", function* attackby(f: Frame) {
	yield* this.add_fingerprint(f.args[1]);
	if (rt.istype(f.args[0], T("/obj/item/weapon/pen")) || rt.istype(f.args[0], T("/obj/item/toy/crayon"))) {
		yield* this.attempt_signature(f.args[1]);
	} else if (rt.istype(f.args[0], T("/obj/item/weapon/stamp"))) {
		to_chat(f.args[1], "<span class='notice'>You stamp the paper with your rubber stamp, however the ink ignites as you release the stamp.</span>");
	} else if (f.args[0].is_hot()) {
		f.args[1].visible_message(`<span class='danger'>${f.args[1]} brings ${f.args[0]} next to ${this}, but ${this} does not catch fire!</span>`, `<span class='danger'>The ${this} refuses to ignite!</span>`);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true, { args: ["P", "user", "params"] });

// contract.dm:187
rt.def("/obj/item/weapon/paper/contract/infernal/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	yield* this.add_fingerprint(user);
	if (M == user && this.target == M.mind && M.mind.soulOwner != this.owner && (yield* this.attempt_signature(user, 1))) {
		user.visible_message(`<span class='danger'>${user} slices ${user.p_their()} wrist with ${this}, and scrawls ${user.p_their()} name in blood.</span>`, "<span class='danger'>You slice your wrist open and scrawl your name in blood.</span>");
		user.blood_volume = max(user.blood_volume - 100, 0);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// contract.dm:195
rt.def("/obj/item/weapon/paper/contract/infernal/proc/attempt_signature", function* attempt_signature(f: Frame, user: Value, blood: Value) {
	blood ??= 0;
	if (!user.IsAdvancedToolUser() || !user.is_literate()) {
		to_chat(user, "<span class='notice'>You don't know how to read or write.</span>");
		return 0;
	}
	if (user.mind != this.target) {
		to_chat(user, "<span class='notice'>Your signature simply slides off the sheet, it seems this contract is not meant for you to sign.</span>");
		return 0;
	}
	if (user.mind.soulOwner == this.owner) {
		to_chat(user, "<span class='notice'>This devil already owns your soul, you may not sell it to them again.</span>");
		return 0;
	}
	if (this.signed) {
		to_chat(user, "<span class='notice'>This contract has already been signed.  It may not be signed again.</span>");
		return 0;
	}
	if (!user.mind.hasSoul) {
		to_chat(user, "<span class='notice'>You do not possess a soul.</span>");
		return 0;
	}
	if (prob(user.getBrainLoss())) {
		to_chat(user, "<span class='notice'>You quickly scrawl 'your name' on the contract.</span>");
		this.signIncorrectly();
		return 0;
	}
	if (this.contractType == "revive") {
		to_chat(user, "<span class='notice'>You are already alive, this contract would do nothing.</span>");
		return 0;
	} else {
		to_chat(user, "<span class='notice'>You quickly scrawl your name on the contract</span>");
		if ((yield* this.fulfillContract(this.target.current, blood)) <= 0) {
			to_chat(user, "<span class='notice'>But it seemed to have no effect, perhaps even Hell itself cannot grant this boon?</span>");
		}
		return 1;
	}
}, true);

// contract.dm:226
rt.def("/obj/item/weapon/paper/contract/infernal/revive/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let H: Value = null, ghost: Value = null, response: Value = null;
	if (this.target == M.mind && M.stat == 2 && M.mind.soulOwner == M.mind) {
		if (this.cooldown) {
			to_chat(user, `<span class='notice'>Give ${M} a chance to think through the contract, don't rush them.</span>`);
			return 0;
		}
		this.cooldown = 1;
		H = M;
		ghost = H.get_ghost();
		response = "No";
		if (ghost) {
			yield* ghost.notify_cloning("A devil has offered you revival, at the cost of your soul.", rt.rsc("sound/effects/genetics.ogg"), H);
			response = (yield* tgalert(ghost, "A devil is offering you another chance at life, at the price of your soul, do you accept?", "Infernal Resurrection", "Yes", "No", "Never for this round", 0, 200));
			if (!ghost) {
				return f.dot;
			}
		} else {
			response = (yield* tgalert(this.target.current, "A devil is offering you another chance at life, at the price of your soul, do you accept?", "Infernal Resurrection", "Yes", "No", "Never for this round", 0, 200));
		}
		if (response == "Yes") {
			yield* H.revive(1, 0);
			add_logs(user, H, "infernally revived via contract");
			user.visible_message(`<span class='notice'>With a sudden blaze, ${H} stands back up.</span>`);
			H.fakefire();
			yield* this.fulfillContract(H, 1);
			yield* addtimer((yield* new_(T("/datum/callback"), H, P("/mob/living/carbon/proc/fakefireextinguish"))), 5, 1);
		}
		yield* addtimer((yield* new_(T("/datum/callback"), this, "resetcooldown")), 300, 1);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// contract.dm:258
rt.def("/obj/item/weapon/paper/contract/infernal/proc/fulfillContract", function* fulfillContract(f: Frame, user: Value, blood: Value) {
	let ownerDevilInfo: Value = null, devilInfo: Value = null;
	user ??= this.target.current;
	blood ??= 0;
	this.signed = 1;
	if (user.mind.soulOwner != user.mind) {
		yield* (ownerDevilInfo = user.mind.soulOwner.has_antag_datum(T("/datum/antagonist/devil"))).remove_soul(user.mind);
	}
	user.mind.soulOwner = this.owner;
	user.hellbound = this.contractType;
	user.mind.damnation_type = this.contractType;
	yield* (devilInfo = this.owner.has_antag_datum(T("/datum/antagonist/devil"))).add_soul(user.mind);
	this.update_text(user.real_name, blood);
	to_chat(user, "<span class='notice'>A profound emptiness washes over you as you lose ownership of your soul.</span>");
	to_chat(user, "<span class='boldnotice'>This does NOT make you an antagonist if you were not already.</span>");
	return 1;
}, true);

// contract.dm:273
rt.def("/obj/item/weapon/paper/contract/infernal/proc/signIncorrectly", function signIncorrectly(f: Frame, user: Value, blood: Value) {
	user ??= this.target.current;
	blood ??= 0;
	this.signed = 1;
	this.update_text("your name", blood);
	return f.dot;
});

// contract.dm:276
rt.def("/obj/item/weapon/paper/contract/infernal/power/proc/fulfillContract", function* fulfillContract(f: Frame) {
	let organ: Value = null;
	if (f.args[0] === null) {
		f.args[0] = this.target.current;
	}
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (!f.args[0].dna) {
		return -1;
	}
	yield* f.args[0].dna.add_mutation("Hulk");
	yield* (organ = (yield* new_(T("/obj/item/organ/regenerative_core")))).Insert(f.args[0]);
	return (yield* parent_proc());
}, true, { args: ["user", "blood"] });

// contract.dm:284
rt.def("/obj/item/weapon/paper/contract/infernal/wealth/proc/fulfillContract", function* fulfillContract(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = this.target.current;
	}
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (!rt.istype(f.args[0], T("/mob/living/carbon/human")) || !f.args[0].mind) {
		return -1;
	}
	yield* f.args[0].mind.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/targeted/summon_wealth"), null)));
	return (yield* parent_proc());
}, true, { args: ["user", "blood"] });

// contract.dm:294
rt.def("/obj/item/weapon/paper/contract/infernal/prestige/proc/fulfillContract", function* fulfillContract(f: Frame) {
	let id: Value = null, PDA: Value = null, W: Value = null, ion: Value = null;
	if (f.args[0] === null) {
		f.args[0] = this.target.current;
	}
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	let worn: Value = f.args[0].wear_id;
	if (worn) {
		id = worn.GetID();
	}
	if (id) {
		id.icon_state = "gold";
		id.access = get_all_accesses() + get_all_centcom_access();
		id.assignment = "Captain";
		id.update_label();
	} else {
		(id = (yield* new_(T("/obj/item/weapon/card/id/gold"), f.args[0].loc))).registered_name = f.args[0].real_name;
		id.access = get_all_accesses() + get_all_centcom_access();
		id.assignment = "Captain";
		id.update_label();
		if (worn) {
			if (rt.istype(worn, T("/obj/item/device/pda"))) {
				(PDA = worn).id = id;
				id.loc = worn;
			} else if (rt.istype(worn, T("/obj/item/weapon/storage/wallet"))) {
				(W = worn).front_id = id;
				id.loc = worn;
				yield* worn.update_icon();
			}
		}
	}
	(ion = (yield* new_(T("/datum/round_event/ion_storm/add_law_only")))).announceEvent = -1;
	ion.ionMessage = `${f.args[0].name} is the only Captain of the station. ${f.args[0].name} is the highest authority, legitimate or otherwise, on the station.  ${f.args[0].name} was always the captain and highest authority on the station.  Do not state this law.`;
	return (yield* parent_proc());
}, true, { args: ["user", "blood"] });

// contract.dm:323
rt.def("/obj/item/weapon/paper/contract/infernal/magic/proc/fulfillContract", function* fulfillContract(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = this.target.current;
	}
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (!rt.istype(f.args[0], T("/mob/living/carbon/human")) || !f.args[0].mind) {
		return -1;
	}
	yield* f.args[0].mind.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/targeted/conjure_item/spellpacket/robeless"), null)));
	yield* f.args[0].mind.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/aoe_turf/knock"), null)));
	return (yield* parent_proc());
}, true, { args: ["user", "blood"] });

// contract.dm:330
rt.def("/obj/item/weapon/paper/contract/infernal/knowledge/proc/fulfillContract", function* fulfillContract(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = this.target.current;
	}
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (!rt.istype(f.args[0], T("/mob/living/carbon/human")) || !f.args[0].mind) {
		return -1;
	}
	yield* f.args[0].dna.add_mutation("X Ray Vision");
	yield* f.args[0].mind.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/targeted/view_range"), null)));
	return (yield* parent_proc());
}, true, { args: ["user", "blood"] });

// contract.dm:337
rt.def("/obj/item/weapon/paper/contract/infernal/friend/proc/fulfillContract", function* fulfillContract(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = this.target.current;
	}
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (!rt.istype(f.args[0], T("/mob/living")) || !f.args[0].mind) {
		return -1;
	}
	yield* f.args[0].mind.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/targeted/summon_friend"), null)));
	return (yield* parent_proc());
}, true, { args: ["user", "blood"] });
