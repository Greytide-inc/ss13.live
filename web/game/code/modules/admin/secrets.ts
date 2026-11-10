// Based on /tg/station's code/modules/admin/secrets.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


// secrets.dm:2
rt.def("/datum/admins/proc/Secrets", function Secrets(f: Frame) {
	if (!check_rights(0)) {
		return f.dot;
	}
	let dat: Value = list("<B>The first rule of adminbuse is: you don't talk about the adminbuse.</B><HR>");
	dat += fmt("\n\t\t\t<B>General Secrets</B><BR>\n\t\t\t<BR>\n\t\t\t<A href='?src=＃;secrets=list_job_debug'>Show Job Debug</A><BR>\n\t\t\t<A href='?src=＃;secrets=admin_log'>Admin Log</A><BR>\n\t\t\t<A href='?src=＃;secrets=show_admins'>Show Admin List</A><BR>\n\t\t\t<BR>\n\t\t\t", [this, this, this]);
	if (check_rights(2, 0)) {
		dat += fmt("\n\t\t\t<B>Admin Secrets</B><BR>\n\t\t\t<BR>\n\t\t\t<A href='?src=＃;secrets=clear_virus'>Cure all diseases currently in existence</A><BR>\n\t\t\t<A href='?src=＃;secrets=list_bombers'>Bombing List</A><BR>\n\t\t\t<A href='?src=＃;secrets=check_antagonist'>Show current traitors and objectives</A><BR>\n\t\t\t<A href='?src=＃;secrets=list_signalers'>Show last ＀ signalers</A><BR>\n\t\t\t<A href='?src=＃;secrets=list_lawchanges'>Show last ＀ law changes</A><BR>\n\t\t\t<A href='?src=＃;secrets=showailaws'>Show AI Laws</A><BR>\n\t\t\t<A href='?src=＃;secrets=showgm'>Show Game Mode</A><BR>\n\t\t\t<A href='?src=＃;secrets=manifest'>Show Crew Manifest</A><BR>\n\t\t\t<A href='?src=＃;secrets=DNA'>List DNA (Blood)</A><BR>\n\t\t\t<A href='?src=＃;secrets=fingerprints'>List Fingerprints</A><BR>\n\t\t\t<A href='?src=＃;secrets=ctfbutton'>Enable/Disable CTF</A><BR><BR>\n\t\t\t<A href='?src=＃;secrets=tdomereset'>Reset Thunderdome to default state</A><BR>\n\t\t\t<A href='?src=＃;secrets=set_name'>Rename Station Name</A><BR>\n\t\t\t<A href='?src=＃;secrets=reset_name'>Reset Station Name</A><BR>\n\t\t\t<BR>\n\t\t\t<B>Shuttles</B><BR>\n\t\t\t<BR>\n\t\t\t<A href='?src=＃;secrets=moveferry'>Move Ferry</A><BR>\n\t\t\t<A href='?src=＃;secrets=togglearrivals'>Toggle Arrivals Ferry</A><BR>\n\t\t\t<A href='?src=＃;secrets=moveminingshuttle'>Move Mining Shuttle</A><BR>\n\t\t\t<A href='?src=＃;secrets=movelaborshuttle'>Move Labor Shuttle</A><BR>\n\t\t\t<BR>\n\t\t\t", [this, this, this, this, rt.length(GLOB.lastsignalers), this, rt.length(GLOB.lawchanges), this, this, this, this, this, this, this, this, this, this, this, this, this]);
	}
	if (check_rights(8, 0)) {
		dat += fmt("\n\t\t\t<B>Fun Secrets</B><BR>\n\t\t\t<BR>\n\n\t\t\t<A href='?src=＃;secrets=virus'>Trigger a Virus Outbreak</A><BR>\n\t\t\t<A href='?src=＃;secrets=monkey'>Turn all humans into monkeys</A><BR>\n\t\t\t<A href='?src=＃;secrets=anime'>Chinese Cartoons</A><BR>\n\t\t\t<A href='?src=＃;secrets=allspecies'>Change the species of all humans</A><BR>\n\t\t\t<A href='?src=＃;secrets=power'>Make all areas powered</A><BR>\n\t\t\t<A href='?src=＃;secrets=unpower'>Make all areas unpowered</A><BR>\n\t\t\t<A href='?src=＃;secrets=quickpower'>Power all SMES</A><BR>\n\t\t\t<A href='?src=＃;secrets=tripleAI'>Triple AI mode (needs to be used in the lobby)</A><BR>\n\t\t\t<A href='?src=＃;secrets=traitor_all'>Everyone is the traitor</A><BR>\n\t\t\t<A href='?src=＃;secrets=guns'>Summon Guns</A><BR>\n\t\t\t<A href='?src=＃;secrets=magic'>Summon Magic</A><BR>\n\t\t\t<A href='?src=＃;secrets=events'>Summon Events (Toggle)</A><BR>\n\t\t\t<A href='?src=＃;secrets=onlyone'>There can only be one!</A><BR>\n\t\t\t<A href='?src=＃;secrets=delayed_onlyone'>There can only be one! (40-second delay)</A><BR>\n\t\t\t<A href='?src=＃;secrets=onlyme'>There can only be me!</A><BR>\n\t\t\t<A href='?src=＃;secrets=retardify'>Make all players retarded</A><BR>\n\t\t\t<A href='?src=＃;secrets=eagles'>Egalitarian Station Mode</A><BR>\n\t\t\t<A href='?src=＃;secrets=blackout'>Break all lights</A><BR>\n\t\t\t<A href='?src=＃;secrets=whiteout'>Fix all lights</A><BR>\n\t\t\t<A href='?src=＃;secrets=floorlava'>The floor is lava! (DANGEROUS: extremely lame)</A><BR>\n\t\t\t<BR>\n\t\t\t<A href='?src=＃;secrets=changebombcap'>Change bomb cap</A><BR>\n\t\t\t<A href='?src=＃;secrets=masspurrbation'>Mass Purrbation</A><BR>\n\t\t\t<A href='?src=＃;secrets=massremovepurrbation'>Mass Remove Purrbation</A><BR>\n\t\t\t", [this, this, this, this, this, this, this, this, this, this, this, this, this, this, this, this, this, this, this, this, this, this, this]);
	}
	dat += "<BR>";
	if (check_rights(32, 0)) {
		dat += fmt("\n\t\t\t<B>Security Level Elevated</B><BR>\n\t\t\t<BR>\n\t\t\t<A href='?src=＃;secrets=maint_access_engiebrig'>Change all maintenance doors to engie/brig access only</A><BR>\n\t\t\t<A href='?src=＃;secrets=maint_access_brig'>Change all maintenance doors to brig access only</A><BR>\n\t\t\t<A href='?src=＃;secrets=infinite_sec'>Remove cap on security officers</A><BR>\n\t\t\t<BR>\n\t\t\t", [this, this, this]);
	}
	rt.op(f, "Browse", [], [f.usr, dat.Join(), "window=secrets"], false);
	return f.dot;
});

