// Based on /tg/station's code/game/gamemodes/gang/gang_pen.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(6644, "/obj/item/weapon/pen/gang", "/obj/item/weapon/pen", {
	cooldown: null,
	last_used: 0,
	charges: 1,
	origin_tech: "materials=2;syndicate=3",
});

// gang_pen.dm:11
rt.def("/obj/item/weapon/pen/gang/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.last_used = rt.worldTime(f);
	return f.dot;
}, true);

// gang_pen.dm:15
rt.def("/obj/item/weapon/pen/gang/proc/attack", function* attack(f: Frame) {
	let G: Value = null, recruitable: Value = null, O: Value = null;
	let $e: any;
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	if (!rt.istype(f.args[0], T("/mob/living"))) {
		return f.dot;
	}
	if (rt.istype(f.args[0], T("/mob/living/carbon/human")) && rt.istype(f.args[1], T("/mob/living/carbon/human")) && f.args[0].stat != 2) {
		if (f.args[1].mind && rt.isIn(f, f.args[1].mind, GLOB.SSticker.mode.get_gang_bosses())) {
			if (yield* parent_proc(f.args[0], f.args[1], 1)) {
				if (this.cooldown) {
					to_chat(f.args[1], `<span class='warning'>${this} needs more time to recharge before it can be used.</span>`);
					return f.dot;
				}
				if (f.args[0].client) {
					f.args[0].mind_initialize();
					G = f.args[1].mind.gang_datum;
					const subject = (recruitable = (yield* GLOB.SSticker.mode.add_gangster(f.args[0].mind, G)));
					if (subject === 3) {
						for (O of each(f.args[0].contents, T("/obj"))) {
							if (rt.istype(O, T("/obj/item/device/gangtool/soldier"))) {
								to_chat(f.args[1], "<span class='warning'>This gangster already has an uplink!</span>");
								return f.dot;
							}
						}
						yield* new_(T("/obj/item/device/gangtool/soldier"), f.args[0]);
						to_chat(f.args[1], `<span class='warning'>You inject ${f.args[0]} with a new gangtool!</span>`);
						yield* this.cooldown(G);
					} else if (subject === 2) {
						yield* new_(T("/obj/item/device/gangtool/soldier"), f.args[0]);
						yield* f.args[0].Unconscious(100);
						yield* this.cooldown(G);
					} else if (subject === 1) {
						to_chat(f.args[1], "<span class='warning'>This mind is resistant to recruitment!</span>");
					} else {
						to_chat(f.args[1], "<span class='warning'>This mind has already been recruited into a gang!</span>");
					}
				}
			}
			return f.dot;
		}
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["M", "user", "stealth"] });

// gang_pen.dm:49
rt.def("/obj/item/weapon/pen/gang/proc/cooldown", function* cooldown(f: Frame, gang: Value) {
	let M: Value = null;
	let $3: any;
	let cooldown_time: Value = 600 + 600 * rt.len(f, gang.bosses);
	this.cooldown = 1;
	this.icon_state = "pen_blink";
	let time_passed: Value = rt.worldTime(f) - this.last_used;
	let time: Value = time_passed;
	while (time >= cooldown_time) {
		this.charges++;
		time -= cooldown_time;
	}
	this.charges = max(0, this.charges - 1);
	this.last_used = rt.worldTime(f) - time;
	if (this.charges) {
		cooldown_time = 50;
	}
	yield* sleep(cooldown_time);
	this.cooldown = 0;
	this.icon_state = "pen";
	let $0: any = (M = get(this, T("/mob")));
	let $1: any = bicon(this);
	let $2: any = this;
	if (this.loc == M) {
		$3 = "";
	} else {
		$3 = ` in your ${this.loc}`;
	}
	to_chat($0, `<span class='notice'>${$1} ${$2}${$3} vibrates softly. It is ready to be used again.</span>`);
	return f.dot;
}, true, { waitfor: false });
