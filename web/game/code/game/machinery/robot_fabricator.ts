// Based on /tg/station's code/game/machinery/robot_fabricator.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add, fmt } = rt;


rt.type(10818, "/obj/machinery/robotic_fabricator", "/obj/machinery", {
	metal_amount: 0,
	operating: 0,
	being_built: null,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 20,
	active_power_usage: 5000,
	name: "robotic fabricator",
	icon: rt.rsc("icons/obj/robotics.dmi"),
	icon_state: "fab-idle",
	density: 1,
});

// robot_fabricator.dm:15
rt.def("/obj/machinery/robotic_fabricator/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	let count: Value = null;
	if (rt.istype(O, T("/obj/item/stack/sheet/metal"))) {
		if (this.metal_amount < 150000) {
			count = 0;
			this.add_overlay("fab-load-metal");
			rt.spawnTail(f, 15, "/obj/machinery/robotic_fabricator/proc/attackby: spawn at game/machinery/robot_fabricator.dm:19", count);
		} else {
			to_chat(user, fmt("＄！ is full.", [this]));
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// a spawn(15) body of /obj/machinery/robotic_fabricator/proc/attackby, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/robotic_fabricator/proc/attackby: spawn at game/machinery/robot_fabricator.dm:19", function* (f: Frame, count: Value) {
	if (f.args[0]) {
		if (!f.args[0].amount) {
			return f.dot;
		}
		while (this.metal_amount < 150000 && f.args[0].amount) {
			rt.modField(f, this, "metal_amount", rt.index(f.args[0].materials, "$metal"), add);
			f.args[0].amount--;
			count++;
		}
		if (f.args[0].amount < 1) {
			yield* qdel(f.args[0]);
		}
		to_chat(f.args[1], fmt("<span class='notice'>You insert ＀ metal sheet５ into ％！.</span>", [count, this]));
		this.cut_overlay("fab-load-metal");
		yield* this.updateDialog();
	}
	return null;
});

// robot_fabricator.dm:40
rt.def("/obj/machinery/robotic_fabricator/proc/power_change", function power_change(f: Frame) {
	if (this.powered()) {
		(rt.modSrcVar(f, "stat", 16777213, rt.bitAnd));
	} else {
		(rt.modSrcVar(f, "stat", 2, rt.bitOr));
	}
	return f.dot;
});

// robot_fabricator.dm:46
rt.def("/obj/machinery/robotic_fabricator/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// robot_fabricator.dm:50
rt.def("/obj/machinery/robotic_fabricator/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let dat: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (this.operating) {
		dat = `\n<TT>Building ${this.being_built.name}.<BR>\nPlease wait until completion...</TT><BR>\n<BR>\n`;
	} else {
		dat = fmt("\n<B>Metal Amount:</B> ＀ cm<sup>3</sup> (MAX: 150,000)<BR><HR>\n<BR>\n<A href='?src=＃;make=1'>Left Arm (25,000 cc metal.)<BR>\n<A href='?src=＃;make=2'>Right Arm (25,000 cc metal.)<BR>\n<A href='?src=＃;make=3'>Left Leg (25,000 cc metal.)<BR>\n<A href='?src=＃;make=4'>Right Leg (25,000 cc metal).<BR>\n<A href='?src=＃;make=5'>Chest (50,000 cc metal).<BR>\n<A href='?src=＃;make=6'>Head (50,000 cc metal).<BR>\n<A href='?src=＃;make=7'>Robot Frame (75,000 cc metal).<BR>\n", [min(150000, this.metal_amount), this, this, this, this, this, this, this]);
	}
	rt.op(f, "Browse", [], [user, `<HEAD><TITLE>Robotic Fabricator Control Panel</TITLE></HEAD><TT>${dat}</TT>`, "window=robot_fabricator"], false);
	onclose(user, "robot_fabricator");
	return f.dot;
}, true);

// robot_fabricator.dm:77
rt.def("/obj/machinery/robotic_fabricator/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let part_type: Value = null, build_type: Value = null, build_time: Value = null, build_cost: Value = null, building: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* f.usr.set_machine(this);
	yield* this.add_fingerprint(f.usr);
	if (rt.at(href_list, "make")) {
		if (!this.operating) {
			part_type = text2num(rt.at(href_list, "make"));
			build_type = "";
			build_time = 200;
			build_cost = 25000;
			if (part_type === 1) {
				build_type = "/obj/item/bodypart/l_arm/robot";
				build_time = 200;
				build_cost = 10000;
			} else if (part_type === 2) {
				build_type = "/obj/item/bodypart/r_arm/robot";
				build_time = 200;
				build_cost = 10000;
			} else if (part_type === 3) {
				build_type = "/obj/item/bodypart/l_leg/robot";
				build_time = 200;
				build_cost = 10000;
			} else if (part_type === 4) {
				build_type = "/obj/item/bodypart/r_leg/robot";
				build_time = 200;
				build_cost = 10000;
			} else if (part_type === 5) {
				build_type = "/obj/item/bodypart/chest/robot";
				build_time = 350;
				build_cost = 40000;
			} else if (part_type === 6) {
				build_type = "/obj/item/bodypart/head/robot";
				build_time = 350;
				build_cost = 5000;
			} else if (part_type === 7) {
				build_type = "/obj/item/robot_suit";
				build_time = 600;
				build_cost = 15000;
			}
			if ((building = text2path(build_type)) !== null) {
				if (this.metal_amount >= build_cost) {
					this.operating = 1;
					this.use_power = 2;
					this.metal_amount = max(0, this.metal_amount - build_cost);
					this.being_built = (yield* new_(building, this));
					this.add_overlay("fab-active");
					yield* this.updateUsrDialog();
					rt.spawnTail(f, build_time, "/obj/machinery/robotic_fabricator/proc/Topic: spawn at game/machinery/robot_fabricator.dm:140", part_type, build_type, build_time, build_cost, building);
				}
			}
		}
		return f.dot;
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// a spawn(live(build_time)) body of /obj/machinery/robotic_fabricator/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/robotic_fabricator/proc/Topic: spawn at game/machinery/robot_fabricator.dm:140", function* (f: Frame, part_type: Value, build_type: Value, build_time: Value, build_cost: Value, building: Value) {
	if (this.being_built !== null) {
		this.being_built.loc = rt.getStep(f, this, 0);
		this.being_built = null;
	}
	this.use_power = 1;
	this.operating = 0;
	this.cut_overlay("fab-active");
	return null;
});