// secrets.dm:97
rt.def("/datum/admins/proc/Secrets_topic", function* Secrets_topic(f: Frame, item: Value, href_list: Value) {
	let E: Value = null, dat: Value = null, l: Value = null, line: Value = null, job: Value = null, ckey: Value = null, D: Value = null, delete_mobs: Value = null, thunderdome: Value = null, mob: Value = null, obj: Value = null, template: Value = null, choice: Value = null, D_3: Value = null, new_name: Value = null, sig: Value = null, A: Value = null, new_perma: Value = null, t: Value = null, H: Value = null, H_2: Value = null, result: Value = null, newtype: Value = null, H_4: Value = null, objective: Value = null, traitordatum: Value = null, new_objective: Value = null, newBombCap: Value = null, L: Value = null, animetype: Value = null, droptype: Value = null, honorifics: Value = null, names: Value = null, forename: Value = null, newname: Value = null, seifuku: Value = null, I: Value = null, olduniform: Value = null, virus: Value = null, DO: Value = null, W: Value = null, survivor_probability: Value = null, B: Value = null, M: Value = null, J: Value = null;
	let $e: any;
	let ok: Value = 0;
	let $0: any = item;
	if ($0 === "admin_log") {
		dat = "<B>Admin Log<HR></B>";
		for (l of each(GLOB.admin_log)) {
			dat += `<li>${l}</li>`;
		}
		if (!rt.len(f, GLOB.admin_log)) {
			dat += "No-one has done anything this round!";
		}
		rt.op(f, "Browse", [], [f.usr, dat, "window=admin_log"], false);
	} else if ($0 === "list_job_debug") {
		dat = "<B>Job Debug info.</B><HR>";
		if (GLOB.SSjob) {
			for (line of each(GLOB.SSjob.job_debug)) {
				dat += `${line}<BR>`;
			}
			dat += "*******<BR><BR>";
			for (job of each(GLOB.SSjob.occupations, T("/datum/job"))) {
				if (!job) {
					continue;
				}
				dat += `job: ${job.title}, current_positions: ${job.current_positions}, total_positions: ${job.total_positions} <BR>`;
			}
			rt.op(f, "Browse", [], [f.usr, dat, "window=jobdebug;size=600x500"], false);
		}
	} else if ($0 === "show_admins") {
		dat = "<B>Current admins:</B><HR>";
		if (GLOB.admin_datums) {
			for (ckey of each(GLOB.admin_datums)) {
				D = rt.index(GLOB.admin_datums, ckey);
				dat += `${ckey} - ${D.rank.name}<br>`;
			}
			rt.op(f, "Browse", [], [f.usr, dat, "window=showadmins;size=600x500"], false);
		}
	} else if ($0 === "tdomereset") {
		if (!check_rights(2)) {
			return f.dot;
		}
		if ((delete_mobs = (yield* alert("Clear all mobs?", "Confirm", "Yes", "No", "Cancel"))) == "Cancel") {
			return f.dot;
		}
		log_admin(`${key_name(f.usr)} reset the thunderdome to default with delete_mobs==${delete_mobs}.`, 1);
		message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} reset the thunderdome to default with delete_mobs==${delete_mobs}.</span>`);
		thunderdome = rt.locateIn(f, T("/area/tdome/arena"), rt.world());
		if (delete_mobs == "Yes") {
			for (mob of each(thunderdome, T("/mob/living"))) {
				yield* qdel(mob);
			}
		}
		for (obj of each(thunderdome, T("/obj"))) {
			if (!rt.istype(obj, T("/obj/machinery/camera"))) {
				yield* qdel(obj);
			}
		}
		yield* (template = rt.locateIn(f, T("/area/tdome/arena_source"), rt.world())).copy_contents_to(thunderdome);
	} else if ($0 === "clear_virus") {
		if ((choice = (yield* g.op(f, "Prompt", [0], [null, null, null, "Are you sure you want to cure all disease?", list("Yes", "Cancel")]))) == "Yes") {
			message_admins(`${key_name_admin(f.usr)} has cured all diseases.`);
			for (D_3 of each(GLOB.SSdisease.processing, T("/datum/disease"))) {
				yield* D_3.cure(D_3);
			}
		}
	} else if ($0 === "set_name") {
		if (!check_rights(2)) {
			return f.dot;
		}
		if (!(new_name = (yield* g.op(f, "Prompt", [3], ["", "What?", "Please input a new name for the station.", f.usr, null])))) {
			return f.dot;
		}
		set_station_name(new_name);
		log_admin(`${key_name(f.usr)} renamed the station to "${new_name}".`);
		message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} renamed the station to: ${new_name}.</span>`);
		yield* priority_announce(`${command_name()} has renamed the station to "${new_name}".`);
	} else if ($0 === "reset_name") {
		if (!check_rights(2)) {
			return f.dot;
		}
		set_station_name((new_name = new_station_name()));
		log_admin(`${key_name(f.usr)} reset the station name.`);
		message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} reset the station name.</span>`);
		yield* priority_announce(`${command_name()} has renamed the station to "${new_name}".`);
	} else if ($0 === "list_bombers") {
		if (!check_rights(2)) {
			return f.dot;
		}
		dat = "<B>Bombing List</B><HR>";
		l = null;
		for (l of each(GLOB.bombers)) {
			dat += `${l}<BR>`;
		}
		rt.op(f, "Browse", [], [f.usr, dat, "window=bombers"], false);
	} else if ($0 === "list_signalers") {
		if (!check_rights(2)) {
			return f.dot;
		}
		dat = `<B>Showing last ${rt.length(GLOB.lastsignalers)} signalers.</B><HR>`;
		for (sig of each(GLOB.lastsignalers)) {
			dat += `${sig}<BR>`;
		}
		rt.op(f, "Browse", [], [f.usr, dat, "window=lastsignalers;size=800x500"], false);
	} else if ($0 === "list_lawchanges") {
		if (!check_rights(2)) {
			return f.dot;
		}
		dat = `<B>Showing last ${rt.length(GLOB.lawchanges)} law changes.</B><HR>`;
		sig = null;
		for (sig of each(GLOB.lawchanges)) {
			dat += `${sig}<BR>`;
		}
		rt.op(f, "Browse", [], [f.usr, dat, "window=lawchanges;size=800x500"], false);
	} else if ($0 === "moveminingshuttle") {
		if (!check_rights(2)) {
			return f.dot;
		}
		if (!(yield* GLOB.SSshuttle.toggleShuttle("mining", "mining_home", "mining_away"))) {
			message_admins(`${key_name_admin(f.usr)} moved mining shuttle`);
			log_admin(`${key_name(f.usr)} moved the mining shuttle`);
		}
	} else if ($0 === "movelaborshuttle") {
		if (!check_rights(2)) {
			return f.dot;
		}
		if (!(yield* GLOB.SSshuttle.toggleShuttle("laborcamp", "laborcamp_home", "laborcamp_away"))) {
			message_admins(`${key_name_admin(f.usr)} moved labor shuttle`);
			log_admin(`${key_name(f.usr)} moved the labor shuttle`);
		}
	} else if ($0 === "moveferry") {
		if (!check_rights(2)) {
			return f.dot;
		}
		if (!(yield* GLOB.SSshuttle.toggleShuttle("ferry", "ferry_home", "ferry_away"))) {
			message_admins(`${key_name_admin(f.usr)} moved the centcom ferry`);
			log_admin(`${key_name(f.usr)} moved the centcom ferry`);
		}
	} else if ($0 === "togglearrivals") {
		if (!check_rights(2)) {
			return f.dot;
		}
		if (A = GLOB.SSshuttle.arrivals) {
			new_perma = (!A.perma_docked ? 1 : 0);
			A.perma_docked = new_perma;
			$0 = key_name_admin(f.usr);
			message_admins(`${$0} ${new_perma ? "stopped" : "started"} the arrivals shuttle`);
			$0 = key_name(f.usr);
			log_admin(`${$0} ${new_perma ? "stopped" : "started"} the arrivals shuttle`);
		} else {
			to_chat(f.usr, "<span class='admin'>There is no arrivals shuttle</span>");
		}
	} else if ($0 === "showailaws") {
		if (!check_rights(2)) {
			return f.dot;
		}
		this.output_ai_laws();
	} else if ($0 === "showgm") {
		if (!check_rights(2)) {
			return f.dot;
		}
		if (!GLOB.SSticker.HasRoundStarted()) {
			yield* alert("The game hasn't started yet!");
		} else if (GLOB.SSticker.mode) {
			yield* alert(`The game mode is ${GLOB.SSticker.mode.name}`);
		} else {
			yield* alert("For some reason there's a SSticker, but not a game mode");
		}
	} else if ($0 === "manifest") {
		if (!check_rights(2)) {
			return f.dot;
		}
		dat = "<B>Showing Crew Manifest.</B><HR>";
		dat += "<table cellspacing=5><tr><th>Name</th><th>Position</th></tr>";
		for (t of each(GLOB.data_core.general, T("/datum/data/record"))) {
			dat += `<tr><td>${rt.index(t.fields, "name")}</td><td>${rt.index(t.fields, "rank")}</td></tr>`;
		}
		dat += "</table>";
		rt.op(f, "Browse", [], [f.usr, dat, "window=manifest;size=440x410"], false);
	} else if ($0 === "DNA") {
		if (!check_rights(2)) {
			return f.dot;
		}
		dat = "<B>Showing DNA from blood.</B><HR>";
		dat += "<table cellspacing=5><tr><th>Name</th><th>DNA</th><th>Blood Type</th></tr>";
		for (H of each(GLOB.mob_list, T("/mob/living/carbon/human"))) {
			if (H.ckey) {
				dat += `<tr><td>${H}</td><td>${H.dna.unique_enzymes}</td><td>${H.dna.blood_type}</td></tr>`;
			}
		}
		dat += "</table>";
		rt.op(f, "Browse", [], [f.usr, dat, "window=DNA;size=440x410"], false);
	} else if ($0 === "fingerprints") {
		if (!check_rights(2)) {
			return f.dot;
		}
		dat = "<B>Showing Fingerprints.</B><HR>";
		dat += "<table cellspacing=5><tr><th>Name</th><th>Fingerprints</th></tr>";
		H = null;
		for (H of each(GLOB.mob_list, T("/mob/living/carbon/human"))) {
			if (H.ckey) {
				dat += `<tr><td>${H}</td><td>${md5(H.dna.uni_identity)}</td></tr>`;
			}
		}
		dat += "</table>";
		rt.op(f, "Browse", [], [f.usr, dat, "window=fingerprints;size=440x410"], false);
	} else if ($0 === "monkey") {
		if (!check_rights(8)) {
			return f.dot;
		}
		for (H_2 of each(GLOB.mob_list, T("/mob/living/carbon/human"))) {
			rt.spawnTail(f, 0, "/datum/admins/proc/Secrets_topic: spawn at modules/admin/secrets.dm:281", item, href_list, E, ok, dat, l, line, job, ckey, D, delete_mobs, thunderdome, mob, obj, template, choice, D_3, new_name, sig, A, new_perma, t, H, H_2, result, newtype, H_4, objective, traitordatum, new_objective, newBombCap, L, animetype, droptype, honorifics, names, forename, newname, seifuku, I, olduniform, virus, DO, W, survivor_probability, B, M, J);
		}
		ok = 1;
	} else if ($0 === "allspecies") {
		if (!check_rights(8)) {
			return f.dot;
		}
		if (result = (yield* g.op(f, "Prompt", [1], [null, "Species", "Please choose a new species", f.usr, GLOB.species_list]))) {
			log_admin(`${key_name(f.usr)} turned all humans into ${result}`, 1);
			message_admins(` ${key_name_admin(f.usr)} turned all humans into ${result}`);
			newtype = rt.index(GLOB.species_list, result);
			for (H_4 of each(GLOB.mob_list, T("/mob/living/carbon/human"))) {
				yield* H_4.set_species(newtype);
			}
		}
	} else if ($0 === "tripleAI") {
		if (!check_rights(8)) {
			return f.dot;
		}
		yield* f.usr.client.triple_ai();
	} else if ($0 === "power") {
		if (!check_rights(8)) {
			return f.dot;
		}
		log_admin(`${key_name(f.usr)} made all areas powered`, 1);
		message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} made all areas powered</span>`);
		yield* power_restore();
	} else if ($0 === "unpower") {
		if (!check_rights(8)) {
			return f.dot;
		}
		log_admin(`${key_name(f.usr)} made all areas unpowered`, 1);
		message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} made all areas unpowered</span>`);
		yield* power_failure();
	} else if ($0 === "quickpower") {
		if (!check_rights(8)) {
			return f.dot;
		}
		log_admin(`${key_name(f.usr)} made all SMESs powered`, 1);
		message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} made all SMESs powered</span>`);
		yield* power_restore_quick();
	} else if ($0 === "traitor_all") {
		if (!check_rights(8)) {
			return f.dot;
		}
		if (!GLOB.SSticker.HasRoundStarted()) {
			yield* alert("The game hasn't started yet!");
			return f.dot;
		}
		if (!(objective = copytext(sanitize((yield* g.op(f, "Prompt", [2], [null, null, null, "Enter an objective", null]))), 1, 1024))) {
			return f.dot;
		}
		H = null;
		for (H of each(GLOB.player_list, T("/mob/living"))) {
			if (!(rt.istype(H, T("/mob/living/carbon/human")) || rt.istype(H, T("/mob/living/silicon")))) {
				continue;
			}
			if (H.stat == 2 || !H.client || !H.mind || rt.istype(H, T("/mob/living/silicon/pai"))) {
				continue;
			}
			if (is_special_character(H)) {
				continue;
			}
			yield* H.mind.add_antag_datum(T("/datum/antagonist/traitor/custom"));
			traitordatum = H.mind.has_antag_datum(T("/datum/antagonist/traitor"));
			(new_objective = (yield* new_(T("/datum/objective")))).owner = H;
			new_objective.explanation_text = objective;
			traitordatum.add_objective(new_objective);
			yield* traitordatum.equip(0);
			traitordatum.greet();
		}
		message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} used everyone is a traitor secret. Objective is ${objective}</span>`);
		log_admin(`${key_name(f.usr)} used everyone is a traitor secret. Objective is ${objective}`);
	} else if ($0 === "changebombcap") {
		if (!check_rights(8)) {
			return f.dot;
		}
		if ((newBombCap = (yield* g.op(f, "Prompt", [33], [GLOB.MAX_EX_LIGHT_RANGE, "New Bomb Cap", "What would you like the new bomb cap to be. (entered as the light damage range (the 3rd number in common (1,2,3) notation)) Must be above 4)", f.usr, null]))) < 4) {
			return f.dot;
		}
		GLOB.MAX_EX_DEVESTATION_RANGE = round(newBombCap / 4);
		GLOB.MAX_EX_HEAVY_RANGE = round(newBombCap / 2);
		GLOB.MAX_EX_LIGHT_RANGE = newBombCap;
		GLOB.MAX_EX_FLASH_RANGE = newBombCap;
		GLOB.MAX_EX_FLAME_RANGE = newBombCap;
		message_admins(`<span class='boldannounce'>${key_name_admin(f.usr)} changed the bomb cap to ${GLOB.MAX_EX_DEVESTATION_RANGE}, ${GLOB.MAX_EX_HEAVY_RANGE}, ${GLOB.MAX_EX_LIGHT_RANGE}</span>`);
		log_admin(`${key_name(f.usr)} changed the bomb cap to ${GLOB.MAX_EX_DEVESTATION_RANGE}, ${GLOB.MAX_EX_HEAVY_RANGE}, ${GLOB.MAX_EX_LIGHT_RANGE}`);
	} else if ($0 === "blackout") {
		if (!check_rights(8)) {
			return f.dot;
		}
		message_admins(`${key_name_admin(f.usr)} broke all lights`);
		for (L of each(GLOB.machines, T("/obj/machinery/light"))) {
			yield* L.break_light_tube();
		}
	} else if ($0 === "anime") {
		if (!check_rights(8)) {
			return f.dot;
		}
		animetype = (yield* alert("Would you like to have the clothes be changed?", null, "Yes", "No", "Cancel"));
		if (animetype == "Yes") {
			droptype = (yield* alert("Make the uniforms Nodrop?", null, "Yes", "No", "Cancel"));
		}
		if (animetype == "Cancel" || droptype == "Cancel") {
			return f.dot;
		}
		message_admins(`${key_name_admin(f.usr)} made everything kawaii.`);
		H_4 = null;
		for (H_4 of each(GLOB.mob_list, T("/mob/living/carbon/human"))) {
			rt.op(f, "Output", [], [H_4, sound(rt.rsc("sound/ai/animes.ogg"))], false);
			if (H_4.dna.species.id == "human") {
				if (rt.index(H_4.dna.features, "tail_human") == "None" || rt.index(H_4.dna.features, "ears") == "None") {
					rt.setAt(H_4.dna.features, "tail_human", "Cat");
					rt.setAt(H_4.dna.features, "ears", "Cat");
				}
				honorifics = rt.alist(f, [`${"male"}`, list("kun"), `${"female"}`, list("chan", "tan"), `${"neuter"}`, list("san")]);
				names = splittext(H_4.real_name, " ");
				if (rt.len(f, names) > 1) {
					$0 = rt.index(names, 2);
				} else {
					$0 = rt.index(names, 1);
				}
				forename = $0;
				newname = `${forename}-${pick(rt.index(honorifics, `${H_4.gender}`))}`;
				yield* H_4.fully_replace_character_name(H_4.real_name, newname);
				yield* H_4.update_mutant_bodyparts();
				if (animetype == "Yes") {
					seifuku = pick(typesof(T("/obj/item/clothing/under/schoolgirl")));
					I = (yield* new_(seifuku));
					olduniform = H_4.w_uniform;
					yield* H_4.temporarilyRemoveItemFromInventory(H_4.w_uniform, 1, 0);
					yield* H_4.equip_to_slot_or_del(I, slot_w_uniform);
					yield* qdel(olduniform);
					if (droptype == "Yes") {
						(rt.modField(f, I, "flags", NODROP, rt.bitOr));
					}
				}
			} else {
				to_chat(H_4, "You're not kawaii enough for this.");
			}
		}
	} else if ($0 === "whiteout") {
		if (!check_rights(8)) {
			return f.dot;
		}
		message_admins(`${key_name_admin(f.usr)} fixed all lights`);
		L = null;
		for (L of each(GLOB.machines, T("/obj/machinery/light"))) {
			L.fix();
		}
	} else if ($0 === "floorlava") {
		yield* GLOB.SSweather.run_weather("the floor is lava");
	} else if ($0 === "virus") {
		if (!check_rights(8)) {
			return f.dot;
		}
		$0 = (yield* alert("Do you want this to be a random disease or do you have something in mind?", null, "Make Your Own", "Random", "Choose"));
		if ($0 === "Make Your Own") {
			yield* AdminCreateVirus(f.usr.client);
		} else if ($0 === "Random") {
			E = (yield* new_(T("/datum/round_event/disease_outbreak")));
		} else if ($0 === "Choose") {
			virus = (yield* g.op(f, "Prompt", [1], [null, null, "BIOHAZARD", "Choose the virus to spread", typesof(T("/datum/disease"))]));
			E = (yield* new_(T("/datum/round_event/disease_outbreak")));
			(DO = E).virus_type = virus;
		}
	} else if ($0 === "retardify") {
		if (!check_rights(8)) {
			return f.dot;
		}
		H_2 = null;
		for (H_2 of each(GLOB.player_list, T("/mob/living/carbon/human"))) {
			to_chat(H_2, "<span class='boldannounce'>You suddenly feel stupid.</span>");
			H_2.setBrainLoss(60);
		}
		message_admins(`${key_name_admin(f.usr)} made everybody retarded`);
	} else if ($0 === "eagles") {
		if (!check_rights(8)) {
			return f.dot;
		}
		for (W of each(GLOB.machines, T("/obj/machinery/door/airlock"))) {
			if (W.z == ZLEVEL_STATION && !rt.istype(get_area(W), T("/area/bridge")) && !rt.istype(get_area(W), T("/area/crew_quarters")) && !rt.istype(get_area(W), T("/area/security/prison"))) {
				W.req_access = list();
			}
		}
		message_admins(`${key_name_admin(f.usr)} activated Egalitarian Station mode`);
		yield* priority_announce("Centcom airlock control override activated. Please take this time to get acquainted with your coworkers.", null, rt.rsc("sound/ai/commandreport.ogg"));
	} else if ($0 === "guns") {
		if (!check_rights(8)) {
			return f.dot;
		}
		survivor_probability = 0;
		$0 = (yield* alert("Do you want this to create survivors antagonists?", null, "No Antags", "Some Antags", "All Antags!"));
		if ($0 === "Some Antags") {
			survivor_probability = 25;
		} else if ($0 === "All Antags!") {
			survivor_probability = 100;
		}
		yield* rightandwrong(0, f.usr, survivor_probability);
	} else if ($0 === "magic") {
		if (!check_rights(8)) {
			return f.dot;
		}
		survivor_probability = 0;
		$0 = (yield* alert("Do you want this to create survivors antagonists?", null, "No Antags", "Some Antags", "All Antags!"));
		if ($0 === "Some Antags") {
			survivor_probability = 25;
		} else if ($0 === "All Antags!") {
			survivor_probability = 100;
		}
		yield* rightandwrong(1, f.usr, survivor_probability);
	} else if ($0 === "events") {
		if (!check_rights(8)) {
			return f.dot;
		}
		if (!GLOB.SSevents.wizardmode) {
			if ((yield* alert("Do you want to toggle summon events on?", null, "Yes", "No")) == "Yes") {
				summonevents();
			}
		} else {
			$0 = (yield* alert("What would you like to do?", null, "Intensify Summon Events", "Turn Off Summon Events", "Nothing"));
			if ($0 === "Intensify Summon Events") {
				summonevents();
			} else if ($0 === "Turn Off Summon Events") {
				GLOB.SSevents.toggleWizardmode();
				GLOB.SSevents.resetFrequency();
			}
		}
	} else if ($0 === "dorf") {
		if (!check_rights(8)) {
			return f.dot;
		}
		for (B of each(GLOB.mob_list, T("/mob/living/carbon/human"))) {
			B.facial_hair_style = "Dward Beard";
			yield* B.update_hair();
		}
		message_admins(`${key_name_admin(f.usr)} activated dorf mode`);
	} else if ($0 === "onlyone") {
		if (!check_rights(8)) {
			return f.dot;
		}
		yield* f.usr.client.only_one();
		send_to_playing_players(rt.rsc("sound/misc/highlander.ogg"));
	} else if ($0 === "delayed_onlyone") {
		if (!check_rights(8)) {
			return f.dot;
		}
		yield* f.usr.client.only_one_delayed();
		send_to_playing_players(rt.rsc("sound/misc/highlander_delayed.ogg"));
	} else if ($0 === "onlyme") {
		if (!check_rights(8)) {
			return f.dot;
		}
		yield* only_me();
	} else if ($0 === "maint_access_brig") {
		if (!check_rights(32)) {
			return f.dot;
		}
		for (M of each(GLOB.machines, T("/obj/machinery/door/airlock/maintenance"))) {
			M.check_access();
			if (rt.isIn(f, 12, M.req_access)) {
				M.req_access = list(2);
			}
		}
		message_admins(`${key_name_admin(f.usr)} made all maint doors brig access-only.`);
	} else if ($0 === "maint_access_engiebrig") {
		if (!check_rights(32)) {
			return f.dot;
		}
		M = null;
		for (M of each(GLOB.machines, T("/obj/machinery/door/airlock/maintenance"))) {
			M.check_access();
			if (rt.isIn(f, 12, M.req_access)) {
				M.req_access = list();
				M.req_one_access = list(2, 10);
			}
		}
		message_admins(`${key_name_admin(f.usr)} made all maint doors engineering and brig access-only.`);
	} else if ($0 === "infinite_sec") {
		if (!check_rights(32)) {
			return f.dot;
		}
		if (!(J = (yield* GLOB.SSjob.GetJob("Security Officer")))) {
			return f.dot;
		}
		J.total_positions = -1;
		J.spawn_positions = -1;
		message_admins(`${key_name_admin(f.usr)} has removed the cap on security officers.`);
	} else if ($0 === "ctfbutton") {
		if (!check_rights(2)) {
			return f.dot;
		}
		yield* toggle_all_ctf(f.usr);
	} else if ($0 === "masspurrbation") {
		if (!check_rights(8)) {
			return f.dot;
		}
		yield* mass_purrbation();
		message_admins(`${key_name_admin(f.usr)} has put everyone on purrbation!`);
		log_admin(`${key_name(f.usr)} has put everyone on purrbation.`);
	} else if ($0 === "massremovepurrbation") {
		if (!check_rights(8)) {
			return f.dot;
		}
		yield* mass_remove_purrbation();
		message_admins(`${key_name_admin(f.usr)} has removed everyone from purrbation.`);
		log_admin(`${key_name(f.usr)} has removed everyone from purrbation.`);
	}
	if (E) {
		E.processing = 0;
		if (E.announceWhen > 0) {
			if ((yield* alert(f.usr, "Would you like to alert the crew?", "Alert", "Yes", "No")) == "No") {
				E.announceWhen = -1;
			}
		}
		E.processing = 1;
	}
	if (!f.usr) return f.dot;
	log_admin(`${key_name(f.usr)} used secret ${item}`);
	if (!ok) return f.dot;
	to_chat(rt.world(), `<B>A secret has been activated by ${f.usr.key}!</B>`);
	return f.dot;
}, true);

// a spawn(0) body of /datum/admins/proc/Secrets_topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/admins/proc/Secrets_topic: spawn at modules/admin/secrets.dm:281", function* (f: Frame, item: Value, href_list: Value, E: Value, ok: Value, dat: Value, l: Value, line: Value, job: Value, ckey: Value, D: Value, delete_mobs: Value, thunderdome: Value, mob: Value, obj: Value, template: Value, choice: Value, D_3: Value, new_name: Value, sig: Value, A: Value, new_perma: Value, t: Value, H: Value, H_2: Value, result: Value, newtype: Value, H_4: Value, objective: Value, traitordatum: Value, new_objective: Value, newBombCap: Value, L: Value, animetype: Value, droptype: Value, honorifics: Value, names: Value, forename: Value, newname: Value, seifuku: Value, I: Value, olduniform: Value, virus: Value, DO: Value, W: Value, survivor_probability: Value, B: Value, M: Value, J: Value) {
	yield* H_2.monkeyize();
	return null;
});
