// Based on /tg/station's code/modules/library/lib_codex_gigas.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(7304, "/obj/item/weapon/book/codex_gigas", "/obj/item/weapon/book", {
	inUse: 0,
	currentName: "",
	currentSection: 1,
	throw_speed: 1,
	throw_range: 10,
	name: "１Codex Gigas",
	desc: "A book documenting the nature of devils.",
	icon_state: "demonomicon",
	resistance_flags: 35,
	author: "Forces beyond your comprehension",
	unique: 1,
	title: "the Codex Gigas",
});

// lib_codex_gigas.dm:22
rt.def("/obj/item/weapon/book/codex_gigas/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let U: Value = null;
	if (is_blind(user)) {
		to_chat(user, "<span class='warning'>As you are trying to read, you suddenly feel very stupid.</span>");
		return f.dot;
	}
	if (!user.is_literate()) {
		to_chat(user, "<span class='notice'>You skim through the book but can't comprehend any of it.</span>");
		return f.dot;
	}
	if (this.inUse) {
		to_chat(user, "<span class='notice'>Someone else is reading it.</span>");
	}
	if (rt.istype(user, T("/mob/living/carbon/human"))) {
		if ((U = user).check_acedia()) {
			to_chat(user, `<span class='notice'>None of this matters, why are you reading this? You put ${this.title} down.</span>`);
			return f.dot;
		}
	}
	user.visible_message(`${user} opens ${this.title} and begins reading intently.`);
	yield* this.ask_name(user);
	return f.dot;
}, true);

// lib_codex_gigas.dm:40
rt.def("/obj/item/weapon/book/codex_gigas/proc/perform_research", function* perform_research(f: Frame, user: Value, devilName: Value) {
	let U: Value = null, usedName: Value = null, devil: Value = null;
	if (!devilName) {
		user.visible_message(`${user} closes ${this.title} without looking anything up.`);
		return f.dot;
	}
	this.inUse = 1;
	let speed: Value = 300;
	let correctness: Value = 85;
	if (rt.istype(user, T("/mob/living/carbon/human"))) {
		if (rt.isIn(f, (U = user).job, list("Curator"))) {
			speed = 100;
			correctness = 100;
		}
		correctness -= U.getBrainLoss() * 0.5;
		speed += U.getBrainLoss() * 3;
	}
	if (yield* do_after(user, speed, 0, user)) {
		usedName = devilName;
		if (!prob(correctness)) {
			usedName += "x";
		}
		this.display_devil((devil = devilInfo(usedName)), user, usedName);
	}
	yield* sleep(10);
	onclose(user, "book");
	this.inUse = 0;
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob" }, {  }] });

// lib_codex_gigas.dm:64
rt.def("/obj/item/weapon/book/codex_gigas/proc/display_devil", function display_devil(f: Frame, devil: Value, reader: Value, devilName: Value) {
	let $6: any;
	let $0: any = reader;
	let $1: any = devilName;
	let $2: any = rt.index(rt.index(GLOB.lawlorify, LORE), devil.ban);
	let $3: any = rt.index(rt.index(GLOB.lawlorify, LORE), devil.bane);
	let $4: any = rt.index(rt.index(GLOB.lawlorify, LORE), devil.obligation);
	let $5: any = rt.index(rt.index(GLOB.lawlorify, LORE), devil.banish);
	if (devil.ascendable) {
		$6 = "This devil may ascend given enough souls.";
	} else {
		$6 = "";
	}
	$1 = `Information on ${$1}<br><br><br>${$2}<br>${$3}<br>${$4}<br>${$5}<br>${$6}`;
	rt.op(f, "Browse", [], [$0, $1, `window=book${this.window_size !== null ? `;size=${this.window_size}` : ""}`], false);
	return f.dot;
});

// lib_codex_gigas.dm:67
rt.def("/obj/item/weapon/book/codex_gigas/proc/ask_name", function* ask_name(f: Frame, reader: Value) {
	yield* this.ui_interact(reader);
	return f.dot;
}, true);

// lib_codex_gigas.dm:70
rt.def("/obj/item/weapon/book/codex_gigas/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (!action) {
		return 0;
	}
	if (action == "search") {
		yield* GLOB.SStgui.close_uis(this);
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/weapon/book/codex_gigas/proc/perform_research"), f.usr, this.currentName)), 0);
		this.currentName = "";
		this.currentSection = PRE_TITLE;
		return 0;
	} else {
		this.currentName += action;
	}
	let oldSection: Value = this.currentSection;
	if (GLOB.devil_pre_title.Find(action)) {
		this.currentSection = TITLE;
	} else if (GLOB.devil_title.Find(action)) {
		this.currentSection = SYLLABLE;
	} else if (GLOB.devil_syllable.Find(action)) {
		if (this.currentSection >= SYLLABLE) {
			this.currentSection = MULTIPLE_SYLLABLE;
		} else {
			this.currentSection = SYLLABLE;
		}
	} else if (GLOB.devil_suffix.Find(action)) {
		this.currentSection = SUFFIX;
	}
	return (this.currentSection != oldSection ? PRE_TITLE : 0);
}, true);

// lib_codex_gigas.dm:98
rt.def("/obj/item/weapon/book/codex_gigas/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "codex_gigas", this.name, 450, 450, master_ui, state))).open();
	return f.dot;
}, true);

// lib_codex_gigas.dm:104
rt.def("/obj/item/weapon/book/codex_gigas/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null;
	rt.setAt((data = list()), "name", this.currentName);
	rt.setAt(data, "currentSection", this.currentSection);
	return data;
});
