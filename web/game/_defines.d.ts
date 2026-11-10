// tg's #defines that web/game procs name (phrasebook step 4), written by tools/pb-defines.mjs. Ambient: a proc just writes DEAD; the build (translate-tg) writes the number back,
// so the bundle is the same. Each block is one tg file; the comment beside a name is its line there.

// code/__DEFINES/DNA.dm
declare const CHAMELEON_MUTATION_DEFAULT_TRANSPARENCY: 204; // :35
declare const DIGITIGRADE: 25; // :116
declare const DNA_BLOCK_SIZE: 3; // :62
declare const DNA_EYE_COLOR_BLOCK: 4; // :68
declare const DNA_FACIAL_HAIR_COLOR_BLOCK: 2; // :66
declare const DNA_FACIAL_HAIR_STYLE_BLOCK: 6; // :70
declare const DNA_GENDER_BLOCK: 5; // :69
declare const DNA_HAIR_COLOR_BLOCK: 1; // :65
declare const DNA_HAIR_STYLE_BLOCK: 7; // :71
declare const DNA_SKIN_TONE_BLOCK: 3; // :67
declare const DNA_STRUC_ENZYMES_BLOCKS: 19; // :73
declare const DNA_UNI_IDENTITY_BLOCKS: 7; // :64
declare const DNA_UNIQUE_ENZYMES_LEN: 32; // :74
declare const EASYDISMEMBER: 22; // :113
declare const EASYLIMBATTACHMENT: 23; // :114
declare const EYECOLOR: 4; // :95
declare const FACEHAIR: 3; // :94
declare const HAIR: 2; // :93
declare const LIPS: 5; // :96
declare const MINOR_NEGATIVE: 3; // :42
declare const MUTCOLORS: 1; // :92
declare const NEGATIVE: 2; // :41
declare const NO_UNDERWEAR: 26; // :117
declare const NOBLOOD: 12; // :103
declare const NOBREATH: 10; // :101
declare const NOCRITDAMAGE: 20; // :111
declare const NODISMEMBER: 18; // :109
declare const NOFIRE: 13; // :104
declare const NOGUNS: 11; // :102
declare const NOHUNGER: 19; // :110
declare const NON_SCANNABLE: -1; // :45
declare const NOTRANSSTING: 16; // :107
declare const NOZOMBIE: 21; // :112
declare const PIERCEIMMUNE: 15; // :106
declare const POSITIVE: 1; // :40
declare const RADIMMUNE: 9; // :100
declare const RESISTCOLD: 7; // :98
declare const RESISTHOT: 6; // :97
declare const RESISTPRESSURE: 8; // :99
declare const TOXINLOVER: 24; // :115
declare const TR_DEFAULTMSG: 64; // :83
declare const TR_HASHNAME: 8; // :80
declare const TR_KEEPDAMAGE: 4; // :79
declare const TR_KEEPIMPLANTS: 16; // :81
declare const TR_KEEPITEMS: 1; // :77
declare const TR_KEEPORGANS: 256; // :85
declare const TR_KEEPSE: 32; // :82
declare const TR_KEEPVIRUS: 2; // :78
declare const VIRUSIMMUNE: 14; // :105

// code/__DEFINES/MC.dm
declare const SS_BACKGROUND: 4; // :37
declare const SS_IDLE: 0; // :59
declare const SS_KEEP_TIMING: 32; // :51
declare const SS_NO_FIRE: 2; // :33
declare const SS_NO_INIT: 1; // :28
declare const SS_NO_TICK_CHECK: 8; // :40
declare const SS_PAUSED: 3; // :62
declare const SS_PAUSING: 5; // :64
declare const SS_POST_FIRE_TIMING: 64; // :56
declare const SS_QUEUED: 1; // :60
declare const SS_RUNNING: 2; // :61
declare const SS_SLEEPING: 4; // :63
declare const SS_TICKER: 16; // :47

// code/__DEFINES/atmospherics.dm
declare const ATMOS_PASS_DENSITY: -2; // :172
declare const BODYTEMP_AUTORECOVERY_DIVISOR: 12; // :86
declare const BODYTEMP_AUTORECOVERY_MINIMUM: 10; // :87
declare const BODYTEMP_COLD_DAMAGE_LIMIT: 260.15; // :94
declare const BODYTEMP_COLD_DIVISOR: 6; // :88
declare const BODYTEMP_COOLING_MAX: 30; // :90
declare const BODYTEMP_HEAT_DAMAGE_LIMIT: 360.15; // :93
declare const BODYTEMP_HEAT_DIVISOR: 6; // :89
declare const BODYTEMP_HEATING_MAX: 30; // :91
declare const BREATH_VOLUME: 0.5; // :24
declare const CELL_VOLUME: 2500; // :23
declare const COLD_SLOWDOWN_FACTOR: 20; // :124
declare const FIRE_CARBON_ENERGY_RELEASED: 500000; // :57
declare const FIRE_GROWTH_RATE: 40000; // :59
declare const FIRE_IMMUNITY_SUIT_MAX_TEMP_PROTECT: 35000; // :106
declare const FIRE_PLASMA_ENERGY_RELEASED: 3000000; // :58
declare const FIRE_SUIT_MAX_TEMP_PROTECT: 30000; // :102
declare const HAZARD_HIGH_PRESSURE: 550; // :80
declare const HAZARD_LOW_PRESSURE: 20; // :83
declare const LOW_PRESSURE_DAMAGE: 2; // :122
declare const MAX_HIGH_PRESSURE_DAMAGE: 4; // :121
declare const MAX_OUTPUT_PRESSURE: 4500; // :127
declare const MAX_TRANSFER_RATE: 200; // :128
declare const MINIMUM_TEMPERATURE_DELTA_TO_CONSIDER: 0.5; // :43
declare const MOLES_PLASMA_VISIBLE: 0.5; // :72
declare const PRESSURE_DAMAGE_COEFFICIENT: 4; // :120
declare const SPACE_HELM_MIN_TEMP_PROTECT: 2; // :96
declare const TANK_FRAGMENT_PRESSURE: 4053; // :32
declare const TEMPERATURE_DAMAGE_COEFFICIENT: 1.5; // :85
declare const WARNING_HIGH_PRESSURE: 325; // :81
declare const WARNING_LOW_PRESSURE: 50; // :82

// code/__DEFINES/atom_hud.dm
declare const ANTAG_HUD_ABDUCTOR: 14; // :38
declare const ANTAG_HUD_CHANGELING: 13; // :37
declare const ANTAG_HUD_CLOCKWORK: 18; // :42
declare const ANTAG_HUD_CULT: 6; // :30
declare const ANTAG_HUD_DEVIL: 15; // :39
declare const ANTAG_HUD_NINJA: 12; // :36
declare const ANTAG_HUD_OPS: 8; // :32
declare const ANTAG_HUD_REV: 7; // :31
declare const ANTAG_HUD_SINTOUCHED: 16; // :40
declare const ANTAG_HUD_SOULLESS: 17; // :41
declare const ANTAG_HUD_TRAITOR: 11; // :35
declare const ANTAG_HUD_WIZ: 9; // :33
declare const DATA_HUD_DIAGNOSTIC: 5; // :28
declare const DATA_HUD_MEDICAL_ADVANCED: 4; // :27
declare const DATA_HUD_MEDICAL_BASIC: 3; // :26
declare const DATA_HUD_SECURITY_ADVANCED: 2; // :25

// code/__DEFINES/clockcult.dm
declare const ACTIVE_CACHE_SLOWDOWN: 50; // :42
declare const APPLICATION_CACHE_REQ: 3; // :26
declare const APPLICATION_CV_REQ: 100; // :27
declare const APPLICATION_SERVANT_REQ: 9; // :25
declare const CACHE_PRODUCTION_TIME: 300; // :40
declare const FABRICATOR_REPAIR_PER_TICK: 4; // :92
declare const GATEWAY_RATVAR_ARRIVAL: 300; // :78
declare const GATEWAY_RATVAR_COMING: 239; // :76
declare const GATEWAY_REEBE_FOUND: 119; // :74
declare const GATEWAY_SUMMON_RATE: 1; // :72
declare const JUDGEMENT_CACHE_REQ: 5; // :30
declare const JUDGEMENT_CV_REQ: 300; // :31
declare const JUDGEMENT_SERVANT_REQ: 12; // :29
declare const LOWER_PROB_PER_COMPONENT: 10; // :44
declare const MARAUDER_EMERGE_THRESHOLD: 65; // :88
declare const MAX_COMPONENTS_BEFORE_RAND: 100; // :46
declare const MIN_CLOCKCULT_POWER: 25; // :49
declare const OCULAR_WARDEN_EXCLUSION_RANGE: 3; // :94
declare const POWER_FLOOR: 250; // :55
declare const POWER_METAL: 50; // :65
declare const POWER_PLASTEEL: 125; // :67
declare const POWER_ROD: 25; // :63
declare const POWER_STANDARD: 500; // :53
declare const POWER_WALL_MINUS_FLOOR: 1000; // :57
declare const POWER_WALL_TOTAL: 1250; // :61
declare const PRISM_DELAY_DURATION: 1200; // :98
declare const SCRIPT_CACHE_REQ: 1; // :23
declare const SCRIPT_SERVANT_REQ: 6; // :22
declare const SIGIL_ACCESS_RANGE: 2; // :90
declare const SLAB_PRODUCTION_TIME: 450; // :34
declare const SLAB_SERVANT_SLOWDOWN: 150; // :36
declare const SLAB_SLOWDOWN_MAXIMUM: 1350; // :38

// code/__DEFINES/combat.dm
declare const DISFIGURED: 16384; // :40
declare const EMBED_THROWSPEED_THRESHOLD: 4; // :109
declare const FAKEDEATH: 8192; // :39
declare const HIS_GRACE_CONSUME_OWNER: 140; // :137
declare const HIS_GRACE_FALL_ASLEEP: 160; // :138
declare const HIS_GRACE_FAMISHED: 100; // :135
declare const HIS_GRACE_FORCE_BONUS: 4; // :140
declare const HIS_GRACE_HUNGRY: 60; // :134
declare const HIS_GRACE_PECKISH: 20; // :133
declare const HIS_GRACE_SATIATED: 0; // :132
declare const HIS_GRACE_STARVING: 120; // :136
declare const XENO_HOST: 32768; // :41

