// Based on /tg/station's code/modules/modular_computers/hardware/printer.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(7598, "/obj/item/weapon/computer_hardware/printer", "/obj/item/weapon/computer_hardware", {
	stored_paper: 20,
	max_paper: 30,
	power_usage: 100,
	device_type: "PRINT",
	name: "printer",
	desc: "Computer-integrated printer with paper recycling module.",
	origin_tech: "programming=2;engineering=2",
	icon_state: "printer",
	w_class: 3,
});

// printer.dm:13
rt.def("/obj/item/weapon/computer_hardware/printer/proc/diagnostics", function diagnostics(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, `Paper level: ${this.stored_paper}/${this.max_paper}`);
	return f.dot;
}, false);

// printer.dm:17
rt.def("/obj/item/weapon/computer_hardware/printer/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, `<span class='notice'>Paper level: ${this.stored_paper}/${this.max_paper}</span>`);
	return f.dot;
}, false);

// printer.dm:22
rt.def("/obj/item/weapon/computer_hardware/printer/proc/print_text", function* print_text(f: Frame, text_to_print: Value, paper_title: Value) {
	paper_title ??= "";
	if (!this.stored_paper) {
		return 0;
	}
	if (!this.check_functionality()) {
		return 0;
	}
	let _P: Value = (yield* new_(T("/obj/item/weapon/paper"), rt.getStep(f, this.holder, 0)));
	if (this.damage > this.damage_malfunction) {
		_P.info = stars(text_to_print, 100 - this.malfunction_probability);
	} else {
		_P.info = text_to_print;
	}
	if (paper_title) {
		_P.name = paper_title;
	}
	yield* _P.update_icon();
	_P.reload_fields();
	this.stored_paper--;
	_P = null;
	return 1;
}, true);

// printer.dm:43
rt.def("/obj/item/weapon/computer_hardware/printer/proc/try_insert", function* try_insert(f: Frame, I: Value, user: Value) {
	if (rt.istype(I, T("/obj/item/weapon/paper"))) {
		if (this.stored_paper >= this.max_paper) {
			to_chat(user, fmt("<span class='warning'>You try to add ％！ into ＀, but its paper bin is full!</span>", [I, this]));
			return 0;
		}
		if (user && !(yield* user.temporarilyRemoveItemFromInventory(I))) {
			return 0;
		}
		to_chat(user, fmt("<span class='notice'>You insert ％！ into ＀'s paper recycler.</span>", [I, this]));
		yield* qdel(I);
		this.stored_paper++;
		return 1;
	}
	return 0;
}, true);
