import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getProject } from "@/data/projects";
import PlatformIcons from "@/components/PlatformIcons/PlatformIcons";

const SectionHeading: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <h2 className="text-sm tracking-[0.12em] text-gray-600 dark:text-gray-400">
    {children}
  </h2>
);

// Every band down the page shares the panel's gutters.
const Band: React.FC<{ children?: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <section
    className={`px-6 py-8 sm:px-10 ${className}`}
  >
    {children}
  </section>
);

const NotFound: React.FC = () => (
  <main>
    <Band className="space-y-3">
      <div className="text-lg font-bold text-gray-900 dark:text-white">
        project not found
      </div>
      <Link
        to="/"
        className="text-sm text-blue-700 dark:text-blue-300 generic-hover"
      >
        ← back home
      </Link>
    </Band>
  </main>
);

const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProject(slug) : undefined;

  // Detail pages should open at the top, not wherever the home scroll was.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) return <NotFound />;

  return (
    <main>
      <Band>
        <Link
          to="/"
          className="text-sm text-gray-600 generic-hover dark:text-gray-400"
        >
          ← projects
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {project.title}
          </h1>
          <PlatformIcons platforms={project.platforms} showLabels />
          {project.year && (
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {project.year}
            </span>
          )}
        </div>
        <p className="mt-2 text-base text-gray-800 dark:text-gray-200">
          {project.tagline}
        </p>

        {(project.repo || project.liveLink) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.liveLink && (
              <a
                href={project.liveLink.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-black/15 px-3 py-1.5 text-xs text-gray-800 generic-hover dark:border-white/20 dark:text-gray-200"
              >
                {project.liveLink.label} ↗
              </a>
            )}
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-black/15 px-3 py-1.5 text-xs text-gray-800 generic-hover dark:border-white/20 dark:text-gray-200"
              >
                github ↗
              </a>
            )}
          </div>
        )}
      </Band>

      {project.screenshots.length > 0 && (
        /* A strip you scroll sideways, bled out to the panel's edges so it's
           obvious there's more past the right-hand side. */
        <div className="scrollbar-hidden overflow-x-auto">
          <div className="flex snap-x snap-mandatory gap-4 px-6 pb-8 sm:px-10">
            {project.screenshots.map((shot, i) => (
              <a
                key={i}
                href={shot.src}
                target="_blank"
                rel="noreferrer"
                className="w-auto shrink-0 snap-start"
              >
                <img
                  src={shot.src}
                  alt={shot.caption}
                  loading="lazy"
                  className={`w-auto rounded-md border border-white/10 ${
                    project.wideScreenshots ? "h-56 sm:h-64" : "h-72 sm:h-80"
                  }`}
                />
                <p className="mt-2 max-w-[20rem] text-xs text-gray-400">
                  {shot.caption}
                </p>
              </a>
            ))}
          </div>
        </div>
      )}

      <Band className="space-y-8 text-gray-800 dark:text-gray-200">
        <div>
          <SectionHeading>overview</SectionHeading>
          <div className="mt-3 hyphens-auto space-y-3 text-justify text-base leading-relaxed">
            {project.overview.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        <div>
          <SectionHeading>features</SectionHeading>
          <ul className="mt-3 space-y-2 text-base leading-relaxed">
            {project.features.map((f, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-gray-500 dark:text-gray-400">—</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <SectionHeading>built with</SectionHeading>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.tech.map((t, i) => (
              <span
                key={i}
                className="rounded-full border border-black/15 px-2.5 py-1 text-[11px] dark:border-white/20"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </Band>

    </main>
  );
};

export default ProjectDetail;