// code/__DEFINES/construction.dm
declare const AI_READY_CORE: 5; // :47
declare const BOLTS: 4; // :17
declare const CABLED_CORE: 3; // :45
declare const CANT_UNFASTEN: 0; // :31
declare const CIRCUIT_CORE: 1; // :43
declare const COVER: 2; // :15
declare const CUT_COVER: 3; // :16
declare const EM_SECURED: 1; // :56
declare const EM_UNSECURED: 0; // :55
declare const EM_WELDED: 2; // :57
declare const EMPTY_CORE: 0; // :42
declare const FAILED_UNFASTEN: 1; // :32
declare const FG_SECURED: 1; // :51
declare const FG_UNSECURED: 0; // :50
declare const FG_WELDED: 2; // :52
declare const FLOODLIGHT_NEEDS_LIGHTS: 1; // :65
declare const FLOODLIGHT_NEEDS_SECURING: 2; // :66
declare const FLOODLIGHT_NEEDS_WIRES: 0; // :64
declare const FLOODLIGHT_NEEDS_WRENCHING: 3; // :67
declare const GEAR_LOOSE: 2; // :61
declare const GEAR_SECURE: 1; // :60
declare const GIRDER_DISASSEMBLED: 4; // :10
declare const GIRDER_DISPLACED: 3; // :9
declare const GIRDER_NORMAL: 0; // :6
declare const GIRDER_REINF: 2; // :8
declare const GIRDER_REINF_STRUTS: 1; // :7
declare const GLASS_CORE: 4; // :46
declare const INTACT: 0; // :13
declare const MINERAL_MATERIAL_AMOUNT: 2000; // :90
declare const PLASTIC_FLAPS_DETACHED: 1; // :28
declare const PLASTIC_FLAPS_NORMAL: 0; // :27
declare const RCD_AIRLOCK: 2; // :120
declare const RCD_DECONSTRUCT: 3; // :121
declare const RCD_FLOORWALL: 1; // :119
declare const RCD_WINDOWGRILLE: 4; // :122
declare const SCREWED_CORE: 2; // :44
declare const SHEATH: 6; // :19
declare const SUCCESSFUL_UNFASTEN: 2; // :33
declare const SUPPORT_LINES: 1; // :14
declare const SUPPORT_RODS: 5; // :18
declare const WINDOW_IN_FRAME: 1; // :23
declare const WINDOW_OUT_OF_FRAME: 0; // :22
declare const WINDOW_SCREWED_TO_FRAME: 2; // :24

// code/__DEFINES/contracts.dm
declare const LAW: 2; // :44
declare const LORE: 1; // :43

// code/__DEFINES/events.dm
declare const EVENT_CANCELLED: 2; // :8
declare const EVENT_CANT_RUN: 0; // :6
declare const EVENT_INTERRUPTED: 3; // :9
declare const EVENT_READY: 1; // :7
declare const MAP_ERROR: 4; // :3
declare const NOT_ENOUGH_PLAYERS: 3; // :2
declare const SUCCESSFUL_SPAWN: 2; // :1
declare const WAITING_FOR_SOMETHING: 5; // :4

// code/__DEFINES/flags.dm
declare const ABSTRACT: 128; // :19
declare const ACID_PROOF: 32; // :90
declare const BLOCK_GAS_SMOKE_EFFECT: 4096; // :28
declare const CAN_BE_DIRTY: 4; // :59
declare const CHECK_RICOCHET: 32; // :17
declare const CONDUCT: 64; // :18
declare const DROPDEL: 16384; // :30
declare const FIRE_PROOF: 2; // :86
declare const HEAR: 16; // :16
declare const INDESTRUCTIBLE: 64; // :91
declare const MASKINTERNALS: 8; // :15
declare const NO_DEATHRATTLE: 16; // :60
declare const NOBLUDGEON: 4; // :14
declare const NODECONSTRUCT: 128; // :20
declare const NODROP: 2; // :13
declare const NOSLIP: 1024; // :24
declare const ON_BORDER: 512; // :22
declare const PREVENT_CLICK_UNDER: 32768; // :31
declare const STOPSPRESSUREDMAGE: 1; // :10
declare const THICKMATERIAL: 8192; // :29
declare const UNACIDABLE: 16; // :89

// code/__DEFINES/hud.dm
declare const HUD_STYLE_NOHUD: 3; // :4
declare const HUD_STYLE_REDUCED: 2; // :3
declare const HUD_STYLE_STANDARD: 1; // :2
declare const HUD_VERSIONS: 3; // :6

// code/__DEFINES/inventory.dm
declare const ALT_STYLE: 1; // :144
declare const ARM_LEFT: 128; // :112
declare const ARM_RIGHT: 256; // :113
declare const ARMS: 384; // :114
declare const CHEST: 2; // :104
declare const DIGITIGRADE_STYLE: 2; // :145
declare const FEET: 96; // :111
declare const FEMALE_UNIFORM_FULL: 1; // :139
declare const FOOT_LEFT: 32; // :109
declare const FOOT_RIGHT: 64; // :110
declare const FULL_BODY: 4095; // :119
declare const GLASSESCOVERSEYES: 1; // :156
declare const GROIN: 4; // :105
declare const HAND_LEFT: 512; // :115
declare const HAND_RIGHT: 1024; // :116
declare const HANDS: 1536; // :117
declare const HEAD: 1; // :103
declare const HEADCOVERSEYES: 4; // :158
declare const HEADCOVERSMOUTH: 16; // :160
declare const HIDEEARS: 32; // :95
declare const HIDEEYES: 64; // :96
declare const HIDEFACE: 128; // :97
declare const HIDEFACIALHAIR: 512; // :99
declare const HIDEGLOVES: 1; // :90
declare const HIDEHAIR: 256; // :98
declare const HIDEJUMPSUIT: 4; // :92
declare const HIDEMASK: 16; // :94
declare const HIDENECK: 1024; // :100
declare const HIDESHOES: 8; // :93
declare const INVENTORY_DEPTH: 3; // :13
declare const LEG_LEFT: 8; // :106
declare const LEG_RIGHT: 16; // :107
declare const LEGS: 24; // :108
declare const MASKCOVERSEYES: 2; // :157
declare const MASKCOVERSMOUTH: 8; // :159
declare const NO_FEMALE_UNIFORM: 0; // :138
declare const NORMAL_STYLE: 0; // :143
declare const slot_back: 1; // :33
declare const SLOT_BACK: 1024; // :27
declare const slot_belt: 5; // :38
declare const SLOT_BELT: 512; // :26
declare const SLOT_DENYPOCKET: 4096; // :29
declare const slot_ears: 7; // :40
declare const SLOT_EARS: 16; // :21
declare const SLOT_EYES: 8; // :20
declare const SLOT_FEET: 128; // :24
declare const slot_generic_dextrous_storage: 20; // :53
declare const slot_glasses: 8; // :41
declare const slot_gloves: 9; // :42
declare const SLOT_GLOVES: 4; // :19
declare const slot_handcuffed: 3; // :35
declare const slot_hands: 4; // :36
declare const slot_head: 11; // :44
declare const SLOT_HEAD: 64; // :23
declare const SLOT_ICLOTHING: 2; // :18
declare const SLOT_ID: 256; // :25
declare const slot_in_backpack: 18; // :51
declare const slot_l_store: 15; // :48
declare const slot_legcuffed: 19; // :52
declare const SLOT_MASK: 32; // :22
declare const slot_neck: 10; // :43
declare const SLOT_NECK: 8192; // :30
declare const SLOT_OCLOTHING: 1; // :17
declare const SLOT_POCKET: 2048; // :28
declare const slot_r_store: 16; // :49
declare const slot_s_store: 17; // :50
declare const slot_shoes: 12; // :45
declare const slot_w_uniform: 14; // :47
declare const slot_wear_id: 6; // :39
declare const slot_wear_mask: 2; // :34
declare const slot_wear_suit: 13; // :46
declare const SQUISHED_DIGITIGRADE: 2; // :153
declare const STORAGE_VIEW_DEPTH: 2; // :14
declare const THERMAL_PROTECTION_ARM_LEFT: 0.075; // :132
declare const THERMAL_PROTECTION_ARM_RIGHT: 0.075; // :133
declare const THERMAL_PROTECTION_CHEST: 0.15; // :126
declare const THERMAL_PROTECTION_FOOT_LEFT: 0.025; // :130
declare const THERMAL_PROTECTION_FOOT_RIGHT: 0.025; // :131
declare const THERMAL_PROTECTION_GROIN: 0.15; // :127
declare const THERMAL_PROTECTION_HAND_LEFT: 0.025; // :134
declare const THERMAL_PROTECTION_HAND_RIGHT: 0.025; // :135
declare const THERMAL_PROTECTION_HEAD: 0.3; // :125
declare const THERMAL_PROTECTION_LEG_LEFT: 0.075; // :128
declare const THERMAL_PROTECTION_LEG_RIGHT: 0.075; // :129
declare const TINT_BLIND: 3; // :163
declare const TINT_DARKENED: 2; // :162
declare const WEIGHT_CLASS_BULKY: 4; // :7
declare const WEIGHT_CLASS_GIGANTIC: 6; // :9
declare const WEIGHT_CLASS_HUGE: 5; // :8
declare const WEIGHT_CLASS_NORMAL: 3; // :6
declare const WEIGHT_CLASS_SMALL: 2; // :5
declare const WEIGHT_CLASS_TINY: 1; // :4

// code/__DEFINES/language.dm
declare const LANGUAGE_HIDE_ICON_IF_NOT_UNDERSTOOD: 8; // :4
declare const LANGUAGE_HIDE_ICON_IF_UNDERSTOOD: 4; // :3
declare const TONGUELESS_SPEECH: 2; // :2

