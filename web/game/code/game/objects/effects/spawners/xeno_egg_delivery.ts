// Based on /tg/station's code/game/objects/effects/spawners/xeno_egg_delivery.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(11890, "/obj/effect/spawner/xeno_egg_delivery", "/obj/effect/spawner", {
	announcement_time: 1200,
	name: "xeno egg delivery",
	icon: rt.rsc("icons/mob/alien.dmi"),
	icon_state: "egg_growing",
});

// xeno_egg_delivery.dm:8
rt.def("/obj/effect/spawner/xeno_egg_delivery/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	let $1: any;
	yield* parent_proc();
	let _T: Value = rt.getStep(f, this, 0);
	let A: Value = get_area(_T);
	yield* new_(T("/obj/structure/alien/egg"), _T);
	yield* new_(T("/obj/effect/temp_visual/gravpush"), _T);
	playsound(_T, rt.rsc("sound/items/party_horn.ogg"), 50, 1, -1);
	let $0: any = A;
	if (_T) {
		$1 = `${`(${_T.x},${_T.y},${_T.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${_T.x};Y=${_T.y};Z=${_T.z}'>JMP</a>)`}`;
	} else {
		$1 = "nonexistent location";
	}
	message_admins(`An alien egg has been delivered to ${$0} at ${`${$1}`}.`);
	log_game(`An alien egg has been delivered to ${A} at ${`(${_T.x},${_T.y},${_T.z})`}`);
	let message: Value = `Attention ${station_name()}, we have entrusted you with a research specimen in ${A}. Remember to follow all safety precautions when dealing with the specimen.`;
	GLOB.SSticker.OnRoundstart((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/addtimer"), (yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/print_command_report"), message)), this.announcement_time)));
	yield* qdel(this);
	return f.dot;
}, true);
