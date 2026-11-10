// Based on /tg/station's code/datums/wires/mulebot.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(1069, "/datum/wires/mulebot", "/datum/wires", {
	holder_type: rt.typePath("/mob/living/simple_animal/bot/mulebot"),
	randomize: 1,
});

// mulebot.dm:12
rt.def("/datum/wires/mulebot/proc/New", function New(f: Frame, holder: Value) {
	this.wires = list("Main Power 1", "Main Power 2", "Avoidance", "Load Check", "Motor 1", "Motor 2", "Recieve", "Transmit", "Beacon");
	parent_proc();
	return f.dot;
}, false);

// mulebot.dm:15
rt.def("/datum/wires/mulebot/proc/interactable", function interactable(f: Frame, user: Value) {
	let M: Value = null;
	if (!(M = this.holder).open) return f.dot;
	return 1;
});

// mulebot.dm:20
rt.def("/datum/wires/mulebot/proc/on_pulse", function on_pulse(f: Frame, wire: Value) {
	let M: Value = this.holder;
	if (wire === "Main Power 1" || wire === "Main Power 2") {
		this.holder.visible_message(`<span class='notice'>${bicon(M)} The charge light flickers.</span>`);
	} else if (wire === "Avoidance") {
		this.holder.visible_message(`<span class='notice'>${bicon(M)} The external warning lights flash briefly.</span>`);
	} else if (wire === "Load Check") {
		this.holder.visible_message(`<span class='notice'>${bicon(M)} The load platform clunks.</span>`);
	} else if (wire === "Motor 1" || wire === "Motor 2") {
		this.holder.visible_message(`<span class='notice'>${bicon(M)} The drive motor whines briefly.</span>`);
	} else {
		this.holder.visible_message(`<span class='notice'>${bicon(M)} You hear a radio crackle.</span>`);
	}
	return f.dot;
});