// code/__DEFINES/layers.dm
declare const ABOVE_ALL_MOB_LAYER: 4.5; // :53
declare const ABOVE_HUD_LAYER: 20; // :80
declare const ABOVE_HUD_PLANE: 20; // :79
declare const ABOVE_MOB_LAYER: 4.1; // :48
declare const ABOVE_NORMAL_TURF_LAYER: 2.08; // :15
declare const ABOVE_OPEN_TURF_LAYER: 2.04; // :13
declare const AREA_LAYER: 10; // :61
declare const BELOW_MOB_LAYER: 3.7; // :45
declare const CLOSED_DOOR_LAYER: 3.1; // :37
declare const CLOSED_TURF_LAYER: 2.05; // :14
declare const EDGED_TURF_LAYER: 4.3; // :50
declare const GAME_PLANE: 0; // :9
declare const HUD_LAYER: 19; // :78
declare const HUD_PLANE: 19; // :77
declare const LARGE_MOB_LAYER: 4.4; // :52
declare const LIGHTING_PLANE: 15; // :65
declare const LYING_MOB_LAYER: 3.8; // :46
declare const NOT_HIGH_OBJ_LAYER: 3.5; // :42
declare const ON_EDGED_TURF_LAYER: 4.35; // :51
declare const OPEN_DOOR_LAYER: 2.7; // :31
declare const PLANE_SPACE: -95; // :6
declare const RIPPLE_LAYER: 5.1; // :58
declare const SIGN_LAYER: 3.4; // :41
declare const WALL_OBJ_LAYER: 4.25; // :49

// code/__DEFINES/lighting.dm
declare const DYNAMIC_LIGHTING_DISABLED: 0; // :79
declare const DYNAMIC_LIGHTING_ENABLED: 1; // :80
declare const DYNAMIC_LIGHTING_FORCED: 2; // :81
declare const DYNAMIC_LIGHTING_IFSTARLIGHT: 3; // :82
declare const LIGHTING_NO_UPDATE: 0; // :87
declare const LIGHTING_PLANE_ALPHA_INVISIBLE: 0; // :76
declare const LIGHTING_PLANE_ALPHA_MOSTLY_INVISIBLE: 128; // :75
declare const LIGHTING_PLANE_ALPHA_MOSTLY_VISIBLE: 192; // :74
declare const LIGHTING_PLANE_ALPHA_VISIBLE: 255; // :73

// code/__DEFINES/machines.dm
declare const AUTOLATHE: 4; // :26
declare const BIOGENERATOR: 32; // :29
declare const IMPRINTER: 1; // :24
declare const LIMBGROWER: 64; // :30
declare const MECHFAB: 16; // :28
declare const NTNET_COMMUNICATION: 3; // :51
declare const NTNET_PEERTOPEER: 2; // :50
declare const NTNET_SOFTWAREDOWNLOAD: 1; // :49
declare const NTNET_SYSTEMCONTROL: 4; // :52
declare const NTNETSPEED_ETHERNET: 2; // :57
declare const NTNETSPEED_HIGHSIGNAL: 1; // :56
declare const NTNETSPEED_LOWSIGNAL: 0.5; // :55
declare const PROTOLATHE: 2; // :25
declare const SMELTER: 128; // :31
declare const SUPERMATTER_DANGER: 4; // :84
declare const SUPERMATTER_DELAMINATING: 6; // :86
declare const SUPERMATTER_EMERGENCY: 5; // :85
declare const SUPERMATTER_ERROR: -1; // :79
declare const SUPERMATTER_INACTIVE: 0; // :80
declare const SUPERMATTER_NORMAL: 1; // :81
declare const SUPERMATTER_NOTIFY: 2; // :82
declare const SUPERMATTER_WARNING: 3; // :83
declare const TOTAL: 4; // :5

// code/__DEFINES/maps.dm
declare const SELFLOOPING: 1; // :15
declare const ZLEVEL_CENTCOM: 1; // :37
declare const ZLEVEL_EMPTY_SPACE: 12; // :41
declare const ZLEVEL_LAVALAND: 5; // :40
declare const ZLEVEL_MINING: 5; // :39
declare const ZLEVEL_SPACEMAX: 12; // :45
declare const ZLEVEL_SPACEMIN: 3; // :44
declare const ZLEVEL_STATION: 2; // :38
declare const ZLEVEL_TRANSIT: 11; // :42

// code/__DEFINES/math.dm
declare const ONE_ATMOSPHERE: 101.325; // :8
declare const R_IDEAL_GAS_EQUATION: 8.31; // :7
declare const T0C: 273.15; // :9
declare const T20C: 293.15; // :10
declare const TCMB: 2.7; // :11

// code/__DEFINES/menu.dm
declare const CHECKBOX_GROUP: 1; // :2
declare const CHECKBOX_NONE: 0; // :1
declare const CHECKBOX_TOGGLE: 2; // :3

// code/__DEFINES/misc.dm
declare const ADMIN_COLOUR_PRIORITY: 1; // :381
declare const AI_MECH_HACK: 3; // :186
declare const AI_TRANS_FROM_CARD: 2; // :185
declare const AI_TRANS_TO_CARD: 1; // :184
declare const APRIL: 4; // :26
declare const BACK_LAYER: 9; // :64
declare const BE_CLOSE: 1; // :147
declare const BEAT_FAST: 1; // :439
declare const BEAT_NONE: 0; // :441
declare const BEAT_SLOW: 2; // :440
declare const BELT_LAYER: 12; // :61
declare const BLOOD_GAIN_PER_STEP: 100; // :204
declare const BLOOD_LOSS_PER_STEP: 5; // :205
declare const BLOODY_FOOTPRINT_BASE_ALPHA: 150; // :203
declare const BODY_ADJ_LAYER: 23; // :50
declare const BODY_BEHIND_LAYER: 25; // :48
declare const BODY_FRONT_LAYER: 2; // :71
declare const BODY_LAYER: 22; // :51
declare const BODYPARTS_LAYER: 24; // :49
declare const BROKEN_SENSORS: -1; // :223
declare const CLOCK_PROSELYTIZATION: 23; // :410
declare const CLOCK_SUMMON: 21; // :408
declare const COLOUR_PRIORITY_AMOUNT: 4; // :385
declare const CULT_ESCAPE: 11; // :398
declare const CULT_FAILURE: 12; // :399
declare const CULT_SUMMON: 13; // :400
declare const DAMAGE_LAYER: 20; // :53
declare const EARS_LAYER: 15; // :58
declare const EXPLOSION_BLOCK_PROC: -1; // :436
declare const FACEMASK_LAYER: 7; // :66
declare const FACING_EACHOTHER: 2; // :191
declare const FACING_FAILED: 0; // :189
declare const FACING_INIT_FACING_TARGET_TARGET_FACING_PERPENDICULAR: 3; // :192
declare const FACING_SAME_DIR: 1; // :190
declare const FALLOFF_SOUNDS: 1; // :167
declare const FIELD_EDGE: 2; // :422
declare const FIELD_TURF: 1; // :421
declare const FIRE_LAYER: 1; // :72
declare const FIXED_COLOUR_PRIORITY: 4; // :384
declare const FULLSCREEN_OVERLAY_RESOLUTION_X: 15; // :444
declare const FULLSCREEN_OVERLAY_RESOLUTION_Y: 15; // :445
declare const GAME_STATE_FINISHED: 4; // :164
declare const GAME_STATE_PLAYING: 3; // :163
declare const GAME_STATE_PREGAME: 1; // :161
declare const GAME_STATE_SETTING_UP: 2; // :162
declare const GAME_STATE_STARTUP: 0; // :160
declare const GANG_LOSS: 6; // :393
declare const GANG_TAKEOVER: 7; // :394
declare const GANGSTER_BOSS_STARTING_INFLUENCE: 20; // :433
declare const GANGSTER_SOLDIER_STARTING_INFLUENCE: 5; // :432
declare const GHOST_ACCS_DEFAULT_OPTION: 100; // :270
declare const GHOST_ACCS_DIR: 50; // :263
declare const GHOST_ACCS_FULL: 100; // :264
declare const GHOST_ACCS_NONE: 1; // :262
declare const GHOST_MAX_VIEW_RANGE_DEFAULT: 10; // :284
declare const GHOST_MAX_VIEW_RANGE_MEMBER: 14; // :285
declare const GHOST_OTHERS_DEFAULT_OPTION: 100; // :282
declare const GHOST_OTHERS_DEFAULT_SPRITE: 50; // :275
declare const GHOST_OTHERS_SIMPLE: 1; // :274
declare const GHOST_OTHERS_THEIR_SETTING: 100; // :276
declare const GIBTONITE_ACTIVE: 1; // :426
declare const GIBTONITE_DETONATE: 3; // :428
declare const GIBTONITE_STABLE: 2; // :427
declare const GIBTONITE_UNSTRUCK: 0; // :425
declare const GLASSES_LAYER: 13; // :60
declare const GLOVES_LAYER: 16; // :57
declare const HAIR_LAYER: 8; // :65
declare const HANDCUFF_LAYER: 5; // :68
declare const HANDS_LAYER: 3; // :70
declare const HAS_SENSORS: 1; // :225
declare const HEAD_LAYER: 6; // :67
declare const ID_LAYER: 18; // :55
declare const LEGCUFF_LAYER: 4; // :69
declare const LOCKED_SENSORS: 2; // :226
declare const LUMA_B: 0.072; // :378
declare const LUMA_G: 0.715; // :377
declare const LUMA_R: 0.213; // :376
declare const MANIFEST_ERROR_CHANCE: 5; // :140
declare const MANIFEST_ERROR_CONTENTS: 2; // :142
declare const MANIFEST_ERROR_ITEM: 4; // :143
declare const MANIFEST_ERROR_NAME: 1; // :141
declare const MAP_MAXX: 4; // :328
declare const MAP_MAXY: 5; // :329
declare const MAP_MAXZ: 6; // :330
declare const MAP_MINX: 1; // :325
declare const MAP_MINY: 2; // :326
declare const MAP_MINZ: 3; // :327
declare const MARCH: 3; // :25
declare const MAX_SHOE_BLOODINESS: 100; // :202
declare const MAXIMUM_WET_TIME: 300; // :237
declare const NECK_LAYER: 10; // :63
declare const NO_DEXTERY: 1; // :148
declare const NO_FIELD: 0; // :420
declare const NO_SENSORS: 0; // :224
declare const NUKE_MISS: 14; // :401
declare const NUKE_MISS_STATION: 2; // :389
declare const NUKE_NEAR_MISS: 1; // :388
declare const NUKE_SYNDICATE_BASE: 3; // :390
declare const OPERATIVE_SKIRMISH: 16; // :403
declare const OPERATIVES_KILLED: 15; // :402
declare const PROCESS_KILL: 26; // :137
declare const RESIZE_DEFAULT_SIZE: 1; // :181
declare const REVS_LOSE: 18; // :405
declare const REVS_WIN: 17; // :404
declare const SEC_LEVEL_BLUE: 1; // :132
declare const SEC_LEVEL_DELTA: 3; // :134
declare const SEC_LEVEL_GREEN: 0; // :131
declare const SEC_LEVEL_RED: 2; // :133
declare const SENSOR_COORDS: 3; // :219
declare const SENSOR_LIVING: 1; // :217
declare const SENSOR_OFF: 0; // :216
declare const SENSOR_VITALS: 2; // :218
declare const SHOES_LAYER: 17; // :56
declare const STAGE_FIVE: 9; // :156
declare const STAGE_FOUR: 7; // :155
declare const STAGE_ONE: 1; // :152
declare const STAGE_SIX: 11; // :157
declare const STAGE_THREE: 5; // :154
declare const STAGE_TWO: 3; // :153
declare const STATION_GOAL_BUDGET: 1; // :373
declare const STATION_NUKED: 20; // :407
declare const SUIT_LAYER: 14; // :59
declare const SUIT_STORE_LAYER: 11; // :62
declare const SURROUND_CAP: 7; // :168
declare const TEMPORARY_COLOUR_PRIORITY: 2; // :382
declare const TOTAL_LAYERS: 26; // :73
declare const TRANSITIONEDGE: 7; // :145
declare const TURF_DRY: 0; // :229
declare const TURF_WET_ICE: 3; // :232
declare const TURF_WET_LUBE: 2; // :231
declare const TURF_WET_PERMAFROST: 4; // :233
declare const TURF_WET_SLIDE: 5; // :234
declare const TURF_WET_WATER: 1; // :230
declare const UNIFORM_LAYER: 19; // :54
declare const WASHABLE_COLOUR_PRIORITY: 3; // :383
declare const WIZARD_KILLED: 19; // :406

