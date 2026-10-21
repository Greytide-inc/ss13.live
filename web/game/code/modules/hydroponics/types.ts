// Types declared in code/modules/hydroponics that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../build/dist/src/translate/runtime.js";

rt.type(2713, "/datum/plant_gene/core/lifespan", "/datum/plant_gene/core", {
	name: "Lifespan",
	value: 25,
});
rt.type(2714, "/datum/plant_gene/core/endurance", "/datum/plant_gene/core", {
	name: "Endurance",
	value: 15,
});
rt.type(2715, "/datum/plant_gene/core/production", "/datum/plant_gene/core", {
	name: "Production Speed",
	value: 6,
});
rt.type(2716, "/datum/plant_gene/core/yield", "/datum/plant_gene/core", {
	name: "Yield",
	value: 3,
});
rt.type(2717, "/datum/plant_gene/core/potency", "/datum/plant_gene/core", {
	name: "Potency",
	value: 10,
});
rt.type(2718, "/datum/plant_gene/core/weed_rate", "/datum/plant_gene/core", {
	name: "Weed Growth Rate",
	value: 1,
});
rt.type(2719, "/datum/plant_gene/core/weed_chance", "/datum/plant_gene/core", {
	name: "Weed Vulnerability",
	value: 5,
});
rt.type(2727, "/datum/plant_gene/trait/glow/red", "/datum/plant_gene/trait/glow", {
	name: "Red Electrical Glow",
	glow_color: "#FA8282",
});
rt.type(2728, "/datum/plant_gene/trait/glow/berry", "/datum/plant_gene/trait/glow", {
	name: "Strong Bioluminescence",
	rate: 0.05,
	glow_color: null,
});
rt.type(2737, "/datum/plant_gene/trait/plant_type", "/datum/plant_gene/trait", {
	name: "you shouldn't see this",
	trait_id: "plant_type",
});
rt.type(2738, "/datum/plant_gene/trait/plant_type/weed_hardy", "/datum/plant_gene/trait/plant_type", {
	name: "Weed Adaptation",
});
rt.type(2739, "/datum/plant_gene/trait/plant_type/fungal_metabolism", "/datum/plant_gene/trait/plant_type", {
	name: "Fungal Vitality",
});
rt.type(2740, "/datum/plant_gene/trait/plant_type/alien_properties", "/datum/plant_gene/trait/plant_type", {
	name: "?????",
});
rt.type(6259, "/obj/item/weapon/reagent_containers/food/snacks/grown/shell/eggy", "/obj/item/weapon/reagent_containers/food/snacks/grown/shell", {
	trash: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/egg"),
	filling_color: "#F8F8FF",
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/eggplant/eggy"),
	name: "Egg-plant",
	desc: "There MUST be a chicken inside.",
	icon_state: "eggyplant",
});
rt.type(6260, "/obj/item/weapon/reagent_containers/food/snacks/grown/shell/gatfruit", "/obj/item/weapon/reagent_containers/food/snacks/grown/shell", {
	trash: rt.typePath("/obj/item/weapon/gun/ballistic/revolver"),
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/gatfruit"),
	name: "gatfruit",
	desc: "It smells like burning.",
	icon_state: "gatfruit",
	origin_tech: "combat=6",
});
rt.type(6261, "/obj/item/weapon/reagent_containers/food/snacks/grown/ambrosia", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#008000",
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/ambrosia"),
	name: "ambrosia branch",
	desc: "This is a plant.",
	icon_state: "ambrosiavulgaris",
	slot_flags: 64,
});
rt.type(6262, "/obj/item/weapon/reagent_containers/food/snacks/grown/ambrosia/vulgaris", "/obj/item/weapon/reagent_containers/food/snacks/grown/ambrosia", {
	seed: rt.typePath("/obj/item/seeds/ambrosia"),
	name: "ambrosia vulgaris branch",
	desc: "This is a plant containing various healing chemicals.",
	origin_tech: "biotech=2",
});
rt.type(6263, "/obj/item/weapon/reagent_containers/food/snacks/grown/ambrosia/deus", "/obj/item/weapon/reagent_containers/food/snacks/grown/ambrosia", {
	filling_color: "#008B8B",
	seed: rt.typePath("/obj/item/seeds/ambrosia/deus"),
	name: "ambrosia deus branch",
	desc: "Eating this makes you feel immortal!",
	icon_state: "ambrosiadeus",
	origin_tech: "biotech=4;materials=3",
});
rt.type(6264, "/obj/item/weapon/reagent_containers/food/snacks/grown/ambrosia/gaia", "/obj/item/weapon/reagent_containers/food/snacks/grown/ambrosia", {
	filling_color: "#ffaf00",
	light_range: 3,
	name: "ambrosia gaia branch",
	desc: "Eating this <i>makes</i> you immortal.",
	icon_state: "ambrosia_gaia",
	origin_tech: "biotech=6;materials=5",
	seed: rt.typePath("/obj/item/seeds/ambrosia/gaia"),
});
rt.type(6265, "/obj/item/weapon/reagent_containers/food/snacks/grown/apple", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#FF4500",
	bitesize: 100,
	seed: rt.typePath("/obj/item/seeds/apple"),
	name: "apple",
	desc: "It's a little piece of Eden.",
	icon_state: "apple",
});
rt.type(6266, "/obj/item/weapon/reagent_containers/food/snacks/grown/apple/poisoned", "/obj/item/weapon/reagent_containers/food/snacks/grown/apple", {
	seed: rt.typePath("/obj/item/seeds/apple/poisoned"),
});
rt.type(6267, "/obj/item/weapon/reagent_containers/food/snacks/grown/apple/gold", "/obj/item/weapon/reagent_containers/food/snacks/grown/apple", {
	filling_color: "#FFD700",
	seed: rt.typePath("/obj/item/seeds/apple/gold"),
	name: "golden apple",
	desc: "Emblazoned upon the apple is the word 'Kallisti'.",
	icon_state: "goldapple",
	origin_tech: "biotech=4;materials=5",
});
rt.type(6271, "/obj/item/weapon/reagent_containers/food/snacks/grown/soybeans", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#F0E68C",
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/soya"),
	name: "soybeans",
	desc: "It's pretty bland, but oh the possibilities...",
	gender: "plural",
	icon_state: "soybeans",
});
rt.type(6272, "/obj/item/weapon/reagent_containers/food/snacks/grown/koibeans", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#F0E68C",
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/soya/koi"),
	name: "koibean",
	desc: "Something about these seems fishy.",
	icon_state: "koibeans",
});
rt.type(6273, "/obj/item/weapon/reagent_containers/food/snacks/grown/berries", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#FF00FF",
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/berry"),
	name: "bunch of berries",
	desc: "Nutritious!",
	icon_state: "berrypile",
	gender: "plural",
});
rt.type(6274, "/obj/item/weapon/reagent_containers/food/snacks/grown/berries/poison", "/obj/item/weapon/reagent_containers/food/snacks/grown/berries", {
	filling_color: "#C71585",
	seed: rt.typePath("/obj/item/seeds/berry/poison"),
	name: "bunch of poison-berries",
	desc: "Taste so good, you could die!",
	icon_state: "poisonberrypile",
});
rt.type(6275, "/obj/item/weapon/reagent_containers/food/snacks/grown/berries/death", "/obj/item/weapon/reagent_containers/food/snacks/grown/berries", {
	filling_color: "#708090",
	seed: rt.typePath("/obj/item/seeds/berry/death"),
	name: "bunch of death-berries",
	desc: "Taste so good, you could die!",
	icon_state: "deathberrypile",
});
rt.type(6276, "/obj/item/weapon/reagent_containers/food/snacks/grown/berries/glow", "/obj/item/weapon/reagent_containers/food/snacks/grown/berries", {
	filling_color: "#7CFC00",
	seed: rt.typePath("/obj/item/seeds/berry/glow"),
	name: "bunch of glow-berries",
	desc: "Nutritious!",
	icon_state: "glowberrypile",
	origin_tech: "plasmatech=6",
});
rt.type(6277, "/obj/item/weapon/reagent_containers/food/snacks/grown/cherries", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#FF0000",
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/cherry"),
	name: "cherries",
	desc: "Great for toppings!",
	icon_state: "cherry",
	gender: "plural",
});
rt.type(6278, "/obj/item/weapon/reagent_containers/food/snacks/grown/bluecherries", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#6495ED",
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/cherry/blue"),
	name: "blue cherries",
	desc: "They're cherries that are blue.",
	icon_state: "bluecherry",
});
rt.type(6279, "/obj/item/weapon/reagent_containers/food/snacks/grown/grapes", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	dried_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/no_raisin/healthy"),
	filling_color: "#FF1493",
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/grape"),
	name: "bunch of grapes",
	desc: "Nutritious!",
	icon_state: "grapes",
});
rt.type(6280, "/obj/item/weapon/reagent_containers/food/snacks/grown/grapes/green", "/obj/item/weapon/reagent_containers/food/snacks/grown/grapes", {
	filling_color: "#7FFF00",
	seed: rt.typePath("/obj/item/seeds/grape/green"),
	name: "bunch of green grapes",
	icon_state: "greengrapes",
});
rt.type(6281, "/obj/item/weapon/reagent_containers/food/snacks/grown/cannabis", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#00FF00",
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/cannabis"),
	name: "cannabis leaf",
	desc: "Recently legalized in most galaxies.",
	icon_state: "cannabis",
});
rt.type(6282, "/obj/item/weapon/reagent_containers/food/snacks/grown/cannabis/rainbow", "/obj/item/weapon/reagent_containers/food/snacks/grown/cannabis", {
	seed: rt.typePath("/obj/item/seeds/cannabis/rainbow"),
	name: "rainbow cannabis leaf",
	desc: "Is it supposed to be glowing like that...?",
	icon_state: "megacannabis",
});
rt.type(6283, "/obj/item/weapon/reagent_containers/food/snacks/grown/cannabis/death", "/obj/item/weapon/reagent_containers/food/snacks/grown/cannabis", {
	seed: rt.typePath("/obj/item/seeds/cannabis/death"),
	name: "death cannabis leaf",
	desc: "Looks a bit dark. Oh well.",
	icon_state: "blackcannabis",
});
rt.type(6284, "/obj/item/weapon/reagent_containers/food/snacks/grown/cannabis/white", "/obj/item/weapon/reagent_containers/food/snacks/grown/cannabis", {
	seed: rt.typePath("/obj/item/seeds/cannabis/white"),
	name: "white cannabis leaf",
	desc: "It feels smooth and nice to the touch.",
	icon_state: "whitecannabis",
});
rt.type(6285, "/obj/item/weapon/reagent_containers/food/snacks/grown/cannabis/ultimate", "/obj/item/weapon/reagent_containers/food/snacks/grown/cannabis", {
	seed: rt.typePath("/obj/item/seeds/cannabis/ultimate"),
	name: "omega cannibas leaf",
	desc: "You feel dizzy looking at it. What the fuck?",
	icon_state: "ocannabis",
	volume: 420,
});
rt.type(6286, "/obj/item/weapon/reagent_containers/food/snacks/grown/wheat", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#F0E68C",
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/wheat"),
	name: "wheat",
	desc: "Sigh... wheat... a-grain?",
	gender: "plural",
	icon_state: "wheat",
});
rt.type(6287, "/obj/item/weapon/reagent_containers/food/snacks/grown/oat", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#556B2F",
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/wheat/oat"),
	name: "oat",
	desc: "Eat oats, do squats.",
	gender: "plural",
	icon_state: "oat",
});
rt.type(6288, "/obj/item/weapon/reagent_containers/food/snacks/grown/rice", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#FAFAD2",
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/wheat/rice"),
	name: "rice",
	desc: "Rice to meet you.",
	gender: "plural",
	icon_state: "rice",
});
rt.type(6290, "/obj/item/weapon/reagent_containers/food/snacks/grown/chili", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#FF0000",
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/chili"),
	name: "chili",
	desc: "It's spicy! Wait... IT'S BURNING ME!!",
	icon_state: "chilipepper",
});
rt.type(6291, "/obj/item/weapon/reagent_containers/food/snacks/grown/icepepper", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#0000CD",
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/chili/ice"),
	name: "ice pepper",
	desc: "It's a mutant strain of chili",
	icon_state: "icepepper",
	origin_tech: "biotech=4",
});
rt.type(6293, "/obj/item/weapon/reagent_containers/food/snacks/grown/citrus", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/lime"),
	name: "citrus",
	desc: "It's so sour, your face will twist.",
	icon_state: "lime",
});
rt.type(6294, "/obj/item/weapon/reagent_containers/food/snacks/grown/citrus/lime", "/obj/item/weapon/reagent_containers/food/snacks/grown/citrus", {
	filling_color: "#00FF00",
	seed: rt.typePath("/obj/item/seeds/lime"),
	name: "lime",
	desc: "It's so sour, your face will twist.",
	icon_state: "lime",
});
rt.type(6295, "/obj/item/weapon/reagent_containers/food/snacks/grown/citrus/orange", "/obj/item/weapon/reagent_containers/food/snacks/grown/citrus", {
	filling_color: "#FFA500",
	seed: rt.typePath("/obj/item/seeds/orange"),
	name: "orange",
	desc: "It's an tangy fruit.",
	icon_state: "orange",
});
rt.type(6296, "/obj/item/weapon/reagent_containers/food/snacks/grown/citrus/lemon", "/obj/item/weapon/reagent_containers/food/snacks/grown/citrus", {
	filling_color: "#FFD700",
	seed: rt.typePath("/obj/item/seeds/lemon"),
	name: "lemon",
	desc: "When life gives you lemons, make lemonade.",
	icon_state: "lemon",
});
rt.type(6298, "/obj/item/weapon/reagent_containers/food/snacks/grown/cocoapod", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#FFD700",
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/cocoapod"),
	name: "cocoa pod",
	desc: "Fattening... Mmmmm... chucklate.",
	icon_state: "cocoapod",
});
rt.type(6299, "/obj/item/weapon/reagent_containers/food/snacks/grown/vanillapod", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#FFD700",
	seed: rt.typePath("/obj/item/seeds/cocoapod/vanillapod"),
	name: "vanilla pod",
	desc: "Fattening... Mmmmm... vanilla.",
	icon_state: "vanillapod",
});
rt.type(6300, "/obj/item/weapon/reagent_containers/food/snacks/grown/corn", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/popcorn"),
	filling_color: "#FFFF00",
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/corn"),
	name: "ear of corn",
	desc: "Needs some butter!",
	icon_state: "corn",
	trash: rt.typePath("/obj/item/weapon/grown/corncob"),
});
rt.type(6301, "/obj/item/weapon/reagent_containers/food/snacks/grown/eggplant", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#800080",
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/eggplant"),
	name: "eggplant",
	desc: "Maybe there's a chicken inside?",
	icon_state: "eggplant",
});
rt.type(6302, "/obj/item/weapon/reagent_containers/food/snacks/grown/poppy", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#FF6347",
	bitesize_mod: 3,
	seed: rt.typePath("/obj/item/seeds/poppy"),
	name: "poppy",
	desc: "Long-used as a symbol of rest, peace, and death.",
	icon_state: "poppy",
	slot_flags: 64,
});
rt.type(6303, "/obj/item/weapon/reagent_containers/food/snacks/grown/poppy/lily", "/obj/item/weapon/reagent_containers/food/snacks/grown/poppy", {
	filling_color: "#FFA500",
	seed: rt.typePath("/obj/item/seeds/poppy/lily"),
	name: "lily",
	desc: "A beautiful orange flower",
	icon_state: "lily",
});
rt.type(6304, "/obj/item/weapon/reagent_containers/food/snacks/grown/poppy/geranium", "/obj/item/weapon/reagent_containers/food/snacks/grown/poppy", {
	filling_color: "#008B8B",
	seed: rt.typePath("/obj/item/seeds/poppy/geranium"),
	name: "geranium",
	desc: "A beautiful blue flower",
	icon_state: "geranium",
});
rt.type(6305, "/obj/item/weapon/reagent_containers/food/snacks/grown/harebell", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#E6E6FA",
	bitesize_mod: 3,
	seed: rt.typePath("/obj/item/seeds/harebell"),
	name: "harebell",
	desc: "\"I'll sweeten thy sad grave: thou shalt not lack the flower that's like thy face, pale primrose, nor the azured hare-bell, like thy veins; no, nor the leaf of eglantine, whom not to slander, out-sweeten'd not thy breath.\"",
	icon_state: "harebell",
	slot_flags: 64,
});
rt.type(6306, "/obj/item/weapon/reagent_containers/food/snacks/grown/moonflower", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#E6E6FA",
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/sunflower/moonflower"),
	name: "moonflower",
	desc: "Store in a location at least 50 yards away from werewolves.",
	icon_state: "moonflower",
	slot_flags: 64,
});
rt.type(6309, "/obj/item/weapon/reagent_containers/food/snacks/grown/kudzupod", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#6B8E23",
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/kudzu"),
	name: "kudzu pod",
	desc: "<I>Pueraria Virallis</I>: An invasive species with vines that rapidly creep and wrap around whatever they contact.",
	icon_state: "kudzupod",
});
rt.type(6310, "/obj/item/weapon/reagent_containers/food/snacks/grown/watermelon", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/watermelonslice"),
	slices_num: 5,
	dried_type: null,
	filling_color: "#008000",
	bitesize_mod: 3,
	seed: rt.typePath("/obj/item/seeds/watermelon"),
	name: "watermelon",
	desc: "It's full of watery goodness.",
	icon_state: "watermelon",
	w_class: 3,
});
rt.type(6311, "/obj/item/weapon/reagent_containers/food/snacks/grown/holymelon", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#FFD700",
	dried_type: null,
	seed: rt.typePath("/obj/item/seeds/watermelon/holy"),
	name: "holymelon",
	desc: "The water within this melon has been blessed by some deity that's particularly fond of watermelon.",
	icon_state: "holymelon",
});
rt.type(6312, "/obj/item/weapon/reagent_containers/food/snacks/grown/cabbage", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#90EE90",
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/cabbage"),
	name: "cabbage",
	desc: "Ewwwwwwwwww. Cabbage.",
	icon_state: "cabbage",
});
rt.type(6313, "/obj/item/weapon/reagent_containers/food/snacks/grown/sugarcane", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#FFD700",
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/sugarcane"),
	name: "sugarcane",
	desc: "Sickly sweet.",
	icon_state: "sugarcane",
});
rt.type(6315, "/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	bitesize_mod: 2,
	name: "mushroom",
});
rt.type(6316, "/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/reishi", "/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom", {
	filling_color: "#FF4500",
	seed: rt.typePath("/obj/item/seeds/reishi"),
	name: "reishi",
	desc: "<I>Ganoderma lucidum</I>: A special fungus known for its medicinal and stress relieving properties.",
	icon_state: "reishi",
});
rt.type(6317, "/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/amanita", "/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom", {
	filling_color: "#FF0000",
	seed: rt.typePath("/obj/item/seeds/amanita"),
	name: "fly amanita",
	desc: "<I>Amanita Muscaria</I>: Learn poisonous mushrooms by heart. Only pick mushrooms you know.",
	icon_state: "amanita",
});
rt.type(6318, "/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/angel", "/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom", {
	filling_color: "#C0C0C0",
	seed: rt.typePath("/obj/item/seeds/angel"),
	name: "destroying angel",
	desc: "<I>Amanita Virosa</I>: Deadly poisonous basidiomycete fungus filled with alpha amatoxins.",
	icon_state: "angel",
});
rt.type(6319, "/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/libertycap", "/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom", {
	filling_color: "#DAA520",
	seed: rt.typePath("/obj/item/seeds/liberty"),
	name: "liberty-cap",
	desc: "<I>Psilocybe Semilanceata</I>: Liberate yourself!",
	icon_state: "libertycap",
});
rt.type(6320, "/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/plumphelmet", "/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom", {
	filling_color: "#9370DB",
	seed: rt.typePath("/obj/item/seeds/plump"),
	name: "plump-helmet",
	desc: "<I>Plumus Hellmus</I>: Plump, soft and s-so inviting~",
	icon_state: "plumphelmet",
});
rt.type(6322, "/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/chanterelle", "/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom", {
	filling_color: "#FFA500",
	seed: rt.typePath("/obj/item/seeds/chanter"),
	name: "chanterelle cluster",
	desc: "<I>Cantharellus Cibarius</I>: These jolly yellow little shrooms sure look tasty!",
	icon_state: "chanterelle",
});
rt.type(6332, "/obj/item/weapon/reagent_containers/food/snacks/grown/blumpkin", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#87CEFA",
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/pumpkin/blumpkin"),
	name: "blumpkin",
	desc: "The pumpkin's toxic sibling.",
	icon_state: "blumpkin",
});
rt.type(6333, "/obj/item/weapon/reagent_containers/food/snacks/grown/random", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/random"),
	name: "strange plant",
	desc: "What could this even be?",
	icon_state: "crunchy",
});
rt.type(6335, "/obj/item/weapon/reagent_containers/food/snacks/grown/parsnip", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/carrot/parsnip"),
	name: "parsnip",
	desc: "Closely related to carrots.",
	icon_state: "parsnip",
});
rt.type(6336, "/obj/item/weapon/reagent_containers/food/snacks/grown/whitebeet", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#F4A460",
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/whitebeet"),
	name: "white-beet",
	desc: "You can't beat white-beet.",
	icon_state: "whitebeet",
});
rt.type(6337, "/obj/item/weapon/reagent_containers/food/snacks/grown/redbeet", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/redbeet"),
	name: "red beet",
	desc: "You can't beat red beet.",
	icon_state: "redbeet",
});
rt.type(6338, "/obj/item/weapon/reagent_containers/food/snacks/grown/tea", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#008000",
	seed: rt.typePath("/obj/item/seeds/tea"),
	name: "Tea Aspera tips",
	desc: "These aromatic tips of the tea plant can be dried to make tea.",
	icon_state: "tea_aspera_leaves",
});
rt.type(6339, "/obj/item/weapon/reagent_containers/food/snacks/grown/tea/astra", "/obj/item/weapon/reagent_containers/food/snacks/grown/tea", {
	filling_color: "#4582B4",
	seed: rt.typePath("/obj/item/seeds/tea/astra"),
	name: "Tea Astra tips",
	icon_state: "tea_astra_leaves",
});
rt.type(6340, "/obj/item/weapon/reagent_containers/food/snacks/grown/coffee", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#DC143C",
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/coffee"),
	name: "coffee arabica beans",
	desc: "Dry them out to make coffee.",
	icon_state: "coffee_arabica",
});
rt.type(6341, "/obj/item/weapon/reagent_containers/food/snacks/grown/coffee/robusta", "/obj/item/weapon/reagent_containers/food/snacks/grown/coffee", {
	seed: rt.typePath("/obj/item/seeds/coffee/robusta"),
	name: "coffee robusta beans",
	desc: "Increases robustness by 37 percent!",
	icon_state: "coffee_robusta",
});
rt.type(6342, "/obj/item/weapon/reagent_containers/food/snacks/grown/tobacco", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#008000",
	seed: rt.typePath("/obj/item/seeds/tobacco"),
	name: "tobacco leaves",
	desc: "Dry them out to make some smokes.",
	icon_state: "tobacco_leaves",
});
rt.type(6343, "/obj/item/weapon/reagent_containers/food/snacks/grown/tobacco/space", "/obj/item/weapon/reagent_containers/food/snacks/grown/tobacco", {
	seed: rt.typePath("/obj/item/seeds/tobacco/space"),
	name: "space tobacco leaves",
	desc: "Dry them out to make some space-smokes.",
	icon_state: "stobacco_leaves",
});
rt.type(6344, "/obj/item/weapon/reagent_containers/food/snacks/grown/tomato", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#FF6347",
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/tomato"),
	name: "tomato",
	desc: "I say to-mah-to, you say tom-mae-to.",
	icon_state: "tomato",
	splat_type: rt.typePath("/obj/effect/decal/cleanable/tomato_smudge"),
});
rt.type(6345, "/obj/item/weapon/reagent_containers/food/snacks/grown/tomato/blood", "/obj/item/weapon/reagent_containers/food/snacks/grown/tomato", {
	filling_color: "#FF0000",
	seed: rt.typePath("/obj/item/seeds/tomato/blood"),
	name: "blood-tomato",
	desc: "So bloody...so...very...bloody....AHHHH!!!!",
	icon_state: "bloodtomato",
	splat_type: rt.typePath("/obj/effect/gibspawner/generic"),
	origin_tech: "biotech=5",
});
rt.type(6346, "/obj/item/weapon/reagent_containers/food/snacks/grown/tomato/blue", "/obj/item/weapon/reagent_containers/food/snacks/grown/tomato", {
	filling_color: "#0000FF",
	seed: rt.typePath("/obj/item/seeds/tomato/blue"),
	name: "blue-tomato",
	desc: "I say blue-mah-to, you say blue-mae-to.",
	icon_state: "bluetomato",
	splat_type: rt.typePath("/obj/effect/decal/cleanable/oil"),
});
rt.type(6347, "/obj/item/weapon/reagent_containers/food/snacks/grown/tomato/blue/bluespace", "/obj/item/weapon/reagent_containers/food/snacks/grown/tomato/blue", {
	seed: rt.typePath("/obj/item/seeds/tomato/blue/bluespace"),
	name: "bluespace tomato",
	desc: "So lubricated, you might slip through space-time.",
	icon_state: "bluespacetomato",
	origin_tech: "biotech=4;bluespace=5",
});
rt.type(6398, "/obj/item/weapon/reagent_containers/glass/bottle/nutrient/empty", "/obj/item/weapon/reagent_containers/glass/bottle/nutrient", {
	name: "bottle",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "bottle16",
});
rt.type(7509, "/obj/item/weapon/hatchet/cutterblade", "/obj/item/weapon/hatchet", {
	name: "paper cutter",
	desc: "The blade of a paper cutter. Most likely removed for polishing or sharpening.",
	icon: rt.rsc("icons/obj/bureaucracy.dmi"),
	icon_state: "cutterblade",
	item_state: "knife",
});
rt.type(9986, "/obj/item/seeds/sample/alienweed", "/obj/item/seeds/sample", {
	sample_color: null,
	name: "alien weed sample",
	icon_state: "alienweed",
});
