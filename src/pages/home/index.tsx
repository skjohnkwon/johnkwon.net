import React from "react";
import Card from "@/components/Card/Card";
import selfie from "../../assets/selfie.png";
import RandomGreetingButton from "@/components/RandomGreetingButton/RandomGreetingButton";

interface CardMetadata {
  title: string;
  description: string;
  link: string;
}

const cardEntries: CardMetadata[] = [
  {
    title: "SpeakMentor",
    description:
      "Along with a team of developers, we created a platform that allows people to practice their English pronunciation • Used React, Django, and PostgreSQL • Implemented a feature that allows users to record their voice and get useful AI generated feedback based on an analysis of the audio, as well as an AI powered chatbot to help users practice conversations.",
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
      "My first introduction to programming with React • Created a program that finds the shortest path between two points on a grid • Used React to create a visual representation of the grid and Dijkstra's + A* algorithm to find the shortest path.",
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
    <div className="flex flex-col min-h-[95vh] dark:bg-gray-900 dark:text-white">
      <div className="flex flex-col items-center space-y-4 flex-grow justify-center pt-32">
        <div className="w-1/2 h-[100] border dark:border-gray-700 p-4 rounded-lg min-w-[320px]">
          <div className="text-xl font-bold pb-4 lg:pb-2 dark:text-white">
            <RandomGreetingButton />
          </div>
          <div className="flex flex-col xl:flex-row-reverse xl:items-center xl:justify-between">
            <div className="flex-shrink-0 mx-auto my-auto pl-0 xl:pl-4 pb-4 xl:pb-2 pr-0 xl:pr-3">
              <img
                src={selfie}
                alt="selfie"
                className="rounded-lg w-[310px] h-auto border-2 dark:border-white"
              />
            </div>
            <div className="flex-grow">
              <p>
                Hi! My name is Jung Ho Kwon, but you can call me John. I was
                born in South Korea and moved to America when I was very young.
                I love finding ways to use my skills as a programmer to solve
                problems in the real world, as well as my own personal issues. I
                first started coding Minecraft plugins for servers as a hobby,
                and it quickly grew into an interest that I would later pursue
                in university (CSUN) as a computer science major.
              </p>
              <br />
              <p>
                I also have a huge passion for music. As a music producer, I
                have worked with many artists across all genres, accumulating
                more than 15 million streams on Spotify alone. I am always
                looking for ways to combine my love for music and programming to
                create something useful for artists.
              </p>
              <br />
              <p>
                Feel free to reach out to me at{" "}
                <a
                  className="text-blue-500 hover:text-red-600"
                  href="mailto:sk.johnkwon@gmail.com"
                >
                  sk.johnkwon@gmail.com
                </a>
                ! Currently, I am working as a full-time software engineer
                intern at Mogul, a platform that helps artists understand their
                revenue and earn them more money.{" "}
                <a
                  className="text-blue-500 hover:text-red-600"
                  target="_blank"
                  href="https://usemogul.com/"
                >
                  Check it out here
                </a>
                !
              </p>
            </div>
          </div>
        </div>
        <div className="w-1/2 h-100 rounded-lg border dark:border-gray-700 p-4 min-w-[320px]">
          <div className="text-xl font-bold pb-4 dark:text-white">projects</div>
          <div className="flex space-x-4 p-3 overflow-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 scrollbar-track-gray-300 dark:scrollbar-track-gray-800">
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
        <a
          href="https://github.com/skjohnkwon/johnkwon.net"
          target="_blank"
          className="mt-2 text-xs text-center dark:text-gray-300 hover:cursor-none generic-hover pb-4"
        >
          vite + react + typescript + tailwindcss + shadcn/ui deployed on aws
          amplify
        </a>
      </div>
    </div>
  );
};

export default Home;