// code/__DEFINES/mobs.dm
declare const AI_IDLE: 2; // :85
declare const AI_OFF: 3; // :86
declare const AI_ON: 1; // :84
declare const BLOOD_VOLUME_BAD: 224; // :20
declare const BLOOD_VOLUME_MAXIMUM: 2000; // :15
declare const BLOOD_VOLUME_NORMAL: 560; // :17
declare const BLOOD_VOLUME_OKAY: 336; // :19
declare const BLOOD_VOLUME_SAFE: 475; // :18
declare const BLOOD_VOLUME_SLIME_SPLIT: 1120; // :16
declare const BLOOD_VOLUME_SURVIVE: 122; // :21
declare const BLOODCRAWL_EAT: 2; // :36
declare const BODYPART_ORGANIC: 1; // :42
declare const BODYPART_ROBOTIC: 2; // :43
declare const ENVIRONMENT_SMASH_NONE: 0; // :88
declare const FIGHTING: 8; // :101
declare const GALOSHES_DONT_HELP: 4; // :126
declare const INCORPOREAL_MOVE_BASIC: 1; // :134
declare const INCORPOREAL_MOVE_JAUNT: 3; // :136
declare const INCORPOREAL_MOVE_SHADOW: 2; // :135
declare const INTERACTING: 2; // :99
declare const JUDGE_EMAGGED: 1; // :139
declare const JUDGE_IDCHECK: 2; // :140
declare const JUDGE_IGNOREMONKEYS: 16; // :144
declare const JUDGE_RECORDCHECK: 8; // :142
declare const JUDGE_WEAPONCHECK: 4; // :141
declare const MAX_CHICKENS: 50; // :129
declare const MAX_RANGE_FIND: 32; // :111
declare const MEGAFAUNA_DEFAULT_RECOVERY_TIME: 5; // :146
declare const MIN_RANGE_FIND: 16; // :112
declare const MOB_SIZE_HUMAN: 2; // :26
declare const MOB_SIZE_LARGE: 3; // :27
declare const MOB_SIZE_SMALL: 1; // :25
declare const MOB_SIZE_TINY: 0; // :24
declare const NO_SLIP_WHEN_WALKING: 1; // :124
declare const NUTRITION_LEVEL_FAT: 600; // :55
declare const NUTRITION_LEVEL_FED: 350; // :58
declare const NUTRITION_LEVEL_FULL: 550; // :56
declare const NUTRITION_LEVEL_HUNGRY: 250; // :59
declare const NUTRITION_LEVEL_STARVING: 150; // :60
declare const NUTRITION_LEVEL_WELL_FED: 450; // :57
declare const ORGAN_ORGANIC: 1; // :39
declare const ORGAN_ROBOTIC: 2; // :40
declare const PLAYER_NOT_READY: 0; // :6
declare const PLAYER_READY_TO_OBSERVE: 2; // :8
declare const PLAYER_READY_TO_PLAY: 1; // :7
declare const SENTIENCE_ORGANIC: 1; // :75
declare const SLIDE: 2; // :125
declare const SLIDE_ICE: 8; // :127
declare const SLIME_EVOLUTION_THRESHOLD: 10; // :63
declare const SLIME_FRIENDSHIP_ATTACK: 8; // :72
declare const SLIME_FRIENDSHIP_FOLLOW: 3; // :66
declare const SLIME_FRIENDSHIP_STAY: 3; // :71
declare const SLIME_FRIENDSHIP_STOPCHASE: 4; // :69
declare const SLIME_FRIENDSHIP_STOPCHASE_NOANGRY: 6; // :70
declare const SLIME_FRIENDSHIP_STOPEAT: 5; // :67
declare const SLIME_FRIENDSHIP_STOPEAT_NOANGRY: 7; // :68
declare const SNPC_BRUTE: 1; // :117
declare const SNPC_MARTYR: 3; // :119
declare const SNPC_PSYCHO: 4; // :120
declare const SNPC_STEALTH: 2; // :118
declare const TK_MAXRANGE: 15; // :122
declare const TRAIT_DUMB: 16; // :106
declare const TRAIT_FRIENDLY: 64; // :108
declare const TRAIT_MEAN: 32; // :107
declare const TRAIT_ROBUST: 2; // :103
declare const TRAIT_SMART: 8; // :105
declare const TRAIT_THIEVING: 128; // :109
declare const TRAIT_UNROBUST: 4; // :104
declare const TRAVEL: 4; // :100
declare const UNHEALING_EAR_DAMAGE: 100; // :131
declare const VENTCRAWLER_ALWAYS: 2; // :32
declare const VENTCRAWLER_NONE: 0; // :30
declare const VENTCRAWLER_NUDE: 1; // :31

// code/__DEFINES/monkeys.dm
declare const MONKEY_AGGRESSIVE_MVM_PROB: 0; // :38
declare const MONKEY_ATTACK_DISARM_PROB: 50; // :23
declare const MONKEY_CUFF_RETALIATION_PROB: 20; // :13
declare const MONKEY_DISPOSE: 3; // :7
declare const MONKEY_DISPOSE_FRUSTRATION_LIMIT: 16; // :36
declare const MONKEY_ENEMY_VISION: 9; // :10
declare const MONKEY_FLEE: 2; // :6
declare const MONKEY_FLEE_HEALTH: 50; // :9
declare const MONKEY_FLEE_VISION: 4; // :11
declare const MONKEY_HATRED_AMOUNT: 4; // :31
declare const MONKEY_HATRED_REDUCTION_PROB: 25; // :32
declare const MONKEY_HUNT: 1; // :5
declare const MONKEY_HUNT_FRUSTRATION_LIMIT: 8; // :35
declare const MONKEY_IDLE: 0; // :4
declare const MONKEY_ITEM_SNATCH_DELAY: 25; // :12
declare const MONKEY_PICKUP_PROB: 5; // :20
declare const MONKEY_PULL_AGGRO_PROB: 5; // :19
declare const MONKEY_RECRUIT_PROB: 25; // :25
declare const MONKEY_RESIST_PROB: 50; // :17
declare const MONKEY_RETALIATE_DISARM_PROB: 20; // :29
declare const MONKEY_RETALIATE_HARM_PROB: 95; // :28
declare const MONKEY_STEAL_PROB: 5; // :21
declare const MONKEY_SWITCH_TARGET_PROB: 25; // :26
declare const MONKEY_SYRINGE_RETALIATION_PROB: 20; // :14
declare const MONKEY_WEAPON_PROB: 20; // :24

// code/__DEFINES/pinpointers.dm
declare const TRACK_ATOM: 5; // :6
declare const TRACK_COORDINATES: 6; // :7
declare const TRACK_INFILTRATOR: 3; // :4
declare const TRACK_MALF_AI: 2; // :3
declare const TRACK_NUKE_DISK: 1; // :2
declare const TRACK_OPERATIVES: 4; // :5

// code/__DEFINES/pipe_construction.dm
declare const DISP_END_BIN: 6; // :38
declare const DISP_END_CHUTE: 8; // :40
declare const DISP_END_OUTLET: 7; // :39
declare const DISP_END_TRUNK: 5; // :37
declare const DISP_JUNCTION: 2; // :34
declare const DISP_JUNCTION_FLIP: 3; // :35
declare const DISP_PIPE_BENT: 1; // :33
declare const DISP_PIPE_STRAIGHT: 0; // :32
declare const DISP_SORTJUNCTION: 9; // :41
declare const DISP_SORTJUNCTION_FLIP: 10; // :42
declare const DISP_YJUNCTION: 4; // :36
declare const STATION_TUBE_CLOSED: 2; // :58
declare const STATION_TUBE_OPEN: 0; // :56
declare const TRANSIT_TUBE_CURVED: 2; // :47
declare const TRANSIT_TUBE_DIAGONAL: 3; // :48
declare const TRANSIT_TUBE_DIAGONAL_CROSSING: 4; // :49
declare const TRANSIT_TUBE_JUNCTION: 5; // :50
declare const TRANSIT_TUBE_POD: 8; // :53
declare const TRANSIT_TUBE_STATION: 6; // :51
declare const TRANSIT_TUBE_STRAIGHT: 0; // :45
declare const TRANSIT_TUBE_STRAIGHT_CROSSING: 1; // :46
declare const TRANSIT_TUBE_TERMINUS: 7; // :52

