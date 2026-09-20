import React from "react";
import { Link } from "react-router-dom";
import selfie from "../../assets/selfie.webp";
import PlatformIcons from "@/components/PlatformIcons/PlatformIcons";
import { projects } from "@/data/projects";

const Home: React.FC = () => {
  return (
    <main>
      {/* Two distinct columns, not text wrapped around a thumbnail: the photo
          takes a third and stretches to whatever height the text needs. */}
      <section className="px-6 pt-4 pb-10 sm:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-stretch">
          {/* Square, sized off its own width rather than stretched to the row —
              a stretched box with only an absolute child collapses to nothing. */}
          <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-lg sm:w-52 sm:self-center">
            <img
              src={selfie}
              alt="john kwon"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </div>
          <div className="flex-1 hyphens-auto text-justify text-base leading-relaxed text-gray-800 sm:self-center dark:text-gray-200">
            <p>
              Hi! My name is Jung Ho Kwon (권정호 · 權廷澔), but you can call me
              John. I love finding ways to use my skills as a programmer to make
              life easier for everybody. I first started coding Minecraft plugins
              for servers as a hobby, and it quickly grew into an interest that I
              would later pursue in university (CSUN) as a computer science
              major.
            </p>
            <p className="mt-3">
              I also have a huge passion for music. As a music producer, I have
              collaborated with many artists across all genres (except
              country), all over the world. I am credited on over 60 songs and
              have a total of more than 15 million streams.
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
              platform that helps artists understand their revenue and earn
              them more money.{" "}
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
                className="group block max-w-[22rem] py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base font-medium text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300">
                    {project.title}
                  </span>
                  <PlatformIcons platforms={project.platforms} bare />
                  <span className="ml-auto text-xs text-gray-500 transition-opacity dark:text-gray-400 sm:opacity-0 sm:group-hover:opacity-100">
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
