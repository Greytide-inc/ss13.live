// Based on /tg/station's code/_onclick/autoclick.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(4801, "/client", "/datum", {
	selected_target: null,
	active_mousedown_item: null,
	mouseParams: "",
	mouseLocation: null,
	mouseObject: null,
	mouseControlObject: null,
	parallax_layers: null,
	parallax_layers_cached: null,
	movingmob: null,
	previous_turf: null,
	dont_animate_parallax: null,
	last_parallax_shift: null,
	parallax_throttle: 0,
	parallax_movedir: 0,
	parallax_layers_max: 3,
	parallax_animate_timer: null,
	runechat_lines: null,
	adminhelptimerid: 0,
	current_ticket: null,
	cache: null,
	completed_asset_jobs: null,
	sending: null,
	last_asset_job: 0,
	holder: null,
	click_intercept: null,
	AI_Interact: 0,
	last_message: "",
	last_message_count: 0,
	prefs: null,
	move_delay: 1,
	moving: null,
	area: null,
	ambience_playing: null,
	played: 0,
	player_join_date: null,
	related_accounts_ip: "Requires database",
	related_accounts_cid: "Requires database",
	account_join_date: null,
	hi_last_pos: null,
	tooltips: null,
	lastping: 0,
	avgping: 0,
	connection_time: null,
	connection_realtime: null,
	connection_timeofday: null,
	inprefs: 0,
	topiclimiter: null,
	chatOutput: null,
	verbs: null,
	screen: null,
	images: null,
	vars: null,
	statobj: null,
	statpanel: null,
	default_verb_category: "Commands",
	tag: null,
	type: rt.typePath("/client"),
	mob: null,
	eye: null,
	lazy_eye: 0,
	perspective: 0,
	edge_limit: null,
	view: null,
	pixel_x: 0,
	pixel_y: 0,
	pixel_z: 0,
	pixel_w: 0,
	show_popup_menus: 1,
	show_verb_panel: 1,
	byond_version: 511,
	byond_build: 1385,
	address: null,
	inactivity: 0,
	key: null,
	ckey: null,
	connection: null,
	computer_id: 0,
	tick_lag: 0,
	authenticate: 1,
	timezone: null,
	script: "<style>\nbody\t\t\t\t\t{font-family: Verdana, sans-serif;}\n\nh1, h2, h3, h4, h5, h6\t{color: #0000ff;\tfont-family: Georgia, Verdana, sans-serif;}\n\nem\t\t\t\t\t\t{font-style: normal;\tfont-weight: bold;}\n\n.motd\t\t\t\t\t{color: #638500;\tfont-family: Verdana, sans-serif;}\n.motd h1, .motd h2, .motd h3, .motd h4, .motd h5, .motd h6\n\t{color: #638500;\ttext-decoration: underline;}\n.motd a, .motd a:link, .motd a:visited, .motd a:active, .motd a:hover\n\t{color: #638500;}\n\n.italics\t\t\t\t{\t\t\t\t\tfont-style: italic;}\n\n.bold\t\t\t\t\t{\t\t\t\t\tfont-weight: bold;}\n\n.prefix\t\t\t\t\t{\t\t\t\t\tfont-weight: bold;}\n\n.ooc\t\t\t\t\t{\t\t\t\t\tfont-weight: bold;}\n.adminobserverooc\t\t{color: #0099cc;\tfont-weight: bold;}\n.adminooc\t\t\t\t{color: #700038;\tfont-weight: bold;}\n\n.adminobserver\t\t\t{color: #996600;\tfont-weight: bold;}\n.admin\t\t\t\t\t{color: #386aff;\tfont-weight: bold;}\n\n.name\t\t\t\t\t{\t\t\t\t\tfont-weight: bold;}\n\n.say\t\t\t\t\t{}\n.deadsay\t\t\t\t{color: #5c00e6;}\n.radio\t\t\t\t\t{color: #008000;}\n.sciradio\t\t\t\t{color: #993399;}\n.comradio\t\t\t\t{color: #948f02;}\n.secradio\t\t\t\t{color: #a30000;}\n.medradio\t\t\t\t{color: #337296;}\n.engradio\t\t\t\t{color: #fb5613;}\n.suppradio\t\t\t\t{color: #a8732b;}\n.servradio\t\t\t\t{color: #6eaa2c;}\n.syndradio\t\t\t\t{color: #6d3f40;}\n.centcomradio\t\t\t{color: #686868;}\n.aiprivradio\t\t\t{color: #ff00ff;}\n.redteamradio           {color: #ff0000;}\n.blueteamradio          {color: #0000ff;}\n\n.yell\t\t\t\t\t{\t\t\t\t\tfont-weight: bold;}\n\n.alert\t\t\t\t\t{color: #ff0000;}\nh1.alert, h2.alert\t\t{color: #000000;}\n\n.emote\t\t\t\t\t{\t\t\t\t\tfont-style: italic;}\n.selecteddna\t\t\t{color: #ffffff; \tbackground-color: #001B1B}\n\n.attack\t\t\t\t\t{color: #ff0000;}\n.disarm\t\t\t\t\t{color: #990000;}\n.passive\t\t\t\t{color: #660000;}\n\n.userdanger\t\t\t\t{color: #ff0000;\tfont-weight: bold; font-size: 3;}\n.danger\t\t\t\t\t{color: #ff0000;}\n.warning\t\t\t\t{color: #ff0000;\tfont-style: italic;}\n.boldwarning\t\t\t{color: #ff0000;\tfont-style: italic;\tfont-weight: bold}\n.announce \t\t\t\t{color: #228b22;\tfont-weight: bold;}\n.boldannounce\t\t\t{color: #ff0000;\tfont-weight: bold;}\n.greenannounce\t\t\t{color: #00ff00;\tfont-weight: bold;}\n.rose\t\t\t\t\t{color: #ff5050;}\n.info\t\t\t\t\t{color: #0000CC;}\n.notice\t\t\t\t\t{color: #000099;}\n.boldnotice\t\t\t\t{color: #000099;\tfont-weight: bold;}\n.adminnotice\t\t\t{color: #0000ff;}\n.adminhelp              {color: #ff0000;    font-weight: bold;}\n.unconscious\t\t\t{color: #0000ff;\tfont-weight: bold;}\n.suicide\t\t\t\t{color: #ff5050;\tfont-style: italic;}\n.green\t\t\t\t\t{color: #03ff39;}\n.shadowling\t\t\t\t{color: #3b2769;}\n.cult\t\t\t\t\t{color: #960000;}\n.cultitalic\t\t\t\t{color: #960000;\tfont-style: italic;}\n.cultlarge\t\t\t\t{color: #960000; font-weight: bold; font-size: 3;}\n.narsie\t\t\t\t\t{color: #960000; font-weight: bold; font-size: 15;}\n.narsiesmall\t\t\t{color: #960000; font-weight: bold; font-size: 6;}\n.colossus\t\t\t\t{color: #7F282A; font-size: 5;}\n.hierophant\t\t\t\t{color: #660099; font-weight: bold; font-style: italic;}\n.hierophant_warning\t\t{color: #660099; font-style: italic;}\n.purple\t\t\t\t\t{color: #5e2d79;}\n.holoparasite\t\t\t{color: #35333a;}\n.holoparasitebold\t\t{color: #35333a;\tfont-weight: bold;}\n\n.revennotice\t\t\t{color: #1d2953;}\n.revenboldnotice\t\t{color: #1d2953;\tfont-weight: bold;}\n.revenbignotice\t\t\t{color: #1d2953;\tfont-weight: bold; font-size: 3;}\n.revenminor\t\t\t\t{color: #823abb}\n.revenwarning\t\t\t{color: #760fbb;\tfont-style: italic;}\n.revendanger\t\t\t{color: #760fbb;\tfont-weight: bold; font-size: 3;}\n.umbra\t\t\t\t\t{color: #5000A0;}\n.umbra_bold\t\t\t\t{color: #5000A0;\tfont-weight: bold;}\n.umbra_italics\t\t\t{color: #5000A0;\tfont-style: italic;}\n.umbra_emphasis\t\t\t{color: #5000A0;\tfont-weight: bold;\tfont-style: italic;}\n.umbra_large\t\t\t{color: #5000A0;\tfont-size: 3;}\n\n.brass\t\t\t\t\t{color: #BE8700;}\n.heavy_brass\t\t\t{color: #BE8700; font-weight: bold; font-style: italic;}\n.large_brass\t\t\t{color: #BE8700; font-size: 3;}\n.big_brass\t\t\t\t{color: #BE8700; font-size: 3; font-weight: bold; font-style: italic;}\n.ratvar\t\t\t\t\t{color: #BE8700; font-size: 6; font-weight: bold; font-style: italic;}\n.alloy\t\t\t\t\t{color: #42474D;}\n.heavy_alloy\t\t\t{color: #42474D; font-weight: bold; font-style: italic;}\n.large_alloy\t\t\t{color: #42474D; font-size: 3;}\n.nezbere_large\t\t\t{color: #42474D; font-size: 3; font-weight: bold; font-style: italic;}\n.nezbere\t\t\t\t{color: #42474D; font-weight: bold; font-style: italic;}\n.nezbere_small\t\t\t{color: #42474D;}\n.sevtug_large\t\t\t{color: #AF0AAF; font-size: 3; font-weight: bold; font-style: italic;}\n.sevtug\t\t\t\t\t{color: #AF0AAF; font-weight: bold; font-style: italic;}\n.sevtug_small\t\t\t{color: #AF0AAF;}\n.inathneq_large\t\t\t{color: #1E8CE1; font-size: 3; font-weight: bold; font-style: italic;}\n.inathneq\t\t\t\t{color: #1E8CE1; font-weight: bold; font-style: italic;}\n.inathneq_small\t\t\t{color: #1E8CE1;}\n.nzcrentr_large\t\t\t{color: #DAAA18; font-size: 3; font-weight: bold; font-style: italic;}\n.nzcrentr\t\t\t\t{color: #DAAA18; font-weight: bold; font-style: italic;}\n.nzcrentr_small\t\t\t{color: #DAAA18;}\n.neovgre_large\t\t\t{color: #6E001A; font-size: 3; font-weight: bold; font-style: italic;}\n.neovgre\t\t\t\t{color: #6E001A; font-weight: bold; font-style: italic;}\n.neovgre_small\t\t\t{color: #6E001A;}\n\n.newscaster\t\t\t\t{color: #800000;}\n.ghostalert\t\t\t\t{color: #5c00e6;\tfont-style: italic; font-weight: bold;}\n\n.alien\t\t\t\t\t{color: #543354;}\n.noticealien\t\t\t{color: #00c000;}\n.alertalien\t\t\t\t{color: #00c000;\tfont-weight: bold;}\n.changeling\t\t\t\t{color: #800080;\tfont-style: italic;}\n\n.interface\t\t\t\t{color: #330033;}\n\n.sans\t\t\t\t\t{font-family: \"Comic Sans MS\", cursive, sans-serif;}\n.papyrus\t\t\t\t{font-family: \"Papyrus\", cursive, sans-serif;}\n.robot\t\t\t\t\t{font-family: \"Courier New\", cursive, sans-serif;}\n\n.command_headset\t\t{font-weight: bold; font-size: 3;}\n.small\t\t\t\t\t{font-size: 1;}\n.big\t\t\t\t\t{font-size: 3;}\n.reallybig\t\t\t\t{font-size: 4;}\n.greentext\t\t\t\t{color: #00FF00;\tfont-size: 3;}\n.redtext\t\t\t\t{color: #FF0000;\tfont-size: 3;}\n.clown\t\t\t\t\t{color: #FF69Bf;\tfont-size: 3; font-family: \"Comic Sans MS\", cursive, sans-serif; font-weight: bold;}\n.his_grace\t\t\t\t{color: #15D512;\tfont-family: \"Courier New\", cursive, sans-serif; font-style: italic;}\n\nBIG IMG.icon \t\t\t{width: 32px; height: 32px;}\n\n.memo\t\t\t\t\t{color: #638500;\ttext-align: center;}\n.memoedit\t\t\t\t{text-align: center;\tfont-size: 2;}\n.abductor\t\t\t\t{color: #800080; font-style: italic;}\n.slime\t\t\t\t\t{color: #00CED1;}\n.drone\t\t\t\t\t{color: #848482;}\n.monkey\t\t\t\t\t{color: #975032;}\n.swarmer\t\t\t\t{color: #2C75FF;}\n.resonate\t\t\t\t{color: #298F85;}\n</style>",
	color: 0,
	control_freak: 1,
	mouse_pointer_icon: null,
	preload_rsc: 1,
	fps: 0,
	dir: 1,
	gender: "neuter",
	glide_size: null,
	virtual_eye: null,
	bounds: null,
	bound_x: null,
	bound_y: null,
	bound_width: null,
	bound_height: null,
}, { global: { void: 697 }, const: ["type"] });

