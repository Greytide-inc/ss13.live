// Based on /tg/station's code/controllers/subsystem/communications.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(17, "/datum/controller/subsystem/communications", "/datum/controller/subsystem", {
	silicon_message_cooldown: null,
	nonsilicon_message_cooldown: null,
	name: "Communications",
	flags: 3,
});

// communications.dm:4
rt.def("/datum/controller/subsystem/communications/proc/New", function* New(f: Frame) {
	if (GLOB.SScommunications != this) {
		if (rt.istype(GLOB.SScommunications, T("/datum/controller/subsystem/communications"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SScommunications);
		}
		GLOB.SScommunications = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// communications.dm:12
rt.def("/datum/controller/subsystem/communications/proc/can_announce", function can_announce(f: Frame, user: Value, is_silicon: Value) {
	if (is_silicon && this.silicon_message_cooldown > rt.worldTime(f)) {
		f.dot = 0;
	} else if (!is_silicon && this.nonsilicon_message_cooldown > rt.worldTime(f)) {
		f.dot = 0;
	} else {
		f.dot = 1;
	}
	return f.dot;
});

// communications.dm:20
rt.def("/datum/controller/subsystem/communications/proc/make_announcement", function* make_announcement(f: Frame, user: Value, is_silicon: Value, input: Value) {
	if (!this.can_announce(user, is_silicon)) {
		return 0;
	}
	if (is_silicon) {
		minor_announce(input, `${user.name} Announces:`); // tg's own hole: this html_decode()d the already-encoded input, and minor_announce prints its message as it is: raw HTML in every chat
		this.silicon_message_cooldown = rt.worldTime(f) + COMMUNICATION_COOLDOWN;
	} else {
		yield* priority_announce(html_decode(input), null, rt.rsc("sound/misc/announce.ogg"), "Captain");
		this.nonsilicon_message_cooldown = rt.worldTime(f) + COMMUNICATION_COOLDOWN_AI;
	}
	log_say(`${key_name(user)} has made a priority announcement: ${input}`);
	message_admins(`${key_name_admin(user)} has made a priority announcement.`);
	return f.dot;
}, true);