// code/__DEFINES/preferences.dm
declare const PARALLAX_DISABLE: 3; // :38
declare const PARALLAX_HIGH: 0; // :35
declare const PARALLAX_INSANE: -1; // :34

// code/__DEFINES/qdel.dm
declare const GC_CURRENTLY_BEING_QDELETED: -3; // :15
declare const GC_QUEUED_FOR_HARD_DEL: -2; // :14
declare const GC_QUEUED_FOR_QUEUING: -1; // :13
declare const QDEL_HINT_FINDREFERENCE: 5; // :9
declare const QDEL_HINT_HARDDEL: 3; // :7
declare const QDEL_HINT_HARDDEL_NOW: 4; // :8
declare const QDEL_HINT_IWILLGC: 2; // :6
declare const QDEL_HINT_LETMELIVE: 1; // :5
declare const QDEL_HINT_QUEUE: 0; // :4

// code/__DEFINES/radio.dm
declare const MAX_FREQ: 1489; // :5

// code/__DEFINES/reagents.dm
declare const DRAWABLE: 2048; // :6
declare const INGEST: 2; // :11
declare const INJECT: 5; // :14
declare const INJECTABLE: 1024; // :5
declare const OPENCONTAINER: 4096; // :7
declare const PATCH: 4; // :13
declare const TOUCH: 1; // :10
declare const TRANSPARENT: 8192; // :8
declare const VAPOR: 3; // :12

// code/__DEFINES/robots.dm
declare const AI_SHELL: 4; // :42
declare const BOT_ARREST: 3; // :15
declare const BOT_BLOCKED: 14; // :26
declare const BOT_CLEANING: 7; // :19
declare const BOT_DELIVER: 12; // :24
declare const BOT_GO_HOME: 13; // :25
declare const BOT_HEALING: 10; // :22
declare const BOT_HUNT: 1; // :13
declare const BOT_IDLE: 0; // :12
declare const BOT_MOVING: 9; // :21
declare const BOT_NAV: 15; // :27
declare const BOT_NO_ROUTE: 17; // :29
declare const BOT_PATROL: 5; // :17
declare const BOT_PREP_ARREST: 2; // :14
declare const BOT_REPAIRING: 8; // :20
declare const BOT_RESPONDING: 11; // :23
declare const BOT_START_PATROL: 4; // :16
declare const BOT_STEP_DELAY: 4; // :6
declare const BOT_STEP_MAX_RETRIES: 5; // :7
declare const BOT_SUMMON: 6; // :18
declare const BOT_WAIT_FOR_NAV: 16; // :28
declare const DEFAULT_SCAN_RANGE: 7; // :9
declare const NEW_BORG: 1; // :39
declare const NEW_MODULE: 2; // :40
declare const RENAME: 3; // :41

// code/__DEFINES/role_preferences.dm
declare const BEASSISTANT: 1; // :51
declare const BERANDOMJOB: 2; // :52

// code/__DEFINES/say.dm
declare const EAVESDROP_EXTRA_RANGE: 1; // :37
declare const ITALICS: 1; // :32
declare const NOPASS: 4; // :34
declare const REDUCE_RANGE: 2; // :33

// code/__DEFINES/shuttles.dm
declare const CALL_SHUTTLE_REASON_LENGTH: 12; // :49
declare const EARLY_LAUNCHED: 2; // :29
declare const ENDGAME_LAUNCHED: 1; // :28
declare const ENDGAME_TRANSIT: 3; // :30
declare const ENGINE_COEFF_MAX: 2; // :53
declare const ENGINE_COEFF_MIN: 0.5; // :52
declare const HYPERSPACE_END: 3; // :47
declare const HYPERSPACE_END_TIME: 5; // :43
declare const HYPERSPACE_LAUNCH: 2; // :46
declare const HYPERSPACE_WARMUP: 1; // :45
declare const PARALLAX_LOOP_TIME: 25; // :42
declare const SHUTTLE_RIPPLE_TIME: 100; // :33
declare const SHUTTLE_TRANSIT_BORDER: 8; // :40
declare const TRANSIT_READY: 2; // :37
declare const UNLAUNCHED: 0; // :27

// code/__DEFINES/sight.dm
declare const INVISIBILITY_ABSTRACT: 101; // :18
declare const INVISIBILITY_MAXIMUM: 100; // :16
declare const VISOR_VISIONFLAGS: 4; // :28

// code/__DEFINES/sound.dm
declare const CHANNEL_HEARTBEAT: 1019; // :7

// code/__DEFINES/stat.dm
declare const EMPED: 16; // :26
declare const MAINT: 8; // :25

// code/__DEFINES/status_effects.dm
declare const MANIA_DAMAGE_TO_CONVERT: 90; // :47
declare const MAX_MANIA_SEVERITY: 100; // :46
declare const STATUS_EFFECT_REPLACE: 2; // :8

// code/__DEFINES/subsystems.dm
declare const INITIALIZATION_INNEW_MAPLOAD: 1; // :26
declare const INITIALIZATION_INNEW_REGULAR: 2; // :27
declare const INITIALIZATION_INSSATOMS: 0; // :25
declare const INITIALIZE_HINT_LATELOAD: 1; // :30
declare const INITIALIZE_HINT_NORMAL: 0; // :29
declare const INITIALIZE_HINT_QDEL: 2; // :31
declare const RUNLEVEL_GAME: 4; // :75
declare const RUNLEVEL_LOBBY: 1; // :73
declare const RUNLEVEL_POSTGAME: 8; // :76
declare const RUNLEVEL_SETUP: 2; // :74
declare const RUNLEVELS_DEFAULT: 14; // :78
declare const TIMER_ID_NULL: -1; // :19
declare const TIMER_NO_INVOKE_WARNING: 600; // :17

// code/__DEFINES/tgui.dm
declare const UI_CLOSE: -1; // :4
declare const UI_DISABLED: 0; // :3
declare const UI_INTERACTIVE: 2; // :1
declare const UI_UPDATE: 1; // :2

// code/__DEFINES/tick.dm
declare const TICK_LIMIT_MC: 50; // :3
declare const TICK_LIMIT_RUNNING: 60; // :1
declare const TICK_LIMIT_TO_RUN: 58; // :2

// code/__HELPERS/files.dm
declare const FTPDELAY: 200; // :37

// code/__HELPERS/icon_smoothing.dm
declare const N_EAST: 16; // :29
declare const N_NORTH: 2; // :27
declare const N_NORTHEAST: 32; // :31
declare const N_NORTHWEST: 512; // :32
declare const N_SOUTH: 4; // :28
declare const N_SOUTHEAST: 64; // :33
declare const N_SOUTHWEST: 1024; // :34
declare const N_WEST: 256; // :30
declare const SMOOTH_BORDER: 8; // :40
declare const SMOOTH_DIAGONAL: 4; // :39
declare const SMOOTH_FALSE: 0; // :36
declare const SMOOTH_MORE: 2; // :38
declare const SMOOTH_QUEUED: 16; // :41
declare const SMOOTH_TRUE: 1; // :37

// code/__HELPERS/sorts/__main.dm
declare const MIN_GALLOP: 7; // :9
declare const MIN_MERGE: 32; // :6

// code/_compile_options.dm
declare const AGE_MAX: 85; // :37
declare const AGE_MIN: 17; // :36
declare const AI_VOX: 1; // :53
declare const DOOR_CRUSH_DAMAGE: 15; // :41
declare const HUNGER_FACTOR: 0.1; // :43
declare const POCKET_STRIP_DELAY: 40; // :40
declare const REAGENTS_METABOLISM: 0.4; // :44
declare const SHOES_SLOWDOWN: 0; // :39
declare const SPAM_TRIGGER_AUTOMUTE: 10; // :27
declare const SPAM_TRIGGER_WARNING: 5; // :26

// code/_onclick/hud/action_button.dm
declare const AB_MAX_COLUMNS: 10; // :148

// code/_onclick/hud/runechat.dm
declare const BALLOON_ALERT_FADE: 6; // :116
declare const BALLOON_ALERT_LIFESPAN: 20; // :115
declare const RUNECHAT_EXTRA_PER_CHAR: 0.3; // :7
declare const RUNECHAT_FADE: 4; // :6
declare const RUNECHAT_LIFESPAN: 40; // :5
declare const RUNECHAT_MAX_CHARS: 60; // :8
declare const RUNECHAT_MAX_LINES: 4; // :9
declare const RUNECHAT_WIDTH: 120; // :10

// code/controllers/subsystem/air.dm
declare const SSAIR_ACTIVETURFS: 3; // :3

// code/controllers/subsystem/communications.dm
declare const COMMUNICATION_COOLDOWN: 600; // :1
declare const COMMUNICATION_COOLDOWN_AI: 600; // :2

// code/controllers/subsystem/server_maint.dm
declare const PING_BUFFER_TIME: 25; // :1

// code/controllers/subsystem/shuttle.dm
declare const HIGHLIGHT_DYNAMIC_TRANSIT: 1; // :1

// code/controllers/subsystem/throwing.dm
declare const MAX_THROWING_DIST: 512; // :1
declare const MAX_TICKS_TO_MAKE_UP: 3; // :2

// code/datums/action.dm
declare const AB_CHECK_CONSCIOUS: 8; // :4
declare const AB_CHECK_LYING: 4; // :3
declare const AB_CHECK_RESTRAINED: 1; // :1
declare const AB_CHECK_STUN: 2; // :2

// code/datums/antagonists/datum_cult.dm
declare const SUMMON_POSSIBILITIES: 3; // :1

// code/datums/antagonists/datum_internal_affairs.dm
declare const PINPOINTER_EXTRA_RANDOM_RANGE: 10; // :2
declare const PROB_ACTUAL_TRAITOR: 20; // :4

// code/datums/antagonists/devil.dm
declare const ARCH_DEVIL: 3; // :8
declare const ARCH_THRESHOLD: 12; // :3
declare const BASIC_DEVIL: 0; // :5
declare const BLOOD_LIZARD: 1; // :6
declare const BLOOD_THRESHOLD: 3; // :1
declare const DEVILRESURRECTTIME: 600; // :14
declare const LOSS_PER_DEATH: 2; // :10
declare const TRUE_DEVIL: 2; // :7
declare const TRUE_THRESHOLD: 7; // :2

