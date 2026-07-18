lucide.createIcons();

const API_BASE='';
const cardGrid=document.getElementById('cardGrid');
const searchInput=document.getElementById('searchInput');

let debounceTimer=null;
let _SIP=false;
let pingInterval=null;

const items=[
    {
        "name": "Cyberpunk 2077",
        "game_key": "jy0354",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/library_600x900.jpg"
    },
    {
        "name": "Grand Theft Auto V",
        "game_key": "jy0108",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900.jpg"
    },
    {
        "name": "Elden Ring",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/library_600x900.jpg",
        "game_key": "dg0170"
    },
    {
        "name": "Sim Racing Telemetry - F1 22",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1692250/library_600x900.jpg",
        "game_key": "kj0531"
    },
    {
        "name": "Little Nightmares III",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2136470/library_600x900.jpg",
        "game_key": "bs0039"
    },
    {
        "name": "SAND LAND",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1979440/library_600x900.jpg",
        "game_key": "dg0419"
    },
    {
        "name": "X-Plane 11",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/269950/library_600x900.jpg",
        "game_key": "kj0495"
    },
    {
        "name": "GUILTY GEAR -STRIVE-",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1384160/library_600x900.jpg",
        "game_key": "kj0530"
    },
    {
        "name": "Clair Obscur: Expedition 33",
        "imageUrl": "https://cdn1.epicgames.com/spt-assets/330dace5ffc74156987f91d454ac544b/project-w-1kt2x.jpg",
        "game_key": "bs0034"
    },
    {
        "name": "Easy Red 2",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1325710/library_600x900.jpg",
        "game_key": "bs0035"
    },
    {
        "name": "JDM: Japanese Drift Master",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1153410/library_600x900.jpg",
        "game_key": "bs0026"
    },
    {
        "name": "The First Berserker: Khazan",
        "imageUrl": "https://clouddosage.com/wp-content/uploads/2025/03/The-First-Berserker-Khazan-review-feature.jpg",
        "game_key": "bs0023"
    },
    {
        "name": "Blue Prince",
        "imageUrl": "https://assets.nintendo.com/image/upload/q_auto/f_auto/store/software/switch2/70010000109038/b981f7ef5d2df071e77e83bbe6ded66110931ecdb62571ad2086d5523bf4af06",
        "game_key": "bs0021"
    },
    {
        "name": "Only Up",
        "imageUrl": "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2023/07/only-up-can-you-save-the-game.jpg",
        "game_key": "bs0025"
    },
    {
        "name": "Schedule 1",
        "imageUrl": "https://static0.srcdn.com/wordpress/wp-content/uploads/sharedimages/2025/03/schedule-i-tag-page-cover-art.jpg?w=1200&h=900&fit=crop",
        "game_key": "bs0024"
    },
    {
        "name": "RuneScape: Dragonwilds",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1343400/library_600x900.jpg",
        "game_key": "bs0022"
    },
    {
        "name": "Poppy Playtime: Chapter 4",
        "imageUrl": "https://cdn1.epicgames.com/spt-assets/465c0f6c95d04b1c86b280b4925fee2d/poppy-playtime-1g4f9.jpg",
        "game_key": "dg0730"
    },
    {
        "name": "Raft",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/648800/library_600x900.jpg",
        "game_key": "kj0209"
    },
    {
        "name": "Football Manager 2023",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1904540/library_600x900.jpg",
        "game_key": "kj0461"
    },
    {
        "name": "Platform 8",
        "imageUrl": "https://playism.com/wp-content/uploads/2024/11/06_8th_Logo_Keyart-1024x576.jpg",
        "game_key": "kj0529"
    },
    {
        "name": "Uncharted 4",
        "imageUrl": "https://preview.redd.it/i-made-this-uncharted-4-poster-v0-pg0s83b9l7p61.jpg?auto=webp&s=e2c84c3ef21742b2fd7da369394a0ce6b60ee0bd",
        "game_key": "dg0248"
    },
    {
        "name": "Cities: Skylines 2",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/949230/library_600x900.jpg",
        "game_key": "dg0364"
    },
    {
        "name": "Frostpunk 2",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1601580/library_600x900.jpg",
        "game_key": "dg0533"
    },
    {
        "name": "Poppy Playtime: Chapter 2",
        "imageUrl": "https://cdn1.epicgames.com/spt-assets/465c0f6c95d04b1c86b280b4925fee2d/poppy-playtime-1g3iv.png",
        "game_key": "kj0138"
    },
    {
        "name": "Poppy Playtime: Chapter 1",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1721470/library_600x900.jpg",
        "game_key": "kj0137"
    },
    {
        "name": "Poppy Playtime: Chapter 3",
        "imageUrl": "https://cdn.displate.com/artwork/857x1200/2026-01-29/51bf7d02-f692-4d5a-bb6d-6b8b01295343.jpg",
        "game_key": "kj0442"
    },
    {
        "name": "Mafia III: Definitive Edition",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/360430/library_600x900.jpg",
        "game_key": "dg0492"
    },
    {
        "name": "Mafia II: Definitive Edition",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1030830/library_600x900.jpg",
        "game_key": "dg0491"
    },
    {
        "name": "TCG Card Shop",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3070070/library_600x900.jpg",
        "game_key": "kp0232"
    },
    {
        "name": "Undertale",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/391540/library_600x900.jpg",
        "game_key": "kj0306"
    },
    {
        "name": "Counter-Strike 2 (Steam)",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/730/library_600x900.jpg",
        "game_key": "bs0040"
    },
    {
        "name": "God of War: Ragnarök",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2322010/library_600x900.jpg",
        "game_key": "bs0017"
    },
    {
        "name": "Supermarket Simulator",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2670630/library_600x900.jpg",
        "game_key": "kp0203"
    },
    {
        "name": "Brotato",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1942280/library_600x900.jpg",
        "game_key": "dg0380"
    },
    {
        "name": "Sniper: Ghost Warrior Contracts 2",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1338770/library_600x900.jpg",
        "game_key": "kp0133"
    },
    {
        "name": "God of War 4",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1593500/library_600x900.jpg",
        "game_key": "dg0154"
    },
    {
        "name": "Halo: The Master Chief Collection",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/976730/library_600x900.jpg",
        "game_key": "kj0229"
    },
    {
        "name": "Ratchet & Clank: Rift Apart",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1895880/library_600x900.jpg",
        "game_key": "kj0287"
    },
    {
        "name": "The Last of Us Part I",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1888930/library_600x900.jpg",
        "game_key": "dg0315"
    },
    {
        "name": "Hollow Knight",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/367520/library_600x900.jpg",
        "game_key": "jy0011"
    },
    {
        "name": "Neon Abyss",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/788100/library_600x900.jpg",
        "game_key": "dg0359"
    },
    {
        "name": "Need for Speed: Payback",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1222680/library_600x900.jpg",
        "game_key": "kj0181"
    },
    {
        "name": "SpongeBob: Battle for Bikini Bottom",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/969990/library_600x900.jpg",
        "game_key": "kj0161"
    },
    {
        "name": "Hogwarts Legacy",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/990080/library_600x900.jpg",
        "game_key": "kj0166"
    },
    {
        "name": "SpongeBob: The Cosmic Shake",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1282150/library_600x900.jpg",
        "game_key": "kj0150"
    },
    {
        "name": "Drift Racing Online",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/635260/library_600x900.jpg",
        "game_key": "kj0141"
    },
    {
        "name": "Choo-Choo Charles",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1766740/library_600x900.jpg",
        "game_key": "dg0278"
    },
    {
        "name": "NBA 2K23",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1919590/library_600x900.jpg",
        "game_key": "kj0107"
    },
    {
        "name": "Ranch Simulator 22",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1119730/library_600x900.jpg",
        "game_key": "kj0085"
    },
    {
        "name": "Marvel’s Spider-Man Remastered",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1817070/library_600x900.jpg",
        "game_key": "kj0089"
    },
    {
        "name": "Stray",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1332010/library_600x900.jpg",
        "game_key": "dg0183"
    },
    {
        "name": "Subnautica: Below Zero",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/848450/library_600x900.jpg",
        "game_key": "kj0025"
    },
    {
        "name": "GhostWire: Tokyo",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1475810/library_600x900.jpg",
        "game_key": "KJ0019"
    },
    {
        "name": "Nintendo Star Brawl",
        "imageUrl": "https://howlongtobeat.com/games/98586_Nickelodeon_All_Star.jpg",
        "game_key": "kj0332"
    },
    {
        "name": "LEGO The Incredibles",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/818320/library_600x900.jpg",
        "game_key": "dg0163"
    },
    {
        "name": "Watch Dogs: Legion",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2239550/library_600x900.jpg",
        "game_key": "dg0159"
    },
    {
        "name": "Cooking Simulator",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/641320/library_600x900.jpg",
        "game_key": "dg0145"
    },
    {
        "name": "FIFA 19",
        "imageUrl": "https://m.media-amazon.com/images/M/MV5BOGQ5ZWZiOTQtY2IwYS00YTY0LTgxMDktOTZkNmI4MmIyYzU0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
        "game_key": "dg0139"
    },
    {
        "name": "Arma 3",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/107410/library_600x900.jpg",
        "game_key": "dg0054"
    },
    {
        "name": "Assassin's Creed: Brotherhood",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/48190/library_600x900.jpg",
        "game_key": "dg0062"
    },
    {
        "name": "Assassin's Creed: Revelations",
        "imageUrl": "https://i.ebayimg.com/images/g/EGwAAOSw-oFkUy8q/s-l1200.jpg",
        "game_key": "dg0063"
    },
    {
        "name": "Assassin's Creed: Black Flag",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/242050/library_600x900.jpg",
        "game_key": "dg0064"
    },
    {
        "name": "Assassin's Creed: Syndicate",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/368500/library_600x900.jpg",
        "game_key": "dg0065"
    },
    {
        "name": "Football: PES 2021",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1259970/library_600x900.jpg",
        "game_key": "dg0024"
    },
    {
        "name": "A Way Out",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1222700/library_600x900.jpg",
        "game_key": "dg0021"
    },
    {
        "name": "Days Gone",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1259420/library_600x900.jpg",
        "game_key": "jy0487"
    },
    {
        "name": "Forza Horizon 4",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1293830/library_600x900.jpg",
        "game_key": "jy0541"
    },
    {
        "name": "My Friend Pedro",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/557340/library_600x900.jpg",
        "game_key": "jy0473"
    },
    {
        "name": "Control",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/870780/library_600x900.jpg",
        "game_key": "jy0417"
    },
    {
        "name": "Halo: Reach",
        "imageUrl": "https://i.ebayimg.com/images/g/0OYAAOSwyiZmvQLW/s-l1200.jpg",
        "game_key": "jy0371"
    },
    {
        "name": "Fallout 4",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/377160/library_600x900.jpg",
        "game_key": "jy0310"
    },
    {
        "name": "It Takes Two",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1426210/library_600x900.jpg",
        "game_key": "jy0440"
    },
    {
        "name": "Minecraft: Dungeons",
        "imageUrl": "https://myhotposters.com/cdn/shop/products/mL4386_1024x1024.jpg?v=1748533618",
        "game_key": "jy0402"
    },
    {
        "name": "Destiny 2",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1085660/library_600x900.jpg",
        "game_key": "bs0043"
    },
    {
        "name": "War Thunder",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/236390/library_600x900.jpg",
        "game_key": "bs0042"
    },
    {
        "name": "Wolf Mate",
        "imageUrl": "https://gamefaqs.gamespot.com/a/box/7/6/1/1127761_side.jpg",
        "game_key": "bs0036"
    },
    {
        "name": "Crashlands 2",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2402220/library_600x900.jpg",
        "game_key": "bs0020"
    },
    {
        "name": "Mandragora",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1792660/library_600x900.jpg",
        "game_key": "bs0019"
    },
    {
        "name": "Manor Lords",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1363080/library_600x900.jpg",
        "game_key": "kp0213"
    },
    {
        "name": "inZOI",
        "imageUrl": "https://m.media-amazon.com/images/M/MV5BMzI1M2ZjOGUtNGY0OC00ZTgxLTliZmYtMDllZjY0M2MzMjE2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
        "game_key": "kj0620"
    },
    {
        "name": "AI LIMIT",
        "imageUrl": "https://s.pacn.ws/1/p/1cm/ai-limit-deluxe-edition-875333.1.jpg?v=sye45f",
        "game_key": "bs0018"
    },
    {
        "name": "Horizon Zero Dawn",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1151640/library_600x900.jpg",
        "game_key": "dg0598"
    },
    {
        "name": "Dead Space 3",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1238060/library_600x900.jpg",
        "game_key": "kj0615"
    },
    {
        "name": "Deathloop",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1252330/library_600x900.jpg",
        "game_key": "kj0035"
    },
    {
        "name": "Dead Space 2",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/47780/library_600x900.jpg",
        "game_key": "kj0614"
    },
    {
        "name": "Inside the Backrooms",
        "imageUrl": "https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_1.5/c_scale,w_400/store/software/switch/70010000119130/69e66e404e25d4ff28bcfec8dccda2a1c689cdbc741b2ee8d57c301f41a6f8d2",
        "game_key": "kj0179"
    },
    {
        "name": "Five Hearts Under One Roof",
        "imageUrl": "https://cdn1.epicgames.com/spt-assets/6b211baddecd4526a95438db45166835/five-hearts-under-one-roof-18o7v.png",
        "game_key": "dg0589"
    },
    {
        "name": "The Callisto Protocol",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1544020/library_600x900.jpg",
        "game_key": "kj0483"
    },
    {
        "name": "ARK: Survival Ascended",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2399830/library_600x900.jpg",
        "game_key": "kp0015"
    },
    {
        "name": "Yandere Simulator",
        "imageUrl": "https://m.media-amazon.com/images/M/MV5BN2FhMmUwNDQtNTk1Mi00NzZhLWFmZDItNWZjYzVjYTM0N2Y1XkEyXkFqcGc@._V1_.jpg",
        "game_key": "dg0639"
    },
    {
        "name": "Amanda the Adventurer",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2166060/library_600x900.jpg",
        "game_key": "kj0177"
    },
    {
        "name": "Watch Dogs 2",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/447040/library_600x900.jpg",
        "game_key": "jy0147"
    },
    {
        "name": "Doom Eternal",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/782330/library_600x900.jpg",
        "game_key": "jy0488"
    },
    {
        "name": "Cuphead",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/268910/library_600x900.jpg",
        "game_key": "jy0146"
    },
    {
        "name": "ONE PIECE: PIRATE WARRIORS 4",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1089090/library_600x900.jpg",
        "game_key": "jy0183"
    },
    {
        "name": "Attack On Titan 2",
        "imageUrl": "https://store-images.s-microsoft.com/image/apps.3749.67116328302209369.766d5242-c87b-4e0a-9cef-7b3e870a4a02.1558a40a-d19b-4b5d-b0fd-9c9a565fa1ae",
        "game_key": "jy0208"
    },
    {
        "name": "Minecraft: Legends",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1928870/library_600x900.jpg",
        "game_key": "kj0191"
    },
    {
        "name": "Wobbly Life",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1211020/library_600x900.jpg",
        "game_key": "kj0238"
    },
    {
        "name": "Overcooked 2",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/728880/library_600x900.jpg",
        "game_key": "jy0281"
    },
    {
        "name": "One Piece: Burning Blood",
        "imageUrl": "https://store-images.s-microsoft.com/image/apps.1442.66233392027083247.615b47ed-f09e-4545-8c0b-0d140d30f2e0.2e737e62-0949-4dad-b5d4-82a8950790ad",
        "game_key": "jy0059"
    },
    {
        "name": "Alba: A Wildlife Adventure",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1337010/library_600x900.jpg",
        "game_key": "jy0362"
    },
    {
        "name": "Resident Evil: Revelations 2",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/287290/library_600x900.jpg",
        "game_key": "jy0235"
    },
    {
        "name": "Resident Evil 2: Remake",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/883710/library_600x900.jpg",
        "game_key": "jy0040"
    },
    {
        "name": "Ori and the Will of the Wisps",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1057090/library_600x900.jpg",
        "game_key": "jy0126"
    },
    {
        "name": "Party Hard 2",
        "imageUrl": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/572430/library_600x900.jpg",
        "game_key": "jy0470"
    }
]

