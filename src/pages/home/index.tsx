import React from "react";
import Card from "@/components/Card/Card";

interface CardMetadata {
  title: string;
  description: string;
  link: string;
}

const cardEntries: CardMetadata[] = [
  {
    title: "SpeakMentor",
    description:
      "Along with a team of developers, we created a platform that allows people to practice their English pronunciation • Used React, Django, and PostgreSQL • Implemented a feature that allows users to record their voice and get useful AI generated feedback based on an analysis of the audio.",
    link: "https://github.com/skjohnkwon/SpeakMentor-Django",
  },
  {
    title: "Database Design Project",
    description:
      "This fake online store has a frontend, backend, and database • Made with React, Django, and PostgreSQL • Used constraints, triggers, and stored procedures to enforce business rules • Used raw SQL queries to optimize performance.",
    link: "https://github.com/skjohnkwon/DDP-SDJ",
  },

  {
    title: "Machine Learning Project",
    description:
      "Performed analysis on how American music trends have changed over time and how significant events in America have influenced these trends • Used Python, NLTK, and scikit-learn • Created a Random Forest model to predict the genre of a song based on its lyrics and categorize events.",
    link: "https://github.com/skjohnkwon/DataMining541",
  },
  {
    title: "pathfinder",
    description:
      "My first introduction to programming • Created a program that finds the shortest path between two points on a grid • Used React to create a visual representation of the grid and Dijkstra's + A* algorithm to find the shortest path.",
    link: "https://github.com/skjohnkwon/pathfinder",
  },
  {
    title: "RBTree",
    description:
      "Implemented a Red-Black Tree in Java • Used the tree to implement a set and map data structure • Created a test suite to verify the correctness of the implementation.",
    link: "https://github.com/skjohnkwon/RBTree",
  },
];

const Home: React.FC = () => {
  return (
    <>
      <div className="flex flex-col min-h-[95vh]">
        {" "}
        {/* Add padding-top to account for navbar height */}
        {/* Container to stack sections vertically */}
        <div className="flex flex-col items-center space-y-4 flex-grow justify-center">
          {/* About me section */}
          <div className="w-1/2 h-96 border p-4 overflow-auto rounded-lg">
            <div className="text-xl font-bold pb-4">about me</div>
            <img
              src="/src/assets/selfie.png"
              alt="selfie"
              className="rounded-lg w-52 h-auto float-left mr-3 border-b-slate-900 border-2"
            />
            <p>
              Hi, my name is Jung Ho Kwon, but you can call me John. I was born
              in South Korea and moved to America when I was very young. As a
              developer, I am always finding ways to use my skills as a
              programmer to solve problems in the real world, as well as my own
              personal issues. I first started coding Minecraft plugins for
              servers as a hobby, and it quickly grew into an interest that I
              would later pursue at university (CSUN) as a computer science
              major.
            </p>
            <p>
              I also have a huge passion for music. As a music producer, I have
              worked with many artists across all genres, accumulating more than
              15 million streams on Spotify alone. I am always looking for ways
              to combine my love for music and programming to create something
              new and exciting. Feel free to reach out to me at{" "}
              <a
                className="text-blue-500 hover:text-red-600"
                href="mailto:sk.johnkwon@gmail.com"
              >
                sk.johnkwon@gmail.com
              </a>
              ! Currently, I am working as a full-time software engineer intern
              at Mogul, a platform that helps artists understand their revenue
              and earn them more money.
            </p>
          </div>
          {/* Projects section */}
          <div className="w-1/2 h-100 rounded-lg border p-4">
            <div className="text-xl font-bold pb-4">projects</div>
            <div className="flex space-x-4 p-3 overflow-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-300">
              {cardEntries.map((entry, index) => (
                <div key={index} className="flex-shrink-0">
                  <Card
                    title={entry.title}
                    description={entry.description}
                    link={entry.link}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2 text-sm text-center">
            react + typescript + tailwindcss + shadcn/ui deployed on aws amplify
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