// code/datums/diseases/_disease.dm
declare const AIRBORNE: 64; // :18
declare const BLOOD: 4; // :14
declare const CAN_RESIST: 4; // :9
declare const CONTACT_FEET: 8; // :15
declare const CONTACT_GENERAL: 32; // :17
declare const CONTACT_HANDS: 16; // :16
declare const CURABLE: 1; // :7
declare const HIDDEN_PANDEMIC: 2; // :4
declare const HIDDEN_SCANNER: 1; // :3
declare const NON_CONTAGIOUS: 2; // :13
declare const SPECIAL: 1; // :12

// code/datums/emotes.dm
declare const EMOTE_AUDIBLE: 2; // :2
declare const EMOTE_VISIBLE: 1; // :1

// code/datums/progressbar.dm
declare const PROGRESSBAR_HEIGHT: 6; // :1

// code/datums/weather/weather.dm
declare const END_STAGE: 4; // :6
declare const MAIN_STAGE: 2; // :4
declare const STARTUP_STAGE: 1; // :3
declare const WIND_DOWN_STAGE: 3; // :5

// code/game/gamemodes/blob/blob.dm
declare const BLOB_NO_PLACE_TIME: 1800; // :10

// code/game/gamemodes/changeling/changeling.dm
declare const LING_ABSORB_RECENT_SPEECH: 8; // :3
declare const LING_DEAD_GENETICDAMAGE_HEAL_CAP: 50; // :2
declare const LING_FAKEDEATH_TIME: 400; // :1

// code/game/gamemodes/devil/true_devil/_true_devil.dm
declare const DEVIL_HANDS_LAYER: 1; // :1

// code/game/gamemodes/gang/dominator.dm
declare const DOM_BLOCKED_SPAM_CAP: 6; // :1
declare const DOM_HULK_HITS_REQUIRED: 10; // :3
declare const DOM_REQUIRED_TURFS: 30; // :2

// code/game/gamemodes/malfunction/Malf_Modules.dm
declare const DEFAULT_DOOMSDAY_TIMER: 4500; // :1

// code/game/gamemodes/miniantags/abduction/abduction_gear.dm
declare const BATON_CUFF: 2; // :331
declare const BATON_MODES: 4; // :333
declare const BATON_PROBE: 3; // :332
declare const BATON_SLEEP: 1; // :330
declare const BATON_STUN: 0; // :329
declare const GIZMO_MARK: 2; // :4
declare const GIZMO_SCAN: 1; // :3
declare const VEST_COMBAT: 2; // :2
declare const VEST_STEALTH: 1; // :1

// code/game/gamemodes/miniantags/morph/morph.dm
declare const MORPH_COOLDOWN: 50; // :1

// code/game/gamemodes/miniantags/revenant/revenant.dm
declare const INVISIBILITY_REVENANT: 50; // :6

// code/game/gamemodes/miniantags/revenant/revenant_spawn_event.dm
declare const REVENANT_SPAWN_THRESHOLD: 20; // :1

// code/game/gamemodes/nuclear/nuclear_challenge.dm
declare const CHALLENGE_SHUTTLE_DELAY: 15000; // :4
declare const CHALLENGE_TELECRYSTALS: 280; // :1
declare const CHALLENGE_TIME_LIMIT: 3000; // :2

// code/game/gamemodes/nuclear/nuclearbomb.dm
declare const NUKE_OFF_LOCKED: 0; // :8
declare const NUKE_OFF_UNLOCKED: 1; // :9
declare const NUKE_ON_EXPLODING: 3; // :11
declare const NUKE_ON_TIMING: 2; // :10
declare const NUKESTATE_CORE_EXPOSED: 1; // :5
declare const NUKESTATE_CORE_REMOVED: 0; // :6
declare const NUKESTATE_INTACT: 5; // :1
declare const NUKESTATE_PANEL_REMOVED: 3; // :3
declare const NUKESTATE_UNSCREWED: 4; // :2
declare const NUKESTATE_WELDED: 2; // :4

// code/game/machinery/camera/camera.dm
declare const CAMERA_UPGRADE_EMP_PROOF: 2; // :2
declare const CAMERA_UPGRADE_MOTION: 4; // :3
declare const CAMERA_UPGRADE_XRAY: 1; // :1

// code/game/machinery/cloning.dm
declare const CLONE_INITIAL_DAMAGE: 190; // :6

// code/game/machinery/computer/arcade.dm
declare const ORION_STATUS_GAMEOVER: 3; // :337
declare const ORION_STATUS_MARKET: 4; // :338
declare const ORION_STATUS_NORMAL: 2; // :336
declare const ORION_STATUS_START: 1; // :335
declare const ORION_TRAIL_WINTURN: 9; // :321

// code/game/machinery/computer/dna_console.dm
declare const INJECTOR_TIMEOUT: 100; // :1
declare const NUMBER_OF_BUFFERS: 3; // :4
declare const RADIATION_ACCURACY_MULTIPLIER: 3; // :10
declare const RADIATION_IRRADIATION_MULTIPLIER: 0.2; // :12
declare const RADIATION_STRENGTH_MULTIPLIER: 1; // :7
declare const REJUVENATORS_INJECT: 15; // :2
declare const REJUVENATORS_MAX: 90; // :3
declare const SCANNER_ACTION_MIXED: 4; // :17
declare const SCANNER_ACTION_SE: 1; // :14
declare const SCANNER_ACTION_UE: 3; // :16
declare const SCANNER_ACTION_UI: 2; // :15

// code/game/machinery/deployable.dm
declare const METAL: 1; // :5

// code/game/machinery/doors/airlock.dm
declare const AIRLOCK_CLOSED: 1; // :20
declare const AIRLOCK_CLOSING: 2; // :21
declare const AIRLOCK_DAMAGE_DEFLECTION_N: 20; // :37
declare const AIRLOCK_DAMAGE_DEFLECTION_R: 30; // :38
declare const AIRLOCK_DENY: 5; // :24
declare const AIRLOCK_EMAG: 6; // :25
declare const AIRLOCK_INTEGRITY_MULTIPLIER: 1.5; // :36
declare const AIRLOCK_OPEN: 3; // :22
declare const AIRLOCK_OPENING: 4; // :23
declare const AIRLOCK_SECURITY_METAL: 1; // :28
declare const AIRLOCK_SECURITY_NONE: 0; // :27
declare const AIRLOCK_SECURITY_PLASTEEL: 6; // :33
declare const AIRLOCK_SECURITY_PLASTEEL_I: 3; // :30
declare const AIRLOCK_SECURITY_PLASTEEL_I_S: 2; // :29
declare const AIRLOCK_SECURITY_PLASTEEL_O: 5; // :32
declare const AIRLOCK_SECURITY_PLASTEEL_O_S: 4; // :31
declare const ELECTRIFIED_PERMANENT: -1; // :41
declare const NOT_ELECTRIFIED: 0; // :40

// code/game/machinery/doors/firedoor.dm
declare const CONSTRUCTION_GUTTED: 3; // :4
declare const CONSTRUCTION_NOCIRCUIT: 4; // :5
declare const CONSTRUCTION_PANEL_OPEN: 1; // :2
declare const CONSTRUCTION_WIRES_EXPOSED: 2; // :3

// code/game/machinery/limbgrower.dm
declare const LIMBGROWER_CATEGORY_MENU: 2; // :2
declare const LIMBGROWER_CHEMICAL_MENU: 3; // :3
declare const LIMBGROWER_MAIN_MENU: 1; // :1

// code/game/machinery/porta_turret/portable_turret.dm
declare const POPDOWN_ANIM_TIME: 5; // :5

// code/game/machinery/porta_turret/portable_turret_construct.dm
declare const PTURRET_BOLTED: 1; // :2
declare const PTURRET_CLOSED: 6; // :7
declare const PTURRET_EXTERNAL_ARMOUR_ON: 8; // :9
declare const PTURRET_GUN_EQUIPPED: 4; // :5
declare const PTURRET_INTERNAL_ARMOUR_ON: 3; // :4
declare const PTURRET_SENSORS_ON: 5; // :6
declare const PTURRET_START_EXTERNAL_ARMOUR: 7; // :8
declare const PTURRET_START_INTERNAL_ARMOUR: 2; // :3
declare const PTURRET_UNSECURED: 0; // :1

// code/game/machinery/shieldgen.dm
declare const ACTIVE_HASFIELDS: 2; // :215
declare const ACTIVE_SETUPFIELDS: 1; // :214

// code/game/machinery/slotmachine.dm
declare const BIG_PRIZE: 1000; // :9
declare const JACKPOT: 10000; // :10
declare const SMALL_PRIZE: 400; // :8
declare const SPIN_PRICE: 5; // :7
declare const SPIN_TIME: 65; // :11

// code/game/machinery/syndicatebomb.dm
declare const BUTTON_DELAY: 50; // :2

// code/game/objects/effects/contraband.dm
declare const PLACE_SPEED: 37; // :2

// code/game/objects/effects/effect_system/effects_foam.dm
declare const ALUMINUM_FOAM: 1; // :3
declare const IRON_FOAM: 2; // :4

// code/game/objects/items/blueprints.dm
declare const AREA_SPACE: 2; // :3
declare const AREA_SPECIAL: 3; // :4
declare const AREA_STATION: 1; // :2
declare const BORDER_2NDTILE: 3; // :9
declare const BORDER_BETWEEN: 2; // :8
declare const BORDER_NONE: 1; // :7
declare const BORDER_SPACE: 4; // :10
declare const ROOM_ERR_SPACE: 1; // :13
declare const ROOM_ERR_TOOLARGE: 2; // :14

// code/game/objects/items/crayons.dm
declare const PAINT_LARGE_HORIZONTAL: 2; // :9
declare const PAINT_NORMAL: 1; // :8

// code/game/objects/items/devices/geiger_counter.dm
declare const RAD_LEVEL_CRITICAL: 200; // :5
declare const RAD_LEVEL_HIGH: 75; // :3
declare const RAD_LEVEL_MODERATE: 30; // :2
declare const RAD_LEVEL_VERY_HIGH: 125; // :4

