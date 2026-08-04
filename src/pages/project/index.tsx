import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getProject } from "@/data/projects";
import PlatformIcons from "@/components/PlatformIcons/PlatformIcons";
import Glass from "@/components/Glass/Glass";

const SectionHeading: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <h2 className="text-xs uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400">
    {children}
  </h2>
);

const NotFound: React.FC = () => (
  <main className="min-h-screen px-4 pt-24 pb-16 sm:px-6 sm:pt-28">
    <Glass
      radius={28}
      tintOpacity={0.38}
      className="mx-auto max-w-[44rem] space-y-3 p-6"
    >
      <div className="text-lg font-bold text-gray-900 dark:text-white">
        project not found
      </div>
      <Link
        to="/"
        className="text-sm text-blue-700 dark:text-blue-300 generic-hover"
      >
        ← back home
      </Link>
    </Glass>
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
    <main className="min-h-screen px-4 pt-24 pb-16 sm:px-6 sm:pt-28">
      {/* Home stays hard left; a detail page is a document, so it gets a centred
          column with the photo showing down both sides. */}
      <div className="mx-auto max-w-[54rem] space-y-4">
        <Link
          to="/"
          className="inline-block px-2 text-xs text-white/85 text-shadow-photo hover:text-white"
        >
          ← projects
        </Link>

        <Glass radius={28} tintOpacity={0.38} className="p-6 sm:p-7">
          <div className="flex flex-wrap items-center gap-3">
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
          <p className="mt-2 max-w-[42rem] text-sm text-gray-800 dark:text-gray-200">
            {project.tagline}
          </p>

          {(project.repo || project.liveLink) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {project.liveLink && (
                <a
                  href={project.liveLink.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-gray-500/40 px-3 py-1.5 text-xs text-gray-800 generic-hover dark:border-gray-300/25 dark:text-gray-200"
                >
                  {project.liveLink.label} ↗
                </a>
              )}
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-gray-500/40 px-3 py-1.5 text-xs text-gray-800 generic-hover dark:border-gray-300/25 dark:text-gray-200"
                >
                  github ↗
                </a>
              )}
            </div>
          )}
        </Glass>

        <Glass
          radius={28}
          tintOpacity={0.38}
          className="space-y-8 p-6 text-gray-800 dark:text-gray-200 sm:p-7"
        >
          <section>
            <SectionHeading>overview</SectionHeading>
            <div className="mt-3 max-w-[42rem] space-y-3 text-sm leading-relaxed">
              {project.overview.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>

          <section>
            <SectionHeading>features</SectionHeading>
            <ul className="mt-3 max-w-[42rem] space-y-2 text-sm leading-relaxed">
              {project.features.map((f, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-gray-500 dark:text-gray-400">—</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <SectionHeading>built with</SectionHeading>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.tech.map((t, i) => (
                <span
                  key={i}
                  className="rounded-full border border-gray-500/35 px-2.5 py-1 text-[11px] dark:border-gray-300/20"
                >
                  {t}
                </span>
              ))}
            </div>
          </section>
        </Glass>

        {project.screenshots.length > 0 && (
          <Glass radius={28} tintOpacity={0.38} className="p-6 sm:p-7">
            <SectionHeading>screenshots</SectionHeading>
            {/* Phone screenshots tile happily four across; landscape desktop ones need
                the room, or every one of them is an unreadable thumbnail. */}
            <div
              className={`mt-3 grid gap-4 ${
                project.wideScreenshots
                  ? "grid-cols-1 lg:grid-cols-2"
                  : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              }`}
            >
              {project.screenshots.map((shot, i) => (
                <a
                  key={i}
                  href={shot.src}
                  target="_blank"
                  rel="noreferrer"
                  className="group block"
                >
                  <img
                    src={shot.src}
                    alt={shot.caption}
                    loading="lazy"
                    className="w-full h-auto rounded-md border border-gray-500/25 transition-transform group-hover:scale-[1.02] dark:border-gray-300/15"
                  />
                  <p className="mt-2 text-[11px] text-gray-700 dark:text-gray-300">
                    {shot.caption}
                  </p>
                </a>
              ))}
            </div>
          </Glass>
        )}
      </div>
    </main>
  );
};

export default ProjectDetail;
