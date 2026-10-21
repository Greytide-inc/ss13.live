// Types declared in web/game that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../build/dist/src/translate/runtime.js";

rt.type(0, "/", null, {}, { global: { config: 813, comms_key: 814, comms_allowed: 815, medal_hub: 816, medal_pass: 817, medals_enabled: 818, sqladdress: 819, sqlport: 820, sqlfdbkdb: 821, sqlfdbklogin: 822, sqlfdbkpass: 823, sqlfdbktableprefix: 824, Failsafe: 825, GLOB: 826, Master: 827, SSacid: 828, SSair: 829, SSassets: 830, SSatoms: 831, SSaugury: 832, SSblackbox: 833, SScommunications: 834, SSdbcore: 835, SSdisease: 836, SSevents: 837, SSfire_burning: 838, SSgarbage: 839, SSicon_smooth: 840, SSinbounds: 841, SSipintel: 842, SSjob: 843, SSlanguage: 844, SSlighting: 845, SSmachines: 846, SSmapping: 847, SSminimap: 848, SSmobs: 849, SSnpcpool: 850, SSorbit: 851, SSpai: 852, SSparallax: 853, SSpersistence: 854, SSradio: 855, SSreligion: 856, SSserver_maint: 857, SSshuttle: 858, SSspacedrift: 859, SSsqueak: 860, SSstickyban: 861, SSsun: 862, SStgui: 863, SSthrowing: 864, SSticker: 865, SStime_track: 866, SStimer: 867, SStitle: 868, SSvote: 869, SSweather: 870, SSfastprocess: 871, SSfields: 872, SSflightpacks: 873, SSobj: 874, SSoverlays: 875, SSprocessing: 876, UNIX: 879, NORTH: 880, SOUTH: 881, EAST: 882, WEST: 883, NORTHEAST: 884, NORTHWEST: 885, SOUTHEAST: 886, SOUTHWEST: 887, UP: 888, DOWN: 889, BLIND: 890, SEE_MOBS: 891, SEE_OBJS: 892, SEE_TURFS: 893, SEE_SELF: 894, SEE_INFRA: 895, SEE_PIXELS: 896, SEE_THRU: 897, SEE_BLACKNESS: 898, MOB_PERSPECTIVE: 899, EYE_PERSPECTIVE: 900, EDGE_PERSPECTIVE: 901, FLOAT_LAYER: 902, AREA_LAYER: 903, TURF_LAYER: 904, OBJ_LAYER: 905, MOB_LAYER: 906, FLY_LAYER: 907, EFFECTS_LAYER: 908, TOPDOWN_LAYER: 909, BACKGROUND_LAYER: 910, FLOAT_PLANE: 911, TOPDOWN_MAP: 912, ISOMETRIC_MAP: 913, SIDE_MAP: 914, TILED_ICON_MAP: 915, TRUE: 916, FALSE: 917, MALE: 918, FEMALE: 919, NEUTER: 920, PLURAL: 921, MOUSE_INACTIVE_POINTER: 922, MOUSE_ACTIVE_POINTER: 923, MOUSE_DRAG_POINTER: 924, MOUSE_DROP_POINTER: 925, MOUSE_ARROW_POINTER: 926, MOUSE_CROSSHAIRS_POINTER: 927, MOUSE_HAND_POINTER: 928, MOUSE_LEFT_BUTTON: 929, MOUSE_RIGHT_BUTTON: 930, MOUSE_MIDDLE_BUTTON: 931, MOUSE_CTRL_KEY: 932, MOUSE_SHIFT_KEY: 933, MOUSE_ALT_KEY: 934, MS_WINDOWS: 935, SOUND_MUTE: 936, SOUND_PAUSED: 937, SOUND_STREAM: 938, SOUND_UPDATE: 939, BLEND_DEFAULT: 940, BLEND_OVERLAY: 941, BLEND_ADD: 942, BLEND_SUBTRACT: 943, BLEND_MULTIPLY: 944, BLEND_INSET_OVERLAY: 945 } });
rt.type(13802, "/alist", "/", {
	len: null,
	type: rt.typePath("/alist"),
}, { const: ["type"] });
rt.type(13803, "/callee", "/", {
	proc: null,
	args: null,
	caller: null,
	name: null,
	desc: null,
	category: null,
	file: null,
	line: null,
	src: null,
	usr: null,
});
rt.type(13809, "/list", "/", {
	len: null,
	type: rt.typePath("/list"),
}, { const: ["type"] });
rt.type(13813, "/savefile", "/", {
	cd: null,
	dir: null,
	eof: null,
	name: null,
});