// code/game/objects/items/weapons/RCD.dm
declare const GLOW_MODE: 3; // :1
declare const LIGHT_MODE: 2; // :2
declare const REMOVE_MODE: 1; // :3

// code/game/objects/items/weapons/RPD.dm
declare const ATMOS_MODE: 0; // :16
declare const DISPOSALS_MODE: 2; // :18
declare const EATING_MODE: -1; // :15
declare const METER_MODE: 1; // :17
declare const PAINT_MODE: -2; // :14

// code/game/objects/items/weapons/chrono_eraser.dm
declare const CHRONO_BEAM_RANGE: 3; // :1
declare const CHRONO_FRAME_COUNT: 22; // :2

// code/game/objects/items/weapons/pneumaticCannon.dm
declare const PCANNON_FILO: 2; // :3

// code/game/objects/items/weapons/tanks/watertank.dm
declare const EXTINGUISHER: 0; // :180
declare const RESIN_FOAM: 2; // :182
declare const RESIN_LAUNCHER: 1; // :181

// code/game/objects/structures/aliens.dm
declare const MAX_GROWTH_TIME: 1500; // :214
declare const MIN_GROWTH_TIME: 900; // :213

// code/game/objects/structures/crates_lockers/closets/cardboardbox.dm
declare const SNAKE_SPAM_TICKS: 600; // :1

// code/game/objects/structures/fireplace.dm
declare const LOG_BURN_TIMER: 150; // :1
declare const MAXIMUM_BURN_TIMER: 3000; // :3
declare const PAPER_BURN_TIMER: 5; // :2

// code/game/objects/structures/showcase.dm
declare const SHOWCASE_CONSTRUCTED: 1; // :1
declare const SHOWCASE_SCREWDRIVERED: 2; // :2

// code/game/turfs/simulated/floor/plating/asteroid.dm
declare const SPAWN_BUBBLEGUM: 6; // :153

// code/game/turfs/simulated/river.dm
declare const RANDOM_LOWER_X: 50; // :4
declare const RANDOM_LOWER_Y: 50; // :5
declare const RANDOM_UPPER_X: 200; // :1
declare const RANDOM_UPPER_Y: 200; // :2

// code/modules/admin/verbs/buildmode.dm
declare const ADV_BUILDMODE: 2; // :2
declare const AREA_BUILDMODE: 5; // :5
declare const BASIC_BUILDMODE: 1; // :1
declare const COPY_BUILDMODE: 6; // :6
declare const NUM_BUILDMODES: 6; // :7
declare const THROW_BUILDMODE: 4; // :4
declare const VAR_BUILDMODE: 3; // :3

// code/modules/atmospherics/gasmixtures/reactions.dm
declare const NO_REACTION: 0; // :1
declare const REACTING: 1; // :2

// code/modules/atmospherics/machinery/airalarm.dm
declare const AALARM_MODE_CONTAMINATED: 8; // :42
declare const AALARM_MODE_FLOOD: 6; // :40
declare const AALARM_MODE_OFF: 5; // :39
declare const AALARM_MODE_PANIC: 3; // :37
declare const AALARM_MODE_REFILL: 9; // :43
declare const AALARM_MODE_REPLACEMENT: 4; // :38
declare const AALARM_MODE_SCRUBBING: 1; // :35
declare const AALARM_MODE_SIPHON: 7; // :41
declare const AALARM_MODE_VENTING: 2; // :36

// code/modules/atmospherics/machinery/components/unary_devices/vent_pump.dm
declare const EXT_BOUND: 1; // :1
declare const INT_BOUND: 2; // :2
declare const NO_BOUND: 3; // :3

// code/modules/atmospherics/machinery/components/unary_devices/vent_scrubber.dm
declare const SCRUBBING: 1; // :2

// code/modules/atmospherics/machinery/other/miner.dm
declare const GASMINER_POWER_FULLSCALE: 4; // :6
declare const GASMINER_POWER_KPA: 3; // :5
declare const GASMINER_POWER_MOLES: 2; // :4
declare const GASMINER_POWER_NONE: 0; // :2
declare const GASMINER_POWER_STATIC: 1; // :3

// code/modules/atmospherics/machinery/portable/canister.dm
declare const CONNECTED: 2; // :191
declare const DANGER: 32; // :195
declare const EMPTY: 4; // :192
declare const FULL: 16; // :194
declare const HOLDING: 1; // :190
declare const LOW: 8; // :193

// code/modules/awaymissions/capture_the_flag.dm
declare const AMMO_DROP_LIFETIME: 300; // :7
declare const DEFAULT_RESPAWN: 150; // :6
declare const INSTAGIB_RESPAWN: 50; // :5

// code/modules/client/client_procs.dm
declare const ADMINSWARNED_AT: 5; // :11
declare const CURRENT_MINUTE: 3; // :9
declare const CURRENT_SECOND: 1; // :7
declare const LIMITER_SIZE: 5; // :6
declare const MINUTE_COUNT: 4; // :10
declare const SECOND_COUNT: 2; // :8

// code/modules/client/preferences_savefile.dm
declare const SAVEFILE_VERSION_MAX: 18; // :5
declare const SAVEFILE_VERSION_MIN: 15; // :2

// code/modules/clothing/chameleon.dm
declare const EMP_RANDOMISE_TIME: 300; // :1

// code/modules/events/ghost_role.dm
declare const MAX_SPAWN_ATTEMPT: 3; // :1

// code/modules/events/shuttle_loan.dm
declare const ANTIDOTE_NEEDED: 5; // :5
declare const DEPARTMENT_RESUPPLY: 4; // :4
declare const HIJACK_SYNDIE: 1; // :1
declare const PIZZA_DELIVERY: 6; // :6
declare const RUSKY_PARTY: 2; // :2
declare const SPIDER_GIFT: 3; // :3

// code/modules/fields/fields.dm
declare const FIELD_SHAPE_CUSTOM_SQUARE: 2; // :9
declare const FIELD_SHAPE_RADIUS_SQUARE: 1; // :8

// code/modules/flufftext/Hallucination.dm
declare const FAKE_FLOOD_EXPAND_TIME: 20; // :113
declare const FAKE_FLOOD_MAX_RADIUS: 10; // :114
declare const SCREWYHUD_CRIT: 1; // :15
declare const SCREWYHUD_DEAD: 2; // :16
declare const SCREWYHUD_HEALTHY: 3; // :17
declare const SCREWYHUD_NONE: 0; // :14

// code/modules/food_and_drinks/food/customizables.dm
declare const INGREDIENTS_FILL: 1; // :1
declare const INGREDIENTS_LINE: 5; // :5
declare const INGREDIENTS_SCATTER: 2; // :2
declare const INGREDIENTS_STACK: 3; // :3
declare const INGREDIENTS_STACKPLUSTOP: 4; // :4

// code/modules/food_and_drinks/kitchen_machinery/food_cart.dm
declare const LIQUID_CAPACIY: 200; // :2
declare const MIXER_CAPACITY: 100; // :3
declare const STORAGE_CAPACITY: 30; // :1

// code/modules/food_and_drinks/kitchen_machinery/icecream_vat.dm
declare const CONE_CHOC: 6; // :6
declare const CONE_WAFFLE: 5; // :5
declare const ICECREAM_BLUE: 4; // :4
declare const ICECREAM_CHOCOLATE: 2; // :2
declare const ICECREAM_STRAWBERRY: 3; // :3
declare const ICECREAM_VANILLA: 1; // :1

// code/modules/hydroponics/beekeeping/beebox.dm
declare const BEE_PROB_NEW_BEE: 20; // :4
declare const BEE_RESOURCE_HONEYCOMB_COST: 100; // :5
declare const BEE_RESOURCE_NEW_BEE_COST: 50; // :6
declare const BEEBOX_MAX_FRAMES: 3; // :2
declare const BEES_RATIO: 0.5; // :3

// code/modules/language/language.dm
declare const SCRAMBLE_CACHE_LEN: 50; // :1

// code/modules/library/lib_codex_gigas.dm
declare const MULTIPLE_SYLLABLE: 4; // :4
declare const PRE_TITLE: 1; // :1
declare const SUFFIX: 5; // :5
declare const SYLLABLE: 3; // :3
declare const TITLE: 2; // :2

// code/modules/lighting/lighting_atom.dm
declare const MINIMUM_USEFUL_LIGHT_RANGE: 1.4; // :1
declare const NONSENSICAL_VALUE: -99999; // :13

// code/modules/mining/aux_base.dm
declare const BAD_AREA: 2; // :4
declare const BAD_COORDS: 3; // :5
declare const BAD_ZLEVEL: 1; // :3
declare const ZONE_SET: 4; // :6

// code/modules/mining/minebot.dm
declare const MINEDRONE_ATTACK: 2; // :3
declare const MINEDRONE_COLLECT: 1; // :2

// code/modules/mob/living/carbon/alien/alien.dm
declare const HEAT_DAMAGE_LEVEL_1: 2; // :1
declare const HEAT_DAMAGE_LEVEL_2: 3; // :2
declare const HEAT_DAMAGE_LEVEL_3: 8; // :3

// code/modules/mob/living/carbon/alien/organs.dm
declare const QUEEN_DEATH_DEBUFF_DURATION: 2400; // :105

// code/modules/mob/living/carbon/alien/special/facehugger.dm
declare const MIN_ACTIVE_TIME: 200; // :8
declare const MIN_IMPREGNATION_TIME: 100; // :5

// code/modules/mob/living/carbon/human/species.dm
declare const COLD_DAMAGE_LEVEL_1: 0.5; // :7
declare const COLD_DAMAGE_LEVEL_2: 1.5; // :8
declare const COLD_DAMAGE_LEVEL_3: 3; // :9

// code/modules/mob/living/silicon/ai/freelook/cameranet.dm
declare const CHUNK_SIZE: 16; // :5

// code/modules/mob/living/silicon/ai/freelook/chunk.dm
declare const UPDATE_BUFFER: 25; // :1

// code/modules/mob/living/silicon/ai/life.dm
declare const POWER_RESTORATION_APC_FOUND: 3; // :4
declare const POWER_RESTORATION_OFF: 0; // :1
declare const POWER_RESTORATION_SEARCH_APC: 2; // :3
declare const POWER_RESTORATION_START: 1; // :2

