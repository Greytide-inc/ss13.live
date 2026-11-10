// Based on /tg/station's code/game/objects/items/weapons/implants/implant_explosive.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(7404, "/obj/item/weapon/implant/explosive", "/obj/item/weapon/implant", {
	weak: 2,
	medium: 0.8,
	heavy: 0.4,
	delay: 7,
	popup: 0,
	active: 0,
	name: "microbomb implant",
	desc: "And boom goes the weasel.",
	icon_state: "explosive",
	origin_tech: "materials=2;combat=3;biotech=4;syndicate=4",
	actions_types: null,
});

// implant_explosive.dm:6
rt.def("/obj/item/weapon/implant/explosive/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/explosive_implant"));
	return f.dot;
});

// implant_explosive.dm:16
rt.def("/obj/item/weapon/implant/explosive/proc/get_data", function get_data(f: Frame) {
	let dat: Value = null;
	return (dat = "<b>Implant Specifications:</b><BR>\n\t\t\t\t<b>Name:</b> Robust Corp RX-78 Employee Management Implant<BR>\n\t\t\t\t<b>Life:</b> Activates upon death.<BR>\n\t\t\t\t<b>Important Notes:</b> Explodes<BR>\n\t\t\t\t<HR>\n\t\t\t\t<b>Implant Details:</b><BR>\n\t\t\t\t<b>Function:</b> Contains a compact, electrically detonated explosive that detonates upon receiving a specially encoded signal or upon host death.<BR>\n\t\t\t\t<b>Special Features:</b> Explodes<BR>\n\t\t\t\t");
});

// implant_explosive.dm:28
rt.def("/obj/item/weapon/implant/explosive/proc/trigger", function* trigger(f: Frame, emote: Value, source: Value) {
	if (emote != "deathgasp") return f.dot;
	yield* this.activate("death");
	return f.dot;
}, true);

// implant_explosive.dm:32
rt.def("/obj/item/weapon/implant/explosive/proc/activate", function* activate(f: Frame, cause: Value) {
	let response: Value = null;
	if (!cause || !this.imp_in || this.active) {
		return 0;
	}
	if (cause == "action_button" && !this.popup) {
		this.popup = 1;
		response = (yield* alert(this.imp_in, `Are you sure you want to activate your ${this.name}? This will cause you to explode!`, `${this.name} Confirmation`, "Yes", "No"));
		this.popup = 0;
		if (response == "No") {
			return 0;
		}
	}
	this.heavy = round(this.heavy);
	this.medium = round(this.medium);
	this.weak = round(this.weak);
	to_chat(this.imp_in, `<span class='notice'>You activate your ${this.name}.</span>`);
	this.active = 1;
	let boomturf: Value = rt.getStep(f, this.imp_in, 0);
	let A: Value = get_area(boomturf);
	message_admins(`${`${key_name_admin(this.imp_in)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [this.imp_in])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [this.imp_in])}`} has activated their ${this.name} at ${A.name} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${boomturf.x};Y=${boomturf.y};Z=${boomturf.z}'>JMP</a>)`}.`);
	if (this.delay <= 7) {
		yield* explosion(this, this.heavy, this.medium, this.weak, this.weak, { flame_range: this.weak });
		if (this.imp_in) {
			yield* this.imp_in.gib(1);
		}
		yield* qdel(this);
		return f.dot;
	}
	yield* this.timed_explosion();
	return f.dot;
}, true);

// implant_explosive.dm:58
rt.def("/obj/item/weapon/implant/explosive/proc/implant", function* implant(f: Frame, target: Value) {
	let X: Value = null, imp_e: Value = null;
	for (X of each(target.implants)) {
		if (rt.op(f, "IsType", [], [X, this.type])) {
			(imp_e = X).heavy += this.heavy;
			imp_e.medium += this.medium;
			imp_e.weak += this.weak;
			imp_e.delay += this.delay;
			yield* qdel(this);
			return 1;
		}
	}
	return (yield* parent_proc());
}, true);

// implant_explosive.dm:71
rt.def("/obj/item/weapon/implant/explosive/proc/timed_explosion", function* timed_explosion(f: Frame) {
	this.imp_in.visible_message(`<span class='warning'>${this.imp_in} starts beeping ominously!</span>`);
	playsound(this.loc, rt.rsc("sound/items/timer.ogg"), 30, 0);
	yield* sleep(this.delay * 0.25);
	if (this.imp_in && !this.imp_in.stat) {
		this.imp_in.visible_message(`<span class='warning'>${this.imp_in} doubles over in pain!</span>`);
		yield* this.imp_in.Knockdown(140);
	}
	playsound(this.loc, rt.rsc("sound/items/timer.ogg"), 30, 0);
	yield* sleep(this.delay * 0.25);
	playsound(this.loc, rt.rsc("sound/items/timer.ogg"), 30, 0);
	yield* sleep(this.delay * 0.25);
	playsound(this.loc, rt.rsc("sound/items/timer.ogg"), 30, 0);
	yield* sleep(this.delay * 0.25);
	yield* explosion(this, this.heavy, this.medium, this.weak, this.weak, { flame_range: this.weak });
	if (this.imp_in) {
		yield* this.imp_in.gib(1);
	}
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(7405, "/obj/item/weapon/implant/explosive/macro", "/obj/item/weapon/implant/explosive", {
	weak: 16,
	medium: 8,
	heavy: 4,
	delay: 70,
	name: "macrobomb implant",
	desc: "And boom goes the weasel. And everything else nearby.",
	icon_state: "explosive",
	origin_tech: "materials=3;combat=5;biotech=4;syndicate=5",
});

// implant_explosive.dm:99
rt.def("/obj/item/weapon/implant/explosive/macro/proc/implant", function* implant(f: Frame, target: Value) {
	let X: Value = null, Y: Value = null, imp_e: Value = null;
	for (X of each(target.implants)) {
		if (rt.op(f, "IsType", [], [X, this.type])) {
			return 0;
		}
	}
	for (Y of each(target.implants)) {
		if (rt.istype(Y, T("/obj/item/weapon/implant/explosive"))) {
			this.heavy += (imp_e = Y).heavy;
			this.medium += imp_e.medium;
			this.weak += imp_e.weak;
			this.delay += imp_e.delay;
			yield* qdel(imp_e);
			break;
		}
	}
	return (yield* parent_proc());
}, true);
