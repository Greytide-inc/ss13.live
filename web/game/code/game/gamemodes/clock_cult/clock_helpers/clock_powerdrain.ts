// Based on /tg/station's code/game/gamemodes/clock_cult/clock_helpers/clock_powerdrain.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// clock_powerdrain.dm:6
rt.def("/obj/machinery/power/apc/proc/power_drain", function* power_drain(f: Frame, clockcult_user: Value) {
	if (!(this.cell && this.cell.charge)) return f.dot;
	playsound(this, "sparks", 50, 1);
	flick("apc-spark", this);
	f.dot = min(this.cell.charge, 250);
	yield* this.cell.use(f.dot);
	if (!this.cell.charge && !this.shorted) {
		this.shorted = 1;
		this.visible_message(`<span class='warning'>The ${this.name}'s screen blurs with static.</span>`);
	}
	yield* this.update();
	yield* this.update_icon();
	return f.dot;
}, true);

// clock_powerdrain.dm:19
rt.def("/obj/machinery/power/smes/proc/power_drain", function* power_drain(f: Frame, clockcult_user: Value) {
	if (!this.charge) return f.dot;
	f.dot = min(this.charge, 250);
	this.charge -= f.dot * 50;
	if (!this.charge && !this.panel_open) {
		this.panel_open = 1;
		this.icon_state = `${rt.initial(f, this, "icon_state")}-o`;
		yield* do_sparks(10, 0, this);
		this.visible_message(`<span class='warning'>${this}'s panel flies open with a flurry of sparks!</span>`);
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// clock_powerdrain.dm:30
rt.def("/obj/item/weapon/stock_parts/cell/proc/power_drain", function* power_drain(f: Frame, clockcult_user: Value) {
	if (!this.charge) return f.dot;
	f.dot = min(this.charge, 250);
	this.charge = (yield* this.use(f.dot));
	yield* this.update_icon();
	return f.dot;
}, true);

// clock_powerdrain.dm:36
rt.def("/obj/machinery/light/proc/power_drain", function power_drain(f: Frame, clockcult_user: Value) {
	if (!this.on) return f.dot;
	playsound(this, rt.rsc("sound/effects/light_flicker.ogg"), 50, 1);
	f.dot = 250;
	if (!prob(50)) return f.dot;
	this.burn_out();
	return f.dot;
});

// clock_powerdrain.dm:42
rt.def("/mob/living/silicon/robot/proc/power_drain", function* power_drain(f: Frame, clockcult_user: Value) {
	if (!((!clockcult_user || !is_servant_of_ratvar(this)) && this.cell && this.cell.charge)) return f.dot;
	f.dot = min(this.cell.charge, 250);
	yield* this.cell.use(f.dot);
	if (prob(20)) {
		to_chat(this, "<span class='userdanger'>ERROR: Power loss detected!</span>");
	}
	yield* this.spark_system.start();
	return f.dot;
}, true);

// clock_powerdrain.dm:50
rt.def("/obj/mecha/proc/power_drain", function* power_drain(f: Frame, clockcult_user: Value) {
	if (!((!clockcult_user || !this.occupant || this.occupant && !is_servant_of_ratvar(this.occupant)) && this.cell && this.cell.charge)) return f.dot;
	f.dot = min(this.cell.charge, 250);
	yield* this.cell.use(f.dot);
	if (prob(20)) {
		this.occupant_message("<span class='userdanger'>Power loss detected!</span>");
	}
	yield* this.spark_system.start();
	return f.dot;
}, true);