function escapeHtml(str) {
    const div=document.createElement('div');
    div.textContent=str??'';
    return div.innerHTML;
}

function renderCard(game) {
    const card=document.createElement('div');
    card.className='game-card';
    card.dataset.id=game.game_key;
    card.innerHTML=`
    <img src="${game.imageUrl}" alt="${escapeHtml(game.name)}" loading="lazy">
    <div class="game-card-nm">${escapeHtml(game.name)}</div>`;
    card.addEventListener('click',()=>launchGame(game));
    return card;
}

function renderCards(list) {
    cardGrid.innerHTML='';
    list.forEach(game=>cardGrid.appendChild(renderCard(game)));
}

function filterGames(query) {
    const q=query.toLowerCase().trim();
    const filtered=q?items.filter(g=>g.name.toLowerCase().includes(q)):items;
    renderCards(filtered);
}

function navigate(url) {
    const gameFrame=window.parent?.document?.querySelector?.('.bframe:not([style*="display:none"])');   
    if (gameFrame) {
        gameFrame.src=url;
    } else {
        window.open(url,'_blank');
    }
}

searchInput.addEventListener('input',(e)=>{
    clearTimeout(debounceTimer);
    const q=e.target.value;
    debounceTimer=setTimeout(()=>filterGames(q),350);
});