// autoclick.dm:2
rt.def("/client/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.selected_target = rt.op(f, "CreateMultidimensionalList", [1], [2]);

	this.cache = list();

	this.completed_asset_jobs = list();

	this.sending = list();
	return f.dot;
});

// autoclick.dm:10
rt.def("/client/proc/MouseDown", function* MouseDown(f: Frame, object: Value, location: Value, control: Value, params: Value) {
	let delay: Value = null;
	if (delay = this.mob.CanMobAutoclick(object, location, params)) {
		rt.setAt(this.selected_target, 1, object);
		rt.setAt(this.selected_target, 2, params);
		while (rt.index(this.selected_target, 1)) {
			yield* this.Click(rt.index(this.selected_target, 1), location, control, rt.index(this.selected_target, 2));
			yield* sleep(delay);
		}
	}
	this.active_mousedown_item = this.mob.canMobMousedown(object, location, params);
	if (!this.active_mousedown_item) return f.dot;
	this.active_mousedown_item.onMouseDown(object, location, params, this.mob);
	return f.dot;
}, true);

// autoclick.dm:22
rt.def("/client/proc/MouseUp", function* MouseUp(f: Frame, object: Value, location: Value, control: Value, params: Value) {
	rt.setAt(this.selected_target, 1, null);
	if (!this.active_mousedown_item) return f.dot;
	yield* this.active_mousedown_item.onMouseUp(object, location, params, this.mob);
	this.active_mousedown_item = null;
	return f.dot;
}, true);

