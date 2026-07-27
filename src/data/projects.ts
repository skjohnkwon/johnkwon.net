// Single source of truth for the projects section + the /projects/:slug detail pages.

import umakbangLibrary from "../assets/projects/umakbang-library.jpg";
import umakbangPlaying from "../assets/projects/umakbang-playing.jpg";
import umakbangActions from "../assets/projects/umakbang-actions.jpg";
import umakbangMoveTo from "../assets/projects/umakbang-moveto.jpg";
import umakbangSearch from "../assets/projects/umakbang-search.jpg";
import umakbangVisualizers from "../assets/projects/umakbang-visualizers.jpg";
import umakbangMini from "../assets/projects/umakbang-mini.jpg";
import easyMangaLibrary from "../assets/projects/easy-manga-library.jpg";
import easyMangaSettings from "../assets/projects/easy-manga-settings.jpg";
import simpleSplitUpload from "../assets/projects/simple-split-upload.jpg";
import simpleSplitRecipients from "../assets/projects/simple-split-recipients.jpg";
import simpleSplitAssign from "../assets/projects/simple-split-assign.jpg";
import simpleSplitItems from "../assets/projects/simple-split-items.jpg";
import simpleSplitSummary from "../assets/projects/simple-split-summary.jpg";

export interface Screenshot {
  src: string;
  caption: string;
}

export interface Project {
  slug: string;
  title: string;
  // Short blurb shown on the home page card.
  tagline: string;
  // The bullet-style summary shown on the card (kept close to the original voice).
  cardDescription: string;
  // Longer paragraphs for the detail page.
  overview: string[];
  platform: string;
  year?: string;
  tech: string[];
  features: string[];
  screenshots: Screenshot[];
  // Desktop screenshots are landscape and dense; they need a wider grid than phone shots.
  wideScreenshots?: boolean;
  // Optional external link (e.g. GitHub). When absent, the card still links to the detail page.
  repo?: string;
  liveLink?: { label: string; url: string };
}

