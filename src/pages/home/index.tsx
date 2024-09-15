import React from "react";
import Navbar from "@/components/Navbar/Navbar";
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
    link: "/",
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
    link: "/",
  },
  {
    title: "pathfinder",
    description:
      "My first introduction to programming • Created a program that finds the shortest path between two points on a grid • Used React to create a visual representation of the grid and Dijkstra's + A* algorithm to find the shortest path.",
    link: "/",
  },
  {
    title: "title3",
    description: "description3",
    link: "/",
  },
  {
    title: "title3",
    description: "description3",
    link: "/",
  },
  {
    title: "title3",
    description: "description3",
    link: "/",
  },
];

const Home: React.FC = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen p-4">
        <Navbar />
        {/* Horizontal scrollable container */}
        <div className="overflow-x-auto rounded-lg border p-4">
          <div className="flex flex-nowrap space-x-4">
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
        {/* Footer text anchored at the bottom */}
        <div className="mt-auto text-sm">
          react + typescript + tailwindcss + shadcn/ui deployed on aws amplify
        </div>
      </div>
    </>
  );
};

export default Home;
