// From code/modules/admin/secrets.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/admins/proc/Secrets  (code/modules/admin/secrets.dm:2)
rt.def("/datum/admins/proc/Secrets", function Secrets(f: Frame) {
	let dat: Value = null;
	f.vars = () => [dat];
	if (!truthy(rt.call(f, P("/proc/check_rights"), null, [0]))) {
		return live(f.dot);
	}
	dat = rt.list("<B>The first rule of adminbuse is: you don't talk about the adminbuse.</B><HR>");
	dat = rt.modify(live(dat), fmt("\n\t\t\t<B>General Secrets</B><BR>\n\t\t\t<BR>\n\t\t\t<A href='?src=＃;secrets=list_job_debug'>Show Job Debug</A><BR>\n\t\t\t<A href='?src=＃;secrets=admin_log'>Admin Log</A><BR>\n\t\t\t<A href='?src=＃;secrets=show_admins'>Show Admin List</A><BR>\n\t\t\t<BR>\n\t\t\t", [live(f.src), live(f.src), live(f.src)]), add);
	if (truthy(rt.call(f, P("/proc/check_rights"), null, [2, 0]))) {
		dat = rt.modify(live(dat), fmt("\n\t\t\t<B>Admin Secrets</B><BR>\n\t\t\t<BR>\n\t\t\t<A href='?src=＃;secrets=clear_virus'>Cure all diseases currently in existence</A><BR>\n\t\t\t<A href='?src=＃;secrets=list_bombers'>Bombing List</A><BR>\n\t\t\t<A href='?src=＃;secrets=check_antagonist'>Show current traitors and objectives</A><BR>\n\t\t\t<A href='?src=＃;secrets=list_signalers'>Show last ＀ signalers</A><BR>\n\t\t\t<A href='?src=＃;secrets=list_lawchanges'>Show last ＀ law changes</A><BR>\n\t\t\t<A href='?src=＃;secrets=showailaws'>Show AI Laws</A><BR>\n\t\t\t<A href='?src=＃;secrets=showgm'>Show Game Mode</A><BR>\n\t\t\t<A href='?src=＃;secrets=manifest'>Show Crew Manifest</A><BR>\n\t\t\t<A href='?src=＃;secrets=DNA'>List DNA (Blood)</A><BR>\n\t\t\t<A href='?src=＃;secrets=fingerprints'>List Fingerprints</A><BR>\n\t\t\t<A href='?src=＃;secrets=ctfbutton'>Enable/Disable CTF</A><BR><BR>\n\t\t\t<A href='?src=＃;secrets=tdomereset'>Reset Thunderdome to default state</A><BR>\n\t\t\t<A href='?src=＃;secrets=set_name'>Rename Station Name</A><BR>\n\t\t\t<A href='?src=＃;secrets=reset_name'>Reset Station Name</A><BR>\n\t\t\t<BR>\n\t\t\t<B>Shuttles</B><BR>\n\t\t\t<BR>\n\t\t\t<A href='?src=＃;secrets=moveferry'>Move Ferry</A><BR>\n\t\t\t<A href='?src=＃;secrets=togglearrivals'>Toggle Arrivals Ferry</A><BR>\n\t\t\t<A href='?src=＃;secrets=moveminingshuttle'>Move Mining Shuttle</A><BR>\n\t\t\t<A href='?src=＃;secrets=movelaborshuttle'>Move Labor Shuttle</A><BR>\n\t\t\t<BR>\n\t\t\t", [live(f.src), live(f.src), live(f.src), live(f.src), rt.length(rt.gl("lastsignalers")), live(f.src), rt.length(rt.gl("lawchanges")), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src)]), add);
	}
	if (truthy(rt.call(f, P("/proc/check_rights"), null, [8, 0]))) {
		dat = rt.modify(live(dat), fmt("\n\t\t\t<B>Fun Secrets</B><BR>\n\t\t\t<BR>\n\n\t\t\t<A href='?src=＃;secrets=virus'>Trigger a Virus Outbreak</A><BR>\n\t\t\t<A href='?src=＃;secrets=monkey'>Turn all humans into monkeys</A><BR>\n\t\t\t<A href='?src=＃;secrets=anime'>Chinese Cartoons</A><BR>\n\t\t\t<A href='?src=＃;secrets=allspecies'>Change the species of all humans</A><BR>\n\t\t\t<A href='?src=＃;secrets=power'>Make all areas powered</A><BR>\n\t\t\t<A href='?src=＃;secrets=unpower'>Make all areas unpowered</A><BR>\n\t\t\t<A href='?src=＃;secrets=quickpower'>Power all SMES</A><BR>\n\t\t\t<A href='?src=＃;secrets=tripleAI'>Triple AI mode (needs to be used in the lobby)</A><BR>\n\t\t\t<A href='?src=＃;secrets=traitor_all'>Everyone is the traitor</A><BR>\n\t\t\t<A href='?src=＃;secrets=guns'>Summon Guns</A><BR>\n\t\t\t<A href='?src=＃;secrets=magic'>Summon Magic</A><BR>\n\t\t\t<A href='?src=＃;secrets=events'>Summon Events (Toggle)</A><BR>\n\t\t\t<A href='?src=＃;secrets=onlyone'>There can only be one!</A><BR>\n\t\t\t<A href='?src=＃;secrets=delayed_onlyone'>There can only be one! (40-second delay)</A><BR>\n\t\t\t<A href='?src=＃;secrets=onlyme'>There can only be me!</A><BR>\n\t\t\t<A href='?src=＃;secrets=retardify'>Make all players retarded</A><BR>\n\t\t\t<A href='?src=＃;secrets=eagles'>Egalitarian Station Mode</A><BR>\n\t\t\t<A href='?src=＃;secrets=blackout'>Break all lights</A><BR>\n\t\t\t<A href='?src=＃;secrets=whiteout'>Fix all lights</A><BR>\n\t\t\t<A href='?src=＃;secrets=floorlava'>The floor is lava! (DANGEROUS: extremely lame)</A><BR>\n\t\t\t<BR>\n\t\t\t<A href='?src=＃;secrets=changebombcap'>Change bomb cap</A><BR>\n\t\t\t<A href='?src=＃;secrets=masspurrbation'>Mass Purrbation</A><BR>\n\t\t\t<A href='?src=＃;secrets=massremovepurrbation'>Mass Remove Purrbation</A><BR>\n\t\t\t", [live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src)]), add);
	}
	dat = rt.modify(live(dat), "<BR>", add);
	if (truthy(rt.call(f, P("/proc/check_rights"), null, [32, 0]))) {
		dat = rt.modify(live(dat), fmt("\n\t\t\t<B>Security Level Elevated</B><BR>\n\t\t\t<BR>\n\t\t\t<A href='?src=＃;secrets=maint_access_engiebrig'>Change all maintenance doors to engie/brig access only</A><BR>\n\t\t\t<A href='?src=＃;secrets=maint_access_brig'>Change all maintenance doors to brig access only</A><BR>\n\t\t\t<A href='?src=＃;secrets=infinite_sec'>Remove cap on security officers</A><BR>\n\t\t\t<BR>\n\t\t\t", [live(f.src), live(f.src), live(f.src)]), add);
	}
	rt.op(f, "Browse", [], [live(f.usr), rt.callName(f, live(dat), "Join", []), "window=secrets"], false);
	return live(f.dot);
});

