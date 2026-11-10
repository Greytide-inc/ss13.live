// Based on BYOND's Types/Client.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// Client.dm:61
rt.def("/client/proc/New", function* New(f: Frame, TopicData: Value) {
	let M: Value = null, initial_mob: Value = null;
	for (M of each(rt.world(), T("/mob"))) {
		if (M.key == this.key) {
			this.mob = M;
			break;
		}
	}
	if (this.mob === null) {
		this.eye = (initial_mob = (yield* new_(rt.world().mob)));
		this.statobj = initial_mob;
		this.mob = initial_mob;
	}
	return this.mob;
}, true);

// Client.dm:77
rt.def("/client/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value, hsrc: Value) {
	if (hsrc === null) return f.dot;
	yield* hsrc.Topic(href, href_list);
	return f.dot;
}, true);

// Client.dm:81
rt.def("/client/proc/Stat", function* Stat(f: Frame) {
	if (!rt.istype(this.statobj, T("/atom"))) return f.dot;
	yield* this.statobj.Stat();
	return f.dot;
}, true);

// Client.dm:100
rt.def("/client/proc/Move", function* Move(f: Frame, loc: Value, dir: Value) {
	yield* this.mob.Move(loc, dir);
	return f.dot;
}, true);

// Client.dm:104
rt.def("/client/verb/North", function* North(f: Frame) {
	yield* this.Move(rt.getStep(f, this.mob, 1), 1);
	return f.dot;
}, true, { verb: { name: ".north" } });

// Client.dm:108
rt.def("/client/verb/South", function* South(f: Frame) {
	yield* this.Move(rt.getStep(f, this.mob, 2), 2);
	return f.dot;
}, true, { verb: { name: ".south" } });

// Client.dm:112
rt.def("/client/verb/East", function* East(f: Frame) {
	yield* this.Move(rt.getStep(f, this.mob, 4), 4);
	return f.dot;
}, true, { verb: { name: ".east" } });

// Client.dm:116
rt.def("/client/verb/West", function* West(f: Frame) {
	yield* this.Move(rt.getStep(f, this.mob, 8), 8);
	return f.dot;
}, true, { verb: { name: ".west" } });

// Client.dm:120
rt.def("/client/verb/Northeast", function* Northeast(f: Frame) {
	yield* this.Move(rt.getStep(f, this.mob, 5), 5);
	return f.dot;
}, true, { verb: { name: ".northeast" } });

// Client.dm:124
rt.def("/client/verb/Southeast", function* Southeast(f: Frame) {
	yield* this.Move(rt.getStep(f, this.mob, 6), 6);
	return f.dot;
}, true, { verb: { name: ".southeast" } });

// Client.dm:128
rt.def("/client/verb/Southwest", function* Southwest(f: Frame) {
	yield* this.Move(rt.getStep(f, this.mob, 10), 10);
	return f.dot;
}, true, { verb: { name: ".southwest" } });

// Client.dm:132
rt.def("/client/verb/Northwest", function* Northwest(f: Frame) {
	yield* this.Move(rt.getStep(f, this.mob, 9), 9);
	return f.dot;
}, true, { verb: { name: ".northwest" } });

// Client.dm:139
rt.def("/client/proc/Click", function* Click(f: Frame, object: Value, location: Value, control: Value, params: Value) {
	yield* object.Click(location, control, params);
	return f.dot;
}, true);

// Client.dm:142
rt.def("/client/proc/DblClick", function* DblClick(f: Frame, object: Value, location: Value, control: Value, params: Value) {
	yield* object.DblClick(location, control, params);
	return f.dot;
}, true);

// Client.dm:146
rt.def("/client/proc/MouseDown", function MouseDown(f: Frame, object: Value, location: Value, control: Value, params: Value) {
	object.MouseDown(location, control, params);
	return f.dot;
});

// Client.dm:150
rt.def("/client/proc/MouseDrag", function MouseDrag(f: Frame, src_object: Value, over_object: Value, src_location: Value, over_location: Value, src_control: Value, over_control: Value, params: Value) {
	src_object.MouseDrag(over_object, src_location, over_location, src_control, over_control, params);
	return f.dot;
});

// Client.dm:153
rt.def("/client/proc/MouseDrop", function* MouseDrop(f: Frame, src_object: Value, over_object: Value, src_location: Value, over_location: Value, src_control: Value, over_control: Value, params: Value) {
	yield* src_object.MouseDrop(over_object, src_location, over_location, src_control, over_control, params);
	return f.dot;
}, true);

// Client.dm:157
rt.def("/client/proc/MouseEntered", function* MouseEntered(f: Frame, object: Value, location: Value, control: Value, params: Value) {
	yield* object.MouseEntered(location, control, params);
	return f.dot;
}, true);

// Client.dm:161
rt.def("/client/proc/MouseExited", function* MouseExited(f: Frame, object: Value, location: Value, control: Value, params: Value) {
	yield* object.MouseExited(location, control, params);
	return f.dot;
}, true);

// Client.dm:165
rt.def("/client/proc/MouseMove", function MouseMove(f: Frame, object: Value, location: Value, control: Value, params: Value) {
	object.MouseMove(location, control, params);
	return f.dot;
});

// Client.dm:169
rt.def("/client/proc/MouseUp", function MouseUp(f: Frame, object: Value, location: Value, control: Value, params: Value) {
	object.MouseUp(location, control, params);
	return f.dot;
});

// Client.dm:173
rt.def("/client/proc/MouseWheel", function* MouseWheel(f: Frame, object: Value, delta_x: Value, delta_y: Value, location: Value, control: Value, params: Value) {
	yield* object.MouseWheel(delta_x, delta_y, location, control, params);
	return f.dot;
}, true);
