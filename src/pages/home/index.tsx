import React from "react";
import { Link } from "react-router-dom";
import selfie from "../../assets/selfie.webp";
import PlatformIcons from "@/components/PlatformIcons/PlatformIcons";
import { projects } from "@/data/projects";

const Home: React.FC = () => {
  return (
    <main>
      {/* The selfie floats, so the whole intro wraps around it. */}
      <section className="px-6 pt-4 pb-10 sm:px-10">
        <div className="hyphens-auto text-justify text-2xl leading-relaxed text-gray-800 dark:text-gray-200">
          <img
            src={selfie}
            alt="john kwon"
            className="float-left mt-2 mb-4 mr-6 aspect-square w-40 rounded-lg object-cover object-center sm:w-48"
          />
          <p>
            Hi! My name is Jung Ho Kwon (권정호 · 權廷澔), but you can call me
            John. I love finding ways to use my skills as a programmer to make
            life easier for everybody. I first started coding Minecraft plugins
            for servers as a hobby, and it quickly grew into an interest that I
            would later pursue in university (CSUN) as a computer science major.
          </p>
          <p className="mt-3 clear-left">
            I also have a huge passion for music. As a music producer, I have
            collaborated with many artists across all genres (except country),
            all over the world. I am credited on over 60 songs and have a total
            of more than 15 million streams.
          </p>
          <p className="mt-3 clear-left">
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
      </section>

      <section className="px-6 py-8 sm:px-10">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">
          projects
        </h2>
        {/* Two across: four short entries down one side left half the panel empty. */}
        <ul className="mx-auto mt-3 grid w-fit gap-x-12 gap-y-1 sm:grid-cols-2">
          {projects.map((project) => (
            <li key={project.slug}>
              <Link
                to={`/projects/${project.slug}`}
                className="block max-w-[22rem] py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base font-medium text-gray-900 dark:text-white">
                    {project.title}
                  </span>
                  <PlatformIcons platforms={project.platforms} bare />
                  <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                    →
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  {project.tagline}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default Home;