// /datum/admins/proc/Secrets_topic  (code/modules/admin/secrets.dm:97)  may sleep
rt.def("/datum/admins/proc/Secrets_topic", function* Secrets_topic(f: Frame, item: Value, href_list: Value) {
	let E: Value = null, ok: Value = null, dat: Value = null, l: Value = null, line: Value = null, job: Value = null, ckey: Value = null, D: Value = null, delete_mobs: Value = null, thunderdome: Value = null, mob: Value = null, obj: Value = null, template: Value = null, choice: Value = null, D_3: Value = null, new_name: Value = null, sig: Value = null, A: Value = null, new_perma: Value = null, t: Value = null, H: Value = null, H_2: Value = null, result: Value = null, newtype: Value = null, H_4: Value = null, objective: Value = null, traitordatum: Value = null, new_objective: Value = null, newBombCap: Value = null, L: Value = null, animetype: Value = null, droptype: Value = null, honorifics: Value = null, names: Value = null, forename: Value = null, newname: Value = null, seifuku: Value = null, I: Value = null, olduniform: Value = null, virus: Value = null, DO: Value = null, W: Value = null, survivor_probability: Value = null, B: Value = null, M: Value = null, J: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [item, href_list, E, ok, dat, l, line, job, ckey, D, delete_mobs, thunderdome, mob, obj, template, choice, D_3, new_name, sig, A, new_perma, t, H, H_2, result, newtype, H_4, objective, traitordatum, new_objective, newBombCap, L, animetype, droptype, honorifics, names, forename, newname, seifuku, I, olduniform, virus, DO, W, survivor_probability, B, M, J, $0, $1, $e];
	E = null;
	ok = 0;
	$0 = live(item);
	if ($0 === "admin_log") {
		dat = "<B>Admin Log<HR></B>";
		l = null;
		rt.forList(f, 0, rt.gl("admin_log"));
		while (($e = rt.next(f, 0)) !== undefined) {
			l = $e;
			dat = rt.modify(live(dat), fmt("<li>＀</li>", [live(l)]), add);
		}
		rt.endFor(f, 0);
		if (!truthy(rt.len(f, rt.gl("admin_log")))) {
			dat = rt.modify(live(dat), "No-one has done anything this round!", add);
		}
		rt.op(f, "Browse", [], [live(f.usr), live(dat), "window=admin_log"], false);
	} else if ($0 === "list_job_debug") {
		dat = "<B>Job Debug info.</B><HR>";
		if (truthy(rt.gl("SSjob"))) {
			line = null;
			rt.forList(f, 0, rt.fv(f, "job_debug", rt.gl("SSjob")));
			while (($e = rt.next(f, 0)) !== undefined) {
				line = $e;
				dat = rt.modify(live(dat), fmt("＀<BR>", [live(line)]), add);
			}
			rt.endFor(f, 0);
			dat = rt.modify(live(dat), "*******<BR><BR>", add);
			job = null;
			rt.forList(f, 0, rt.fv(f, "occupations", rt.gl("SSjob")), T("/datum/job"));
			while (($e = rt.next(f, 0)) !== undefined) {
				job = $e;
				if (!truthy(live(job))) {
					continue;
				}
				dat = rt.modify(live(dat), fmt("job: ＀, current_positions: ＀, total_positions: ＀ <BR>", [rt.fv(f, "title", live(job)), rt.fv(f, "current_positions", live(job)), rt.fv(f, "total_positions", live(job))]), add);
			}
			rt.endFor(f, 0);
			rt.op(f, "Browse", [], [live(f.usr), live(dat), "window=jobdebug;size=600x500"], false);
		}
	} else if ($0 === "show_admins") {
		dat = "<B>Current admins:</B><HR>";
		if (truthy(rt.gl("admin_datums"))) {
			ckey = null;
			rt.forList(f, 0, rt.gl("admin_datums"));
			while (($e = rt.next(f, 0)) !== undefined) {
				ckey = $e;
				D = rt.index(rt.gl("admin_datums"), live(ckey));
				dat = rt.modify(live(dat), fmt("＀ - ＀<br>", [live(ckey), rt.gv(f, "name", rt.fv(f, "rank", live(D)))]), add);
			}
			rt.endFor(f, 0);
			rt.op(f, "Browse", [], [live(f.usr), live(dat), "window=showadmins;size=600x500"], false);
		}
	} else if ($0 === "tdomereset") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
			return live(f.dot);
		}
		if (isEqual((delete_mobs = (yield* g.call(f, P("/proc/alert"), null, ["Clear all mobs?", "Confirm", "Yes", "No", "Cancel"]))), "Cancel")) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ reset the thunderdome to default with delete_mobs==＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(delete_mobs)]), 1]);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ reset the thunderdome to default with delete_mobs==＀.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(delete_mobs)])]);
		thunderdome = rt.locateIn(f, T("/area/tdome/arena"), rt.world());
		if (isEqual(live(delete_mobs), "Yes")) {
			mob = null;
			rt.forList(f, 0, live(thunderdome), T("/mob/living"));
			while (($e = rt.next(f, 0)) !== undefined) {
				mob = $e;
				yield* g.call(f, P("/proc/qdel"), null, [live(mob)]);
			}
			rt.endFor(f, 0);
		}
		obj = null;
		rt.forList(f, 0, live(thunderdome), T("/obj"));
		while (($e = rt.next(f, 0)) !== undefined) {
			obj = $e;
			if (!truthy((rt.istype(live(obj), T("/obj/machinery/camera")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/qdel"), null, [live(obj)]);
			}
		}
		rt.endFor(f, 0);
		yield* g.callName(f, (template = rt.locateIn(f, T("/area/tdome/arena_source"), rt.world())), "copy_contents_to", [live(thunderdome)]);
	} else if ($0 === "clear_virus") {
		if (isEqual((choice = (yield* g.op(f, "Prompt", [0], [null, null, null, "Are you sure you want to cure all disease?", rt.list("Yes", "Cancel")]))), "Yes")) {
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has cured all diseases.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
			D_3 = null;
			rt.forList(f, 0, rt.fv(f, "processing", rt.gl("SSdisease")), T("/datum/disease"));
			while (($e = rt.next(f, 0)) !== undefined) {
				D_3 = $e;
				yield* g.callName(f, live(D_3), "cure", [live(D_3)]);
			}
			rt.endFor(f, 0);
		}
	} else if ($0 === "set_name") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
			return live(f.dot);
		}
		if (!truthy((new_name = (yield* g.op(f, "Prompt", [3], ["", "What?", "Please input a new name for the station.", live(f.usr), null]))))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/set_station_name"), null, [live(new_name)]);
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ renamed the station to \"＀\".", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(new_name)])]);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ renamed the station to: ＀.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(new_name)])]);
		yield* g.call(f, P("/proc/priority_announce"), null, [fmt("＀ has renamed the station to \"＀\".", [(yield* g.call(f, P("/proc/command_name"), null, [])), live(new_name)])]);
	} else if ($0 === "reset_name") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/set_station_name"), null, [(new_name = (yield* g.call(f, P("/proc/new_station_name"), null, [])))]);
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ reset the station name.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ reset the station name.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
		yield* g.call(f, P("/proc/priority_announce"), null, [fmt("＀ has renamed the station to \"＀\".", [(yield* g.call(f, P("/proc/command_name"), null, [])), live(new_name)])]);
	} else if ($0 === "list_bombers") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
			return live(f.dot);
		}
		dat = "<B>Bombing List</B><HR>";
		l = null;
		rt.forList(f, 0, rt.gl("bombers"));
		while (($e = rt.next(f, 0)) !== undefined) {
			l = $e;
			dat = rt.modify(live(dat), fmt("＀<BR>", [live(l)]), add);
		}
		rt.endFor(f, 0);
		rt.op(f, "Browse", [], [live(f.usr), live(dat), "window=bombers"], false);
	} else if ($0 === "list_signalers") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
			return live(f.dot);
		}
		dat = fmt("<B>Showing last ＀ signalers.</B><HR>", [rt.length(rt.gl("lastsignalers"))]);
		sig = null;
		rt.forList(f, 0, rt.gl("lastsignalers"));
		while (($e = rt.next(f, 0)) !== undefined) {
			sig = $e;
			dat = rt.modify(live(dat), fmt("＀<BR>", [live(sig)]), add);
		}
		rt.endFor(f, 0);
		rt.op(f, "Browse", [], [live(f.usr), live(dat), "window=lastsignalers;size=800x500"], false);
	} else if ($0 === "list_lawchanges") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
			return live(f.dot);
		}
		dat = fmt("<B>Showing last ＀ law changes.</B><HR>", [rt.length(rt.gl("lawchanges"))]);
		sig = null;
		rt.forList(f, 0, rt.gl("lawchanges"));
		while (($e = rt.next(f, 0)) !== undefined) {
			sig = $e;
			dat = rt.modify(live(dat), fmt("＀<BR>", [live(sig)]), add);
		}
		rt.endFor(f, 0);
		rt.op(f, "Browse", [], [live(f.usr), live(dat), "window=lawchanges;size=800x500"], false);
	} else if ($0 === "moveminingshuttle") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
			return live(f.dot);
		}
		if (!truthy((yield* g.callName(f, rt.gl("SSshuttle"), "toggleShuttle", ["mining", "mining_home", "mining_away"])))) {
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ moved mining shuttle", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
			yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ moved the mining shuttle", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
		}
	} else if ($0 === "movelaborshuttle") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
			return live(f.dot);
		}
		if (!truthy((yield* g.callName(f, rt.gl("SSshuttle"), "toggleShuttle", ["laborcamp", "laborcamp_home", "laborcamp_away"])))) {
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ moved labor shuttle", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
			yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ moved the labor shuttle", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
		}
	} else if ($0 === "moveferry") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
			return live(f.dot);
		}
		if (!truthy((yield* g.callName(f, rt.gl("SSshuttle"), "toggleShuttle", ["ferry", "ferry_home", "ferry_away"])))) {
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ moved the centcom ferry", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
			yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ moved the centcom ferry", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
		}
	} else if ($0 === "togglearrivals") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
			return live(f.dot);
		}
		if (truthy((A = rt.fv(f, "arrivals", rt.gl("SSshuttle"))))) {
			new_perma = (!truthy(rt.fv(f, "perma_docked", live(A))) ? 1 : 0);
			rt.setFv(f, "perma_docked", live(A), live(new_perma));
			$0 = (yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]));
			if (truthy(live(new_perma))) {
				$1 = "stopped";
			} else {
				$1 = "started";
			}
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ ＀ the arrivals shuttle", [$0, $1])]);
			$0 = (yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]));
			if (truthy(live(new_perma))) {
				$1 = "stopped";
			} else {
				$1 = "started";
			}
			yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ ＀ the arrivals shuttle", [$0, $1])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='admin'>There is no arrivals shuttle</span>"]);
		}
	} else if ($0 === "showailaws") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
			return live(f.dot);
		}
		yield* g.srcCall(f, "output_ai_laws");
	} else if ($0 === "showgm") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
			return live(f.dot);
		}
		if (!truthy((yield* g.callName(f, rt.gl("SSticker"), "HasRoundStarted", [])))) {
			yield* g.call(f, P("/proc/alert"), null, ["The game hasn't started yet!"]);
		} else {
			if (truthy(rt.fv(f, "mode", rt.gl("SSticker")))) {
				yield* g.call(f, P("/proc/alert"), null, [fmt("The game mode is ＀", [rt.gv(f, "name", rt.fv(f, "mode", rt.gl("SSticker")))])]);
			} else {
				yield* g.call(f, P("/proc/alert"), null, ["For some reason there's a SSticker, but not a game mode"]);
			}
		}
	} else if ($0 === "manifest") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
			return live(f.dot);
		}
		dat = "<B>Showing Crew Manifest.</B><HR>";
		dat = rt.modify(live(dat), "<table cellspacing=5><tr><th>Name</th><th>Position</th></tr>", add);
		t = null;
		rt.forList(f, 0, rt.fv(f, "general", rt.gl("data_core")), T("/datum/data/record"));
		while (($e = rt.next(f, 0)) !== undefined) {
			t = $e;
			dat = rt.modify(live(dat), fmt("<tr><td>＀</td><td>＀</td></tr>", [rt.index(rt.fv(f, "fields", live(t)), "name"), rt.index(rt.fv(f, "fields", live(t)), "rank")]), add);
		}
		rt.endFor(f, 0);
		dat = rt.modify(live(dat), "</table>", add);
		rt.op(f, "Browse", [], [live(f.usr), live(dat), "window=manifest;size=440x410"], false);
	} else if ($0 === "DNA") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
			return live(f.dot);
		}
		dat = "<B>Showing DNA from blood.</B><HR>";
		dat = rt.modify(live(dat), "<table cellspacing=5><tr><th>Name</th><th>DNA</th><th>Blood Type</th></tr>", add);
		H = null;
		rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/carbon/human"));
		while (($e = rt.next(f, 0)) !== undefined) {
			H = $e;
			if (truthy(rt.fv(f, "ckey", live(H)))) {
				dat = rt.modify(live(dat), fmt("<tr><td>＀</td><td>＀</td><td>＀</td></tr>", [live(H), rt.gv(f, "unique_enzymes", rt.fv(f, "dna", live(H))), rt.gv(f, "blood_type", rt.fv(f, "dna", live(H)))]), add);
			}
		}
		rt.endFor(f, 0);
		dat = rt.modify(live(dat), "</table>", add);
		rt.op(f, "Browse", [], [live(f.usr), live(dat), "window=DNA;size=440x410"], false);
	} else if ($0 === "fingerprints") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
			return live(f.dot);
		}
		dat = "<B>Showing Fingerprints.</B><HR>";
		dat = rt.modify(live(dat), "<table cellspacing=5><tr><th>Name</th><th>Fingerprints</th></tr>", add);
		H = null;
		rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/carbon/human"));
		while (($e = rt.next(f, 0)) !== undefined) {
			H = $e;
			if (truthy(rt.fv(f, "ckey", live(H)))) {
				dat = rt.modify(live(dat), fmt("<tr><td>＀</td><td>＀</td></tr>", [live(H), (yield* g.call(f, P("/proc/md5"), null, [rt.gv(f, "uni_identity", rt.fv(f, "dna", live(H)))]))]), add);
			}
		}
		rt.endFor(f, 0);
		dat = rt.modify(live(dat), "</table>", add);
		rt.op(f, "Browse", [], [live(f.usr), live(dat), "window=fingerprints;size=440x410"], false);
	} else if ($0 === "monkey") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [8])))) {
			return live(f.dot);
		}
		H_2 = null;
		rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/carbon/human"));
		while (($e = rt.next(f, 0)) !== undefined) {
			H_2 = $e;
			rt.spawnTail(f, 0, "/datum/admins/proc/Secrets_topic: spawn at modules/admin/secrets.dm:281", item, href_list, E, ok, dat, l, line, job, ckey, D, delete_mobs, thunderdome, mob, obj, template, choice, D_3, new_name, sig, A, new_perma, t, H, H_2, result, newtype, H_4, objective, traitordatum, new_objective, newBombCap, L, animetype, droptype, honorifics, names, forename, newname, seifuku, I, olduniform, virus, DO, W, survivor_probability, B, M, J);
		}
		rt.endFor(f, 0);
		ok = 1;
	} else if ($0 === "allspecies") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [8])))) {
			return live(f.dot);
		}
		if (truthy((result = (yield* g.op(f, "Prompt", [1], [null, "Species", "Please choose a new species", live(f.usr), rt.gl("species_list")]))))) {
			yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ turned all humans into ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(result)]), 1]);
			yield* g.call(f, P("/proc/message_admins"), null, [fmt(" ＀ turned all humans into ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(result)])]);
			newtype = rt.index(rt.gl("species_list"), live(result));
			H_4 = null;
			rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/carbon/human"));
			while (($e = rt.next(f, 0)) !== undefined) {
				H_4 = $e;
				yield* g.callName(f, live(H_4), "set_species", [live(newtype)]);
			}
			rt.endFor(f, 0);
		}
	} else if ($0 === "tripleAI") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [8])))) {
			return live(f.dot);
		}
		yield* g.callName(f, rt.fv(f, "client", live(f.usr)), "triple_ai", []);
	} else if ($0 === "power") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [8])))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ made all areas powered", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))]), 1]);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ made all areas powered</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
		yield* g.call(f, P("/proc/power_restore"), null, []);
	} else if ($0 === "unpower") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [8])))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ made all areas unpowered", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))]), 1]);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ made all areas unpowered</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
		yield* g.call(f, P("/proc/power_failure"), null, []);
	} else if ($0 === "quickpower") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [8])))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ made all SMESs powered", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))]), 1]);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ made all SMESs powered</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
		yield* g.call(f, P("/proc/power_restore_quick"), null, []);
	} else if ($0 === "traitor_all") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [8])))) {
			return live(f.dot);
		}
		if (!truthy((yield* g.callName(f, rt.gl("SSticker"), "HasRoundStarted", [])))) {
			yield* g.call(f, P("/proc/alert"), null, ["The game hasn't started yet!"]);
			return live(f.dot);
		}
		if (!truthy((objective = (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [(yield* g.op(f, "Prompt", [2], [null, null, null, "Enter an objective", null]))])), 1, 1024]))))) {
			return live(f.dot);
		}
		H = null;
		rt.forList(f, 0, rt.gl("player_list"), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			H = $e;
			if (!(truthy((rt.istype(live(H), T("/mob/living/carbon/human")) ? 1 : 0)) || truthy((rt.istype(live(H), T("/mob/living/silicon")) ? 1 : 0)))) {
				continue;
			}
			if ((((isEqual(rt.fv(f, "stat", live(H)), 2) || !truthy(rt.fv(f, "client", live(H)))) || !truthy(rt.fv(f, "mind", live(H)))) || truthy((rt.istype(live(H), T("/mob/living/silicon/pai")) ? 1 : 0)))) {
				continue;
			}
			if (truthy((yield* g.call(f, P("/proc/is_special_character"), null, [live(H)])))) {
				continue;
			}
			yield* g.callName(f, rt.fv(f, "mind", live(H)), "add_antag_datum", [T("/datum/antagonist/traitor/custom")]);
			traitordatum = (yield* g.callName(f, rt.fv(f, "mind", live(H)), "has_antag_datum", [T("/datum/antagonist/traitor")]));
			rt.setFv(f, "owner", (new_objective = (yield* g.new_(f, T("/datum/objective"), []))), live(H));
			rt.setFv(f, "explanation_text", live(new_objective), live(objective));
			yield* g.callName(f, live(traitordatum), "add_objective", [live(new_objective)]);
			yield* g.callName(f, live(traitordatum), "equip", [0]);
			yield* g.callName(f, live(traitordatum), "greet", []);
		}
		rt.endFor(f, 0);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ used everyone is a traitor secret. Objective is ＀</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(objective)])]);
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ used everyone is a traitor secret. Objective is ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(objective)])]);
	} else if ($0 === "changebombcap") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [8])))) {
			return live(f.dot);
		}
		if (rt.lt((newBombCap = (yield* g.op(f, "Prompt", [33], [rt.gl("MAX_EX_LIGHT_RANGE"), "New Bomb Cap", "What would you like the new bomb cap to be. (entered as the light damage range (the 3rd number in common (1,2,3) notation)) Must be above 4)", live(f.usr), null]))), 4)) {
			return live(f.dot);
		}
		rt.setGl("MAX_EX_DEVESTATION_RANGE", (yield* g.call(f, P("/proc/round"), null, [divide(live(newBombCap), 4)])));
		rt.setGl("MAX_EX_HEAVY_RANGE", (yield* g.call(f, P("/proc/round"), null, [divide(live(newBombCap), 2)])));
		rt.setGl("MAX_EX_LIGHT_RANGE", live(newBombCap));
		rt.setGl("MAX_EX_FLASH_RANGE", live(newBombCap));
		rt.setGl("MAX_EX_FLAME_RANGE", live(newBombCap));
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='boldannounce'>＀ changed the bomb cap to ＀, ＀, ＀</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.gl("MAX_EX_DEVESTATION_RANGE"), rt.gl("MAX_EX_HEAVY_RANGE"), rt.gl("MAX_EX_LIGHT_RANGE")])]);
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ changed the bomb cap to ＀, ＀, ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.gl("MAX_EX_DEVESTATION_RANGE"), rt.gl("MAX_EX_HEAVY_RANGE"), rt.gl("MAX_EX_LIGHT_RANGE")])]);
	} else if ($0 === "blackout") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [8])))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ broke all lights", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
		L = null;
		rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/light"));
		while (($e = rt.next(f, 0)) !== undefined) {
			L = $e;
			yield* g.callName(f, live(L), "break_light_tube", []);
		}
		rt.endFor(f, 0);
	} else if ($0 === "anime") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [8])))) {
			return live(f.dot);
		}
		animetype = (yield* g.call(f, P("/proc/alert"), null, ["Would you like to have the clothes be changed?", null, "Yes", "No", "Cancel"]));
		droptype = null;
		if (isEqual(live(animetype), "Yes")) {
			droptype = (yield* g.call(f, P("/proc/alert"), null, ["Make the uniforms Nodrop?", null, "Yes", "No", "Cancel"]));
		}
		if ((isEqual(live(animetype), "Cancel") || isEqual(live(droptype), "Cancel"))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ made everything kawaii.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
		H_4 = null;
		rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/carbon/human"));
		while (($e = rt.next(f, 0)) !== undefined) {
			H_4 = $e;
			rt.op(f, "Output", [], [live(H_4), (yield* g.call(f, P("/proc/sound"), null, [rt.rsc("sound/ai/animes.ogg")]))], false);
			if (isEqual(rt.gv(f, "id", rt.gv(f, "species", rt.fv(f, "dna", live(H_4)))), "human")) {
				if ((isEqual(rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H_4))), "tail_human"), "None") || isEqual(rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H_4))), "ears"), "None"))) {
					rt.setAt(rt.gv(f, "features", rt.fv(f, "dna", live(H_4))), "tail_human", "Cat");
					rt.setAt(rt.gv(f, "features", rt.fv(f, "dna", live(H_4))), "ears", "Cat");
				}
				honorifics = rt.alist(f, [fmt("＀", ["male"]), rt.list("kun"), fmt("＀", ["female"]), rt.list("chan", "tan"), fmt("＀", ["neuter"]), rt.list("san")]);
				names = (yield* g.call(f, P("/proc/splittext"), null, [rt.fv(f, "real_name", live(H_4)), " "]));
				if (rt.gt(rt.len(f, live(names)), 1)) {
					$0 = rt.index(live(names), 2);
				} else {
					$0 = rt.index(live(names), 1);
				}
				forename = $0;
				newname = fmt("＀-＀", [live(forename), rt.op(f, "PickUnweighted", [1], [rt.index(live(honorifics), fmt("＀", [rt.fv(f, "gender", live(H_4))]))])]);
				yield* g.callName(f, live(H_4), "fully_replace_character_name", [rt.fv(f, "real_name", live(H_4)), live(newname)]);
				yield* g.callName(f, live(H_4), "update_mutant_bodyparts", []);
				if (isEqual(live(animetype), "Yes")) {
					seifuku = rt.op(f, "PickUnweighted", [1], [(yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/clothing/under/schoolgirl")]))]);
					I = (yield* g.new_(f, live(seifuku), []));
					olduniform = rt.fv(f, "w_uniform", live(H_4));
					yield* g.callName(f, live(H_4), "temporarilyRemoveItemFromInventory", [rt.fv(f, "w_uniform", live(H_4)), 1, 0]);
					yield* g.callName(f, live(H_4), "equip_to_slot_or_del", [live(I), 14]);
					yield* g.call(f, P("/proc/qdel"), null, [live(olduniform)]);
					if (isEqual(live(droptype), "Yes")) {
						(rt.modField(f, live(I), "flags", 2, rt.bitOr));
					}
				}
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(H_4), "You're not kawaii enough for this."]);
			}
		}
		rt.endFor(f, 0);
	} else if ($0 === "whiteout") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [8])))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ fixed all lights", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
		L = null;
		rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/light"));
		while (($e = rt.next(f, 0)) !== undefined) {
			L = $e;
			yield* g.callName(f, live(L), "fix", []);
		}
		rt.endFor(f, 0);
	} else if ($0 === "floorlava") {
		yield* g.callName(f, rt.gl("SSweather"), "run_weather", ["the floor is lava"]);
	} else if ($0 === "virus") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [8])))) {
			return live(f.dot);
		}
		$0 = (yield* g.call(f, P("/proc/alert"), null, ["Do you want this to be a random disease or do you have something in mind?", null, "Make Your Own", "Random", "Choose"]));
		if ($0 === "Make Your Own") {
			yield* g.call(f, P("/proc/AdminCreateVirus"), null, [rt.fv(f, "client", live(f.usr))]);
		} else if ($0 === "Random") {
			E = (yield* g.new_(f, T("/datum/round_event/disease_outbreak"), []));
		} else if ($0 === "Choose") {
			virus = (yield* g.op(f, "Prompt", [1], [null, null, "BIOHAZARD", "Choose the virus to spread", (yield* g.call(f, P("/proc/typesof"), null, [T("/datum/disease")]))]));
			E = (yield* g.new_(f, T("/datum/round_event/disease_outbreak"), []));
			rt.setFv(f, "virus_type", (DO = live(E)), live(virus));
		}
	} else if ($0 === "retardify") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [8])))) {
			return live(f.dot);
		}
		H_2 = null;
		rt.forList(f, 0, rt.gl("player_list"), T("/mob/living/carbon/human"));
		while (($e = rt.next(f, 0)) !== undefined) {
			H_2 = $e;
			yield* g.call(f, P("/proc/to_chat"), null, [live(H_2), "<span class='boldannounce'>You suddenly feel stupid.</span>"]);
			yield* g.callName(f, live(H_2), "setBrainLoss", [60]);
		}
		rt.endFor(f, 0);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ made everybody retarded", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
	} else if ($0 === "eagles") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [8])))) {
			return live(f.dot);
		}
		W = null;
		rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/door/airlock"));
		while (($e = rt.next(f, 0)) !== undefined) {
			W = $e;
			if ((((isEqual(rt.fv(f, "z", live(W)), 2) && !truthy((rt.istype((yield* g.call(f, P("/proc/get_area"), null, [live(W)])), T("/area/bridge")) ? 1 : 0))) && !truthy((rt.istype((yield* g.call(f, P("/proc/get_area"), null, [live(W)])), T("/area/crew_quarters")) ? 1 : 0))) && !truthy((rt.istype((yield* g.call(f, P("/proc/get_area"), null, [live(W)])), T("/area/security/prison")) ? 1 : 0)))) {
				rt.setFv(f, "req_access", live(W), rt.list());
			}
		}
		rt.endFor(f, 0);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ activated Egalitarian Station mode", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
		yield* g.call(f, P("/proc/priority_announce"), null, ["Centcom airlock control override activated. Please take this time to get acquainted with your coworkers.", null, rt.rsc("sound/ai/commandreport.ogg")]);
	} else if ($0 === "guns") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [8])))) {
			return live(f.dot);
		}
		survivor_probability = 0;
		$0 = (yield* g.call(f, P("/proc/alert"), null, ["Do you want this to create survivors antagonists?", null, "No Antags", "Some Antags", "All Antags!"]));
		if ($0 === "Some Antags") {
			survivor_probability = 25;
		} else if ($0 === "All Antags!") {
			survivor_probability = 100;
		}
		yield* g.call(f, P("/proc/rightandwrong"), null, [0, live(f.usr), live(survivor_probability)]);
	} else if ($0 === "magic") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [8])))) {
			return live(f.dot);
		}
		survivor_probability = 0;
		$0 = (yield* g.call(f, P("/proc/alert"), null, ["Do you want this to create survivors antagonists?", null, "No Antags", "Some Antags", "All Antags!"]));
		if ($0 === "Some Antags") {
			survivor_probability = 25;
		} else if ($0 === "All Antags!") {
			survivor_probability = 100;
		}
		yield* g.call(f, P("/proc/rightandwrong"), null, [1, live(f.usr), live(survivor_probability)]);
	} else if ($0 === "events") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [8])))) {
			return live(f.dot);
		}
		if (!truthy(rt.fv(f, "wizardmode", rt.gl("SSevents")))) {
			if (isEqual((yield* g.call(f, P("/proc/alert"), null, ["Do you want to toggle summon events on?", null, "Yes", "No"])), "Yes")) {
				yield* g.call(f, P("/proc/summonevents"), null, []);
			}
		} else {
			$0 = (yield* g.call(f, P("/proc/alert"), null, ["What would you like to do?", null, "Intensify Summon Events", "Turn Off Summon Events", "Nothing"]));
			if ($0 === "Intensify Summon Events") {
				yield* g.call(f, P("/proc/summonevents"), null, []);
			} else if ($0 === "Turn Off Summon Events") {
				yield* g.callName(f, rt.gl("SSevents"), "toggleWizardmode", []);
				yield* g.callName(f, rt.gl("SSevents"), "resetFrequency", []);
			}
		}
	} else if ($0 === "dorf") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [8])))) {
			return live(f.dot);
		}
		B = null;
		rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/carbon/human"));
		while (($e = rt.next(f, 0)) !== undefined) {
			B = $e;
			rt.setFv(f, "facial_hair_style", live(B), "Dward Beard");
			yield* g.callName(f, live(B), "update_hair", []);
		}
		rt.endFor(f, 0);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ activated dorf mode", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
	} else if ($0 === "onlyone") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [8])))) {
			return live(f.dot);
		}
		yield* g.callName(f, rt.fv(f, "client", live(f.usr)), "only_one", []);
		yield* g.call(f, P("/proc/send_to_playing_players"), null, [rt.rsc("sound/misc/highlander.ogg")]);
	} else if ($0 === "delayed_onlyone") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [8])))) {
			return live(f.dot);
		}
		yield* g.callName(f, rt.fv(f, "client", live(f.usr)), "only_one_delayed", []);
		yield* g.call(f, P("/proc/send_to_playing_players"), null, [rt.rsc("sound/misc/highlander_delayed.ogg")]);
	} else if ($0 === "onlyme") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [8])))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/only_me"), null, []);
	} else if ($0 === "maint_access_brig") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [32])))) {
			return live(f.dot);
		}
		M = null;
		rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/door/airlock/maintenance"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			yield* g.callName(f, live(M), "check_access", []);
			if (truthy((rt.isIn(f, 12, rt.fv(f, "req_access", live(M))) ? 1 : 0))) {
				rt.setFv(f, "req_access", live(M), rt.list(2));
			}
		}
		rt.endFor(f, 0);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ made all maint doors brig access-only.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
	} else if ($0 === "maint_access_engiebrig") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [32])))) {
			return live(f.dot);
		}
		M = null;
		rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/door/airlock/maintenance"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			yield* g.callName(f, live(M), "check_access", []);
			if (truthy((rt.isIn(f, 12, rt.fv(f, "req_access", live(M))) ? 1 : 0))) {
				rt.setFv(f, "req_access", live(M), rt.list());
				rt.setFv(f, "req_one_access", live(M), rt.list(2, 10));
			}
		}
		rt.endFor(f, 0);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ made all maint doors engineering and brig access-only.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
	} else if ($0 === "infinite_sec") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [32])))) {
			return live(f.dot);
		}
		if (!truthy((J = (yield* g.callName(f, rt.gl("SSjob"), "GetJob", ["Security Officer"]))))) {
			return live(f.dot);
		}
		rt.setFv(f, "total_positions", live(J), -1);
		rt.setFv(f, "spawn_positions", live(J), -1);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has removed the cap on security officers.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
	} else if ($0 === "ctfbutton") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/toggle_all_ctf"), null, [live(f.usr)]);
	} else if ($0 === "masspurrbation") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [8])))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/mass_purrbation"), null, []);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has put everyone on purrbation!", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has put everyone on purrbation.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
	} else if ($0 === "massremovepurrbation") {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [8])))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/mass_remove_purrbation"), null, []);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has removed everyone from purrbation.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has removed everyone from purrbation.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
	}
	if (truthy(live(E))) {
		rt.setFv(f, "processing", live(E), 0);
		if (rt.gt(rt.fv(f, "announceWhen", live(E)), 0)) {
			if (isEqual((yield* g.call(f, P("/proc/alert"), null, [live(f.usr), "Would you like to alert the crew?", "Alert", "Yes", "No"])), "No")) {
				rt.setFv(f, "announceWhen", live(E), -1);
			}
		}
		rt.setFv(f, "processing", live(E), 1);
	}
	if (!truthy(live(f.usr))) return f.dot;
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ used secret ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(item)])]);
	if (!truthy(live(ok))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<B>A secret has been activated by ＀!</B>", [rt.fv(f, "key", live(f.usr))])]);
	return f.dot;
}, true);

