// Based on /tg/station's code/modules/mob/living/ventcrawling.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// ventcrawling.dm:2
rt.def("/datum/controller/global_vars/proc/InitGlobalventcrawl_machinery", function InitGlobalventcrawl_machinery(f: Frame) {
	GLOB.ventcrawl_machinery = typecacheof(list(T("/obj/machinery/atmospherics/components/unary/vent_pump"), T("/obj/machinery/atmospherics/components/unary/vent_scrubber")));
	this.gvars_datum_init_order += "ventcrawl_machinery";
	return f.dot;
});

// ventcrawling.dm:9
rt.def("/mob/living/proc/handle_ventcrawl", function* handle_ventcrawl(f: Frame, A: Value) {
	let vent_found: Value = null, machine: Value = null, vent_found_parent: Value = null, failed: Value = null, items_list: Value = null, I: Value = null;
	let $e: any;
	if (!this.ventcrawler || !this.Adjacent(A)) {
		return f.dot;
	}
	if (this.stat) {
		to_chat(this, "You must be conscious to do this!");
		return f.dot;
	}
	if (this.lying) {
		to_chat(this, "You can't vent crawl while you're stunned!");
		return f.dot;
	}
	if (this.restrained()) {
		to_chat(this, "You can't vent crawl while you're restrained!");
		return f.dot;
	}
	if (this.has_buckled_mobs()) {
		to_chat(this, "You can't vent crawl with other creatures on you!");
		return f.dot;
	}
	if (this.buckled) {
		to_chat(this, "You can't vent crawl while buckled!");
		return f.dot;
	}
	if (A) {
		if (!rt.istype((vent_found = A), T("/obj/machinery/atmospherics/components/unary")) || !vent_found.can_crawl_through()) {
			vent_found = null;
		}
	}
	if (!vent_found) {
		for (machine of each(range(1, this), T("/obj/machinery/atmospherics"))) {
			if (is_type_in_typecache(machine, GLOB.ventcrawl_machinery)) {
				vent_found = machine;
			}
			if (!vent_found.can_crawl_through()) {
				vent_found = null;
			}
			if (vent_found) {
				break;
			}
		}
	}
	if (vent_found) {
		if ((vent_found_parent = rt.index(vent_found.parents, 1)) && (rt.len(f, vent_found_parent.members) || vent_found_parent.other_atmosmch)) {
			this.visible_message(`<span class='notice'>${this} begins climbing into the ventilation system...</span>`, "<span class='notice'>You begin climbing into the ventilation system...</span>");
			if (!(yield* do_after(this, 25, { target: vent_found }))) {
				return f.dot;
			}
			if (!this.client) {
				return f.dot;
			}
			if (rt.istype(this, T("/mob/living/carbon")) && this.ventcrawler < 2) {
				failed = 0;
				if (rt.len(f, (items_list = this.get_equipped_items()))) {
					failed = 1;
				}
				rt.forList(f, 0, this.held_items, T("/obj/item"));
				if (($e = rt.next(f, 0)) !== undefined) {
					I = $e;
					failed = 1;
				}
				rt.endFor(f, 0);
				if (failed) {
					to_chat(this, "<span class='warning'>You can't crawl around in the ventilation ducts with items!</span>");
					return f.dot;
				}
			}
			this.visible_message(`<span class='notice'>${this} scrambles into the ventilation ducts!</span>`, "<span class='notice'>You climb into the ventilation ducts.</span>");
			yield* this.forceMove(vent_found);
		}
	} else {
		to_chat(this, "<span class='warning'>This ventilation duct is not connected to anything!</span>");
	}
	return f.dot;
}, true);

// ventcrawling.dm:77
rt.def("/mob/living/simple_animal/slime/proc/handle_ventcrawl", function* handle_ventcrawl(f: Frame, A: Value) {
	if (this.buckled) {
		to_chat(this, "<i>I can't vent crawl while feeding...</i>");
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// ventcrawling.dm:83
rt.def("/mob/living/proc/add_ventcrawl", function add_ventcrawl(f: Frame, starting_machine: Value) {
	let _P: Value = null, X: Value = null, A: Value = null;
	if (!rt.istype(starting_machine, T("/obj/machinery/atmospherics")) || !starting_machine.can_see_pipes()) {
		return f.dot;
	}
	let totalMembers: Value = list();
	for (_P of each(starting_machine.returnPipenets(), T("/datum/pipeline"))) {
		totalMembers += _P.members;
		totalMembers += _P.other_atmosmch;
	}
	if (!rt.len(f, totalMembers)) {
		return f.dot;
	}
	for (X of each(totalMembers)) {
		if (!(A = X).pipe_vision_img) {
			A.pipe_vision_img = image(A, A.loc, { layer: ABOVE_HUD_LAYER, dir: A.dir });
			A.pipe_vision_img.plane = ABOVE_HUD_PLANE;
		}
		this.pipes_shown += A.pipe_vision_img;
		if (this.client) {
			this.client.images += A.pipe_vision_img;
		}
	}
	return f.dot;
});

// ventcrawling.dm:106
rt.def("/mob/living/proc/remove_ventcrawl", function remove_ventcrawl(f: Frame) {
	let current_image: Value = null;
	if (this.client) {
		for (current_image of each(this.pipes_shown, T("/image"))) {
			this.client.images -= current_image;
		}
	}
	this.pipes_shown.len = 0;
	return f.dot;
});

// ventcrawling.dm:118
rt.def("/mob/living/proc/update_pipe_vision", function update_pipe_vision(f: Frame, new_loc: Value) {
	f.dot = this.loc;
	if (new_loc) {
		f.dot = new_loc;
	}
	this.remove_ventcrawl();
	this.add_ventcrawl(f.dot);
	return f.dot;
});
