import { AnimeSeries } from '../types/anime';

// Authentic generated poster and banner assets
const HERO_BANNER = '/src/assets/images/anime_hero_cinematic_1790331676210.jpg';
const SOLO_LEVELING_POSTER = '/src/assets/images/anime_poster_sololeveling_1790331696780.jpg';
const CYBERPUNK_POSTER = '/src/assets/images/anime_poster_cyberpunk_1790331713802.jpg';
const SAMURAI_POSTER = '/src/assets/images/anime_poster_samurai_1790331734075.jpg';

// Fast reliable open stream assets for fluid video playback
const SAMPLE_STREAM_1 = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';
const SAMPLE_STREAM_2 = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
const SAMPLE_STREAM_3 = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';
const SAMPLE_STREAM_4 = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4';

export const INITIAL_ANIME_DATABASE: AnimeSeries[] = [
  {
    id: 'GDKHZEJ0K',
    type: 'series',
    title: 'Solo Leveling',
    japaneseTitle: '俺だけレベルアップな件',
    description: "They say whatever doesn't kill you makes you stronger, but that's not the case for the world's weakest hunter Sung Jinwoo. After being brutally slaughtered by monsters in a high-ranking dungeon, Jinwoo came back with the System, a program only he could see, that's leveling him up in every way. Now, he's inspired to discover the secrets behind his powers and the dungeon that spawned them.",
    url: 'https://www.crunchyroll.com/series/GDKHZEJ0K',
    image: SOLO_LEVELING_POSTER,
    bannerImage: HERO_BANNER,
    rating: 4.9,
    year: 2024,
    status: 'Releasing',
    genres: ['Action', 'Dark Fantasy', 'Supernatural', 'Dungeon'],
    studios: ['A-1 Pictures'],
    totalEpisodes: 24,
    featured: true,
    trendingRank: 1,
    seasons: [
      {
        id: 's1',
        seasonNumber: 1,
        title: 'Season 1: Awakening',
        episodes: [
          {
            id: 'GDKHZEJ0K-e01',
            episodeNumber: 1,
            seasonNumber: 1,
            title: "I'm Used to It",
            description: "Known as the weakest hunter of all mankind, E-rank hunter Sung Jinwoo risks his life in low-rank dungeons just to pay his mother's medical bills and sister's tuition. Inside a dual dungeon, their raid party triggers a deadly trial.",
            thumbnail: SOLO_LEVELING_POSTER,
            duration: 1420,
            url: 'https://www.crunchyroll.com/watch/GDKHZEJ0K/im-used-to-it',
            streamUrl: SAMPLE_STREAM_1,
            availableDubs: ['en', 'ja', 'es', 'fr', 'de'],
            availableSubs: ['English', 'Japanese', 'Spanish', 'French', 'German'],
            introStart: 85,
            introEnd: 175,
            outroStart: 1320,
            outroEnd: 1410
          },
          {
            id: 'GDKHZEJ0K-e02',
            episodeNumber: 2,
            seasonNumber: 1,
            title: 'If I Had One More Chance',
            description: "Sacrificing himself to let his party escape the slaughter of the stone god statues, Jinwoo lies on the sacrificial altar waiting for death. At the final heartbeat, a quest window appears before his eyes.",
            thumbnail: HERO_BANNER,
            duration: 1440,
            url: 'https://www.crunchyroll.com/watch/GDKHZEJ0K/if-i-had-one-more-chance',
            streamUrl: SAMPLE_STREAM_2,
            availableDubs: ['en', 'ja', 'es', 'fr'],
            availableSubs: ['English', 'Japanese', 'Spanish', 'French'],
            introStart: 90,
            introEnd: 180,
            outroStart: 1340,
            outroEnd: 1430
          },
          {
            id: 'GDKHZEJ0K-e03',
            episodeNumber: 3,
            seasonNumber: 1,
            title: "It's Like a Game",
            description: "Jinwoo wakes up in a hospital bed with full physical health and an invisible game-like quest system granting daily conditioning routines and penalty survival zones.",
            thumbnail: SOLO_LEVELING_POSTER,
            duration: 1410,
            url: 'https://www.crunchyroll.com/watch/GDKHZEJ0K/its-like-a-game',
            streamUrl: SAMPLE_STREAM_4,
            availableDubs: ['en', 'ja', 'es', 'fr'],
            availableSubs: ['English', 'Japanese', 'Spanish', 'French'],
            introStart: 85,
            introEnd: 175,
            outroStart: 1310,
            outroEnd: 1400
          },
          {
            id: 'GDKHZEJ0K-e04',
            episodeNumber: 4,
            seasonNumber: 1,
            title: "I've Gotta Get Stronger",
            description: "Entering an instant dungeon inside Hapjeong subway station, Jinwoo confronts ferocious blue-furred demon wolves, slowly realizing that stat points alter his real world reflexes.",
            thumbnail: HERO_BANNER,
            duration: 1435,
            url: 'https://www.crunchyroll.com/watch/GDKHZEJ0K/ive-gotta-get-stronger',
            streamUrl: SAMPLE_STREAM_1,
            availableDubs: ['en', 'ja', 'es', 'fr'],
            availableSubs: ['English', 'Japanese', 'Spanish', 'French'],
            introStart: 80,
            introEnd: 170,
            outroStart: 1335,
            outroEnd: 1425
          }
        ]
      }
    ]
  },
  {
    id: 'GR3K0XK9R',
    type: 'series',
    title: 'Welcome to Demon School! Iruma-kun',
    japaneseTitle: '魔入りました！入間くん',
    description: "Fourteen-year-old Suzuki Iruma has been forced to work since childhood to support his irresponsible parents. One day, his parents sell him to the demon Sullivan in exchange for wealth. To Iruma's surprise, Sullivan only wants a grandchild to spoil, enrolling him in the demon academy Babyls.",
    url: 'https://www.crunchyroll.com/series/GR3K0XK9R',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    year: 2023,
    status: 'Completed',
    genres: ['Comedy', 'Fantasy', 'School', 'Supernatural'],
    studios: ['BN Pictures'],
    totalEpisodes: 65,
    featured: false,
    trendingRank: 4,
    seasons: [
      {
        id: 's1',
        seasonNumber: 1,
        title: 'Season 1',
        episodes: [
          {
            id: 'GR3K0XK9R-e01',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Iruma-kun from Demon School',
            description: "Fourteen-year-old Suzuki Iruma is sold to the great demon Sullivan by his deadbeat parents, and enters the underworld demon academy Babyls.",
            thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
            duration: 1440,
            url: 'https://www.crunchyroll.com/watch/GR3K0XK9R/iruma-kun-from-demon-school',
            streamUrl: SAMPLE_STREAM_2,
            availableDubs: ['en', 'ja', 'es'],
            availableSubs: ['English', 'Japanese', 'Spanish'],
            introStart: 75,
            introEnd: 165,
            outroStart: 1330,
            outroEnd: 1420
          }
        ]
      }
    ]
  },
  {
    id: 'GRE50KV36',
    type: 'series',
    title: 'Black Clover',
    japaneseTitle: 'ブラッククローバー',
    description: "Asta and Yuno are orphans abandoned together at a church in Hage village. While Yuno is gifted with exceptional magical power and obtains a legendary four-leaf clover grimoire, Asta has no magic whatsoever. However, when Yuno is threatened, Asta receives a dark five-leaf grimoire harboring anti-magic swords.",
    url: 'https://www.crunchyroll.com/series/GRE50KV36',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    rating: 4.7,
    year: 2021,
    status: 'Completed',
    genres: ['Action', 'Fantasy', 'Magic', 'Shounen'],
    studios: ['Studio Pierrot'],
    totalEpisodes: 170,
    trendingRank: 3,
    seasons: [
      {
        id: 's1',
        seasonNumber: 1,
        title: 'Season 1',
        episodes: [
          {
            id: 'GRE50KV36-e01',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Asta and Yuno',
            description: "In a world where magic is everything, Asta is born without any magic power at all, while his rival Yuno is blessed with tremendous talent.",
            thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
            duration: 1430,
            url: 'https://www.crunchyroll.com/watch/GRE50KV36/asta-and-yuno',
            streamUrl: SAMPLE_STREAM_3,
            availableDubs: ['en', 'ja', 'es', 'de'],
            availableSubs: ['English', 'Japanese', 'Spanish', 'German'],
            introStart: 90,
            introEnd: 180,
            outroStart: 1320,
            outroEnd: 1410
          }
        ]
      }
    ]
  },
  {
    id: 'CYBER-2077',
    type: 'series',
    title: 'Cyberpunk: Edgerunners',
    japaneseTitle: 'サイバーパンク エッジランナーズ',
    description: "In a dystopia riddled with corruption and cybernetic implants, a talented but reckless street kid named David Martinez aims to survive by becoming an edgerunner: a high-tech mercenary outlaw operating in the neon shadows of Night City.",
    url: 'https://www.crunchyroll.com/series/CYBER-2077',
    image: CYBERPUNK_POSTER,
    bannerImage: HERO_BANNER,
    rating: 4.95,
    year: 2022,
    status: 'Completed',
    genres: ['Sci-Fi', 'Cyberpunk', 'Action', 'Psychological'],
    studios: ['Studio Trigger'],
    totalEpisodes: 10,
    featured: true,
    trendingRank: 2,
    seasons: [
      {
        id: 's1',
        seasonNumber: 1,
        title: 'Season 1',
        episodes: [
          {
            id: 'CYBER-e01',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Let You Down',
            description: "Tragedy strikes high schooler David Martinez in Santo Domingo, plunging him into the ruthless underworld of cyber-ware and street survival.",
            thumbnail: CYBERPUNK_POSTER,
            duration: 1440,
            url: 'https://www.crunchyroll.com/watch/CYBER/let-you-down',
            streamUrl: SAMPLE_STREAM_1,
            availableDubs: ['en', 'ja', 'es', 'fr', 'de'],
            availableSubs: ['English', 'Japanese', 'Spanish', 'French'],
            introStart: 70,
            introEnd: 160,
            outroStart: 1340,
            outroEnd: 1430
          },
          {
            id: 'CYBER-e02',
            episodeNumber: 2,
            seasonNumber: 1,
            title: 'Like a Boy',
            description: "With a military-grade Sandevistan spine implanted into his back, David encounters the netrunner Lucy on a metro train.",
            thumbnail: HERO_BANNER,
            duration: 1420,
            url: 'https://www.crunchyroll.com/watch/CYBER/like-a-boy',
            streamUrl: SAMPLE_STREAM_4,
            availableDubs: ['en', 'ja', 'es'],
            availableSubs: ['English', 'Japanese', 'Spanish'],
            introStart: 70,
            introEnd: 160,
            outroStart: 1320,
            outroEnd: 1410
          }
        ]
      }
    ]
  },
  {
    id: 'GVDHX8JJE',
    type: 'series',
    title: 'Black Summoner',
    japaneseTitle: '黒の召喚士',
    description: "Kelvin finds himself reincarnated into another world with a goddess, Melfina, as his servant and guide. He traded his modern memories for advanced summoner and battle skills, embarking on an adrenaline-charged adventurer career.",
    url: 'https://www.crunchyroll.com/series/GVDHX8JJE',
    image: SAMURAI_POSTER,
    rating: 4.6,
    year: 2022,
    status: 'Completed',
    genres: ['Action', 'Fantasy', 'Isekai', 'Adventure'],
    studios: ['Satelight'],
    totalEpisodes: 12,
    trendingRank: 6,
    seasons: [
      {
        id: 's1',
        seasonNumber: 1,
        title: 'Season 1',
        episodes: [
          {
            id: 'GVDHX8JJE-e01',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Memory Loss and Summoner',
            description: "Kelvin awakens in a shrine with no memories of his previous life, having traded them away for high-tier stats and the Goddess as his contract summon.",
            thumbnail: SAMURAI_POSTER,
            duration: 1420,
            url: 'https://www.crunchyroll.com/watch/GVDHX8JJE/memory-loss-and-summoner',
            streamUrl: SAMPLE_STREAM_2,
            availableDubs: ['en', 'ja'],
            availableSubs: ['English', 'Japanese'],
            introStart: 85,
            introEnd: 175,
            outroStart: 1330,
            outroEnd: 1415
          }
        ]
      }
    ]
  },
  {
    id: 'GYQ43P3E6',
    type: 'series',
    title: 'Black Butler',
    japaneseTitle: '黒執事',
    description: "Ciel Phantomhive is the most powerful boy in Victorian England, but he bears the scars of unspeakable trauma. Desperate to avenge his murdered parents, he forms a contract with Sebastian Michaelis, a demon disguised as a flawless butler.",
    url: 'https://www.crunchyroll.com/series/GYQ43P3E6',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    rating: 4.75,
    year: 2024,
    status: 'Releasing',
    genres: ['Mystery', 'Dark Fantasy', 'Supernatural', 'Historical'],
    studios: ['CloverWorks', 'A-1 Pictures'],
    totalEpisodes: 48,
    trendingRank: 5,
    seasons: [
      {
        id: 's1',
        seasonNumber: 1,
        title: 'Public School Arc',
        episodes: [
          {
            id: 'GYQ43P3E6-e01',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'His Butler, at School',
            description: "Queen Victoria charges Ciel with investigating the disappearance of high-ranking noble students at Weston College.",
            thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
            duration: 1440,
            url: 'https://www.crunchyroll.com/watch/GYQ43P3E6/his-butler-at-school',
            streamUrl: SAMPLE_STREAM_3,
            availableDubs: ['en', 'ja'],
            availableSubs: ['English', 'Japanese'],
            introStart: 90,
            introEnd: 180,
            outroStart: 1340,
            outroEnd: 1430
          }
        ]
      }
    ]
  },
  {
    id: 'GR24JJ086',
    type: 'movie',
    title: 'BLACKFOX',
    japaneseTitle: 'ブラックフォックス',
    description: "Living in a ninja residence tucked away in a corner of a futuristic city, Rikka, the eldest daughter of a ninja clan, looks up to her father—a researcher. When her home is attacked by corporate mercenaries, Rikka takes up her sword as Blackfox.",
    url: 'https://www.crunchyroll.com/series/GR24JJ086',
    image: SAMURAI_POSTER,
    rating: 4.5,
    year: 2019,
    status: 'Completed',
    genres: ['Action', 'Sci-Fi', 'Ninja', 'Cyberpunk'],
    studios: ['Studio 3Hz'],
    totalEpisodes: 1,
    trendingRank: 8,
    seasons: [
      {
        id: 's1',
        seasonNumber: 1,
        title: 'Movie',
        episodes: [
          {
            id: 'GR24JJ086-m01',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'BLACKFOX Movie',
            description: "The full theatrical motion picture following Rikka Isurugi as she awakens the power of the beast drones to avenge her family.",
            thumbnail: SAMURAI_POSTER,
            duration: 5400,
            url: 'https://www.crunchyroll.com/watch/GR24JJ086/blackfox',
            streamUrl: SAMPLE_STREAM_1,
            availableDubs: ['en', 'ja'],
            availableSubs: ['English', 'Japanese'],
            introStart: 120,
            introEnd: 210,
            outroStart: 5100,
            outroEnd: 5350
          }
        ]
      }
    ]
  },
  {
    id: 'G3KHEVDZ8',
    type: 'series',
    title: 'Solo Camping for Two',
    japaneseTitle: 'ふたりソロキャンプ',
    description: "Gen Kinokura just wanted to enjoy his peaceful solo camping trips—no distractions, no problems. Enter Shizuku Kusano, a clueless but enthusiastic newbie who crashes his campsite. Now, this bothered outdoorsman is stuck teaching her the ropes.",
    url: 'https://www.crunchyroll.com/series/G3KHEVDZ8',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&auto=format&fit=crop&q=80',
    rating: 4.4,
    year: 2024,
    status: 'Releasing',
    genres: ['Slice of Life', 'Outdoors', 'Comedy', 'Food'],
    studios: ['SynergySP'],
    totalEpisodes: 12,
    trendingRank: 9,
    seasons: [
      {
        id: 's1',
        seasonNumber: 1,
        title: 'Season 1',
        episodes: [
          {
            id: 'G3KHEVDZ8-e01',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Solo Camping Meets Disaster',
            description: "Gen escapes to Mount Fuji for isolated campfire cooking, only to hear screaming footsteps heading straight toward his tent.",
            thumbnail: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&auto=format&fit=crop&q=80',
            duration: 1420,
            url: 'https://www.crunchyroll.com/watch/G3KHEVDZ8/solo-camping-meets-disaster',
            streamUrl: SAMPLE_STREAM_2,
            availableDubs: ['ja'],
            availableSubs: ['English', 'Japanese'],
            introStart: 85,
            introEnd: 175,
            outroStart: 1320,
            outroEnd: 1410
          }
        ]
      }
    ]
  },
  {
    id: 'JJK-002',
    type: 'series',
    title: 'Jujutsu Kaisen',
    japaneseTitle: '呪術廻戦',
    description: "Yuji Itadori is a boy with tremendous physical strength, though he lives an ordinary high school life. One day, to save a classmate attacked by curses, he eats the finger of Ryomen Sukuna, taking the curse into his very soul.",
    url: 'https://www.crunchyroll.com/series/GRDV0019R',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
    bannerImage: HERO_BANNER,
    rating: 4.92,
    year: 2023,
    status: 'Completed',
    genres: ['Action', 'Dark Fantasy', 'Supernatural', 'Martial Arts'],
    studios: ['MAPPA'],
    totalEpisodes: 47,
    featured: true,
    trendingRank: 7,
    seasons: [
      {
        id: 's2',
        seasonNumber: 2,
        title: 'Shibuya Incident',
        episodes: [
          {
            id: 'JJK-s2e01',
            episodeNumber: 1,
            seasonNumber: 2,
            title: 'Hidden Inventory',
            description: "The spring of 2006. Satoru Gojo and Suguru Geto, two peerless jujutsu sorcerers at Jujutsu High, are assigned an escort mission for the Star Plasma Vessel.",
            thumbnail: HERO_BANNER,
            duration: 1435,
            url: 'https://www.crunchyroll.com/watch/JJK/hidden-inventory',
            streamUrl: SAMPLE_STREAM_1,
            availableDubs: ['en', 'ja', 'es', 'fr', 'de'],
            availableSubs: ['English', 'Japanese', 'Spanish', 'French'],
            introStart: 90,
            introEnd: 180,
            outroStart: 1330,
            outroEnd: 1425
          }
        ]
      }
    ]
  },
  {
    id: 'FRIEREN-001',
    type: 'series',
    title: 'Frieren: Beyond Journey\'s End',
    japaneseTitle: '葬送のフリーレン',
    description: "The adventure is over, but life goes on for an elf mage just beginning to learn what living means. Decades after the demon king was slain, Frieren embarks on a nostalgic pilgrimage across the continent to understand humanity.",
    url: 'https://www.crunchyroll.com/series/GG5H5XMQ5',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    rating: 4.96,
    year: 2024,
    status: 'Completed',
    genres: ['Adventure', 'Drama', 'Fantasy', 'Magic'],
    studios: ['Madhouse'],
    totalEpisodes: 28,
    trendingRank: 10,
    seasons: [
      {
        id: 's1',
        seasonNumber: 1,
        title: 'Season 1',
        episodes: [
          {
            id: 'FRIEREN-e01',
            episodeNumber: 1,
            seasonNumber: 1,
            title: "The Journey's End",
            description: "After a 10-year journey, the hero party defeats the Demon King and returns to the capital amidst grand celebrations.",
            thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
            duration: 1440,
            url: 'https://www.crunchyroll.com/watch/FRIEREN/the-journeys-end',
            streamUrl: SAMPLE_STREAM_4,
            availableDubs: ['en', 'ja', 'es', 'de'],
            availableSubs: ['English', 'Japanese', 'Spanish', 'German'],
            introStart: 85,
            introEnd: 175,
            outroStart: 1335,
            outroEnd: 1425
          }
        ]
      }
    ]
  }
];
