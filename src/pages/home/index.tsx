import React from "react";
import { Link } from "react-router-dom";
import selfie from "../../assets/selfie.webp";
import RandomGreetingButton from "@/components/RandomGreetingButton/RandomGreetingButton";
import PlatformIcons from "@/components/PlatformIcons/PlatformIcons";
import Glass from "@/components/Glass/Glass";
import { projects } from "@/data/projects";

const Home: React.FC = () => {
  return (
    <main className="min-h-screen px-4 pt-24 pb-16 sm:px-6 sm:pt-28">
      <div className="max-w-[44rem] space-y-4">
        <Glass radius={28} tintOpacity={0.38} className="p-6 sm:p-7">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            <RandomGreetingButton />
          </div>

          {/* The selfie floats, so the whole intro wraps around it rather than
              sitting in a column beside it. */}
          <div className="mt-4 text-sm leading-relaxed text-gray-800 dark:text-gray-200">
            <img
              src={selfie}
              alt="john kwon"
              className="float-left mb-2 mr-4 w-24 rounded-lg sm:w-28"
            />
            <p>
              Hi! My name is Jung Ho Kwon, but you can call me John. I love
              finding ways to use my skills as a programmer to make life easier
              for everybody. I first started coding Minecraft plugins for servers
              as a hobby, and it quickly grew into an interest that I would later
              pursue in university (CSUN) as a computer science major.
            </p>
            <p className="mt-3">
              I also have a huge passion for music. As a music producer, I have
              collaborated with many artists across all genres (except country),
              all over the world. I am credited on over 60 songs and have a total
              of more than 15 million streams.
            </p>
            <p className="mt-3">
              Feel free to reach out to me at{" "}
              <a
                className="text-blue-700 dark:text-blue-300 generic-hover underline underline-offset-2"
                href="mailto:sk.johnkwon@gmail.com"
              >
                sk.johnkwon@gmail.com
              </a>
              ! Currently, I am working as a software engineer at Mogul, a
              platform that helps artists understand their revenue and earn them
              more money.{" "}
              <a
                className="text-blue-700 dark:text-blue-300 generic-hover underline underline-offset-2"
                target="_blank"
                rel="noreferrer"
                href="https://usemogul.com/"
              >
                Check it out here
              </a>
              !
            </p>
          </div>
        </Glass>

        <Glass radius={28} tintOpacity={0.38} className="p-6 sm:p-7">
          <h2 className="text-xs uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400">
            projects
          </h2>
          <ul className="mt-3 border-t border-gray-500/25 dark:border-gray-300/15">
            {projects.map((project) => (
              <li
                key={project.slug}
                className="border-b border-gray-500/25 dark:border-gray-300/15"
              >
                <Link
                  to={`/projects/${project.slug}`}
                  className="group block py-3"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300">
                      {project.title}
                    </span>
                    <PlatformIcons platforms={project.platforms} bare />
                    <span className="ml-auto text-xs text-gray-500 transition-opacity dark:text-gray-400 sm:opacity-0 sm:group-hover:opacity-100">
                      →
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-700 dark:text-gray-300">
                    {project.tagline}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </Glass>

        <a
          href="https://github.com/skjohnkwon/johnkwon.net"
          target="_blank"
          rel="noreferrer"
          className="block px-2 text-[11px] text-white/80 text-shadow-photo hover:cursor-zoom-in hover:text-white"
        >
          vite + react + typescript + tailwindcss + shadcn/ui deployed on aws
          amplify
        </a>
      </div>
    </main>
  );
};

export default Home;