// autoclick.dm:28
rt.def("/client/proc/MouseDrag", function MouseDrag(f: Frame, src_object: Value, over_object: Value, src_location: Value, over_location: Value, src_control: Value, over_control: Value, params: Value) {
	this.mouseParams = params;
	this.mouseLocation = over_location;
	this.mouseObject = over_object;
	this.mouseControlObject = over_control;
	if (rt.index(this.selected_target, 1) && over_object && over_object.IsAutoclickable()) {
		rt.setAt(this.selected_target, 1, over_object);
		rt.setAt(this.selected_target, 2, params);
	}
	if (!this.active_mousedown_item) return f.dot;
	this.active_mousedown_item.onMouseDrag(src_object, over_object, src_location, over_location, params, this.mob);
	return f.dot;
});

// autoclick.dm:41
rt.def("/mob/living/carbon/proc/CanMobAutoclick", function CanMobAutoclick(f: Frame, object: Value, location: Value, params: Value) {
	let h: Value = null;
	if (!object.IsAutoclickable()) {
		return f.dot;
	}
	if (!(h = this.get_active_held_item())) return f.dot;
	f.dot = h.CanItemAutoclick(object, location, params);
	return f.dot;
});

// autoclick.dm:50
rt.def("/mob/living/carbon/proc/canMobMousedown", function canMobMousedown(f: Frame, object: Value, location: Value, params: Value) {
	let H: Value = null;
	if (!(H = this.get_active_held_item())) return f.dot;
	f.dot = H.canItemMouseDown(object, location, params);
	return f.dot;
});

// autoclick.dm:76
rt.def("/obj/item/weapon/gun/proc/CanItemAutoclick", function CanItemAutoclick(f: Frame, object: Value, location: Value, params: Value) {
	f.dot = this.automatic;
	return f.dot;
});

// autoclick.dm:89
rt.def("/client/proc/MouseMove", function MouseMove(f: Frame, object: Value, location: Value, control: Value, params: Value) {
	this.mouseParams = params;
	this.mouseLocation = location;
	this.mouseObject = object;
	this.mouseControlObject = control;
	return f.dot;
});