let currentSessionUuid=null;

function startKA(uuid) {
    currentSessionUuid=uuid;
    stopKA();
    pingInterval=setInterval(async ()=>{
        try {
            const res=await fetch(`${API_BASE}/api/cloud/v1/pingSession`,{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({uuid})
            });
            const data=await res.json();
            if (data.session_time_used_seconds>=data.session_time_limit_seconds) {
                stopKA();
            } 
        } catch (err) {
            console.error('ping failed',err);
        }
    },15_000);
}

function stopKA() {
    if (pingInterval) {
        clearInterval(pingInterval);
        pingInterval=null;
    }
}

function quitCurrentSession() {
    if (!currentSessionUuid) return;
    const uuid=currentSessionUuid;
    currentSessionUuid=null;
    stopKA();
    navigator.sendBeacon(
        `${API_BASE}/api/cloud/v1/quitSession`,
        new Blob([JSON.stringify({uuid})],{type:'application/json'})
    );
}

async function launchGame(game) {
    if (_SIP) return;
    _SIP=true;
    try {
        const res=await fetch(`${API_BASE}/api/cloud/v1/createSession`,{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({game_key:game.game_key})
        });
        const reader=res.body.getReader();
        const dec=new TextDecoder();
        let buf='';
        while (true) {
            const {value,done}=await reader.read();
            if (done) break;
            buf +=dec.decode(value,{stream:true});
            let idx;
            while ((idx=buf.indexOf('\n'))!==-1) {
                const line=buf.slice(0,idx).trim();
                buf=buf.slice(idx+1);
                if (!line) continue;
                const event=JSON.parse(line);
                if (event.status==='finished_queue') {
                    await fetch(`${API_BASE}/api/cloud/v1/startGame`,{
                        method:'POST',
                        headers:{'Content-Type':'application/json'},
                        body:JSON.stringify({uuid:event.uuid})
                    });
                    navigate(`${API_BASE}/api/cloud/v1/embed?id=${event.uuid}`);
                    startKA(event.uuid);
                    return;
                }
                if (event.status==='error') {
                    console.error('session error',event.error);
                    return;
                }
            }
        }
    } catch (err) {
        console.error('failed to load game',err);
        alert('Failed to load game! Error: '+err.message);
    } finally {
        setTimeout(()=>{_SIP=false;},5000);
    }
}

renderCards(items);

window.addEventListener('beforeunload',quitCurrentSession);