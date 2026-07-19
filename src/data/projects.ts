// Single source of truth for the projects section + the /projects/:slug detail pages.

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
  // Optional external link (e.g. GitHub). When absent, the card still links to the detail page.
  repo?: string;
  liveLink?: { label: string; url: string };
}

export const projects: Project[] = [
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
