// Based on /tg/station's code/modules/paperwork/filingcabinet.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(12968, "/obj/structure/filingcabinet", "/obj/structure", {
	anchored: 1,
	name: "filing cabinet",
	desc: "A large cabinet with drawers.",
	icon: rt.rsc("icons/obj/bureaucracy.dmi"),
	icon_state: "filingcabinet",
	density: 1,
});

// filingcabinet.dm:35
rt.def("/obj/structure/filingcabinet/proc/Initialize", function Initialize(f: Frame, mapload: Value) {
	let I: Value = null;
	f.dot = parent_proc();
	if (!mapload) return f.dot;
	for (I of each(this.loc, T("/obj/item"))) {
		if (rt.istype(I, T("/obj/item/weapon/paper")) || rt.istype(I, T("/obj/item/weapon/folder")) || rt.istype(I, T("/obj/item/weapon/photo"))) {
			I.loc = this;
		}
	}
	return f.dot;
}, false);

// filingcabinet.dm:42
rt.def("/obj/structure/filingcabinet/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let I: Value = null;
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, 2);
		for (I of each(this, T("/obj/item"))) {
			yield* I.forceMove(this.loc);
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);

// filingcabinet.dm:49
rt.def("/obj/structure/filingcabinet/proc/attackby", function* attackby(f: Frame) {
	if (rt.istype(f.args[0], T("/obj/item/weapon/paper")) || rt.istype(f.args[0], T("/obj/item/weapon/folder")) || rt.istype(f.args[0], T("/obj/item/weapon/photo")) || rt.istype(f.args[0], T("/obj/item/documents"))) {
		if (!(yield* f.args[1].drop_item())) {
			return f.dot;
		}
		to_chat(f.args[1], `<span class='notice'>You put ${f.args[0]} in ${this}.</span>`);
		f.args[0].loc = this;
		this.icon_state = `${rt.initial(f, this, "icon_state")}-open`;
		yield* sleep(5);
		this.icon_state = rt.initial(f, this, "icon_state");
		yield* this.updateUsrDialog();
	} else if (rt.istype(f.args[0], T("/obj/item/weapon/wrench"))) {
		to_chat(f.args[1], `<span class='notice'>You begin to ${this.anchored ? "unwrench" : "wrench"} ${this}.</span>`);
		playsound(this.loc, f.args[0].usesound, 50, 1);
		if (yield* do_after(f.args[1], 20, { target: this })) {
			to_chat(f.args[1], `<span class='notice'>You successfully ${this.anchored ? "unwrench" : "wrench"} ${this}.</span>`);
			this.anchored = (!this.anchored ? 1 : 0);
		}
	} else if (f.args[1].a_intent != "harm") {
		to_chat(f.args[1], `<span class='warning'>You can't put ${f.args[0]} in ${this}!</span>`);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true, { args: ["P", "user", "params"] });

// filingcabinet.dm:71
rt.def("/obj/structure/filingcabinet/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let _P: Value = null;
	if (rt.len(f, this.contents) <= 0) {
		to_chat(user, `<span class='notice'>${this} is empty.</span>`);
		return f.dot;
	}
	yield* user.set_machine(this);
	let dat: Value = "<center><table>";
	let i: Value = rt.len(f, this.contents);
	while (i >= 1) {
		_P = rt.index(this.contents, i);
		dat += fmt("<tr><td><a href='?src=＃;retrieve=＃'>＀</a></td></tr>", [this, _P, _P.name]);
		i--;
	}
	dat += "</table></center>";
	rt.op(f, "Browse", [], [user, `<html><head><title>${this.name}</title></head><body>${dat}</body></html>`, "window=filingcabinet;size=350x300"], false);
	return f.dot;
}, true);

// filingcabinet.dm:86
rt.def("/obj/structure/filingcabinet/proc/attack_tk", function* attack_tk(f: Frame, user: Value) {
	if (this.anchored) {
		yield* this.attack_self_tk(user);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// filingcabinet.dm:91
rt.def("/obj/structure/filingcabinet/proc/attack_self_tk", function* attack_self_tk(f: Frame, user: Value) {
	let I: Value = null;
	if (rt.len(f, this.contents)) {
		if (prob(40 + rt.len(f, this.contents) * 5)) {
			(I = pick(this.contents)).loc = this.loc;
			if (prob(25)) {
				yield* step_rand(I);
			}
			to_chat(user, fmt("<span class='notice'>You pull ＇！ out of ＀ at random.</span>", [I, this]));
			return f.dot;
		}
	}
	to_chat(user, `<span class='notice'>You find nothing in ${this}.</span>`);
	return f.dot;
}, true);

// filingcabinet.dm:102
rt.def("/obj/structure/filingcabinet/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let _P: Value = null;
	if (!rt.at(href_list, "retrieve")) return f.dot;
	rt.op(f, "Browse", [], [f.usr, "", "window=filingcabinet"], false);
	if (!(rt.istype((_P = rt.locateIn(f, rt.at(href_list, "retrieve"), rt.world())), T("/obj/item")) && _P.loc == this && get_dist(this, f.usr) <= 1)) return f.dot;
	yield* f.usr.put_in_hands(_P);
	yield* this.updateUsrDialog();
	this.icon_state = `${rt.initial(f, this, "icon_state")}-open`;
	yield* sleep(5);
	this.icon_state = rt.initial(f, this, "icon_state");
	return f.dot;
}, true);

rt.type(12972, "/obj/structure/filingcabinet/security", "/obj/structure/filingcabinet", {
	virgin: 1,
});

// filingcabinet.dm:123
rt.def("/obj/structure/filingcabinet/security/proc/populate", function* populate(f: Frame) {
	let G: Value = null, S: Value = null, _P: Value = null, counter: Value = null;
	if (!this.virgin) return f.dot;
	for (G of each(GLOB.data_core.general, T("/datum/data/record"))) {
		if (!(S = find_record("name", rt.index(G.fields, "name"), GLOB.data_core.security))) {
			continue;
		}
		(_P = (yield* new_(T("/obj/item/weapon/paper"), this))).info = "<CENTER><B>Security Record</B></CENTER><BR>";
		_P.info += `Name: ${rt.index(G.fields, "name")} ID: ${rt.index(G.fields, "id")}<BR>\nSex: ${rt.index(G.fields, "sex")}<BR>\nAge: ${rt.index(G.fields, "age")}<BR>\nFingerprint: ${rt.index(G.fields, "fingerprint")}<BR>\nPhysical Status: ${rt.index(G.fields, "p_stat")}<BR>\nMental Status: ${rt.index(G.fields, "m_stat")}<BR>`;
		_P.info += `<BR>\n<CENTER><B>Security Data</B></CENTER><BR>\nCriminal Status: ${rt.index(S.fields, "criminal")}<BR>\n<BR>\nMinor Crimes: ${rt.index(S.fields, "mi_crim")}<BR>\nDetails: ${rt.index(S.fields, "mi_crim_d")}<BR>\n<BR>\nMajor Crimes: ${rt.index(S.fields, "ma_crim")}<BR>\nDetails: ${rt.index(S.fields, "ma_crim_d")}<BR>\n<BR>\nImportant Notes:<BR>\n\t${rt.index(S.fields, "notes")}<BR>\n<BR>\n<CENTER><B>Comments/Log</B></CENTER><BR>`;
		counter = 1;
		while (rt.index(S.fields, `com_${counter}`)) {
			_P.info += `${rt.index(S.fields, `com_${counter}`)}<BR>`;
			counter++;
		}
		_P.info += "</TT>";
		_P.name = `paper - '${rt.index(G.fields, "name")}'`;
		this.virgin = 0;
	}
	return f.dot;
}, true);

// filingcabinet.dm:141
rt.def("/obj/structure/filingcabinet/security/proc/attack_hand", function* attack_hand(f: Frame) {
	yield* this.populate();
	yield* parent_proc();
	return f.dot;
}, true);

// filingcabinet.dm:144
rt.def("/obj/structure/filingcabinet/security/proc/attack_tk", function* attack_tk(f: Frame) {
	yield* this.populate();
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(12973, "/obj/structure/filingcabinet/medical", "/obj/structure/filingcabinet", {
	virgin: 1,
});

// filingcabinet.dm:155
rt.def("/obj/structure/filingcabinet/medical/proc/populate", function* populate(f: Frame) {
	let G: Value = null, M: Value = null, _P: Value = null, counter: Value = null;
	if (!this.virgin) return f.dot;
	for (G of each(GLOB.data_core.general, T("/datum/data/record"))) {
		if (!(M = find_record("name", rt.index(G.fields, "name"), GLOB.data_core.medical))) {
			continue;
		}
		(_P = (yield* new_(T("/obj/item/weapon/paper"), this))).info = "<CENTER><B>Medical Record</B></CENTER><BR>";
		_P.info += `Name: ${rt.index(G.fields, "name")} ID: ${rt.index(G.fields, "id")}<BR>\nSex: ${rt.index(G.fields, "sex")}<BR>\nAge: ${rt.index(G.fields, "age")}<BR>\nFingerprint: ${rt.index(G.fields, "fingerprint")}<BR>\nPhysical Status: ${rt.index(G.fields, "p_stat")}<BR>\nMental Status: ${rt.index(G.fields, "m_stat")}<BR>`;
		_P.info += `<BR>\n<CENTER><B>Medical Data</B></CENTER><BR>\nBlood Type: ${rt.index(M.fields, "blood_type")}<BR>\nDNA: ${rt.index(M.fields, "b_dna")}<BR>\n<BR>\nMinor Disabilities: ${rt.index(M.fields, "mi_dis")}<BR>\nDetails: ${rt.index(M.fields, "mi_dis_d")}<BR>\n<BR>\nMajor Disabilities: ${rt.index(M.fields, "ma_dis")}<BR>\nDetails: ${rt.index(M.fields, "ma_dis_d")}<BR>\n<BR>\nAllergies: ${rt.index(M.fields, "alg")}<BR>\nDetails: ${rt.index(M.fields, "alg_d")}<BR>\n<BR>\nCurrent Diseases: ${rt.index(M.fields, "cdi")} (per disease info placed in log/comment section)<BR>\nDetails: ${rt.index(M.fields, "cdi_d")}<BR>\n<BR>\nImportant Notes:<BR>\n\t${rt.index(M.fields, "notes")}<BR>\n<BR>\n<CENTER><B>Comments/Log</B></CENTER><BR>`;
		counter = 1;
		while (rt.index(M.fields, `com_${counter}`)) {
			_P.info += `${rt.index(M.fields, `com_${counter}`)}<BR>`;
			counter++;
		}
		_P.info += "</TT>";
		_P.name = `paper - '${rt.index(G.fields, "name")}'`;
		this.virgin = 0;
	}
	return f.dot;
}, true);

// filingcabinet.dm:172
rt.def("/obj/structure/filingcabinet/medical/proc/attack_hand", function* attack_hand(f: Frame) {
	yield* this.populate();
	yield* parent_proc();
	return f.dot;
}, true);

// filingcabinet.dm:175
rt.def("/obj/structure/filingcabinet/medical/proc/attack_tk", function* attack_tk(f: Frame) {
	yield* this.populate();
	yield* parent_proc();
	return f.dot;
}, true);

// filingcabinet.dm:182
rt.def("/datum/controller/global_vars/proc/InitGlobalemploymentCabinets", function InitGlobalemploymentCabinets(f: Frame) {
	GLOB.employmentCabinets = list();
	this.gvars_datum_init_order += "employmentCabinets";
	return f.dot;
});

rt.type(12974, "/obj/structure/filingcabinet/employment", "/obj/structure/filingcabinet", {
	cooldown: 0,
	virgin: 1,
	icon_state: "employmentcabinet",
});

// filingcabinet.dm:190
rt.def("/obj/structure/filingcabinet/employment/proc/New", function* New(f: Frame) {
	GLOB.employmentCabinets += this;
	return (yield* parent_proc());
}, true);

// filingcabinet.dm:194
rt.def("/obj/structure/filingcabinet/employment/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.employmentCabinets -= this;
	return (yield* parent_proc());
}, true);

// filingcabinet.dm:199
rt.def("/obj/structure/filingcabinet/employment/proc/fillCurrent", function* fillCurrent(f: Frame) {
	let record: Value = null, G: Value = null;
	for (record of each(GLOB.data_core.locked)) {
		if (!(G = record)) {
			continue;
		}
		if (rt.index(G.fields, "reference")) {
			yield* this.addFile(rt.index(G.fields, "reference"));
		}
	}
	return f.dot;
}, true);

// filingcabinet.dm:208
rt.def("/obj/structure/filingcabinet/employment/proc/addFile", function* addFile(f: Frame, employee: Value) {
	yield* new_(T("/obj/item/weapon/paper/contract/employment"), this, employee);
	return f.dot;
}, true);

// filingcabinet.dm:211
rt.def("/obj/structure/filingcabinet/employment/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (!this.cooldown) {
		if (this.virgin) {
			yield* this.fillCurrent();
			this.virgin = 0;
		}
		this.cooldown = 1;
		yield* parent_proc();
		yield* sleep(100);
		this.cooldown = 0;
	} else {
		to_chat(user, `<span class='warning'>The ${this} is jammed, give it a few seconds.</span>`);
	}
	return f.dot;
}, true);
