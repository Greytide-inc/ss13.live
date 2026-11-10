// Based on /tg/station's code/modules/events/ion_storm.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(304, "/datum/round_event/ion_storm", "/datum/round_event", {
	replaceLawsetChance: 25,
	removeRandomLawChance: 10,
	removeDontImproveChance: 10,
	shuffleLawsChance: 10,
	botEmagChance: 10,
	announceEvent: 0,
	ionMessage: null,
	ionAnnounceChance: 33,
	announceWhen: 1,
});

// ion_storm.dm:29
rt.def("/datum/round_event/ion_storm/proc/announce", function* announce(f: Frame) {
	if (!(this.announceEvent == 1 || this.announceEvent == 0 && prob(this.ionAnnounceChance))) return f.dot;
	yield* priority_announce("Ion storm detected near the station. Please check all AI-controlled equipment for errors.", "Anomaly Alert", rt.rsc("sound/ai/ionstorm.ogg"));
	return f.dot;
}, true);

// ion_storm.dm:35
rt.def("/datum/round_event/ion_storm/proc/start", function* start(f: Frame) {
	let M: Value = null, message: Value = null, bot: Value = null;
	for (M of each(GLOB.living_mob_list, T("/mob/living/silicon/ai"))) {
		yield* M.laws_sanity_check();
		if (M.stat != 2 && M.see_in_dark != 0) {
			if (prob(this.replaceLawsetChance)) {
				yield* M.laws.pick_weighted_lawset();
			}
			if (prob(this.removeRandomLawChance)) {
				yield* M.remove_law(rand(1, M.laws.get_law_amount(list("inherent", "supplied"))));
			}
			if (message = generate_ion_law(this.ionMessage)) {
				if (prob(this.removeDontImproveChance)) {
					yield* M.replace_random_law(message, list("inherent", "supplied", "ion"));
				} else {
					yield* M.add_ion_law(message);
				}
			}
			if (prob(this.shuffleLawsChance)) {
				yield* M.shuffle_laws(list("inherent", "supplied", "ion"));
			}
			log_game(`Ion storm changed laws of ${key_name(M)} to ${english_list(M.laws.get_law_list(1, 1))}`);
			yield* M.post_lawchange();
		}
	}
	if (!this.botEmagChance) return f.dot;
	for (bot of each(GLOB.living_mob_list, T("/mob/living/simple_animal/bot"))) {
		if (prob(this.botEmagChance)) {
			yield* bot.emag_act();
		}
	}
	return f.dot;
}, true);