// code/modules/mob/living/simple_animal/bot/floorbot.dm
declare const FIX_TILE: 3; // :35
declare const HULL_BREACH: 1; // :33
declare const LINE_SPACE_MODE: 2; // :34
declare const PLACE_TILE: 5; // :37
declare const REPLACE_TILE: 6; // :38
declare const TILE_EMAG: 7; // :39

// code/modules/mob/living/simple_animal/bot/mulebot.dm
declare const ANNOYED: 1; // :8
declare const DELIGHT: 2; // :9
declare const SIGH: 0; // :7

// code/modules/mob/living/simple_animal/friendly/drone/_drone.dm
declare const DRONE_HANDS_LAYER: 1; // :2
declare const DRONE_HEAD_LAYER: 2; // :3

// code/modules/mob/living/simple_animal/guardian/guardian.dm
declare const GUARDIAN_HANDS_LAYER: 1; // :4

// code/modules/mob/living/simple_animal/hostile/bees.dm
declare const BEE_IDLE_GOHOME: 0; // :3
declare const BEE_IDLE_ROAMING: 70; // :2
declare const BEE_POLLINATE_PEST_CHANCE: 33; // :10
declare const BEE_POLLINATE_POTENCY_CHANCE: 50; // :11
declare const BEE_POLLINATE_YIELD_CHANCE: 33; // :9
declare const BEE_PROB_GOHOME: 35; // :4
declare const BEE_PROB_GOROAM: 5; // :5
declare const BEE_TRAY_RECENT_VISIT: 200; // :6

// code/modules/mob/living/simple_animal/hostile/headcrab.dm
declare const EGG_INCUBATION_TIME: 120; // :1

// code/modules/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner.dm
declare const MINER_DASH_RANGE: 4; // :1

// code/modules/mob/living/simple_animal/hostile/megafauna/dragon.dm
declare const DRAKE_SWOOP_DIRECTION_CHANGE_RANGE: 5; // :4
declare const SWOOP_DAMAGEABLE: 1; // :6
declare const SWOOP_INVULNERABLE: 2; // :7

// code/modules/mob/living/simple_animal/parrot.dm
declare const PARROT_ATTACK: 16; // :24
declare const PARROT_FLEE: 64; // :26
declare const PARROT_PERCH: 1; // :18
declare const PARROT_SWOOP: 2; // :19
declare const PARROT_WANDER: 4; // :20

// code/modules/mob/living/simple_animal/slime/powers.dm
declare const GROWTH_NEEDED: 1; // :6

// code/modules/ninja/__ninjaDefines.dm
declare const N_ADRENALINE: 3; // :13
declare const N_SMOKE_BOMB: 2; // :12
declare const N_STEALTH_CANCEL: 1; // :11

// code/modules/power/apc.dm
declare const APC_UPOVERLAY_CHARGEING0: 1; // :14
declare const APC_UPOVERLAY_CHARGEING1: 2; // :15
declare const APC_UPOVERLAY_CHARGEING2: 4; // :16
declare const APC_UPOVERLAY_ENVIRON0: 512; // :23
declare const APC_UPOVERLAY_ENVIRON1: 1024; // :24
declare const APC_UPOVERLAY_ENVIRON2: 2048; // :25
declare const APC_UPOVERLAY_EQUIPMENT0: 8; // :17
declare const APC_UPOVERLAY_EQUIPMENT1: 16; // :18
declare const APC_UPOVERLAY_EQUIPMENT2: 32; // :19
declare const APC_UPOVERLAY_LIGHTING0: 64; // :20
declare const APC_UPOVERLAY_LIGHTING1: 128; // :21
declare const APC_UPOVERLAY_LIGHTING2: 256; // :22
declare const APC_UPOVERLAY_LOCKED: 4096; // :26
declare const APC_UPOVERLAY_OPERATING: 8192; // :27
declare const UPSTATE_ALLGOOD: 128; // :9
declare const UPSTATE_BLUESCREEN: 32; // :7
declare const UPSTATE_BROKE: 16; // :6
declare const UPSTATE_MAINT: 8; // :5
declare const UPSTATE_OPENED1: 2; // :3
declare const UPSTATE_OPENED2: 4; // :4
declare const UPSTATE_WIREEXP: 64; // :8

// code/modules/power/lighting.dm
declare const LIGHT_BROKEN: 2; // :9
declare const LIGHT_BURNED: 3; // :10
declare const LIGHT_EMPTY: 1; // :8
declare const LIGHT_OK: 0; // :7

// code/modules/power/smes.dm
declare const SMESRATE: 0.05; // :4

// code/modules/power/solar.dm
declare const SOLAR_MAX_DIST: 40; // :1
declare const SOLARGENRATE: 1500; // :2

// code/modules/power/supermatter/supermatter.dm
declare const CO2_HEAT_PENALTY: 0.1; // :7
declare const CRITICAL_POWER_PENALTY_THRESHOLD: 9000; // :24
declare const CRITICAL_TEMPERATURE: 10000; // :174
declare const DAMAGE_HARDCAP: 0.0025; // :26
declare const DAMAGE_INCREASE_MULTIPLIER: 0.25; // :27
declare const DETONATION_HALLUCINATION: 600; // :40
declare const DETONATION_RADS: 200; // :39
declare const FREON_BREEDING_MODIFIER: 100; // :33
declare const FREON_TRANSMIT_PENALTY: 0.75; // :12
declare const MATTER_POWER_CONVERSION: 10; // :36
declare const MOLE_HEAT_PENALTY: 350; // :21
declare const MOLE_PENALTY_THRESHOLD: 1800; // :20
declare const N2O_HEAT_RESISTANCE: 6; // :14
declare const NITROGEN_HEAT_MODIFIER: -1.5; // :8
declare const OXYGEN_HEAT_PENALTY: 1; // :6
declare const OXYGEN_RELEASE_MODIFIER: 325; // :32
declare const OXYGEN_TRANSMIT_MODIFIER: 1.5; // :10
declare const PLASMA_HEAT_PENALTY: 15; // :5
declare const PLASMA_RELEASE_MODIFIER: 750; // :31
declare const PLASMA_TRANSMIT_MODIFIER: 4; // :11
declare const POWER_PENALTY_THRESHOLD: 5000; // :22
declare const POWERLOSS_INHIBITION_GAS_THRESHOLD: 0.2; // :16
declare const POWERLOSS_INHIBITION_MOLE_BOOST_THRESHOLD: 500; // :18
declare const POWERLOSS_INHIBITION_MOLE_THRESHOLD: 20; // :17
declare const REACTION_POWER_MODIFIER: 0.55; // :34
declare const SEVERE_POWER_PENALTY_THRESHOLD: 7000; // :23
declare const SUPERMATTER_DANGER_PERCENT: 50; // :55
declare const SUPERMATTER_DELAM_PERCENT: 5; // :53
declare const SUPERMATTER_EMERGENCY_PERCENT: 25; // :54
declare const SUPERMATTER_WARNING_PERCENT: 100; // :56
declare const THERMAL_RELEASE_MODIFIER: 5; // :30
declare const WARNING_DELAY: 60; // :43

// code/modules/power/tesla/energy_ball.dm
declare const TESLA_DEFAULT_POWER: 1738260; // :1

// code/modules/power/turbine.dm
declare const TURBGENG: 0.5; // :187
declare const TURBGENQ: 100000; // :186

// code/modules/procedural_mapping/mapGenerator.dm
declare const CLUSTER_CHECK_ALL: 30; // :18
declare const CLUSTER_CHECK_ALL_ATOMS: 20; // :15
declare const CLUSTER_CHECK_ALL_TURFS: 10; // :14
declare const CLUSTER_CHECK_DIFFERENT_ATOMS: 4; // :7
declare const CLUSTER_CHECK_DIFFERENT_TURFS: 2; // :6
declare const CLUSTER_CHECK_DIFFERENTS: 6; // :13
declare const CLUSTER_CHECK_NONE: 0; // :5
declare const CLUSTER_CHECK_SAME_ATOMS: 16; // :9
declare const CLUSTER_CHECK_SAME_TURFS: 8; // :8
declare const CLUSTER_CHECK_SAMES: 24; // :12

// code/modules/projectiles/gun.dm
declare const DUALWIELD_PENALTY_EXTRA_MULTIPLIER: 1.4; // :2

// code/modules/reagents/chemistry/reagents.dm
declare const REM: 1; // :5

// code/modules/reagents/chemistry/reagents/alcohol_reagents.dm
declare const ALCOHOL_RATE: 0.005; // :2
declare const ALCOHOL_THRESHOLD_MODIFIER: 0.05; // :1

// code/modules/shuttle/emergency.dm
declare const ENGINES_START_TIME: 100; // :2

// code/modules/shuttle/syndicate.dm
declare const SYNDICATE_CHALLENGE_TIMER: 12000; // :1

// code/modules/spells/spell.dm
declare const TARGET_CLOSEST: 1; // :1
declare const TARGET_RANDOM: 2; // :2

// code/modules/stock_market/events.dm
declare const TIME_MULTIPLIER: 0.7; // :1

// code/modules/surgery/organs/augments_internal.dm
declare const STUN_SET_AMOUNT: 40; // :1

// code/modules/surgery/organs/autosurgeon.dm
declare const INFINITE: -1; // :1

// code/modules/surgery/organs/lungs.dm
declare const COLD_GAS_DAMAGE_LEVEL_1: 0.5; // :7
declare const COLD_GAS_DAMAGE_LEVEL_2: 1.5; // :8
declare const COLD_GAS_DAMAGE_LEVEL_3: 3; // :9
declare const HEAT_GAS_DAMAGE_LEVEL_1: 2; // :3
declare const HEAT_GAS_DAMAGE_LEVEL_2: 4; // :4
declare const HEAT_GAS_DAMAGE_LEVEL_3: 8; // :5
declare const HUMAN_MAX_OXYLOSS: 3; // :1

// code/modules/surgery/organs/vocal_cords.dm
declare const COOLDOWN_DAMAGE: 600; // :2
declare const COOLDOWN_MEME: 300; // :3
declare const COOLDOWN_NONE: 100; // :4
declare const COOLDOWN_STUN: 1200; // :1