export const projects: Project[] = [
  {
    slug: "umakbang",
    title: "umakbang",
    tagline:
      "A desktop file explorer built for a music production library. (it's pronounced oo-mahk-bahng)",
    cardDescription:
      "A desktop file explorer built for a music production library • Indexes a quarter-million samples, stems and project files and stays browsable while it scans • Reads tempo, key and format straight from container headers, draws a waveform on every row, and plays anything in-window • Full file management, ratings, tags and real-time visualizers.",
    overview: [
      "My sample library had outgrown Explorer. Tens of thousands of one-shots, stems, bounces and FL Studio projects spread across drives, and no way to answer the questions I actually had: what's in this folder, how long is it, what tempo is it, and what does it sound like, without opening a DAW to find out.",
      "umakbang is a file explorer built for that. It walks the tree and streams results in as it goes, so a library of a few hundred thousand files is browsable a second after launch rather than after a full scan. Every row draws its own waveform and plays in-window, so auditioning a folder of kicks is arrow-key, arrow-key, arrow-key.",
      "The metadata is parsed in-house. WAV, AIFF, FLAC, MP3, MP4 and Ogg headers are read directly, a few hundred KB per file instead of a full decode, which is what makes duration, sample rate, bit depth and tempo appear for a whole library in seconds. Tempo that isn't in the headers gets worked out by analysing the audio, riding on the decode the waveform already performs.",
      "It's also a real file manager: multi-select, cut/copy/paste, rename, delete to the recycle bin, drag and drop between folders or straight out into a DAW, star ratings and tags you can filter by. And because it's usually running while I work, it shrinks to a 300px mini player pinned above everything else.",
      "Tempo detection matches external references. Key detection didn't, so I measured it instead of guessing: against files with known keys the built-in chroma correlation is right about a third of the time, and swapping in the standard profile sets changed nothing. There are two engines now, that one and Essentia's HPCP extractor compiled to WebAssembly, plus a harness that scores them on pairs of the same track in two formats, which is a labelled test set nobody had to label. A key it estimated is shown as its relative pair, because the note set turns out to be right far more often than the tonic is.",
      "Around the edges it's grown the things I kept needing. Stem separation through LALAL.AI, as an explicit per-file action that totals the cost before it uploads anything. Exclusive track-sale contracts generated straight to PDF from a template you can edit in the app, since the template is the legal text. And a settings import that maps a backup's folders onto wherever they live on this machine, because everything umakbang remembers is keyed by absolute path, so a file copied to a new drive would otherwise arrive with none of its tags.",
    ],
    platform: "Desktop · Windows / macOS / Linux",
    tech: [
      "Electron",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Web Audio API",
      "WebAssembly",
      "Canvas",
      "Vite",
    ],
    features: [
      "Indexes a folder tree and streams results in as it walks, so a 250k-file library is browsable in seconds, with the saved index replayed on the next launch",
      "Scanning runs in a separate utility process, so a sustained walk never freezes the window",
      "Audio metadata parsed in-house from container headers: duration, sample rate, bit depth, channels, bitrate, plus BPM and musical key",
      "Tempo and key worked out by audio analysis for files whose headers and names don't say, riding on the decode the waveform already does, with the detectors running in a worker so the visualizers never drop a frame",
      "Two key detectors, switchable: a built-in chroma correlation and Essentia's HPCP extractor compiled to WebAssembly, chosen by measurement rather than assumption — a harness scores both on pairs of the same track in two formats, which needs no hand-labelling",
      "A waveform on every row, cached to disk after the first play, and the playing row doubles as the scrub target",
      "Files served over a custom protocol with byte-range support, so seeking works and web security stays on. AIFF is rewrapped to WAV on the fly, since Chromium can't decode it",
      "Full file management: multi-select, cut/copy/paste, duplicate, rename, delete to the recycle bin, new folders, and drag and drop into folders or out into a DAW",
      "Star ratings and tags stored locally, usable as filters, plus a search syntax like ext:wav, bpm>120, key:Am, stars:4-5",
      "Real-time visualizers (spectrogram, spectrum, rolling waveform, scope, levels, stereo field) that can read the app or the machine's own output",
      "A mini player: a square window pinned above everything else, for when it's the thing playing while you work",
      "Production stats read from FL Studio's per-project time tracking: hours actually spent, and where they went",
      "Settings, tags, ratings and analysis move between machines: the import maps a backup's folders onto wherever they live here, works the rest out from a single answer, and says how much it had to leave behind before it writes anything",
      "Stem separation through LALAL.AI, as a deliberate per-file action that names the files, totals their length and checks the remaining balance before anything is uploaded",
      "Exclusive track-sale contracts generated to PDF in-app, from a template you can edit, with no external binaries to install",
    ],
    screenshots: [
      {
        src: umakbangLibrary,
        caption:
          "Browsing a folder of kicks, a waveform per row, with something still playing",
      },
      {
        src: umakbangPlaying,
        caption: "Ratings, tags and detected tempo, with the visualizers live",
      },
      {
        src: umakbangActions,
        caption: "Every standard file action, on whatever is selected",
      },
      {
        src: umakbangMoveTo,
        caption: "Quick-move: the folders you file into, two clicks away",
      },
      { src: umakbangSearch, caption: "Search across the whole library" },
      {
        src: umakbangVisualizers,
        caption: "Visualizers filling the window",
      },
      {
        src: umakbangMini,
        caption: "The mini player, pinned above everything else",
      },
    ],
    wideScreenshots: true,
  },
  {
    slug: "easy-manga",
    title: "Easy Manga",
    tagline: "An iOS manga reader that pulls from every source at once.",
    cardDescription:
      "A native iOS manga reader • Searches every source at once and reads from a custom easymanga backend • Tracks a personal library + reading history with local backup/restore, configurable reading modes, and image caching.",
    overview: [
      "For years my favorite way to read manga was an app called Manga Reader, hands down the best reader on the iOS App Store. Around 2020 it was pulled from the store, but it kept working if you sideloaded it. The problem was the backend: the old imanga servers stopped getting updates and slowly rotted, with missing chapters, broken thumbnails, and an increasingly weak catalog.",
      "So I built my own, Easy Manga, as an improved replacement for the imanga servers, with a fresh catalog and reliable chapters and thumbnails. One search box queries every source at once and surfaces the best available copy of each series, so finding the next chapter takes seconds instead of hopping between sites.",
      "I also wanted a simpler, more streamlined UI than the apps I'd been using. The app keeps a personal library and reading history entirely on-device, with backup and restore so your progress moves with you to a new phone.",
    ],
    platform: "iOS",
    tech: ["iOS", "Custom backend", "Web scraping", "Local persistence"],
    features: [
      "Universal search across every configured manga source in a single query",
      "Custom easymanga backend built to replace the deteriorating legacy imanga servers, with a fresh catalog and reliable chapters and thumbnails",
      "Simpler, more streamlined reading UI than the apps it grew out of",
      "Personal library + reading history stored on-device (16 titles, 22 history entries in my own copy)",
      "Backup & restore that merges into existing data, so you can move devices without losing progress",
      "Configurable reader: paged/continuous reading modes and background color",
      "Image cache with one-tap clearing to reclaim storage",
    ],
    screenshots: [
      { src: easyMangaLibrary, caption: "Library: search every source at once" },
      { src: easyMangaSettings, caption: "Settings: reader, backend, backup & storage" },
    ],
  },
  {
    slug: "simple-split",
    title: "Simple Split",
    tagline: "Snap a receipt, split the bill down to the cent.",
    cardDescription:
      "A receipt-splitting app that turns a photo into a fair, itemized bill split • OCR + AI parse every line item, then it assigns items to people and allocates tax, tip, and discounts proportionally • Grew out of a Python receipt calculator I wrote for Costco runs.",
    overview: [
      "Simple Split takes the argument out of splitting a group bill. You photograph the receipt, and it uses OCR plus an AI parsing pass to pull out every line item, discount, and the tax, including messy formats like trailing-minus discounts and coupon lines tied to a product ID.",
      "From there you assign each item to whoever ordered it (items can be shared), and Simple Split allocates tax, tip, and discounts proportionally so every person's total is exact. It started life as a Python command-line receipt calculator I built for splitting Costco runs, and grew into a full app with a clean per-person summary you can copy and send.",
    ],
    platform: "iOS · Python",
    tech: ["iOS", "Python", "OpenAI (OCR parsing)", "Pillow"],
    features: [
      "Photograph or upload a receipt and get a structured, itemized list back",
      "AI-powered parsing handles discounts, coupons, and negative/parenthesized amounts",
      "Assign items to people, including shared items split across the group",
      "Proportional allocation of tax, tip, and discounts so totals are exact to the cent",
      "Per-person summary with each person's items and share, ready to copy and send",
      "Grew out of a Python OCR receipt calculator built for real Costco runs",
    ],
    screenshots: [
      { src: simpleSplitUpload, caption: "Upload a receipt or take a photo" },
      { src: simpleSplitRecipients, caption: "Parsed line items + pick who's splitting" },
      { src: simpleSplitAssign, caption: "Assign each item to a person" },
      { src: simpleSplitItems, caption: "Itemized bill with even or manual split" },
      { src: simpleSplitSummary, caption: "Exact per-person breakdown with tax" },
    ],
  },
  {
    slug: "speakmentor",
    title: "SpeakMentor",
    tagline: "Practice English pronunciation with AI feedback.",
    cardDescription:
      "Along with a team of developers, we created a platform that allows people to practice their English pronunciation • Used React, Django, and PostgreSQL • Implemented a feature that allows users to record their voice and get useful AI generated feedback based on an analysis of the audio, as well as an AI powered chatbot to help users practice conversations.",
    overview: [
      "The inspiration for SpeakMentor was personal. Every member of our team is an immigrant, and we'd all lived through the struggle of learning English and working on our pronunciation, as had our parents. We wanted to build a platform meant to help people like us improve their English and gain confidence in themselves.",
      "SpeakMentor is a platform for practicing English pronunciation, built with a team of developers. Users record their voice and get AI-generated feedback based on an analysis of the audio, so they can hear exactly where their pronunciation drifts and how to fix it.",
      "It also includes an AI-powered chatbot that lets users practice full conversations, giving learners a low-pressure way to build fluency beyond isolated words.",
    ],
    platform: "Web",
    tech: ["React", "Django", "PostgreSQL", "AI / audio analysis"],
    features: [
      "Record your voice and receive AI-generated pronunciation feedback",
      "Audio analysis pinpoints where pronunciation needs work",
      "AI-powered chatbot for practicing full conversations",
      "Built collaboratively with a team of developers",
    ],
    screenshots: [],
    repo: "https://github.com/skjohnkwon/SpeakMentor-Django",
  },
  {
    slug: "database-design-project",
    title: "Database Design Project",
    tagline: "A full-stack fake online store built around a real relational schema.",
    cardDescription:
      "This fake online store has a frontend, backend, and database • Made with React, Django, and PostgreSQL • Used constraints, triggers, and stored procedures to enforce business rules • Used raw SQL queries to optimize performance.",
    overview: [
      "A full-stack fake online store with a frontend, backend, and relational database, built to put database design principles into practice with React, Django, and PostgreSQL.",
      "The focus was the data layer: constraints, triggers, and stored procedures enforce business rules at the database level, and hand-written raw SQL queries keep performance tight where the ORM would otherwise get in the way.",
    ],
    platform: "Web",
    tech: ["React", "Django", "PostgreSQL", "SQL"],
    features: [
      "Full-stack store: frontend, backend, and relational database",
      "Constraints, triggers, and stored procedures enforce business rules in the DB",
      "Raw SQL queries hand-tuned for performance",
    ],
    screenshots: [],
    repo: "https://github.com/skjohnkwon/DDP-SDJ",
  },
  {
    slug: "machine-learning-project",
    title: "Machine Learning Project",
    tagline: "Tracking how American music trends shifted with major events.",
    cardDescription:
      "Performed analysis on how American music trends have changed over time and how significant events in America have influenced these trends • Used Python, NLTK, and scikit-learn • Created a Random Forest model to predict the genre of a song based on its lyrics and categorize events.",
    overview: [
      "An analysis of how American music trends have shifted over time, and how significant events in America influenced those trends, using Python, NLTK, and scikit-learn.",
      "I trained a Random Forest model to predict a song's genre from its lyrics and to categorize events, then used it to connect changes in popular music back to what was happening in the country at the time.",
    ],
    platform: "Data / ML",
    tech: ["Python", "NLTK", "scikit-learn", "Random Forest"],
    features: [
      "Analyzed how U.S. music trends changed over time alongside major events",
      "Random Forest model predicts a song's genre from its lyrics",
      "Event categorization to correlate trends with real-world moments",
    ],
    screenshots: [],
    repo: "https://github.com/skjohnkwon/DataMining541",
  },
];

export const getProject = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug);
