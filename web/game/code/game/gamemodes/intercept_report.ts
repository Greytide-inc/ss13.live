// From code/game/gamemodes/intercept_report.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1101, "/datum/intercept_text", "/datum", {
	text: null,
});

// /datum/intercept_text/proc/build  (code/game/gamemodes/intercept_report.dm:7)
rt.def("/datum/intercept_text/proc/build", function build(f: Frame, mode_type: Value) {
	let $0: any;
	f.vars = () => [$0];
	rt.setSv(f, "text", "<hr>");
	$0 = live(mode_type);
	if ($0 === "blob") {
		rt.modSrcVar(f, "text", fmt("A CMP scientist by the name of ＀ boasted about his corporation's \"finest creation\" - a macrobiological virus capable of self-reproduction and hellbent on consuming whatever it touches. He went on to query Cybersun for permission to utilize the virus in biochemical warfare, to which CMP subsequently gained. Be vigilant for any large organisms rapidly spreading across the station, as they are classified as a level 5 biohazard and critically dangerous. Note that this organism seems to be weak to extreme heat; concentrated fire (such as welding tools and lasers) will be effective against it.", [rt.op(f, "PickUnweighted", [6], ["Griff", "Pasteur", "Chamberland", "Buist", "Rivers", "Stanley"])]), add);
	} else if ($0 === "changeling") {
		rt.modSrcVar(f, "text", fmt("The Gorlex Marauders have announced the successful raid and destruction of Central Command containment ship #S-＀. This ship housed only a single prisoner - codenamed \"Thing\", and it was highly adaptive and extremely dangerous. We have reason to believe that the Thing has allied with the Syndicate, and you should note that likelihood of the Thing being sent to a station in this sector is highly likely. It may be in the guise of any crew member. Trust nobody - suspect everybody. Do not announce this to the crew, as paranoia may spread and inhibit workplace efficiency.", [rt.call(f, P("/proc/rand"), null, [1111, 9999])]), add);
	} else if ($0 === "clock_cult") {
		rt.modSrcVar(f, "text", "We have lost contact with multiple stations in your sector. They have gone dark and do not respond to all transmissions, although they appear intact and the crew's life signs remain uninterrupted. Those that have managed to send a transmission or have had some of their crew escape tell tales of a machine cult creating sapient automatons and seeking to brainwash the crew to summon their god, Ratvar. If evidence of this cult is dicovered aboard your station, extreme caution and extreme vigilance must be taken going forward, and all resources should be devoted to stopping this cult. Note that holy water seems to weaken and eventually return the minds of cultists that ingest it, and mindshield implants will prevent conversion altogether.", add);
	} else if ($0 === "cult") {
		rt.modSrcVar(f, "text", "Some stations in your sector have reported evidence of blood sacrifice and strange magic. Ties to the Wizards' Federation have been proven not to exist, and many employees have disappeared; even Central Command employees light-years away have felt strange presences and at times hysterical compulsions. Interrogations point towards this being the work of the cult of Nar-Sie. If evidence of this cult is discovered aboard your station, extreme caution and extreme vigilance must be taken going forward, and all resources should be devoted to stopping this cult. Note that holy water seems to weaken and eventually return the minds of cultists that ingest it, and mindshield implants will prevent conversion altogether.", add);
	} else if ($0 === "extended") {
		rt.modSrcVar(f, "text", "The transmission mostly failed to mention your sector. It is possible that there is nothing in the Syndicate that could threaten your station during this shift.", add);
	} else if ($0 === "gang") {
		rt.modSrcVar(f, "text", "Cybersun Industries representatives claimed that they, in joint research with the Tiger Cooperative, have made a major breakthrough in brainwashing technology, and have made the nanobots that apply the \"conversion\" very small and capable of fitting into usually innocent objects - namely, pens. While they refused to outsource this technology for months to come due to its flaws, they reported some as missing but passed it off to carelessness. At Central Command, we don't like mysteries, and we have reason to believe that this technology was stolen for anti-Nanotrasen use. Be on the lookout for territory claims and unusually violent crew behavior, applying mindshield implants as necessary.", add);
	} else if ($0 === "malf") {
		rt.modSrcVar(f, "text", "A large ionospheric anomaly recently passed through your sector. Although physically undetectable, ionospherics tend to have an extreme effect on telecommunications equipment as well as artificial intelligence units. Closely observe the behavior of artificial intelligence, and treat any machine malfunctions as purposeful. If necessary, termination of the artificial intelligence is advised; assuming that it activates the station's self-destruct, your pinpointer has been configured to constantly track it, wherever it may be.", add);
	} else if ($0 === "nuclear") {
		rt.modSrcVar(f, "text", "One of Central Command's trading routes was recently disrupted by a raid carried out by the Gorlex Marauders. They seemed to only be after one ship - a highly-sensitive transport containing a nuclear fission explosive, although it is useless without the proper code and authorization disk. While the code was likely found in minutes, the only disk that can activate this explosive is on your station. Ensure that it is protected at all times, and remain alert for possible intruders.", add);
	} else if ($0 === "revolution") {
		rt.modSrcVar(f, "text", "Employee unrest has spiked in recent weeks, with several attempted mutinies on heads of staff. Some crew have been observed using flashbulb devices to blind their colleagues, who then follow their orders without question and work towards dethroning departmental leaders. Watch for behavior such as this with caution. If the crew attempts a mutiny, you and your heads of staff are fully authorized to execute them using lethal weaponry - they will be later cloned and interrogated at Central Command.", add);
	} else if ($0 === "traitor") {
		rt.modSrcVar(f, "text", "Although more specific threats are commonplace, you should always remain vigilant for Syndicate agents aboard your station. Syndicate communications have implied that many Nanotrasen employees are Syndicate agents with hidden memories that may be activated at a moment's notice, so it's possible that these agents might not even know their positions.", add);
	} else if ($0 === "wizard") {
		rt.modSrcVar(f, "text", fmt("A dangerous Wizards' Federation individual by the name of ＀ ＀ has recently escaped confinement from an unlisted prison facility. This man is a dangerous mutant with the ability to alter himself and the world around him by what he and his leaders believe to be magic. If this man attempts an attack on your station, his execution is highly encouraged, as is the preservation of his body for later study.", [rt.op(f, "PickUnweighted", [1], [rt.gl("wizard_first")]), rt.op(f, "PickUnweighted", [1], [rt.gl("wizard_second")])]), add);
	}
	return rt.sv(f, "text");
});
