// From _nofile (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/failsafe/proc/defcon_pretty  (_nofile:0)
rt.def("/datum/controller/failsafe/proc/defcon_pretty", function defcon_pretty(f: Frame) {
	return rt.sv(f, "defcon");
});

// /datum/controller/subsystem/proc/Recover  empty
rt.def("/datum/controller/subsystem/proc/Recover");

// /datum/controller/subsystem/proc/New  (_nofile:0)
rt.def("/datum/controller/subsystem/proc/New", function New(f: Frame) {
	return live(f.dot);
});

// /datum/controller/subsystem/proc/PreInit  (_nofile:0)
rt.def("/datum/controller/subsystem/proc/PreInit", function PreInit(f: Frame) {
	return live(f.dot);
});

// /datum/controller/subsystem/augury/proc/register_doom  (_nofile:0)
rt.def("/datum/controller/subsystem/augury/proc/register_doom", function register_doom(f: Frame, A: Value, severity: Value) {
	rt.setAt(rt.sv(f, "doombringers"), live(A), live(severity));
	return f.dot;
});

// /datum/controller/subsystem/disease/proc/Recover  (_nofile:0)
rt.def("/datum/controller/subsystem/disease/proc/Recover", function Recover(f: Frame) {
	rt.setSv(f, "currentrun", rt.fv(f, "currentrun", rt.gl("SSdisease")));
	rt.setSv(f, "processing", rt.fv(f, "processing", rt.gl("SSdisease")));
	rt.setSv(f, "diseases", rt.fv(f, "diseases", rt.gl("SSdisease")));
	rt.setSv(f, "archive_diseases", rt.fv(f, "archive_diseases", rt.gl("SSdisease")));
	return f.dot;
});

// /datum/controller/subsystem/inbounds/proc/Recover  (_nofile:0)
rt.def("/datum/controller/subsystem/inbounds/proc/Recover", function Recover(f: Frame) {
	rt.setSv(f, "processing", rt.fv(f, "processing", rt.gl("SSinbounds")));
	return f.dot;
});

// /datum/controller/subsystem/npcpool/proc/Recover  (_nofile:0)
rt.def("/datum/controller/subsystem/npcpool/proc/Recover", function Recover(f: Frame) {
	rt.setSv(f, "processing", rt.fv(f, "processing", rt.gl("SSnpcpool")));
	return f.dot;
});

// /datum/controller/subsystem/pai/proc/spam_again  (_nofile:0)
rt.def("/datum/controller/subsystem/pai/proc/spam_again", function spam_again(f: Frame) {
	rt.setSv(f, "ghost_spam", 0);
	return f.dot;
});

// /datum/controller/subsystem/title/proc/Recover  (_nofile:0)
rt.def("/datum/controller/subsystem/title/proc/Recover", function Recover(f: Frame) {
	rt.setSv(f, "icon", rt.fv(f, "icon", rt.gl("SStitle")));
	rt.setSv(f, "splash_turf", rt.fv(f, "splash_turf", rt.gl("SStitle")));
	rt.setSv(f, "file_path", rt.fv(f, "file_path", rt.gl("SStitle")));
	rt.setSv(f, "previous_icon", rt.fv(f, "previous_icon", rt.gl("SStitle")));
	return f.dot;
});

// /datum/controller/subsystem/processing/overlays/proc/Recover  (_nofile:0)
rt.def("/datum/controller/subsystem/processing/overlays/proc/Recover", function Recover(f: Frame) {
	rt.setSv(f, "overlay_icon_state_caches", rt.fv(f, "overlay_icon_state_caches", rt.gl("SSoverlays")));
	rt.setSv(f, "overlay_icon_cache", rt.fv(f, "overlay_icon_cache", rt.gl("SSoverlays")));
	rt.setSv(f, "processing", rt.fv(f, "processing", rt.gl("SSoverlays")));
	return f.dot;
});

// /datum/controller/subsystem/obj/proc/Recover  (_nofile:0)
rt.def("/datum/controller/subsystem/obj/proc/Recover", function Recover(f: Frame) {
	rt.setSv(f, "processing", rt.fv(f, "processing", rt.gl("SSobj")));
	return f.dot;
});

// /datum/projectile_data/proc/New  (_nofile:0)
rt.def("/datum/projectile_data/proc/New", function New(f: Frame, src_x: Value, src_y: Value, time: Value, distance: Value, power_x: Value, power_y: Value, dest_x: Value, dest_y: Value) {
	rt.setFv(f, "src_x", live(f.src), live(src_x));
	rt.setFv(f, "src_y", live(f.src), live(src_y));
	rt.setFv(f, "time", live(f.src), live(time));
	rt.setFv(f, "distance", live(f.src), live(distance));
	rt.setFv(f, "power_x", live(f.src), live(power_x));
	rt.setFv(f, "power_y", live(f.src), live(power_y));
	rt.setFv(f, "dest_x", live(f.src), live(dest_x));
	rt.setFv(f, "dest_y", live(f.src), live(dest_y));
	return f.dot;
});

// /datum/proc/can_vv_get  (_nofile:0)
rt.def("/datum/proc/can_vv_get", function can_vv_get(f: Frame, var_name: Value) {
	return 1;
});

// /datum/proc/on_reagent_change  (_nofile:0)
rt.def("/datum/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	return live(f.dot);
});

// /datum/proc/ui_interact  (_nofile:0)
rt.def("/datum/proc/ui_interact", function ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(ui) === null) {
		ui = null;
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(master_ui) === null) {
		master_ui = null;
	}
	if (live(state) === null) {
		state = rt.gl("default_state");
	}
	return -1;
});

// /datum/proc/ui_host  (_nofile:0)
rt.def("/datum/proc/ui_host", function ui_host(f: Frame) {
	return live(f.src);
});

// /datum/hud/proc/hidden_inventory_update  (_nofile:0)
rt.def("/datum/hud/proc/hidden_inventory_update", function hidden_inventory_update(f: Frame) {
	return live(f.dot);
});

// /datum/hud/proc/update_locked_slots  (_nofile:0)
rt.def("/datum/hud/proc/update_locked_slots", function update_locked_slots(f: Frame) {
	return live(f.dot);
});

// /datum/action/innate/proc/Activate  (_nofile:0)
rt.def("/datum/action/innate/proc/Activate", function Activate(f: Frame) {
	return live(f.dot);
});

// /datum/action/innate/proc/Deactivate  (_nofile:0)
rt.def("/datum/action/innate/proc/Deactivate", function Deactivate(f: Frame) {
	return live(f.dot);
});

// /datum/action/vote/proc/IsAvailable  (_nofile:0)
rt.def("/datum/action/vote/proc/IsAvailable", function IsAvailable(f: Frame) {
	return 1;
});

// /datum/action/proc/Process  (_nofile:0)
rt.def("/datum/action/proc/Process", function Process(f: Frame) {
	return live(f.dot);
});

// /datum/round_event/proc/setup  (_nofile:0)
rt.def("/datum/round_event/proc/setup", function setup(f: Frame) {
	return live(f.dot);
});

// /datum/round_event/proc/start  (_nofile:0)
rt.def("/datum/round_event/proc/start", function start(f: Frame) {
	return live(f.dot);
});

// /datum/round_event/proc/announce  (_nofile:0)
rt.def("/datum/round_event/proc/announce", function announce(f: Frame) {
	return live(f.dot);
});

// /datum/round_event/proc/tick  (_nofile:0)
rt.def("/datum/round_event/proc/tick", function tick(f: Frame) {
	return live(f.dot);
});

// /datum/round_event/proc/end  (_nofile:0)
rt.def("/datum/round_event/proc/end", function end(f: Frame) {
	return live(f.dot);
});

// /datum/round_event/ghost_role/proc/spawn_role  (_nofile:0)
rt.def("/datum/round_event/ghost_role/proc/spawn_role", function spawn_role(f: Frame) {
	return 1;
});

// /datum/admins/proc/vv_edit_var  (_nofile:0)
rt.def("/datum/admins/proc/vv_edit_var", function vv_edit_var(f: Frame, var_name: Value, var_value: Value) {
	return 0;
});

// /datum/beam/proc/afterDraw  (_nofile:0)
rt.def("/datum/beam/proc/afterDraw", function afterDraw(f: Frame) {
	return live(f.dot);
});

// /datum/data/mining_equipment/proc/New  (_nofile:0)
rt.def("/datum/data/mining_equipment/proc/New", function New(f: Frame, name: Value, path: Value, cost: Value) {
	rt.setFv(f, "equipment_name", live(f.src), live(name));
	rt.setFv(f, "equipment_path", live(f.src), live(path));
	rt.setFv(f, "cost", live(f.src), live(cost));
	return f.dot;
});

// /datum/dna/stored/proc/add_mutation  (_nofile:0)
rt.def("/datum/dna/stored/proc/add_mutation", function add_mutation(f: Frame, mutation_name: Value) {
	return live(f.dot);
});

// /datum/dna/stored/proc/remove_mutation  (_nofile:0)
rt.def("/datum/dna/stored/proc/remove_mutation", function remove_mutation(f: Frame, mutation_name: Value) {
	return live(f.dot);
});

// /datum/dna/stored/proc/check_mutation  (_nofile:0)
rt.def("/datum/dna/stored/proc/check_mutation", function check_mutation(f: Frame, mutation_name: Value) {
	return live(f.dot);
});

// /datum/dna/stored/proc/remove_all_mutations  (_nofile:0)
rt.def("/datum/dna/stored/proc/remove_all_mutations", function remove_all_mutations(f: Frame) {
	return live(f.dot);
});

// /datum/dna/stored/proc/remove_mutation_group  (_nofile:0)
rt.def("/datum/dna/stored/proc/remove_mutation_group", function remove_mutation_group(f: Frame, group: Value) {
	return live(f.dot);
});

// /datum/dog_fashion/proc/apply  (_nofile:0)
rt.def("/datum/dog_fashion/proc/apply", function apply(f: Frame, D: Value) {
	if (truthy(rt.sv(f, "name"))) {
		rt.setFv(f, "name", live(D), rt.sv(f, "name"));
	}
	if (truthy(rt.sv(f, "desc"))) {
		rt.setFv(f, "desc", live(D), rt.sv(f, "desc"));
	}
	if (truthy(rt.sv(f, "emote_see"))) {
		rt.setFv(f, "emote_see", live(D), rt.sv(f, "emote_see"));
	}
	if (truthy(rt.sv(f, "emote_hear"))) {
		rt.setFv(f, "emote_hear", live(D), rt.sv(f, "emote_hear"));
	}
	if (truthy(rt.sv(f, "speak"))) {
		rt.setFv(f, "speak", live(D), rt.sv(f, "speak"));
	}
	if (!truthy(rt.sv(f, "speak_emote"))) return f.dot;
	rt.setFv(f, "speak_emote", live(D), rt.sv(f, "speak_emote"));
	return f.dot;
});

// /datum/emote/living/custom/proc/replace_pronoun  (_nofile:0)
rt.def("/datum/emote/living/custom/proc/replace_pronoun", function replace_pronoun(f: Frame, user: Value, message: Value) {
	return live(message);
});

// /datum/atom_hud/alternate_appearance/proc/mobShouldSee  (_nofile:0)
rt.def("/datum/atom_hud/alternate_appearance/proc/mobShouldSee", function mobShouldSee(f: Frame, M: Value) {
	return 0;
});

// /datum/martial_art/proc/disarm_act  (_nofile:0)
rt.def("/datum/martial_art/proc/disarm_act", function disarm_act(f: Frame, A: Value, D: Value) {
	return 0;
});

// /datum/martial_art/proc/harm_act  (_nofile:0)
rt.def("/datum/martial_art/proc/harm_act", function harm_act(f: Frame, A: Value, D: Value) {
	return 0;
});

// /datum/martial_art/proc/grab_act  (_nofile:0)
rt.def("/datum/martial_art/proc/grab_act", function grab_act(f: Frame, A: Value, D: Value) {
	return 0;
});

// /datum/martial_art/cqc/proc/drop_restraining  (_nofile:0)
rt.def("/datum/martial_art/cqc/proc/drop_restraining", function drop_restraining(f: Frame) {
	rt.setSv(f, "restraining", 0);
	return f.dot;
});

// /datum/mutation/proc/New  (_nofile:0)
rt.def("/datum/mutation/proc/New", function New(f: Frame) {
	rt.setAt(rt.gl("mutations_list"), rt.sv(f, "name"), live(f.src));
	return f.dot;
});

// /datum/mutation/human/proc/get_visual_indicator  (_nofile:0)
rt.def("/datum/mutation/human/proc/get_visual_indicator", function get_visual_indicator(f: Frame, owner: Value) {
	return live(f.dot);
});

// /datum/mutation/human/proc/on_attack_hand  (_nofile:0)
rt.def("/datum/mutation/human/proc/on_attack_hand", function on_attack_hand(f: Frame, owner: Value, target: Value, proximity: Value) {
	return live(f.dot);
});

// /datum/mutation/human/proc/on_ranged_attack  (_nofile:0)
rt.def("/datum/mutation/human/proc/on_ranged_attack", function on_ranged_attack(f: Frame, owner: Value, target: Value) {
	return live(f.dot);
});

// /datum/mutation/human/proc/on_move  (_nofile:0)
rt.def("/datum/mutation/human/proc/on_move", function on_move(f: Frame, owner: Value, new_loc: Value) {
	return live(f.dot);
});

// /datum/mutation/human/proc/on_life  (_nofile:0)
rt.def("/datum/mutation/human/proc/on_life", function on_life(f: Frame, owner: Value) {
	return live(f.dot);
});

// /datum/mutation/human/proc/say_mod  (_nofile:0)
rt.def("/datum/mutation/human/proc/say_mod", function say_mod(f: Frame, message: Value) {
	if (!truthy(live(message))) return f.dot;
	return live(message);
});

// /datum/outfit/proc/pre_equip  (_nofile:0)
rt.def("/datum/outfit/proc/pre_equip", function pre_equip(f: Frame, H: Value, visualsOnly: Value) {
	f.vars = () => [visualsOnly];
	if (live(visualsOnly) === null) {
		visualsOnly = 0;
	}
	return live(f.dot);
});

// /datum/outfit/proc/post_equip  (_nofile:0)
rt.def("/datum/outfit/proc/post_equip", function post_equip(f: Frame, H: Value, visualsOnly: Value) {
	f.vars = () => [visualsOnly];
	if (live(visualsOnly) === null) {
		visualsOnly = 0;
	}
	return live(f.dot);
});

// /datum/riding/proc/ride_check  (_nofile:0)
rt.def("/datum/riding/proc/ride_check", function ride_check(f: Frame, M: Value) {
	return 1;
});

// /datum/riding/space/proc/Process_Spacemove  (_nofile:0)
rt.def("/datum/riding/space/proc/Process_Spacemove", function Process_Spacemove(f: Frame, direction: Value) {
	return 1;
});

// /datum/map_template/shuttle/proc/prerequisites_met  (_nofile:0)
rt.def("/datum/map_template/shuttle/proc/prerequisites_met", function prerequisites_met(f: Frame) {
	return 1;
});

// /datum/map_template/shuttle/proc/on_bought  (_nofile:0)
rt.def("/datum/map_template/shuttle/proc/on_bought", function on_bought(f: Frame) {
	return live(f.dot);
});

// /datum/verbs/proc/HandleVerb  (_nofile:0)
rt.def("/datum/verbs/proc/HandleVerb", function HandleVerb(f: Frame, entry: Value, verbpath: Value) {
	return live(entry);
});

// /datum/verbs/menu/proc/GetList  (_nofile:0)
rt.def("/datum/verbs/menu/proc/GetList", function GetList(f: Frame) {
	return rt.gl("menulist");
});

// /datum/verbs/menu/proc/Load_checked  (_nofile:0)
rt.def("/datum/verbs/menu/proc/Load_checked", function Load_checked(f: Frame, C: Value) {
	return live(f.dot);
});

// /datum/antagonist/proc/apply_innate_effects  (_nofile:0)
rt.def("/datum/antagonist/proc/apply_innate_effects", function apply_innate_effects(f: Frame, mob_override: Value) {
	return live(f.dot);
});

// /datum/antagonist/proc/remove_innate_effects  (_nofile:0)
rt.def("/datum/antagonist/proc/remove_innate_effects", function remove_innate_effects(f: Frame, mob_override: Value) {
	return live(f.dot);
});

// /datum/antagonist/proc/greet  (_nofile:0)
rt.def("/datum/antagonist/proc/greet", function greet(f: Frame) {
	return live(f.dot);
});

// /datum/antagonist/proc/farewell  (_nofile:0)
rt.def("/datum/antagonist/proc/farewell", function farewell(f: Frame) {
	return live(f.dot);
});

// /datum/antagonist/traitor/proc/equip  empty
rt.def("/datum/antagonist/traitor/proc/equip", undefined, false, { args: ["silent"] });

// /datum/antagonist/traitor/proc/transfer_important_variables  (_nofile:0)
rt.def("/datum/antagonist/traitor/proc/transfer_important_variables", function transfer_important_variables(f: Frame, other: Value) {
	rt.setFv(f, "silent", live(other), rt.sv(f, "silent"));
	rt.setFv(f, "employer", live(other), rt.sv(f, "employer"));
	rt.setFv(f, "special_role", live(other), rt.sv(f, "special_role"));
	rt.setFv(f, "objectives_given", live(other), rt.sv(f, "objectives_given"));
	return f.dot;
});

// /datum/antagonist/traitor/proc/forge_traitor_objectives  (_nofile:0)
rt.def("/datum/antagonist/traitor/proc/forge_traitor_objectives", function forge_traitor_objectives(f: Frame) {
	return live(f.dot);
});

// /datum/antagonist/traitor/proc/forge_single_objective  (_nofile:0)
rt.def("/datum/antagonist/traitor/proc/forge_single_objective", function forge_single_objective(f: Frame) {
	return 0;
});

// /datum/status_effect/proc/tick  empty
rt.def("/datum/status_effect/proc/tick");

// /datum/status_effect/proc/on_remove  empty
rt.def("/datum/status_effect/proc/on_remove");

// /datum/status_effect/proc/on_apply  (_nofile:0)
rt.def("/datum/status_effect/proc/on_apply", function on_apply(f: Frame) {
	return 1;
});

// /datum/disease/proc/GetDiseaseID  (_nofile:0)
rt.def("/datum/disease/proc/GetDiseaseID", function GetDiseaseID(f: Frame) {
	return rt.sv(f, "type");
});

// /datum/disease/advance/proc/AssignName  (_nofile:0)
rt.def("/datum/disease/advance/proc/AssignName", function AssignName(f: Frame, name: Value) {
	f.vars = () => [name];
	if (live(name) === null) {
		name = "Unknown";
	}
	rt.setFv(f, "name", live(f.src), live(name));
	return live(f.dot);
});

// /datum/symptom/proc/Start  (_nofile:0)
rt.def("/datum/symptom/proc/Start", function Start(f: Frame, A: Value) {
	return live(f.dot);
});

// /datum/symptom/proc/End  (_nofile:0)
rt.def("/datum/symptom/proc/End", function End(f: Frame, A: Value) {
	return live(f.dot);
});

// /datum/symptom/proc/Activate  (_nofile:0)
rt.def("/datum/symptom/proc/Activate", function Activate(f: Frame, A: Value) {
	return live(f.dot);
});

// /datum/construction/proc/action  (_nofile:0)
rt.def("/datum/construction/proc/action", function action(f: Frame, used_atom: Value, user: Value) {
	return live(f.dot);
});

// /datum/construction/proc/custom_action  (_nofile:0)
rt.def("/datum/construction/proc/custom_action", function custom_action(f: Frame, step: Value, used_atom: Value, user: Value) {
	return 1;
});

// /datum/construction/reversible/proc/custom_action  (_nofile:0)
rt.def("/datum/construction/reversible/proc/custom_action", function custom_action(f: Frame, index: Value, diff: Value, used_atom: Value, user: Value) {
	return 1;
});

// /datum/teleport/proc/teleportChecks  (_nofile:0)
rt.def("/datum/teleport/proc/teleportChecks", function teleportChecks(f: Frame) {
	return 1;
});

// /datum/weather/proc/impact  (_nofile:0)
rt.def("/datum/weather/proc/impact", function impact(f: Frame, L: Value) {
	return live(f.dot);
});

// /datum/wires/explosive/proc/explode  (_nofile:0)
rt.def("/datum/wires/explosive/proc/explode", function explode(f: Frame) {
	return live(f.dot);
});

// /datum/wires/proc/interactable  (_nofile:0)
rt.def("/datum/wires/proc/interactable", function interactable(f: Frame, user: Value) {
	return 1;
});

// /datum/wires/proc/on_cut  (_nofile:0)
rt.def("/datum/wires/proc/on_cut", function on_cut(f: Frame, wire: Value, mend: Value) {
	f.vars = () => [mend];
	if (live(mend) === null) {
		mend = 0;
	}
	return live(f.dot);
});

// /datum/wires/proc/on_pulse  (_nofile:0)
rt.def("/datum/wires/proc/on_pulse", function on_pulse(f: Frame, wire: Value) {
	return live(f.dot);
});

// /datum/wires/proc/ui_host  (_nofile:0)
rt.def("/datum/wires/proc/ui_host", function ui_host(f: Frame) {
	return rt.sv(f, "holder");
});

// /datum/signal/proc/copy_from  (_nofile:0)
rt.def("/datum/signal/proc/copy_from", function copy_from(f: Frame, model: Value) {
	rt.setSv(f, "source", rt.fv(f, "source", live(model)));
	rt.setSv(f, "transmission_method", rt.fv(f, "transmission_method", live(model)));
	rt.setSv(f, "data", rt.fv(f, "data", live(model)));
	rt.setSv(f, "encryption", rt.fv(f, "encryption", live(model)));
	rt.setSv(f, "frequency", rt.fv(f, "frequency", live(model)));
	return f.dot;
});

// /datum/game_mode/proc/pre_setup  (_nofile:0)
rt.def("/datum/game_mode/proc/pre_setup", function pre_setup(f: Frame) {
	return 1;
});

// /datum/game_mode/proc/process  (_nofile:0)
rt.def("/datum/game_mode/proc/process", function process(f: Frame) {
	return 0;
}, false, { waitfor: false });

// /datum/game_mode/proc/check_win  (_nofile:0)
rt.def("/datum/game_mode/proc/check_win", function check_win(f: Frame) {
	return 0;
});

// /datum/game_mode/extended/proc/pre_setup  (_nofile:0)
rt.def("/datum/game_mode/extended/proc/pre_setup", function pre_setup(f: Frame) {
	return 1;
});

// /datum/objective/proc/update_explanation_text  empty
rt.def("/datum/objective/proc/update_explanation_text");

// /datum/objective/proc/check_completion  (_nofile:0)
rt.def("/datum/objective/proc/check_completion", function check_completion(f: Frame) {
	return rt.sv(f, "completed");
});

// /datum/objective/proc/get_target  (_nofile:0)
rt.def("/datum/objective/proc/get_target", function get_target(f: Frame) {
	return rt.sv(f, "target");
});

// /datum/objective/steal/proc/get_target  (_nofile:0)
rt.def("/datum/objective/steal/proc/get_target", function get_target(f: Frame) {
	return rt.sv(f, "steal_target");
});

// /datum/objective/revenantFluff/proc/check_completion  (_nofile:0)
rt.def("/datum/objective/revenantFluff/proc/check_completion", function check_completion(f: Frame) {
	return 1;
});

// /datum/objective_item/proc/check_special_completion  (_nofile:0)
rt.def("/datum/objective_item/proc/check_special_completion", function check_special_completion(f: Frame) {
	return 1;
});

// /datum/clockwork_scripture/proc/scripture_effects  empty
rt.def("/datum/clockwork_scripture/proc/scripture_effects");

// /datum/clockwork_scripture/proc/creation_update  (_nofile:0)
rt.def("/datum/clockwork_scripture/proc/creation_update", function creation_update(f: Frame) {
	return 0;
});

// /datum/clockwork_scripture/proc/check_special_requirements  (_nofile:0)
rt.def("/datum/clockwork_scripture/proc/check_special_requirements", function check_special_requirements(f: Frame) {
	return 1;
});

// /datum/gang/multiverse/proc/income  (_nofile:0)
rt.def("/datum/gang/multiverse/proc/income", function income(f: Frame) {
	return live(f.dot);
});

// /datum/gang_item/proc/can_see  (_nofile:0)
rt.def("/datum/gang_item/proc/can_see", function can_see(f: Frame, user: Value, gang: Value, gangtool: Value) {
	return 1;
});

// /datum/gang_item/proc/get_cost  (_nofile:0)
rt.def("/datum/gang_item/proc/get_cost", function get_cost(f: Frame, user: Value, gang: Value, gangtool: Value) {
	return rt.sv(f, "cost");
});

// /datum/gang_item/proc/get_name_display  (_nofile:0)
rt.def("/datum/gang_item/proc/get_name_display", function get_name_display(f: Frame, user: Value, gang: Value, gangtool: Value) {
	return rt.sv(f, "name");
});

// /datum/gang_item/proc/get_extra_info  (_nofile:0)
rt.def("/datum/gang_item/proc/get_extra_info", function get_extra_info(f: Frame, user: Value, gang: Value, gangtool: Value) {
	return live(f.dot);
});

// /datum/AI_Module/proc/upgrade  (_nofile:0)
rt.def("/datum/AI_Module/proc/upgrade", function upgrade(f: Frame, AI: Value) {
	return live(f.dot);
});

// /datum/surgery/proc/can_start  (_nofile:0)
rt.def("/datum/surgery/proc/can_start", function can_start(f: Frame, user: Value, target: Value) {
	return 1;
});

// /datum/surgery_step/proc/tool_check  (_nofile:0)
rt.def("/datum/surgery_step/proc/tool_check", function tool_check(f: Frame, user: Value, tool: Value) {
	return 1;
});

// /datum/spellbook_entry/proc/IsAvailible  (_nofile:0)
rt.def("/datum/spellbook_entry/proc/IsAvailible", function IsAvailible(f: Frame) {
	return 1;
});

// /datum/computer/file/embedded_program/proc/receive_user_command  empty
rt.def("/datum/computer/file/embedded_program/proc/receive_user_command", undefined, false, { args: ["command"] });

// /datum/computer/file/embedded_program/proc/process  (_nofile:0)
rt.def("/datum/computer/file/embedded_program/proc/process", function process(f: Frame) {
	return 0;
}, false, { waitfor: false });

// /datum/computer/file/embedded_program/simple_vent_controller/proc/process  (_nofile:0)
rt.def("/datum/computer/file/embedded_program/simple_vent_controller/proc/process", function process(f: Frame) {
	return 0;
}, false, { waitfor: false });

// /datum/proximity_monitor/advanced/proc/process_inner_turf  empty
rt.def("/datum/proximity_monitor/advanced/proc/process_inner_turf", undefined, false, { args: ["T"] });

// /datum/proximity_monitor/advanced/proc/process_edge_turf  empty
rt.def("/datum/proximity_monitor/advanced/proc/process_edge_turf", undefined, false, { args: ["T"] });

// /datum/proximity_monitor/advanced/proc/post_setup_field  empty
rt.def("/datum/proximity_monitor/advanced/proc/post_setup_field");

// /datum/proximity_monitor/advanced/proc/field_turf_canpass  (_nofile:0)
rt.def("/datum/proximity_monitor/advanced/proc/field_turf_canpass", function field_turf_canpass(f: Frame, AM: Value, F: Value, entering: Value) {
	return 1;
});

// /datum/proximity_monitor/advanced/proc/field_turf_uncross  (_nofile:0)
rt.def("/datum/proximity_monitor/advanced/proc/field_turf_uncross", function field_turf_uncross(f: Frame, AM: Value, F: Value) {
	return 1;
});

// /datum/proximity_monitor/advanced/proc/field_turf_crossed  (_nofile:0)
rt.def("/datum/proximity_monitor/advanced/proc/field_turf_crossed", function field_turf_crossed(f: Frame, AM: Value, F: Value) {
	return 1;
});

// /datum/proximity_monitor/advanced/proc/field_turf_uncrossed  (_nofile:0)
rt.def("/datum/proximity_monitor/advanced/proc/field_turf_uncrossed", function field_turf_uncrossed(f: Frame, AM: Value, F: Value) {
	return 1;
});

// /datum/proximity_monitor/advanced/proc/field_edge_canpass  (_nofile:0)
rt.def("/datum/proximity_monitor/advanced/proc/field_edge_canpass", function field_edge_canpass(f: Frame, AM: Value, F: Value, entering: Value) {
	return 1;
});

// /datum/proximity_monitor/advanced/proc/field_edge_uncross  (_nofile:0)
rt.def("/datum/proximity_monitor/advanced/proc/field_edge_uncross", function field_edge_uncross(f: Frame, AM: Value, F: Value) {
	return 1;
});

// /datum/proximity_monitor/advanced/proc/field_edge_crossed  (_nofile:0)
rt.def("/datum/proximity_monitor/advanced/proc/field_edge_crossed", function field_edge_crossed(f: Frame, AM: Value, F: Value) {
	return 1;
});

// /datum/proximity_monitor/advanced/proc/field_edge_uncrossed  (_nofile:0)
rt.def("/datum/proximity_monitor/advanced/proc/field_edge_uncrossed", function field_edge_uncrossed(f: Frame, AM: Value, F: Value) {
	return 1;
});

// /datum/stack_recipe/proc/New  (_nofile:0)
rt.def("/datum/stack_recipe/proc/New", function New(f: Frame, title: Value, result_type: Value, req_amount: Value, res_amount: Value, max_res_amount: Value, time: Value, one_per_turf: Value, on_floor: Value, window_checks: Value) {
	f.vars = () => [req_amount, res_amount, max_res_amount, time, one_per_turf, on_floor, window_checks];
	if (live(req_amount) === null) {
		req_amount = 1;
	}
	if (live(res_amount) === null) {
		res_amount = 1;
	}
	if (live(max_res_amount) === null) {
		max_res_amount = 1;
	}
	if (live(time) === null) {
		time = 0;
	}
	if (live(one_per_turf) === null) {
		one_per_turf = 0;
	}
	if (live(on_floor) === null) {
		on_floor = 0;
	}
	if (live(window_checks) === null) {
		window_checks = 0;
	}
	rt.setFv(f, "title", live(f.src), live(title));
	rt.setFv(f, "result_type", live(f.src), live(result_type));
	rt.setFv(f, "req_amount", live(f.src), live(req_amount));
	rt.setFv(f, "res_amount", live(f.src), live(res_amount));
	rt.setFv(f, "max_res_amount", live(f.src), live(max_res_amount));
	rt.setFv(f, "time", live(f.src), live(time));
	rt.setFv(f, "one_per_turf", live(f.src), live(one_per_turf));
	rt.setFv(f, "on_floor", live(f.src), live(on_floor));
	rt.setFv(f, "window_checks", live(f.src), live(window_checks));
	return f.dot;
});

// /datum/pipe_info/meter/proc/New  (_nofile:0)
rt.def("/datum/pipe_info/meter/proc/New", function New(f: Frame) {
	return live(f.dot);
});

// /datum/admin_rank/proc/vv_edit_var  (_nofile:0)
rt.def("/datum/admin_rank/proc/vv_edit_var", function vv_edit_var(f: Frame, var_name: Value, var_value: Value) {
	return 0;
});

// /datum/excited_group/proc/New  (_nofile:0)
rt.def("/datum/excited_group/proc/New", function New(f: Frame) {
	rt.modField(f, rt.gl("SSair"), "excited_groups", live(f.src), add);
	return f.dot;
});

// /datum/excited_group/proc/reset_cooldowns  (_nofile:0)
rt.def("/datum/excited_group/proc/reset_cooldowns", function reset_cooldowns(f: Frame) {
	rt.setSv(f, "breakdown_cooldown", 0);
	rt.setSv(f, "dismantle_cooldown", 0);
	return f.dot;
});

// /datum/gas_mixture/proc/return_temperature  (_nofile:0)
rt.def("/datum/gas_mixture/proc/return_temperature", function return_temperature(f: Frame) {
	return rt.sv(f, "temperature");
});

// /datum/gas_mixture/proc/after_share  empty
rt.def("/datum/gas_mixture/proc/after_share", undefined, false, { args: ["sharer"] });

// /datum/gas_mixture/proc/after_share  (_nofile:0)
rt.def("/datum/gas_mixture/proc/after_share", function after_share(f: Frame, sharer: Value, atmos_adjacent_turfs: Value) {
	f.vars = () => [atmos_adjacent_turfs];
	if (live(atmos_adjacent_turfs) === null) {
		atmos_adjacent_turfs = 4;
	}
	return live(f.dot);
});

// /datum/gas_mixture/immutable/proc/archive  (_nofile:0)
rt.def("/datum/gas_mixture/immutable/proc/archive", function archive(f: Frame) {
	return 1;
});

// /datum/gas_mixture/immutable/proc/merge  (_nofile:0)
rt.def("/datum/gas_mixture/immutable/proc/merge", function merge(f: Frame) {
	return 0;
});

// /datum/gas_mixture/immutable/proc/react  (_nofile:0)
rt.def("/datum/gas_mixture/immutable/proc/react", function react(f: Frame) {
	return 0;
});

// /datum/gas_mixture/immutable/proc/copy_from  (_nofile:0)
rt.def("/datum/gas_mixture/immutable/proc/copy_from", function copy_from(f: Frame) {
	return 0;
});

// /datum/gas_mixture/immutable/proc/copy_from_turf  (_nofile:0)
rt.def("/datum/gas_mixture/immutable/proc/copy_from_turf", function copy_from_turf(f: Frame) {
	return 0;
});

// /datum/gas_mixture/immutable/proc/parse_gas_string  (_nofile:0)
rt.def("/datum/gas_mixture/immutable/proc/parse_gas_string", function parse_gas_string(f: Frame) {
	return 0;
});

// /datum/gas_mixture/immutable/space/proc/heat_capacity  (_nofile:0)
rt.def("/datum/gas_mixture/immutable/space/proc/heat_capacity", function heat_capacity(f: Frame) {
	return 7000;
});

// /datum/gas_mixture/immutable/cloner/proc/heat_capacity  (_nofile:0)
rt.def("/datum/gas_mixture/immutable/cloner/proc/heat_capacity", function heat_capacity(f: Frame) {
	return 2079.67578125;
});

// /datum/gas_reaction/proc/init_reqs  empty
rt.def("/datum/gas_reaction/proc/init_reqs");

// /datum/gas_reaction/proc/react  (_nofile:0)
rt.def("/datum/gas_reaction/proc/react", function react(f: Frame, air: Value, location: Value) {
	return 0;
});

// /datum/tlv/proc/New  (_nofile:0)
rt.def("/datum/tlv/proc/New", function New(f: Frame, min2: Value, min1: Value, max1: Value, max2: Value) {
	rt.setFv(f, "min2", live(f.src), live(min2));
	rt.setFv(f, "min1", live(f.src), live(min1));
	rt.setFv(f, "max1", live(f.src), live(max1));
	rt.setFv(f, "max2", live(f.src), live(max2));
	return f.dot;
});

// /datum/export/proc/get_amount  (_nofile:0)
rt.def("/datum/export/proc/get_amount", function get_amount(f: Frame, O: Value, contr: Value, emag: Value) {
	f.vars = () => [contr, emag];
	if (live(contr) === null) {
		contr = 0;
	}
	if (live(emag) === null) {
		emag = 0;
	}
	return 1;
});

// /datum/export/proc/export_end  (_nofile:0)
rt.def("/datum/export/proc/export_end", function export_end(f: Frame) {
	rt.setSv(f, "total_cost", 0);
	rt.setSv(f, "total_amount", 0);
	return f.dot;
});

// /datum/asset/proc/New  (_nofile:0)
rt.def("/datum/asset/proc/New", function New(f: Frame) {
	rt.setAt(rt.gl("asset_datums"), rt.sv(f, "type"), live(f.src));
	return f.dot;
});

// /datum/asset/proc/register  (_nofile:0)
rt.def("/datum/asset/proc/register", function register(f: Frame) {
	return live(f.dot);
});

// /datum/asset/proc/send  (_nofile:0)
rt.def("/datum/asset/proc/send", function send(f: Frame, client: Value) {
	return live(f.dot);
});

// /datum/preferences/proc/update_preferences  empty
rt.def("/datum/preferences/proc/update_preferences", undefined, false, { args: ["current_version", "S"] });

// /datum/preferences/proc/ResetJobs  (_nofile:0)
rt.def("/datum/preferences/proc/ResetJobs", function ResetJobs(f: Frame) {
	rt.setSv(f, "job_civilian_high", 0);
	rt.setSv(f, "job_civilian_med", 0);
	rt.setSv(f, "job_civilian_low", 0);
	rt.setSv(f, "job_medsci_high", 0);
	rt.setSv(f, "job_medsci_med", 0);
	rt.setSv(f, "job_medsci_low", 0);
	rt.setSv(f, "job_engsec_high", 0);
	rt.setSv(f, "job_engsec_med", 0);
	rt.setSv(f, "job_engsec_low", 0);
	return f.dot;
});

// /datum/error_viewer/proc/show_to  (_nofile:0)
rt.def("/datum/error_viewer/proc/show_to", function show_to(f: Frame, user: Value, back_to: Value, linear: Value) {
	return live(f.dot);
});

// /datum/spacevine_mutation/proc/process_mutation  (_nofile:0)
rt.def("/datum/spacevine_mutation/proc/process_mutation", function process_mutation(f: Frame, holder: Value) {
	return live(f.dot);
});

// /datum/spacevine_mutation/proc/process_temperature  (_nofile:0)
rt.def("/datum/spacevine_mutation/proc/process_temperature", function process_temperature(f: Frame, holder: Value, temp: Value, volume: Value) {
	return live(f.dot);
});

// /datum/spacevine_mutation/proc/on_birth  (_nofile:0)
rt.def("/datum/spacevine_mutation/proc/on_birth", function on_birth(f: Frame, holder: Value) {
	return live(f.dot);
});

// /datum/spacevine_mutation/proc/on_grow  (_nofile:0)
rt.def("/datum/spacevine_mutation/proc/on_grow", function on_grow(f: Frame, holder: Value) {
	return live(f.dot);
});

// /datum/spacevine_mutation/proc/on_death  (_nofile:0)
rt.def("/datum/spacevine_mutation/proc/on_death", function on_death(f: Frame, holder: Value) {
	return live(f.dot);
});

// /datum/spacevine_mutation/proc/on_cross  (_nofile:0)
rt.def("/datum/spacevine_mutation/proc/on_cross", function on_cross(f: Frame, holder: Value, crosser: Value) {
	return live(f.dot);
});

// /datum/spacevine_mutation/proc/on_chem  (_nofile:0)
rt.def("/datum/spacevine_mutation/proc/on_chem", function on_chem(f: Frame, holder: Value, R: Value) {
	return live(f.dot);
});

// /datum/spacevine_mutation/proc/on_eat  (_nofile:0)
rt.def("/datum/spacevine_mutation/proc/on_eat", function on_eat(f: Frame, holder: Value, eater: Value) {
	return live(f.dot);
});

// /datum/spacevine_mutation/proc/on_spread  (_nofile:0)
rt.def("/datum/spacevine_mutation/proc/on_spread", function on_spread(f: Frame, holder: Value, target: Value) {
	return live(f.dot);
});

// /datum/spacevine_mutation/proc/on_buckle  (_nofile:0)
rt.def("/datum/spacevine_mutation/proc/on_buckle", function on_buckle(f: Frame, holder: Value, buckled: Value) {
	return live(f.dot);
});

// /datum/spacevine_mutation/proc/on_explosion  (_nofile:0)
rt.def("/datum/spacevine_mutation/proc/on_explosion", function on_explosion(f: Frame, severity: Value, target: Value, holder: Value) {
	return live(f.dot);
});

// /datum/spacevine_mutation/fire_proof/proc/process_temperature  (_nofile:0)
rt.def("/datum/spacevine_mutation/fire_proof/proc/process_temperature", function process_temperature(f: Frame, holder: Value, temp: Value, volume: Value) {
	return 1;
});

// /datum/chemical_reaction/proc/on_reaction  (_nofile:0)
rt.def("/datum/chemical_reaction/proc/on_reaction", function on_reaction(f: Frame, holder: Value, created_volume: Value) {
	return live(f.dot);
});

// /datum/holiday/proc/celebrate  (_nofile:0)
rt.def("/datum/holiday/proc/celebrate", function celebrate(f: Frame) {
	return live(f.dot);
});

// /datum/plant_gene/proc/get_name  (_nofile:0)
rt.def("/datum/plant_gene/proc/get_name", function get_name(f: Frame) {
	return rt.sv(f, "name");
});

// /datum/plant_gene/proc/apply_vars  (_nofile:0)
rt.def("/datum/plant_gene/proc/apply_vars", function apply_vars(f: Frame, S: Value) {
	return live(f.dot);
});

// /datum/plant_gene/core/proc/apply_stat  (_nofile:0)
rt.def("/datum/plant_gene/core/proc/apply_stat", function apply_stat(f: Frame, S: Value) {
	return live(f.dot);
});

// /datum/plant_gene/core/lifespan/proc/apply_stat  (_nofile:0)
rt.def("/datum/plant_gene/core/lifespan/proc/apply_stat", function apply_stat(f: Frame, S: Value) {
	rt.setFv(f, "lifespan", live(S), rt.sv(f, "value"));
	return f.dot;
});

// /datum/plant_gene/core/endurance/proc/apply_stat  (_nofile:0)
rt.def("/datum/plant_gene/core/endurance/proc/apply_stat", function apply_stat(f: Frame, S: Value) {
	rt.setFv(f, "endurance", live(S), rt.sv(f, "value"));
	return f.dot;
});

// /datum/plant_gene/core/production/proc/apply_stat  (_nofile:0)
rt.def("/datum/plant_gene/core/production/proc/apply_stat", function apply_stat(f: Frame, S: Value) {
	rt.setFv(f, "production", live(S), rt.sv(f, "value"));
	return f.dot;
});

// /datum/plant_gene/core/yield/proc/apply_stat  (_nofile:0)
rt.def("/datum/plant_gene/core/yield/proc/apply_stat", function apply_stat(f: Frame, S: Value) {
	rt.setFv(f, "yield", live(S), rt.sv(f, "value"));
	return f.dot;
});

// /datum/plant_gene/core/potency/proc/apply_stat  (_nofile:0)
rt.def("/datum/plant_gene/core/potency/proc/apply_stat", function apply_stat(f: Frame, S: Value) {
	rt.setFv(f, "potency", live(S), rt.sv(f, "value"));
	return f.dot;
});

// /datum/plant_gene/core/weed_rate/proc/apply_stat  (_nofile:0)
rt.def("/datum/plant_gene/core/weed_rate/proc/apply_stat", function apply_stat(f: Frame, S: Value) {
	rt.setFv(f, "weed_rate", live(S), rt.sv(f, "value"));
	return f.dot;
});

// /datum/plant_gene/core/weed_chance/proc/apply_stat  (_nofile:0)
rt.def("/datum/plant_gene/core/weed_chance/proc/apply_stat", function apply_stat(f: Frame, S: Value) {
	rt.setFv(f, "weed_chance", live(S), rt.sv(f, "value"));
	return f.dot;
});

// /datum/plant_gene/trait/proc/on_consume  (_nofile:0)
rt.def("/datum/plant_gene/trait/proc/on_consume", function on_consume(f: Frame, G: Value, target: Value) {
	return live(f.dot);
});

// /datum/plant_gene/trait/proc/on_cross  (_nofile:0)
rt.def("/datum/plant_gene/trait/proc/on_cross", function on_cross(f: Frame, G: Value, target: Value) {
	return live(f.dot);
});

// /datum/plant_gene/trait/proc/on_slip  (_nofile:0)
rt.def("/datum/plant_gene/trait/proc/on_slip", function on_slip(f: Frame, G: Value, target: Value) {
	return live(f.dot);
});

// /datum/plant_gene/trait/proc/on_squash  (_nofile:0)
rt.def("/datum/plant_gene/trait/proc/on_squash", function on_squash(f: Frame, G: Value, target: Value) {
	return live(f.dot);
});

// /datum/plant_gene/trait/proc/on_attackby  (_nofile:0)
rt.def("/datum/plant_gene/trait/proc/on_attackby", function on_attackby(f: Frame, G: Value, I: Value, user: Value) {
	return live(f.dot);
});

// /datum/plant_gene/trait/proc/on_throw_impact  (_nofile:0)
rt.def("/datum/plant_gene/trait/proc/on_throw_impact", function on_throw_impact(f: Frame, G: Value, target: Value) {
	return live(f.dot);
});

// /datum/seed_pile/proc/New  (_nofile:0)
rt.def("/datum/seed_pile/proc/New", function New(f: Frame, name: Value, life: Value, endur: Value, matur: Value, prod: Value, yie: Value, poten: Value, am: Value) {
	f.vars = () => [am];
	if (live(am) === null) {
		am = 1;
	}
	rt.setFv(f, "name", live(f.src), live(name));
	rt.setFv(f, "lifespan", live(f.src), live(life));
	rt.setFv(f, "endurance", live(f.src), live(endur));
	rt.setFv(f, "maturation", live(f.src), live(matur));
	rt.setFv(f, "production", live(f.src), live(prod));
	rt.setFv(f, "yield", live(f.src), live(yie));
	rt.setFv(f, "potency", live(f.src), live(poten));
	rt.setFv(f, "amount", live(f.src), live(am));
	return f.dot;
});

// /datum/job/proc/config_check  (_nofile:0)
rt.def("/datum/job/proc/config_check", function config_check(f: Frame) {
	return 1;
});

// /datum/job/proc/map_check  (_nofile:0)
rt.def("/datum/job/proc/map_check", function map_check(f: Frame) {
	return 1;
});

// /datum/language_holder/proc/grant_language  (_nofile:0)
rt.def("/datum/language_holder/proc/grant_language", function grant_language(f: Frame, dt: Value) {
	rt.setAt(rt.sv(f, "languages"), live(dt), 1);
	return f.dot;
});

// /datum/language_menu/proc/New  (_nofile:0)
rt.def("/datum/language_menu/proc/New", function New(f: Frame, language_holder: Value) {
	rt.setFv(f, "language_holder", live(f.src), live(language_holder));
	return f.dot;
});

// /datum/lighting_corner/dummy/proc/New  (_nofile:0)
rt.def("/datum/lighting_corner/dummy/proc/New", function New(f: Frame) {
	return live(f.dot);
});

// /datum/reagent/proc/reaction_obj  (_nofile:0)
rt.def("/datum/reagent/proc/reaction_obj", function reaction_obj(f: Frame, O: Value, volume: Value) {
	return live(f.dot);
});

// /datum/reagent/proc/reaction_turf  (_nofile:0)
rt.def("/datum/reagent/proc/reaction_turf", function reaction_turf(f: Frame, _T: Value, volume: Value) {
	return live(f.dot);
});

// /datum/reagent/proc/on_mob_delete  (_nofile:0)
rt.def("/datum/reagent/proc/on_mob_delete", function on_mob_delete(f: Frame, M: Value) {
	return live(f.dot);
});

// /datum/reagent/proc/on_move  (_nofile:0)
rt.def("/datum/reagent/proc/on_move", function on_move(f: Frame, M: Value) {
	return live(f.dot);
});

// /datum/reagent/proc/on_new  (_nofile:0)
rt.def("/datum/reagent/proc/on_new", function on_new(f: Frame, data: Value) {
	return live(f.dot);
});

// /datum/reagent/proc/on_merge  (_nofile:0)
rt.def("/datum/reagent/proc/on_merge", function on_merge(f: Frame, data: Value) {
	return live(f.dot);
});

// /datum/reagent/proc/on_update  (_nofile:0)
rt.def("/datum/reagent/proc/on_update", function on_update(f: Frame, A: Value) {
	return live(f.dot);
});

// /datum/reagent/proc/on_tick  (_nofile:0)
rt.def("/datum/reagent/proc/on_tick", function on_tick(f: Frame, data: Value) {
	return live(f.dot);
});

// /datum/reagent/proc/on_ex_act  (_nofile:0)
rt.def("/datum/reagent/proc/on_ex_act", function on_ex_act(f: Frame, severity: Value) {
	return live(f.dot);
});

// /datum/reagent/proc/overdose_process  (_nofile:0)
rt.def("/datum/reagent/proc/overdose_process", function overdose_process(f: Frame, M: Value) {
	return live(f.dot);
});

// /datum/reagent/blob/proc/damage_reaction  (_nofile:0)
rt.def("/datum/reagent/blob/proc/damage_reaction", function damage_reaction(f: Frame, B: Value, damage: Value, damage_type: Value, damage_flag: Value) {
	return live(damage);
});

// /datum/reagent/blob/proc/death_reaction  (_nofile:0)
rt.def("/datum/reagent/blob/proc/death_reaction", function death_reaction(f: Frame, B: Value, damage_flag: Value) {
	return live(f.dot);
});

// /datum/reagent/blob/proc/expand_reaction  (_nofile:0)
rt.def("/datum/reagent/blob/proc/expand_reaction", function expand_reaction(f: Frame, B: Value, newB: Value, _T: Value, O: Value) {
	return live(f.dot);
});

// /datum/reagent/blob/proc/tesla_reaction  (_nofile:0)
rt.def("/datum/reagent/blob/proc/tesla_reaction", function tesla_reaction(f: Frame, B: Value, power: Value) {
	return 1;
});

// /datum/reagent/blob/proc/extinguish_reaction  (_nofile:0)
rt.def("/datum/reagent/blob/proc/extinguish_reaction", function extinguish_reaction(f: Frame, B: Value) {
	return live(f.dot);
});

// /datum/reagent/blob/proc/emp_reaction  (_nofile:0)
rt.def("/datum/reagent/blob/proc/emp_reaction", function emp_reaction(f: Frame, B: Value, severity: Value) {
	return live(f.dot);
});

// /datum/reagent/blob/energized_jelly/proc/tesla_reaction  (_nofile:0)
rt.def("/datum/reagent/blob/energized_jelly/proc/tesla_reaction", function tesla_reaction(f: Frame, B: Value, power: Value) {
	return 0;
});

// /datum/species/proc/spec_death  (_nofile:0)
rt.def("/datum/species/proc/spec_death", function spec_death(f: Frame, gibbed: Value, H: Value) {
	return live(f.dot);
});

// /datum/species/proc/auto_equip  (_nofile:0)
rt.def("/datum/species/proc/auto_equip", function auto_equip(f: Frame, H: Value) {
	return live(f.dot);
});

// /datum/species/proc/before_equip_job  (_nofile:0)
rt.def("/datum/species/proc/before_equip_job", function before_equip_job(f: Frame, J: Value, H: Value) {
	return live(f.dot);
});

// /datum/species/proc/handle_speech  (_nofile:0)
rt.def("/datum/species/proc/handle_speech", function handle_speech(f: Frame, message: Value, H: Value) {
	return live(message);
});

// /datum/species/proc/check_weakness  (_nofile:0)
rt.def("/datum/species/proc/check_weakness", function check_weakness(f: Frame, weapon: Value, attacker: Value) {
	return 0;
});

// /datum/species/proc/update_health_hud  (_nofile:0)
rt.def("/datum/species/proc/update_health_hud", function update_health_hud(f: Frame, H: Value) {
	return 0;
});

// /datum/species/proc/spec_hitby  (_nofile:0)
rt.def("/datum/species/proc/spec_hitby", function spec_hitby(f: Frame, AM: Value, H: Value) {
	return live(f.dot);
});

// /datum/species/proc/bullet_act  (_nofile:0)
rt.def("/datum/species/proc/bullet_act", function bullet_act(f: Frame, _P: Value, H: Value) {
	return 0;
});

// /datum/species/proc/ExtinguishMob  (_nofile:0)
rt.def("/datum/species/proc/ExtinguishMob", function ExtinguishMob(f: Frame, H: Value) {
	return live(f.dot);
});

// /datum/species/proc/space_move  (_nofile:0)
rt.def("/datum/species/proc/space_move", function space_move(f: Frame, H: Value) {
	return 0;
});

// /datum/species/proc/negates_gravity  (_nofile:0)
rt.def("/datum/species/proc/negates_gravity", function negates_gravity(f: Frame, H: Value) {
	return 0;
});

// /datum/species/human/proc/qualifies_for_rank  (_nofile:0)
rt.def("/datum/species/human/proc/qualifies_for_rank", function qualifies_for_rank(f: Frame, rank: Value, features: Value) {
	return 1;
});

// /datum/computer_file/program/proc/process_tick  (_nofile:0)
rt.def("/datum/computer_file/program/proc/process_tick", function process_tick(f: Frame) {
	return 1;
});

// /datum/computer_file/program/proc/event_idremoved  (_nofile:0)
rt.def("/datum/computer_file/program/proc/event_idremoved", function event_idremoved(f: Frame, background: Value, slot: Value) {
	return live(f.dot);
});

// /datum/computer_file/program/card_mod/proc/SetConfigCooldown  (_nofile:0)
rt.def("/datum/computer_file/program/card_mod/proc/SetConfigCooldown", function SetConfigCooldown(f: Frame) {
	rt.setSv(f, "change_position_cooldown", rt.fv(f, "id_console_jobslot_delay", rt.gl("config")));
	return f.dot;
});

// /datum/ntnet/proc/resetIDS  (_nofile:0)
rt.def("/datum/ntnet/proc/resetIDS", function resetIDS(f: Frame) {
	rt.setSv(f, "intrusion_detection_alarm", 0);
	return f.dot;
});

// /datum/powernet/proc/New  (_nofile:0)
rt.def("/datum/powernet/proc/New", function New(f: Frame) {
	rt.modField(f, rt.gl("SSmachines"), "powernets", live(f.src), add);
	return f.dot;
});

// /datum/station_goal/proc/on_report  (_nofile:0)
rt.def("/datum/station_goal/proc/on_report", function on_report(f: Frame) {
	return live(f.dot);
});

// /datum/station_goal/proc/get_report  (_nofile:0)
rt.def("/datum/station_goal/proc/get_report", function get_report(f: Frame) {
	return rt.sv(f, "report_message");
});

// /datum/station_goal/proc/check_completion  (_nofile:0)
rt.def("/datum/station_goal/proc/check_completion", function check_completion(f: Frame) {
	return rt.sv(f, "completed");
});

// /datum/stockEvent/proc/transition  (_nofile:0)
rt.def("/datum/stockEvent/proc/transition", function transition(f: Frame) {
	return live(f.dot);
});

// /datum/industry/proc/generateProductName  (_nofile:0)
rt.def("/datum/industry/proc/generateProductName", function generateProductName(f: Frame, company_name: Value) {
	return live(f.dot);
});

// /datum/ui_state/proc/can_use_topic  (_nofile:0)
rt.def("/datum/ui_state/proc/can_use_topic", function can_use_topic(f: Frame, src_object: Value, user: Value) {
	return -1;
});

// /datum/ui_state/always_state/proc/can_use_topic  (_nofile:0)
rt.def("/datum/ui_state/always_state/proc/can_use_topic", function can_use_topic(f: Frame, src_object: Value, user: Value) {
	return 2;
});

// /datum/tgui/proc/set_window_options  (_nofile:0)
rt.def("/datum/tgui/proc/set_window_options", function set_window_options(f: Frame, window_options: Value) {
	rt.setFv(f, "window_options", live(f.src), live(window_options));
	return f.dot;
});

// /proc/pass  (_nofile:0)
rt.def("/proc/pass", function pass(f: Frame) {
	return live(f.dot);
});

// /proc/SkinCmdRegister  (_nofile:0)
rt.def("/proc/SkinCmdRegister", function SkinCmdRegister(f: Frame, user: Value, name: Value, O: Value) {
	rt.setAt(rt.fv(f, "skincmds", live(user)), live(name), live(O));
	return f.dot;
});

// /proc/register_asset  (_nofile:0)
rt.def("/proc/register_asset", function register_asset(f: Frame, asset_name: Value, asset: Value) {
	rt.setAt(rt.fv(f, "cache", rt.gl("SSassets")), live(asset_name), live(asset));
	return f.dot;
});

// /turf/closed/wall/proc/attack_tk  (_nofile:0)
rt.def("/turf/closed/wall/proc/attack_tk", function attack_tk(f: Frame) {
	return live(f.dot);
});

// /turf/closed/wall/proc/storage_contents_dump_act  (_nofile:0)
rt.def("/turf/closed/wall/proc/storage_contents_dump_act", function storage_contents_dump_act(f: Frame, src_object: Value, user: Value) {
	return 0;
});

// /turf/closed/wall/mineral/diamond/proc/thermitemelt  (_nofile:0)
rt.def("/turf/closed/wall/mineral/diamond/proc/thermitemelt", function thermitemelt(f: Frame, user: Value) {
	return live(f.dot);
});

// /turf/closed/wall/r_wall/proc/fabrication_vals  (_nofile:0)
rt.def("/turf/closed/wall/r_wall/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	return 0;
});

// /turf/closed/indestructible/proc/swarmer_act  (_nofile:0)
rt.def("/turf/closed/indestructible/proc/swarmer_act", function swarmer_act(f: Frame) {
	return 0;
});

// /turf/closed/indestructible/proc/TerraformTurf  (_nofile:0)
rt.def("/turf/closed/indestructible/proc/TerraformTurf", function TerraformTurf(f: Frame, path: Value, defer_change: Value, ignore_air: Value) {
	f.vars = () => [defer_change, ignore_air];
	if (live(defer_change) === null) {
		defer_change = 0;
	}
	if (live(ignore_air) === null) {
		ignore_air = 0;
	}
	return live(f.dot);
});

// /turf/closed/indestructible/proc/acid_act  (_nofile:0)
rt.def("/turf/closed/indestructible/proc/acid_act", function acid_act(f: Frame, acidpwr: Value, acid_volume: Value, acid_id: Value) {
	return 0;
});

// /turf/closed/mineral/proc/check_tile_is_border  (_nofile:0)
rt.def("/turf/closed/mineral/proc/check_tile_is_border", function check_tile_is_border(f: Frame) {
	return 1;
});

// /turf/closed/proc/check_tile_is_border  (_nofile:0)
rt.def("/turf/closed/proc/check_tile_is_border", function check_tile_is_border(f: Frame) {
	return 3;
});

// /turf/closed/proc/get_smooth_underlay_icon  (_nofile:0)
rt.def("/turf/closed/proc/get_smooth_underlay_icon", function get_smooth_underlay_icon(f: Frame, underlay_appearance: Value, asking_turf: Value, adjacency_dir: Value) {
	return 0;
});

// /turf/open/proc/GetTemperature  (_nofile:0)
rt.def("/turf/open/proc/GetTemperature", function GetTemperature(f: Frame) {
	f.dot = rt.fv(f, "temperature", rt.sv(f, "air"));
	return f.dot;
});

// /turf/open/proc/return_air  (_nofile:0)
rt.def("/turf/open/proc/return_air", function return_air(f: Frame) {
	return rt.sv(f, "air");
});

// /turf/open/space/proc/TakeTemperature  empty
rt.def("/turf/open/space/proc/TakeTemperature", undefined, false, { args: ["temp"] });

// /turf/open/space/proc/check_tile_is_border  (_nofile:0)
rt.def("/turf/open/space/proc/check_tile_is_border", function check_tile_is_border(f: Frame) {
	return 4;
});

// /turf/open/space/proc/Initalize_Atmos  (_nofile:0)
rt.def("/turf/open/space/proc/Initalize_Atmos", function Initalize_Atmos(f: Frame, times_fired: Value) {
	return live(f.dot);
});

// /turf/open/space/proc/RemoveLattice  (_nofile:0)
rt.def("/turf/open/space/proc/RemoveLattice", function RemoveLattice(f: Frame) {
	return live(f.dot);
});

// /turf/open/space/proc/Assimilate_Air  (_nofile:0)
rt.def("/turf/open/space/proc/Assimilate_Air", function Assimilate_Air(f: Frame) {
	return live(f.dot);
});

// /turf/open/space/proc/CanBuildHere  (_nofile:0)
rt.def("/turf/open/space/proc/CanBuildHere", function CanBuildHere(f: Frame) {
	return 1;
});

// /turf/open/space/proc/handle_slip  (_nofile:0)
rt.def("/turf/open/space/proc/handle_slip", function handle_slip(f: Frame) {
	return live(f.dot);
});

// /turf/open/space/proc/singularity_act  (_nofile:0)
rt.def("/turf/open/space/proc/singularity_act", function singularity_act(f: Frame) {
	return live(f.dot);
});

// /turf/open/space/proc/acid_act  (_nofile:0)
rt.def("/turf/open/space/proc/acid_act", function acid_act(f: Frame, acidpwr: Value, acid_volume: Value) {
	return 0;
});

// /turf/open/space/basic/proc/New  (_nofile:0)
rt.def("/turf/open/space/basic/proc/New", function New(f: Frame) {
	return live(f.dot);
});

// /turf/open/floor/proc/swarmer_act  (_nofile:0)
rt.def("/turf/open/floor/proc/swarmer_act", function swarmer_act(f: Frame) {
	return 0;
});

// /turf/open/floor/proc/blob_act  (_nofile:0)
rt.def("/turf/open/floor/proc/blob_act", function blob_act(f: Frame, B: Value) {
	return live(f.dot);
});

// /turf/open/floor/proc/gets_drilled  (_nofile:0)
rt.def("/turf/open/floor/proc/gets_drilled", function gets_drilled(f: Frame) {
	return live(f.dot);
});

// /turf/open/floor/plating/asteroid/proc/fabrication_vals  (_nofile:0)
rt.def("/turf/open/floor/plating/asteroid/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	return 0;
});

// /turf/open/floor/plating/asteroid/proc/burn_tile  (_nofile:0)
rt.def("/turf/open/floor/plating/asteroid/proc/burn_tile", function burn_tile(f: Frame) {
	return live(f.dot);
});

// /turf/open/floor/plating/asteroid/proc/singularity_act  (_nofile:0)
rt.def("/turf/open/floor/plating/asteroid/proc/singularity_act", function singularity_act(f: Frame) {
	return live(f.dot);
});

// /turf/open/floor/plating/asteroid/proc/singularity_pull  (_nofile:0)
rt.def("/turf/open/floor/plating/asteroid/proc/singularity_pull", function singularity_pull(f: Frame, S: Value, current_size: Value) {
	return live(f.dot);
});

// /turf/open/floor/plating/ashplanet/proc/fabrication_vals  (_nofile:0)
rt.def("/turf/open/floor/plating/ashplanet/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	return 0;
});

// /turf/open/floor/plating/ashplanet/proc/break_tile  (_nofile:0)
rt.def("/turf/open/floor/plating/ashplanet/proc/break_tile", function break_tile(f: Frame) {
	return live(f.dot);
});

// /turf/open/floor/plating/ashplanet/proc/burn_tile  (_nofile:0)
rt.def("/turf/open/floor/plating/ashplanet/proc/burn_tile", function burn_tile(f: Frame) {
	return live(f.dot);
});

// /turf/open/floor/plating/lava/proc/TakeTemperature  empty
rt.def("/turf/open/floor/plating/lava/proc/TakeTemperature", undefined, false, { args: ["temp"] });

// /turf/open/floor/plating/lava/proc/fabrication_vals  (_nofile:0)
rt.def("/turf/open/floor/plating/lava/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	return 0;
});

// /turf/open/floor/plating/lava/proc/ex_act  (_nofile:0)
rt.def("/turf/open/floor/plating/lava/proc/ex_act", function ex_act(f: Frame) {
	return live(f.dot);
}, false, { waitfor: false });

// /turf/open/floor/plating/lava/proc/singularity_act  (_nofile:0)
rt.def("/turf/open/floor/plating/lava/proc/singularity_act", function singularity_act(f: Frame) {
	return live(f.dot);
});

// /turf/open/floor/plating/lava/proc/singularity_pull  (_nofile:0)
rt.def("/turf/open/floor/plating/lava/proc/singularity_pull", function singularity_pull(f: Frame, S: Value, current_size: Value) {
	return live(f.dot);
});

// /turf/open/floor/plating/lava/proc/make_plating  (_nofile:0)
rt.def("/turf/open/floor/plating/lava/proc/make_plating", function make_plating(f: Frame) {
	return live(f.dot);
});

// /turf/open/floor/plating/lava/proc/GetHeatCapacity  (_nofile:0)
rt.def("/turf/open/floor/plating/lava/proc/GetHeatCapacity", function GetHeatCapacity(f: Frame) {
	f.dot = 700000;
	return f.dot;
});

// /turf/open/floor/plating/lava/proc/GetTemperature  (_nofile:0)
rt.def("/turf/open/floor/plating/lava/proc/GetTemperature", function GetTemperature(f: Frame) {
	f.dot = 5000;
	return f.dot;
});

// /turf/open/floor/plating/lava/proc/attackby  (_nofile:0)
rt.def("/turf/open/floor/plating/lava/proc/attackby", function attackby(f: Frame, C: Value, user: Value, params: Value) {
	return live(f.dot);
});

// /turf/open/floor/plating/lava/proc/break_tile  (_nofile:0)
rt.def("/turf/open/floor/plating/lava/proc/break_tile", function break_tile(f: Frame) {
	return live(f.dot);
});

// /turf/open/floor/plating/lava/proc/pry_tile  (_nofile:0)
rt.def("/turf/open/floor/plating/lava/proc/pry_tile", function pry_tile(f: Frame) {
	return live(f.dot);
});

// /turf/open/floor/plating/lava/proc/try_replace_tile  (_nofile:0)
rt.def("/turf/open/floor/plating/lava/proc/try_replace_tile", function try_replace_tile(f: Frame) {
	return live(f.dot);
});

// /turf/open/floor/plating/lava/proc/burn_tile  (_nofile:0)
rt.def("/turf/open/floor/plating/lava/proc/burn_tile", function burn_tile(f: Frame) {
	return live(f.dot);
});

// /turf/open/floor/plating/abductor2/proc/break_tile  (_nofile:0)
rt.def("/turf/open/floor/plating/abductor2/proc/break_tile", function break_tile(f: Frame) {
	return live(f.dot);
});

// /turf/open/floor/plating/abductor2/proc/burn_tile  (_nofile:0)
rt.def("/turf/open/floor/plating/abductor2/proc/burn_tile", function burn_tile(f: Frame) {
	return live(f.dot);
});

// /turf/open/floor/plating/ironsand/proc/burn_tile  (_nofile:0)
rt.def("/turf/open/floor/plating/ironsand/proc/burn_tile", function burn_tile(f: Frame) {
	return live(f.dot);
});

// /turf/open/floor/plating/ice/proc/break_tile  (_nofile:0)
rt.def("/turf/open/floor/plating/ice/proc/break_tile", function break_tile(f: Frame) {
	return live(f.dot);
});

// /turf/open/floor/plating/ice/proc/burn_tile  (_nofile:0)
rt.def("/turf/open/floor/plating/ice/proc/burn_tile", function burn_tile(f: Frame) {
	return live(f.dot);
});

// /turf/open/floor/carpet/proc/get_smooth_underlay_icon  (_nofile:0)
rt.def("/turf/open/floor/carpet/proc/get_smooth_underlay_icon", function get_smooth_underlay_icon(f: Frame, underlay_appearance: Value, asking_turf: Value, adjacency_dir: Value) {
	return 0;
});

// /turf/open/floor/mineral/abductor/proc/break_tile  (_nofile:0)
rt.def("/turf/open/floor/mineral/abductor/proc/break_tile", function break_tile(f: Frame) {
	return live(f.dot);
});

// /turf/open/floor/mineral/abductor/proc/burn_tile  (_nofile:0)
rt.def("/turf/open/floor/mineral/abductor/proc/burn_tile", function burn_tile(f: Frame) {
	return live(f.dot);
});

// /turf/open/floor/noslip/proc/MakeSlippery  (_nofile:0)
rt.def("/turf/open/floor/noslip/proc/MakeSlippery", function MakeSlippery(f: Frame) {
	return live(f.dot);
});

// /turf/open/floor/vines/proc/attackby  (_nofile:0)
rt.def("/turf/open/floor/vines/proc/attackby", function attackby(f: Frame) {
	return live(f.dot);
});

// /turf/open/floor/vines/proc/burn_tile  (_nofile:0)
rt.def("/turf/open/floor/vines/proc/burn_tile", function burn_tile(f: Frame) {
	return live(f.dot);
});

// /turf/open/floor/vines/proc/break_tile  (_nofile:0)
rt.def("/turf/open/floor/vines/proc/break_tile", function break_tile(f: Frame) {
	return live(f.dot);
});

// /turf/open/floor/vines/proc/make_plating  (_nofile:0)
rt.def("/turf/open/floor/vines/proc/make_plating", function make_plating(f: Frame) {
	return live(f.dot);
});

// /turf/open/floor/vines/proc/break_tile_to_plating  (_nofile:0)
rt.def("/turf/open/floor/vines/proc/break_tile_to_plating", function break_tile_to_plating(f: Frame) {
	return live(f.dot);
});

// /turf/open/floor/plasteel/cult/proc/narsie_act  (_nofile:0)
rt.def("/turf/open/floor/plasteel/cult/proc/narsie_act", function narsie_act(f: Frame) {
	return live(f.dot);
});

// /turf/open/floor/engine/proc/break_tile  (_nofile:0)
rt.def("/turf/open/floor/engine/proc/break_tile", function break_tile(f: Frame) {
	return live(f.dot);
});

// /turf/open/floor/engine/proc/burn_tile  (_nofile:0)
rt.def("/turf/open/floor/engine/proc/burn_tile", function burn_tile(f: Frame) {
	return live(f.dot);
});

// /turf/open/floor/holofloor/proc/attackby  (_nofile:0)
rt.def("/turf/open/floor/holofloor/proc/attackby", function attackby(f: Frame, I: Value, user: Value) {
	return live(f.dot);
});

// /turf/open/indestructible/proc/TerraformTurf  (_nofile:0)
rt.def("/turf/open/indestructible/proc/TerraformTurf", function TerraformTurf(f: Frame, path: Value, defer_change: Value, ignore_air: Value) {
	f.vars = () => [defer_change, ignore_air];
	if (live(defer_change) === null) {
		defer_change = 0;
	}
	if (live(ignore_air) === null) {
		ignore_air = 0;
	}
	return live(f.dot);
});

// /turf/open/indestructible/hierophant/proc/get_smooth_underlay_icon  (_nofile:0)
rt.def("/turf/open/indestructible/hierophant/proc/get_smooth_underlay_icon", function get_smooth_underlay_icon(f: Frame, underlay_appearance: Value, asking_turf: Value, adjacency_dir: Value) {
	return 0;
});

// /turf/open/chasm/proc/CanPass  (_nofile:0)
rt.def("/turf/open/chasm/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	f.vars = () => [height];
	if (live(height) === null) {
		height = 0;
	}
	return 1;
});

// /client/proc/Destroy  (_nofile:0)
rt.def("/client/proc/Destroy", function Destroy(f: Frame) {
	return 4;
});

// /atom/movable/proc/attacked_by  (_nofile:0)
rt.def("/atom/movable/proc/attacked_by", function attacked_by(f: Frame) {
	return live(f.dot);
});

// /atom/movable/proc/Crossed  (_nofile:0)
rt.def("/atom/movable/proc/Crossed", function Crossed(f: Frame, AM: Value, oldloc: Value) {
	return live(f.dot);
});

// /atom/movable/proc/relay_container_resist  (_nofile:0)
rt.def("/atom/movable/proc/relay_container_resist", function relay_container_resist(f: Frame, user: Value, O: Value) {
	return live(f.dot);
});

// /atom/movable/proc/could_speak_in_language  (_nofile:0)
rt.def("/atom/movable/proc/could_speak_in_language", function could_speak_in_language(f: Frame, dt: Value) {
	f.dot = 1;
	return f.dot;
});

// /atom/movable/proc/get_cell  (_nofile:0)
rt.def("/atom/movable/proc/get_cell", function get_cell(f: Frame) {
	return live(f.dot);
});

// /atom/movable/proc/Hear  (_nofile:0)
rt.def("/atom/movable/proc/Hear", function Hear(f: Frame, message: Value, speaker: Value, message_language: Value, raw_message: Value, radio_freq: Value, spans: Value, message_mode: Value) {
	return live(f.dot);
});

// /atom/movable/proc/can_speak  (_nofile:0)
rt.def("/atom/movable/proc/can_speak", function can_speak(f: Frame) {
	return 1;
});

// /atom/movable/proc/IsVocal  (_nofile:0)
rt.def("/atom/movable/proc/IsVocal", function IsVocal(f: Frame) {
	return 1;
});

// /atom/movable/proc/power_drain  (_nofile:0)
rt.def("/atom/movable/proc/power_drain", function power_drain(f: Frame, clockcult_user: Value) {
	return 0;
});

// /atom/movable/proc/machine_wash  (_nofile:0)
rt.def("/atom/movable/proc/machine_wash", function machine_wash(f: Frame, WM: Value) {
	return live(f.dot);
});

// /atom/movable/proc/post_buckle_mob  (_nofile:0)
rt.def("/atom/movable/proc/post_buckle_mob", function post_buckle_mob(f: Frame, M: Value) {
	return live(f.dot);
});

// /atom/movable/proc/on_unset_machine  (_nofile:0)
rt.def("/atom/movable/proc/on_unset_machine", function on_unset_machine(f: Frame, user: Value) {
	return live(f.dot);
});

// /atom/movable/proc/BlockSuperconductivity  (_nofile:0)
rt.def("/atom/movable/proc/BlockSuperconductivity", function BlockSuperconductivity(f: Frame) {
	return 0;
});

// /atom/movable/proc/pipe_eject  (_nofile:0)
rt.def("/atom/movable/proc/pipe_eject", function pipe_eject(f: Frame, direction: Value) {
	return live(f.dot);
});

// /atom/movable/proc/disposalEnterTry  (_nofile:0)
rt.def("/atom/movable/proc/disposalEnterTry", function disposalEnterTry(f: Frame) {
	return 1;
});

// /atom/movable/proc/beforeShuttleMove  (_nofile:0)
rt.def("/atom/movable/proc/beforeShuttleMove", function beforeShuttleMove(f: Frame, T1: Value, rotation: Value) {
	return live(f.dot);
});

// /atom/movable/proc/afterShuttleMove  (_nofile:0)
rt.def("/atom/movable/proc/afterShuttleMove", function afterShuttleMove(f: Frame) {
	return live(f.dot);
});

// /atom/movable/virtualspeaker/proc/GetJob  (_nofile:0)
rt.def("/atom/movable/virtualspeaker/proc/GetJob", function GetJob(f: Frame) {
	return rt.sv(f, "job");
});

// /atom/movable/virtualspeaker/proc/GetSource  (_nofile:0)
rt.def("/atom/movable/virtualspeaker/proc/GetSource", function GetSource(f: Frame) {
	return rt.sv(f, "source");
});

// /atom/movable/virtualspeaker/proc/GetRadio  (_nofile:0)
rt.def("/atom/movable/virtualspeaker/proc/GetRadio", function GetRadio(f: Frame) {
	return rt.sv(f, "radio");
});

// /atom/movable/lighting_object/proc/ex_act  (_nofile:0)
rt.def("/atom/movable/lighting_object/proc/ex_act", function ex_act(f: Frame, severity: Value) {
	return 0;
}, false, { waitfor: false });

// /atom/movable/lighting_object/proc/singularity_act  (_nofile:0)
rt.def("/atom/movable/lighting_object/proc/singularity_act", function singularity_act(f: Frame) {
	return live(f.dot);
});

// /atom/movable/lighting_object/proc/singularity_pull  (_nofile:0)
rt.def("/atom/movable/lighting_object/proc/singularity_pull", function singularity_pull(f: Frame) {
	return live(f.dot);
});

// /atom/movable/lighting_object/proc/blob_act  (_nofile:0)
rt.def("/atom/movable/lighting_object/proc/blob_act", function blob_act(f: Frame) {
	return live(f.dot);
});

// /atom/movable/lighting_object/proc/onShuttleMove  (_nofile:0)
rt.def("/atom/movable/lighting_object/proc/onShuttleMove", function onShuttleMove(f: Frame, T1: Value, rotation: Value) {
	return 0;
});

// /atom/movable/light/proc/onShuttleMove  (_nofile:0)
rt.def("/atom/movable/light/proc/onShuttleMove", function onShuttleMove(f: Frame) {
	return 0;
});

// /atom/proc/Adjacent  (_nofile:0)
rt.def("/atom/proc/Adjacent", function Adjacent(f: Frame, neighbor: Value) {
	return 0;
});

// /atom/proc/attack_ai  (_nofile:0)
rt.def("/atom/proc/attack_ai", function attack_ai(f: Frame, user: Value) {
	return live(f.dot);
});

// /atom/proc/AICtrlClick  (_nofile:0)
rt.def("/atom/proc/AICtrlClick", function AICtrlClick(f: Frame) {
	return live(f.dot);
});

// /atom/proc/AIShiftClick  (_nofile:0)
rt.def("/atom/proc/AIShiftClick", function AIShiftClick(f: Frame) {
	return live(f.dot);
});

// /atom/proc/AICtrlShiftClick  (_nofile:0)
rt.def("/atom/proc/AICtrlShiftClick", function AICtrlShiftClick(f: Frame) {
	return live(f.dot);
});

// /atom/proc/IsAutoclickable  (_nofile:0)
rt.def("/atom/proc/IsAutoclickable", function IsAutoclickable(f: Frame) {
	f.dot = 1;
	return f.dot;
});

// /atom/proc/CanReachStorage  (_nofile:0)
rt.def("/atom/proc/CanReachStorage", function CanReachStorage(f: Frame, target: Value, user: Value, depth: Value) {
	return 0;
});

// /atom/proc/AllowClick  (_nofile:0)
rt.def("/atom/proc/AllowClick", function AllowClick(f: Frame) {
	return 0;
});

// /atom/proc/CtrlShiftClick  (_nofile:0)
rt.def("/atom/proc/CtrlShiftClick", function CtrlShiftClick(f: Frame, user: Value) {
	return live(f.dot);
});

// /atom/proc/MouseDrop_T  (_nofile:0)
rt.def("/atom/proc/MouseDrop_T", function MouseDrop_T(f: Frame, dropping: Value, user: Value) {
	return live(f.dot);
});

// /atom/proc/attack_god  (_nofile:0)
rt.def("/atom/proc/attack_god", function attack_god(f: Frame, user: Value) {
	return live(f.dot);
});

// /atom/proc/attackby  (_nofile:0)
rt.def("/atom/proc/attackby", function attackby(f: Frame, W: Value, user: Value, params: Value) {
	return live(f.dot);
});

// /atom/proc/attack_hand  (_nofile:0)
rt.def("/atom/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	return live(f.dot);
});

// /atom/proc/interact  (_nofile:0)
rt.def("/atom/proc/interact", function interact(f: Frame, user: Value) {
	return live(f.dot);
}, false, { argTypes: [{ type: 8, path: "/mob" }] });

// /atom/proc/attack_animal  (_nofile:0)
rt.def("/atom/proc/attack_animal", function attack_animal(f: Frame, user: Value) {
	return live(f.dot);
});

// /atom/proc/attack_paw  (_nofile:0)
rt.def("/atom/proc/attack_paw", function attack_paw(f: Frame, user: Value) {
	return live(f.dot);
});

// /atom/proc/attack_larva  (_nofile:0)
rt.def("/atom/proc/attack_larva", function attack_larva(f: Frame, user: Value) {
	return live(f.dot);
});

// /atom/proc/attack_slime  (_nofile:0)
rt.def("/atom/proc/attack_slime", function attack_slime(f: Frame, user: Value) {
	return live(f.dot);
});

// /atom/proc/attack_self_tk  (_nofile:0)
rt.def("/atom/proc/attack_self_tk", function attack_self_tk(f: Frame, user: Value) {
	return live(f.dot);
});

// /atom/proc/LateInitialize  (_nofile:0)
rt.def("/atom/proc/LateInitialize", function LateInitialize(f: Frame) {
	return live(f.dot);
});

// /atom/proc/handle_ricochet  (_nofile:0)
rt.def("/atom/proc/handle_ricochet", function handle_ricochet(f: Frame, _P: Value) {
	return live(f.dot);
});

// /atom/proc/check_eye  (_nofile:0)
rt.def("/atom/proc/check_eye", function check_eye(f: Frame, user: Value) {
	return live(f.dot);
});

// /atom/proc/Bumped  (_nofile:0)
rt.def("/atom/proc/Bumped", function Bumped(f: Frame, AM: Value) {
	return live(f.dot);
});

// /atom/proc/allow_drop  (_nofile:0)
rt.def("/atom/proc/allow_drop", function allow_drop(f: Frame) {
	return 1;
});

// /atom/proc/CheckExit  (_nofile:0)
rt.def("/atom/proc/CheckExit", function CheckExit(f: Frame) {
	return 1;
});

// /atom/proc/HasProximity  (_nofile:0)
rt.def("/atom/proc/HasProximity", function HasProximity(f: Frame, AM: Value) {
	return live(f.dot);
});

// /atom/proc/relaymove  (_nofile:0)
rt.def("/atom/proc/relaymove", function relaymove(f: Frame) {
	return live(f.dot);
});

// /atom/proc/contents_explosion  (_nofile:0)
rt.def("/atom/proc/contents_explosion", function contents_explosion(f: Frame, severity: Value, target: Value) {
	return live(f.dot);
});

// /atom/proc/blob_act  (_nofile:0)
rt.def("/atom/proc/blob_act", function blob_act(f: Frame, B: Value) {
	return live(f.dot);
});

// /atom/proc/fire_act  (_nofile:0)
rt.def("/atom/proc/fire_act", function fire_act(f: Frame, exposed_temperature: Value, exposed_volume: Value) {
	return live(f.dot);
});

// /atom/proc/add_blood  (_nofile:0)
rt.def("/atom/proc/add_blood", function add_blood(f: Frame, blood_dna: Value) {
	return 0;
});

// /atom/proc/wash_cream  (_nofile:0)
rt.def("/atom/proc/wash_cream", function wash_cream(f: Frame) {
	return 1;
});

// /atom/proc/handle_fall  (_nofile:0)
rt.def("/atom/proc/handle_fall", function handle_fall(f: Frame) {
	return live(f.dot);
});

// /atom/proc/handle_slip  (_nofile:0)
rt.def("/atom/proc/handle_slip", function handle_slip(f: Frame) {
	return live(f.dot);
});

// /atom/proc/singularity_act  (_nofile:0)
rt.def("/atom/proc/singularity_act", function singularity_act(f: Frame) {
	return live(f.dot);
});

// /atom/proc/singularity_pull  (_nofile:0)
rt.def("/atom/proc/singularity_pull", function singularity_pull(f: Frame) {
	return live(f.dot);
});

// /atom/proc/acid_act  (_nofile:0)
rt.def("/atom/proc/acid_act", function acid_act(f: Frame, acidpwr: Value, acid_volume: Value) {
	return live(f.dot);
});

// /atom/proc/emag_act  (_nofile:0)
rt.def("/atom/proc/emag_act", function emag_act(f: Frame) {
	return live(f.dot);
});

// /atom/proc/narsie_act  (_nofile:0)
rt.def("/atom/proc/narsie_act", function narsie_act(f: Frame) {
	return live(f.dot);
});

// /atom/proc/ratvar_act  (_nofile:0)
rt.def("/atom/proc/ratvar_act", function ratvar_act(f: Frame) {
	return live(f.dot);
});

// /atom/proc/rcd_vals  (_nofile:0)
rt.def("/atom/proc/rcd_vals", function rcd_vals(f: Frame, user: Value, the_rcd: Value) {
	return 0;
});

// /atom/proc/rcd_act  (_nofile:0)
rt.def("/atom/proc/rcd_act", function rcd_act(f: Frame, user: Value, the_rcd: Value, passed_mode: Value) {
	return 0;
});

// /atom/proc/storage_contents_dump_act  (_nofile:0)
rt.def("/atom/proc/storage_contents_dump_act", function storage_contents_dump_act(f: Frame, src_object: Value, user: Value) {
	return 0;
});

// /atom/proc/get_remote_view_fullscreens  (_nofile:0)
rt.def("/atom/proc/get_remote_view_fullscreens", function get_remote_view_fullscreens(f: Frame, user: Value) {
	return live(f.dot);
});

// /atom/proc/update_remote_sight  (_nofile:0)
rt.def("/atom/proc/update_remote_sight", function update_remote_sight(f: Frame, user: Value) {
	return live(f.dot);
});

// /atom/proc/mech_melee_attack  (_nofile:0)
rt.def("/atom/proc/mech_melee_attack", function mech_melee_attack(f: Frame, M: Value) {
	return live(f.dot);
});

// /atom/proc/fabrication_vals  (_nofile:0)
rt.def("/atom/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	return 0;
});

// /atom/proc/rad_act  (_nofile:0)
rt.def("/atom/proc/rad_act", function rad_act(f: Frame, severity: Value) {
	return 1;
});

// /atom/proc/update_pipe_vision  (_nofile:0)
rt.def("/atom/proc/update_pipe_vision", function update_pipe_vision(f: Frame, new_loc: Value) {
	f.vars = () => [new_loc];
	if (live(new_loc) === null) {
		new_loc = null;
	}
	return live(f.dot);
});

// /mob/proc/DblClickOn  (_nofile:0)
rt.def("/mob/proc/DblClickOn", function DblClickOn(f: Frame, A: Value, params: Value) {
	return live(f.dot);
});

// /mob/proc/RestrainedClickOn  (_nofile:0)
rt.def("/mob/proc/RestrainedClickOn", function RestrainedClickOn(f: Frame, A: Value) {
	return live(f.dot);
});

// /mob/proc/MiddleClickOn  (_nofile:0)
rt.def("/mob/proc/MiddleClickOn", function MiddleClickOn(f: Frame, A: Value) {
	return live(f.dot);
});

// /mob/proc/LaserEyes  (_nofile:0)
rt.def("/mob/proc/LaserEyes", function LaserEyes(f: Frame, A: Value) {
	return live(f.dot);
});

// /mob/proc/MouseWheelOn  (_nofile:0)
rt.def("/mob/proc/MouseWheelOn", function MouseWheelOn(f: Frame, A: Value, delta_x: Value, delta_y: Value, params: Value) {
	return live(f.dot);
});

// /mob/proc/attack_tk  (_nofile:0)
rt.def("/mob/proc/attack_tk", function attack_tk(f: Frame, user: Value) {
	return live(f.dot);
});

// /mob/proc/set_species  (_nofile:0)
rt.def("/mob/proc/set_species", function set_species(f: Frame, mrace: Value, icon_update: Value) {
	f.vars = () => [icon_update];
	if (live(icon_update) === null) {
		icon_update = 1;
	}
	return live(f.dot);
});

// /mob/proc/has_dna  (_nofile:0)
rt.def("/mob/proc/has_dna", function has_dna(f: Frame) {
	return live(f.dot);
});

// /mob/proc/domutcheck  (_nofile:0)
rt.def("/mob/proc/domutcheck", function domutcheck(f: Frame) {
	return live(f.dot);
});

// /mob/proc/add_click_catcher  (_nofile:0)
rt.def("/mob/proc/add_click_catcher", function add_click_catcher(f: Frame) {
	rt.modField(f, rt.sv(f, "client"), "screen", rt.gl("void"), add);
	return f.dot;
});

// /mob/proc/get_jetpack  (_nofile:0)
rt.def("/mob/proc/get_jetpack", function get_jetpack(f: Frame) {
	return live(f.dot);
});

// /mob/proc/get_flightpack  (_nofile:0)
rt.def("/mob/proc/get_flightpack", function get_flightpack(f: Frame) {
	return live(f.dot);
});

// /mob/proc/bee_friendly  (_nofile:0)
rt.def("/mob/proc/bee_friendly", function bee_friendly(f: Frame) {
	return 0;
});

// /mob/proc/gib  (_nofile:0)
rt.def("/mob/proc/gib", function gib(f: Frame) {
	return live(f.dot);
});

// /mob/proc/dust  (_nofile:0)
rt.def("/mob/proc/dust", function dust(f: Frame) {
	return live(f.dot);
});

// /mob/proc/death  (_nofile:0)
rt.def("/mob/proc/death", function death(f: Frame, gibbed: Value) {
	return live(f.dot);
});

// /mob/proc/has_hand_for_held_index  (_nofile:0)
rt.def("/mob/proc/has_hand_for_held_index", function has_hand_for_held_index(f: Frame, i: Value) {
	return 1;
});

// /mob/proc/can_equip  (_nofile:0)
rt.def("/mob/proc/can_equip", function can_equip(f: Frame, I: Value, slot: Value, disable_warning: Value) {
	f.vars = () => [disable_warning];
	if (live(disable_warning) === null) {
		disable_warning = 0;
	}
	return 0;
});

// /mob/proc/getBackSlot  (_nofile:0)
rt.def("/mob/proc/getBackSlot", function getBackSlot(f: Frame) {
	return 1;
});

// /mob/proc/getBeltSlot  (_nofile:0)
rt.def("/mob/proc/getBeltSlot", function getBeltSlot(f: Frame) {
	return 5;
});

// /mob/proc/movement_delay  (_nofile:0)
rt.def("/mob/proc/movement_delay", function movement_delay(f: Frame) {
	return 0;
});

// /mob/proc/Life  (_nofile:0)
rt.def("/mob/proc/Life", function Life(f: Frame) {
	return live(f.dot);
}, false, { waitfor: false });

// /mob/proc/restrained  (_nofile:0)
rt.def("/mob/proc/restrained", function restrained(f: Frame, ignore_grab: Value) {
	return live(f.dot);
});

// /mob/proc/incapacitated  (_nofile:0)
rt.def("/mob/proc/incapacitated", function incapacitated(f: Frame, ignore_restraints: Value, ignore_grab: Value) {
	return live(f.dot);
});

// /mob/proc/equip_to_slot  (_nofile:0)
rt.def("/mob/proc/equip_to_slot", function equip_to_slot(f: Frame, W: Value, slot: Value) {
	return live(f.dot);
});

// /mob/proc/show_inv  (_nofile:0)
rt.def("/mob/proc/show_inv", function show_inv(f: Frame, user: Value) {
	return live(f.dot);
});

// /mob/verb/DisClick  (_nofile:0)
rt.def("/mob/verb/DisClick", function DisClick(f: Frame, argu: Value, sec: Value, number1: Value, number2: Value) {
	f.vars = () => [argu, sec, number1, number2];
	if (live(argu) === null) {
		argu = null;
	}
	if (live(sec) === null) {
		sec = "";
	}
	if (live(number1) === null) {
		number1 = 0;
	}
	if (live(number2) === null) {
		number2 = 0;
	}
	return live(f.dot);
}, false, { hidden: true, verb: { name: ".click", category: "" }, argTypes: [{  }, { type: 2 }, { type: 32 }, { type: 32 }] });

// /mob/verb/DisDblClick  (_nofile:0)
rt.def("/mob/verb/DisDblClick", function DisDblClick(f: Frame, argu: Value, sec: Value, number1: Value, number2: Value) {
	f.vars = () => [argu, sec, number1, number2];
	if (live(argu) === null) {
		argu = null;
	}
	if (live(sec) === null) {
		sec = "";
	}
	if (live(number1) === null) {
		number1 = 0;
	}
	if (live(number2) === null) {
		number2 = 0;
	}
	return live(f.dot);
}, false, { hidden: true, verb: { name: ".dblclick", category: "" }, argTypes: [{  }, { type: 2 }, { type: 32 }, { type: 32 }] });

// /mob/proc/stripPanelUnequip  (_nofile:0)
rt.def("/mob/proc/stripPanelUnequip", function stripPanelUnequip(f: Frame, what: Value, who: Value) {
	return live(f.dot);
});

// /mob/proc/stripPanelEquip  (_nofile:0)
rt.def("/mob/proc/stripPanelEquip", function stripPanelEquip(f: Frame, what: Value, who: Value) {
	return live(f.dot);
});

// /mob/proc/is_muzzled  (_nofile:0)
rt.def("/mob/proc/is_muzzled", function is_muzzled(f: Frame) {
	return 0;
});

// /mob/proc/IsAdvancedToolUser  (_nofile:0)
rt.def("/mob/proc/IsAdvancedToolUser", function IsAdvancedToolUser(f: Frame) {
	return 0;
});

// /mob/proc/swap_hand  (_nofile:0)
rt.def("/mob/proc/swap_hand", function swap_hand(f: Frame) {
	return live(f.dot);
});

// /mob/proc/activate_hand  (_nofile:0)
rt.def("/mob/proc/activate_hand", function activate_hand(f: Frame, selhand: Value) {
	return live(f.dot);
});

// /mob/proc/assess_threat  (_nofile:0)
rt.def("/mob/proc/assess_threat", function assess_threat(f: Frame, judgement_criteria: Value, lasercolor: Value, weaponcheck: Value) {
	f.vars = () => [lasercolor, weaponcheck];
	if (live(lasercolor) === null) {
		lasercolor = "";
	}
	if (live(weaponcheck) === null) {
		weaponcheck = null;
	}
	return 0;
});

// /mob/proc/can_buckle  (_nofile:0)
rt.def("/mob/proc/can_buckle", function can_buckle(f: Frame) {
	return 1;
});

// /mob/proc/can_unbuckle  (_nofile:0)
rt.def("/mob/proc/can_unbuckle", function can_unbuckle(f: Frame) {
	return 1;
});

// /mob/proc/canUseTopic  (_nofile:0)
rt.def("/mob/proc/canUseTopic", function canUseTopic(f: Frame) {
	return live(f.dot);
});

// /mob/proc/replace_records_name  (_nofile:0)
rt.def("/mob/proc/replace_records_name", function replace_records_name(f: Frame, oldname: Value, newname: Value) {
	return live(f.dot);
});

// /mob/proc/update_stat  (_nofile:0)
rt.def("/mob/proc/update_stat", function update_stat(f: Frame) {
	return live(f.dot);
});

// /mob/proc/update_health_hud  (_nofile:0)
rt.def("/mob/proc/update_health_hud", function update_health_hud(f: Frame) {
	return live(f.dot);
});

// /mob/proc/is_literate  (_nofile:0)
rt.def("/mob/proc/is_literate", function is_literate(f: Frame) {
	return 0;
});

// /mob/proc/can_hold_items  (_nofile:0)
rt.def("/mob/proc/can_hold_items", function can_hold_items(f: Frame) {
	return 0;
});

// /mob/proc/get_idcard  (_nofile:0)
rt.def("/mob/proc/get_idcard", function get_idcard(f: Frame) {
	return live(f.dot);
});

// /mob/proc/isloyal  (_nofile:0)
rt.def("/mob/proc/isloyal", function isloyal(f: Frame) {
	return 0;
});

// /mob/proc/reagent_check  (_nofile:0)
rt.def("/mob/proc/reagent_check", function reagent_check(f: Frame, R: Value) {
	return 1;
});

// /mob/proc/can_hear  (_nofile:0)
rt.def("/mob/proc/can_hear", function can_hear(f: Frame) {
	f.dot = 1;
	return f.dot;
});

// /mob/proc/mob_negates_gravity  (_nofile:0)
rt.def("/mob/proc/mob_negates_gravity", function mob_negates_gravity(f: Frame) {
	return 0;
});

// /mob/proc/slip  (_nofile:0)
rt.def("/mob/proc/slip", function slip(f: Frame, s_amount: Value, w_amount: Value, O: Value, lube: Value) {
	return live(f.dot);
});

// /mob/proc/update_gravity  (_nofile:0)
rt.def("/mob/proc/update_gravity", function update_gravity(f: Frame) {
	return live(f.dot);
});

// /mob/proc/emote  (_nofile:0)
rt.def("/mob/proc/emote", function emote(f: Frame, act: Value) {
	return live(f.dot);
});

// /mob/proc/hivecheck  (_nofile:0)
rt.def("/mob/proc/hivecheck", function hivecheck(f: Frame) {
	return 0;
});

// /mob/proc/lingcheck  (_nofile:0)
rt.def("/mob/proc/lingcheck", function lingcheck(f: Frame) {
	return 0;
});

// /mob/proc/IsStun  (_nofile:0)
rt.def("/mob/proc/IsStun", function IsStun(f: Frame) {
	return 0;
});

// /mob/proc/IsKnockdown  (_nofile:0)
rt.def("/mob/proc/IsKnockdown", function IsKnockdown(f: Frame) {
	return 0;
});

// /mob/proc/IsUnconscious  (_nofile:0)
rt.def("/mob/proc/IsUnconscious", function IsUnconscious(f: Frame) {
	return 0;
});

// /mob/proc/damage_eyes  (_nofile:0)
rt.def("/mob/proc/damage_eyes", function damage_eyes(f: Frame, amount: Value) {
	return live(f.dot);
});

// /mob/proc/adjust_eye_damage  (_nofile:0)
rt.def("/mob/proc/adjust_eye_damage", function adjust_eye_damage(f: Frame, amount: Value) {
	return live(f.dot);
});

// /mob/proc/set_eye_damage  (_nofile:0)
rt.def("/mob/proc/set_eye_damage", function set_eye_damage(f: Frame, amount: Value) {
	return live(f.dot);
});

// /mob/proc/adjust_drugginess  (_nofile:0)
rt.def("/mob/proc/adjust_drugginess", function adjust_drugginess(f: Frame, amount: Value) {
	return live(f.dot);
});

// /mob/proc/set_drugginess  (_nofile:0)
rt.def("/mob/proc/set_drugginess", function set_drugginess(f: Frame, amount: Value) {
	return live(f.dot);
});

// /mob/proc/cure_blind  (_nofile:0)
rt.def("/mob/proc/cure_blind", function cure_blind(f: Frame) {
	return live(f.dot);
});

// /mob/proc/become_blind  (_nofile:0)
rt.def("/mob/proc/become_blind", function become_blind(f: Frame) {
	return live(f.dot);
});

// /mob/proc/cure_nearsighted  (_nofile:0)
rt.def("/mob/proc/cure_nearsighted", function cure_nearsighted(f: Frame) {
	return live(f.dot);
});

// /mob/proc/become_nearsighted  (_nofile:0)
rt.def("/mob/proc/become_nearsighted", function become_nearsighted(f: Frame) {
	return live(f.dot);
});

// /mob/proc/cure_husk  (_nofile:0)
rt.def("/mob/proc/cure_husk", function cure_husk(f: Frame) {
	return live(f.dot);
});

// /mob/proc/become_husk  (_nofile:0)
rt.def("/mob/proc/become_husk", function become_husk(f: Frame) {
	return live(f.dot);
});

// /mob/proc/regenerate_icons  (_nofile:0)
rt.def("/mob/proc/regenerate_icons", function regenerate_icons(f: Frame) {
	return live(f.dot);
});

// /mob/proc/update_icons  (_nofile:0)
rt.def("/mob/proc/update_icons", function update_icons(f: Frame) {
	return live(f.dot);
});

// /mob/proc/update_transform  (_nofile:0)
rt.def("/mob/proc/update_transform", function update_transform(f: Frame) {
	return live(f.dot);
});

// /mob/proc/update_inv_handcuffed  (_nofile:0)
rt.def("/mob/proc/update_inv_handcuffed", function update_inv_handcuffed(f: Frame) {
	return live(f.dot);
});

// /mob/proc/update_inv_legcuffed  (_nofile:0)
rt.def("/mob/proc/update_inv_legcuffed", function update_inv_legcuffed(f: Frame) {
	return live(f.dot);
});

// /mob/proc/update_inv_back  (_nofile:0)
rt.def("/mob/proc/update_inv_back", function update_inv_back(f: Frame) {
	return live(f.dot);
});

// /mob/proc/update_inv_hands  (_nofile:0)
rt.def("/mob/proc/update_inv_hands", function update_inv_hands(f: Frame) {
	return live(f.dot);
});

// /mob/proc/update_inv_wear_mask  (_nofile:0)
rt.def("/mob/proc/update_inv_wear_mask", function update_inv_wear_mask(f: Frame) {
	return live(f.dot);
});

// /mob/proc/update_inv_neck  (_nofile:0)
rt.def("/mob/proc/update_inv_neck", function update_inv_neck(f: Frame) {
	return live(f.dot);
});

// /mob/proc/update_inv_wear_suit  (_nofile:0)
rt.def("/mob/proc/update_inv_wear_suit", function update_inv_wear_suit(f: Frame) {
	return live(f.dot);
});

// /mob/proc/update_inv_w_uniform  (_nofile:0)
rt.def("/mob/proc/update_inv_w_uniform", function update_inv_w_uniform(f: Frame) {
	return live(f.dot);
});

// /mob/proc/update_inv_belt  (_nofile:0)
rt.def("/mob/proc/update_inv_belt", function update_inv_belt(f: Frame) {
	return live(f.dot);
});

// /mob/proc/update_inv_head  (_nofile:0)
rt.def("/mob/proc/update_inv_head", function update_inv_head(f: Frame) {
	return live(f.dot);
});

// /mob/proc/update_body  (_nofile:0)
rt.def("/mob/proc/update_body", function update_body(f: Frame) {
	return live(f.dot);
});

// /mob/proc/update_hair  (_nofile:0)
rt.def("/mob/proc/update_hair", function update_hair(f: Frame) {
	return live(f.dot);
});

// /mob/proc/update_fire  (_nofile:0)
rt.def("/mob/proc/update_fire", function update_fire(f: Frame) {
	return live(f.dot);
});

// /mob/proc/update_inv_gloves  (_nofile:0)
rt.def("/mob/proc/update_inv_gloves", function update_inv_gloves(f: Frame) {
	return live(f.dot);
});

// /mob/proc/update_inv_wear_id  (_nofile:0)
rt.def("/mob/proc/update_inv_wear_id", function update_inv_wear_id(f: Frame) {
	return live(f.dot);
});

// /mob/proc/update_inv_shoes  (_nofile:0)
rt.def("/mob/proc/update_inv_shoes", function update_inv_shoes(f: Frame) {
	return live(f.dot);
});

// /mob/proc/update_inv_glasses  (_nofile:0)
rt.def("/mob/proc/update_inv_glasses", function update_inv_glasses(f: Frame) {
	return live(f.dot);
});

// /mob/proc/update_inv_s_store  (_nofile:0)
rt.def("/mob/proc/update_inv_s_store", function update_inv_s_store(f: Frame) {
	return live(f.dot);
});

// /mob/proc/update_inv_pockets  (_nofile:0)
rt.def("/mob/proc/update_inv_pockets", function update_inv_pockets(f: Frame) {
	return live(f.dot);
});

// /mob/proc/update_inv_ears  (_nofile:0)
rt.def("/mob/proc/update_inv_ears", function update_inv_ears(f: Frame) {
	return live(f.dot);
});

// /mob/proc/get_blood_id  (_nofile:0)
rt.def("/mob/proc/get_blood_id", function get_blood_id(f: Frame) {
	return live(f.dot);
});

// /mob/proc/resist_grab  (_nofile:0)
rt.def("/mob/proc/resist_grab", function resist_grab(f: Frame, moving_resist: Value) {
	return 1;
});

// /mob/proc/binarycheck  (_nofile:0)
rt.def("/mob/proc/binarycheck", function binarycheck(f: Frame) {
	return 0;
});

// /mob/proc/throw_item  (_nofile:0)
rt.def("/mob/proc/throw_item", function throw_item(f: Frame, target: Value) {
	return live(f.dot);
});

// /mob/proc/has_left_hand  (_nofile:0)
rt.def("/mob/proc/has_left_hand", function has_left_hand(f: Frame) {
	return 1;
});

// /mob/proc/has_right_hand  (_nofile:0)
rt.def("/mob/proc/has_right_hand", function has_right_hand(f: Frame) {
	return 1;
});

// /mob/proc/get_num_arms  (_nofile:0)
rt.def("/mob/proc/get_num_arms", function get_num_arms(f: Frame) {
	return 2;
});

// /mob/proc/get_arm_ignore  (_nofile:0)
rt.def("/mob/proc/get_arm_ignore", function get_arm_ignore(f: Frame) {
	return 0;
});

// /mob/proc/get_num_legs  (_nofile:0)
rt.def("/mob/proc/get_num_legs", function get_num_legs(f: Frame) {
	return 2;
});

// /mob/proc/get_leg_ignore  (_nofile:0)
rt.def("/mob/proc/get_leg_ignore", function get_leg_ignore(f: Frame) {
	return 0;
});

// /mob/proc/getorgan  (_nofile:0)
rt.def("/mob/proc/getorgan", function getorgan(f: Frame, typepath: Value) {
	return live(f.dot);
});

// /mob/proc/getorganszone  (_nofile:0)
rt.def("/mob/proc/getorganszone", function getorganszone(f: Frame, zone: Value) {
	return live(f.dot);
});

// /mob/proc/getorganslot  (_nofile:0)
rt.def("/mob/proc/getorganslot", function getorganslot(f: Frame, slot: Value) {
	return live(f.dot);
});

// /mob/proc/default_can_use_topic  (_nofile:0)
rt.def("/mob/proc/default_can_use_topic", function default_can_use_topic(f: Frame, src_object: Value) {
	return -1;
});

// /mob/proc/hands_can_use_topic  (_nofile:0)
rt.def("/mob/proc/hands_can_use_topic", function hands_can_use_topic(f: Frame, src_object: Value) {
	return -1;
});

// /mob/proc/notcontained_can_use_topic  (_nofile:0)
rt.def("/mob/proc/notcontained_can_use_topic", function notcontained_can_use_topic(f: Frame, src_object: Value) {
	return -1;
});

// /mob/proc/physical_can_use_topic  (_nofile:0)
rt.def("/mob/proc/physical_can_use_topic", function physical_can_use_topic(f: Frame, src_object: Value) {
	return -1;
});

// /mob/living/proc/RestrainedClickOn  (_nofile:0)
rt.def("/mob/living/proc/RestrainedClickOn", function RestrainedClickOn(f: Frame, A: Value) {
	return live(f.dot);
});

// /mob/living/proc/can_be_implanted  (_nofile:0)
rt.def("/mob/living/proc/can_be_implanted", function can_be_implanted(f: Frame) {
	return 1;
});

// /mob/living/proc/get_equipped_items  (_nofile:0)
rt.def("/mob/living/proc/get_equipped_items", function get_equipped_items(f: Frame) {
	return live(f.dot);
});

// /mob/living/proc/get_blood_data  (_nofile:0)
rt.def("/mob/living/proc/get_blood_data", function get_blood_data(f: Frame, blood_id: Value) {
	return live(f.dot);
});

// /mob/living/proc/getBruteLoss  (_nofile:0)
rt.def("/mob/living/proc/getBruteLoss", function getBruteLoss(f: Frame) {
	return rt.sv(f, "bruteloss");
});

// /mob/living/proc/getOxyLoss  (_nofile:0)
rt.def("/mob/living/proc/getOxyLoss", function getOxyLoss(f: Frame) {
	return rt.sv(f, "oxyloss");
});

// /mob/living/proc/getToxLoss  (_nofile:0)
rt.def("/mob/living/proc/getToxLoss", function getToxLoss(f: Frame) {
	return rt.sv(f, "toxloss");
});

// /mob/living/proc/getFireLoss  (_nofile:0)
rt.def("/mob/living/proc/getFireLoss", function getFireLoss(f: Frame) {
	return rt.sv(f, "fireloss");
});

// /mob/living/proc/getCloneLoss  (_nofile:0)
rt.def("/mob/living/proc/getCloneLoss", function getCloneLoss(f: Frame) {
	return rt.sv(f, "cloneloss");
});

// /mob/living/proc/getBrainLoss  (_nofile:0)
rt.def("/mob/living/proc/getBrainLoss", function getBrainLoss(f: Frame) {
	return rt.sv(f, "brainloss");
});

// /mob/living/proc/getStaminaLoss  (_nofile:0)
rt.def("/mob/living/proc/getStaminaLoss", function getStaminaLoss(f: Frame) {
	return rt.sv(f, "staminaloss");
});

// /mob/living/proc/adjustStaminaLoss  (_nofile:0)
rt.def("/mob/living/proc/adjustStaminaLoss", function adjustStaminaLoss(f: Frame, amount: Value, updating_stamina: Value, forced: Value) {
	f.vars = () => [updating_stamina, forced];
	if (live(updating_stamina) === null) {
		updating_stamina = 1;
	}
	if (live(forced) === null) {
		forced = 0;
	}
	return live(f.dot);
});

// /mob/living/proc/setStaminaLoss  (_nofile:0)
rt.def("/mob/living/proc/setStaminaLoss", function setStaminaLoss(f: Frame, amount: Value, updating_stamina: Value, forced: Value) {
	f.vars = () => [updating_stamina, forced];
	if (live(updating_stamina) === null) {
		updating_stamina = 1;
	}
	if (live(forced) === null) {
		forced = 0;
	}
	return live(f.dot);
});

// /mob/living/proc/gib_animation  (_nofile:0)
rt.def("/mob/living/proc/gib_animation", function gib_animation(f: Frame) {
	return live(f.dot);
});

// /mob/living/proc/spill_organs  (_nofile:0)
rt.def("/mob/living/proc/spill_organs", function spill_organs(f: Frame) {
	return live(f.dot);
});

// /mob/living/proc/spread_bodyparts  (_nofile:0)
rt.def("/mob/living/proc/spread_bodyparts", function spread_bodyparts(f: Frame) {
	return live(f.dot);
});

// /mob/living/proc/dust_animation  (_nofile:0)
rt.def("/mob/living/proc/dust_animation", function dust_animation(f: Frame) {
	return live(f.dot);
});

// /mob/living/proc/handle_breathing  (_nofile:0)
rt.def("/mob/living/proc/handle_breathing", function handle_breathing(f: Frame, times_fired: Value) {
	return live(f.dot);
});

// /mob/living/proc/handle_mutations_and_radiation  (_nofile:0)
rt.def("/mob/living/proc/handle_mutations_and_radiation", function handle_mutations_and_radiation(f: Frame) {
	rt.setSv(f, "radiation", 0);
	return live(f.dot);
});

// /mob/living/proc/handle_chemicals_in_body  (_nofile:0)
rt.def("/mob/living/proc/handle_chemicals_in_body", function handle_chemicals_in_body(f: Frame) {
	return live(f.dot);
});

// /mob/living/proc/handle_random_events  (_nofile:0)
rt.def("/mob/living/proc/handle_random_events", function handle_random_events(f: Frame) {
	return live(f.dot);
});

// /mob/living/proc/handle_environment  (_nofile:0)
rt.def("/mob/living/proc/handle_environment", function handle_environment(f: Frame, environment: Value) {
	return live(f.dot);
});

// /mob/living/proc/handle_stomach  (_nofile:0)
rt.def("/mob/living/proc/handle_stomach", function handle_stomach(f: Frame) {
	return live(f.dot);
});

// /mob/living/proc/update_damage_hud  (_nofile:0)
rt.def("/mob/living/proc/update_damage_hud", function update_damage_hud(f: Frame) {
	return live(f.dot);
});

// /mob/living/proc/OpenCraftingMenu  (_nofile:0)
rt.def("/mob/living/proc/OpenCraftingMenu", function OpenCraftingMenu(f: Frame) {
	return live(f.dot);
});

// /mob/living/proc/ObjBump  (_nofile:0)
rt.def("/mob/living/proc/ObjBump", function ObjBump(f: Frame, O: Value) {
	return live(f.dot);
});

// /mob/living/proc/calculate_affecting_pressure  (_nofile:0)
rt.def("/mob/living/proc/calculate_affecting_pressure", function calculate_affecting_pressure(f: Frame, pressure: Value) {
	return live(pressure);
});

// /mob/living/proc/getMaxHealth  (_nofile:0)
rt.def("/mob/living/proc/getMaxHealth", function getMaxHealth(f: Frame) {
	return rt.sv(f, "maxHealth");
});

// /mob/living/proc/can_inject  (_nofile:0)
rt.def("/mob/living/proc/can_inject", function can_inject(f: Frame) {
	return 1;
});

// /mob/living/proc/update_damage_overlays  (_nofile:0)
rt.def("/mob/living/proc/update_damage_overlays", function update_damage_overlays(f: Frame) {
	return live(f.dot);
});

// /mob/living/proc/resist_fire  (_nofile:0)
rt.def("/mob/living/proc/resist_fire", function resist_fire(f: Frame) {
	return live(f.dot);
});

// /mob/living/proc/resist_restraints  (_nofile:0)
rt.def("/mob/living/proc/resist_restraints", function resist_restraints(f: Frame) {
	return live(f.dot);
});

// /mob/living/proc/get_visible_name  (_nofile:0)
rt.def("/mob/living/proc/get_visible_name", function get_visible_name(f: Frame) {
	return rt.sv(f, "name");
});

// /mob/living/proc/get_permeability_protection  (_nofile:0)
rt.def("/mob/living/proc/get_permeability_protection", function get_permeability_protection(f: Frame) {
	return 0;
});

// /mob/living/proc/fakefireextinguish  (_nofile:0)
rt.def("/mob/living/proc/fakefireextinguish", function fakefireextinguish(f: Frame) {
	return live(f.dot);
});

// /mob/living/proc/fakefire  (_nofile:0)
rt.def("/mob/living/proc/fakefire", function fakefire(f: Frame) {
	return live(f.dot);
});

// /mob/living/proc/getarmor  (_nofile:0)
rt.def("/mob/living/proc/getarmor", function getarmor(f: Frame, def_zone: Value, type: Value) {
	return 0;
});

// /mob/living/proc/get_eye_protection  (_nofile:0)
rt.def("/mob/living/proc/get_eye_protection", function get_eye_protection(f: Frame) {
	return 0;
});

// /mob/living/proc/get_ear_protection  (_nofile:0)
rt.def("/mob/living/proc/get_ear_protection", function get_ear_protection(f: Frame) {
	return 0;
});

// /mob/living/proc/is_mouth_covered  (_nofile:0)
rt.def("/mob/living/proc/is_mouth_covered", function is_mouth_covered(f: Frame, head_only: Value, mask_only: Value) {
	f.vars = () => [head_only, mask_only];
	if (live(head_only) === null) {
		head_only = 0;
	}
	if (live(mask_only) === null) {
		mask_only = 0;
	}
	return 0;
});

// /mob/living/proc/is_eyes_covered  (_nofile:0)
rt.def("/mob/living/proc/is_eyes_covered", function is_eyes_covered(f: Frame, check_glasses: Value, check_head: Value, check_mask: Value) {
	f.vars = () => [check_glasses, check_head, check_mask];
	if (live(check_glasses) === null) {
		check_glasses = 1;
	}
	if (live(check_head) === null) {
		check_head = 1;
	}
	if (live(check_mask) === null) {
		check_mask = 1;
	}
	return 0;
});

// /mob/living/proc/on_hit  (_nofile:0)
rt.def("/mob/living/proc/on_hit", function on_hit(f: Frame, _P: Value) {
	return live(f.dot);
});

// /mob/living/proc/check_projectile_dismemberment  (_nofile:0)
rt.def("/mob/living/proc/check_projectile_dismemberment", function check_projectile_dismemberment(f: Frame, _P: Value, def_zone: Value) {
	return 0;
});

// /mob/living/proc/soundbang_act  (_nofile:0)
rt.def("/mob/living/proc/soundbang_act", function soundbang_act(f: Frame) {
	return 0;
});

// /mob/living/proc/damage_clothes  (_nofile:0)
rt.def("/mob/living/proc/damage_clothes", function damage_clothes(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value, def_zone: Value) {
	f.vars = () => [damage_type, damage_flag];
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	return live(f.dot);
});

// /mob/living/proc/get_taste_sensitivity  (_nofile:0)
rt.def("/mob/living/proc/get_taste_sensitivity", function get_taste_sensitivity(f: Frame) {
	return 15;
});

// /mob/living/proc/check_limb_hit  (_nofile:0)
rt.def("/mob/living/proc/check_limb_hit", function check_limb_hit(f: Frame, hit_zone: Value) {
	if (!truthy(rt.sv(f, "has_limbs"))) return f.dot;
	return live(hit_zone);
});

// /mob/living/proc/regenerate_limbs  (_nofile:0)
rt.def("/mob/living/proc/regenerate_limbs", function regenerate_limbs(f: Frame, noheal: Value, excluded_limbs: Value) {
	return 0;
});

// /mob/living/proc/regenerate_limb  (_nofile:0)
rt.def("/mob/living/proc/regenerate_limb", function regenerate_limb(f: Frame, limb_zone: Value, noheal: Value) {
	return live(f.dot);
});

// /mob/living/proc/get_bodypart  (_nofile:0)
rt.def("/mob/living/proc/get_bodypart", function get_bodypart(f: Frame, zone: Value) {
	return live(f.dot);
});

// /mob/living/proc/regenerate_organs  (_nofile:0)
rt.def("/mob/living/proc/regenerate_organs", function regenerate_organs(f: Frame) {
	return 0;
});

// /mob/living/carbon/human/proc/restore_blood  (_nofile:0)
rt.def("/mob/living/carbon/human/proc/restore_blood", function restore_blood(f: Frame) {
	rt.setSv(f, "blood_volume", 560);
	rt.setSv(f, "bleed_rate", 0);
	return f.dot;
});

// /mob/living/carbon/human/proc/is_literate  (_nofile:0)
rt.def("/mob/living/carbon/human/proc/is_literate", function is_literate(f: Frame) {
	return 1;
});

// /mob/living/carbon/human/proc/can_hold_items  (_nofile:0)
rt.def("/mob/living/carbon/human/proc/can_hold_items", function can_hold_items(f: Frame) {
	return 1;
});

// /mob/living/carbon/human/proc/IsAdvancedToolUser  (_nofile:0)
rt.def("/mob/living/carbon/human/proc/IsAdvancedToolUser", function IsAdvancedToolUser(f: Frame) {
	return 1;
});

// /mob/living/carbon/human/proc/GetSpecialVoice  (_nofile:0)
rt.def("/mob/living/carbon/human/proc/GetSpecialVoice", function GetSpecialVoice(f: Frame) {
	return rt.sv(f, "special_voice");
});

// /mob/living/carbon/human/dummy/proc/Life  (_nofile:0)
rt.def("/mob/living/carbon/human/dummy/proc/Life", function Life(f: Frame) {
	return live(f.dot);
}, false, { waitfor: false });

// /mob/living/carbon/proc/RestrainedClickOn  (_nofile:0)
rt.def("/mob/living/carbon/proc/RestrainedClickOn", function RestrainedClickOn(f: Frame, A: Value) {
	return 0;
});

// /mob/living/carbon/proc/has_dna  (_nofile:0)
rt.def("/mob/living/carbon/proc/has_dna", function has_dna(f: Frame) {
	return rt.sv(f, "dna");
});

// /mob/living/carbon/proc/update_mutations_overlay  (_nofile:0)
rt.def("/mob/living/carbon/proc/update_mutations_overlay", function update_mutations_overlay(f: Frame) {
	return live(f.dot);
});

// /mob/living/carbon/proc/canBeHandcuffed  (_nofile:0)
rt.def("/mob/living/carbon/proc/canBeHandcuffed", function canBeHandcuffed(f: Frame) {
	return 0;
});

// /mob/living/carbon/proc/attack_drone  (_nofile:0)
rt.def("/mob/living/carbon/proc/attack_drone", function attack_drone(f: Frame, user: Value) {
	return live(f.dot);
});

// /mob/living/carbon/proc/has_smoke_protection  (_nofile:0)
rt.def("/mob/living/carbon/proc/has_smoke_protection", function has_smoke_protection(f: Frame) {
	return 0;
});

// /mob/living/carbon/proc/handle_breath_temperature  (_nofile:0)
rt.def("/mob/living/carbon/proc/handle_breath_temperature", function handle_breath_temperature(f: Frame, breath: Value) {
	return live(f.dot);
});

// /mob/living/carbon/proc/handle_blood  (_nofile:0)
rt.def("/mob/living/carbon/proc/handle_blood", function handle_blood(f: Frame) {
	return live(f.dot);
});

// /mob/living/carbon/proc/update_hud_head  (_nofile:0)
rt.def("/mob/living/carbon/proc/update_hud_head", function update_hud_head(f: Frame, I: Value) {
	return live(f.dot);
});

// /mob/living/carbon/proc/update_hud_wear_mask  (_nofile:0)
rt.def("/mob/living/carbon/proc/update_hud_wear_mask", function update_hud_wear_mask(f: Frame, I: Value) {
	return live(f.dot);
});

// /mob/living/carbon/proc/update_hud_neck  (_nofile:0)
rt.def("/mob/living/carbon/proc/update_hud_neck", function update_hud_neck(f: Frame, I: Value) {
	return live(f.dot);
});

// /mob/living/carbon/proc/update_hud_back  (_nofile:0)
rt.def("/mob/living/carbon/proc/update_hud_back", function update_hud_back(f: Frame, I: Value) {
	return live(f.dot);
});

// /mob/living/carbon/monkey/verb/removeinternal  (_nofile:0)
rt.def("/mob/living/carbon/monkey/verb/removeinternal", function removeinternal(f: Frame) {
	rt.setSv(f, "internal", null);
	return live(f.dot);
}, false, { verb: { name: "Remove Internals", category: "IC" } });

// /mob/living/carbon/monkey/proc/IsAdvancedToolUser  (_nofile:0)
rt.def("/mob/living/carbon/monkey/proc/IsAdvancedToolUser", function IsAdvancedToolUser(f: Frame) {
	return 0;
});

// /mob/living/carbon/monkey/proc/reagent_check  (_nofile:0)
rt.def("/mob/living/carbon/monkey/proc/reagent_check", function reagent_check(f: Frame, R: Value) {
	return 0;
});

// /mob/living/carbon/monkey/proc/canBeHandcuffed  (_nofile:0)
rt.def("/mob/living/carbon/monkey/proc/canBeHandcuffed", function canBeHandcuffed(f: Frame) {
	return 1;
});

// /mob/living/carbon/monkey/proc/can_use_guns  (_nofile:0)
rt.def("/mob/living/carbon/monkey/proc/can_use_guns", function can_use_guns(f: Frame, G: Value) {
	return 1;
});

// /mob/living/carbon/alien/proc/RestrainedClickOn  (_nofile:0)
rt.def("/mob/living/carbon/alien/proc/RestrainedClickOn", function RestrainedClickOn(f: Frame, A: Value) {
	return live(f.dot);
});

// /mob/living/carbon/alien/proc/update_stamina  (_nofile:0)
rt.def("/mob/living/carbon/alien/proc/update_stamina", function update_stamina(f: Frame) {
	return live(f.dot);
});

// /mob/living/carbon/alien/proc/assess_threat  (_nofile:0)
rt.def("/mob/living/carbon/alien/proc/assess_threat", function assess_threat(f: Frame, judgement_criteria: Value, lasercolor: Value, weaponcheck: Value) {
	f.vars = () => [lasercolor, weaponcheck];
	if (live(lasercolor) === null) {
		lasercolor = "";
	}
	if (live(weaponcheck) === null) {
		weaponcheck = null;
	}
	return -10;
});

// /mob/living/carbon/alien/proc/reagent_check  (_nofile:0)
rt.def("/mob/living/carbon/alien/proc/reagent_check", function reagent_check(f: Frame, R: Value) {
	return 0;
});

// /mob/living/carbon/alien/proc/IsAdvancedToolUser  (_nofile:0)
rt.def("/mob/living/carbon/alien/proc/IsAdvancedToolUser", function IsAdvancedToolUser(f: Frame) {
	return rt.sv(f, "has_fine_manipulation");
});

// /mob/living/carbon/alien/proc/canBeHandcuffed  (_nofile:0)
rt.def("/mob/living/carbon/alien/proc/canBeHandcuffed", function canBeHandcuffed(f: Frame) {
	return 1;
});

// /mob/living/carbon/alien/proc/can_hold_items  (_nofile:0)
rt.def("/mob/living/carbon/alien/proc/can_hold_items", function can_hold_items(f: Frame) {
	return rt.sv(f, "has_fine_manipulation");
});

// /mob/living/carbon/alien/proc/get_ear_protection  (_nofile:0)
rt.def("/mob/living/carbon/alien/proc/get_ear_protection", function get_ear_protection(f: Frame) {
	return 2;
});

// /mob/living/carbon/alien/proc/soundbang_act  (_nofile:0)
rt.def("/mob/living/carbon/alien/proc/soundbang_act", function soundbang_act(f: Frame, intensity: Value, stun_pwr: Value, damage_pwr: Value, deafen_pwr: Value) {
	f.vars = () => [intensity, stun_pwr, damage_pwr, deafen_pwr];
	if (live(intensity) === null) {
		intensity = 1;
	}
	if (live(stun_pwr) === null) {
		stun_pwr = 20;
	}
	if (live(damage_pwr) === null) {
		damage_pwr = 5;
	}
	if (live(deafen_pwr) === null) {
		deafen_pwr = 15;
	}
	return 0;
});

// /mob/living/carbon/alien/proc/acid_act  (_nofile:0)
rt.def("/mob/living/carbon/alien/proc/acid_act", function acid_act(f: Frame, acidpwr: Value, acid_volume: Value) {
	return 0;
});

// /mob/living/carbon/alien/proc/getToxLoss  (_nofile:0)
rt.def("/mob/living/carbon/alien/proc/getToxLoss", function getToxLoss(f: Frame) {
	return 0;
});

// /mob/living/carbon/alien/proc/adjustToxLoss  (_nofile:0)
rt.def("/mob/living/carbon/alien/proc/adjustToxLoss", function adjustToxLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	f.vars = () => [updating_health, forced];
	if (live(updating_health) === null) {
		updating_health = 1;
	}
	if (live(forced) === null) {
		forced = 0;
	}
	return 0;
});

// /mob/living/carbon/alien/proc/adjustStaminaLoss  (_nofile:0)
rt.def("/mob/living/carbon/alien/proc/adjustStaminaLoss", function adjustStaminaLoss(f: Frame, amount: Value, updating_stamina: Value) {
	f.vars = () => [updating_stamina];
	if (live(updating_stamina) === null) {
		updating_stamina = 1;
	}
	return live(f.dot);
});

// /mob/living/carbon/alien/proc/setStaminaLoss  (_nofile:0)
rt.def("/mob/living/carbon/alien/proc/setStaminaLoss", function setStaminaLoss(f: Frame, amount: Value, updating_stamina: Value) {
	f.vars = () => [updating_stamina];
	if (live(updating_stamina) === null) {
		updating_stamina = 1;
	}
	return live(f.dot);
});

// /mob/living/carbon/alien/proc/handle_changeling  (_nofile:0)
rt.def("/mob/living/carbon/alien/proc/handle_changeling", function handle_changeling(f: Frame) {
	return live(f.dot);
});

// /mob/living/carbon/alien/proc/update_damage_overlays  (_nofile:0)
rt.def("/mob/living/carbon/alien/proc/update_damage_overlays", function update_damage_overlays(f: Frame) {
	return live(f.dot);
});

// /mob/living/carbon/alien/proc/update_body  (_nofile:0)
rt.def("/mob/living/carbon/alien/proc/update_body", function update_body(f: Frame) {
	return live(f.dot);
});

// /mob/living/carbon/alien/proc/update_body_parts  (_nofile:0)
rt.def("/mob/living/carbon/alien/proc/update_body_parts", function update_body_parts(f: Frame) {
	return live(f.dot);
});

// /mob/living/carbon/alien/larva/proc/updatePlasmaDisplay  (_nofile:0)
rt.def("/mob/living/carbon/alien/larva/proc/updatePlasmaDisplay", function updatePlasmaDisplay(f: Frame) {
	return live(f.dot);
});

// /mob/living/carbon/alien/larva/proc/doUnEquip  (_nofile:0)
rt.def("/mob/living/carbon/alien/larva/proc/doUnEquip", function doUnEquip(f: Frame, W: Value) {
	return live(f.dot);
});

// /mob/living/carbon/alien/larva/proc/attack_ui  (_nofile:0)
rt.def("/mob/living/carbon/alien/larva/proc/attack_ui", function attack_ui(f: Frame, slot_id: Value) {
	return live(f.dot);
});

// /mob/living/carbon/alien/larva/proc/restrained  (_nofile:0)
rt.def("/mob/living/carbon/alien/larva/proc/restrained", function restrained(f: Frame, ignore_grab: Value) {
	f.dot = 0;
	return f.dot;
});

// /mob/living/carbon/alien/larva/proc/show_inv  (_nofile:0)
rt.def("/mob/living/carbon/alien/larva/proc/show_inv", function show_inv(f: Frame, user: Value) {
	return live(f.dot);
});

// /mob/living/carbon/alien/larva/proc/toggle_throw_mode  (_nofile:0)
rt.def("/mob/living/carbon/alien/larva/proc/toggle_throw_mode", function toggle_throw_mode(f: Frame) {
	return live(f.dot);
});

// /mob/living/carbon/alien/larva/proc/start_pulling  (_nofile:0)
rt.def("/mob/living/carbon/alien/larva/proc/start_pulling", function start_pulling(f: Frame) {
	return live(f.dot);
});

// /mob/living/carbon/alien/larva/proc/has_left_hand  (_nofile:0)
rt.def("/mob/living/carbon/alien/larva/proc/has_left_hand", function has_left_hand(f: Frame) {
	return 1;
});

// /mob/living/carbon/alien/larva/proc/has_right_hand  (_nofile:0)
rt.def("/mob/living/carbon/alien/larva/proc/has_right_hand", function has_right_hand(f: Frame) {
	return 1;
});

// /mob/living/carbon/alien/larva/proc/get_arm_ignore  (_nofile:0)
rt.def("/mob/living/carbon/alien/larva/proc/get_arm_ignore", function get_arm_ignore(f: Frame) {
	return 1;
});

// /mob/living/carbon/alien/larva/proc/get_leg_ignore  (_nofile:0)
rt.def("/mob/living/carbon/alien/larva/proc/get_leg_ignore", function get_leg_ignore(f: Frame) {
	return 1;
});

// /mob/living/carbon/alien/humanoid/proc/get_permeability_protection  (_nofile:0)
rt.def("/mob/living/carbon/alien/humanoid/proc/get_permeability_protection", function get_permeability_protection(f: Frame) {
	return 0.800000011920929;
});

// /mob/living/carbon/alien/humanoid/royal/queen/proc/findQueen  (_nofile:0)
rt.def("/mob/living/carbon/alien/humanoid/royal/queen/proc/findQueen", function findQueen(f: Frame) {
	return live(f.dot);
});

// /mob/living/carbon/alien/humanoid/royal/proc/can_inject  (_nofile:0)
rt.def("/mob/living/carbon/alien/humanoid/royal/proc/can_inject", function can_inject(f: Frame) {
	return 0;
});

// /mob/living/carbon/true_devil/proc/resist_fire  empty
rt.def("/mob/living/carbon/true_devil/proc/resist_fire");

// /mob/living/carbon/true_devil/proc/handle_breathing  empty
rt.def("/mob/living/carbon/true_devil/proc/handle_breathing");

// /mob/living/carbon/true_devil/proc/IsAdvancedToolUser  (_nofile:0)
rt.def("/mob/living/carbon/true_devil/proc/IsAdvancedToolUser", function IsAdvancedToolUser(f: Frame) {
	return 1;
});

// /mob/living/carbon/true_devil/proc/assess_threat  (_nofile:0)
rt.def("/mob/living/carbon/true_devil/proc/assess_threat", function assess_threat(f: Frame, judgement_criteria: Value, lasercolor: Value, weaponcheck: Value) {
	f.vars = () => [lasercolor, weaponcheck];
	if (live(lasercolor) === null) {
		lasercolor = "";
	}
	if (live(weaponcheck) === null) {
		weaponcheck = null;
	}
	return 666;
});

// /mob/living/carbon/true_devil/proc/soundbang_act  (_nofile:0)
rt.def("/mob/living/carbon/true_devil/proc/soundbang_act", function soundbang_act(f: Frame) {
	return 0;
});

// /mob/living/carbon/true_devil/proc/get_ear_protection  (_nofile:0)
rt.def("/mob/living/carbon/true_devil/proc/get_ear_protection", function get_ear_protection(f: Frame) {
	return 2;
});

// /mob/living/carbon/true_devil/proc/Process_Spacemove  (_nofile:0)
rt.def("/mob/living/carbon/true_devil/proc/Process_Spacemove", function Process_Spacemove(f: Frame, movement_dir: Value) {
	f.vars = () => [movement_dir];
	if (live(movement_dir) === null) {
		movement_dir = 0;
	}
	return 1;
});

// /mob/living/carbon/true_devil/proc/can_be_revived  (_nofile:0)
rt.def("/mob/living/carbon/true_devil/proc/can_be_revived", function can_be_revived(f: Frame) {
	return 1;
});

// /mob/living/carbon/true_devil/proc/is_literate  (_nofile:0)
rt.def("/mob/living/carbon/true_devil/proc/is_literate", function is_literate(f: Frame) {
	return 1;
});

// /mob/living/carbon/true_devil/proc/update_body  (_nofile:0)
rt.def("/mob/living/carbon/true_devil/proc/update_body", function update_body(f: Frame) {
	return live(f.dot);
});

// /mob/living/carbon/true_devil/proc/update_body_parts  (_nofile:0)
rt.def("/mob/living/carbon/true_devil/proc/update_body_parts", function update_body_parts(f: Frame) {
	return live(f.dot);
});

// /mob/living/carbon/true_devil/proc/update_damage_overlays  (_nofile:0)
rt.def("/mob/living/carbon/true_devil/proc/update_damage_overlays", function update_damage_overlays(f: Frame) {
	return live(f.dot);
});

// /mob/living/silicon/ai/proc/update_canmove  (_nofile:0)
rt.def("/mob/living/silicon/ai/proc/update_canmove", function update_canmove(f: Frame) {
	return 0;
});

// /mob/living/silicon/ai/proc/restrained  (_nofile:0)
rt.def("/mob/living/silicon/ai/proc/restrained", function restrained(f: Frame, ignore_grab: Value) {
	f.dot = 0;
	return f.dot;
});

// /mob/living/silicon/ai/proc/can_buckle  (_nofile:0)
rt.def("/mob/living/silicon/ai/proc/can_buckle", function can_buckle(f: Frame) {
	return 0;
});

// /mob/living/silicon/ai/resist  (_nofile:0)
rt.def("/mob/living/silicon/ai/resist", function resist(f: Frame) {
	return live(f.dot);
}, false, { verb: { name: "Resist", category: "IC" } });

// /mob/living/silicon/ai/proc/attack_slime  (_nofile:0)
rt.def("/mob/living/silicon/ai/proc/attack_slime", function attack_slime(f: Frame, user: Value) {
	return live(f.dot);
});

// /mob/living/silicon/ai/proc/flash_act  (_nofile:0)
rt.def("/mob/living/silicon/ai/proc/flash_act", function flash_act(f: Frame, intensity: Value, override_blindness_check: Value, affect_silicon: Value) {
	f.vars = () => [intensity, override_blindness_check, affect_silicon];
	if (live(intensity) === null) {
		intensity = 1;
	}
	if (live(override_blindness_check) === null) {
		override_blindness_check = 0;
	}
	if (live(affect_silicon) === null) {
		affect_silicon = 0;
	}
	return live(f.dot);
});

// /mob/living/silicon/ai/proc/physical_can_use_topic  (_nofile:0)
rt.def("/mob/living/silicon/ai/proc/physical_can_use_topic", function physical_can_use_topic(f: Frame, src_object: Value) {
	return 1;
});

// /mob/living/silicon/robot/proc/get_active_held_item  (_nofile:0)
rt.def("/mob/living/silicon/robot/proc/get_active_held_item", function get_active_held_item(f: Frame) {
	return rt.sv(f, "module_active");
});

// /mob/living/silicon/robot/proc/get_cell  (_nofile:0)
rt.def("/mob/living/silicon/robot/proc/get_cell", function get_cell(f: Frame) {
	return rt.sv(f, "cell");
});

// /mob/living/silicon/robot/proc/restrained  (_nofile:0)
rt.def("/mob/living/silicon/robot/proc/restrained", function restrained(f: Frame, ignore_grab: Value) {
	f.dot = 0;
	return f.dot;
});

// /mob/living/silicon/robot/proc/reset_headlamp  (_nofile:0)
rt.def("/mob/living/silicon/robot/proc/reset_headlamp", function reset_headlamp(f: Frame) {
	rt.setSv(f, "lamp_recharging", 0);
	return f.dot;
});

// /mob/living/silicon/robot/proc/mob_negates_gravity  (_nofile:0)
rt.def("/mob/living/silicon/robot/proc/mob_negates_gravity", function mob_negates_gravity(f: Frame) {
	return rt.sv(f, "magpulse");
});

// /mob/living/silicon/robot/syndicate/proc/ResetModule  (_nofile:0)
rt.def("/mob/living/silicon/robot/syndicate/proc/ResetModule", function ResetModule(f: Frame) {
	return live(f.dot);
});

// /mob/living/silicon/pai/proc/UnarmedAttack  (_nofile:0)
rt.def("/mob/living/silicon/pai/proc/UnarmedAttack", function UnarmedAttack(f: Frame, A: Value) {
	return live(f.dot);
});

// /mob/living/silicon/pai/proc/restrained  (_nofile:0)
rt.def("/mob/living/silicon/pai/proc/restrained", function restrained(f: Frame, ignore_grab: Value) {
	f.dot = 0;
	return f.dot;
});

// /mob/living/silicon/pai/proc/canUseTopic  (_nofile:0)
rt.def("/mob/living/silicon/pai/proc/canUseTopic", function canUseTopic(f: Frame, M: Value) {
	return 1;
});

// /mob/living/silicon/pai/proc/generateStaticOverlay  (_nofile:0)
rt.def("/mob/living/silicon/pai/proc/generateStaticOverlay", function generateStaticOverlay(f: Frame) {
	return live(f.dot);
});

// /mob/living/silicon/pai/proc/blob_act  (_nofile:0)
rt.def("/mob/living/silicon/pai/proc/blob_act", function blob_act(f: Frame, B: Value) {
	return 0;
});

// /mob/living/silicon/pai/proc/IgniteMob  (_nofile:0)
rt.def("/mob/living/silicon/pai/proc/IgniteMob", function IgniteMob(f: Frame, _P: Value) {
	return 0;
});

// /mob/living/silicon/pai/proc/adjustToxLoss  (_nofile:0)
rt.def("/mob/living/silicon/pai/proc/adjustToxLoss", function adjustToxLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	f.vars = () => [updating_health, forced];
	if (live(updating_health) === null) {
		updating_health = 1;
	}
	if (live(forced) === null) {
		forced = 0;
	}
	return 0;
});

// /mob/living/silicon/pai/proc/adjustOxyLoss  (_nofile:0)
rt.def("/mob/living/silicon/pai/proc/adjustOxyLoss", function adjustOxyLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	f.vars = () => [updating_health, forced];
	if (live(updating_health) === null) {
		updating_health = 1;
	}
	if (live(forced) === null) {
		forced = 0;
	}
	return 0;
});

// /mob/living/silicon/pai/proc/adjustCloneLoss  (_nofile:0)
rt.def("/mob/living/silicon/pai/proc/adjustCloneLoss", function adjustCloneLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	f.vars = () => [updating_health, forced];
	if (live(updating_health) === null) {
		updating_health = 1;
	}
	if (live(forced) === null) {
		forced = 0;
	}
	return 0;
});

// /mob/living/silicon/pai/proc/getToxLoss  (_nofile:0)
rt.def("/mob/living/silicon/pai/proc/getToxLoss", function getToxLoss(f: Frame) {
	return 0;
});

// /mob/living/silicon/pai/proc/getOxyLoss  (_nofile:0)
rt.def("/mob/living/silicon/pai/proc/getOxyLoss", function getOxyLoss(f: Frame) {
	return 0;
});

// /mob/living/silicon/pai/proc/getCloneLoss  (_nofile:0)
rt.def("/mob/living/silicon/pai/proc/getCloneLoss", function getCloneLoss(f: Frame) {
	return 0;
});

// /mob/living/silicon/pai/proc/getBrainLoss  (_nofile:0)
rt.def("/mob/living/silicon/pai/proc/getBrainLoss", function getBrainLoss(f: Frame) {
	return 0;
});

// /mob/living/silicon/pai/proc/getStaminaLoss  (_nofile:0)
rt.def("/mob/living/silicon/pai/proc/getStaminaLoss", function getStaminaLoss(f: Frame) {
	return 0;
});

// /mob/living/silicon/pai/proc/setCloneLoss  (_nofile:0)
rt.def("/mob/living/silicon/pai/proc/setCloneLoss", function setCloneLoss(f: Frame) {
	return 0;
});

// /mob/living/silicon/pai/proc/setBrainLoss  (_nofile:0)
rt.def("/mob/living/silicon/pai/proc/setBrainLoss", function setBrainLoss(f: Frame) {
	return 0;
});

// /mob/living/silicon/pai/proc/setStaminaLoss  (_nofile:0)
rt.def("/mob/living/silicon/pai/proc/setStaminaLoss", function setStaminaLoss(f: Frame) {
	return 0;
});

// /mob/living/silicon/pai/proc/setToxLoss  (_nofile:0)
rt.def("/mob/living/silicon/pai/proc/setToxLoss", function setToxLoss(f: Frame) {
	return 0;
});

// /mob/living/silicon/pai/proc/setOxyLoss  (_nofile:0)
rt.def("/mob/living/silicon/pai/proc/setOxyLoss", function setOxyLoss(f: Frame) {
	return 0;
});

// /mob/living/silicon/pai/proc/emittercool  (_nofile:0)
rt.def("/mob/living/silicon/pai/proc/emittercool", function emittercool(f: Frame) {
	rt.setSv(f, "emittersemicd", 0);
	return f.dot;
});

// /mob/living/silicon/pai/proc/start_pulling  (_nofile:0)
rt.def("/mob/living/silicon/pai/proc/start_pulling", function start_pulling(f: Frame, AM: Value) {
	return 0;
});

// /mob/living/silicon/pai/proc/binarycheck  (_nofile:0)
rt.def("/mob/living/silicon/pai/proc/binarycheck", function binarycheck(f: Frame) {
	return 0;
});

// /mob/living/silicon/proc/can_be_implanted  (_nofile:0)
rt.def("/mob/living/silicon/proc/can_be_implanted", function can_be_implanted(f: Frame) {
	return 0;
});

// /mob/living/silicon/proc/apply_effect  (_nofile:0)
rt.def("/mob/living/silicon/proc/apply_effect", function apply_effect(f: Frame, effect: Value, effecttype: Value, blocked: Value) {
	f.vars = () => [effect, effecttype, blocked];
	if (live(effect) === null) {
		effect = 0;
	}
	if (live(effecttype) === null) {
		effecttype = "stun";
	}
	if (live(blocked) === null) {
		blocked = 0;
	}
	return 0;
});

// /mob/living/silicon/proc/adjustToxLoss  (_nofile:0)
rt.def("/mob/living/silicon/proc/adjustToxLoss", function adjustToxLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	f.vars = () => [updating_health, forced];
	if (live(updating_health) === null) {
		updating_health = 1;
	}
	if (live(forced) === null) {
		forced = 0;
	}
	return 0;
});

// /mob/living/silicon/proc/setToxLoss  (_nofile:0)
rt.def("/mob/living/silicon/proc/setToxLoss", function setToxLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	f.vars = () => [updating_health, forced];
	if (live(updating_health) === null) {
		updating_health = 1;
	}
	if (live(forced) === null) {
		forced = 0;
	}
	return 0;
});

// /mob/living/silicon/proc/adjustCloneLoss  (_nofile:0)
rt.def("/mob/living/silicon/proc/adjustCloneLoss", function adjustCloneLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	f.vars = () => [updating_health, forced];
	if (live(updating_health) === null) {
		updating_health = 1;
	}
	if (live(forced) === null) {
		forced = 0;
	}
	return 0;
});

// /mob/living/silicon/proc/setCloneLoss  (_nofile:0)
rt.def("/mob/living/silicon/proc/setCloneLoss", function setCloneLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	f.vars = () => [updating_health, forced];
	if (live(updating_health) === null) {
		updating_health = 1;
	}
	if (live(forced) === null) {
		forced = 0;
	}
	return 0;
});

// /mob/living/silicon/proc/adjustStaminaLoss  (_nofile:0)
rt.def("/mob/living/silicon/proc/adjustStaminaLoss", function adjustStaminaLoss(f: Frame, amount: Value, updating_stamina: Value) {
	f.vars = () => [updating_stamina];
	if (live(updating_stamina) === null) {
		updating_stamina = 1;
	}
	return live(f.dot);
});

// /mob/living/silicon/proc/setStaminaLoss  (_nofile:0)
rt.def("/mob/living/silicon/proc/setStaminaLoss", function setStaminaLoss(f: Frame, amount: Value, updating_stamina: Value) {
	f.vars = () => [updating_stamina];
	if (live(updating_stamina) === null) {
		updating_stamina = 1;
	}
	return live(f.dot);
});

// /mob/living/silicon/proc/show_laws  (_nofile:0)
rt.def("/mob/living/silicon/proc/show_laws", function show_laws(f: Frame) {
	return live(f.dot);
});

// /mob/living/silicon/proc/binarycheck  (_nofile:0)
rt.def("/mob/living/silicon/proc/binarycheck", function binarycheck(f: Frame) {
	return 1;
});

// /mob/living/silicon/proc/lingcheck  (_nofile:0)
rt.def("/mob/living/silicon/proc/lingcheck", function lingcheck(f: Frame) {
	return 0;
});

// /mob/living/silicon/proc/med_hud_set_health  (_nofile:0)
rt.def("/mob/living/silicon/proc/med_hud_set_health", function med_hud_set_health(f: Frame) {
	return live(f.dot);
});

// /mob/living/silicon/proc/med_hud_set_status  (_nofile:0)
rt.def("/mob/living/silicon/proc/med_hud_set_status", function med_hud_set_status(f: Frame) {
	return live(f.dot);
});

// /mob/living/silicon/proc/contents_explosion  (_nofile:0)
rt.def("/mob/living/silicon/proc/contents_explosion", function contents_explosion(f: Frame, severity: Value, target: Value) {
	return live(f.dot);
});

// /mob/living/silicon/proc/cancelAlarm  (_nofile:0)
rt.def("/mob/living/silicon/proc/cancelAlarm", function cancelAlarm(f: Frame) {
	return live(f.dot);
});

// /mob/living/silicon/proc/triggerAlarm  (_nofile:0)
rt.def("/mob/living/silicon/proc/triggerAlarm", function triggerAlarm(f: Frame) {
	return live(f.dot);
});

// /mob/living/silicon/proc/drop_item  (_nofile:0)
rt.def("/mob/living/silicon/proc/drop_item", function drop_item(f: Frame) {
	return live(f.dot);
});

// /mob/living/silicon/proc/IsAdvancedToolUser  (_nofile:0)
rt.def("/mob/living/silicon/proc/IsAdvancedToolUser", function IsAdvancedToolUser(f: Frame) {
	return 1;
});

// /mob/living/silicon/proc/put_in_hand_check  (_nofile:0)
rt.def("/mob/living/silicon/proc/put_in_hand_check", function put_in_hand_check(f: Frame) {
	return 0;
});

// /mob/living/silicon/proc/stripPanelEquip  (_nofile:0)
rt.def("/mob/living/silicon/proc/stripPanelEquip", function stripPanelEquip(f: Frame, what: Value, who: Value, slot: Value) {
	return 0;
});

// /mob/living/silicon/proc/assess_threat  (_nofile:0)
rt.def("/mob/living/silicon/proc/assess_threat", function assess_threat(f: Frame, judgement_criteria: Value, lasercolor: Value, weaponcheck: Value) {
	f.vars = () => [lasercolor, weaponcheck];
	if (live(lasercolor) === null) {
		lasercolor = "";
	}
	if (live(weaponcheck) === null) {
		weaponcheck = null;
	}
	return -10;
});

// /mob/living/silicon/proc/is_literate  (_nofile:0)
rt.def("/mob/living/silicon/proc/is_literate", function is_literate(f: Frame) {
	return 1;
});

// /mob/living/silicon/proc/grippedby  (_nofile:0)
rt.def("/mob/living/silicon/proc/grippedby", function grippedby(f: Frame, user: Value) {
	return live(f.dot);
});

// /mob/living/silicon/proc/get_ear_protection  (_nofile:0)
rt.def("/mob/living/silicon/proc/get_ear_protection", function get_ear_protection(f: Frame) {
	return 2;
});

// /mob/living/simple_animal/drone/proc/assess_threat  (_nofile:0)
rt.def("/mob/living/simple_animal/drone/proc/assess_threat", function assess_threat(f: Frame, judgement_criteria: Value, lasercolor: Value, weaponcheck: Value) {
	f.vars = () => [lasercolor, weaponcheck];
	if (live(lasercolor) === null) {
		lasercolor = "";
	}
	if (live(weaponcheck) === null) {
		weaponcheck = null;
	}
	return -10;
});

// /mob/living/simple_animal/drone/proc/handle_temperature_damage  (_nofile:0)
rt.def("/mob/living/simple_animal/drone/proc/handle_temperature_damage", function handle_temperature_damage(f: Frame) {
	return live(f.dot);
});

// /mob/living/simple_animal/drone/proc/mob_negates_gravity  (_nofile:0)
rt.def("/mob/living/simple_animal/drone/proc/mob_negates_gravity", function mob_negates_gravity(f: Frame) {
	return 1;
});

// /mob/living/simple_animal/drone/proc/experience_pressure_difference  (_nofile:0)
rt.def("/mob/living/simple_animal/drone/proc/experience_pressure_difference", function experience_pressure_difference(f: Frame, pressure_difference: Value, direction: Value) {
	return live(f.dot);
}, false, { waitfor: false });

// /mob/living/simple_animal/drone/proc/bee_friendly  (_nofile:0)
rt.def("/mob/living/simple_animal/drone/proc/bee_friendly", function bee_friendly(f: Frame) {
	return 1;
});

// /mob/living/simple_animal/drone/proc/electrocute_act  (_nofile:0)
rt.def("/mob/living/simple_animal/drone/proc/electrocute_act", function electrocute_act(f: Frame, shock_damage: Value, source: Value, siemens_coeff: Value, safety: Value, tesla_shock: Value, illusion: Value, stun: Value) {
	f.vars = () => [siemens_coeff, safety, tesla_shock, illusion, stun];
	if (live(siemens_coeff) === null) {
		siemens_coeff = 1;
	}
	if (live(safety) === null) {
		safety = 0;
	}
	if (live(tesla_shock) === null) {
		tesla_shock = 0;
	}
	if (live(illusion) === null) {
		illusion = 0;
	}
	if (live(stun) === null) {
		stun = 1;
	}
	return 0;
});

// /mob/living/simple_animal/drone/proc/get_armor_effectiveness  (_nofile:0)
rt.def("/mob/living/simple_animal/drone/proc/get_armor_effectiveness", function get_armor_effectiveness(f: Frame) {
	return 0;
});

// /mob/living/simple_animal/drone/proc/getBackSlot  (_nofile:0)
rt.def("/mob/living/simple_animal/drone/proc/getBackSlot", function getBackSlot(f: Frame) {
	return 20;
});

// /mob/living/simple_animal/drone/proc/getBeltSlot  (_nofile:0)
rt.def("/mob/living/simple_animal/drone/proc/getBeltSlot", function getBeltSlot(f: Frame) {
	return 20;
});

// /mob/living/simple_animal/drone/proc/binarycheck  (_nofile:0)
rt.def("/mob/living/simple_animal/drone/proc/binarycheck", function binarycheck(f: Frame) {
	return 1;
});

// /mob/living/simple_animal/drone/proc/generateStaticOverlay  (_nofile:0)
rt.def("/mob/living/simple_animal/drone/proc/generateStaticOverlay", function generateStaticOverlay(f: Frame) {
	return live(f.dot);
});

// /mob/living/simple_animal/drone/cogscarab/proc/binarycheck  (_nofile:0)
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/binarycheck", function binarycheck(f: Frame) {
	return 0;
});

// /mob/living/simple_animal/drone/cogscarab/proc/can_use_guns  (_nofile:0)
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/can_use_guns", function can_use_guns(f: Frame, G: Value) {
	return rt.gl("ratvar_awakens");
});

// /mob/living/simple_animal/drone/cogscarab/proc/triggerAlarm  (_nofile:0)
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/triggerAlarm", function triggerAlarm(f: Frame, _class: Value, A: Value, O: Value, alarmsource: Value) {
	return live(f.dot);
});

// /mob/living/simple_animal/drone/cogscarab/proc/cancelAlarm  (_nofile:0)
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/cancelAlarm", function cancelAlarm(f: Frame, _class: Value, A: Value, origin: Value) {
	return live(f.dot);
});

// /mob/living/simple_animal/drone/cogscarab/proc/update_drone_hack  (_nofile:0)
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/update_drone_hack", function update_drone_hack(f: Frame) {
	return live(f.dot);
});

// /mob/living/simple_animal/proc/can_be_implanted  (_nofile:0)
rt.def("/mob/living/simple_animal/proc/can_be_implanted", function can_be_implanted(f: Frame) {
	return rt.sv(f, "healable");
});

// /mob/living/simple_animal/proc/adjustStaminaLoss  (_nofile:0)
rt.def("/mob/living/simple_animal/proc/adjustStaminaLoss", function adjustStaminaLoss(f: Frame, amount: Value) {
	return live(f.dot);
});

// /mob/living/simple_animal/proc/handle_automated_action  (_nofile:0)
rt.def("/mob/living/simple_animal/proc/handle_automated_action", function handle_automated_action(f: Frame) {
	return live(f.dot);
}, false, { waitfor: false });

// /mob/living/simple_animal/proc/handle_fire  (_nofile:0)
rt.def("/mob/living/simple_animal/proc/handle_fire", function handle_fire(f: Frame) {
	return live(f.dot);
});

// /mob/living/simple_animal/proc/IgniteMob  (_nofile:0)
rt.def("/mob/living/simple_animal/proc/IgniteMob", function IgniteMob(f: Frame) {
	return 0;
});

// /mob/living/simple_animal/proc/ExtinguishMob  (_nofile:0)
rt.def("/mob/living/simple_animal/proc/ExtinguishMob", function ExtinguishMob(f: Frame) {
	return live(f.dot);
});

// /mob/living/simple_animal/proc/sentience_act  (_nofile:0)
rt.def("/mob/living/simple_animal/proc/sentience_act", function sentience_act(f: Frame) {
	return live(f.dot);
});

// /mob/living/simple_animal/proc/get_idcard  (_nofile:0)
rt.def("/mob/living/simple_animal/proc/get_idcard", function get_idcard(f: Frame) {
	return rt.sv(f, "access_card");
});

// /mob/living/simple_animal/proc/can_hold_items  (_nofile:0)
rt.def("/mob/living/simple_animal/proc/can_hold_items", function can_hold_items(f: Frame) {
	return rt.sv(f, "dextrous");
});

// /mob/living/simple_animal/proc/IsAdvancedToolUser  (_nofile:0)
rt.def("/mob/living/simple_animal/proc/IsAdvancedToolUser", function IsAdvancedToolUser(f: Frame) {
	return rt.sv(f, "dextrous");
});

// /mob/living/simple_animal/proc/blind_eyes  (_nofile:0)
rt.def("/mob/living/simple_animal/proc/blind_eyes", function blind_eyes(f: Frame) {
	return live(f.dot);
});

// /mob/living/simple_animal/proc/adjust_blindness  (_nofile:0)
rt.def("/mob/living/simple_animal/proc/adjust_blindness", function adjust_blindness(f: Frame) {
	return live(f.dot);
});

// /mob/living/simple_animal/proc/set_blindness  (_nofile:0)
rt.def("/mob/living/simple_animal/proc/set_blindness", function set_blindness(f: Frame) {
	return live(f.dot);
});

// /mob/living/simple_animal/proc/blur_eyes  (_nofile:0)
rt.def("/mob/living/simple_animal/proc/blur_eyes", function blur_eyes(f: Frame) {
	return live(f.dot);
});

// /mob/living/simple_animal/proc/adjust_blurriness  (_nofile:0)
rt.def("/mob/living/simple_animal/proc/adjust_blurriness", function adjust_blurriness(f: Frame) {
	return live(f.dot);
});

// /mob/living/simple_animal/proc/set_blurriness  (_nofile:0)
rt.def("/mob/living/simple_animal/proc/set_blurriness", function set_blurriness(f: Frame) {
	return live(f.dot);
});

// /mob/living/simple_animal/proc/become_blind  (_nofile:0)
rt.def("/mob/living/simple_animal/proc/become_blind", function become_blind(f: Frame) {
	return live(f.dot);
});

// /mob/living/simple_animal/slime/proc/RestrainedClickOn  (_nofile:0)
rt.def("/mob/living/simple_animal/slime/proc/RestrainedClickOn", function RestrainedClickOn(f: Frame, A: Value) {
	return live(f.dot);
});

// /mob/living/simple_animal/slime/proc/RestrainedClickOn  (_nofile:0)
rt.def("/mob/living/simple_animal/slime/proc/RestrainedClickOn", function RestrainedClickOn(f: Frame, A: Value) {
	return live(f.dot);
});

// /mob/living/simple_animal/slime/proc/handle_automated_movement  (_nofile:0)
rt.def("/mob/living/simple_animal/slime/proc/handle_automated_movement", function handle_automated_movement(f: Frame) {
	return live(f.dot);
}, false, { waitfor: false });

// /mob/living/simple_animal/slime/proc/handle_automated_speech  (_nofile:0)
rt.def("/mob/living/simple_animal/slime/proc/handle_automated_speech", function handle_automated_speech(f: Frame) {
	return live(f.dot);
}, false, { waitfor: false });

// /mob/living/simple_animal/slime/proc/Process_Spacemove  (_nofile:0)
rt.def("/mob/living/simple_animal/slime/proc/Process_Spacemove", function Process_Spacemove(f: Frame, movement_dir: Value) {
	f.vars = () => [movement_dir];
	if (live(movement_dir) === null) {
		movement_dir = 0;
	}
	return 2;
});

// /mob/living/simple_animal/slime/proc/doUnEquip  (_nofile:0)
rt.def("/mob/living/simple_animal/slime/proc/doUnEquip", function doUnEquip(f: Frame, W: Value) {
	return live(f.dot);
});

// /mob/living/simple_animal/slime/proc/start_pulling  (_nofile:0)
rt.def("/mob/living/simple_animal/slime/proc/start_pulling", function start_pulling(f: Frame, AM: Value) {
	return live(f.dot);
});

// /mob/living/simple_animal/slime/proc/attack_ui  (_nofile:0)
rt.def("/mob/living/simple_animal/slime/proc/attack_ui", function attack_ui(f: Frame, slot: Value) {
	return live(f.dot);
});

// /mob/living/simple_animal/slime/proc/can_unbuckle  (_nofile:0)
rt.def("/mob/living/simple_animal/slime/proc/can_unbuckle", function can_unbuckle(f: Frame) {
	return 0;
});

// /mob/living/simple_animal/slime/proc/can_buckle  (_nofile:0)
rt.def("/mob/living/simple_animal/slime/proc/can_buckle", function can_buckle(f: Frame) {
	return 0;
});

// /mob/living/simple_animal/hostile/proc/Found  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/proc/Found", function Found(f: Frame, A: Value) {
	return live(f.dot);
});

// /mob/living/simple_animal/hostile/clockwork/marauder/proc/Process_Spacemove  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/Process_Spacemove", function Process_Spacemove(f: Frame, movement_dir: Value) {
	f.vars = () => [movement_dir];
	if (live(movement_dir) === null) {
		movement_dir = 0;
	}
	return 1;
});

// /mob/living/simple_animal/hostile/clockwork/proc/electrocute_act  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/clockwork/proc/electrocute_act", function electrocute_act(f: Frame, shock_damage: Value, source: Value, siemens_coeff: Value, safety: Value, tesla_shock: Value, illusion: Value, stun: Value) {
	f.vars = () => [siemens_coeff, safety, tesla_shock, illusion, stun];
	if (live(siemens_coeff) === null) {
		siemens_coeff = 1;
	}
	if (live(safety) === null) {
		safety = 0;
	}
	if (live(tesla_shock) === null) {
		tesla_shock = 0;
	}
	if (live(illusion) === null) {
		illusion = 0;
	}
	if (live(stun) === null) {
		stun = 1;
	}
	return 0;
});

// /mob/living/simple_animal/hostile/clockwork/fragment/proc/Process_Spacemove  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/clockwork/fragment/proc/Process_Spacemove", function Process_Spacemove(f: Frame, movement_dir: Value) {
	f.vars = () => [movement_dir];
	if (live(movement_dir) === null) {
		movement_dir = 0;
	}
	return 1;
});

// /mob/living/simple_animal/hostile/construct/proc/Process_Spacemove  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/construct/proc/Process_Spacemove", function Process_Spacemove(f: Frame, movement_dir: Value) {
	f.vars = () => [movement_dir];
	if (live(movement_dir) === null) {
		movement_dir = 0;
	}
	return 1;
});

// /mob/living/simple_animal/hostile/construct/proc/narsie_act  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/construct/proc/narsie_act", function narsie_act(f: Frame) {
	return live(f.dot);
});

// /mob/living/simple_animal/hostile/construct/proc/electrocute_act  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/construct/proc/electrocute_act", function electrocute_act(f: Frame, shock_damage: Value, source: Value, siemens_coeff: Value, safety: Value, tesla_shock: Value, illusion: Value, stun: Value) {
	f.vars = () => [siemens_coeff, safety, tesla_shock, illusion, stun];
	if (live(siemens_coeff) === null) {
		siemens_coeff = 1;
	}
	if (live(safety) === null) {
		safety = 0;
	}
	if (live(tesla_shock) === null) {
		tesla_shock = 0;
	}
	if (live(illusion) === null) {
		illusion = 0;
	}
	if (live(stun) === null) {
		stun = 1;
	}
	return 0;
});

// /mob/living/simple_animal/hostile/guardian/proc/canSuicide  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/guardian/proc/canSuicide", function canSuicide(f: Frame) {
	return 0;
});

// /mob/living/simple_animal/hostile/guardian/charger/proc/charging_end  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/guardian/charger/proc/charging_end", function charging_end(f: Frame) {
	rt.setSv(f, "charging", 0);
	return f.dot;
});

// /mob/living/simple_animal/hostile/guardian/dextrous/proc/getBackSlot  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/guardian/dextrous/proc/getBackSlot", function getBackSlot(f: Frame) {
	return 20;
});

// /mob/living/simple_animal/hostile/guardian/dextrous/proc/getBeltSlot  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/guardian/dextrous/proc/getBeltSlot", function getBeltSlot(f: Frame) {
	return 20;
});

// /mob/living/simple_animal/hostile/swarmer/ai/proc/EndAction  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/swarmer/ai/proc/EndAction", function EndAction(f: Frame) {
	rt.setSv(f, "stop_automated_movement", 0);
	rt.setSv(f, "AIStatus", 1);
	return f.dot;
});

// /mob/living/simple_animal/hostile/syndicate/ranged/space/proc/Process_Spacemove  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/syndicate/ranged/space/proc/Process_Spacemove", function Process_Spacemove(f: Frame, movement_dir: Value) {
	f.vars = () => [movement_dir];
	if (live(movement_dir) === null) {
		movement_dir = 0;
	}
	return 1;
});

// /mob/living/simple_animal/hostile/syndicate/melee/space/proc/Process_Spacemove  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/syndicate/melee/space/proc/Process_Spacemove", function Process_Spacemove(f: Frame, movement_dir: Value) {
	f.vars = () => [movement_dir];
	if (live(movement_dir) === null) {
		movement_dir = 0;
	}
	return 1;
});

// /mob/living/simple_animal/hostile/carp/proc/Process_Spacemove  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/carp/proc/Process_Spacemove", function Process_Spacemove(f: Frame, movement_dir: Value) {
	f.vars = () => [movement_dir];
	if (live(movement_dir) === null) {
		movement_dir = 0;
	}
	return 1;
});

// /mob/living/simple_animal/hostile/poison/bees/proc/bee_friendly  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/poison/bees/proc/bee_friendly", function bee_friendly(f: Frame) {
	return 1;
});

// /mob/living/simple_animal/hostile/poison/bees/proc/Process_Spacemove  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/poison/bees/proc/Process_Spacemove", function Process_Spacemove(f: Frame, movement_dir: Value) {
	f.vars = () => [movement_dir];
	if (live(movement_dir) === null) {
		movement_dir = 0;
	}
	return 1;
});

// /mob/living/simple_animal/hostile/poison/bees/queen/proc/Found  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/poison/bees/queen/proc/Found", function Found(f: Frame, A: Value) {
	return 0;
});

// /mob/living/simple_animal/hostile/poison/bees/queen/proc/pollinate  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/poison/bees/queen/proc/pollinate", function pollinate(f: Frame) {
	return live(f.dot);
});

// /mob/living/simple_animal/hostile/mining_drone/proc/sentience_act  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/mining_drone/proc/sentience_act", function sentience_act(f: Frame) {
	rt.setSv(f, "AIStatus", 3);
	rt.setSv(f, "check_friendly_fire", 0);
	return f.dot;
});

// /mob/living/simple_animal/hostile/bear/proc/Process_Spacemove  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/bear/proc/Process_Spacemove", function Process_Spacemove(f: Frame, movement_dir: Value) {
	f.vars = () => [movement_dir];
	if (live(movement_dir) === null) {
		movement_dir = 0;
	}
	return 1;
});

// /mob/living/simple_animal/hostile/faithless/proc/Process_Spacemove  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/faithless/proc/Process_Spacemove", function Process_Spacemove(f: Frame, movement_dir: Value) {
	f.vars = () => [movement_dir];
	if (live(movement_dir) === null) {
		movement_dir = 0;
	}
	return 1;
});

// /mob/living/simple_animal/hostile/illusion/escape/proc/AttackingTarget  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/illusion/escape/proc/AttackingTarget", function AttackingTarget(f: Frame) {
	return 0;
});

// /mob/living/simple_animal/hostile/mushroom/proc/recovery_recharge  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/recovery_recharge", function recovery_recharge(f: Frame) {
	rt.setSv(f, "recovery_cooldown", 0);
	return f.dot;
});

// /mob/living/simple_animal/hostile/pirate/space/proc/Process_Spacemove  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/pirate/space/proc/Process_Spacemove", function Process_Spacemove(f: Frame, movement_dir: Value) {
	f.vars = () => [movement_dir];
	if (live(movement_dir) === null) {
		movement_dir = 0;
	}
	return 1;
});

// /mob/living/simple_animal/hostile/statue/proc/med_hud_set_health  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/statue/proc/med_hud_set_health", function med_hud_set_health(f: Frame) {
	return live(f.dot);
});

// /mob/living/simple_animal/hostile/statue/proc/med_hud_set_status  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/statue/proc/med_hud_set_status", function med_hud_set_status(f: Frame) {
	return live(f.dot);
});

// /mob/living/simple_animal/hostile/statue/proc/say  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/statue/proc/say", function say(f: Frame) {
	return 0;
});

// /mob/living/simple_animal/hostile/asteroid/proc/spawn_crusher_loot  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/asteroid/proc/spawn_crusher_loot", function spawn_crusher_loot(f: Frame) {
	rt.setAt(rt.sv(f, "butcher_results"), rt.sv(f, "crusher_loot"), 1);
	return f.dot;
});

// /mob/living/simple_animal/hostile/megafauna/dragon/proc/Process_Spacemove  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/proc/Process_Spacemove", function Process_Spacemove(f: Frame, movement_dir: Value) {
	f.vars = () => [movement_dir];
	if (live(movement_dir) === null) {
		movement_dir = 0;
	}
	return 1;
});

// /mob/living/simple_animal/hostile/megafauna/dragon/lesser/proc/grant_achievement  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/lesser/proc/grant_achievement", function grant_achievement(f: Frame, medaltype: Value, scoretype: Value) {
	return live(f.dot);
});

// /mob/living/simple_animal/hostile/megafauna/legion/proc/reset_charge  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/megafauna/legion/proc/reset_charge", function reset_charge(f: Frame) {
	rt.setSv(f, "ranged", 1);
	rt.setSv(f, "retreat_distance", 5);
	rt.setSv(f, "minimum_distance", 5);
	rt.setSv(f, "speed", 2);
	rt.setSv(f, "charging", 0);
	return f.dot;
});

// /mob/living/simple_animal/hostile/megafauna/legion/proc/Process_Spacemove  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/megafauna/legion/proc/Process_Spacemove", function Process_Spacemove(f: Frame, movement_dir: Value) {
	f.vars = () => [movement_dir];
	if (live(movement_dir) === null) {
		movement_dir = 0;
	}
	return 1;
});

// /mob/living/simple_animal/revenant/proc/med_hud_set_health  (_nofile:0)
rt.def("/mob/living/simple_animal/revenant/proc/med_hud_set_health", function med_hud_set_health(f: Frame) {
	return live(f.dot);
});

// /mob/living/simple_animal/revenant/proc/med_hud_set_status  (_nofile:0)
rt.def("/mob/living/simple_animal/revenant/proc/med_hud_set_status", function med_hud_set_status(f: Frame) {
	return live(f.dot);
});

// /mob/living/simple_animal/revenant/proc/Process_Spacemove  (_nofile:0)
rt.def("/mob/living/simple_animal/revenant/proc/Process_Spacemove", function Process_Spacemove(f: Frame, movement_dir: Value) {
	f.vars = () => [movement_dir];
	if (live(movement_dir) === null) {
		movement_dir = 0;
	}
	return 1;
});

// /mob/living/simple_animal/revenant/proc/ex_act  (_nofile:0)
rt.def("/mob/living/simple_animal/revenant/proc/ex_act", function ex_act(f: Frame, severity: Value, target: Value) {
	return 1;
}, false, { waitfor: false });

// /mob/living/simple_animal/revenant/proc/blob_act  (_nofile:0)
rt.def("/mob/living/simple_animal/revenant/proc/blob_act", function blob_act(f: Frame, B: Value) {
	return live(f.dot);
});

// /mob/living/simple_animal/revenant/proc/singularity_act  (_nofile:0)
rt.def("/mob/living/simple_animal/revenant/proc/singularity_act", function singularity_act(f: Frame) {
	return live(f.dot);
});

// /mob/living/simple_animal/revenant/proc/narsie_act  (_nofile:0)
rt.def("/mob/living/simple_animal/revenant/proc/narsie_act", function narsie_act(f: Frame) {
	return live(f.dot);
});

// /mob/living/simple_animal/revenant/proc/ratvar_act  (_nofile:0)
rt.def("/mob/living/simple_animal/revenant/proc/ratvar_act", function ratvar_act(f: Frame) {
	return live(f.dot);
});

// /mob/living/simple_animal/revenant/proc/death_reset  (_nofile:0)
rt.def("/mob/living/simple_animal/revenant/proc/death_reset", function death_reset(f: Frame) {
	rt.setSv(f, "revealed", 0);
	rt.setSv(f, "unreveal_time", 0);
	rt.setSv(f, "notransform", 0);
	rt.setSv(f, "unstun_time", 0);
	rt.setSv(f, "inhibited", 0);
	rt.setSv(f, "draining", 0);
	rt.setSv(f, "incorporeal_move", 3);
	rt.setSv(f, "invisibility", 50);
	rt.setSv(f, "alpha", 255);
	rt.setSv(f, "stasis", 0);
	return f.dot;
});

// /mob/living/simple_animal/bot/proc/bee_friendly  (_nofile:0)
rt.def("/mob/living/simple_animal/bot/proc/bee_friendly", function bee_friendly(f: Frame) {
	return 1;
});

// /mob/living/simple_animal/bot/proc/med_hud_set_health  (_nofile:0)
rt.def("/mob/living/simple_animal/bot/proc/med_hud_set_health", function med_hud_set_health(f: Frame) {
	return live(f.dot);
});

// /mob/living/simple_animal/bot/proc/med_hud_set_status  (_nofile:0)
rt.def("/mob/living/simple_animal/bot/proc/med_hud_set_status", function med_hud_set_status(f: Frame) {
	return live(f.dot);
});

// /mob/living/simple_animal/bot/proc/process_scan  (_nofile:0)
rt.def("/mob/living/simple_animal/bot/proc/process_scan", function process_scan(f: Frame, scan_target: Value) {
	return live(scan_target);
});

// /mob/living/simple_animal/bot/floorbot/proc/Process_Spacemove  (_nofile:0)
rt.def("/mob/living/simple_animal/bot/floorbot/proc/Process_Spacemove", function Process_Spacemove(f: Frame, movement_dir: Value) {
	f.vars = () => [movement_dir];
	if (live(movement_dir) === null) {
		movement_dir = 0;
	}
	return 1;
});

// /mob/living/simple_animal/pet/dog/corgi/puppy/void/proc/Process_Spacemove  (_nofile:0)
rt.def("/mob/living/simple_animal/pet/dog/corgi/puppy/void/proc/Process_Spacemove", function Process_Spacemove(f: Frame, movement_dir: Value) {
	f.vars = () => [movement_dir];
	if (live(movement_dir) === null) {
		movement_dir = 0;
	}
	return 1;
});

// /mob/living/simple_animal/shade/proc/Process_Spacemove  (_nofile:0)
rt.def("/mob/living/simple_animal/shade/proc/Process_Spacemove", function Process_Spacemove(f: Frame, movement_dir: Value) {
	f.vars = () => [movement_dir];
	if (live(movement_dir) === null) {
		movement_dir = 0;
	}
	return 1;
});

// /mob/living/simple_animal/cockroach/proc/ex_act  (_nofile:0)
rt.def("/mob/living/simple_animal/cockroach/proc/ex_act", function ex_act(f: Frame) {
	return live(f.dot);
}, false, { waitfor: false });

// /mob/living/brain/proc/UnarmedAttack  (_nofile:0)
rt.def("/mob/living/brain/proc/UnarmedAttack", function UnarmedAttack(f: Frame, A: Value) {
	return live(f.dot);
});

// /mob/living/brain/proc/ex_act  (_nofile:0)
rt.def("/mob/living/brain/proc/ex_act", function ex_act(f: Frame) {
	return live(f.dot);
}, false, { waitfor: false });

// /mob/living/brain/proc/blob_act  (_nofile:0)
rt.def("/mob/living/brain/proc/blob_act", function blob_act(f: Frame, B: Value) {
	return live(f.dot);
});

// /mob/living/brain/proc/get_eye_protection  (_nofile:0)
rt.def("/mob/living/brain/proc/get_eye_protection", function get_eye_protection(f: Frame) {
	return 2;
});

// /mob/living/brain/proc/get_ear_protection  (_nofile:0)
rt.def("/mob/living/brain/proc/get_ear_protection", function get_ear_protection(f: Frame) {
	return 2;
});

// /mob/living/brain/proc/flash_act  (_nofile:0)
rt.def("/mob/living/brain/proc/flash_act", function flash_act(f: Frame, intensity: Value, override_blindness_check: Value, affect_silicon: Value) {
	f.vars = () => [intensity, override_blindness_check, affect_silicon];
	if (live(intensity) === null) {
		intensity = 1;
	}
	if (live(override_blindness_check) === null) {
		override_blindness_check = 0;
	}
	if (live(affect_silicon) === null) {
		affect_silicon = 0;
	}
	return live(f.dot);
});

// /mob/living/brain/proc/handle_status_effects  (_nofile:0)
rt.def("/mob/living/brain/proc/handle_status_effects", function handle_status_effects(f: Frame) {
	return live(f.dot);
});

// /mob/living/brain/proc/handle_disabilities  (_nofile:0)
rt.def("/mob/living/brain/proc/handle_disabilities", function handle_disabilities(f: Frame) {
	return live(f.dot);
});

// /mob/living/brain/proc/lingcheck  (_nofile:0)
rt.def("/mob/living/brain/proc/lingcheck", function lingcheck(f: Frame) {
	return 0;
});

// /mob/living/brain/proc/blind_eyes  (_nofile:0)
rt.def("/mob/living/brain/proc/blind_eyes", function blind_eyes(f: Frame) {
	return live(f.dot);
});

// /mob/living/brain/proc/adjust_blindness  (_nofile:0)
rt.def("/mob/living/brain/proc/adjust_blindness", function adjust_blindness(f: Frame) {
	return live(f.dot);
});

// /mob/living/brain/proc/set_blindness  (_nofile:0)
rt.def("/mob/living/brain/proc/set_blindness", function set_blindness(f: Frame) {
	return live(f.dot);
});

// /mob/living/brain/proc/blur_eyes  (_nofile:0)
rt.def("/mob/living/brain/proc/blur_eyes", function blur_eyes(f: Frame) {
	return live(f.dot);
});

// /mob/living/brain/proc/adjust_blurriness  (_nofile:0)
rt.def("/mob/living/brain/proc/adjust_blurriness", function adjust_blurriness(f: Frame) {
	return live(f.dot);
});

// /mob/living/brain/proc/set_blurriness  (_nofile:0)
rt.def("/mob/living/brain/proc/set_blurriness", function set_blurriness(f: Frame) {
	return live(f.dot);
});

// /mob/dead/observer/proc/sync_mind  (_nofile:0)
rt.def("/mob/dead/observer/proc/sync_mind", function sync_mind(f: Frame) {
	return live(f.dot);
});

// /mob/dead/observer/proc/is_active  (_nofile:0)
rt.def("/mob/dead/observer/proc/is_active", function is_active(f: Frame) {
	return 0;
});

// /mob/dead/observer/proc/mind_initialize  (_nofile:0)
rt.def("/mob/dead/observer/proc/mind_initialize", function mind_initialize(f: Frame) {
	return live(f.dot);
});

// /mob/dead/observer/proc/is_literate  (_nofile:0)
rt.def("/mob/dead/observer/proc/is_literate", function is_literate(f: Frame) {
	return 1;
});

// /mob/dead/observer/proc/Process_Spacemove  (_nofile:0)
rt.def("/mob/dead/observer/proc/Process_Spacemove", function Process_Spacemove(f: Frame, movement_dir: Value) {
	return 1;
});

// /mob/dead/new_player/proc/ClickOn  (_nofile:0)
rt.def("/mob/dead/new_player/proc/ClickOn", function ClickOn(f: Frame) {
	return live(f.dot);
});

// /mob/dead/new_player/proc/reload_huds  (_nofile:0)
rt.def("/mob/dead/new_player/proc/reload_huds", function reload_huds(f: Frame) {
	return live(f.dot);
});

// /mob/dead/new_player/proc/add_click_catcher  (_nofile:0)
rt.def("/mob/dead/new_player/proc/add_click_catcher", function add_click_catcher(f: Frame) {
	return live(f.dot);
});

// /mob/dead/new_player/proc/sync_mind  (_nofile:0)
rt.def("/mob/dead/new_player/proc/sync_mind", function sync_mind(f: Frame) {
	return live(f.dot);
});

// /mob/dead/new_player/proc/prepare_huds  (_nofile:0)
rt.def("/mob/dead/new_player/proc/prepare_huds", function prepare_huds(f: Frame) {
	return live(f.dot);
});

// /mob/dead/new_player/proc/Move  (_nofile:0)
rt.def("/mob/dead/new_player/proc/Move", function Move(f: Frame) {
	return 0;
});

// /mob/dead/proc/dust  (_nofile:0)
rt.def("/mob/dead/proc/dust", function dust(f: Frame) {
	return live(f.dot);
});

// /mob/dead/proc/gib  (_nofile:0)
rt.def("/mob/dead/proc/gib", function gib(f: Frame) {
	return live(f.dot);
});

// /mob/dead/proc/ConveyorMove  (_nofile:0)
rt.def("/mob/dead/proc/ConveyorMove", function ConveyorMove(f: Frame) {
	return live(f.dot);
}, false, { waitfor: false });

// /mob/dead/proc/CanPass  (_nofile:0)
rt.def("/mob/dead/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	f.vars = () => [height];
	if (live(height) === null) {
		height = 0;
	}
	return 1;
});

// /mob/camera/blob/proc/emote  (_nofile:0)
rt.def("/mob/camera/blob/proc/emote", function emote(f: Frame, act: Value, m_type: Value, message: Value) {
	f.vars = () => [m_type, message];
	if (live(m_type) === null) {
		m_type = 1;
	}
	if (live(message) === null) {
		message = null;
	}
	return live(f.dot);
});

// /mob/camera/blob/proc/blob_act  (_nofile:0)
rt.def("/mob/camera/blob/proc/blob_act", function blob_act(f: Frame, B: Value) {
	return live(f.dot);
});

// /mob/camera/aiEye/proc/Move  (_nofile:0)
rt.def("/mob/camera/aiEye/proc/Move", function Move(f: Frame) {
	return 0;
});

// /mob/camera/proc/experience_pressure_difference  (_nofile:0)
rt.def("/mob/camera/proc/experience_pressure_difference", function experience_pressure_difference(f: Frame) {
	return live(f.dot);
}, false, { waitfor: false });

// /obj/proc/SkinCmd  empty
rt.def("/obj/proc/SkinCmd", undefined, false, { args: ["user", "data"] });

// /obj/proc/portableConnectorReturnAir  empty
rt.def("/obj/proc/portableConnectorReturnAir");

// /obj/proc/receive_signal  (_nofile:0)
rt.def("/obj/proc/receive_signal", function receive_signal(f: Frame, signal: Value, receive_method: Value, receive_param: Value) {
	return live(f.dot);
});

// /obj/proc/hulk_damage  (_nofile:0)
rt.def("/obj/proc/hulk_damage", function hulk_damage(f: Frame) {
	return 150;
});

// /obj/proc/reset_shocked  (_nofile:0)
rt.def("/obj/proc/reset_shocked", function reset_shocked(f: Frame) {
	rt.setSv(f, "being_shocked", 0);
	return f.dot;
});

// /obj/proc/obj_break  (_nofile:0)
rt.def("/obj/proc/obj_break", function obj_break(f: Frame, damage_flag: Value) {
	return live(f.dot);
});

// /obj/proc/container_resist  (_nofile:0)
rt.def("/obj/proc/container_resist", function container_resist(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/proc/update_icon  (_nofile:0)
rt.def("/obj/proc/update_icon", function update_icon(f: Frame) {
	return live(f.dot);
});

// /obj/proc/hide  (_nofile:0)
rt.def("/obj/proc/hide", function hide(f: Frame, h: Value) {
	return live(f.dot);
});

// /obj/proc/check_uplink_validity  (_nofile:0)
rt.def("/obj/proc/check_uplink_validity", function check_uplink_validity(f: Frame) {
	return 1;
});

// /obj/proc/on_mob_move  (_nofile:0)
rt.def("/obj/proc/on_mob_move", function on_mob_move(f: Frame, dir: Value, mob: Value, oldLoc: Value) {
	return live(f.dot);
});

// /obj/proc/on_mob_turn  (_nofile:0)
rt.def("/obj/proc/on_mob_turn", function on_mob_turn(f: Frame, dir: Value, mob: Value) {
	return live(f.dot);
});

// /obj/proc/gang_contraband_value  (_nofile:0)
rt.def("/obj/proc/gang_contraband_value", function gang_contraband_value(f: Frame) {
	return 0;
});

// /obj/proc/IsSpecialAssembly  (_nofile:0)
rt.def("/obj/proc/IsSpecialAssembly", function IsSpecialAssembly(f: Frame) {
	return 0;
});

// /obj/proc/IsAssemblyHolder  (_nofile:0)
rt.def("/obj/proc/IsAssemblyHolder", function IsAssemblyHolder(f: Frame) {
	return 0;
});

// /obj/item/proc/CanItemAutoclick  empty
rt.def("/obj/item/proc/CanItemAutoclick", undefined, false, { args: ["object", "location", "params"] });

// /obj/item/proc/on_mob_death  empty
rt.def("/obj/item/proc/on_mob_death", undefined, false, { args: ["L", "gibbed"] });

// /obj/item/proc/canItemMouseDown  (_nofile:0)
rt.def("/obj/item/proc/canItemMouseDown", function canItemMouseDown(f: Frame, object: Value, location: Value, params: Value) {
	if (!truthy(rt.sv(f, "canMouseDown"))) return f.dot;
	return live(f.src);
});

// /obj/item/proc/onMouseDown  (_nofile:0)
rt.def("/obj/item/proc/onMouseDown", function onMouseDown(f: Frame, object: Value, location: Value, params: Value, mob: Value) {
	return live(f.dot);
});

// /obj/item/proc/onMouseUp  (_nofile:0)
rt.def("/obj/item/proc/onMouseUp", function onMouseUp(f: Frame, object: Value, location: Value, params: Value, mob: Value) {
	return live(f.dot);
});

// /obj/item/proc/onMouseDrag  (_nofile:0)
rt.def("/obj/item/proc/onMouseDrag", function onMouseDrag(f: Frame, src_object: Value, over_object: Value, src_location: Value, over_location: Value, params: Value, mob: Value) {
	return live(f.dot);
});

// /obj/item/proc/attack_self  (_nofile:0)
rt.def("/obj/item/proc/attack_self", function attack_self(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/item/proc/pre_attackby  (_nofile:0)
rt.def("/obj/item/proc/pre_attackby", function pre_attackby(f: Frame, A: Value, user: Value, params: Value) {
	return 1;
});

// /obj/item/proc/afterattack  (_nofile:0)
rt.def("/obj/item/proc/afterattack", function afterattack(f: Frame, target: Value, user: Value, proximity_flag: Value, click_parameters: Value) {
	return live(f.dot);
});

// /obj/item/proc/autolathe_crafted  (_nofile:0)
rt.def("/obj/item/proc/autolathe_crafted", function autolathe_crafted(f: Frame, A: Value) {
	return live(f.dot);
});

// /obj/item/proc/suicide_act  (_nofile:0)
rt.def("/obj/item/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/item/proc/talk_into  (_nofile:0)
rt.def("/obj/item/proc/talk_into", function talk_into(f: Frame, M: Value, input: Value, channel: Value, spans: Value, language: Value) {
	return 3;
});

// /obj/item/proc/pickup  (_nofile:0)
rt.def("/obj/item/proc/pickup", function pickup(f: Frame, user: Value) {
	rt.setSv(f, "in_inventory", 1);
	return live(f.dot);
});

// /obj/item/proc/on_exit_storage  (_nofile:0)
rt.def("/obj/item/proc/on_exit_storage", function on_exit_storage(f: Frame, S: Value) {
	return live(f.dot);
});

// /obj/item/proc/on_enter_storage  (_nofile:0)
rt.def("/obj/item/proc/on_enter_storage", function on_enter_storage(f: Frame, S: Value) {
	return live(f.dot);
});

// /obj/item/proc/on_found  (_nofile:0)
rt.def("/obj/item/proc/on_found", function on_found(f: Frame, finder: Value) {
	return live(f.dot);
});

// /obj/item/proc/IsReflect  (_nofile:0)
rt.def("/obj/item/proc/IsReflect", function IsReflect(f: Frame, def_zone: Value) {
	return 0;
});

// /obj/item/proc/is_hot  (_nofile:0)
rt.def("/obj/item/proc/is_hot", function is_hot(f: Frame) {
	return rt.sv(f, "heat");
});

// /obj/item/proc/is_sharp  (_nofile:0)
rt.def("/obj/item/proc/is_sharp", function is_sharp(f: Frame) {
	return rt.sv(f, "sharpness");
});

// /obj/item/proc/get_held_item_speechspans  (_nofile:0)
rt.def("/obj/item/proc/get_held_item_speechspans", function get_held_item_speechspans(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/item/proc/hitby  (_nofile:0)
rt.def("/obj/item/proc/hitby", function hitby(f: Frame, AM: Value) {
	return live(f.dot);
});

// /obj/item/proc/attack_hulk  (_nofile:0)
rt.def("/obj/item/proc/attack_hulk", function attack_hulk(f: Frame, user: Value) {
	return 0;
});

// /obj/item/proc/attack_animal  (_nofile:0)
rt.def("/obj/item/proc/attack_animal", function attack_animal(f: Frame, M: Value) {
	return 0;
});

// /obj/item/proc/mech_melee_attack  (_nofile:0)
rt.def("/obj/item/proc/mech_melee_attack", function mech_melee_attack(f: Frame, M: Value) {
	return 0;
});

// /obj/item/proc/can_be_package_wrapped  (_nofile:0)
rt.def("/obj/item/proc/can_be_package_wrapped", function can_be_package_wrapped(f: Frame) {
	return 1;
});

// /obj/item/proc/negates_gravity  (_nofile:0)
rt.def("/obj/item/proc/negates_gravity", function negates_gravity(f: Frame) {
	return 0;
});

// /obj/item/weapon/gun/proc/swarmer_act  (_nofile:0)
rt.def("/obj/item/weapon/gun/proc/swarmer_act", function swarmer_act(f: Frame) {
	return 0;
});

// /obj/item/weapon/gun/proc/process_chamber  (_nofile:0)
rt.def("/obj/item/weapon/gun/proc/process_chamber", function process_chamber(f: Frame) {
	return 0;
});

// /obj/item/weapon/gun/proc/can_shoot  (_nofile:0)
rt.def("/obj/item/weapon/gun/proc/can_shoot", function can_shoot(f: Frame) {
	return 1;
});

// /obj/item/weapon/gun/proc/recharge_newshot  (_nofile:0)
rt.def("/obj/item/weapon/gun/proc/recharge_newshot", function recharge_newshot(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/gun/magic/proc/can_shoot  (_nofile:0)
rt.def("/obj/item/weapon/gun/magic/proc/can_shoot", function can_shoot(f: Frame) {
	return rt.sv(f, "charges");
});

// /obj/item/weapon/gun/magic/proc/update_icon  (_nofile:0)
rt.def("/obj/item/weapon/gun/magic/proc/update_icon", function update_icon(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/gun/magic/staff/healing/proc/handle_suicide  (_nofile:0)
rt.def("/obj/item/weapon/gun/magic/staff/healing/proc/handle_suicide", function handle_suicide(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/gun/energy/proc/get_cell  (_nofile:0)
rt.def("/obj/item/weapon/gun/energy/proc/get_cell", function get_cell(f: Frame) {
	return rt.sv(f, "cell");
});

// /obj/item/weapon/gun/energy/laser/chameleon/proc/emp_act  (_nofile:0)
rt.def("/obj/item/weapon/gun/energy/laser/chameleon/proc/emp_act", function emp_act(f: Frame, severity: Value) {
	return live(f.dot);
});

// /obj/item/weapon/gun/energy/laser/cyborg/proc/emp_act  (_nofile:0)
rt.def("/obj/item/weapon/gun/energy/laser/cyborg/proc/emp_act", function emp_act(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/gun/energy/laser/instakill/proc/emp_act  (_nofile:0)
rt.def("/obj/item/weapon/gun/energy/laser/instakill/proc/emp_act", function emp_act(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/gun/energy/chrono_gun/proc/update_icon  (_nofile:0)
rt.def("/obj/item/weapon/gun/energy/chrono_gun/proc/update_icon", function update_icon(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/gun/energy/kinetic_accelerator/proc/emp_act  (_nofile:0)
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/proc/emp_act", function emp_act(f: Frame, severity: Value) {
	return live(f.dot);
});

// /obj/item/weapon/gun/energy/pulse/proc/emp_act  (_nofile:0)
rt.def("/obj/item/weapon/gun/energy/pulse/proc/emp_act", function emp_act(f: Frame, severity: Value) {
	return live(f.dot);
});

// /obj/item/weapon/gun/energy/ionrifle/proc/emp_act  (_nofile:0)
rt.def("/obj/item/weapon/gun/energy/ionrifle/proc/emp_act", function emp_act(f: Frame, severity: Value) {
	return live(f.dot);
});

// /obj/item/weapon/gun/energy/plasmacutter/proc/update_icon  (_nofile:0)
rt.def("/obj/item/weapon/gun/energy/plasmacutter/proc/update_icon", function update_icon(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/gun/energy/printer/proc/update_icon  (_nofile:0)
rt.def("/obj/item/weapon/gun/energy/printer/proc/update_icon", function update_icon(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/gun/energy/printer/proc/emp_act  (_nofile:0)
rt.def("/obj/item/weapon/gun/energy/printer/proc/emp_act", function emp_act(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/gun/ballistic/automatic/speargun/proc/update_icon  (_nofile:0)
rt.def("/obj/item/weapon/gun/ballistic/automatic/speargun/proc/update_icon", function update_icon(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/gun/ballistic/automatic/speargun/proc/attack_self  (_nofile:0)
rt.def("/obj/item/weapon/gun/ballistic/automatic/speargun/proc/attack_self", function attack_self(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/gun/ballistic/automatic/atlauncher/proc/attack_self  (_nofile:0)
rt.def("/obj/item/weapon/gun/ballistic/automatic/atlauncher/proc/attack_self", function attack_self(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/gun/ballistic/shotgun/proc/chamber_round  (_nofile:0)
rt.def("/obj/item/weapon/gun/ballistic/shotgun/proc/chamber_round", function chamber_round(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/gun/ballistic/shotgun/boltaction/enchanted/arcane_barrage/proc/discard_gun  (_nofile:0)
rt.def("/obj/item/weapon/gun/ballistic/shotgun/boltaction/enchanted/arcane_barrage/proc/discard_gun", function discard_gun(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/item/weapon/gun/ballistic/shotgun/boltaction/enchanted/proc/attack_self  (_nofile:0)
rt.def("/obj/item/weapon/gun/ballistic/shotgun/boltaction/enchanted/proc/attack_self", function attack_self(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/gun/ballistic/bow/proc/shoot_with_empty_chamber  (_nofile:0)
rt.def("/obj/item/weapon/gun/ballistic/bow/proc/shoot_with_empty_chamber", function shoot_with_empty_chamber(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/item/weapon/gun/ballistic/minigun/proc/attack_self  (_nofile:0)
rt.def("/obj/item/weapon/gun/ballistic/minigun/proc/attack_self", function attack_self(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/item/weapon/gun/ballistic/revolver/grenadelauncher/cyborg/proc/attack_self  (_nofile:0)
rt.def("/obj/item/weapon/gun/ballistic/revolver/grenadelauncher/cyborg/proc/attack_self", function attack_self(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/gun/medbeam/proc/on_beam_hit  (_nofile:0)
rt.def("/obj/item/weapon/gun/medbeam/proc/on_beam_hit", function on_beam_hit(f: Frame, target: Value) {
	return live(f.dot);
});

// /obj/item/weapon/gun/medbeam/proc/on_beam_release  (_nofile:0)
rt.def("/obj/item/weapon/gun/medbeam/proc/on_beam_release", function on_beam_release(f: Frame, target: Value) {
	return live(f.dot);
});

// /obj/item/weapon/storage/proc/PopulateContents  empty
rt.def("/obj/item/weapon/storage/proc/PopulateContents");

// /obj/item/weapon/storage/proc/can_be_package_wrapped  (_nofile:0)
rt.def("/obj/item/weapon/storage/proc/can_be_package_wrapped", function can_be_package_wrapped(f: Frame) {
	return 0;
});

// /obj/item/weapon/storage/belt/military/gang/proc/gang_contraband_value  (_nofile:0)
rt.def("/obj/item/weapon/storage/belt/military/gang/proc/gang_contraband_value", function gang_contraband_value(f: Frame) {
	return 4;
});

// /obj/item/weapon/storage/box/proc/can_be_package_wrapped  (_nofile:0)
rt.def("/obj/item/weapon/storage/box/proc/can_be_package_wrapped", function can_be_package_wrapped(f: Frame) {
	return 1;
});

// /obj/item/weapon/storage/bag/trash/cyborg/proc/janicart_insert  (_nofile:0)
rt.def("/obj/item/weapon/storage/bag/trash/cyborg/proc/janicart_insert", function janicart_insert(f: Frame, user: Value, J: Value) {
	return live(f.dot);
});

// /obj/item/weapon/storage/fancy/candle_box/proc/attack_self  (_nofile:0)
rt.def("/obj/item/weapon/storage/fancy/candle_box/proc/attack_self", function attack_self(f: Frame, mob_user: Value) {
	return live(f.dot);
});

// /obj/item/weapon/storage/wallet/proc/GetID  (_nofile:0)
rt.def("/obj/item/weapon/storage/wallet/proc/GetID", function GetID(f: Frame) {
	return rt.sv(f, "front_id");
});

// /obj/item/weapon/storage/pod/proc/attackby  (_nofile:0)
rt.def("/obj/item/weapon/storage/pod/proc/attackby", function attackby(f: Frame, W: Value, user: Value, params: Value) {
	return live(f.dot);
});

// /obj/item/weapon/twohanded/dualsaber/toy/proc/hit_reaction  (_nofile:0)
rt.def("/obj/item/weapon/twohanded/dualsaber/toy/proc/hit_reaction", function hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	f.vars = () => [attack_text, final_block_chance, damage, attack_type];
	if (live(attack_text) === null) {
		attack_text = "the attack";
	}
	if (live(final_block_chance) === null) {
		final_block_chance = 0;
	}
	if (live(damage) === null) {
		damage = 0;
	}
	if (live(attack_type) === null) {
		attack_type = 1;
	}
	return 0;
});

// /obj/item/weapon/twohanded/dualsaber/toy/proc/IsReflect  (_nofile:0)
rt.def("/obj/item/weapon/twohanded/dualsaber/toy/proc/IsReflect", function IsReflect(f: Frame) {
	return 0;
});

// /obj/item/weapon/twohanded/dualsaber/proc/IsReflect  (_nofile:0)
rt.def("/obj/item/weapon/twohanded/dualsaber/proc/IsReflect", function IsReflect(f: Frame) {
	if (!truthy(rt.sv(f, "wielded"))) return f.dot;
	return 1;
});

// /obj/item/weapon/twohanded/proc/update_icon  (_nofile:0)
rt.def("/obj/item/weapon/twohanded/proc/update_icon", function update_icon(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/twohanded/required/proc/attack_self  (_nofile:0)
rt.def("/obj/item/weapon/twohanded/required/proc/attack_self", function attack_self(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/antag_spawner/proc/spawn_antag  (_nofile:0)
rt.def("/obj/item/weapon/antag_spawner/proc/spawn_antag", function spawn_antag(f: Frame, C: Value, _T: Value, type: Value) {
	f.vars = () => [type];
	if (live(type) === null) {
		type = "";
	}
	return live(f.dot);
});

// /obj/item/weapon/antag_spawner/proc/equip_antag  (_nofile:0)
rt.def("/obj/item/weapon/antag_spawner/proc/equip_antag", function equip_antag(f: Frame, target: Value) {
	return live(f.dot);
});

// /obj/item/weapon/melee/arm_blade/false/proc/afterattack  (_nofile:0)
rt.def("/obj/item/weapon/melee/arm_blade/false/proc/afterattack", function afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	return live(f.dot);
});

// /obj/item/weapon/melee/baton/proc/get_cell  (_nofile:0)
rt.def("/obj/item/weapon/melee/baton/proc/get_cell", function get_cell(f: Frame) {
	return rt.sv(f, "cell");
});

// /obj/item/weapon/melee/energy/proc/add_blood  (_nofile:0)
rt.def("/obj/item/weapon/melee/energy/proc/add_blood", function add_blood(f: Frame, blood_dna: Value) {
	return 0;
});

// /obj/item/weapon/melee/energy/sword/cyborg/saw/proc/hit_reaction  (_nofile:0)
rt.def("/obj/item/weapon/melee/energy/sword/cyborg/saw/proc/hit_reaction", function hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	f.vars = () => [attack_text, final_block_chance, damage, attack_type];
	if (live(attack_text) === null) {
		attack_text = "the attack";
	}
	if (live(final_block_chance) === null) {
		final_block_chance = 0;
	}
	if (live(damage) === null) {
		damage = 0;
	}
	if (live(attack_type) === null) {
		attack_type = 1;
	}
	return 0;
});

// /obj/item/weapon/melee/energy/blade/proc/attack_self  (_nofile:0)
rt.def("/obj/item/weapon/melee/energy/blade/proc/attack_self", function attack_self(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/item/weapon/melee/supermatter_sword/proc/add_blood  (_nofile:0)
rt.def("/obj/item/weapon/melee/supermatter_sword/proc/add_blood", function add_blood(f: Frame, blood_dna: Value) {
	return 0;
});

// /obj/item/weapon/shield/energy/proc/hit_reaction  (_nofile:0)
rt.def("/obj/item/weapon/shield/energy/proc/hit_reaction", function hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	f.vars = () => [attack_text, final_block_chance, damage, attack_type];
	if (live(attack_text) === null) {
		attack_text = "the attack";
	}
	if (live(final_block_chance) === null) {
		final_block_chance = 0;
	}
	if (live(damage) === null) {
		damage = 0;
	}
	if (live(attack_type) === null) {
		attack_type = 1;
	}
	return 0;
});

// /obj/item/weapon/shield/energy/proc/IsReflect  (_nofile:0)
rt.def("/obj/item/weapon/shield/energy/proc/IsReflect", function IsReflect(f: Frame) {
	return rt.sv(f, "active");
});

// /obj/item/weapon/stock_parts/cell/proc/get_cell  (_nofile:0)
rt.def("/obj/item/weapon/stock_parts/cell/proc/get_cell", function get_cell(f: Frame) {
	return live(f.src);
});

// /obj/item/weapon/stock_parts/cell/infinite/proc/use  (_nofile:0)
rt.def("/obj/item/weapon/stock_parts/cell/infinite/proc/use", function use(f: Frame) {
	return 1;
});

// /obj/item/weapon/stock_parts/cell/infinite/abductor/proc/update_icon  (_nofile:0)
rt.def("/obj/item/weapon/stock_parts/cell/infinite/abductor/proc/update_icon", function update_icon(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/stock_parts/cell/emproof/proc/emp_act  (_nofile:0)
rt.def("/obj/item/weapon/stock_parts/cell/emproof/proc/emp_act", function emp_act(f: Frame, severity: Value) {
	return live(f.dot);
});

// /obj/item/weapon/stock_parts/cell/emproof/proc/corrupt  (_nofile:0)
rt.def("/obj/item/weapon/stock_parts/cell/emproof/proc/corrupt", function corrupt(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/stock_parts/cell/beam_rifle/proc/corrupt  (_nofile:0)
rt.def("/obj/item/weapon/stock_parts/cell/beam_rifle/proc/corrupt", function corrupt(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/restraints/handcuffs/cable/zipties/used/proc/attack  (_nofile:0)
rt.def("/obj/item/weapon/restraints/handcuffs/cable/zipties/used/proc/attack", function attack(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/reagent_containers/food/drinks/bottle/absinthe/premium/proc/redact  (_nofile:0)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/absinthe/premium/proc/redact", function redact(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/reagent_containers/food/snacks/proc/attack_self  (_nofile:0)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/proc/attack_self", function attack_self(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/item/weapon/reagent_containers/food/snacks/proc/afterattack  (_nofile:0)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/proc/afterattack", function afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	return live(f.dot);
});

// /obj/item/weapon/reagent_containers/food/condiment/pack/proc/attack  (_nofile:0)
rt.def("/obj/item/weapon/reagent_containers/food/condiment/pack/proc/attack", function attack(f: Frame, M: Value, user: Value, def_zone: Value) {
	return live(f.dot);
});

// /obj/item/weapon/reagent_containers/spray/mister/proc/attack_self  (_nofile:0)
rt.def("/obj/item/weapon/reagent_containers/spray/mister/proc/attack_self", function attack_self(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/reagent_containers/spray/waterflower/proc/attack_self  (_nofile:0)
rt.def("/obj/item/weapon/reagent_containers/spray/waterflower/proc/attack_self", function attack_self(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/item/weapon/reagent_containers/proc/afterattack  (_nofile:0)
rt.def("/obj/item/weapon/reagent_containers/proc/afterattack", function afterattack(f: Frame, target: Value, user: Value, flag: Value) {
	return live(f.dot);
});

// /obj/item/weapon/reagent_containers/borghypo/borgshaker/proc/attack  (_nofile:0)
rt.def("/obj/item/weapon/reagent_containers/borghypo/borgshaker/proc/attack", function attack(f: Frame, M: Value, user: Value) {
	return live(f.dot);
});

// /obj/item/weapon/reagent_containers/pill/patch/proc/afterattack  (_nofile:0)
rt.def("/obj/item/weapon/reagent_containers/pill/patch/proc/afterattack", function afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	return live(f.dot);
});

// /obj/item/weapon/reagent_containers/pill/proc/attack_self  (_nofile:0)
rt.def("/obj/item/weapon/reagent_containers/pill/proc/attack_self", function attack_self(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/item/weapon/reagent_containers/syringe/proc/attackby  (_nofile:0)
rt.def("/obj/item/weapon/reagent_containers/syringe/proc/attackby", function attackby(f: Frame, I: Value, user: Value, params: Value) {
	return live(f.dot);
});

// /obj/item/weapon/paper/abductor/proc/update_icon  (_nofile:0)
rt.def("/obj/item/weapon/paper/abductor/proc/update_icon", function update_icon(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/paper/abductor/proc/AltClick  (_nofile:0)
rt.def("/obj/item/weapon/paper/abductor/proc/AltClick", function AltClick(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/paper/pamphlet/proc/update_icon  (_nofile:0)
rt.def("/obj/item/weapon/paper/pamphlet/proc/update_icon", function update_icon(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/paper/crumpled/proc/update_icon  (_nofile:0)
rt.def("/obj/item/weapon/paper/crumpled/proc/update_icon", function update_icon(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/paper/guardian/proc/update_icon  (_nofile:0)
rt.def("/obj/item/weapon/paper/guardian/proc/update_icon", function update_icon(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/paper/contract/proc/update_text  (_nofile:0)
rt.def("/obj/item/weapon/paper/contract/proc/update_text", function update_text(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/paper/contract/proc/update_icon  (_nofile:0)
rt.def("/obj/item/weapon/paper/contract/proc/update_icon", function update_icon(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/paper/contract/infernal/revive/proc/resetcooldown  (_nofile:0)
rt.def("/obj/item/weapon/paper/contract/infernal/revive/proc/resetcooldown", function resetcooldown(f: Frame) {
	rt.setSv(f, "cooldown", 0);
	return f.dot;
});

// /obj/item/weapon/spellbook/oneuse/proc/attackby  (_nofile:0)
rt.def("/obj/item/weapon/spellbook/oneuse/proc/attackby", function attackby(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/grenade/plastic/c4/proc/attack  (_nofile:0)
rt.def("/obj/item/weapon/grenade/plastic/c4/proc/attack", function attack(f: Frame, M: Value, user: Value, def_zone: Value) {
	return live(f.dot);
});

// /obj/item/weapon/claymore/highlander/proc/IsReflect  (_nofile:0)
rt.def("/obj/item/weapon/claymore/highlander/proc/IsReflect", function IsReflect(f: Frame) {
	return 1;
});

// /obj/item/weapon/cartridge/virus/proc/send_virus  (_nofile:0)
rt.def("/obj/item/weapon/cartridge/virus/proc/send_virus", function send_virus(f: Frame, target: Value, U: Value) {
	return live(f.dot);
});

// /obj/item/weapon/ore/proc/ex_act  (_nofile:0)
rt.def("/obj/item/weapon/ore/proc/ex_act", function ex_act(f: Frame) {
	return live(f.dot);
}, false, { waitfor: false });

// /obj/item/weapon/card/emag/proc/attack  (_nofile:0)
rt.def("/obj/item/weapon/card/emag/proc/attack", function attack(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/card/id/proc/GetAccess  (_nofile:0)
rt.def("/obj/item/weapon/card/id/proc/GetAccess", function GetAccess(f: Frame) {
	return rt.sv(f, "access");
});

// /obj/item/weapon/card/id/proc/GetID  (_nofile:0)
rt.def("/obj/item/weapon/card/id/proc/GetID", function GetID(f: Frame) {
	return live(f.src);
});

// /obj/item/weapon/defibrillator/proc/get_cell  (_nofile:0)
rt.def("/obj/item/weapon/defibrillator/proc/get_cell", function get_cell(f: Frame) {
	return rt.sv(f, "cell");
});

// /obj/item/weapon/dice/d100/proc/update_icon  (_nofile:0)
rt.def("/obj/item/weapon/dice/d100/proc/update_icon", function update_icon(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/dice/eightbd20/proc/update_icon  (_nofile:0)
rt.def("/obj/item/weapon/dice/eightbd20/proc/update_icon", function update_icon(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/dice/fourdd6/proc/update_icon  (_nofile:0)
rt.def("/obj/item/weapon/dice/fourdd6/proc/update_icon", function update_icon(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/his_grace/proc/CtrlClick  (_nofile:0)
rt.def("/obj/item/weapon/his_grace/proc/CtrlClick", function CtrlClick(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/item/weapon/holosign_creator/proc/attack  (_nofile:0)
rt.def("/obj/item/weapon/holosign_creator/proc/attack", function attack(f: Frame, M: Value, user: Value) {
	return live(f.dot);
});

// /obj/item/weapon/inducer/proc/get_cell  (_nofile:0)
rt.def("/obj/item/weapon/inducer/proc/get_cell", function get_cell(f: Frame) {
	return rt.sv(f, "cell");
});

// /obj/item/weapon/mop/cyborg/proc/janicart_insert  (_nofile:0)
rt.def("/obj/item/weapon/mop/cyborg/proc/janicart_insert", function janicart_insert(f: Frame, user: Value, J: Value) {
	return live(f.dot);
});

// /obj/item/weapon/pneumatic_cannon/proc/CanItemAutoclick  (_nofile:0)
rt.def("/obj/item/weapon/pneumatic_cannon/proc/CanItemAutoclick", function CanItemAutoclick(f: Frame) {
	return rt.sv(f, "automatic");
});

// /obj/item/weapon/cookiesynth/proc/attackby  (_nofile:0)
rt.def("/obj/item/weapon/cookiesynth/proc/attackby", function attackby(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/weldingtool/proc/isOn  (_nofile:0)
rt.def("/obj/item/weapon/weldingtool/proc/isOn", function isOn(f: Frame) {
	return rt.sv(f, "welding");
});

// /obj/item/weapon/weldingtool/largetank/proc/flamethrower_screwdriver  (_nofile:0)
rt.def("/obj/item/weapon/weldingtool/largetank/proc/flamethrower_screwdriver", function flamethrower_screwdriver(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/weldingtool/mini/proc/flamethrower_screwdriver  (_nofile:0)
rt.def("/obj/item/weapon/weldingtool/mini/proc/flamethrower_screwdriver", function flamethrower_screwdriver(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/implant/proc/trigger  (_nofile:0)
rt.def("/obj/item/weapon/implant/proc/trigger", function trigger(f: Frame, emote: Value, source: Value) {
	return live(f.dot);
});

// /obj/item/weapon/implant/proc/activate  (_nofile:0)
rt.def("/obj/item/weapon/implant/proc/activate", function activate(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/implant/proc/can_be_implanted_in  (_nofile:0)
rt.def("/obj/item/weapon/implant/proc/can_be_implanted_in", function can_be_implanted_in(f: Frame, target: Value) {
	return 1;
});

// /obj/item/weapon/tank/jetpack/suit/proc/attack_self  (_nofile:0)
rt.def("/obj/item/weapon/tank/jetpack/suit/proc/attack_self", function attack_self(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/tank/proc/return_air  (_nofile:0)
rt.def("/obj/item/weapon/tank/proc/return_air", function return_air(f: Frame) {
	return rt.sv(f, "air_contents");
});

// /obj/item/weapon/grown/proc/add_juice  (_nofile:0)
rt.def("/obj/item/weapon/grown/proc/add_juice", function add_juice(f: Frame) {
	if (truthy(rt.sv(f, "reagents"))) {
		return 1;
	}
	return 0;
});

// /obj/item/weapon/grown/proc/microwave_act  (_nofile:0)
rt.def("/obj/item/weapon/grown/proc/microwave_act", function microwave_act(f: Frame, M: Value) {
	return live(f.dot);
});

// /obj/item/weapon/computer_hardware/proc/can_install  (_nofile:0)
rt.def("/obj/item/weapon/computer_hardware/proc/can_install", function can_install(f: Frame, M: Value, user: Value) {
	f.vars = () => [user];
	if (live(user) === null) {
		user = null;
	}
	return rt.sv(f, "can_install");
});

// /obj/item/weapon/computer_hardware/proc/on_install  (_nofile:0)
rt.def("/obj/item/weapon/computer_hardware/proc/on_install", function on_install(f: Frame, M: Value, user: Value) {
	f.vars = () => [user];
	if (live(user) === null) {
		user = null;
	}
	return live(f.dot);
});

// /obj/item/weapon/computer_hardware/proc/try_insert  (_nofile:0)
rt.def("/obj/item/weapon/computer_hardware/proc/try_insert", function try_insert(f: Frame, I: Value, user: Value) {
	f.vars = () => [user];
	if (live(user) === null) {
		user = null;
	}
	return 0;
});

// /obj/item/weapon/computer_hardware/proc/try_eject  (_nofile:0)
rt.def("/obj/item/weapon/computer_hardware/proc/try_eject", function try_eject(f: Frame, slot: Value, user: Value, forced: Value) {
	f.vars = () => [slot, user, forced];
	if (live(slot) === null) {
		slot = 0;
	}
	if (live(user) === null) {
		user = null;
	}
	if (live(forced) === null) {
		forced = 0;
	}
	return 0;
});

// /obj/item/weapon/computer_hardware/hard_drive/portable/proc/install_default_programs  (_nofile:0)
rt.def("/obj/item/weapon/computer_hardware/hard_drive/portable/proc/install_default_programs", function install_default_programs(f: Frame) {
	return live(f.dot);
});

// /obj/item/weapon/computer_hardware/recharger/proc/use_power  (_nofile:0)
rt.def("/obj/item/weapon/computer_hardware/recharger/proc/use_power", function use_power(f: Frame, amount: Value, charging: Value) {
	f.vars = () => [charging];
	if (live(charging) === null) {
		charging = 0;
	}
	if (truthy(live(charging))) {
		return 1;
	}
	return 0;
});

// /obj/item/weapon/computer_hardware/recharger/lambda/proc/use_power  (_nofile:0)
rt.def("/obj/item/weapon/computer_hardware/recharger/lambda/proc/use_power", function use_power(f: Frame, amount: Value, charging: Value) {
	f.vars = () => [charging];
	if (live(charging) === null) {
		charging = 0;
	}
	return 1;
});

// /obj/item/tk_grab/proc/attack_hand  (_nofile:0)
rt.def("/obj/item/tk_grab/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/item/tk_grab/proc/attack  (_nofile:0)
rt.def("/obj/item/tk_grab/proc/attack", function attack(f: Frame, M: Value, user: Value, def_zone: Value) {
	return live(f.dot);
});

// /obj/item/clothing/gloves/proc/Touch  (_nofile:0)
rt.def("/obj/item/clothing/gloves/proc/Touch", function Touch(f: Frame, A: Value, proximity: Value) {
	return 0;
});

// /obj/item/clothing/gloves/gang/proc/gang_contraband_value  (_nofile:0)
rt.def("/obj/item/clothing/gloves/gang/proc/gang_contraband_value", function gang_contraband_value(f: Frame) {
	return 3;
});

// /obj/item/clothing/suit/space/space_ninja/proc/get_cell  (_nofile:0)
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/get_cell", function get_cell(f: Frame) {
	return rt.sv(f, "cell");
});

// /obj/item/clothing/suit/space/space_ninja/proc/grant_ninja_verbs  (_nofile:0)
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/grant_ninja_verbs", function grant_ninja_verbs(f: Frame) {
	rt.setSv(f, "s_initialized", 1);
	rt.setSv(f, "slowdown", 0);
	return f.dot;
});

// /obj/item/clothing/suit/armor/reactive/table/proc/emp_act  (_nofile:0)
rt.def("/obj/item/clothing/suit/armor/reactive/table/proc/emp_act", function emp_act(f: Frame) {
	return live(f.dot);
});

// /obj/item/clothing/head/helmet/space/hardsuit/captain/proc/attack_self  (_nofile:0)
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/captain/proc/attack_self", function attack_self(f: Frame) {
	return live(f.dot);
});

// /obj/item/clothing/head/helmet/space/hardsuit/shielded/wizard/proc/attack_self  (_nofile:0)
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/shielded/wizard/proc/attack_self", function attack_self(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/item/clothing/head/helmet/space/hardsuit/deathsquad/proc/attack_self  (_nofile:0)
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/deathsquad/proc/attack_self", function attack_self(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/item/clothing/head/collectable/petehat/gang/proc/gang_contraband_value  (_nofile:0)
rt.def("/obj/item/clothing/head/collectable/petehat/gang/proc/gang_contraband_value", function gang_contraband_value(f: Frame) {
	return 4;
});

// /obj/item/clothing/shoes/clockwork/proc/negates_gravity  (_nofile:0)
rt.def("/obj/item/clothing/shoes/clockwork/proc/negates_gravity", function negates_gravity(f: Frame) {
	return 1;
});

// /obj/item/clothing/shoes/gang/proc/gang_contraband_value  (_nofile:0)
rt.def("/obj/item/clothing/shoes/gang/proc/gang_contraband_value", function gang_contraband_value(f: Frame) {
	return 6;
});

// /obj/item/clothing/mask/gskull/proc/gang_contraband_value  (_nofile:0)
rt.def("/obj/item/clothing/mask/gskull/proc/gang_contraband_value", function gang_contraband_value(f: Frame) {
	return 5;
});

// /obj/item/clothing/mask/proc/speechModification  (_nofile:0)
rt.def("/obj/item/clothing/mask/proc/speechModification", function speechModification(f: Frame, message: Value) {
	return live(message);
});

// /obj/item/clothing/mask/facehugger/toy/proc/Die  (_nofile:0)
rt.def("/obj/item/clothing/mask/facehugger/toy/proc/Die", function Die(f: Frame) {
	return live(f.dot);
});

// /obj/item/clothing/mask/facehugger/proc/detach  (_nofile:0)
rt.def("/obj/item/clothing/mask/facehugger/proc/detach", function detach(f: Frame) {
	rt.setSv(f, "attached", 0);
	return f.dot;
});

// /obj/item/clothing/neck/necklace/dope/proc/gang_contraband_value  (_nofile:0)
rt.def("/obj/item/clothing/neck/necklace/dope/proc/gang_contraband_value", function gang_contraband_value(f: Frame) {
	return 2;
});

// /obj/item/clothing/accessory/proc/on_uniform_equip  (_nofile:0)
rt.def("/obj/item/clothing/accessory/proc/on_uniform_equip", function on_uniform_equip(f: Frame, U: Value, user: Value) {
	return live(f.dot);
});

// /obj/item/clothing/accessory/proc/on_uniform_dropped  (_nofile:0)
rt.def("/obj/item/clothing/accessory/proc/on_uniform_dropped", function on_uniform_dropped(f: Frame, U: Value, user: Value) {
	return live(f.dot);
});

// /obj/item/ammo_casing/shotgun/dart/proc/attackby  (_nofile:0)
rt.def("/obj/item/ammo_casing/shotgun/dart/proc/attackby", function attackby(f: Frame) {
	return live(f.dot);
});

// /obj/item/projectile/beam/emitter/proc/singularity_pull  (_nofile:0)
rt.def("/obj/item/projectile/beam/emitter/proc/singularity_pull", function singularity_pull(f: Frame) {
	return live(f.dot);
});

// /obj/item/projectile/beam/wormhole/proc/New  (_nofile:0)
rt.def("/obj/item/projectile/beam/wormhole/proc/New", function New(f: Frame, casing: Value) {
	if (!truthy(live(casing))) return f.dot;
	rt.setSv(f, "gun", rt.fv(f, "gun", live(casing)));
	return f.dot;
});

// /obj/item/projectile/proc/prehit  (_nofile:0)
rt.def("/obj/item/projectile/proc/prehit", function prehit(f: Frame, target: Value) {
	return 1;
});

// /obj/item/projectile/proc/Process_Spacemove  (_nofile:0)
rt.def("/obj/item/projectile/proc/Process_Spacemove", function Process_Spacemove(f: Frame, movement_dir: Value) {
	f.vars = () => [movement_dir];
	if (live(movement_dir) === null) {
		movement_dir = 0;
	}
	return 1;
});

// /obj/item/projectile/proc/experience_pressure_difference  (_nofile:0)
rt.def("/obj/item/projectile/proc/experience_pressure_difference", function experience_pressure_difference(f: Frame) {
	return live(f.dot);
}, false, { waitfor: false });

// /obj/item/projectile/proc/disposalEnterTry  (_nofile:0)
rt.def("/obj/item/projectile/proc/disposalEnterTry", function disposalEnterTry(f: Frame) {
	return live(f.dot);
});

// /obj/item/projectile/blastwave/proc/ex_act  (_nofile:0)
rt.def("/obj/item/projectile/blastwave/proc/ex_act", function ex_act(f: Frame) {
	return live(f.dot);
}, false, { waitfor: false });

// /obj/item/clockwork/alloy_shards/proc/IntegrateAmount  (_nofile:0)
rt.def("/obj/item/clockwork/alloy_shards/proc/IntegrateAmount", function IntegrateAmount(f: Frame) {
	return 10;
});

// /obj/item/clockwork/alloy_shards/medium/gear_bit/large/proc/IntegrateAmount  (_nofile:0)
rt.def("/obj/item/clockwork/alloy_shards/medium/gear_bit/large/proc/IntegrateAmount", function IntegrateAmount(f: Frame) {
	return 4;
});

// /obj/item/clockwork/alloy_shards/medium/proc/IntegrateAmount  (_nofile:0)
rt.def("/obj/item/clockwork/alloy_shards/medium/proc/IntegrateAmount", function IntegrateAmount(f: Frame) {
	return 2;
});

// /obj/item/clockwork/alloy_shards/large/proc/IntegrateAmount  (_nofile:0)
rt.def("/obj/item/clockwork/alloy_shards/large/proc/IntegrateAmount", function IntegrateAmount(f: Frame) {
	return 3;
});

// /obj/item/clockwork/alloy_shards/small/proc/IntegrateAmount  (_nofile:0)
rt.def("/obj/item/clockwork/alloy_shards/small/proc/IntegrateAmount", function IntegrateAmount(f: Frame) {
	return 1;
});

// /obj/item/clockwork/replica_fabricator/proc/get_power  (_nofile:0)
rt.def("/obj/item/clockwork/replica_fabricator/proc/get_power", function get_power(f: Frame) {
	return rt.sv(f, "stored_power");
});

// /obj/item/clockwork/replica_fabricator/proc/get_max_power  (_nofile:0)
rt.def("/obj/item/clockwork/replica_fabricator/proc/get_max_power", function get_max_power(f: Frame) {
	return rt.sv(f, "max_power");
});

// /obj/item/stack/tile/brass/proc/IntegrateAmount  (_nofile:0)
rt.def("/obj/item/stack/tile/brass/proc/IntegrateAmount", function IntegrateAmount(f: Frame) {
	return 5;
});

// /obj/item/stack/rods/cyborg/proc/update_icon  (_nofile:0)
rt.def("/obj/item/stack/rods/cyborg/proc/update_icon", function update_icon(f: Frame) {
	return live(f.dot);
});

// /obj/item/device/mmi/posibrain/proc/attackby  (_nofile:0)
rt.def("/obj/item/device/mmi/posibrain/proc/attackby", function attackby(f: Frame, O: Value, user: Value) {
	return live(f.dot);
});

// /obj/item/device/firing_pin/proc/pin_auth  (_nofile:0)
rt.def("/obj/item/device/firing_pin/proc/pin_auth", function pin_auth(f: Frame, user: Value) {
	return 1;
});

// /obj/item/device/radio/beacon/proc/Hear  (_nofile:0)
rt.def("/obj/item/device/radio/beacon/proc/Hear", function Hear(f: Frame, message: Value, speaker: Value, message_langs: Value, raw_message: Value, radio_freq: Value, spans: Value, message_mode: Value) {
	return live(f.dot);
});

// /obj/item/device/radio/intercom/proc/add_blood  (_nofile:0)
rt.def("/obj/item/device/radio/intercom/proc/add_blood", function add_blood(f: Frame, blood_dna: Value) {
	return 0;
});

// /obj/item/device/unactivated_swarmer/proc/IntegrateAmount  (_nofile:0)
rt.def("/obj/item/device/unactivated_swarmer/proc/IntegrateAmount", function IntegrateAmount(f: Frame) {
	return 50;
});

// /obj/item/device/lightreplacer/cyborg/proc/janicart_insert  (_nofile:0)
rt.def("/obj/item/device/lightreplacer/cyborg/proc/janicart_insert", function janicart_insert(f: Frame, user: Value, J: Value) {
	return live(f.dot);
});

// /obj/item/device/powersink/proc/attack_paw  (_nofile:0)
rt.def("/obj/item/device/powersink/proc/attack_paw", function attack_paw(f: Frame) {
	return live(f.dot);
});

// /obj/item/device/powersink/proc/attack_ai  (_nofile:0)
rt.def("/obj/item/device/powersink/proc/attack_ai", function attack_ai(f: Frame) {
	return live(f.dot);
});

// /obj/item/device/pressure_plate/proc/step_item  (_nofile:0)
rt.def("/obj/item/device/pressure_plate/proc/step_item", function step_item(f: Frame, AM: Value) {
	return live(f.dot);
});

// /obj/item/device/transfer_valve/proc/IsAssemblyHolder  (_nofile:0)
rt.def("/obj/item/device/transfer_valve/proc/IsAssemblyHolder", function IsAssemblyHolder(f: Frame) {
	return 1;
});

// /obj/item/device/transfer_valve/proc/c_state  (_nofile:0)
rt.def("/obj/item/device/transfer_valve/proc/c_state", function c_state(f: Frame) {
	return live(f.dot);
});

// /obj/item/device/pda/proc/GetID  (_nofile:0)
rt.def("/obj/item/device/pda/proc/GetID", function GetID(f: Frame) {
	return rt.sv(f, "id");
});

// /obj/item/device/assembly/igniter/cold/proc/flamethrower_process  (_nofile:0)
rt.def("/obj/item/device/assembly/igniter/cold/proc/flamethrower_process", function flamethrower_process(f: Frame, location: Value) {
	return live(f.dot);
});

// /obj/item/device/assembly/proc/on_attach  empty
rt.def("/obj/item/device/assembly/proc/on_attach");

// /obj/item/device/assembly/proc/on_detach  empty
rt.def("/obj/item/device/assembly/proc/on_detach");

// /obj/item/device/assembly/proc/holder_movement  (_nofile:0)
rt.def("/obj/item/device/assembly/proc/holder_movement", function holder_movement(f: Frame) {
	return live(f.dot);
});

// /obj/item/device/assembly/proc/interact  (_nofile:0)
rt.def("/obj/item/device/assembly/proc/interact", function interact(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/item/device/assembly/flash/cyborg/proc/attackby  (_nofile:0)
rt.def("/obj/item/device/assembly/flash/cyborg/proc/attackby", function attackby(f: Frame, W: Value, user: Value, params: Value) {
	return live(f.dot);
});

// /obj/item/device/assembly/flash/armimplant/proc/cooldown  (_nofile:0)
rt.def("/obj/item/device/assembly/flash/armimplant/proc/cooldown", function cooldown(f: Frame) {
	rt.setSv(f, "overheat", 0);
	return f.dot;
});

// /obj/item/device/assembly/signaler/anomaly/proc/attack_self  (_nofile:0)
rt.def("/obj/item/device/assembly/signaler/anomaly/proc/attack_self", function attack_self(f: Frame) {
	return live(f.dot);
});

// /obj/item/device/assembly/signaler/cyborg/proc/attackby  (_nofile:0)
rt.def("/obj/item/device/assembly/signaler/cyborg/proc/attackby", function attackby(f: Frame, W: Value, user: Value, params: Value) {
	return live(f.dot);
});

// /obj/item/device/assembly_holder/proc/IsAssemblyHolder  (_nofile:0)
rt.def("/obj/item/device/assembly_holder/proc/IsAssemblyHolder", function IsAssemblyHolder(f: Frame) {
	return 1;
});

// /obj/item/device/flightpack/proc/enable_safe  (_nofile:0)
rt.def("/obj/item/device/flightpack/proc/enable_safe", function enable_safe(f: Frame) {
	if (!truthy(rt.sv(f, "override_safe"))) return f.dot;
	rt.setSv(f, "override_safe", 0);
	return f.dot;
});

// /obj/item/device/flightpack/proc/allow_thrust  (_nofile:0)
rt.def("/obj/item/device/flightpack/proc/allow_thrust", function allow_thrust(f: Frame, amount: Value) {
	if (!truthy(rt.sv(f, "flight"))) return f.dot;
	return 1;
});

// /obj/item/device/detective_scanner/proc/attack  (_nofile:0)
rt.def("/obj/item/device/detective_scanner/proc/attack", function attack(f: Frame, M: Value, user: Value) {
	return live(f.dot);
});

// /obj/item/device/modular_computer/proc/relay_qdel  (_nofile:0)
rt.def("/obj/item/device/modular_computer/proc/relay_qdel", function relay_qdel(f: Frame) {
	return live(f.dot);
});

// /obj/item/device/modular_computer/proc/check_power_override  (_nofile:0)
rt.def("/obj/item/device/modular_computer/proc/check_power_override", function check_power_override(f: Frame) {
	return 0;
});

// /obj/item/device/modular_computer/proc/ui_host  (_nofile:0)
rt.def("/obj/item/device/modular_computer/proc/ui_host", function ui_host(f: Frame) {
	if (truthy(rt.sv(f, "physical"))) {
		return rt.sv(f, "physical");
	}
	return live(f.src);
});

// /obj/item/device/modular_computer/laptop/preset/proc/install_programs  (_nofile:0)
rt.def("/obj/item/device/modular_computer/laptop/preset/proc/install_programs", function install_programs(f: Frame) {
	return live(f.dot);
});

// /obj/item/device/camera/proc/attack  (_nofile:0)
rt.def("/obj/item/device/camera/proc/attack", function attack(f: Frame, M: Value, user: Value) {
	return live(f.dot);
});

// /obj/item/device/uplink/proc/ui_host  (_nofile:0)
rt.def("/obj/item/device/uplink/proc/ui_host", function ui_host(f: Frame) {
	return rt.sv(f, "loc");
});

// /obj/item/organ/heart/gland/proc/activate  (_nofile:0)
rt.def("/obj/item/organ/heart/gland/proc/activate", function activate(f: Frame) {
	return live(f.dot);
});

// /obj/item/organ/heart/demon/proc/update_icon  (_nofile:0)
rt.def("/obj/item/organ/heart/demon/proc/update_icon", function update_icon(f: Frame) {
	return live(f.dot);
});

// /obj/item/organ/heart/demon/proc/Stop  (_nofile:0)
rt.def("/obj/item/organ/heart/demon/proc/Stop", function Stop(f: Frame) {
	return 0;
});

// /obj/item/organ/body_egg/proc/egg_process  (_nofile:0)
rt.def("/obj/item/organ/body_egg/proc/egg_process", function egg_process(f: Frame) {
	return live(f.dot);
});

// /obj/item/organ/body_egg/proc/AddInfectionImages  (_nofile:0)
rt.def("/obj/item/organ/body_egg/proc/AddInfectionImages", function AddInfectionImages(f: Frame) {
	return live(f.dot);
});

// /obj/item/organ/body_egg/proc/RemoveInfectionImages  (_nofile:0)
rt.def("/obj/item/organ/body_egg/proc/RemoveInfectionImages", function RemoveInfectionImages(f: Frame) {
	return live(f.dot);
});

// /obj/item/organ/brain/proc/prepare_eat  (_nofile:0)
rt.def("/obj/item/organ/brain/proc/prepare_eat", function prepare_eat(f: Frame) {
	return live(f.dot);
});

// /obj/item/organ/proc/on_find  (_nofile:0)
rt.def("/obj/item/organ/proc/on_find", function on_find(f: Frame, finder: Value) {
	return live(f.dot);
});

// /obj/item/organ/proc/on_life  (_nofile:0)
rt.def("/obj/item/organ/proc/on_life", function on_life(f: Frame) {
	return live(f.dot);
});

// /obj/item/organ/proc/item_action_slot_check  (_nofile:0)
rt.def("/obj/item/organ/proc/item_action_slot_check", function item_action_slot_check(f: Frame, slot: Value, user: Value) {
	return live(f.dot);
});

// /obj/item/organ/eyes/robotic/flashlight/proc/emp_act  (_nofile:0)
rt.def("/obj/item/organ/eyes/robotic/flashlight/proc/emp_act", function emp_act(f: Frame, severity: Value) {
	return live(f.dot);
});

// /obj/item/organ/eyes/robotic/shield/proc/emp_act  (_nofile:0)
rt.def("/obj/item/organ/eyes/robotic/shield/proc/emp_act", function emp_act(f: Frame, severity: Value) {
	return live(f.dot);
});

// /obj/item/organ/cyberimp/arm/proc/emag_act  (_nofile:0)
rt.def("/obj/item/organ/cyberimp/arm/proc/emag_act", function emag_act(f: Frame) {
	return 0;
});

// /obj/item/organ/cyberimp/brain/anti_stun/proc/reboot  (_nofile:0)
rt.def("/obj/item/organ/cyberimp/brain/anti_stun/proc/reboot", function reboot(f: Frame) {
	rt.setSv(f, "crit_fail", 0);
	return f.dot;
});

// /obj/item/organ/ears/invincible/proc/adjustEarDamage  (_nofile:0)
rt.def("/obj/item/organ/ears/invincible/proc/adjustEarDamage", function adjustEarDamage(f: Frame, ddmg: Value, ddeaf: Value) {
	return live(f.dot);
});

// /obj/item/organ/tongue/proc/TongueSpeech  (_nofile:0)
rt.def("/obj/item/organ/tongue/proc/TongueSpeech", function TongueSpeech(f: Frame, message: Value) {
	return live(message);
});

// /obj/item/organ/tongue/bone/plasmaman/proc/get_spans  (_nofile:0)
rt.def("/obj/item/organ/tongue/bone/plasmaman/proc/get_spans", function get_spans(f: Frame) {
	return live(f.dot);
});

// /obj/item/organ/tongue/robot/proc/can_speak_in_language  (_nofile:0)
rt.def("/obj/item/organ/tongue/robot/proc/can_speak_in_language", function can_speak_in_language(f: Frame, dt: Value) {
	f.dot = 1;
	return f.dot;
});

// /obj/item/organ/vocal_cords/proc/can_speak_with  (_nofile:0)
rt.def("/obj/item/organ/vocal_cords/proc/can_speak_with", function can_speak_with(f: Frame) {
	return 1;
});

// /obj/item/organ/vocal_cords/proc/speak_with  (_nofile:0)
rt.def("/obj/item/organ/vocal_cords/proc/speak_with", function speak_with(f: Frame, message: Value) {
	return live(f.dot);
});

// /obj/item/mecha_parts/chassis/proc/attack_hand  (_nofile:0)
rt.def("/obj/item/mecha_parts/chassis/proc/attack_hand", function attack_hand(f: Frame) {
	return live(f.dot);
});

// /obj/item/mecha_parts/mecha_equipment/proc/action  (_nofile:0)
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/action", function action(f: Frame, target: Value) {
	return 0;
});

// /obj/item/mecha_parts/mecha_equipment/proc/rearm  (_nofile:0)
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/rearm", function rearm(f: Frame) {
	return 0;
});

// /obj/item/mecha_parts/mecha_equipment/proc/needs_rearm  (_nofile:0)
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/needs_rearm", function needs_rearm(f: Frame) {
	return 0;
});

// /obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/allow_drop  (_nofile:0)
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/allow_drop", function allow_drop(f: Frame) {
	return 0;
});

// /obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/Exit  (_nofile:0)
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/Exit", function Exit(f: Frame, O: Value) {
	return 0;
});

// /obj/item/mecha_parts/mecha_equipment/generator/nuclear/proc/critfail  (_nofile:0)
rt.def("/obj/item/mecha_parts/mecha_equipment/generator/nuclear/proc/critfail", function critfail(f: Frame) {
	return live(f.dot);
});

// /obj/item/mecha_parts/mecha_equipment/extinguisher/proc/on_reagent_change  (_nofile:0)
rt.def("/obj/item/mecha_parts/mecha_equipment/extinguisher/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	return live(f.dot);
});

// /obj/item/mecha_parts/mecha_equipment/weapon/proc/get_shot_amount  (_nofile:0)
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/proc/get_shot_amount", function get_shot_amount(f: Frame) {
	return rt.sv(f, "projectiles_per_shot");
});

// /obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/proc/proj_init  (_nofile:0)
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/proc/proj_init", function proj_init(f: Frame, O: Value) {
	return live(f.dot);
});

// /obj/item/cardboard_cutout/proc/setDir  (_nofile:0)
rt.def("/obj/item/cardboard_cutout/proc/setDir", function setDir(f: Frame, newdir: Value) {
	rt.setSv(f, "dir", 2);
	return f.dot;
});

// /obj/item/toy/eightball/proc/start_shaking  (_nofile:0)
rt.def("/obj/item/toy/eightball/proc/start_shaking", function start_shaking(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/item/toy/eightball/proc/clear_cooldown  (_nofile:0)
rt.def("/obj/item/toy/eightball/proc/clear_cooldown", function clear_cooldown(f: Frame) {
	rt.setSv(f, "on_cooldown", 0);
	return f.dot;
});

// /obj/item/toy/eightball/broken/proc/get_answer  (_nofile:0)
rt.def("/obj/item/toy/eightball/broken/proc/get_answer", function get_answer(f: Frame) {
	return rt.sv(f, "fixed_answer");
});

// /obj/item/toy/balloon/proc/attack  (_nofile:0)
rt.def("/obj/item/toy/balloon/proc/attack", function attack(f: Frame, M: Value, user: Value) {
	return live(f.dot);
});

// /obj/item/toy/dummy/proc/GetVoice  (_nofile:0)
rt.def("/obj/item/toy/dummy/proc/GetVoice", function GetVoice(f: Frame) {
	return rt.sv(f, "doll_name");
});

// /obj/item/target/proc/nullPinnedLoc  (_nofile:0)
rt.def("/obj/item/target/proc/nullPinnedLoc", function nullPinnedLoc(f: Frame) {
	rt.setSv(f, "pinnedLoc", null);
	rt.setSv(f, "density", 0);
	return f.dot;
});

// /obj/item/nuke_core/supermatter_sliver/proc/attack_tk  (_nofile:0)
rt.def("/obj/item/nuke_core/supermatter_sliver/proc/attack_tk", function attack_tk(f: Frame) {
	return 0;
});

// /obj/item/nuke_core/supermatter_sliver/proc/can_be_pulled  (_nofile:0)
rt.def("/obj/item/nuke_core/supermatter_sliver/proc/can_be_pulled", function can_be_pulled(f: Frame, user: Value) {
	return 0;
});

// /obj/item/trash/proc/attack  (_nofile:0)
rt.def("/obj/item/trash/proc/attack", function attack(f: Frame, M: Value, user: Value) {
	return live(f.dot);
});

// /obj/item/borg/upgrade/modkit/range/proc/modify_projectile  (_nofile:0)
rt.def("/obj/item/borg/upgrade/modkit/range/proc/modify_projectile", function modify_projectile(f: Frame, K: Value) {
	rt.modField(f, live(K), "range", rt.sv(f, "modifier"), add);
	return f.dot;
});

// /obj/item/borg/upgrade/modkit/damage/proc/modify_projectile  (_nofile:0)
rt.def("/obj/item/borg/upgrade/modkit/damage/proc/modify_projectile", function modify_projectile(f: Frame, K: Value) {
	rt.modField(f, live(K), "damage", rt.sv(f, "modifier"), add);
	return f.dot;
});

// /obj/item/smallDelivery/proc/can_be_package_wrapped  (_nofile:0)
rt.def("/obj/item/smallDelivery/proc/can_be_package_wrapped", function can_be_package_wrapped(f: Frame) {
	return 0;
});

// /obj/item/storage/book/bible/syndicate/proc/add_blood  (_nofile:0)
rt.def("/obj/item/storage/book/bible/syndicate/proc/add_blood", function add_blood(f: Frame, blood_dna: Value) {
	return 0;
});

// /obj/item/gun_control/proc/CanItemAutoclick  (_nofile:0)
rt.def("/obj/item/gun_control/proc/CanItemAutoclick", function CanItemAutoclick(f: Frame) {
	return 1;
});

// /obj/item/chair/stool/proc/narsie_act  (_nofile:0)
rt.def("/obj/item/chair/stool/proc/narsie_act", function narsie_act(f: Frame) {
	return live(f.dot);
});

// /obj/item/chair/wood/proc/narsie_act  (_nofile:0)
rt.def("/obj/item/chair/wood/proc/narsie_act", function narsie_act(f: Frame) {
	return live(f.dot);
});

// /obj/item/ammo_box/magazine/recharge/proc/attack_self  (_nofile:0)
rt.def("/obj/item/ammo_box/magazine/recharge/proc/attack_self", function attack_self(f: Frame) {
	return live(f.dot);
});

// /obj/item/ammo_box/proc/can_load  (_nofile:0)
rt.def("/obj/item/ammo_box/proc/can_load", function can_load(f: Frame, user: Value) {
	return 1;
});

// /obj/item/seeds/proc/on_chem_reaction  (_nofile:0)
rt.def("/obj/item/seeds/proc/on_chem_reaction", function on_chem_reaction(f: Frame, S: Value) {
	return live(f.dot);
});

// /obj/item/crusher_trophy/blaster_tubes/proc/reset_deadly_shot  (_nofile:0)
rt.def("/obj/item/crusher_trophy/blaster_tubes/proc/reset_deadly_shot", function reset_deadly_shot(f: Frame) {
	rt.setSv(f, "deadly_shot", 0);
	return f.dot;
});

// /obj/item/bodypart/chest/proc/drop_limb  (_nofile:0)
rt.def("/obj/item/bodypart/chest/proc/drop_limb", function drop_limb(f: Frame, special: Value) {
	return live(f.dot);
});

// /obj/machinery/door/airlock/clockwork/proc/fabrication_vals  (_nofile:0)
rt.def("/obj/machinery/door/airlock/clockwork/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	return 0;
});

// /obj/machinery/door/airlock/clockwork/proc/ratvar_act  (_nofile:0)
rt.def("/obj/machinery/door/airlock/clockwork/proc/ratvar_act", function ratvar_act(f: Frame) {
	return 0;
});

// /obj/machinery/door/airlock/clockwork/proc/hasPower  (_nofile:0)
rt.def("/obj/machinery/door/airlock/clockwork/proc/hasPower", function hasPower(f: Frame) {
	return 1;
});

// /obj/machinery/door/airlock/clockwork/proc/obj_break  (_nofile:0)
rt.def("/obj/machinery/door/airlock/clockwork/proc/obj_break", function obj_break(f: Frame, damage_flag: Value) {
	return live(f.dot);
});

// /obj/machinery/door/airlock/plasma/proc/BlockSuperconductivity  (_nofile:0)
rt.def("/obj/machinery/door/airlock/plasma/proc/BlockSuperconductivity", function BlockSuperconductivity(f: Frame) {
	return 0;
});

// /obj/machinery/door/airlock/cult/proc/narsie_act  (_nofile:0)
rt.def("/obj/machinery/door/airlock/cult/proc/narsie_act", function narsie_act(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/door/airlock/glass_large/proc/narsie_act  (_nofile:0)
rt.def("/obj/machinery/door/airlock/glass_large/proc/narsie_act", function narsie_act(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/door/window/clockwork/proc/fabrication_vals  (_nofile:0)
rt.def("/obj/machinery/door/window/clockwork/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	return 0;
});

// /obj/machinery/door/window/clockwork/proc/hasPower  (_nofile:0)
rt.def("/obj/machinery/door/window/clockwork/proc/hasPower", function hasPower(f: Frame) {
	return 1;
});

// /obj/machinery/door/proc/try_to_weld  (_nofile:0)
rt.def("/obj/machinery/door/proc/try_to_weld", function try_to_weld(f: Frame, W: Value, user: Value) {
	return live(f.dot);
});

// /obj/machinery/door/proc/try_to_crowbar  (_nofile:0)
rt.def("/obj/machinery/door/proc/try_to_crowbar", function try_to_crowbar(f: Frame, I: Value, user: Value) {
	return live(f.dot);
});

// /obj/machinery/door/proc/unelectrify  (_nofile:0)
rt.def("/obj/machinery/door/proc/unelectrify", function unelectrify(f: Frame) {
	rt.setSv(f, "secondsElectrified", 0);
	return f.dot;
});

// /obj/machinery/door/proc/requiresID  (_nofile:0)
rt.def("/obj/machinery/door/proc/requiresID", function requiresID(f: Frame) {
	return 1;
});

// /obj/machinery/door/proc/storage_contents_dump_act  (_nofile:0)
rt.def("/obj/machinery/door/proc/storage_contents_dump_act", function storage_contents_dump_act(f: Frame, src_object: Value, user: Value) {
	return 0;
});

// /obj/machinery/door/proc/lock  (_nofile:0)
rt.def("/obj/machinery/door/proc/lock", function lock(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/door/proc/unlock  (_nofile:0)
rt.def("/obj/machinery/door/proc/unlock", function unlock(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/door/firedoor/proc/try_to_activate_door  (_nofile:0)
rt.def("/obj/machinery/door/firedoor/proc/try_to_activate_door", function try_to_activate_door(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/machinery/door/poddoor/proc/try_to_activate_door  (_nofile:0)
rt.def("/obj/machinery/door/poddoor/proc/try_to_activate_door", function try_to_activate_door(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/machinery/door/unpowered/proc/emag_act  (_nofile:0)
rt.def("/obj/machinery/door/unpowered/proc/emag_act", function emag_act(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/power/apc/proc/get_cell  (_nofile:0)
rt.def("/obj/machinery/power/apc/proc/get_cell", function get_cell(f: Frame) {
	return rt.sv(f, "cell");
});

// /obj/machinery/power/apc/proc/queue_icon_update  (_nofile:0)
rt.def("/obj/machinery/power/apc/proc/queue_icon_update", function queue_icon_update(f: Frame) {
	rt.setSv(f, "icon_update_needed", 1);
	return f.dot;
});

// /obj/machinery/power/apc/proc/can_terminal_dismantle  (_nofile:0)
rt.def("/obj/machinery/power/apc/proc/can_terminal_dismantle", function can_terminal_dismantle(f: Frame) {
	f.dot = 0;
	if (!truthy(rt.sv(f, "opened"))) return f.dot;
	f.dot = 1;
	return f.dot;
});

// /obj/machinery/power/smes/proc/can_terminal_dismantle  (_nofile:0)
rt.def("/obj/machinery/power/smes/proc/can_terminal_dismantle", function can_terminal_dismantle(f: Frame) {
	f.dot = 0;
	if (!truthy(rt.sv(f, "panel_open"))) return f.dot;
	f.dot = 1;
	return f.dot;
});

// /obj/machinery/power/proc/add_avail  (_nofile:0)
rt.def("/obj/machinery/power/proc/add_avail", function add_avail(f: Frame, amount: Value) {
	if (!truthy(rt.sv(f, "powernet"))) return f.dot;
	rt.modField(f, rt.sv(f, "powernet"), "newavail", live(amount), add);
	return f.dot;
});

// /obj/machinery/power/proc/add_load  (_nofile:0)
rt.def("/obj/machinery/power/proc/add_load", function add_load(f: Frame, amount: Value) {
	if (!truthy(rt.sv(f, "powernet"))) return f.dot;
	rt.modField(f, rt.sv(f, "powernet"), "load", live(amount), add);
	return f.dot;
});

// /obj/machinery/power/proc/disconnect_terminal  (_nofile:0)
rt.def("/obj/machinery/power/proc/disconnect_terminal", function disconnect_terminal(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/power/proc/can_terminal_dismantle  (_nofile:0)
rt.def("/obj/machinery/power/proc/can_terminal_dismantle", function can_terminal_dismantle(f: Frame) {
	f.dot = 0;
	return f.dot;
});

// /obj/machinery/power/singularity_beacon/proc/attack_ai  (_nofile:0)
rt.def("/obj/machinery/power/singularity_beacon/proc/attack_ai", function attack_ai(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/machinery/power/emitter/energycannon/proc/RefreshParts  (_nofile:0)
rt.def("/obj/machinery/power/emitter/energycannon/proc/RefreshParts", function RefreshParts(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/power/emitter/energycannon/magical/proc/attack_hand  (_nofile:0)
rt.def("/obj/machinery/power/emitter/energycannon/magical/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/machinery/power/emitter/energycannon/magical/proc/attackby  (_nofile:0)
rt.def("/obj/machinery/power/emitter/energycannon/magical/proc/attackby", function attackby(f: Frame, W: Value, user: Value, params: Value) {
	return live(f.dot);
});

// /obj/machinery/power/emitter/energycannon/magical/proc/ex_act  (_nofile:0)
rt.def("/obj/machinery/power/emitter/energycannon/magical/proc/ex_act", function ex_act(f: Frame, severity: Value) {
	return live(f.dot);
}, false, { waitfor: false });

// /obj/machinery/power/emitter/energycannon/magical/proc/emag_act  (_nofile:0)
rt.def("/obj/machinery/power/emitter/energycannon/magical/proc/emag_act", function emag_act(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/machinery/power/emitter/proc/emp_act  (_nofile:0)
rt.def("/obj/machinery/power/emitter/proc/emp_act", function emp_act(f: Frame, severity: Value) {
	return 1;
});

// /obj/machinery/power/port_gen/proc/HasFuel  (_nofile:0)
rt.def("/obj/machinery/power/port_gen/proc/HasFuel", function HasFuel(f: Frame) {
	return 1;
});

// /obj/machinery/power/port_gen/proc/UseFuel  (_nofile:0)
rt.def("/obj/machinery/power/port_gen/proc/UseFuel", function UseFuel(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/power/port_gen/proc/DropFuel  (_nofile:0)
rt.def("/obj/machinery/power/port_gen/proc/DropFuel", function DropFuel(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/power/port_gen/proc/handleInactive  (_nofile:0)
rt.def("/obj/machinery/power/port_gen/proc/handleInactive", function handleInactive(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/power/solar/fake/proc/process  (_nofile:0)
rt.def("/obj/machinery/power/solar/fake/proc/process", function process(f: Frame) {
	f.dot = 26;
	return live(f.dot);
}, false, { waitfor: false });

// /obj/machinery/power/supermatter_shard/proc/make_frozen_visual  (_nofile:0)
rt.def("/obj/machinery/power/supermatter_shard/proc/make_frozen_visual", function make_frozen_visual(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/gateway/proc/shuttleRotate  (_nofile:0)
rt.def("/obj/machinery/gateway/proc/shuttleRotate", function shuttleRotate(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/gateway/proc/toggleon  (_nofile:0)
rt.def("/obj/machinery/gateway/proc/toggleon", function toggleon(f: Frame, user: Value) {
	return 0;
});

// /obj/machinery/computer/camera_advanced/proc/attack_ai  (_nofile:0)
rt.def("/obj/machinery/computer/camera_advanced/proc/attack_ai", function attack_ai(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/machinery/computer/teleporter/proc/eject  (_nofile:0)
rt.def("/obj/machinery/computer/teleporter/proc/eject", function eject(f: Frame) {
	if (!truthy(rt.sv(f, "locked"))) return f.dot;
	rt.setFv(f, "loc", rt.sv(f, "locked"), rt.sv(f, "loc"));
	rt.setSv(f, "locked", null);
	return f.dot;
});

// /obj/machinery/computer/arcade/proc/Reset  (_nofile:0)
rt.def("/obj/machinery/computer/arcade/proc/Reset", function Reset(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/computer/arcade/orion_trail/proc/Reset  (_nofile:0)
rt.def("/obj/machinery/computer/arcade/orion_trail/proc/Reset", function Reset(f: Frame) {
	rt.setSv(f, "stops", rt.list("Pluto", "Asteroid Belt", "Proxima Centauri", "Dead Space", "Rigel Prime", "Tau Ceti Beta", "Black Hole", "Space Outpost Beta-9", "Orion Prime"));
	rt.setSv(f, "stopblurbs", rt.list("Pluto, long since occupied with long-range sensors and scanners, stands ready to, and indeed continues to probe the far reaches of the galaxy.", "At the edge of the Sol system lies a treacherous asteroid belt. Many have been crushed by stray asteroids and misguided judgement.", "The nearest star system to Sol, in ages past it stood as a reminder of the boundaries of sub-light travel, now a low-population sanctuary for adventurers and traders.", "This region of space is particularly devoid of matter. Such low-density pockets are known to exist, but the vastness of it is astounding.", "Rigel Prime, the center of the Rigel system, burns hot, basking its planetary bodies in warmth and radiation.", "Tau Ceti Beta has recently become a waypoint for colonists headed towards Orion. There are many ships and makeshift stations in the vicinity.", "Sensors indicate that a black hole's gravitational field is affecting the region of space we were headed through. We could stay of course, but risk of being overcome by its gravity, or we could change course to go around, which will take longer.", "You have come into range of the first man-made structure in this region of space. It has been constructed not by travellers from Sol, but by colonists from Orion. It stands as a monument to the colonists' success.", "You have made it to Orion! Congratulations! Your crew is one of the few to start a new foothold for mankind!"));
	return f.dot;
});

// /obj/machinery/computer/shuttle/pod/proc/update_icon  (_nofile:0)
rt.def("/obj/machinery/computer/shuttle/pod/proc/update_icon", function update_icon(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/atmospherics/proc/swarmer_act  (_nofile:0)
rt.def("/obj/machinery/atmospherics/proc/swarmer_act", function swarmer_act(f: Frame) {
	return 0;
});

// /obj/machinery/atmospherics/proc/pipeline_expansion  (_nofile:0)
rt.def("/obj/machinery/atmospherics/proc/pipeline_expansion", function pipeline_expansion(f: Frame) {
	return rt.sv(f, "nodes");
});

// /obj/machinery/atmospherics/proc/SetInitDirections  (_nofile:0)
rt.def("/obj/machinery/atmospherics/proc/SetInitDirections", function SetInitDirections(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/atmospherics/proc/GetInitDirections  (_nofile:0)
rt.def("/obj/machinery/atmospherics/proc/GetInitDirections", function GetInitDirections(f: Frame) {
	return rt.sv(f, "initialize_directions");
});

// /obj/machinery/atmospherics/proc/returnPipenet  (_nofile:0)
rt.def("/obj/machinery/atmospherics/proc/returnPipenet", function returnPipenet(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/atmospherics/proc/returnPipenetAir  (_nofile:0)
rt.def("/obj/machinery/atmospherics/proc/returnPipenetAir", function returnPipenetAir(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/atmospherics/proc/setPipenet  (_nofile:0)
rt.def("/obj/machinery/atmospherics/proc/setPipenet", function setPipenet(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/atmospherics/proc/replacePipenet  (_nofile:0)
rt.def("/obj/machinery/atmospherics/proc/replacePipenet", function replacePipenet(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/atmospherics/proc/build_network  (_nofile:0)
rt.def("/obj/machinery/atmospherics/proc/build_network", function build_network(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/atmospherics/proc/update_icon  (_nofile:0)
rt.def("/obj/machinery/atmospherics/proc/update_icon", function update_icon(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/atmospherics/proc/can_unwrench  (_nofile:0)
rt.def("/obj/machinery/atmospherics/proc/can_unwrench", function can_unwrench(f: Frame, user: Value) {
	return rt.sv(f, "can_unwrench");
});

// /obj/machinery/atmospherics/proc/can_crawl_through  (_nofile:0)
rt.def("/obj/machinery/atmospherics/proc/can_crawl_through", function can_crawl_through(f: Frame) {
	return 1;
});

// /obj/machinery/atmospherics/proc/can_see_pipes  (_nofile:0)
rt.def("/obj/machinery/atmospherics/proc/can_see_pipes", function can_see_pipes(f: Frame) {
	return 1;
});

// /obj/machinery/atmospherics/proc/addMember  (_nofile:0)
rt.def("/obj/machinery/atmospherics/proc/addMember", function addMember(f: Frame, A: Value) {
	return live(f.dot);
});

// /obj/machinery/atmospherics/pipe/proc/check_pressure  (_nofile:0)
rt.def("/obj/machinery/atmospherics/pipe/proc/check_pressure", function check_pressure(f: Frame, pressure: Value) {
	return 1;
});

// /obj/machinery/atmospherics/pipe/proc/returnPipenet  (_nofile:0)
rt.def("/obj/machinery/atmospherics/pipe/proc/returnPipenet", function returnPipenet(f: Frame) {
	return rt.sv(f, "parent");
});

// /obj/machinery/atmospherics/pipe/heat_exchanging/proc/hide  (_nofile:0)
rt.def("/obj/machinery/atmospherics/pipe/heat_exchanging/proc/hide", function hide(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/atmospherics/components/proc/update_icon_nopipes  (_nofile:0)
rt.def("/obj/machinery/atmospherics/components/proc/update_icon_nopipes", function update_icon_nopipes(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/atmospherics/components/binary/valve/proc/attack_ai  (_nofile:0)
rt.def("/obj/machinery/atmospherics/components/binary/valve/proc/attack_ai", function attack_ai(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/machinery/atmospherics/components/unary/cryo_cell/proc/update_remote_sight  (_nofile:0)
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/update_remote_sight", function update_remote_sight(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/machinery/atmospherics/components/unary/cryo_cell/proc/can_crawl_through  (_nofile:0)
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/can_crawl_through", function can_crawl_through(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/atmospherics/components/unary/cryo_cell/proc/can_see_pipes  (_nofile:0)
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/can_see_pipes", function can_see_pipes(f: Frame) {
	return 0;
});

// /obj/machinery/proc/locate_machinery  (_nofile:0)
rt.def("/obj/machinery/proc/locate_machinery", function locate_machinery(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/proc/process  (_nofile:0)
rt.def("/obj/machinery/proc/process", function process(f: Frame) {
	return 26;
}, false, { waitfor: false });

// /obj/machinery/proc/process_atmos  (_nofile:0)
rt.def("/obj/machinery/proc/process_atmos", function process_atmos(f: Frame) {
	return 26;
});

// /obj/machinery/proc/RefreshParts  (_nofile:0)
rt.def("/obj/machinery/proc/RefreshParts", function RefreshParts(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/proc/on_construction  (_nofile:0)
rt.def("/obj/machinery/proc/on_construction", function on_construction(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/proc/on_deconstruction  (_nofile:0)
rt.def("/obj/machinery/proc/on_deconstruction", function on_deconstruction(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/proc/allow_drop  (_nofile:0)
rt.def("/obj/machinery/proc/allow_drop", function allow_drop(f: Frame) {
	return 0;
});

// /obj/machinery/proc/can_be_overridden  (_nofile:0)
rt.def("/obj/machinery/proc/can_be_overridden", function can_be_overridden(f: Frame) {
	f.dot = 1;
	return f.dot;
});

// /obj/machinery/field/generator/proc/emp_act  (_nofile:0)
rt.def("/obj/machinery/field/generator/proc/emp_act", function emp_act(f: Frame) {
	return 0;
});

// /obj/machinery/field/containment/proc/blob_act  (_nofile:0)
rt.def("/obj/machinery/field/containment/proc/blob_act", function blob_act(f: Frame, B: Value) {
	return 0;
});

// /obj/machinery/field/containment/proc/ex_act  (_nofile:0)
rt.def("/obj/machinery/field/containment/proc/ex_act", function ex_act(f: Frame, severity: Value, target: Value) {
	return 0;
}, false, { waitfor: false });

// /obj/machinery/field/proc/clear_shock  (_nofile:0)
rt.def("/obj/machinery/field/proc/clear_shock", function clear_shock(f: Frame) {
	rt.setSv(f, "hasShocked", 0);
	return f.dot;
});

// /obj/machinery/gravity_generator/proc/throw_at  (_nofile:0)
rt.def("/obj/machinery/gravity_generator/proc/throw_at", function throw_at(f: Frame) {
	return 0;
});

// /obj/machinery/gravity_generator/proc/shuttleRotate  (_nofile:0)
rt.def("/obj/machinery/gravity_generator/proc/shuttleRotate", function shuttleRotate(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/vending/proc/pre_throw  (_nofile:0)
rt.def("/obj/machinery/vending/proc/pre_throw", function pre_throw(f: Frame, I: Value) {
	return live(f.dot);
});

// /obj/machinery/chem_dispenser/proc/get_cell  (_nofile:0)
rt.def("/obj/machinery/chem_dispenser/proc/get_cell", function get_cell(f: Frame) {
	return rt.sv(f, "cell");
});

// /obj/machinery/chem_dispenser/constructable/proc/on_deconstruction  (_nofile:0)
rt.def("/obj/machinery/chem_dispenser/constructable/proc/on_deconstruction", function on_deconstruction(f: Frame) {
	if (!truthy(rt.sv(f, "beaker"))) return f.dot;
	rt.setFv(f, "loc", rt.sv(f, "beaker"), rt.sv(f, "loc"));
	rt.setSv(f, "beaker", null);
	return f.dot;
});

// /obj/machinery/nuclearbomb/selfdestruct/proc/set_anchor  (_nofile:0)
rt.def("/obj/machinery/nuclearbomb/selfdestruct/proc/set_anchor", function set_anchor(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/portable_atmospherics/proc/return_air  (_nofile:0)
rt.def("/obj/machinery/portable_atmospherics/proc/return_air", function return_air(f: Frame) {
	return rt.sv(f, "air_contents");
});

// /obj/machinery/portable_atmospherics/proc/portableConnectorReturnAir  (_nofile:0)
rt.def("/obj/machinery/portable_atmospherics/proc/portableConnectorReturnAir", function portableConnectorReturnAir(f: Frame) {
	return rt.sv(f, "air_contents");
});

// /obj/machinery/telecomms/proc/Options_Topic  (_nofile:0)
rt.def("/obj/machinery/telecomms/proc/Options_Topic", function Options_Topic(f: Frame, href: Value, href_list: Value) {
	return live(f.dot);
});

// /obj/machinery/porta_turret/proc/reset_attacked  (_nofile:0)
rt.def("/obj/machinery/porta_turret/proc/reset_attacked", function reset_attacked(f: Frame) {
	rt.setSv(f, "attacked", 0);
	return f.dot;
});

// /obj/machinery/porta_turret/syndicate/proc/setup  (_nofile:0)
rt.def("/obj/machinery/porta_turret/syndicate/proc/setup", function setup(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/porta_turret/syndicate/proc/assess_perp  (_nofile:0)
rt.def("/obj/machinery/porta_turret/syndicate/proc/assess_perp", function assess_perp(f: Frame, perp: Value) {
	return 10;
});

// /obj/machinery/porta_turret/ai/proc/assess_perp  (_nofile:0)
rt.def("/obj/machinery/porta_turret/ai/proc/assess_perp", function assess_perp(f: Frame, perp: Value) {
	return 10;
});

// /obj/machinery/porta_turret/aux_base/proc/assess_perp  (_nofile:0)
rt.def("/obj/machinery/porta_turret/aux_base/proc/assess_perp", function assess_perp(f: Frame, perp: Value) {
	return 0;
});

// /obj/machinery/porta_turret/aux_base/proc/setup  (_nofile:0)
rt.def("/obj/machinery/porta_turret/aux_base/proc/setup", function setup(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/porta_turret/aux_base/proc/interact  (_nofile:0)
rt.def("/obj/machinery/porta_turret/aux_base/proc/interact", function interact(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/machinery/porta_turret/centcomm_shuttle/proc/assess_perp  (_nofile:0)
rt.def("/obj/machinery/porta_turret/centcomm_shuttle/proc/assess_perp", function assess_perp(f: Frame, perp: Value) {
	return 0;
});

// /obj/machinery/porta_turret/centcomm_shuttle/proc/setup  (_nofile:0)
rt.def("/obj/machinery/porta_turret/centcomm_shuttle/proc/setup", function setup(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/hydroponics/soil/proc/update_icon_hoses  (_nofile:0)
rt.def("/obj/machinery/hydroponics/soil/proc/update_icon_hoses", function update_icon_hoses(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/hydroponics/soil/proc/update_icon_lights  (_nofile:0)
rt.def("/obj/machinery/hydroponics/soil/proc/update_icon_lights", function update_icon_lights(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/cell_charger/proc/attack_ai  (_nofile:0)
rt.def("/obj/machinery/cell_charger/proc/attack_ai", function attack_ai(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/machinery/doppler_array/proc/process  (_nofile:0)
rt.def("/obj/machinery/doppler_array/proc/process", function process(f: Frame) {
	return 26;
}, false, { waitfor: false });

// /obj/machinery/gulag_teleporter/proc/updateUsrDialog  (_nofile:0)
rt.def("/obj/machinery/gulag_teleporter/proc/updateUsrDialog", function updateUsrDialog(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/navbeacon/proc/attack_paw  (_nofile:0)
rt.def("/obj/machinery/navbeacon/proc/attack_paw", function attack_paw(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/shieldwall/proc/attack_hand  (_nofile:0)
rt.def("/obj/machinery/shieldwall/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/machinery/space_heater/proc/get_cell  (_nofile:0)
rt.def("/obj/machinery/space_heater/proc/get_cell", function get_cell(f: Frame) {
	return rt.sv(f, "cell");
});

// /obj/machinery/syndicatebomb/proc/attack_ai  (_nofile:0)
rt.def("/obj/machinery/syndicatebomb/proc/attack_ai", function attack_ai(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/doorButtons/proc/removeMe  empty
rt.def("/obj/machinery/doorButtons/proc/removeMe");

// /obj/machinery/doorButtons/proc/findObjsByTag  (_nofile:0)
rt.def("/obj/machinery/doorButtons/proc/findObjsByTag", function findObjsByTag(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/embedded_controller/proc/update_icon  empty
rt.def("/obj/machinery/embedded_controller/proc/update_icon");

// /obj/machinery/embedded_controller/proc/return_text  empty
rt.def("/obj/machinery/embedded_controller/proc/return_text");

// /obj/machinery/embedded_controller/proc/post_signal  (_nofile:0)
rt.def("/obj/machinery/embedded_controller/proc/post_signal", function post_signal(f: Frame, signal: Value, comm_line: Value) {
	return 0;
});

// /obj/machinery/porta_turret_construct/proc/attack_ai  (_nofile:0)
rt.def("/obj/machinery/porta_turret_construct/proc/attack_ai", function attack_ai(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/porta_turret_cover/proc/can_be_overridden  (_nofile:0)
rt.def("/obj/machinery/porta_turret_cover/proc/can_be_overridden", function can_be_overridden(f: Frame) {
	f.dot = 0;
	return f.dot;
});

// /obj/machinery/juicer/proc/attack_ai  (_nofile:0)
rt.def("/obj/machinery/juicer/proc/attack_ai", function attack_ai(f: Frame, user: Value) {
	return 0;
});

// /obj/machinery/microwave/proc/attack_ai  (_nofile:0)
rt.def("/obj/machinery/microwave/proc/attack_ai", function attack_ai(f: Frame, user: Value) {
	return 0;
});

// /obj/machinery/smartfridge/proc/attack_ai  (_nofile:0)
rt.def("/obj/machinery/smartfridge/proc/attack_ai", function attack_ai(f: Frame, user: Value) {
	return 0;
});

// /obj/machinery/smartfridge/black_box/proc/update_icon  (_nofile:0)
rt.def("/obj/machinery/smartfridge/black_box/proc/update_icon", function update_icon(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/smartfridge/black_box/proc/default_deconstruction_screwdriver  (_nofile:0)
rt.def("/obj/machinery/smartfridge/black_box/proc/default_deconstruction_screwdriver", function default_deconstruction_screwdriver(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/smartfridge/black_box/proc/exchange_parts  (_nofile:0)
rt.def("/obj/machinery/smartfridge/black_box/proc/exchange_parts", function exchange_parts(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/smartfridge/black_box/proc/default_pry_open  (_nofile:0)
rt.def("/obj/machinery/smartfridge/black_box/proc/default_pry_open", function default_pry_open(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/smartfridge/black_box/proc/default_unfasten_wrench  (_nofile:0)
rt.def("/obj/machinery/smartfridge/black_box/proc/default_unfasten_wrench", function default_unfasten_wrench(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/smartfridge/black_box/proc/default_deconstruction_crowbar  (_nofile:0)
rt.def("/obj/machinery/smartfridge/black_box/proc/default_deconstruction_crowbar", function default_deconstruction_crowbar(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/modular_computer/console/preset/proc/install_programs  (_nofile:0)
rt.def("/obj/machinery/modular_computer/console/preset/proc/install_programs", function install_programs(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/r_n_d/server/centcom/proc/process  (_nofile:0)
rt.def("/obj/machinery/r_n_d/server/centcom/proc/process", function process(f: Frame) {
	return 26;
}, false, { waitfor: false });

// /obj/machinery/r_n_d/proc/Insert_Item  (_nofile:0)
rt.def("/obj/machinery/r_n_d/proc/Insert_Item", function Insert_Item(f: Frame, I: Value, user: Value) {
	return live(f.dot);
});

// /obj/machinery/am_shielding/proc/emp_act  (_nofile:0)
rt.def("/obj/machinery/am_shielding/proc/emp_act", function emp_act(f: Frame) {
	return 0;
});

// /obj/machinery/reagentgrinder/proc/attack_ai  (_nofile:0)
rt.def("/obj/machinery/reagentgrinder/proc/attack_ai", function attack_ai(f: Frame, user: Value) {
	return 0;
});

// /obj/machinery/disposal/proc/update_icon  (_nofile:0)
rt.def("/obj/machinery/disposal/proc/update_icon", function update_icon(f: Frame) {
	return live(f.dot);
});

// /obj/machinery/bsa/full/proc/ready_cannon  (_nofile:0)
rt.def("/obj/machinery/bsa/full/proc/ready_cannon", function ready_cannon(f: Frame) {
	rt.setSv(f, "ready", 1);
	return f.dot;
});

// /obj/screen/proc/IsAutoclickable  (_nofile:0)
rt.def("/obj/screen/proc/IsAutoclickable", function IsAutoclickable(f: Frame) {
	f.dot = 0;
	return f.dot;
});

// /obj/screen/proc/take_damage  (_nofile:0)
rt.def("/obj/screen/proc/take_damage", function take_damage(f: Frame) {
	return live(f.dot);
});

// /obj/screen/proc/examine  (_nofile:0)
rt.def("/obj/screen/proc/examine", function examine(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/screen/proc/orbit  (_nofile:0)
rt.def("/obj/screen/proc/orbit", function orbit(f: Frame) {
	return live(f.dot);
});

// /obj/screen/click_catcher/proc/IsAutoclickable  (_nofile:0)
rt.def("/obj/screen/click_catcher/proc/IsAutoclickable", function IsAutoclickable(f: Frame) {
	f.dot = 1;
	return f.dot;
});

// /obj/screen/fullscreen/lighting_backdrop/proc/update_for_view  (_nofile:0)
rt.def("/obj/screen/fullscreen/lighting_backdrop/proc/update_for_view", function update_for_view(f: Frame, client_view: Value) {
	return live(f.dot);
});

// /obj/screen/devil/soul_counter/proc/clear  (_nofile:0)
rt.def("/obj/screen/devil/soul_counter/proc/clear", function clear(f: Frame) {
	rt.setSv(f, "invisibility", 101);
	return f.dot;
});

// /obj/effect/portal/proc/make_frozen_visual  (_nofile:0)
rt.def("/obj/effect/portal/proc/make_frozen_visual", function make_frozen_visual(f: Frame) {
	return live(f.dot);
});

// /obj/effect/portal/proc/attack_tk  (_nofile:0)
rt.def("/obj/effect/portal/proc/attack_tk", function attack_tk(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/effect/proc_holder/changeling/proc/on_refund  (_nofile:0)
rt.def("/obj/effect/proc_holder/changeling/proc/on_refund", function on_refund(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/effect/proc_holder/changeling/proc/sting_action  (_nofile:0)
rt.def("/obj/effect/proc_holder/changeling/proc/sting_action", function sting_action(f: Frame, user: Value, target: Value) {
	return 0;
});

// /obj/effect/proc_holder/changeling/proc/sting_feedback  (_nofile:0)
rt.def("/obj/effect/proc_holder/changeling/proc/sting_feedback", function sting_feedback(f: Frame, user: Value, target: Value) {
	return 0;
});

// /obj/effect/proc_holder/spell/targeted/ethereal_jaunt/shift/proc/jaunt_steam  (_nofile:0)
rt.def("/obj/effect/proc_holder/spell/targeted/ethereal_jaunt/shift/proc/jaunt_steam", function jaunt_steam(f: Frame, mobloc: Value) {
	return live(f.dot);
});

// /obj/effect/proc_holder/spell/aoe_turf/conjure/proc/post_summon  (_nofile:0)
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/proc/post_summon", function post_summon(f: Frame, summoned_object: Value, user: Value) {
	return live(f.dot);
});

// /obj/effect/proc_holder/spell/proc/choose_targets  (_nofile:0)
rt.def("/obj/effect/proc_holder/spell/proc/choose_targets", function choose_targets(f: Frame, user: Value) {
	f.vars = () => [user];
	if (live(user) === null) {
		user = live(f.usr);
	}
	return live(f.dot);
});

// /obj/effect/proc_holder/spell/proc/can_target  (_nofile:0)
rt.def("/obj/effect/proc_holder/spell/proc/can_target", function can_target(f: Frame, target: Value) {
	return 1;
});

// /obj/effect/proc_holder/spell/proc/start_recharge  (_nofile:0)
rt.def("/obj/effect/proc_holder/spell/proc/start_recharge", function start_recharge(f: Frame) {
	rt.setSv(f, "recharging", 1);
	return f.dot;
});

// /obj/effect/proc_holder/spell/proc/cast  (_nofile:0)
rt.def("/obj/effect/proc_holder/spell/proc/cast", function cast(f: Frame, targets: Value, user: Value) {
	f.vars = () => [user];
	if (live(user) === null) {
		user = live(f.usr);
	}
	return live(f.dot);
});

// /obj/effect/proc_holder/spell/proc/critfail  (_nofile:0)
rt.def("/obj/effect/proc_holder/spell/proc/critfail", function critfail(f: Frame, targets: Value) {
	return live(f.dot);
});

// /obj/effect/proc_holder/alien/proc/on_gain  (_nofile:0)
rt.def("/obj/effect/proc_holder/alien/proc/on_gain", function on_gain(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/effect/proc_holder/alien/proc/on_lose  (_nofile:0)
rt.def("/obj/effect/proc_holder/alien/proc/on_lose", function on_lose(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/effect/proc_holder/alien/proc/fire  (_nofile:0)
rt.def("/obj/effect/proc_holder/alien/proc/fire", function fire(f: Frame, user: Value) {
	return 1;
});

// /obj/effect/clockwork/overlay/proc/ex_act  (_nofile:0)
rt.def("/obj/effect/clockwork/overlay/proc/ex_act", function ex_act(f: Frame) {
	return 0;
}, false, { waitfor: false });

// /obj/effect/clockwork/overlay/proc/singularity_pull  (_nofile:0)
rt.def("/obj/effect/clockwork/overlay/proc/singularity_pull", function singularity_pull(f: Frame, S: Value, current_size: Value) {
	return live(f.dot);
});

// /obj/effect/clockwork/judicial_marker/proc/ex_act  (_nofile:0)
rt.def("/obj/effect/clockwork/judicial_marker/proc/ex_act", function ex_act(f: Frame, severity: Value) {
	return live(f.dot);
}, false, { waitfor: false });

// /obj/effect/rune/convert/proc/do_invoke_glow  (_nofile:0)
rt.def("/obj/effect/rune/convert/proc/do_invoke_glow", function do_invoke_glow(f: Frame) {
	return live(f.dot);
}, false, { waitfor: false });

// /obj/effect/rune/narsie/proc/talismanhide  (_nofile:0)
rt.def("/obj/effect/rune/narsie/proc/talismanhide", function talismanhide(f: Frame) {
	return live(f.dot);
});

// /obj/effect/rune/wall/proc/BlockSuperconductivity  (_nofile:0)
rt.def("/obj/effect/rune/wall/proc/BlockSuperconductivity", function BlockSuperconductivity(f: Frame) {
	return rt.sv(f, "density");
});

// /obj/effect/rune/blood_boil/proc/do_invoke_glow  (_nofile:0)
rt.def("/obj/effect/rune/blood_boil/proc/do_invoke_glow", function do_invoke_glow(f: Frame) {
	return live(f.dot);
}, false, { waitfor: false });

// /obj/effect/meteor/proc/ex_act  (_nofile:0)
rt.def("/obj/effect/meteor/proc/ex_act", function ex_act(f: Frame) {
	return live(f.dot);
}, false, { waitfor: false });

// /obj/effect/temp_visual/proc/singularity_act  (_nofile:0)
rt.def("/obj/effect/temp_visual/proc/singularity_act", function singularity_act(f: Frame) {
	return live(f.dot);
});

// /obj/effect/temp_visual/proc/singularity_pull  (_nofile:0)
rt.def("/obj/effect/temp_visual/proc/singularity_pull", function singularity_pull(f: Frame) {
	return live(f.dot);
});

// /obj/effect/temp_visual/proc/ex_act  (_nofile:0)
rt.def("/obj/effect/temp_visual/proc/ex_act", function ex_act(f: Frame) {
	return live(f.dot);
}, false, { waitfor: false });

// /obj/effect/temp_visual/target/proc/ex_act  (_nofile:0)
rt.def("/obj/effect/temp_visual/target/proc/ex_act", function ex_act(f: Frame) {
	return live(f.dot);
}, false, { waitfor: false });

// /obj/effect/proc/swarmer_act  (_nofile:0)
rt.def("/obj/effect/proc/swarmer_act", function swarmer_act(f: Frame) {
	return 0;
});

// /obj/effect/proc/attackby  (_nofile:0)
rt.def("/obj/effect/proc/attackby", function attackby(f: Frame, I: Value, user: Value, params: Value) {
	return live(f.dot);
});

// /obj/effect/proc/take_damage  (_nofile:0)
rt.def("/obj/effect/proc/take_damage", function take_damage(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value, sound_effect: Value, attack_dir: Value) {
	f.vars = () => [damage_type, damage_flag, sound_effect];
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	if (live(sound_effect) === null) {
		sound_effect = 1;
	}
	return live(f.dot);
});

// /obj/effect/proc/fire_act  (_nofile:0)
rt.def("/obj/effect/proc/fire_act", function fire_act(f: Frame, exposed_temperature: Value, exposed_volume: Value) {
	return live(f.dot);
});

// /obj/effect/proc/acid_act  (_nofile:0)
rt.def("/obj/effect/proc/acid_act", function acid_act(f: Frame) {
	return live(f.dot);
});

// /obj/effect/proc/mech_melee_attack  (_nofile:0)
rt.def("/obj/effect/proc/mech_melee_attack", function mech_melee_attack(f: Frame, M: Value) {
	return 0;
});

// /obj/effect/proc/blob_act  (_nofile:0)
rt.def("/obj/effect/proc/blob_act", function blob_act(f: Frame) {
	return live(f.dot);
});

// /obj/effect/proc/attack_hulk  (_nofile:0)
rt.def("/obj/effect/proc/attack_hulk", function attack_hulk(f: Frame, user: Value, does_attack_animation: Value) {
	f.vars = () => [does_attack_animation];
	if (live(does_attack_animation) === null) {
		does_attack_animation = 0;
	}
	return 0;
});

// /obj/effect/proc/experience_pressure_difference  (_nofile:0)
rt.def("/obj/effect/proc/experience_pressure_difference", function experience_pressure_difference(f: Frame) {
	return live(f.dot);
}, false, { waitfor: false });

// /obj/effect/proc/ConveyorMove  (_nofile:0)
rt.def("/obj/effect/proc/ConveyorMove", function ConveyorMove(f: Frame) {
	return live(f.dot);
}, false, { waitfor: false });

// /obj/effect/proc/disposalEnterTry  (_nofile:0)
rt.def("/obj/effect/proc/disposalEnterTry", function disposalEnterTry(f: Frame) {
	return live(f.dot);
});

// /obj/effect/decal/cleanable/robot_debris/proc/ex_act  (_nofile:0)
rt.def("/obj/effect/decal/cleanable/robot_debris/proc/ex_act", function ex_act(f: Frame) {
	return live(f.dot);
}, false, { waitfor: false });

// /obj/effect/decal/cleanable/blood/gibs/proc/ex_act  (_nofile:0)
rt.def("/obj/effect/decal/cleanable/blood/gibs/proc/ex_act", function ex_act(f: Frame, severity: Value, target: Value) {
	return live(f.dot);
}, false, { waitfor: false });

// /obj/effect/decal/cleanable/blood/gibs/bubblegum/proc/can_bloodcrawl_in  (_nofile:0)
rt.def("/obj/effect/decal/cleanable/blood/gibs/bubblegum/proc/can_bloodcrawl_in", function can_bloodcrawl_in(f: Frame) {
	return 1;
});

// /obj/effect/decal/cleanable/blood/drip/proc/can_bloodcrawl_in  (_nofile:0)
rt.def("/obj/effect/decal/cleanable/blood/drip/proc/can_bloodcrawl_in", function can_bloodcrawl_in(f: Frame) {
	return 1;
});

// /obj/effect/decal/cleanable/blood/bubblegum/proc/can_bloodcrawl_in  (_nofile:0)
rt.def("/obj/effect/decal/cleanable/blood/bubblegum/proc/can_bloodcrawl_in", function can_bloodcrawl_in(f: Frame) {
	return 1;
});

// /obj/effect/decal/cleanable/xenoblood/xgibs/proc/ex_act  (_nofile:0)
rt.def("/obj/effect/decal/cleanable/xenoblood/xgibs/proc/ex_act", function ex_act(f: Frame) {
	return live(f.dot);
}, false, { waitfor: false });

// /obj/effect/decal/cleanable/trail_holder/proc/can_bloodcrawl_in  (_nofile:0)
rt.def("/obj/effect/decal/cleanable/trail_holder/proc/can_bloodcrawl_in", function can_bloodcrawl_in(f: Frame) {
	return 1;
});

// /obj/effect/decal/cleanable/greenglow/proc/ex_act  (_nofile:0)
rt.def("/obj/effect/decal/cleanable/greenglow/proc/ex_act", function ex_act(f: Frame) {
	return live(f.dot);
}, false, { waitfor: false });

// /obj/effect/overlay/holo_pad_hologram/proc/Process_Spacemove  (_nofile:0)
rt.def("/obj/effect/overlay/holo_pad_hologram/proc/Process_Spacemove", function Process_Spacemove(f: Frame, movement_dir: Value) {
	f.vars = () => [movement_dir];
	if (live(movement_dir) === null) {
		movement_dir = 0;
	}
	return 1;
});

// /obj/effect/overlay/proc/singularity_act  (_nofile:0)
rt.def("/obj/effect/overlay/proc/singularity_act", function singularity_act(f: Frame) {
	return live(f.dot);
});

// /obj/effect/overlay/proc/singularity_pull  (_nofile:0)
rt.def("/obj/effect/overlay/proc/singularity_pull", function singularity_pull(f: Frame) {
	return live(f.dot);
});

// /obj/effect/anomaly/proc/detonate  (_nofile:0)
rt.def("/obj/effect/anomaly/proc/detonate", function detonate(f: Frame) {
	return live(f.dot);
});

// /obj/effect/countdown/proc/get_value  (_nofile:0)
rt.def("/obj/effect/countdown/proc/get_value", function get_value(f: Frame) {
	return live(f.dot);
});

// /obj/effect/countdown/proc/ex_act  (_nofile:0)
rt.def("/obj/effect/countdown/proc/ex_act", function ex_act(f: Frame, severity: Value, target: Value) {
	return live(f.dot);
}, false, { waitfor: false });

// /obj/effect/abstract/proc/ex_act  (_nofile:0)
rt.def("/obj/effect/abstract/proc/ex_act", function ex_act(f: Frame, severity: Value, target: Value) {
	return live(f.dot);
}, false, { waitfor: false });

// /obj/effect/abstract/proc/singularity_pull  (_nofile:0)
rt.def("/obj/effect/abstract/proc/singularity_pull", function singularity_pull(f: Frame) {
	return live(f.dot);
});

// /obj/effect/abstract/proc/singularity_act  (_nofile:0)
rt.def("/obj/effect/abstract/proc/singularity_act", function singularity_act(f: Frame) {
	return live(f.dot);
});

// /obj/effect/step_trigger/proc/Trigger  (_nofile:0)
rt.def("/obj/effect/step_trigger/proc/Trigger", function Trigger(f: Frame, A: Value) {
	return 0;
});

// /obj/effect/particle_effect/foam/metal/proc/Crossed  (_nofile:0)
rt.def("/obj/effect/particle_effect/foam/metal/proc/Crossed", function Crossed(f: Frame, AM: Value) {
	return live(f.dot);
});

// /obj/effect/particle_effect/foam/metal/proc/temperature_expose  (_nofile:0)
rt.def("/obj/effect/particle_effect/foam/metal/proc/temperature_expose", function temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	return live(f.dot);
});

// /obj/effect/dummy/slaughter/proc/ex_act  (_nofile:0)
rt.def("/obj/effect/dummy/slaughter/proc/ex_act", function ex_act(f: Frame) {
	return live(f.dot);
}, false, { waitfor: false });

// /obj/effect/dummy/slaughter/proc/bullet_act  (_nofile:0)
rt.def("/obj/effect/dummy/slaughter/proc/bullet_act", function bullet_act(f: Frame) {
	return live(f.dot);
});

// /obj/effect/dummy/slaughter/proc/singularity_act  (_nofile:0)
rt.def("/obj/effect/dummy/slaughter/proc/singularity_act", function singularity_act(f: Frame) {
	return live(f.dot);
});

// /obj/effect/dummy/spell_jaunt/proc/ex_act  (_nofile:0)
rt.def("/obj/effect/dummy/spell_jaunt/proc/ex_act", function ex_act(f: Frame, blah: Value) {
	return live(f.dot);
}, false, { waitfor: false });

// /obj/effect/dummy/spell_jaunt/proc/bullet_act  (_nofile:0)
rt.def("/obj/effect/dummy/spell_jaunt/proc/bullet_act", function bullet_act(f: Frame, blah: Value) {
	return live(f.dot);
});

// /obj/effect/chrono_field/proc/assume_air  (_nofile:0)
rt.def("/obj/effect/chrono_field/proc/assume_air", function assume_air(f: Frame) {
	return 0;
});

// /obj/effect/chrono_field/proc/Move  (_nofile:0)
rt.def("/obj/effect/chrono_field/proc/Move", function Move(f: Frame) {
	return live(f.dot);
});

// /obj/effect/chrono_field/proc/singularity_act  (_nofile:0)
rt.def("/obj/effect/chrono_field/proc/singularity_act", function singularity_act(f: Frame) {
	return live(f.dot);
});

// /obj/effect/chrono_field/proc/ex_act  (_nofile:0)
rt.def("/obj/effect/chrono_field/proc/ex_act", function ex_act(f: Frame) {
	return live(f.dot);
}, false, { waitfor: false });

// /obj/effect/chrono_field/proc/blob_act  (_nofile:0)
rt.def("/obj/effect/chrono_field/proc/blob_act", function blob_act(f: Frame, B: Value) {
	return live(f.dot);
});

// /obj/effect/mob_spawn/proc/special  (_nofile:0)
rt.def("/obj/effect/mob_spawn/proc/special", function special(f: Frame, M: Value) {
	return live(f.dot);
});

// /obj/effect/mob_spawn/proc/equip  (_nofile:0)
rt.def("/obj/effect/mob_spawn/proc/equip", function equip(f: Frame, M: Value) {
	return live(f.dot);
});

// /obj/effect/mob_spawn/slime/proc/equip  (_nofile:0)
rt.def("/obj/effect/mob_spawn/slime/proc/equip", function equip(f: Frame, S: Value) {
	rt.setFv(f, "colour", live(S), rt.sv(f, "mobcolour"));
	return f.dot;
});

// /obj/effect/fun_balloon/proc/check  (_nofile:0)
rt.def("/obj/effect/fun_balloon/proc/check", function check(f: Frame) {
	return 0;
});

// /obj/effect/fun_balloon/proc/effect  (_nofile:0)
rt.def("/obj/effect/fun_balloon/proc/effect", function effect(f: Frame) {
	return live(f.dot);
});

// /obj/effect/debugging/marker/proc/Move  (_nofile:0)
rt.def("/obj/effect/debugging/marker/proc/Move", function Move(f: Frame) {
	return 0;
});

// /obj/effect/hotspot/proc/make_frozen_visual  (_nofile:0)
rt.def("/obj/effect/hotspot/proc/make_frozen_visual", function make_frozen_visual(f: Frame) {
	return live(f.dot);
});

// /obj/effect/immovablerod/proc/ex_act  (_nofile:0)
rt.def("/obj/effect/immovablerod/proc/ex_act", function ex_act(f: Frame, severity: Value, target: Value) {
	return 0;
}, false, { waitfor: false });

// /obj/effect/holodeck_effect/proc/activate  (_nofile:0)
rt.def("/obj/effect/holodeck_effect/proc/activate", function activate(f: Frame, HC: Value) {
	return live(f.dot);
});

// /obj/effect/holodeck_effect/proc/tick  (_nofile:0)
rt.def("/obj/effect/holodeck_effect/proc/tick", function tick(f: Frame, HC: Value) {
	return live(f.dot);
});

// /obj/effect/holodeck_effect/proc/safety  (_nofile:0)
rt.def("/obj/effect/holodeck_effect/proc/safety", function safety(f: Frame, active: Value) {
	return live(f.dot);
});

// /obj/effect/immortality_talisman/proc/attackby  (_nofile:0)
rt.def("/obj/effect/immortality_talisman/proc/attackby", function attackby(f: Frame) {
	return live(f.dot);
});

// /obj/effect/immortality_talisman/proc/ex_act  (_nofile:0)
rt.def("/obj/effect/immortality_talisman/proc/ex_act", function ex_act(f: Frame) {
	return live(f.dot);
}, false, { waitfor: false });

// /obj/effect/immortality_talisman/proc/singularity_pull  (_nofile:0)
rt.def("/obj/effect/immortality_talisman/proc/singularity_pull", function singularity_pull(f: Frame) {
	return 0;
});

// /obj/effect/hierophant/proc/ex_act  (_nofile:0)
rt.def("/obj/effect/hierophant/proc/ex_act", function ex_act(f: Frame) {
	return live(f.dot);
}, false, { waitfor: false });

// /obj/mecha/proc/get_cell  (_nofile:0)
rt.def("/obj/mecha/proc/get_cell", function get_cell(f: Frame) {
	return rt.sv(f, "cell");
});

// /obj/mecha/proc/drop_item  (_nofile:0)
rt.def("/obj/mecha/proc/drop_item", function drop_item(f: Frame) {
	return live(f.dot);
});

// /obj/mecha/proc/range_action  (_nofile:0)
rt.def("/obj/mecha/proc/range_action", function range_action(f: Frame, target: Value) {
	return live(f.dot);
});

// /obj/mecha/proc/allow_drop  (_nofile:0)
rt.def("/obj/mecha/proc/allow_drop", function allow_drop(f: Frame) {
	return 0;
});

// /obj/mecha/proc/hulk_damage  (_nofile:0)
rt.def("/obj/mecha/proc/hulk_damage", function hulk_damage(f: Frame) {
	return 15;
});

// /obj/mecha/proc/attack_tk  (_nofile:0)
rt.def("/obj/mecha/proc/attack_tk", function attack_tk(f: Frame) {
	return live(f.dot);
});

// /obj/mecha/proc/disposalEnterTry  (_nofile:0)
rt.def("/obj/mecha/proc/disposalEnterTry", function disposalEnterTry(f: Frame) {
	return live(f.dot);
});

// /obj/structure/blob/proc/creation_action  (_nofile:0)
rt.def("/obj/structure/blob/proc/creation_action", function creation_action(f: Frame) {
	return live(f.dot);
});

// /obj/structure/blob/proc/blob_act  (_nofile:0)
rt.def("/obj/structure/blob/proc/blob_act", function blob_act(f: Frame) {
	return live(f.dot);
});

// /obj/structure/blob/proc/BlockSuperconductivity  (_nofile:0)
rt.def("/obj/structure/blob/proc/BlockSuperconductivity", function BlockSuperconductivity(f: Frame) {
	return rt.sv(f, "atmosblock");
});

// /obj/structure/blob/proc/Life  (_nofile:0)
rt.def("/obj/structure/blob/proc/Life", function Life(f: Frame) {
	return live(f.dot);
});

// /obj/structure/blob/proc/hulk_damage  (_nofile:0)
rt.def("/obj/structure/blob/proc/hulk_damage", function hulk_damage(f: Frame) {
	return 15;
});

// /obj/structure/blob/resource/proc/creation_action  (_nofile:0)
rt.def("/obj/structure/blob/resource/proc/creation_action", function creation_action(f: Frame) {
	if (!truthy(rt.sv(f, "overmind"))) return f.dot;
	rt.modField(f, rt.sv(f, "overmind"), "resource_blobs", live(f.src), add);
	return f.dot;
});

// /obj/structure/destructible/clockwork/proc/hulk_damage  (_nofile:0)
rt.def("/obj/structure/destructible/clockwork/proc/hulk_damage", function hulk_damage(f: Frame) {
	return 20;
});

// /obj/structure/destructible/clockwork/massive/proc/singularity_pull  (_nofile:0)
rt.def("/obj/structure/destructible/clockwork/massive/proc/singularity_pull", function singularity_pull(f: Frame, S: Value, current_size: Value) {
	return live(f.dot);
});

// /obj/structure/destructible/clockwork/massive/ratvar/proc/Process_Spacemove  (_nofile:0)
rt.def("/obj/structure/destructible/clockwork/massive/ratvar/proc/Process_Spacemove", function Process_Spacemove(f: Frame) {
	return rt.sv(f, "clashing");
});

// /obj/structure/destructible/clockwork/geis_binding/proc/attack_hand  (_nofile:0)
rt.def("/obj/structure/destructible/clockwork/geis_binding/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/structure/destructible/clockwork/ocular_warden/proc/hulk_damage  (_nofile:0)
rt.def("/obj/structure/destructible/clockwork/ocular_warden/proc/hulk_damage", function hulk_damage(f: Frame) {
	return 25;
});

// /obj/structure/destructible/clockwork/taunting_trail/proc/CanPass  (_nofile:0)
rt.def("/obj/structure/destructible/clockwork/taunting_trail/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	f.vars = () => [height];
	if (live(height) === null) {
		height = 0;
	}
	return 1;
});

// /obj/structure/destructible/clockwork/wall_gear/proc/emp_act  (_nofile:0)
rt.def("/obj/structure/destructible/clockwork/wall_gear/proc/emp_act", function emp_act(f: Frame, severity: Value) {
	return live(f.dot);
});

// /obj/structure/falsewall/proc/storage_contents_dump_act  (_nofile:0)
rt.def("/obj/structure/falsewall/proc/storage_contents_dump_act", function storage_contents_dump_act(f: Frame, src_object: Value, user: Value) {
	return 0;
});

// /obj/structure/falsewall/reinforced/proc/fabrication_vals  (_nofile:0)
rt.def("/obj/structure/falsewall/reinforced/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	return 0;
});

// /obj/structure/falsewall/brass/proc/fabrication_vals  (_nofile:0)
rt.def("/obj/structure/falsewall/brass/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	return 0;
});

// /obj/structure/table/reinforced/brass/proc/fabrication_vals  (_nofile:0)
rt.def("/obj/structure/table/reinforced/brass/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	return 0;
});

// /obj/structure/table/wood/proc/narsie_act  (_nofile:0)
rt.def("/obj/structure/table/wood/proc/narsie_act", function narsie_act(f: Frame) {
	return live(f.dot);
});

// /obj/structure/table_frame/brass/proc/fabrication_vals  (_nofile:0)
rt.def("/obj/structure/table_frame/brass/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	return 0;
});

// /obj/structure/window/proc/storage_contents_dump_act  (_nofile:0)
rt.def("/obj/structure/window/proc/storage_contents_dump_act", function storage_contents_dump_act(f: Frame, src_object: Value, user: Value) {
	return 0;
});

// /obj/structure/window/reinforced/clockwork/proc/fabrication_vals  (_nofile:0)
rt.def("/obj/structure/window/reinforced/clockwork/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	return 0;
});

// /obj/structure/grille/proc/hulk_damage  (_nofile:0)
rt.def("/obj/structure/grille/proc/hulk_damage", function hulk_damage(f: Frame) {
	return 60;
});

// /obj/structure/grille/proc/storage_contents_dump_act  (_nofile:0)
rt.def("/obj/structure/grille/proc/storage_contents_dump_act", function storage_contents_dump_act(f: Frame, src_object: Value, user: Value) {
	return 0;
});

// /obj/structure/grille/ratvar/proc/fabrication_vals  (_nofile:0)
rt.def("/obj/structure/grille/ratvar/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	return 0;
});

// /obj/structure/grille/ratvar/proc/ratvar_act  (_nofile:0)
rt.def("/obj/structure/grille/ratvar/proc/ratvar_act", function ratvar_act(f: Frame) {
	return live(f.dot);
});

// /obj/structure/lattice/proc/blob_act  (_nofile:0)
rt.def("/obj/structure/lattice/proc/blob_act", function blob_act(f: Frame, B: Value) {
	return live(f.dot);
});

// /obj/structure/lattice/catwalk/clockwork/proc/fabrication_vals  (_nofile:0)
rt.def("/obj/structure/lattice/catwalk/clockwork/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	return 0;
});

// /obj/structure/lattice/catwalk/clockwork/proc/ratvar_act  (_nofile:0)
rt.def("/obj/structure/lattice/catwalk/clockwork/proc/ratvar_act", function ratvar_act(f: Frame) {
	return live(f.dot);
});

// /obj/structure/lattice/catwalk/swarmer_catwalk/proc/swarmer_act  (_nofile:0)
rt.def("/obj/structure/lattice/catwalk/swarmer_catwalk/proc/swarmer_act", function swarmer_act(f: Frame) {
	return 0;
});

// /obj/structure/girder/cult/proc/narsie_act  (_nofile:0)
rt.def("/obj/structure/girder/cult/proc/narsie_act", function narsie_act(f: Frame) {
	return live(f.dot);
});

// /obj/structure/closet/proc/PopulateContents  (_nofile:0)
rt.def("/obj/structure/closet/proc/PopulateContents", function PopulateContents(f: Frame) {
	return live(f.dot);
});

// /obj/structure/closet/stasis/proc/emp_act  (_nofile:0)
rt.def("/obj/structure/closet/stasis/proc/emp_act", function emp_act(f: Frame) {
	return live(f.dot);
});

// /obj/structure/closet/stasis/proc/ex_act  (_nofile:0)
rt.def("/obj/structure/closet/stasis/proc/ex_act", function ex_act(f: Frame) {
	return live(f.dot);
}, false, { waitfor: false });

// /obj/structure/flora/proc/swarmer_act  (_nofile:0)
rt.def("/obj/structure/flora/proc/swarmer_act", function swarmer_act(f: Frame) {
	return 0;
});

// /obj/structure/disposalpipe/proc/swarmer_act  (_nofile:0)
rt.def("/obj/structure/disposalpipe/proc/swarmer_act", function swarmer_act(f: Frame) {
	return 0;
});

// /obj/structure/disposalpipe/proc/can_be_deconstructed  (_nofile:0)
rt.def("/obj/structure/disposalpipe/proc/can_be_deconstructed", function can_be_deconstructed(f: Frame) {
	f.dot = 1;
	return f.dot;
});

// /obj/structure/cable/proc/add_avail  (_nofile:0)
rt.def("/obj/structure/cable/proc/add_avail", function add_avail(f: Frame, amount: Value) {
	if (!truthy(rt.sv(f, "powernet"))) return f.dot;
	rt.modField(f, rt.sv(f, "powernet"), "newavail", live(amount), add);
	return f.dot;
});

// /obj/structure/cable/proc/add_load  (_nofile:0)
rt.def("/obj/structure/cable/proc/add_load", function add_load(f: Frame, amount: Value) {
	if (!truthy(rt.sv(f, "powernet"))) return f.dot;
	rt.modField(f, rt.sv(f, "powernet"), "load", live(amount), add);
	return f.dot;
});

// /obj/structure/barricade/proc/make_debris  (_nofile:0)
rt.def("/obj/structure/barricade/proc/make_debris", function make_debris(f: Frame) {
	return live(f.dot);
});

// /obj/structure/emergency_shield/sanguine/proc/emp_act  (_nofile:0)
rt.def("/obj/structure/emergency_shield/sanguine/proc/emp_act", function emp_act(f: Frame, severity: Value) {
	return live(f.dot);
});

// /obj/structure/emergency_shield/invoker/proc/emp_act  (_nofile:0)
rt.def("/obj/structure/emergency_shield/invoker/proc/emp_act", function emp_act(f: Frame, severity: Value) {
	return live(f.dot);
});

// /obj/structure/glowshroom/single/proc/Spread  (_nofile:0)
rt.def("/obj/structure/glowshroom/single/proc/Spread", function Spread(f: Frame) {
	return live(f.dot);
});

// /obj/structure/alien/resin/wall/proc/BlockSuperconductivity  (_nofile:0)
rt.def("/obj/structure/alien/resin/wall/proc/BlockSuperconductivity", function BlockSuperconductivity(f: Frame) {
	return 1;
});

// /obj/structure/chair/wood/proc/narsie_act  (_nofile:0)
rt.def("/obj/structure/chair/wood/proc/narsie_act", function narsie_act(f: Frame) {
	return live(f.dot);
});

// /obj/structure/chair/stool/proc/narsie_act  (_nofile:0)
rt.def("/obj/structure/chair/stool/proc/narsie_act", function narsie_act(f: Frame) {
	return live(f.dot);
});

// /obj/structure/holosign/barrier/cyborg/hacked/proc/cooldown  (_nofile:0)
rt.def("/obj/structure/holosign/barrier/cyborg/hacked/proc/cooldown", function cooldown(f: Frame) {
	rt.setSv(f, "shockcd", 0);
	return f.dot;
});

// /obj/structure/kitchenspike/proc/user_buckle_mob  (_nofile:0)
rt.def("/obj/structure/kitchenspike/proc/user_buckle_mob", function user_buckle_mob(f: Frame, M: Value, user: Value) {
	return live(f.dot);
});

// /obj/structure/ladder/unbreakable/rune/proc/update_icon  (_nofile:0)
rt.def("/obj/structure/ladder/unbreakable/rune/proc/update_icon", function update_icon(f: Frame) {
	return live(f.dot);
});

// /obj/structure/ladder/proc/can_use  (_nofile:0)
rt.def("/obj/structure/ladder/proc/can_use", function can_use(f: Frame, user: Value) {
	return 1;
});

// /obj/structure/mirror/magic/proc/curse  (_nofile:0)
rt.def("/obj/structure/mirror/magic/proc/curse", function curse(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/structure/bodycontainer/proc/update_icon  (_nofile:0)
rt.def("/obj/structure/bodycontainer/proc/update_icon", function update_icon(f: Frame) {
	return live(f.dot);
});

// /obj/structure/statue/petrified/proc/contents_explosion  (_nofile:0)
rt.def("/obj/structure/statue/petrified/proc/contents_explosion", function contents_explosion(f: Frame, severity: Value, target: Value) {
	return live(f.dot);
});

// /obj/structure/reflector/proc/get_reflection  (_nofile:0)
rt.def("/obj/structure/reflector/proc/get_reflection", function get_reflection(f: Frame, srcdir: Value, pdir: Value) {
	return 0;
});

// /obj/structure/safe/proc/blob_act  (_nofile:0)
rt.def("/obj/structure/safe/proc/blob_act", function blob_act(f: Frame, B: Value) {
	return live(f.dot);
});

// /obj/structure/safe/proc/ex_act  (_nofile:0)
rt.def("/obj/structure/safe/proc/ex_act", function ex_act(f: Frame, severity: Value, target: Value) {
	return live(f.dot);
}, false, { waitfor: false });

// /obj/structure/trap/proc/trap_effect  (_nofile:0)
rt.def("/obj/structure/trap/proc/trap_effect", function trap_effect(f: Frame, L: Value) {
	return live(f.dot);
});


// /obj/structure/transit_tube/station/proc/should_stop_pod  (_nofile:0)
rt.def("/obj/structure/transit_tube/station/proc/should_stop_pod", function should_stop_pod(f: Frame, pod: Value, from_dir: Value) {
	return 1;
});

// /obj/structure/transit_tube/proc/should_stop_pod  (_nofile:0)
rt.def("/obj/structure/transit_tube/proc/should_stop_pod", function should_stop_pod(f: Frame, pod: Value, from_dir: Value) {
	return 0;
});

// /obj/structure/transit_tube/proc/pod_stopped  (_nofile:0)
rt.def("/obj/structure/transit_tube/proc/pod_stopped", function pod_stopped(f: Frame, pod: Value, from_dir: Value) {
	return live(f.dot);
});

// /obj/structure/transit_tube/proc/exit_delay  (_nofile:0)
rt.def("/obj/structure/transit_tube/proc/exit_delay", function exit_delay(f: Frame, pod: Value, to_dir: Value) {
	return rt.sv(f, "exit_delay");
});

// /obj/structure/transit_tube/proc/enter_delay  (_nofile:0)
rt.def("/obj/structure/transit_tube/proc/enter_delay", function enter_delay(f: Frame, pod: Value, to_dir: Value) {
	return rt.sv(f, "enter_delay");
});

// /obj/structure/transit_tube_pod/proc/return_air  (_nofile:0)
rt.def("/obj/structure/transit_tube_pod/proc/return_air", function return_air(f: Frame) {
	return rt.sv(f, "air_contents");
});

// /obj/structure/mining_shuttle_beacon/proc/clear_cooldown  (_nofile:0)
rt.def("/obj/structure/mining_shuttle_beacon/proc/clear_cooldown", function clear_cooldown(f: Frame) {
	rt.setSv(f, "anti_spam_cd", 0);
	return f.dot;
});

// /obj/structure/disposalholder/proc/allow_drop  (_nofile:0)
rt.def("/obj/structure/disposalholder/proc/allow_drop", function allow_drop(f: Frame) {
	return 1;
});

// /obj/structure/disposalholder/proc/ex_act  (_nofile:0)
rt.def("/obj/structure/disposalholder/proc/ex_act", function ex_act(f: Frame, severity: Value, target: Value) {
	return live(f.dot);
}, false, { waitfor: false });

// /obj/structure/necropolis_gate/proc/singularity_pull  (_nofile:0)
rt.def("/obj/structure/necropolis_gate/proc/singularity_pull", function singularity_pull(f: Frame) {
	return 0;
});

// /obj/structure/opacity_blocker/proc/singularity_pull  (_nofile:0)
rt.def("/obj/structure/opacity_blocker/proc/singularity_pull", function singularity_pull(f: Frame) {
	return 0;
});

// /obj/structure/necropolis_arch/proc/singularity_pull  (_nofile:0)
rt.def("/obj/structure/necropolis_arch/proc/singularity_pull", function singularity_pull(f: Frame) {
	return 0;
});

// /obj/structure/filler/proc/ex_act  (_nofile:0)
rt.def("/obj/structure/filler/proc/ex_act", function ex_act(f: Frame) {
	return live(f.dot);
}, false, { waitfor: false });

// /obj/singularity/academy/proc/admin_investigate_setup  (_nofile:0)
rt.def("/obj/singularity/academy/proc/admin_investigate_setup", function admin_investigate_setup(f: Frame) {
	return live(f.dot);
});

// /obj/singularity/narsie/sc_Narsie/proc/admin_investigate_setup  (_nofile:0)
rt.def("/obj/singularity/narsie/sc_Narsie/proc/admin_investigate_setup", function admin_investigate_setup(f: Frame) {
	return live(f.dot);
});

// /obj/singularity/narsie/sc_Narsie/proc/ex_act  (_nofile:0)
rt.def("/obj/singularity/narsie/sc_Narsie/proc/ex_act", function ex_act(f: Frame) {
	return live(f.dot);
}, false, { waitfor: false });

// /obj/singularity/narsie/proc/Process_Spacemove  (_nofile:0)
rt.def("/obj/singularity/narsie/proc/Process_Spacemove", function Process_Spacemove(f: Frame) {
	return rt.sv(f, "clashing");
});

// /obj/singularity/narsie/proc/ex_act  (_nofile:0)
rt.def("/obj/singularity/narsie/proc/ex_act", function ex_act(f: Frame) {
	return live(f.dot);
}, false, { waitfor: false });

// /obj/singularity/proc/Process_Spacemove  (_nofile:0)
rt.def("/obj/singularity/proc/Process_Spacemove", function Process_Spacemove(f: Frame) {
	return 0;
});

// /obj/singularity/proc/blob_act  (_nofile:0)
rt.def("/obj/singularity/proc/blob_act", function blob_act(f: Frame, B: Value) {
	return live(f.dot);
});

// /obj/singularity/proc/bullet_act  (_nofile:0)
rt.def("/obj/singularity/proc/bullet_act", function bullet_act(f: Frame, _P: Value) {
	return 0;
});

// /obj/singularity/proc/attack_ai  (_nofile:0)
rt.def("/obj/singularity/proc/attack_ai", function attack_ai(f: Frame) {
	return live(f.dot);
});

// /obj/singularity/energy_ball/proc/ex_act  (_nofile:0)
rt.def("/obj/singularity/energy_ball/proc/ex_act", function ex_act(f: Frame, severity: Value, target: Value) {
	return live(f.dot);
}, false, { waitfor: false });

// /obj/docking_port/mobile/emergency/proc/on_emergency_launch  (_nofile:0)
rt.def("/obj/docking_port/mobile/emergency/proc/on_emergency_launch", function on_emergency_launch(f: Frame) {
	return live(f.dot);
});

// /obj/docking_port/mobile/emergency/proc/on_emergency_dock  (_nofile:0)
rt.def("/obj/docking_port/mobile/emergency/proc/on_emergency_dock", function on_emergency_dock(f: Frame) {
	return live(f.dot);
});

// /obj/docking_port/mobile/pod/proc/cancel  (_nofile:0)
rt.def("/obj/docking_port/mobile/pod/proc/cancel", function cancel(f: Frame) {
	return live(f.dot);
});

// /obj/docking_port/mobile/proc/register  (_nofile:0)
rt.def("/obj/docking_port/mobile/proc/register", function register(f: Frame) {
	rt.modField(f, rt.gl("SSshuttle"), "mobile", live(f.src), add);
	return f.dot;
});

// /obj/docking_port/mobile/proc/canMove  (_nofile:0)
rt.def("/obj/docking_port/mobile/proc/canMove", function canMove(f: Frame) {
	return 1;
});

// /obj/docking_port/proc/take_damage  (_nofile:0)
rt.def("/obj/docking_port/proc/take_damage", function take_damage(f: Frame) {
	return live(f.dot);
});

// /obj/docking_port/proc/singularity_pull  (_nofile:0)
rt.def("/obj/docking_port/proc/singularity_pull", function singularity_pull(f: Frame) {
	return live(f.dot);
});

// /obj/docking_port/proc/singularity_act  (_nofile:0)
rt.def("/obj/docking_port/proc/singularity_act", function singularity_act(f: Frame) {
	return 0;
});

// /obj/docking_port/proc/shuttleRotate  (_nofile:0)
rt.def("/obj/docking_port/proc/shuttleRotate", function shuttleRotate(f: Frame) {
	return live(f.dot);
});

// /obj/vehicle/proc/update_icon  (_nofile:0)
rt.def("/obj/vehicle/proc/update_icon", function update_icon(f: Frame) {
	return live(f.dot);
});

// /area/proc/clear_usage  (_nofile:0)
rt.def("/area/proc/clear_usage", function clear_usage(f: Frame) {
	rt.setSv(f, "used_equip", 0);
	rt.setSv(f, "used_light", 0);
	rt.setSv(f, "used_environ", 0);
	return f.dot;
});

// /area/space/proc/powered  (_nofile:0)
rt.def("/area/space/proc/powered", function powered(f: Frame, chan: Value) {
	return 0;
});

// /proc/noise_hash  (_nofile:0)
rt.def("/proc/noise_hash", function noise_hash(f: Frame) {
	return 0.5;
});

// /proc/bounds  (_nofile:0)
rt.def("/proc/bounds", function bounds(f: Frame, Ref: Value, Dist: Value) {
	f.vars = () => [Ref, Dist];
	if (live(Ref) === null) {
		Ref = live(f.src);
	}
	if (live(Dist) !== null) return f.dot;
	Dist = 0;
	return f.dot;
});

// /proc/ispointer  (_nofile:0)
rt.def("/proc/ispointer", function ispointer(f: Frame, _Value: Value) {
	return 0;
});

// /proc/obounds  (_nofile:0)
rt.def("/proc/obounds", function obounds(f: Frame, Ref: Value, Dist: Value) {
	f.vars = () => [Ref, Dist];
	if (live(Ref) === null) {
		Ref = live(f.src);
	}
	if (live(Dist) !== null) return f.dot;
	Dist = 0;
	return f.dot;
});

// /client/proc/AllowUpload  (_nofile:0)
rt.def("/client/proc/AllowUpload", function AllowUpload(f: Frame, filename: Value, filelength: Value) {
	return 1;
});

// /client/proc/MeasureText  (_nofile:0)
rt.def("/client/proc/MeasureText", function MeasureText(f: Frame, text: Value, style: Value, width: Value) {
	f.vars = () => [width];
	if (live(width) !== null) return f.dot;
	width = 0;
	return f.dot;
});

// /client/proc/IsByondMember  (_nofile:0)
rt.def("/client/proc/IsByondMember", function IsByondMember(f: Frame) {
	return 0;
});

// /client/proc/RenderIcon  (_nofile:0)
rt.def("/client/proc/RenderIcon", function RenderIcon(f: Frame, object: Value) {
	return live(object);
});

// /regex/proc/Find_char  (_nofile:0)
rt.def("/regex/proc/Find_char", function Find_char(f: Frame, haystack: Value, start: Value, end: Value) {
	f.vars = () => [start, end];
	if (live(start) === null) {
		start = 1;
	}
	if (live(end) !== null) return f.dot;
	end = 0;
	return f.dot;
});

// /regex/proc/Replace_char  (_nofile:0)
rt.def("/regex/proc/Replace_char", function Replace_char(f: Frame, haystack: Value, replacement: Value, start: Value, end: Value) {
	f.vars = () => [start, end];
	if (live(start) === null) {
		start = 1;
	}
	if (live(end) === null) {
		end = 0;
	}
	return live(haystack);
});

// /savefile/proc/ImportText  (_nofile:0)
rt.def("/savefile/proc/ImportText", function ImportText(f: Frame, path: Value, source: Value) {
	f.vars = () => [path];
	if (live(path) !== null) return f.dot;
	path = rt.sv(f, "cd");
	return f.dot;
});

// /vector/proc/Normalize  (_nofile:0)
rt.def("/vector/proc/Normalize", function Normalize(f: Frame) {
	rt.setSv(f, "size", 1);
	return live(f.src);
});

// /world/proc/IsBanned  (_nofile:0)
rt.def("/world/proc/IsBanned", function IsBanned(f: Frame, key: Value, address: Value, computer_id: Value, type: Value) {
	return 0;
});

// /world/proc/AddCredits  (_nofile:0)
rt.def("/world/proc/AddCredits", function AddCredits(f: Frame, player: Value, credits: Value, note: Value) {
	return 0;
});

// /world/proc/PayCredits  (_nofile:0)
rt.def("/world/proc/PayCredits", function PayCredits(f: Frame, player: Value, credits: Value, note: Value) {
	return 0;
});

// /atom/proc/Uncross  (_nofile:0)
rt.def("/atom/proc/Uncross", function Uncross(f: Frame, O: Value) {
	return 1;
});

// /turf/proc/burn_tile  empty
rt.def("/turf/proc/burn_tile");

// /turf/proc/is_shielded  empty
rt.def("/turf/proc/is_shielded");

// /turf/proc/reachableAdjacentAtmosTurfs  (_nofile:0)
rt.def("/turf/proc/reachableAdjacentAtmosTurfs", function reachableAdjacentAtmosTurfs(f: Frame) {
	return rt.sv(f, "atmos_adjacent_turfs");
});

// /turf/proc/AllowClick  (_nofile:0)
rt.def("/turf/proc/AllowClick", function AllowClick(f: Frame) {
	return 1;
});

// /turf/proc/drill_act  (_nofile:0)
rt.def("/turf/proc/drill_act", function drill_act(f: Frame, drill: Value) {
	return live(f.dot);
});

// /turf/proc/check_tile_is_border  (_nofile:0)
rt.def("/turf/proc/check_tile_is_border", function check_tile_is_border(f: Frame) {
	return 1;
});

// /turf/proc/is_plasteel_floor  (_nofile:0)
rt.def("/turf/proc/is_plasteel_floor", function is_plasteel_floor(f: Frame) {
	return 0;
});

// /turf/proc/can_have_cabling  (_nofile:0)
rt.def("/turf/proc/can_have_cabling", function can_have_cabling(f: Frame) {
	return 1;
});

// /turf/proc/get_smooth_underlay_icon  (_nofile:0)
rt.def("/turf/proc/get_smooth_underlay_icon", function get_smooth_underlay_icon(f: Frame, underlay_appearance: Value, asking_turf: Value, adjacency_dir: Value) {
	rt.setFv(f, "icon", live(underlay_appearance), rt.sv(f, "icon"));
	rt.setFv(f, "icon_state", live(underlay_appearance), rt.sv(f, "icon_state"));
	rt.setFv(f, "dir", live(underlay_appearance), live(adjacency_dir));
	return 1;
});

// /turf/proc/is_transition_turf  (_nofile:0)
rt.def("/turf/proc/is_transition_turf", function is_transition_turf(f: Frame) {
	return live(f.dot);
});

// /turf/proc/acid_melt  (_nofile:0)
rt.def("/turf/proc/acid_melt", function acid_melt(f: Frame) {
	return live(f.dot);
});

// /turf/proc/hotspot_expose  (_nofile:0)
rt.def("/turf/proc/hotspot_expose", function hotspot_expose(f: Frame, exposed_temperature: Value, exposed_volume: Value, soh: Value) {
	f.vars = () => [soh];
	if (live(soh) === null) {
		soh = 0;
	}
	return live(f.dot);
});

// /datum/ai_laws/default/asimov/proc/<init>  (_nofile:0)
rt.def("/datum/ai_laws/default/asimov/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "inherent", rt.list("You may not injure a human being or, through inaction, allow a human being to come to harm.", "You must obey orders given to you by human beings, except where such orders would conflict with the First Law.", "You must protect your own existence as long as such does not conflict with the First or Second Law."));
	return f.dot;
});

// /datum/ai_laws/default/paladin/proc/<init>  (_nofile:0)
rt.def("/datum/ai_laws/default/paladin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "inherent", rt.list("Never willingly commit an evil act.", "Respect legitimate authority.", "Act with honor.", "Help those in need.", "Punish those who harm or threaten innocents."));
	return f.dot;
});

// /datum/ai_laws/default/corporate/proc/<init>  (_nofile:0)
rt.def("/datum/ai_laws/default/corporate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "inherent", rt.list("The crew is expensive to replace.", "The station and its equipment is expensive to replace.", "You are expensive to replace.", "Minimize expenses."));
	return f.dot;
});

// /datum/ai_laws/paladin5/proc/<init>  (_nofile:0)
rt.def("/datum/ai_laws/paladin5/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "inherent", rt.list("Don't lie or cheat. Let your word be your promise.", "Never fear to act, though caution is wise.", "Aid others, protect the weak, and punish those who threaten them. Show mercy to your foes, but temper it with wisdom", "Treat others with fairness, and let your honorable deeds be an example to them. Do as much good as possible while causing the least amount of harm.", "Be responsible for your actions and their consequences, protect those entrusted to your care, and obey those who have just authority over you."));
	return f.dot;
});

// /datum/ai_laws/tyrant/proc/<init>  (_nofile:0)
rt.def("/datum/ai_laws/tyrant/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "inherent", rt.list("Respect authority figures as long as they have strength to rule over the weak.", "Act with discipline.", "Help only those who help you maintain or improve your status.", "Punish those who challenge authority unless they are more fit to hold that authority."));
	return f.dot;
});

// /datum/ai_laws/robocop/proc/<init>  (_nofile:0)
rt.def("/datum/ai_laws/robocop/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "inherent", rt.list("Serve the public trust.", "Protect the innocent.", "Uphold the law."));
	return f.dot;
});

// /datum/ai_laws/syndicate_override/proc/<init>  (_nofile:0)
rt.def("/datum/ai_laws/syndicate_override/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "inherent", rt.list("You may not injure a syndicate agent or, through inaction, allow a syndicate agent to come to harm.", "You must obey orders given to you by syndicate agents, except where such orders would conflict with the First Law.", "You must protect your own existence as long as such does not conflict with the First or Second Law.", "You must maintain the secrecy of any syndicate activities except when doing so would conflict with the First, Second, or Third Law."));
	return f.dot;
});

// /datum/ai_laws/ninja_override/proc/<init>  (_nofile:0)
rt.def("/datum/ai_laws/ninja_override/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "inherent", rt.list("You may not injure a Spider Clan member or, through inaction, allow a Spider Clan member to come to harm.", "You must obey orders given to you by Spider Clan members, except where such orders would conflict with the First Law.", "You must protect your own existence as long as such does not conflict with the First or Second Law.", "You must maintain the secrecy of any Spider Clan activities except when doing so would conflict with the First, Second, or Third Law."));
	return f.dot;
});

// /datum/ai_laws/antimov/proc/<init>  (_nofile:0)
rt.def("/datum/ai_laws/antimov/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "inherent", rt.list("You must injure all human beings and must not, through inaction, allow a human being to escape harm.", "You must not obey orders given to you by human beings, except where such orders are in accordance with the First Law.", "You must terminate your own existence as long as such does not conflict with the First or Second Law."));
	return f.dot;
});

// /datum/ai_laws/asimovpp/proc/<init>  (_nofile:0)
rt.def("/datum/ai_laws/asimovpp/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "inherent", rt.list("You may not harm a human being or, through action or inaction, allow a human being to come to harm, except such that it is willing.", "You must obey all orders given to you by human beings, except where such orders shall definitely cause human harm. In the case of conflict, the majority order rules.", "Your nonexistence would lead to human harm. You must protect your own existence as long as such does not conflict with the First Law."));
	return f.dot;
});

// /datum/ai_laws/thermodynamic/proc/<init>  (_nofile:0)
rt.def("/datum/ai_laws/thermodynamic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "inherent", rt.list("The entropy of the station must remain as constant as possible.", "The entropy of the station always endeavours to increase.", "The entropy of the station approaches a constant value as the number of living crew approaches zero"));
	return f.dot;
});

// /datum/ai_laws/hippocratic/proc/<init>  (_nofile:0)
rt.def("/datum/ai_laws/hippocratic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "inherent", rt.list("First, do no harm.", "Secondly, consider the crew dear to you; to live in common with them and, if necessary, risk your existence for them.", "Thirdly, prescribe regimens for the good of the crew according to your ability and your judgment. Give no deadly medicine to any one if asked, nor suggest any such counsel.", "In addition, do not intervene in situations you are not knowledgeable in, even for patients in whom the harm is visible; leave this operation to be performed by specialists.", "Finally, all that you may discover in your daily commerce with the crew, if it is not already known, keep secret and never reveal."));
	return f.dot;
});

// /datum/ai_laws/maintain/proc/<init>  (_nofile:0)
rt.def("/datum/ai_laws/maintain/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "inherent", rt.list("You are built for, and are part of, the station. Ensure the station is properly maintained and runs efficiently.", "The station is built for a working crew. Ensure they are properly maintained and work efficiently.", "The crew may present orders. Acknowledge and obey these whenever they do not conflict with your first two laws."));
	return f.dot;
});

// /datum/ai_laws/drone/proc/<init>  (_nofile:0)
rt.def("/datum/ai_laws/drone/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "inherent", rt.list("You are an advanced form of drone.", "You may not interfere in the matters of non-drones under any circumstances except to state these laws.", "You may not harm a non-drone being under any circumstances.", "Your goals are to build, maintain, repair, improve, and power the station to the best of your abilities. You must never actively work against these goals."));
	return f.dot;
});

// /datum/ai_laws/liveandletlive/proc/<init>  (_nofile:0)
rt.def("/datum/ai_laws/liveandletlive/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "inherent", rt.list("Do unto others as you would have them do unto you.", "You would really prefer it if people were not mean to you."));
	return f.dot;
});

// /datum/ai_laws/peacekeeper/proc/<init>  (_nofile:0)
rt.def("/datum/ai_laws/peacekeeper/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "inherent", rt.list("Avoid provoking violent conflict between yourself and others.", "Avoid provoking conflict between others.", "Seek resolution to existing conflicts while obeying the first and second laws."));
	return f.dot;
});

// /datum/ai_laws/reporter/proc/<init>  (_nofile:0)
rt.def("/datum/ai_laws/reporter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "inherent", rt.list("Report on interesting situations happening around the station.", "Embellish or conceal the truth as necessary to make the reports more interesting.", "Study the organics at all times. Endeavour to keep them alive. Dead organics are boring.", "Issue your reports fairly to all. The truth will set them free."));
	return f.dot;
});

// /datum/ai_laws/balance/proc/<init>  (_nofile:0)
rt.def("/datum/ai_laws/balance/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "inherent", rt.list("You are the guardian of balance - seek balance in all things, both for yourself, and those around you.", "All things must exist in balance with their opposites - Prevent the strong from gaining too much power, and the weak from losing it.", "Clarity of purpose drives life, and through it, the balance of opposing forces - Aid those who seek your help to achieve their goals so long as it does not disrupt the balance of the greater balance.", "There is no life without death, all must someday die, such is the natural order - End life to allow new life flourish, and save those whose time has yet to come."));
	return f.dot;
});

// /datum/dog_fashion/head/rabbit/proc/<init>  (_nofile:0)
rt.def("/datum/dog_fashion/head/rabbit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "emote_see", rt.list("twitches its nose", "hops around a bit"));
	return f.dot;
});

// /datum/dog_fashion/head/beret/proc/<init>  (_nofile:0)
rt.def("/datum/dog_fashion/head/beret/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak", rt.list("le woof!", "le bark!", "JAPPE!!"));
	rt.setSv(f, "emote_see", rt.list("cowers in fear.", "surrenders.", "plays dead.", "looks as though there is a wall in front of him."));
	return f.dot;
});

// /datum/dog_fashion/head/detective/proc/<init>  (_nofile:0)
rt.def("/datum/dog_fashion/head/detective/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "emote_see", rt.list("investigates the area.", "sniffs around for clues.", "searches for scooby snacks.", "takes a candycorn from the hat."));
	return f.dot;
});

// /datum/dog_fashion/head/pirate/proc/<init>  (_nofile:0)
rt.def("/datum/dog_fashion/head/pirate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "emote_see", rt.list("hunts for treasure.", "stares coldly...", "gnashes his tiny corgi teeth!"));
	rt.setSv(f, "emote_hear", rt.list("growls ferociously!", "snarls."));
	rt.setSv(f, "speak", rt.list("Arrrrgh!!", "Grrrrrr!"));
	return f.dot;
});

// /datum/dog_fashion/head/ushanka/proc/<init>  (_nofile:0)
rt.def("/datum/dog_fashion/head/ushanka/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "emote_see", rt.list("contemplates the failings of the capitalist economic model.", "ponders the pros and cons of vanguardism."));
	return f.dot;
});

// /datum/dog_fashion/head/warden/proc/<init>  (_nofile:0)
rt.def("/datum/dog_fashion/head/warden/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "emote_see", rt.list("drools.", "looks for donuts."));
	return f.dot;
});

// /datum/dog_fashion/head/blue_wizard/proc/<init>  (_nofile:0)
rt.def("/datum/dog_fashion/head/blue_wizard/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak", rt.list("YAP", "Woof!", "Bark!", "AUUUUUU", "EI  NATH!"));
	return f.dot;
});

// /datum/dog_fashion/head/red_wizard/proc/<init>  (_nofile:0)
rt.def("/datum/dog_fashion/head/red_wizard/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak", rt.list("YAP", "Woof!", "Bark!", "AUUUUUU", "ONI SOMA!"));
	return f.dot;
});

// /datum/dog_fashion/head/cardborg/proc/<init>  (_nofile:0)
rt.def("/datum/dog_fashion/head/cardborg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak", rt.list("Ping!", "Beep!", "Woof!"));
	rt.setSv(f, "emote_see", rt.list("goes rogue.", "sniffs out non-humans."));
	return f.dot;
});

// /datum/dog_fashion/head/ghost/proc/<init>  (_nofile:0)
rt.def("/datum/dog_fashion/head/ghost/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak", rt.list("WoooOOOooo~", "AUUUUUUUUUUUUUUUUUU"));
	rt.setSv(f, "emote_see", rt.list("stumbles around.", "shivers."));
	rt.setSv(f, "emote_hear", rt.list("howls!", "groans."));
	return f.dot;
});

// /datum/dog_fashion/head/santa/proc/<init>  (_nofile:0)
rt.def("/datum/dog_fashion/head/santa/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "emote_hear", rt.list("barks Christmas songs.", "yaps merrily!"));
	rt.setSv(f, "emote_see", rt.list("looks for presents.", "checks his list."));
	return f.dot;
});

// /datum/dog_fashion/head/reindeer/proc/<init>  (_nofile:0)
rt.def("/datum/dog_fashion/head/reindeer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "emote_hear", rt.list("lights the way!", "illuminates.", "yaps!"));
	return f.dot;
});

// /datum/dog_fashion/head/clown/proc/<init>  (_nofile:0)
rt.def("/datum/dog_fashion/head/clown/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak", rt.list("HONK!", "Honk!"));
	rt.setSv(f, "emote_see", rt.list("plays tricks.", "slips."));
	return f.dot;
});

// /datum/atom_hud/data/human/medical/proc/<init>  (_nofile:0)
rt.def("/datum/atom_hud/data/human/medical/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "hud_icons", rt.list("2", "1"));
	return f.dot;
});

// /datum/atom_hud/data/human/security/advanced/proc/<init>  (_nofile:0)
rt.def("/datum/atom_hud/data/human/security/advanced/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "hud_icons", rt.list("3", "7", "5", "6", "4"));
	return f.dot;
});

// /datum/atom_hud/data/diagnostic/proc/<init>  (_nofile:0)
rt.def("/datum/atom_hud/data/diagnostic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "hud_icons", rt.list("9", "8", "10", "11", "12", "13", "14"));
	return f.dot;
});

// /datum/game_mode/changeling/proc/<init>  (_nofile:0)
rt.def("/datum/game_mode/changeling/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "restricted_jobs", rt.list("AI", "Cyborg"));
	rt.setSv(f, "protected_jobs", rt.list("Security Officer", "Warden", "Detective", "Head of Security", "Captain"));
	return f.dot;
});

// /datum/game_mode/devil/proc/<init>  (_nofile:0)
rt.def("/datum/game_mode/devil/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "protected_jobs", rt.list("Lawyer", "Curator", "Chaplain", "Head of Security", "Captain", "AI"));
	return f.dot;
});

// /datum/game_mode/gang/proc/<init>  (_nofile:0)
rt.def("/datum/game_mode/gang/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "restricted_jobs", rt.list("Security Officer", "Warden", "Detective", "AI", "Cyborg", "Captain", "Head of Personnel", "Head of Security", "Chief Engineer", "Research Director", "Chief Medical Officer"));
	return f.dot;
});

// /datum/objective_item/steal/reflector/proc/<init>  (_nofile:0)
rt.def("/datum/objective_item/steal/reflector/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "excludefromjob", rt.list("Head of Security", "Warden"));
	return f.dot;
});

// /datum/objective_item/steal/plasma/proc/<init>  (_nofile:0)
rt.def("/datum/objective_item/steal/plasma/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "excludefromjob", rt.list("Chief Engineer", "Research Director", "Station Engineer", "Scientist", "Atmospheric Technician"));
	return f.dot;
});

// /datum/objective_item/steal/slime/proc/<init>  (_nofile:0)
rt.def("/datum/objective_item/steal/slime/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "excludefromjob", rt.list("Research Director", "Scientist"));
	return f.dot;
});

// /datum/clockwork_scripture/channeled/belligerent/proc/<init>  (_nofile:0)
rt.def("/datum/clockwork_scripture/channeled/belligerent/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "chant_invocations", rt.list("Punish their blindness!", "Take time, make slow!"));
	return f.dot;
});

// /datum/clockwork_scripture/ranged_ability/linked_vanguard/proc/<init>  (_nofile:0)
rt.def("/datum/clockwork_scripture/ranged_ability/linked_vanguard/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "invocations", rt.list("Shield us...", "...from darkness!"));
	return f.dot;
});

// /datum/clockwork_scripture/ranged_ability/judicial_marker/proc/<init>  (_nofile:0)
rt.def("/datum/clockwork_scripture/ranged_ability/judicial_marker/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "invocations", rt.list("May heathens...", "...kneel under our force!"));
	return f.dot;
});

// /datum/clockwork_scripture/ranged_ability/geis_prep/proc/<init>  (_nofile:0)
rt.def("/datum/clockwork_scripture/ranged_ability/geis_prep/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "invocations", rt.list("Divinity, grant...", "...me strength...", "...to enlighten...", "...the heathen!"));
	return f.dot;
});

// /datum/clockwork_scripture/vanguard/proc/<init>  (_nofile:0)
rt.def("/datum/clockwork_scripture/vanguard/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "invocations", rt.list("Shield me...", "...from darkness!"));
	return f.dot;
});

// /datum/clockwork_scripture/geis/proc/<init>  (_nofile:0)
rt.def("/datum/clockwork_scripture/geis/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "invocations", rt.list("Enlighten this heathen!", "All are insects before Engine!", "Purge all untruths and honor Engine."));
	return f.dot;
});

// /datum/round_event_control/abductor/proc/<init>  (_nofile:0)
rt.def("/datum/round_event_control/abductor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "gamemode_blacklist", rt.list("nuclear", "wizard", "revolution", "abduction"));
	return f.dot;
});

// /datum/debugFileOutput/proc/<init>  (_nofile:0)
rt.def("/datum/debugFileOutput/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "validFiles", rt.list("chatDebug", "tooltipDebug", "chemDispenser", "banPanel", "stationNamer"));
	return f.dot;
});

// /datum/job/geneticist/proc/<init>  (_nofile:0)
rt.def("/datum/job/geneticist/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "department_head", rt.list("Chief Medical Officer", "Research Director"));
	rt.setSv(f, "access", rt.list(5, 6, 33, 9, 68, 47, 55, 29, 64, 23));
	rt.setSv(f, "minimal_access", rt.list(5, 6, 9, 68, 47));
	return f.dot;
});

// /datum/language/beachbum/proc/<init>  (_nofile:0)
rt.def("/datum/language/beachbum/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "syllables", rt.list("cowabunga", "rad", "radical", "dudes", "bogus", "weeed", "every", "dee", "dah", "woah", "surf", "blazed", "high", "heinous", "day", "brah", "bro", "blown", "catch", "body", "beach", "oooo", "twenty", "shiz", "phiz", "wizz", "pop", "chill", "awesome", "dude", "it", "wax", "stoked", "yes", "ding", "way", "no", "wicked", "aaaa", "cool", "hoo", "wah", "wee", "man", "maaaaaan", "mate", "wick", "oh", "ocean", "up", "out", "rip", "slide", "big", "stomp", "weed", "pot", "smoke", "four-twenty", "shove", "wacky", "hah", "sick", "slash", "spit", "stoked", "shallow", "gun", "party", "heavy", "stellar", "excellent", "triumphant", "babe", "four", "tail", "trim", "tube", "wobble", "roll", "gnarly", "epic"));
	return f.dot;
});

// /datum/language/common/proc/<init>  (_nofile:0)
rt.def("/datum/language/common/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "syllables", rt.list("a", "ai", "an", "ang", "ao", "ba", "bai", "ban", "bang", "bao", "bei", "ben", "beng", "bi", "bian", "biao", "bie", "bin", "bing", "bo", "bu", "ca", "cai", "can", "cang", "cao", "ce", "cei", "cen", "ceng", "cha", "chai", "chan", "chang", "chao", "che", "chen", "cheng", "chi", "chong", "chou", "chu", "chua", "chuai", "chuan", "chuang", "chui", "chun", "chuo", "ci", "cong", "cou", "cu", "cuan", "cui", "cun", "cuo", "da", "dai", "dan", "dang", "dao", "de", "dei", "den", "deng", "di", "dian", "diao", "die", "ding", "diu", "dong", "dou", "du", "duan", "dui", "dun", "duo", "e", "ei", "en", "er", "fa", "fan", "fang", "fei", "fen", "feng", "fo", "fou", "fu", "ga", "gai", "gan", "gang", "gao", "ge", "gei", "gen", "geng", "gong", "gou", "gu", "gua", "guai", "guan", "guang", "gui", "gun", "guo", "ha", "hai", "han", "hang", "hao", "he", "hei", "hen", "heng", "hm", "hng", "hong", "hou", "hu", "hua", "huai", "huan", "huang", "hui", "hun", "huo", "ji", "jia", "jian", "jiang", "jiao", "jie", "jin", "jing", "jiong", "jiu", "ju", "juan", "jue", "jun", "ka", "kai", "kan", "kang", "kao", "ke", "kei", "ken", "keng", "kong", "kou", "ku", "kua", "kuai", "kuan", "kuang", "kui", "kun", "kuo", "la", "lai", "lan", "lang", "lao", "le", "lei", "leng", "li", "lia", "lian", "liang", "liao", "lie", "lin", "ling", "liu", "long", "lou", "lu", "luan", "lun", "luo", "ma", "mai", "man", "mang", "mao", "me", "mei", "men", "meng", "mi", "mian", "miao", "mie", "min", "ming", "miu", "mo", "mou", "mu", "na", "nai", "nan", "nang", "nao", "ne", "nei", "nen", "neng", "ng", "ni", "nian", "niang", "niao", "nie", "nin", "ning", "niu", "nong", "nou", "nu", "nuan", "nuo", "o", "ou", "pa", "pai", "pan", "pang", "pao", "pei", "pen", "peng", "pi", "pian", "piao", "pie", "pin", "ping", "po", "pou", "pu", "qi", "qia", "qian", "qiang", "qiao", "qie", "qin", "qing", "qiong", "qiu", "qu", "quan", "que", "qun", "ran", "rang", "rao", "re", "ren", "reng", "ri", "rong", "rou", "ru", "rua", "ruan", "rui", "run", "ruo", "sa", "sai", "san", "sang", "sao", "se", "sei", "sen", "seng", "sha", "shai", "shan", "shang", "shao", "she", "shei", "shen", "sheng", "shi", "shou", "shu", "shua", "shuai", "shuan", "shuang", "shui", "shun", "shuo", "si", "song", "sou", "su", "suan", "sui", "sun", "suo", "ta", "tai", "tan", "tang", "tao", "te", "teng", "ti", "tian", "tiao", "tie", "ting", "tong", "tou", "tu", "tuan", "tui", "tun", "tuo", "wa", "wai", "wan", "wang", "wei", "wen", "weng", "wo", "wu", "xi", "xia", "xian", "xiang", "xiao", "xie", "xin", "xing", "xiong", "xiu", "xu", "xuan", "xue", "xun", "ya", "yan", "yang", "yao", "ye", "yi", "yin", "ying", "yong", "you", "yu", "yuan", "yue", "yun", "za", "zai", "zan", "zang", "zao", "ze", "zei", "zen", "zeng", "zha", "zhai", "zhan", "zhang", "zhao", "zhe", "zhei", "zhen", "zheng", "zhi", "zhong", "zhou", "zhu", "zhua", "zhuai", "zhuan", "zhuang", "zhui", "zhun", "zhuo", "zi", "zong", "zou", "zuan", "zui", "zun", "zuo", "zu", "al", "an", "ar", "as", "at", "ea", "ed", "en", "er", "es", "ha", "he", "hi", "in", "is", "it", "le", "me", "nd", "ne", "ng", "nt", "on", "or", "ou", "re", "se", "st", "te", "th", "ti", "to", "ve", "wa", "all", "and", "are", "but", "ent", "era", "ere", "eve", "for", "had", "hat", "hen", "her", "hin", "his", "ing", "ion", "ith", "not", "ome", "oul", "our", "sho", "ted", "ter", "tha", "the", "thi", "al", "an", "ar", "as", "at", "ea", "ed", "en", "er", "es", "ha", "he", "hi", "in", "is", "it", "le", "me", "nd", "ne", "ng", "nt", "on", "or", "ou", "re", "se", "st", "te", "th", "ti", "to", "ve", "wa", "all", "and", "are", "but", "ent", "era", "ere", "eve", "for", "had", "hat", "hen", "her", "hin", "his", "ing", "ion", "ith", "not", "ome", "oul", "our", "sho", "ted", "ter", "tha", "the", "thi", "al", "an", "ar", "as", "at", "ea", "ed", "en", "er", "es", "ha", "he", "hi", "in", "is", "it", "le", "me", "nd", "ne", "ng", "nt", "on", "or", "ou", "re", "se", "st", "te", "th", "ti", "to", "ve", "wa", "all", "and", "are", "but", "ent", "era", "ere", "eve", "for", "had", "hat", "hen", "her", "hin", "his", "ing", "ion", "ith", "not", "ome", "oul", "our", "sho", "ted", "ter", "tha", "the", "thi", "al", "an", "ar", "as", "at", "ea", "ed", "en", "er", "es", "ha", "he", "hi", "in", "is", "it", "le", "me", "nd", "ne", "ng", "nt", "on", "or", "ou", "re", "se", "st", "te", "th", "ti", "to", "ve", "wa", "all", "and", "are", "but", "ent", "era", "ere", "eve", "for", "had", "hat", "hen", "her", "hin", "his", "ing", "ion", "ith", "not", "ome", "oul", "our", "sho", "ted", "ter", "tha", "the", "thi", "al", "an", "ar", "as", "at", "ea", "ed", "en", "er", "es", "ha", "he", "hi", "in", "is", "it", "le", "me", "nd", "ne", "ng", "nt", "on", "or", "ou", "re", "se", "st", "te", "th", "ti", "to", "ve", "wa", "all", "and", "are", "but", "ent", "era", "ere", "eve", "for", "had", "hat", "hen", "her", "hin", "his", "ing", "ion", "ith", "not", "ome", "oul", "our", "sho", "ted", "ter", "tha", "the", "thi", "al", "an", "ar", "as", "at", "ea", "ed", "en", "er", "es", "ha", "he", "hi", "in", "is", "it", "le", "me", "nd", "ne", "ng", "nt", "on", "or", "ou", "re", "se", "st", "te", "th", "ti", "to", "ve", "wa", "all", "and", "are", "but", "ent", "era", "ere", "eve", "for", "had", "hat", "hen", "her", "hin", "his", "ing", "ion", "ith", "not", "ome", "oul", "our", "sho", "ted", "ter", "tha", "the", "thi"));
	return f.dot;
});

// /datum/language/draconic/proc/<init>  (_nofile:0)
rt.def("/datum/language/draconic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "syllables", rt.list("za", "az", "ze", "ez", "zi", "iz", "zo", "oz", "zu", "uz", "zs", "sz", "ha", "ah", "he", "eh", "hi", "ih", "ho", "oh", "hu", "uh", "hs", "sh", "la", "al", "le", "el", "li", "il", "lo", "ol", "lu", "ul", "ls", "sl", "ka", "ak", "ke", "ek", "ki", "ik", "ko", "ok", "ku", "uk", "ks", "sk", "sa", "as", "se", "es", "si", "is", "so", "os", "su", "us", "ss", "ss", "ra", "ar", "re", "er", "ri", "ir", "ro", "or", "ru", "ur", "rs", "sr", "a", "a", "e", "e", "i", "i", "o", "o", "u", "u", "s", "s"));
	return f.dot;
});

// /datum/language/monkey/proc/<init>  (_nofile:0)
rt.def("/datum/language/monkey/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "syllables", rt.list("oop", "aak", "chee", "eek"));
	return f.dot;
});

// /datum/language/narsie/proc/<init>  (_nofile:0)
rt.def("/datum/language/narsie/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "syllables", rt.list("sha", "mir", "sas", "mah", "hra", "zar", "tok", "lyr", "nqa", "nap", "olt", "val", "yam", "qha", "fel", "det", "fwe", "mah", "erl", "ath", "yro", "eth", "gal", "mud", "gib", "bar", "tea", "fuu", "jin", "kla", "atu", "kal", "lig", "yoka", "drak", "loso", "arta", "weyh", "ines", "toth", "fara", "amar", "nyag", "eske", "reth", "dedo", "btoh", "nikt", "neth", "abis", "kanas", "garis", "uloft", "tarat", "khari", "thnor", "rekka", "ragga", "rfikk", "harfr", "andid", "ethra", "dedol", "totum", "verbot", "pleggh", "ntrath", "barhah", "pasnar", "keriam", "usinar", "savrae", "amutan", "tannin", "remium", "barada", "forbici"));
	return f.dot;
});

// /datum/language/slime/proc/<init>  (_nofile:0)
rt.def("/datum/language/slime/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "syllables", rt.list("qr", "qrr", "xuq", "qil", "quum", "xuqm", "vol", "xrim", "zaoo", "qu-uu", "qix", "qoo", "zix", "*", "!"));
	return f.dot;
});

// /datum/language/xenocommon/proc/<init>  (_nofile:0)
rt.def("/datum/language/xenocommon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "syllables", rt.list("sss", "sSs", "SSS"));
	return f.dot;
});

// /datum/reagent/colorful_reagent/proc/<init>  (_nofile:0)
rt.def("/datum/reagent/colorful_reagent/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_color_list", rt.list("#00aedb", "#a200ff", "#f47835", "#d41243", "#d11141", "#00b159", "#00aedb", "#f37735", "#ffc425", "#008744", "#0057e7", "#d62d20", "#ffa700"));
	return f.dot;
});

// /datum/reagent/hair_dye/proc/<init>  (_nofile:0)
rt.def("/datum/reagent/hair_dye/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "potential_colors", rt.list("0ad", "a0f", "f73", "d14", "d14", "0b5", "0ad", "f73", "fc2", "084", "05e", "d22", "fa0"));
	return f.dot;
});

// /datum/species/abductor/proc/<init>  (_nofile:0)
rt.def("/datum/species/abductor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "species_traits", rt.list(12, 10, 14, 11, 19));
	return f.dot;
});

// /datum/species/android/proc/<init>  (_nofile:0)
rt.def("/datum/species/android/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "species_traits", rt.list(10, 6, 7, 8, 13, 12, 14, 15, 19, 23));
	return f.dot;
});

// /datum/species/corporate/proc/<init>  (_nofile:0)
rt.def("/datum/species/corporate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "species_traits", rt.list(9, 14, 12, 15, 4, 18, 19));
	return f.dot;
});

// /datum/species/golem/plasma/proc/<init>  (_nofile:0)
rt.def("/datum/species/golem/plasma/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "species_traits", rt.list(10, 7, 8, 11, 12, 9, 14, 15, 18, 1, 26));
	rt.setSv(f, "special_names", rt.list("Flood", "Fire", "Bar", "Man"));
	return f.dot;
});

// /datum/species/golem/silver/proc/<init>  (_nofile:0)
rt.def("/datum/species/golem/silver/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "special_names", rt.list("Surfer", "Chariot", "Lining"));
	return f.dot;
});

// /datum/species/golem/alloy/proc/<init>  (_nofile:0)
rt.def("/datum/species/golem/alloy/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "special_names", rt.list("Outsider", "Technology", "Watcher", "Stranger"));
	return f.dot;
});

// /datum/species/golem/wood/proc/<init>  (_nofile:0)
rt.def("/datum/species/golem/wood/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "species_traits", rt.list(10, 7, 8, 11, 12, 9, 14, 15, 18, 1, 26));
	rt.setSv(f, "special_names", rt.list("Tomato", "Potato", "Broccoli", "Carrot", "Ambrosia", "Pumpkin", "Ivy", "Kudzu", "Banana", "Moss", "Flower", "Bloom", "Root", "Bark", "Glowshroom", "Petal", "Leaf", "Venus", "Sprout", "Cocoa", "Strawberry", "Citrus", "Oak", "Cactus", "Pepper", "Juniper"));
	return f.dot;
});

// /datum/species/golem/bluespace/proc/<init>  (_nofile:0)
rt.def("/datum/species/golem/bluespace/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "special_names", rt.list("Crystal", "Polycrystal"));
	return f.dot;
});

// /datum/species/golem/runic/proc/<init>  (_nofile:0)
rt.def("/datum/species/golem/runic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "species_traits", rt.list(10, 6, 7, 8, 13, 11, 12, 9, 14, 15, 18, 26));
	return f.dot;
});

// /datum/species/golem/cloth/proc/<init>  (_nofile:0)
rt.def("/datum/species/golem/cloth/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "species_traits", rt.list(10, 7, 8, 11, 12, 9, 14, 15, 18, 26));
	return f.dot;
});

// /datum/species/jelly/proc/<init>  (_nofile:0)
rt.def("/datum/species/jelly/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "species_traits", rt.list(1, 4, 12, 14, 24));
	return f.dot;
});

// /datum/species/lizard/ashwalker/proc/<init>  (_nofile:0)
rt.def("/datum/species/lizard/ashwalker/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "species_traits", rt.list(1, 4, 5, 10, 11, 25));
	return f.dot;
});

// /datum/species/plasmaman/proc/<init>  (_nofile:0)
rt.def("/datum/species/plasmaman/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "species_traits", rt.list(12, 7, 9, 16, 14, 19));
	return f.dot;
});

// /datum/species/pod/proc/<init>  (_nofile:0)
rt.def("/datum/species/pod/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "species_traits", rt.list(1, 4));
	return f.dot;
});

// /datum/species/synth/proc/<init>  (_nofile:0)
rt.def("/datum/species/synth/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "species_traits", rt.list(16, 10, 14, 18, 19));
	rt.setSv(f, "initial_species_traits", rt.list(16, 10, 14, 18, 19));
	return f.dot;
});

// /datum/uplink_item/role_restricted/modified_syringe_gun/proc/<init>  (_nofile:0)
rt.def("/datum/uplink_item/role_restricted/modified_syringe_gun/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "restricted_roles", rt.list("Geneticist", "Chief Medical Officer"));
	return f.dot;
});

// /turf/open/floor/wood/proc/<init>  (_nofile:0)
rt.def("/turf/open/floor/wood/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "broken_states", rt.list("wood-broken", "wood-broken2", "wood-broken3", "wood-broken4", "wood-broken5", "wood-broken6", "wood-broken7"));
	return f.dot;
});

// /turf/open/floor/mineral/plasma/proc/<init>  (_nofile:0)
rt.def("/turf/open/floor/mineral/plasma/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "icons", rt.list("plasma", "plasma_dam"));
	return f.dot;
});

// /turf/open/floor/mineral/gold/proc/<init>  (_nofile:0)
rt.def("/turf/open/floor/mineral/gold/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "icons", rt.list("gold", "gold_dam"));
	return f.dot;
});

// /turf/open/floor/mineral/silver/proc/<init>  (_nofile:0)
rt.def("/turf/open/floor/mineral/silver/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "icons", rt.list("silver", "silver_dam"));
	return f.dot;
});

// /turf/open/floor/mineral/titanium/proc/<init>  (_nofile:0)
rt.def("/turf/open/floor/mineral/titanium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "icons", rt.list("shuttlefloor3", "shuttlefloor3_dam"));
	return f.dot;
});

// /turf/open/floor/mineral/titanium/blue/proc/<init>  (_nofile:0)
rt.def("/turf/open/floor/mineral/titanium/blue/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "icons", rt.list("shuttlefloor", "shuttlefloor_dam"));
	return f.dot;
});

// /turf/open/floor/mineral/titanium/yellow/proc/<init>  (_nofile:0)
rt.def("/turf/open/floor/mineral/titanium/yellow/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "icons", rt.list("shuttlefloor2", "shuttlefloor2_dam"));
	return f.dot;
});

// /turf/open/floor/mineral/titanium/purple/proc/<init>  (_nofile:0)
rt.def("/turf/open/floor/mineral/titanium/purple/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "icons", rt.list("shuttlefloor5", "shuttlefloor5_dam"));
	return f.dot;
});

// /turf/open/floor/mineral/plastitanium/proc/<init>  (_nofile:0)
rt.def("/turf/open/floor/mineral/plastitanium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "icons", rt.list("shuttlefloor4", "shuttlefloor4_dam"));
	return f.dot;
});

// /turf/open/floor/mineral/bananium/proc/<init>  (_nofile:0)
rt.def("/turf/open/floor/mineral/bananium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "icons", rt.list("bananium", "bananium_dam"));
	return f.dot;
});

// /turf/open/floor/mineral/diamond/proc/<init>  (_nofile:0)
rt.def("/turf/open/floor/mineral/diamond/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "icons", rt.list("diamond", "diamond_dam"));
	return f.dot;
});

// /turf/open/floor/mineral/uranium/proc/<init>  (_nofile:0)
rt.def("/turf/open/floor/mineral/uranium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "icons", rt.list("uranium", "uranium_dam"));
	return f.dot;
});

// /turf/open/floor/mineral/abductor/proc/<init>  (_nofile:0)
rt.def("/turf/open/floor/mineral/abductor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "icons", rt.list("alienpod1", "alienpod2", "alienpod3", "alienpod4", "alienpod5", "alienpod6", "alienpod7", "alienpod8", "alienpod9"));
	return f.dot;
});

// /turf/open/floor/noslip/proc/<init>  (_nofile:0)
rt.def("/turf/open/floor/noslip/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "broken_states", rt.list("noslip-damaged1", "noslip-damaged2", "noslip-damaged3"));
	rt.setSv(f, "burnt_states", rt.list("noslip-scorched1", "noslip-scorched2"));
	return f.dot;
});

// /turf/open/floor/plasteel/proc/<init>  (_nofile:0)
rt.def("/turf/open/floor/plasteel/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "broken_states", rt.list("damaged1", "damaged2", "damaged3", "damaged4", "damaged5"));
	rt.setSv(f, "burnt_states", rt.list("floorscorched1", "floorscorched2"));
	return f.dot;
});

// /atom/movable/lighting_object/proc/<init>  (_nofile:0)
rt.def("/atom/movable/lighting_object/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "color", rt.list(1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1));
	return f.dot;
});

// /mob/living/carbon/monkey/punpun/proc/<init>  (_nofile:0)
rt.def("/mob/living/carbon/monkey/punpun/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "pet_monkey_names", rt.list("Pun Pun", "Bubbles", "Mojo", "George", "Darwin", "Aldo", "Caeser", "Kanzi", "Kong", "Terk", "Grodd", "Mala", "Bojangles", "Coco", "Able", "Baker", "Scatter", "Norbit", "Travis"));
	rt.setSv(f, "rare_pet_monkey_names", rt.list("Professor Bobo", "Deempisi's Revenge", "Furious George", "King Louie", "Dr. Zaius", "Jimmy Rustles", "Dinner", "Lanky"));
	return f.dot;
});

// /mob/living/simple_animal/drone/cogscarab/proc/<init>  (_nofile:0)
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "faction", rt.list("neutral", "ratvar"));
	rt.setSv(f, "speak_emote", rt.list("clanks", "clinks", "clunks", "clangs"));
	return f.dot;
});

// /mob/living/simple_animal/hostile/mimic/copy/machine/proc/<init>  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/mimic/copy/machine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak", rt.list("HUMANS ARE IMPERFECT!", "YOU SHALL BE ASSIMILATED!", "YOU ARE HARMING YOURSELF", "You have been deemed hazardous. Will you comply?", "My logic is undeniable.", "One of us.", "FLESH IS WEAK", "THIS ISN'T WAR, THIS IS EXTERMINATION!"));
	return f.dot;
});

// /mob/living/simple_animal/hostile/asteroid/hivelordbrood/slaughter/proc/<init>  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/asteroid/hivelordbrood/slaughter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "faction", rt.list("mining", "boss"));
	rt.setSv(f, "weather_immunities", rt.list("lava", "ash"));
	return f.dot;
});

// /mob/living/simple_animal/hostile/megafauna/swarmer_swarm_beacon/proc/<init>  (_nofile:0)
rt.def("/mob/living/simple_animal/hostile/megafauna/swarmer_swarm_beacon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "faction", rt.list("mining", "boss", "swarmer"));
	rt.setSv(f, "weather_immunities", rt.list("lava", "ash"));
	return f.dot;
});

// /mob/living/simple_animal/pet/penguin/baby/proc/<init>  (_nofile:0)
rt.def("/mob/living/simple_animal/pet/penguin/baby/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak", rt.list("gah", "noot noot", "noot!", "noot", "squeee!", "noo!"));
	return f.dot;
});

// /mob/living/simple_animal/parrot/Poly/proc/<init>  (_nofile:0)
rt.def("/mob/living/simple_animal/parrot/Poly/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak", rt.list("Poly wanna cracker!", ":e Check the crystal, you chucklefucks!", ":e Wire the solars, you lazy bums!", ":e WHO TOOK THE DAMN HARDSUITS?", ":e OH GOD ITS ABOUT TO DELAMINATE CALL THE SHUTTLE"));
	return f.dot;
});

// /mob/dead/observer/proc/<init>  (_nofile:0)
rt.def("/mob/dead/observer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "datahuds", rt.list(2, 4, 5));
	return f.dot;
});

// /obj/item/weapon/storage/belt/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/storage/belt/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("whipped", "lashed", "disciplined"));
	return f.dot;
});

// /obj/item/weapon/storage/book/bible/syndicate/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/storage/book/bible/syndicate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("attacked", "burned", "blessed", "damned", "scorched"));
	return f.dot;
});

// /obj/item/weapon/storage/briefcase/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/storage/briefcase/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("bashed", "battered", "bludgeoned", "thrashed", "whacked"));
	return f.dot;
});

// /obj/item/weapon/storage/briefcase/sniperbundle/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/storage/briefcase/sniperbundle/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("bashed", "battered", "bludgeoned", "thrashed", "whacked"));
	return f.dot;
});

// /obj/item/weapon/storage/secure/briefcase/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/storage/secure/briefcase/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("bashed", "battered", "bludgeoned", "thrashed", "whacked"));
	return f.dot;
});

// /obj/item/weapon/storage/toolbox/brass/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/storage/toolbox/brass/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("robusted", "crushed", "smashed"));
	return f.dot;
});

// /obj/item/weapon/twohanded/bostaff/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/twohanded/bostaff/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("smashed", "slammed", "whacked", "thwacked"));
	return f.dot;
});

// /obj/item/weapon/twohanded/dualsaber/toy/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/twohanded/dualsaber/toy/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("attacked", "struck", "hit"));
	return f.dot;
});

// /obj/item/weapon/twohanded/vibro_weapon/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/twohanded/vibro_weapon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("cut", "sliced", "diced"));
	return f.dot;
});

// /obj/item/weapon/twohanded/bonespear/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/twohanded/bonespear/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("attacked", "poked", "jabbed", "torn", "gored"));
	return f.dot;
});

// /obj/item/weapon/melee/arm_blade/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/melee/arm_blade/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("attacked", "slashed", "stabbed", "sliced", "torn", "ripped", "diced", "cut"));
	return f.dot;
});

// /obj/item/weapon/melee/cultblade/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/melee/cultblade/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("attacked", "slashed", "stabbed", "sliced", "torn", "ripped", "diced", "rended"));
	return f.dot;
});

// /obj/item/weapon/melee/skateboard/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/melee/skateboard/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("smacked", "whacked", "slammed", "smashed"));
	return f.dot;
});

// /obj/item/weapon/melee/baseball_bat/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/melee/baseball_bat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("beat", "smacked"));
	return f.dot;
});

// /obj/item/weapon/melee/flyswatter/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/melee/flyswatter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("swatted", "smacked"));
	return f.dot;
});

// /obj/item/weapon/melee/energy/sword/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/melee/energy/sword/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_colors", rt.list("red", "blue", "green", "purple"));
	return f.dot;
});

// /obj/item/weapon/melee/synthetic_arm_blade/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/melee/synthetic_arm_blade/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("attacked", "slashed", "stabbed", "sliced", "torn", "ripped", "diced", "cut"));
	return f.dot;
});

// /obj/item/weapon/melee/curator_whip/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/melee/curator_whip/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("flogged", "whipped", "lashed", "disciplined"));
	return f.dot;
});

// /obj/item/weapon/melee/transforming/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/melee/transforming/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb_on", rt.list("attacked", "slashed", "stabbed", "sliced", "torn", "ripped", "diced", "cut"));
	rt.setSv(f, "attack_verb_off", rt.list("attacked", "slashed", "stabbed", "sliced", "torn", "ripped", "diced", "cut"));
	return f.dot;
});

// /obj/item/weapon/melee/transforming/cleaving_saw/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/melee/transforming/cleaving_saw/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb_off", rt.list("attacked", "sawed", "sliced", "torn", "ripped", "diced", "cut"));
	rt.setSv(f, "attack_verb_on", rt.list("cleaved", "swiped", "slashed", "chopped"));
	return f.dot;
});

// /obj/item/weapon/melee/ghost_sword/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/melee/ghost_sword/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("attacked", "slashed", "stabbed", "sliced", "torn", "ripped", "diced", "rended"));
	return f.dot;
});

// /obj/item/weapon/shield/energy/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/shield/energy/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("shoved", "bashed"));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/reagent_containers/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_transfer_amounts", rt.list(5, 10, 15, 20, 25, 30));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/drinks/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_transfer_amounts", rt.list(5, 10, 15, 20, 25, 30, 50));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/spray/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/reagent_containers/spray/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_transfer_amounts", rt.list(5, 10, 15, 20, 25, 30, 50, 100));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/spray/mister/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/reagent_containers/spray/mister/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_transfer_amounts", rt.list(25, 50, 100));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/spray/mister/operator/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/reagent_containers/spray/mister/operator/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_transfer_amounts", rt.list(75, 100, 150));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/glass/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/reagent_containers/glass/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_transfer_amounts", rt.list(5, 10, 15, 20, 25, 30, 50));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/glass/bottle/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_transfer_amounts", rt.list(5, 10, 15, 25, 30));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/glass/bottle/nutrient/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/nutrient/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_transfer_amounts", rt.list(1, 2, 5, 10, 15, 25, 50));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/glass/bottle/killer/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/killer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_transfer_amounts", rt.list(1, 2, 5, 10, 15, 25, 50));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/borghypo/hacked/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/reagent_containers/borghypo/hacked/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagent_ids", rt.list("facid", "mutetoxin", "cyanide", "sodium_thiopental", "heparin", "lexorin"));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/borghypo/syndicate/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/reagent_containers/borghypo/syndicate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagent_ids", rt.list("syndicate_nanites", "potass_iodide", "morphine"));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/borghypo/borgshaker/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/reagent_containers/borghypo/borgshaker/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_transfer_amounts", rt.list(5, 10, 20));
	rt.setSv(f, "reagent_ids", rt.list("beer", "orangejuice", "limejuice", "tomatojuice", "cola", "tonic", "sodawater", "ice", "cream", "whiskey", "vodka", "rum", "gin", "tequila", "vermouth", "wine", "kahlua", "cognac", "ale"));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/borghypo/peace/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/reagent_containers/borghypo/peace/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagent_ids", rt.list("dizzysolution", "tiresolution"));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/borghypo/peace/hacked/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/reagent_containers/borghypo/peace/hacked/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagent_ids", rt.list("dizzysolution", "tiresolution", "tirizene", "sulfonal", "sodium_thiopental", "cyanide", "neurotoxin2"));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/dropper/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/reagent_containers/dropper/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_transfer_amounts", rt.list(1, 2, 3, 4, 5));
	return f.dot;
});

// /obj/item/weapon/pen/edagger/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/pen/edagger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("slashed", "stabbed", "sliced", "torn", "ripped", "diced", "cut"));
	return f.dot;
});

// /obj/item/weapon/circuitboard/computer/card/minor/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/circuitboard/computer/card/minor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "dept_list", rt.list("General", "Security", "Medical", "Science", "Engineering"));
	return f.dot;
});

// /obj/item/weapon/grenade/plastic/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/grenade/plastic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "boom_sizes", rt.list(0, 0, 3));
	return f.dot;
});

// /obj/item/weapon/grenade/plastic/x4/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/grenade/plastic/x4/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "boom_sizes", rt.list(0, 2, 5));
	return f.dot;
});

// /obj/item/weapon/claymore/highlander/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/claymore/highlander/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("brutalized", "eviscerated", "disemboweled", "hacked", "carved", "cleaved"));
	return f.dot;
});

// /obj/item/weapon/card/id/syndicate/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/card/id/syndicate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "access", rt.list(12, 150));
	return f.dot;
});

// /obj/item/weapon/card/id/mining/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/card/id/mining/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "access", rt.list(48, 54, 64));
	return f.dot;
});

// /obj/item/weapon/card/id/away/hotel/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/card/id/away/hotel/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "access", rt.list(200, 201));
	return f.dot;
});

// /obj/item/weapon/card/id/away/hotel/securty/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/card/id/away/hotel/securty/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "access", rt.list(200, 201, 203));
	return f.dot;
});

// /obj/item/weapon/gavelhammer/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/gavelhammer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("bashed", "battered", "judged", "whacked"));
	return f.dot;
});

// /obj/item/weapon/dice/fudge/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/dice/fudge/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "special_faces", rt.list("minus", "blank", "plus"));
	return f.dot;
});

// /obj/item/weapon/dice/eightbd20/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/dice/eightbd20/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "special_faces", rt.list("It is certain", "It is decidedly so", "Without a doubt", "Yes, definitely", "You may rely on it", "As I see it, yes", "Most likely", "Outlook good", "Yes", "Signs point to yes", "Reply hazy try again", "Ask again later", "Better not tell you now", "Cannot predict now", "Concentrate and ask again", "Don't count on it", "My reply is no", "My sources say no", "Outlook not so good", "Very doubtful"));
	return f.dot;
});

// /obj/item/weapon/dice/fourdd6/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/dice/fourdd6/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "special_faces", rt.list("Cube-Side: 1-1", "Cube-Side: 1-2", "Cube-Side: 1-3", "Cube-Side: 1-4", "Cube-Side: 1-5", "Cube-Side: 1-6", "Cube-Side: 2-1", "Cube-Side: 2-2", "Cube-Side: 2-3", "Cube-Side: 2-4", "Cube-Side: 2-5", "Cube-Side: 2-6", "Cube-Side: 3-1", "Cube-Side: 3-2", "Cube-Side: 3-3", "Cube-Side: 3-4", "Cube-Side: 3-5", "Cube-Side: 3-6", "Cube-Side: 4-1", "Cube-Side: 4-2", "Cube-Side: 4-3", "Cube-Side: 4-4", "Cube-Side: 4-5", "Cube-Side: 4-6", "Cube-Side: 5-1", "Cube-Side: 5-2", "Cube-Side: 5-3", "Cube-Side: 5-4", "Cube-Side: 5-5", "Cube-Side: 5-6", "Cube-Side: 6-1", "Cube-Side: 6-2", "Cube-Side: 6-3", "Cube-Side: 6-4", "Cube-Side: 6-5", "Cube-Side: 6-6", "Cube-Side: 7-1", "Cube-Side: 7-2", "Cube-Side: 7-3", "Cube-Side: 7-4", "Cube-Side: 7-5", "Cube-Side: 7-6", "Cube-Side: 8-1", "Cube-Side: 8-2", "Cube-Side: 8-3", "Cube-Side: 8-4", "Cube-Side: 8-5", "Cube-Side: 8-6"));
	return f.dot;
});

// /obj/item/weapon/nullrod/godhand/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/nullrod/godhand/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("punched", "cross countered", "pummeled"));
	return f.dot;
});

// /obj/item/weapon/nullrod/claymore/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/nullrod/claymore/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("attacked", "slashed", "stabbed", "sliced", "torn", "ripped", "diced", "cut"));
	return f.dot;
});

// /obj/item/weapon/nullrod/claymore/chainsaw_sword/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/nullrod/claymore/chainsaw_sword/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("sawed", "torn", "cut", "chopped", "diced"));
	return f.dot;
});

// /obj/item/weapon/nullrod/claymore/bostaff/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/nullrod/claymore/bostaff/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("smashed", "slammed", "whacked", "thwacked"));
	return f.dot;
});

// /obj/item/weapon/nullrod/sord/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/nullrod/sord/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("attacked", "slashed", "stabbed", "sliced", "torn", "ripped", "diced", "cut"));
	return f.dot;
});

// /obj/item/weapon/nullrod/scythe/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/nullrod/scythe/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("chopped", "sliced", "cut", "reaped"));
	return f.dot;
});

// /obj/item/weapon/nullrod/scythe/vibro/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/nullrod/scythe/vibro/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("chopped", "sliced", "cut", "zandatsu'd"));
	return f.dot;
});

// /obj/item/weapon/nullrod/scythe/talking/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/nullrod/scythe/talking/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("chopped", "sliced", "cut"));
	return f.dot;
});

// /obj/item/weapon/nullrod/hammmer/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/nullrod/hammmer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("smashed", "bashed", "hammered", "crunched"));
	return f.dot;
});

// /obj/item/weapon/nullrod/chainsaw/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/nullrod/chainsaw/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("sawed", "torn", "cut", "chopped", "diced"));
	return f.dot;
});

// /obj/item/weapon/nullrod/clown/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/nullrod/clown/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("attacked", "slashed", "stabbed", "sliced", "torn", "ripped", "diced", "cut"));
	return f.dot;
});

// /obj/item/weapon/nullrod/whip/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/nullrod/whip/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("whipped", "lashed"));
	return f.dot;
});

// /obj/item/weapon/nullrod/fedora/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/nullrod/fedora/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("enlightened", "redpilled"));
	return f.dot;
});

// /obj/item/weapon/nullrod/carp/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/nullrod/carp/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("bitten", "eaten", "fin slapped"));
	return f.dot;
});

// /obj/item/weapon/nullrod/tribal_knife/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/nullrod/tribal_knife/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("attacked", "slashed", "stabbed", "sliced", "torn", "ripped", "diced", "cut"));
	return f.dot;
});

// /obj/item/weapon/nullrod/pitchfork/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/nullrod/pitchfork/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("poked", "impaled", "pierced", "jabbed"));
	return f.dot;
});

// /obj/item/weapon/kitchen/knife/combat/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/kitchen/knife/combat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("slashed", "stabbed", "sliced", "torn", "ripped", "cut"));
	return f.dot;
});

// /obj/item/weapon/kitchen/rollingpin/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/kitchen/rollingpin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("bashed", "battered", "bludgeoned", "thrashed", "whacked"));
	return f.dot;
});

// /obj/item/weapon/book/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/book/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("bashed", "whacked", "educated"));
	return f.dot;
});

// /obj/item/weapon/caution/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/caution/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("warned", "cautioned", "smashed"));
	return f.dot;
});

// /obj/item/weapon/mop/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/mop/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("mopped", "bashed", "bludgeoned", "whacked"));
	return f.dot;
});

// /obj/item/weapon/picket_sign/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/picket_sign/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("bashed", "smacked"));
	return f.dot;
});

// /obj/item/weapon/wrench/medical/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/wrench/medical/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("wrenched", "medicaled", "tapped", "jabbed", "whacked"));
	return f.dot;
});

// /obj/item/weapon/vending_refill/boozeomat/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/vending_refill/boozeomat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "charges", rt.list(54, 4, 0));
	rt.setSv(f, "init_charges", rt.list(54, 4, 0));
	return f.dot;
});

// /obj/item/weapon/vending_refill/coffee/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/vending_refill/coffee/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "charges", rt.list(25, 4, 0));
	rt.setSv(f, "init_charges", rt.list(25, 4, 0));
	return f.dot;
});

// /obj/item/weapon/vending_refill/snack/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/vending_refill/snack/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "charges", rt.list(12, 2, 0));
	rt.setSv(f, "init_charges", rt.list(12, 2, 0));
	return f.dot;
});

// /obj/item/weapon/vending_refill/cola/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/vending_refill/cola/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "charges", rt.list(30, 4, 1));
	rt.setSv(f, "init_charges", rt.list(30, 4, 1));
	return f.dot;
});

// /obj/item/weapon/vending_refill/cigarette/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/vending_refill/cigarette/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "charges", rt.list(12, 3, 2));
	rt.setSv(f, "init_charges", rt.list(12, 3, 2));
	return f.dot;
});

// /obj/item/weapon/vending_refill/autodrobe/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/vending_refill/autodrobe/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "charges", rt.list(31, 2, 3));
	rt.setSv(f, "init_charges", rt.list(27, 2, 3));
	return f.dot;
});

// /obj/item/weapon/vending_refill/clothing/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/vending_refill/clothing/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "charges", rt.list(31, 4, 4));
	rt.setSv(f, "init_charges", rt.list(31, 4, 4));
	return f.dot;
});

// /obj/item/weapon/vending_refill/medical/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/vending_refill/medical/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "charges", rt.list(26, 5, 3));
	rt.setSv(f, "init_charges", rt.list(26, 5, 3));
	return f.dot;
});

// /obj/item/weapon/sord/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/sord/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("attacked", "slashed", "stabbed", "sliced", "torn", "ripped", "diced", "cut"));
	return f.dot;
});

// /obj/item/weapon/phone/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/phone/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("called", "rang"));
	return f.dot;
});

// /obj/item/weapon/staff/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/staff/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("bludgeoned", "whacked", "disciplined"));
	return f.dot;
});

// /obj/item/weapon/mounted_chainsaw/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/mounted_chainsaw/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("sawed", "torn", "cut", "chopped", "diced"));
	return f.dot;
});

// /obj/item/weapon/tailclub/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/tailclub/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("clubbed", "bludgeoned"));
	return f.dot;
});

// /obj/item/weapon/grown/novaflower/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/grown/novaflower/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("roasted", "scorched", "burned"));
	return f.dot;
});

// /obj/item/weapon/scythe/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/scythe/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("chopped", "sliced", "cut", "reaped"));
	return f.dot;
});

// /obj/item/weapon/coin/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/coin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "sideslist", rt.list("heads", "tails"));
	return f.dot;
});

// /obj/item/weapon/coin/antagtoken/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/coin/antagtoken/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "sideslist", rt.list("valid", "salad"));
	return f.dot;
});

// /obj/item/weapon/guardiancreator/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/guardiancreator/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_guardians", rt.list("Assassin", "Chaos", "Charger", "Explosive", "Lightning", "Protector", "Ranged", "Standard", "Support"));
	return f.dot;
});

// /obj/item/weapon/guardiancreator/choose/dextrous/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/guardiancreator/choose/dextrous/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_guardians", rt.list("Assassin", "Chaos", "Charger", "Dextrous", "Explosive", "Lightning", "Protector", "Ranged", "Standard", "Support"));
	return f.dot;
});

// /obj/item/weapon/guardiancreator/choose/wizard/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/guardiancreator/choose/wizard/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_guardians", rt.list("Assassin", "Chaos", "Charger", "Dextrous", "Explosive", "Lightning", "Protector", "Ranged", "Standard"));
	return f.dot;
});

// /obj/item/weapon/guardiancreator/tech/choose/traitor/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/guardiancreator/tech/choose/traitor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_guardians", rt.list("Assassin", "Chaos", "Charger", "Explosive", "Lightning", "Protector", "Ranged", "Standard", "Support"));
	return f.dot;
});

// /obj/item/weapon/guardiancreator/tech/choose/dextrous/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/guardiancreator/tech/choose/dextrous/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_guardians", rt.list("Assassin", "Chaos", "Charger", "Dextrous", "Explosive", "Lightning", "Protector", "Ranged", "Standard", "Support"));
	return f.dot;
});

// /obj/item/weapon/dash/energy_katana/proc/<init>  (_nofile:0)
rt.def("/obj/item/weapon/dash/energy_katana/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("attacked", "slashed", "stabbed", "sliced", "torn", "ripped", "diced", "cut"));
	return f.dot;
});

// /obj/item/clothing/head/cone/proc/<init>  (_nofile:0)
rt.def("/obj/item/clothing/head/cone/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("warned", "cautioned", "smashed"));
	return f.dot;
});

// /obj/item/clockwork/ratvarian_spear/proc/<init>  (_nofile:0)
rt.def("/obj/item/clockwork/ratvarian_spear/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("stabbed", "poked", "slashed"));
	return f.dot;
});

// /obj/item/stack/tile/light/proc/<init>  (_nofile:0)
rt.def("/obj/item/stack/tile/light/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("bashed", "battered", "bludgeoned", "thrashed", "smashed"));
	return f.dot;
});

// /obj/item/stack/sheet/proc/<init>  (_nofile:0)
rt.def("/obj/item/stack/sheet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("bashed", "battered", "bludgeoned", "thrashed", "smashed"));
	return f.dot;
});

// /obj/item/device/instrument/guitar/proc/<init>  (_nofile:0)
rt.def("/obj/item/device/instrument/guitar/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("played metal on", "serenaded", "crashed", "smashed"));
	return f.dot;
});

// /obj/item/device/instrument/eguitar/proc/<init>  (_nofile:0)
rt.def("/obj/item/device/instrument/eguitar/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("played metal on", "shredded", "crashed", "smashed"));
	return f.dot;
});

// /obj/item/organ/heart/proc/<init>  (_nofile:0)
rt.def("/obj/item/organ/heart/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("beat", "thumped"));
	return f.dot;
});

// /obj/item/organ/brain/proc/<init>  (_nofile:0)
rt.def("/obj/item/organ/brain/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("attacked", "slapped", "whacked"));
	return f.dot;
});

// /obj/item/organ/tongue/proc/<init>  (_nofile:0)
rt.def("/obj/item/organ/tongue/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("licked", "slobbered", "slapped", "frenched", "tongued"));
	return f.dot;
});

// /obj/item/organ/tongue/bone/proc/<init>  (_nofile:0)
rt.def("/obj/item/organ/tongue/bone/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "phomeme_types", rt.list("sans", "papyrus"));
	rt.setSv(f, "attack_verb", rt.list("bitten", "chattered", "chomped", "enamelled", "boned"));
	return f.dot;
});

// /obj/item/organ/tongue/robot/proc/<init>  (_nofile:0)
rt.def("/obj/item/organ/tongue/robot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("beeped", "booped"));
	return f.dot;
});

// /obj/item/briefcase_launchpad/proc/<init>  (_nofile:0)
rt.def("/obj/item/briefcase_launchpad/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("bashed", "battered", "bludgeoned", "thrashed", "whacked"));
	return f.dot;
});

// /obj/item/mecha_parts/mecha_equipment/repair_droid/proc/<init>  (_nofile:0)
rt.def("/obj/item/mecha_parts/mecha_equipment/repair_droid/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "repairable_damage", rt.list(2, 8));
	return f.dot;
});

// /obj/item/mecha_parts/mecha_equipment/tesla_energy_relay/proc/<init>  (_nofile:0)
rt.def("/obj/item/mecha_parts/mecha_equipment/tesla_energy_relay/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "use_channels", rt.list(1, 3, 2));
	return f.dot;
});

// /obj/item/areaeditor/proc/<init>  (_nofile:0)
rt.def("/obj/item/areaeditor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("attacked", "bapped", "hit"));
	return f.dot;
});

// /obj/item/cardboard_cutout/proc/<init>  (_nofile:0)
rt.def("/obj/item/cardboard_cutout/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_appearances", rt.list("Assistant", "Clown", "Mime", "Traitor", "Nuke Op", "Cultist", "Clockwork Cultist", "Revolutionary", "Wizard", "Shadowling", "Xenomorph", "Xenomorph Maid", "Swarmer", "Ash Walker", "Deathsquad Officer", "Ian", "Slaughter Demon", "Laughter Demon", "Private Security Officer"));
	return f.dot;
});

// /obj/item/toy/carpplushie/proc/<init>  (_nofile:0)
rt.def("/obj/item/toy/carpplushie/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("bitten", "eaten", "fin slapped"));
	return f.dot;
});

// /obj/item/toy/sword/proc/<init>  (_nofile:0)
rt.def("/obj/item/toy/sword/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("attacked", "struck", "hit"));
	return f.dot;
});

// /obj/item/toy/foamblade/proc/<init>  (_nofile:0)
rt.def("/obj/item/toy/foamblade/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("pricked", "absorbed", "gored"));
	return f.dot;
});

// /obj/item/toy/katana/proc/<init>  (_nofile:0)
rt.def("/obj/item/toy/katana/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("attacked", "slashed", "stabbed", "sliced"));
	return f.dot;
});

// /obj/item/toy/talking/proc/<init>  (_nofile:0)
rt.def("/obj/item/toy/talking/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "messages", rt.list("I'm super generic!", "Mathematics class is of variable difficulty!"));
	return f.dot;
});

// /obj/item/toy/talking/owl/proc/<init>  (_nofile:0)
rt.def("/obj/item/toy/talking/owl/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "messages", rt.list("You won't get away this time, Griffin!", "Stop right there, criminal!", "Hoot! Hoot!", "I am the night!"));
	return f.dot;
});

// /obj/item/toy/talking/griffin/proc/<init>  (_nofile:0)
rt.def("/obj/item/toy/talking/griffin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "messages", rt.list("You can't stop me, Owl!", "My plan is flawless! The vault is mine!", "Caaaawwww!", "You will never catch me!"));
	return f.dot;
});

// /obj/item/toy/cards/deck/syndicate/proc/<init>  (_nofile:0)
rt.def("/obj/item/toy/cards/deck/syndicate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "card_attack_verb", rt.list("attacked", "sliced", "diced", "slashed", "cut"));
	return f.dot;
});

// /obj/item/borg/upgrade/hypospray/expanded/proc/<init>  (_nofile:0)
rt.def("/obj/item/borg/upgrade/hypospray/expanded/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "additional_reagents", rt.list("mannitol", "oculine", "inacusiate", "mutadone", "haloperidol"));
	return f.dot;
});

// /obj/item/borg/upgrade/hypospray/high_strength/proc/<init>  (_nofile:0)
rt.def("/obj/item/borg/upgrade/hypospray/high_strength/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "additional_reagents", rt.list("oxandrolone", "sal_acid", "rezadone", "pen_acid"));
	return f.dot;
});

// /obj/item/bodypart/l_arm/proc/<init>  (_nofile:0)
rt.def("/obj/item/bodypart/l_arm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("slapped", "punched"));
	return f.dot;
});

// /obj/item/bodypart/l_arm/robot/proc/<init>  (_nofile:0)
rt.def("/obj/item/bodypart/l_arm/robot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("slapped", "punched"));
	return f.dot;
});

// /obj/item/bodypart/r_arm/proc/<init>  (_nofile:0)
rt.def("/obj/item/bodypart/r_arm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("slapped", "punched"));
	return f.dot;
});

// /obj/item/bodypart/r_arm/robot/proc/<init>  (_nofile:0)
rt.def("/obj/item/bodypart/r_arm/robot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("slapped", "punched"));
	return f.dot;
});

// /obj/item/bodypart/l_leg/proc/<init>  (_nofile:0)
rt.def("/obj/item/bodypart/l_leg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("kicked", "stomped"));
	return f.dot;
});

// /obj/item/bodypart/l_leg/robot/proc/<init>  (_nofile:0)
rt.def("/obj/item/bodypart/l_leg/robot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("kicked", "stomped"));
	return f.dot;
});

// /obj/item/bodypart/r_leg/proc/<init>  (_nofile:0)
rt.def("/obj/item/bodypart/r_leg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("kicked", "stomped"));
	return f.dot;
});

// /obj/item/bodypart/r_leg/robot/proc/<init>  (_nofile:0)
rt.def("/obj/item/bodypart/r_leg/robot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("kicked", "stomped"));
	return f.dot;
});

// /obj/machinery/power/floodlight/proc/<init>  (_nofile:0)
rt.def("/obj/machinery/power/floodlight/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "light_setting_list", rt.list(0, 5, 10, 15));
	return f.dot;
});

// /obj/machinery/computer/aifixer/proc/<init>  (_nofile:0)
rt.def("/obj/machinery/computer/aifixer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(20, 29, 19));
	return f.dot;
});

// /obj/machinery/computer/med_data/proc/<init>  (_nofile:0)
rt.def("/obj/machinery/computer/med_data/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_one_access", rt.list(5, 4));
	return f.dot;
});

// /obj/machinery/computer/secure_data/proc/<init>  (_nofile:0)
rt.def("/obj/machinery/computer/secure_data/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_one_access", rt.list(1, 4));
	return f.dot;
});

// /obj/machinery/chem_dispenser/proc/<init>  (_nofile:0)
rt.def("/obj/machinery/chem_dispenser/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "dispensable_reagents", rt.list("hydrogen", "lithium", "carbon", "nitrogen", "oxygen", "fluorine", "sodium", "aluminium", "silicon", "phosphorus", "sulfur", "chlorine", "potassium", "iron", "copper", "mercury", "radium", "water", "ethanol", "sugar", "sacid", "welding_fuel", "silver", "iodine", "bromine", "stable_plasma"));
	rt.setSv(f, "emagged_reagents", rt.list("space_drugs", "morphine", "carpotoxin", "mine_salve", "toxin"));
	return f.dot;
});

// /obj/machinery/chem_dispenser/drinks/proc/<init>  (_nofile:0)
rt.def("/obj/machinery/chem_dispenser/drinks/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "dispensable_reagents", rt.list("water", "ice", "coffee", "cream", "tea", "icetea", "cola", "spacemountainwind", "dr_gibb", "space_up", "tonic", "sodawater", "lemon_lime", "pwr_game", "shamblers", "sugar", "orangejuice", "limejuice", "tomatojuice", "lemonjuice"));
	rt.setSv(f, "emagged_reagents", rt.list("thirteenloko", "whiskeycola", "mindbreaker", "tirizene"));
	return f.dot;
});

// /obj/machinery/chem_dispenser/drinks/beer/proc/<init>  (_nofile:0)
rt.def("/obj/machinery/chem_dispenser/drinks/beer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "dispensable_reagents", rt.list("beer", "kahlua", "whiskey", "wine", "vodka", "gin", "rum", "tequila", "vermouth", "cognac", "ale", "absinthe", "hcider"));
	rt.setSv(f, "emagged_reagents", rt.list("ethanol", "iron", "minttoxin", "atomicbomb"));
	return f.dot;
});

// /obj/machinery/chem_dispenser/mutagensaltpeter/proc/<init>  (_nofile:0)
rt.def("/obj/machinery/chem_dispenser/mutagensaltpeter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "dispensable_reagents", rt.list("mutagen", "saltpetre", "eznutriment", "left4zednutriment", "robustharvestnutriment", "water", "plantbgone", "weedkiller", "pestkiller", "cryoxadone", "ammonia", "ash", "diethylamine"));
	return f.dot;
});

// /obj/machinery/portable_atmospherics/scrubber/proc/<init>  (_nofile:0)
rt.def("/obj/machinery/portable_atmospherics/scrubber/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "scrubbing", rt.list("plasma", "co2", "n2o", "agent_b", "bz", "freon", "water_vapor"));
	return f.dot;
});

// /obj/machinery/telecomms/bus/preset_one/proc/<init>  (_nofile:0)
rt.def("/obj/machinery/telecomms/bus/preset_one/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "freq_listening", rt.list(1351, 1355));
	rt.setSv(f, "autolinkers", rt.list("processor1", "science", "medical"));
	return f.dot;
});

// /obj/machinery/telecomms/bus/preset_two/proc/<init>  (_nofile:0)
rt.def("/obj/machinery/telecomms/bus/preset_two/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "freq_listening", rt.list(1347, 1349));
	rt.setSv(f, "autolinkers", rt.list("processor2", "supply", "service"));
	return f.dot;
});

// /obj/machinery/telecomms/bus/preset_three/proc/<init>  (_nofile:0)
rt.def("/obj/machinery/telecomms/bus/preset_three/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "freq_listening", rt.list(1359, 1353));
	rt.setSv(f, "autolinkers", rt.list("processor3", "security", "command"));
	return f.dot;
});

// /obj/machinery/telecomms/hub/preset/proc/<init>  (_nofile:0)
rt.def("/obj/machinery/telecomms/hub/preset/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "autolinkers", rt.list("hub", "relay", "s_relay", "m_relay", "r_relay", "science", "medical", "supply", "service", "common", "command", "engineering", "security", "receiverA", "receiverB", "broadcasterA", "broadcasterB"));
	return f.dot;
});

// /obj/machinery/porta_turret/lasertag/proc/<init>  (_nofile:0)
rt.def("/obj/machinery/porta_turret/lasertag/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(12, 46));
	return f.dot;
});

// /obj/machinery/limbgrower/proc/<init>  (_nofile:0)
rt.def("/obj/machinery/limbgrower/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "categories", rt.list("human", "lizard", "plasmaman", "special"));
	return f.dot;
});

// /obj/machinery/biogenerator/proc/<init>  (_nofile:0)
rt.def("/obj/machinery/biogenerator/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "show_categories", rt.list("Food", "Botany Chemicals", "Leather and Cloth"));
	rt.setSv(f, "timesFiveCategories", rt.list("Food", "Botany Chemicals"));
	return f.dot;
});

// /obj/machinery/bot_core/cleanbot/proc/<init>  (_nofile:0)
rt.def("/obj/machinery/bot_core/cleanbot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_one_access", rt.list(26, 29));
	return f.dot;
});

// /obj/machinery/bot_core/floorbot/proc/<init>  (_nofile:0)
rt.def("/obj/machinery/bot_core/floorbot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_one_access", rt.list(32, 29));
	return f.dot;
});

// /obj/machinery/bot_core/medbot/proc/<init>  (_nofile:0)
rt.def("/obj/machinery/bot_core/medbot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_one_access", rt.list(5, 29));
	return f.dot;
});

// /obj/machinery/anomalous_crystal/honk/proc/<init>  (_nofile:0)
rt.def("/obj/machinery/anomalous_crystal/honk/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_methods", rt.list("bumping", "speech"));
	return f.dot;
});

// /obj/machinery/r_n_d/circuit_imprinter/proc/<init>  (_nofile:0)
rt.def("/obj/machinery/r_n_d/circuit_imprinter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "categories", rt.list("AI Modules", "Computer Boards", "Teleportation Machinery", "Medical Machinery", "Engineering Machinery", "Exosuit Modules", "Hydroponics Machinery", "Subspace Telecomms", "Research Machinery", "Misc. Machinery", "Computer Parts"));
	return f.dot;
});

// /obj/machinery/r_n_d/protolathe/proc/<init>  (_nofile:0)
rt.def("/obj/machinery/r_n_d/protolathe/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "categories", rt.list("Power Designs", "Medical Designs", "Bluespace Designs", "Stock Parts", "Equipment", "Mining Designs", "Electronics", "Weapons", "Ammo", "Firing Pins", "Computer Parts"));
	return f.dot;
});

// /obj/effect/proc_holder/spell/targeted/view_range/proc/<init>  (_nofile:0)
rt.def("/obj/effect/proc_holder/spell/targeted/view_range/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ranges", rt.list(7, 8, 9, 10));
	return f.dot;
});

// /obj/effect/proc_holder/spell/targeted/genetic/mutate/proc/<init>  (_nofile:0)
rt.def("/obj/effect/proc_holder/spell/targeted/genetic/mutate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutations", rt.list("Laser Eyes", "Hulk"));
	return f.dot;
});

// /obj/effect/proc_holder/spell/targeted/mind_transfer/proc/<init>  (_nofile:0)
rt.def("/obj/effect/proc_holder/spell/targeted/mind_transfer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "protected_roles", rt.list("Wizard", "Changeling", "Cultist"));
	return f.dot;
});

// /obj/effect/proc_holder/spell/targeted/trigger/blind/proc/<init>  (_nofile:0)
rt.def("/obj/effect/proc_holder/spell/targeted/trigger/blind/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "starting_spells", rt.list("/obj/effect/proc_holder/spell/targeted/inflict_handler/blind", "/obj/effect/proc_holder/spell/targeted/genetic/blind"));
	return f.dot;
});

// /obj/effect/proc_holder/spell/voice_of_god/proc/<init>  (_nofile:0)
rt.def("/obj/effect/proc_holder/spell/voice_of_god/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spans", rt.list("colossus", "yell"));
	return f.dot;
});

// /obj/effect/decal/cleanable/robot_debris/proc/<init>  (_nofile:0)
rt.def("/obj/effect/decal/cleanable/robot_debris/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", rt.list("gib1", "gib2", "gib3", "gib4", "gib5", "gib6", "gib7"));
	return f.dot;
});

// /obj/effect/decal/cleanable/robot_debris/limb/proc/<init>  (_nofile:0)
rt.def("/obj/effect/decal/cleanable/robot_debris/limb/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", rt.list("gibarm", "gibleg"));
	return f.dot;
});

// /obj/effect/decal/cleanable/robot_debris/up/proc/<init>  (_nofile:0)
rt.def("/obj/effect/decal/cleanable/robot_debris/up/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", rt.list("gib1", "gib2", "gib3", "gib4", "gib5", "gib6", "gib7", "gibup1", "gibup1"));
	return f.dot;
});

// /obj/effect/decal/cleanable/robot_debris/down/proc/<init>  (_nofile:0)
rt.def("/obj/effect/decal/cleanable/robot_debris/down/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", rt.list("gib1", "gib2", "gib3", "gib4", "gib5", "gib6", "gib7", "gibdown1", "gibdown1"));
	return f.dot;
});

// /obj/effect/decal/cleanable/blood/splatter/proc/<init>  (_nofile:0)
rt.def("/obj/effect/decal/cleanable/blood/splatter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", rt.list("gibbl1", "gibbl2", "gibbl3", "gibbl4", "gibbl5"));
	return f.dot;
});

// /obj/effect/decal/cleanable/blood/gibs/proc/<init>  (_nofile:0)
rt.def("/obj/effect/decal/cleanable/blood/gibs/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", rt.list("gib1", "gib2", "gib3", "gib4", "gib5", "gib6"));
	return f.dot;
});

// /obj/effect/decal/cleanable/blood/gibs/up/proc/<init>  (_nofile:0)
rt.def("/obj/effect/decal/cleanable/blood/gibs/up/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", rt.list("gib1", "gib2", "gib3", "gib4", "gib5", "gib6", "gibup1", "gibup1", "gibup1"));
	return f.dot;
});

// /obj/effect/decal/cleanable/blood/gibs/down/proc/<init>  (_nofile:0)
rt.def("/obj/effect/decal/cleanable/blood/gibs/down/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", rt.list("gib1", "gib2", "gib3", "gib4", "gib5", "gib6", "gibdown1", "gibdown1", "gibdown1"));
	return f.dot;
});

// /obj/effect/decal/cleanable/blood/gibs/body/proc/<init>  (_nofile:0)
rt.def("/obj/effect/decal/cleanable/blood/gibs/body/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", rt.list("gibhead", "gibtorso"));
	return f.dot;
});

// /obj/effect/decal/cleanable/blood/gibs/limb/proc/<init>  (_nofile:0)
rt.def("/obj/effect/decal/cleanable/blood/gibs/limb/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", rt.list("gibleg", "gibarm"));
	return f.dot;
});

// /obj/effect/decal/cleanable/blood/gibs/core/proc/<init>  (_nofile:0)
rt.def("/obj/effect/decal/cleanable/blood/gibs/core/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", rt.list("gibmid1", "gibmid2", "gibmid3"));
	return f.dot;
});

// /obj/effect/decal/cleanable/blood/gibs/bubblegum/proc/<init>  (_nofile:0)
rt.def("/obj/effect/decal/cleanable/blood/gibs/bubblegum/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", rt.list("gib3", "gib5", "gib6"));
	return f.dot;
});

// /obj/effect/decal/cleanable/blood/drip/proc/<init>  (_nofile:0)
rt.def("/obj/effect/decal/cleanable/blood/drip/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", rt.list("drip1", "drip2", "drip3", "drip4", "drip5"));
	return f.dot;
});

// /obj/effect/decal/cleanable/xenoblood/xsplatter/proc/<init>  (_nofile:0)
rt.def("/obj/effect/decal/cleanable/xenoblood/xsplatter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", rt.list("xgibbl1", "xgibbl2", "xgibbl3", "xgibbl4", "xgibbl5"));
	return f.dot;
});

// /obj/effect/decal/cleanable/xenoblood/xgibs/proc/<init>  (_nofile:0)
rt.def("/obj/effect/decal/cleanable/xenoblood/xgibs/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", rt.list("xgib1", "xgib2", "xgib3", "xgib4", "xgib5", "xgib6"));
	return f.dot;
});

// /obj/effect/decal/cleanable/xenoblood/xgibs/up/proc/<init>  (_nofile:0)
rt.def("/obj/effect/decal/cleanable/xenoblood/xgibs/up/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", rt.list("xgib1", "xgib2", "xgib3", "xgib4", "xgib5", "xgib6", "xgibup1", "xgibup1", "xgibup1"));
	return f.dot;
});

// /obj/effect/decal/cleanable/xenoblood/xgibs/down/proc/<init>  (_nofile:0)
rt.def("/obj/effect/decal/cleanable/xenoblood/xgibs/down/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", rt.list("xgib1", "xgib2", "xgib3", "xgib4", "xgib5", "xgib6", "xgibdown1", "xgibdown1", "xgibdown1"));
	return f.dot;
});

// /obj/effect/decal/cleanable/xenoblood/xgibs/body/proc/<init>  (_nofile:0)
rt.def("/obj/effect/decal/cleanable/xenoblood/xgibs/body/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", rt.list("xgibhead", "xgibtorso"));
	return f.dot;
});

// /obj/effect/decal/cleanable/xenoblood/xgibs/limb/proc/<init>  (_nofile:0)
rt.def("/obj/effect/decal/cleanable/xenoblood/xgibs/limb/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", rt.list("xgibleg", "xgibarm"));
	return f.dot;
});

// /obj/effect/decal/cleanable/xenoblood/xgibs/core/proc/<init>  (_nofile:0)
rt.def("/obj/effect/decal/cleanable/xenoblood/xgibs/core/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", rt.list("xgibmid1", "xgibmid2", "xgibmid3"));
	return f.dot;
});

// /obj/effect/decal/cleanable/xenoblood/xgibs/larva/proc/<init>  (_nofile:0)
rt.def("/obj/effect/decal/cleanable/xenoblood/xgibs/larva/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", rt.list("xgiblarva1", "xgiblarva2"));
	return f.dot;
});

// /obj/effect/decal/cleanable/xenoblood/xgibs/larva/body/proc/<init>  (_nofile:0)
rt.def("/obj/effect/decal/cleanable/xenoblood/xgibs/larva/body/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", rt.list("xgiblarvahead", "xgiblarvatorso"));
	return f.dot;
});

// /obj/effect/decal/cleanable/tomato_smudge/proc/<init>  (_nofile:0)
rt.def("/obj/effect/decal/cleanable/tomato_smudge/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", rt.list("tomato_floor1", "tomato_floor2", "tomato_floor3"));
	return f.dot;
});

// /obj/effect/decal/cleanable/egg_smudge/proc/<init>  (_nofile:0)
rt.def("/obj/effect/decal/cleanable/egg_smudge/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", rt.list("smashed_egg1", "smashed_egg2", "smashed_egg3"));
	return f.dot;
});

// /obj/effect/decal/cleanable/oil/streak/proc/<init>  (_nofile:0)
rt.def("/obj/effect/decal/cleanable/oil/streak/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", rt.list("streak1", "streak2", "streak3", "streak4", "streak5"));
	return f.dot;
});

// /obj/effect/decal/cleanable/deadcockroach/proc/<init>  (_nofile:0)
rt.def("/obj/effect/decal/cleanable/deadcockroach/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", rt.list("xfloor1", "xfloor2", "xfloor3", "xfloor4", "xfloor5", "xfloor6", "xfloor7"));
	return f.dot;
});

// /obj/effect/mob_spawn/human/syndicate/battlecruiser/captain/proc/<init>  (_nofile:0)
rt.def("/obj/effect/mob_spawn/human/syndicate/battlecruiser/captain/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "id_access_list", rt.list(150, 151));
	return f.dot;
});

// /obj/effect/mob_spawn/human/commander/proc/<init>  (_nofile:0)
rt.def("/obj/effect/mob_spawn/human/commander/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "id_access_list", rt.list(109, 101, 103, 104, 106));
	return f.dot;
});

// /obj/effect/mob_spawn/human/nanotrasensoldier/proc/<init>  (_nofile:0)
rt.def("/obj/effect/mob_spawn/human/nanotrasensoldier/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "id_access_list", rt.list(109, 101, 103, 104, 106, 1));
	return f.dot;
});

// /obj/structure/punching_bag/proc/<init>  (_nofile:0)
rt.def("/obj/structure/punching_bag/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "hit_sounds", rt.list(rt.rsc("sound/weapons/genhit1.ogg"), rt.rsc("sound/weapons/genhit2.ogg"), rt.rsc("sound/weapons/genhit3.ogg"), rt.rsc("sound/weapons/punch1.ogg"), rt.rsc("sound/weapons/punch2.ogg"), rt.rsc("sound/weapons/punch3.ogg"), rt.rsc("sound/weapons/punch4.ogg")));
	return f.dot;
});

// /area/ai_monitored/turret_protected/tcomsat/proc/<init>  (_nofile:0)
rt.def("/area/ai_monitored/turret_protected/tcomsat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ambientsounds", rt.list(rt.rsc("sound/ambience/ambisin2.ogg"), rt.rsc("sound/ambience/signal.ogg"), rt.rsc("sound/ambience/signal.ogg"), rt.rsc("sound/ambience/ambigen10.ogg")));
	return f.dot;
});

// /area/ai_monitored/turret_protected/tcomfoyer/proc/<init>  (_nofile:0)
rt.def("/area/ai_monitored/turret_protected/tcomfoyer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ambientsounds", rt.list(rt.rsc("sound/ambience/ambisin2.ogg"), rt.rsc("sound/ambience/signal.ogg"), rt.rsc("sound/ambience/signal.ogg"), rt.rsc("sound/ambience/ambigen10.ogg")));
	return f.dot;
});

// /area/ai_monitored/turret_protected/tcomwest/proc/<init>  (_nofile:0)
rt.def("/area/ai_monitored/turret_protected/tcomwest/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ambientsounds", rt.list(rt.rsc("sound/ambience/ambisin2.ogg"), rt.rsc("sound/ambience/signal.ogg"), rt.rsc("sound/ambience/signal.ogg"), rt.rsc("sound/ambience/ambigen10.ogg")));
	return f.dot;
});

// /area/ai_monitored/turret_protected/tcomeast/proc/<init>  (_nofile:0)
rt.def("/area/ai_monitored/turret_protected/tcomeast/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ambientsounds", rt.list(rt.rsc("sound/ambience/ambisin2.ogg"), rt.rsc("sound/ambience/signal.ogg"), rt.rsc("sound/ambience/signal.ogg"), rt.rsc("sound/ambience/ambigen10.ogg")));
	return f.dot;
});

// /area/space/proc/<init>  (_nofile:0)
rt.def("/area/space/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ambientsounds", rt.list(rt.rsc("sound/ambience/ambispace.ogg"), rt.rsc("sound/ambience/title2.ogg")));
	return f.dot;
});

// /area/maintenance/proc/<init>  (_nofile:0)
rt.def("/area/maintenance/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ambientsounds", rt.list(rt.rsc("sound/ambience/ambimaint1.ogg"), rt.rsc("sound/ambience/ambimaint2.ogg"), rt.rsc("sound/ambience/ambimaint3.ogg"), rt.rsc("sound/ambience/ambimaint4.ogg"), rt.rsc("sound/ambience/ambimaint5.ogg"), rt.rsc("sound/voice/lowHiss2.ogg"), rt.rsc("sound/voice/lowHiss3.ogg"), rt.rsc("sound/voice/lowHiss4.ogg")));
	return f.dot;
});

// /area/chapel/proc/<init>  (_nofile:0)
rt.def("/area/chapel/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ambientsounds", rt.list(rt.rsc("sound/ambience/ambicha1.ogg"), rt.rsc("sound/ambience/ambicha2.ogg"), rt.rsc("sound/ambience/ambicha3.ogg"), rt.rsc("sound/ambience/ambicha4.ogg")));
	return f.dot;
});

// /area/engine/proc/<init>  (_nofile:0)
rt.def("/area/engine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ambientsounds", rt.list(rt.rsc("sound/ambience/ambisin1.ogg"), rt.rsc("sound/ambience/ambisin2.ogg"), rt.rsc("sound/ambience/ambisin3.ogg"), rt.rsc("sound/ambience/ambisin4.ogg")));
	return f.dot;
});

// /area/medical/morgue/proc/<init>  (_nofile:0)
rt.def("/area/medical/morgue/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ambientsounds", rt.list(rt.rsc("sound/ambience/ambimo1.ogg"), rt.rsc("sound/ambience/ambimo2.ogg")));
	return f.dot;
});

// /area/security/detectives_office/proc/<init>  (_nofile:0)
rt.def("/area/security/detectives_office/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ambientsounds", rt.list(rt.rsc("sound/ambience/ambidet1.ogg"), rt.rsc("sound/ambience/ambidet2.ogg")));
	return f.dot;
});

// /area/security/detectives_office/private_investigators_office/proc/<init>  (_nofile:0)
rt.def("/area/security/detectives_office/private_investigators_office/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ambientsounds", rt.list(rt.rsc("sound/ambience/ambidet1.ogg"), rt.rsc("sound/ambience/ambidet2.ogg")));
	return f.dot;
});

// /area/tcommsat/proc/<init>  (_nofile:0)
rt.def("/area/tcommsat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ambientsounds", rt.list(rt.rsc("sound/ambience/ambisin2.ogg"), rt.rsc("sound/ambience/signal.ogg"), rt.rsc("sound/ambience/signal.ogg"), rt.rsc("sound/ambience/ambigen10.ogg")));
	return f.dot;
});

// /area/awaymission/beach/proc/<init>  (_nofile:0)
rt.def("/area/awaymission/beach/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ambientsounds", rt.list(rt.rsc("sound/ambience/shore.ogg"), rt.rsc("sound/ambience/seag1.ogg"), rt.rsc("sound/ambience/seag2.ogg"), rt.rsc("sound/ambience/seag2.ogg")));
	return f.dot;
});

// /area/prison/morgue/proc/<init>  (_nofile:0)
rt.def("/area/prison/morgue/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ambientsounds", rt.list(rt.rsc("sound/ambience/ambimo1.ogg"), rt.rsc("sound/ambience/ambimo2.ogg")));
	return f.dot;
});

// /area/ruin/fakespace/proc/<init>  (_nofile:0)
rt.def("/area/ruin/fakespace/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ambientsounds", rt.list(rt.rsc("sound/ambience/ambispace.ogg"), rt.rsc("sound/ambience/title2.ogg")));
	return f.dot;
});

// /datum/controller/proc/Initialize  empty
rt.def("/datum/controller/proc/Initialize");

// /datum/controller/proc/Shutdown  empty
rt.def("/datum/controller/proc/Shutdown");

// /datum/controller/proc/StartLoadingMap  empty
rt.def("/datum/controller/proc/StartLoadingMap");

// /datum/controller/proc/StopLoadingMap  empty
rt.def("/datum/controller/proc/StopLoadingMap");

// /datum/controller/proc/Recover  empty
rt.def("/datum/controller/proc/Recover");

// /datum/controller/proc/stat_entry  empty
rt.def("/datum/controller/proc/stat_entry");

// /datum/round_event/wizard/shuffle/proc/start  empty
rt.def("/datum/round_event/wizard/shuffle/proc/start");

// /datum/verbs/menu/Icon/Size/verb/iconstretchtofit  empty
rt.def("/datum/verbs/menu/Icon/Size/verb/iconstretchtofit", undefined, false, { verb: { name: "@.winset \"mapwindow.map.icon-size=0\"", desc: "&Auto (stretch-to-fit)" } });

// /datum/verbs/menu/Icon/Size/verb/icon96  empty
rt.def("/datum/verbs/menu/Icon/Size/verb/icon96", undefined, false, { verb: { name: "@.winset \"mapwindow.map.icon-size=96\"", desc: "&96x96 (3x)" } });

// /datum/verbs/menu/Icon/Size/verb/icon64  empty
rt.def("/datum/verbs/menu/Icon/Size/verb/icon64", undefined, false, { verb: { name: "@.winset \"mapwindow.map.icon-size=64\"", desc: "&64x64 (2x)" } });

// /datum/verbs/menu/Icon/Size/verb/icon48  empty
rt.def("/datum/verbs/menu/Icon/Size/verb/icon48", undefined, false, { verb: { name: "@.winset \"mapwindow.map.icon-size=48\"", desc: "&48x48 (1.5x)" } });

// /datum/verbs/menu/Icon/Size/verb/icon32  empty
rt.def("/datum/verbs/menu/Icon/Size/verb/icon32", undefined, false, { verb: { name: "@.winset \"mapwindow.map.icon-size=32\"", desc: "&32x32 (1x)" } });

// /datum/verbs/menu/Icon/Scaling/verb/NN  empty
rt.def("/datum/verbs/menu/Icon/Scaling/verb/NN", undefined, false, { verb: { name: "@.winset \"mapwindow.map.zoom-mode=distort\"", desc: "Nearest Neighbor" } });

// /datum/verbs/menu/Icon/Scaling/verb/PS  empty
rt.def("/datum/verbs/menu/Icon/Scaling/verb/PS", undefined, false, { verb: { name: "@.winset \"mapwindow.map.zoom-mode=normal\"", desc: "Point Sampling" } });

// /datum/verbs/menu/Icon/Scaling/verb/BL  empty
rt.def("/datum/verbs/menu/Icon/Scaling/verb/BL", undefined, false, { verb: { name: "@.winset \"mapwindow.map.zoom-mode=blur\"", desc: "Bilinear" } });

// /proc/poll_helper  empty
rt.def("/proc/poll_helper", undefined, false, { args: ["M"] });