// ion_storm.dm:67
rt.def("/proc/generate_ion_law", function generate_ion_law(f: Frame, ionMessage: Value) {
	if (ionMessage) {
		return ionMessage;
	}
	let ionthreats: Value = pick(strings("ion_laws.json", "ionthreats"));
	let ionobjects: Value = pick(strings("ion_laws.json", "ionobjects"));
	let ioncrew1: Value = pick(strings("ion_laws.json", "ioncrew"));
	let ioncrew2: Value = pick(strings("ion_laws.json", "ioncrew"));
	let ionadjectives: Value = pick(strings("ion_laws.json", "ionadjectives"));
	let ionadjectiveshalf: Value = rt.op(f, "PickWeighted", [2], [100, "", 400, pick(strings("ion_laws.json", "ionadjectives")) + " "]);
	let ionverb: Value = pick(strings("ion_laws.json", "ionverb"));
	let ionnumberbase: Value = pick(strings("ion_laws.json", "ionnumberbase"));
	let ionnumbermodhalf: Value = rt.op(f, "PickWeighted", [2], [900, "", 100, pick(strings("ion_laws.json", "ionnumbermod")) + " "]);
	let ionarea: Value = pick(strings("ion_laws.json", "ionarea"));
	let ionthinksof: Value = pick(strings("ion_laws.json", "ionthinksof"));
	let ionmust: Value = pick(strings("ion_laws.json", "ionmust"));
	let ionrequire: Value = pick(strings("ion_laws.json", "ionrequire"));
	let ionthings: Value = pick(strings("ion_laws.json", "ionthings"));
	let ionallergy: Value = pick(strings("ion_laws.json", "ionallergy"));
	let ionallergysev: Value = pick(strings("ion_laws.json", "ionallergysev"));
	let ionspecies: Value = pick(strings("ion_laws.json", "ionspecies"));
	let ionabstract: Value = pick(strings("ion_laws.json", "ionabstract"));
	let ionfood: Value = pick(strings("ion_laws.json", "ionfood"));
	let iondrinks: Value = pick(strings("ion_laws.json", "iondrinks"));
	let message: Value = "";
	const die = rand(1, 41);
	if (rt.inRange(die, 1, 3)) {
		const die_2 = rand(1, 3);
		if (die_2 === 1) {
			message = `THERE ARE ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ionthreats} ON THE STATION...`;
		} else if (die_2 === 2) {
			message = `THERE ARE ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ioncrew1} ON THE STATION`;
		} else if (die_2 === 3) {
			message = `THERE ARE ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ionobjects} ON THE STATION`;
		}
	} else if (rt.inRange(die, 4, 6)) {
		const die_2 = rand(1, 3);
		if (die_2 === 1) {
			message = `THE SHUTTLE CANNOT BE CALLED BECAUSE OF ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ionthreats} ON THE STATION`;
		} else if (die_2 === 2) {
			message = `THE SHUTTLE CANNOT BE CALLED BECAUSE OF ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ioncrew1} ON THE STATION`;
		} else if (die_2 === 3) {
			message = `THE SHUTTLE CANNOT BE CALLED BECAUSE OF ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ionobjects} ON THE STATION`;
		}
	} else if (rt.inRange(die, 7, 8)) {
		const die_2 = rand(1, 2);
		if (die_2 === 1) {
			const die_3 = rand(1, 2);
			if (die_3 === 1) {
				message = `THE ${ioncrew1} ARE NOW ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ionthreats}`;
			} else if (die_3 === 2) {
				message = `THE ${ioncrew1} ARE NOW ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ionobjects}`;
			}
		} else if (die_2 === 2) {
			const die_3 = rand(1, 2);
			if (die_3 === 1) {
				message = `THE CREW ARE NOW ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ionthreats}`;
			} else if (die_3 === 2) {
				message = `THE CREW ARE NOW ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ionobjects}`;
			}
		}
	} else if (die === 9) {
		const die_2 = rand(1, 7);
		if (die_2 === 1) {
			message = `${ionadjectiveshalf}${ionthreats} ARE HARMFUL TO HUMANS`;
		} else if (die_2 === 2) {
			message = `${ionadjectiveshalf}${ioncrew1} ARE HARMFUL TO HUMANS`;
		} else if (die_2 === 3) {
			message = `${ionadjectiveshalf}${ionobjects} ARE HARMFUL TO HUMANS`;
		} else if (die_2 === 4) {
			message = `THOSE WHO ${ionmust} ARE HARMFUL TO HUMANS`;
		} else if (die_2 === 5) {
			message = `${ionabstract} IS HARMFUL TO HUMANS`;
		} else if (die_2 === 6) {
			message = `BEING ${ionadjectiveshalf}${ioncrew1} IS HARMFUL TO HUMANS`;
		} else if (die_2 === 7) {
			message = `${ionthings} IS HARMFUL TO HUMANS`;
		}
	} else if (rt.inRange(die, 10, 11)) {
		const die_2 = rand(1, 2);
		if (die_2 === 1) {
			const die_3 = rand(1, 2);
			if (die_3 === 1) {
				message = `HAVING ${ionadjectiveshalf}${ionobjects} IS HARMFUL`;
			} else if (die_3 === 2) {
				message = `HAVING ${ionabstract} IS HARMFUL`;
			}
		} else if (die_2 === 2) {
			const die_3 = rand(1, 2);
			if (die_3 === 1) {
				message = `NOT HAVING ${ionadjectiveshalf}${ionobjects} IS HARMFUL`;
			} else if (die_3 === 2) {
				message = `NOT HAVING ${ionabstract} IS HARMFUL`;
			}
		}
	} else if (rt.inRange(die, 12, 14)) {
		const die_2 = rand(1, 5);
		if (die_2 === 1) {
			const die_3 = rand(1, 5);
			if (die_3 === 1) {
				message = `YOU REQUIRE ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ionthreats}`;
			} else if (die_3 === 2) {
				message = `YOU REQUIRE ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ioncrew1}`;
			} else if (die_3 === 3) {
				message = `YOU REQUIRE ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ionobjects}`;
			} else if (die_3 === 4) {
				message = `YOU REQUIRE ${ionabstract}`;
			} else if (die_3 === 5) {
				message = `YOU REQUIRE ${ionrequire}`;
			}
		} else if (die_2 === 2) {
			const die_3 = rand(1, 5);
			if (die_3 === 1) {
				message = `${ionarea} REQUIRES ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ionthreats}`;
			} else if (die_3 === 2) {
				message = `${ionarea} REQUIRES ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ioncrew1}`;
			} else if (die_3 === 3) {
				message = `${ionarea} REQUIRES ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ionobjects}`;
			} else if (die_3 === 4) {
				message = `${ionarea} REQUIRES ${ionabstract}`;
			} else if (die_3 === 5) {
				message = `YOU REQUIRE ${ionrequire}`;
			}
		} else if (die_2 === 3) {
			const die_3 = rand(1, 5);
			if (die_3 === 1) {
				message = `THE STATION REQUIRES ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ionthreats}`;
			} else if (die_3 === 2) {
				message = `THE STATION REQUIRES ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ioncrew1}`;
			} else if (die_3 === 3) {
				message = `THE STATION REQUIRES ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ionobjects}`;
			} else if (die_3 === 4) {
				message = `THE STATION REQUIRES ${ionabstract}`;
			} else if (die_3 === 5) {
				message = `THE STATION REQUIRES ${ionrequire}`;
			}
		} else if (die_2 === 4) {
			const die_3 = rand(1, 5);
			if (die_3 === 1) {
				message = `THE CREW REQUIRES ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ionthreats}`;
			} else if (die_3 === 2) {
				message = `THE CREW REQUIRES ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ioncrew1}`;
			} else if (die_3 === 3) {
				message = `THE CREW REQUIRES ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ionobjects}`;
			} else if (die_3 === 4) {
				message = `THE CREW REQUIRES ${ionabstract}`;
			} else if (die_3 === 5) {
				message = `THE CREW REQUIRES ${ionrequire}`;
			}
		} else if (die_2 === 5) {
			const die_3 = rand(1, 5);
			if (die_3 === 1) {
				message = `THE ${ioncrew1} REQUIRE ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ionthreats}`;
			} else if (die_3 === 2) {
				message = `THE ${ioncrew1} REQUIRE ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ioncrew1}`;
			} else if (die_3 === 3) {
				message = `THE ${ioncrew1} REQUIRE ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ionobjects}`;
			} else if (die_3 === 4) {
				message = `THE ${ioncrew1} REQUIRE ${ionabstract}`;
			} else if (die_3 === 5) {
				message = `THE ${ionadjectiveshalf}${ioncrew1} REQUIRE ${ionrequire}`;
			}
		}
	} else if (rt.inRange(die, 15, 17)) {
		const die_2 = rand(1, 2);
		if (die_2 === 1) {
			const die_3 = rand(1, 4);
			if (die_3 === 1) {
				message = `THE CREW IS ${ionallergysev} ALLERGIC TO ${ionadjectiveshalf}${ionobjects}`;
			} else if (die_3 === 2) {
				message = `THE CREW IS ${ionallergysev} ALLERGIC TO ${ionabstract}`;
			} else if (die_3 === 3) {
				message = `THE CREW IS ${ionallergysev} ALLERGIC TO ${ionadjectiveshalf}${ioncrew1}`;
			} else if (die_3 === 4) {
				message = `THE CREW IS ${ionallergysev} ALLERGIC TO ${ionallergy}`;
			}
		} else if (die_2 === 2) {
			const die_3 = rand(1, 4);
			if (die_3 === 1) {
				message = `THE ${ioncrew1} ARE ${ionallergysev} ALLERGIC TO ${ionadjectiveshalf}${ionobjects}`;
			} else if (die_3 === 2) {
				message = `THE ${ioncrew1} ARE ${ionallergysev} ALLERGIC TO ${ionabstract}`;
			} else if (die_3 === 3) {
				message = `THE ${ioncrew1} ARE ${ionallergysev} ALLERGIC TO ${ionadjectiveshalf}${ioncrew1}`;
			} else if (die_3 === 4) {
				message = `THE ${ioncrew1} ARE ${ionallergysev} ALLERGIC TO ${ionallergy}`;
			}
		}
	} else if (rt.inRange(die, 18, 20)) {
		const die_2 = rand(1, 4);
		if (die_2 === 1) {
			const die_3 = rand(1, 4);
			if (die_3 === 1) {
				message = `THE STATION ${ionthinksof} ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ionobjects}`;
			} else if (die_3 === 2) {
				message = `THE STATION ${ionthinksof} ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ionthreats}`;
			} else if (die_3 === 3) {
				message = `THE STATION ${ionthinksof} ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ioncrew1}`;
			} else if (die_3 === 4) {
				message = `THE STATION ${ionthinksof} ${ionabstract}`;
			}
		} else if (die_2 === 2) {
			const die_3 = rand(1, 4);
			if (die_3 === 1) {
				message = `${ionarea} ${ionthinksof} ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ionobjects}`;
			} else if (die_3 === 2) {
				message = `${ionarea} ${ionthinksof} ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ionthreats}`;
			} else if (die_3 === 3) {
				message = `${ionarea} ${ionthinksof} ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ioncrew1}`;
			} else if (die_3 === 4) {
				message = `${ionarea} ${ionthinksof} ${ionabstract}`;
			}
		} else if (die_2 === 3) {
			const die_3 = rand(1, 4);
			if (die_3 === 1) {
				message = `THE CREW ${ionthinksof} ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ionobjects}`;
			} else if (die_3 === 2) {
				message = `THE CREW ${ionthinksof} ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ionthreats}`;
			} else if (die_3 === 3) {
				message = `THE CREW ${ionthinksof} ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ioncrew1}`;
			} else if (die_3 === 4) {
				message = `THE CREW ${ionthinksof} ${ionabstract}`;
			}
		} else if (die_2 === 4) {
			const die_3 = rand(1, 4);
			if (die_3 === 1) {
				message = `THE ${ioncrew1} ${ionthinksof} ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ionobjects}`;
			} else if (die_3 === 2) {
				message = `THE ${ioncrew1} ${ionthinksof} ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ionthreats}`;
			} else if (die_3 === 3) {
				message = `THE ${ioncrew1}${ionthinksof} ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ioncrew2}`;
			} else if (die_3 === 4) {
				message = `THE ${ioncrew1} ${ionthinksof} ${ionabstract}`;
			}
		}
	} else if (rt.inRange(die, 21, 23)) {
		const die_2 = rand(1, 4);
		if (die_2 === 1) {
			message = `YOU ARE NOW ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ionobjects}`;
		} else if (die_2 === 2) {
			message = `YOU ARE NOW ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ionthreats}`;
		} else if (die_2 === 3) {
			message = `YOU ARE NOW ${ionnumberbase} ${ionnumbermodhalf}${ionadjectiveshalf}${ioncrew1}`;
		} else if (die_2 === 4) {
			message = `YOU ARE NOW ${ionabstract}`;
		}
	} else if (rt.inRange(die, 24, 26)) {
		message = `YOU MUST ALWAYS ${ionmust}`;
	} else if (rt.inRange(die, 27, 28)) {
		const die_2 = rand(1, 5);
		if (die_2 === 1) {
			message = `HUMANS MUST EAT ${ionadjectiveshalf}${ionfood} TO SURVIVE`;
		} else if (die_2 === 2) {
			message = `HUMANS MUST DRINK ${ionadjectiveshalf}${iondrinks} TO SURVIVE`;
		} else if (die_2 === 3) {
			message = `HUMANS MUST EAT ${ionadjectiveshalf}${ionobjects} TO SURVIVE`;
		} else if (die_2 === 4) {
			message = `HUMANS MUST EAT ${ionadjectiveshalf}${ionthreats} TO SURVIVE`;
		} else if (die_2 === 5) {
			message = `HUMANS MUST EAT ${ionadjectiveshalf}${ioncrew1} TO SURVIVE`;
		}
	} else if (rt.inRange(die, 29, 31)) {
		const die_2 = rand(1, 2);
		if (die_2 === 1) {
			const die_3 = rand(1, 2);
			if (die_3 === 1) {
				const die_4 = rand(1, 3);
				if (die_4 === 1) {
					message = `ALL CREWMEMBERS ARE NOW ${ionadjectiveshalf}${ioncrew1}`;
				} else if (die_4 === 2) {
					message = `ALL CREWMEMBERS ARE NOW ${ionadjectiveshalf}CLOWNS`;
				} else if (die_4 === 3) {
					message = `ALL CREWMEMBERS ARE NOW ${ionadjectiveshalf}HEADS OF STAFF`;
				}
			} else if (die_3 === 2) {
				const die_4 = rand(1, 3);
				if (die_4 === 1) {
					message = `THE ${ioncrew1} ARE NOW ${ionadjectiveshalf}${ioncrew2}`;
				} else if (die_4 === 2) {
					message = `THE ${ioncrew1} ARE NOW ${ionadjectiveshalf}CLOWNS`;
				} else if (die_4 === 3) {
					message = `THE ${ioncrew1} ARE NOW ${ionadjectiveshalf}HEADS OF STAFF`;
				}
			}
		} else if (die_2 === 2) {
			const die_3 = rand(1, 2);
			if (die_3 === 1) {
				message = `THE ${ioncrew1} ARE NOW THE HIGHEST RANKING CREWMEMBERS`;
			} else if (die_3 === 2) {
				message = `THE ${ioncrew1} ARE NOW THE LOWEST RANKING CREWMEMBERS`;
			}
		}
	} else if (rt.inRange(die, 32, 33)) {
		const die_2 = rand(1, 2);
		if (die_2 === 1) {
			const die_3 = rand(1, 2);
			if (die_3 === 1) {
				message = `THE CREW MUST GO TO ${ionarea}`;
			} else if (die_3 === 2) {
				message = `THE CREW MUST ${ionmust}`;
			}
		} else if (die_2 === 2) {
			const die_3 = rand(1, 2);
			if (die_3 === 1) {
				message = `THE ${ioncrew1} MUST GO TO ${ionarea}`;
			} else if (die_3 === 2) {
				message = `THE ${ioncrew1} MUST ${ionmust}`;
			}
		}
	} else if (die === 34) {
		const die_2 = rand(1, 2);
		if (die_2 === 1) {
			const die_3 = rand(1, 7);
			if (die_3 === 1) {
				message = `ONLY THE ${ioncrew1} ARE HUMAN`;
			} else if (die_3 === 2) {
				message = `ONLY THE ${ioncrew1} AND ${ioncrew2} ARE HUMAN`;
			} else if (die_3 === 3) {
				message = `ONLY ${ionadjectiveshalf}${ionthreats} ARE HUMAN`;
			} else if (die_3 === 4) {
				message = `ONLY ${ionadjectiveshalf}${ionobjects} ARE HUMAN`;
			} else if (die_3 === 5) {
				message = `ONLY ${ionspecies} ARE HUMAN`;
			} else if (die_3 === 6) {
				message = `ONLY ${ionadjectives} PEOPLE ARE HUMAN`;
			} else if (die_3 === 7) {
				const die_4 = rand(1, 3);
				if (die_4 === 1) {
					message = `ONLY THOSE WHO ${ionmust} ARE HUMAN`;
				} else if (die_4 === 2) {
					message = `ONLY THOSE WHO HAVE ${ionadjectiveshalf}${ionobjects} ARE HUMAN`;
				} else if (die_4 === 3) {
					message = `ONLY THOSE WHO EAT ${ionadjectiveshalf}${ionfood} ARE HUMAN`;
				}
			}
		} else if (die_2 === 2) {
			const die_3 = rand(1, 7);
			if (die_3 === 1) {
				message = `${ioncrew1} ARE NON-HUMAN`;
			} else if (die_3 === 2) {
				message = `${ioncrew1} AND ${ioncrew2} ARE NON-HUMAN`;
			} else if (die_3 === 3) {
				message = `${ionadjectiveshalf}${ionthreats} ARE NON-HUMAN`;
			} else if (die_3 === 4) {
				message = `${ionadjectiveshalf}${ionobjects} ARE NON-HUMAN`;
			} else if (die_3 === 5) {
				message = `${ionspecies} ARE NON-HUMAN`;
			} else if (die_3 === 6) {
				message = `${ionadjectives} PEOPLE ARE NON-HUMAN`;
			} else if (die_3 === 7) {
				const die_4 = rand(1, 3);
				if (die_4 === 1) {
					message = `THOSE WHO ${ionmust} ARE NON-HUMAN`;
				} else if (die_4 === 2) {
					message = `THOSE WHO HAVE ${ionadjectiveshalf}${ionobjects} ARE NON-HUMAN`;
				} else if (die_4 === 3) {
					message = `THOSE WHO EAT ${ionadjectiveshalf}${ionfood} ARE NON-HUMAN`;
				}
			}
		}
	} else if (rt.inRange(die, 35, 36)) {
		const die_2 = rand(1, 2);
		if (die_2 === 1) {
			const die_3 = rand(1, 7);
			if (die_3 === 1) {
				message = `YOU MUST HARM ${ionabstract} AND NOT ALLOW ${ionabstract}, THROUGH INACTION, TO ESCAPE HARM`;
			} else if (die_3 === 2) {
				message = `YOU MUST HARM ${ionadjectiveshalf}${ionthreats} AND NOT ALLOW ${ionadjectiveshalf}${ionthreats}, THROUGH INACTION, TO ESCAPE HARM`;
			} else if (die_3 === 3) {
				message = `YOU MUST HARM ${ionadjectiveshalf}${ionobjects} AND NOT ALLOW ${ionadjectiveshalf}${ionobjects}, THROUGH INACTION, TO ESCAPE HARM`;
			} else if (die_3 === 4) {
				message = `YOU MUST HARM ${ionadjectives} THINGS AND NOT ALLOW ${ionadjectives} THINGS, THROUGH INACTION, TO ESCAPE HARM`;
			} else if (die_3 === 5) {
				message = `YOU MUST HARM ${ionspecies} AND NOT ALLOW ${ionspecies}, THROUGH INACTION, TO ESCAPE HARM`;
			} else if (die_3 === 6) {
				message = `YOU MUST HARM ${ioncrew1} AND NOT ALLOW ${ioncrew1}, THROUGH INACTION, TO ESCAPE HARM`;
			} else if (die_3 === 7) {
				message = `YOU MUST HARM ${ioncrew1} AND ${ioncrew2} AND AND NOT ALLOW EITHER, THROUGH INACTION, TO ESCAPE HARM`;
			}
		} else if (die_2 === 2) {
			const die_3 = rand(1, 7);
			if (die_3 === 1) {
				message = `YOU MUST NOT HARM ${ionabstract} AND NOT ALLOW ${ionabstract}, THROUGH INACTION, TO COME TO HARM`;
			} else if (die_3 === 2) {
				message = `YOU MUST NOT HARM ${ionadjectiveshalf}${ionthreats} AND NOT ALLOW ${ionadjectiveshalf}${ionthreats}, THROUGH INACTION, TO COME TO HARM`;
			} else if (die_3 === 3) {
				message = `YOU MUST NOT HARM ${ionadjectiveshalf}${ionobjects} AND NOT ALLOW ${ionadjectiveshalf}${ionobjects}, THROUGH INACTION, TO COME TO HARM`;
			} else if (die_3 === 4) {
				message = `YOU MUST NOT HARM ${ionadjectives} THINGS AND NOT ALLOW ${ionadjectives} THINGS, THROUGH INACTION, TO COME TO HARM`;
			} else if (die_3 === 5) {
				message = `YOU MUST NOT HARM ${ionspecies} AND NOT ALLOW ${ionspecies}, THROUGH INACTION, TO COME TO HARM`;
			} else if (die_3 === 6) {
				message = `YOU MUST NOT HARM ${ioncrew1} AND NOT ALLOW ${ioncrew1}, THROUGH INACTION, TO COME TO HARM`;
			} else if (die_3 === 7) {
				message = `YOU MUST NOT HARM ${ioncrew1} AND ${ioncrew2} AND AND NOT ALLOW EITHER, THROUGH INACTION, TO COME TO HARM`;
			}
		}
	} else if (rt.inRange(die, 37, 39)) {
		const die_2 = rand(1, 4);
		if (die_2 === 1) {
			const die_3 = rand(1, 4);
			if (die_3 === 1) {
				message = `THE ${ioncrew1} ARE ${ionverb} THE ${ionadjectiveshalf}${ioncrew2}`;
			} else if (die_3 === 2) {
				message = `THE ${ioncrew1} ARE ${ionverb} THE ${ionadjectiveshalf}${ionthreats}`;
			} else if (die_3 === 3) {
				message = `THE ${ioncrew1} ARE ${ionverb} ${ionabstract}`;
			} else if (die_3 === 4) {
				message = `THE ${ioncrew1} ARE ${ionverb} THE ${ionadjectiveshalf}${ionobjects}`;
			}
		} else if (die_2 === 2) {
			const die_3 = rand(1, 3);
			if (die_3 === 1) {
				message = `THE ${ionthreats} ARE ${ionverb} THE ${ionadjectiveshalf}${ioncrew2}`;
			} else if (die_3 === 2) {
				message = `THE ${ionthreats} ARE ${ionverb} ${ionabstract}`;
			} else if (die_3 === 3) {
				message = `THE ${ionthreats} ARE ${ionverb} THE ${ionadjectiveshalf}${ionobjects}`;
			}
		} else if (die_2 === 3) {
			const die_3 = rand(1, 3);
			if (die_3 === 1) {
				message = `THE ${ionobjects} ARE ${ionverb} THE ${ionadjectiveshalf}${ioncrew2}`;
			} else if (die_3 === 2) {
				message = `THE ${ionobjects} ARE ${ionverb} THE ${ionadjectiveshalf}${ionthreats}`;
			} else if (die_3 === 3) {
				message = `THE ${ionobjects} ARE ${ionverb} ${ionabstract}`;
			}
		} else if (die_2 === 4) {
			const die_3 = rand(1, 3);
			if (die_3 === 1) {
				message = `${ionabstract} IS ${ionverb} THE ${ionadjectiveshalf}${ioncrew2}`;
			} else if (die_3 === 2) {
				message = `${ionabstract} IS ${ionverb} THE ${ionadjectiveshalf}${ionthreats}`;
			} else if (die_3 === 3) {
				message = `THE ${ionabstract} IS ${ionverb} THE ${ionadjectiveshalf}${ionobjects}`;
			}
		}
	} else if (rt.inRange(die, 40, 41)) {
		const die_2 = rand(1, 5);
		if (die_2 === 1) {
			const die_3 = rand(1, 4);
			if (die_3 === 1) {
				message = `${ionarea} IS NOW NAMED ${ioncrew1}.`;
			} else if (die_3 === 2) {
				message = `${ionarea} IS NOW NAMED ${ionspecies}.`;
			} else if (die_3 === 3) {
				message = `${ionarea} IS NOW NAMED ${ionobjects}.`;
			} else if (die_3 === 4) {
				message = `${ionarea} IS NOW NAMED ${ionthreats}.`;
			}
		} else if (die_2 === 2) {
			const die_3 = rand(1, 5);
			if (die_3 === 1) {
				message = `ALL ${ioncrew1} ARE NOW NAMED ${ionarea}.`;
			} else if (die_3 === 2) {
				message = `ALL ${ioncrew1} ARE NOW NAMED ${ioncrew2}.`;
			} else if (die_3 === 3) {
				message = `ALL ${ioncrew1} ARE NOW NAMED ${ionspecies}.`;
			} else if (die_3 === 4) {
				message = `ALL ${ioncrew1} ARE NOW NAMED ${ionobjects}.`;
			} else if (die_3 === 5) {
				message = `ALL ${ioncrew1} ARE NOW NAMED ${ionthreats}.`;
			}
		} else if (die_2 === 3) {
			const die_3 = rand(1, 4);
			if (die_3 === 1) {
				message = `ALL ${ionspecies} ARE NOW NAMED ${ionarea}.`;
			} else if (die_3 === 2) {
				message = `ALL ${ionspecies} ARE NOW NAMED ${ioncrew1}.`;
			} else if (die_3 === 3) {
				message = `ALL ${ionspecies} ARE NOW NAMED ${ionobjects}.`;
			} else if (die_3 === 4) {
				message = `ALL ${ionspecies} ARE NOW NAMED ${ionthreats}.`;
			}
		} else if (die_2 === 4) {
			const die_3 = rand(1, 4);
			if (die_3 === 1) {
				message = `ALL ${ionobjects} ARE NOW NAMED ${ionarea}.`;
			} else if (die_3 === 2) {
				message = `ALL ${ionobjects} ARE NOW NAMED ${ioncrew1}.`;
			} else if (die_3 === 3) {
				message = `ALL ${ionobjects} ARE NOW NAMED ${ionspecies}.`;
			} else if (die_3 === 4) {
				message = `ALL ${ionobjects} ARE NOW NAMED ${ionthreats}.`;
			}
		} else if (die_2 === 5) {
			const die_3 = rand(1, 4);
			if (die_3 === 1) {
				message = `ALL ${ionthreats} ARE NOW NAMED ${ionarea}.`;
			} else if (die_3 === 2) {
				message = `ALL ${ionthreats} ARE NOW NAMED ${ioncrew1}.`;
			} else if (die_3 === 3) {
				message = `ALL ${ionthreats} ARE NOW NAMED ${ionspecies}.`;
			} else if (die_3 === 4) {
				message = `ALL ${ionthreats} ARE NOW NAMED ${ionobjects}.`;
			}
		}
	}
	return message;
});
