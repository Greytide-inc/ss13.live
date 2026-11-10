// Based on /tg/station's code/game/gamemodes/changeling/powers/linglink.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11237, "/obj/effect/proc_holder/changeling/linglink", "/obj/effect/proc_holder/changeling", {
	chemical_cost: 0,
	dna_cost: 0,
	req_human: 1,
	name: "Hivemind Link",
	desc: "Link your victim's mind into the hivemind for personal interrogation",
});

// linglink.dm:9
rt.def("/obj/effect/proc_holder/changeling/linglink/proc/can_sting", function can_sting(f: Frame, user: Value) {
	let changeling: Value = null, target: Value = null;
	if (!parent_proc()) {
		return f.dot;
	}
	if ((changeling = user.mind.changeling).islinking) {
		to_chat(user, "<span class='warning'>We have already formed a link with the victim!</span>");
		return f.dot;
	}
	if (!user.pulling) {
		to_chat(user, "<span class='warning'>We must be tightly grabbing a creature to link with them!</span>");
		return f.dot;
	}
	if (!rt.istype(user.pulling, T("/mob/living/carbon"))) {
		to_chat(user, "<span class='warning'>We cannot link with this creature!</span>");
		return f.dot;
	}
	if (!(target = user.pulling).mind) {
		to_chat(user, "<span class='warning'>The victim has no mind to link to!</span>");
		return f.dot;
	}
	if (target.stat == 2) {
		to_chat(user, "<span class='warning'>The victim is dead, you cannot link to a dead mind!</span>");
		return f.dot;
	}
	if (target.mind.changeling) {
		to_chat(user, "<span class='warning'>The victim is already a part of the hivemind!</span>");
		return f.dot;
	}
	if (user.grab_state <= 1) {
		to_chat(user, "<span class='warning'>We must have a tighter grip to link with this creature!</span>");
		return f.dot;
	}
	return changeling.can_absorb_dna(user, target);
}, false);

// linglink.dm:37
rt.def("/obj/effect/proc_holder/changeling/linglink/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let i: Value = null, M: Value = null;
	let $e: any;
	let changeling: Value = user.mind.changeling;
	let target: Value = user.pulling;
	changeling.islinking = 1;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (i === 1) {
			to_chat(user, "<span class='notice'>This creature is compatible. We must hold still...</span>");
		} else if (i === 2) {
			to_chat(user, `<span class='notice'>We stealthily stab ${target} with a minor proboscis...</span>`);
			to_chat(target, "<span class='userdanger'>You experience a stabbing sensation and your ears begin to ring...</span>");
		} else if (i === 3) {
			to_chat(user, `<span class='notice'>We mold the ${target}'s mind like clay, granting ${target.p_them()} the ability to speak in the hivemind!</span>`);
			to_chat(target, "<span class='userdanger'>A migraine throbs behind your eyes, you hear yourself screaming - but your mouth has not opened!</span>");
			M = null;
			for (M of each(GLOB.mob_list, T("/mob"))) {
				if (M.lingcheck() == 2) {
					to_chat(M, "<i><font color=#800080>We can sense a foreign presence in the hivemind...</font></i>");
				}
			}
			target.mind.linglink = 1;
			yield* target.say(":g AAAAARRRRGGGGGHHHHH!!");
			to_chat(target, "<font color=#800040><span class='boldannounce'>You can now communicate in the changeling hivemind, say \":g message\" to communicate!</span>");
			yield* target.reagents.add_reagent("salbutamol", 40);
			yield* sleep(1800);
		}
		if (!(yield* do_mob(user, target, 20))) {
			to_chat(user, `<span class='warning'>Our link with ${target} has ended!</span>`);
			changeling.islinking = 0;
			target.mind.linglink = 0;
			return f.dot;
		}
	}
	rt.endFor(f, 0);
	changeling.islinking = 0;
	target.mind.linglink = 0;
	to_chat(user, "<span class='notice'>You cannot sustain the connection any longer, your victim fades from the hivemind</span>");
	to_chat(target, "<span class='userdanger'>The link cannot be sustained any longer, your connection to the hivemind has faded!</span>");
	return f.dot;
}, true);