// a spawn(0) body of /datum/admins/proc/Secrets_topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/admins/proc/Secrets_topic: spawn at modules/admin/secrets.dm:281", function* (f: Frame, item: Value, href_list: Value, E: Value, ok: Value, dat: Value, l: Value, line: Value, job: Value, ckey: Value, D: Value, delete_mobs: Value, thunderdome: Value, mob: Value, obj: Value, template: Value, choice: Value, D_3: Value, new_name: Value, sig: Value, A: Value, new_perma: Value, t: Value, H: Value, H_2: Value, result: Value, newtype: Value, H_4: Value, objective: Value, traitordatum: Value, new_objective: Value, newBombCap: Value, L: Value, animetype: Value, droptype: Value, honorifics: Value, names: Value, forename: Value, newname: Value, seifuku: Value, I: Value, olduniform: Value, virus: Value, DO: Value, W: Value, survivor_probability: Value, B: Value, M: Value, J: Value) {
	f.vars = () => [item, href_list, E, ok, dat, l, line, job, ckey, D, delete_mobs, thunderdome, mob, obj, template, choice, D_3, new_name, sig, A, new_perma, t, H, H_2, result, newtype, H_4, objective, traitordatum, new_objective, newBombCap, L, animetype, droptype, honorifics, names, forename, newname, seifuku, I, olduniform, virus, DO, W, survivor_probability, B, M, J];
	yield* g.callName(f, live(H_2), "monkeyize", []);
	return null;
});
