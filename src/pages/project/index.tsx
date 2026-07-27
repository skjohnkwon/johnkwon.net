import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getProject } from "@/data/projects";
import PlatformIcons from "@/components/PlatformIcons/PlatformIcons";

const NotFound: React.FC = () => (
  <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 dark:text-white">
    <div className="flex flex-col items-center justify-center flex-grow pt-28 space-y-4">
      <div className="text-xl font-bold">project not found</div>
      <Link to="/" className="text-blue-500 generic-hover">
        ← back home
      </Link>
    </div>
  </div>
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
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 dark:text-white">
      <div className="flex flex-col items-center flex-grow pt-28 pb-16">
        <div className="w-[80vw] xl:w-[1100px] min-w-[320px] space-y-4">
          {/* Back link */}
          <Link
            to="/"
            className="inline-block text-sm text-blue-500 dark:text-blue-300 generic-hover"
          >
            ← projects
          </Link>

          {/* Header */}
          <div className="border dark:border-gray-700 rounded-lg p-6">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold">{project.title}</h1>
              <PlatformIcons platforms={project.platforms} showLabels />
              {project.year && (
                <span className="text-sm text-gray-400">{project.year}</span>
              )}
            </div>
            <p className="mt-2 text-gray-500 dark:text-gray-300">
              {project.tagline}
            </p>

            {/* Links */}
            {(project.repo || project.liveLink) && (
              <div className="mt-4 flex flex-wrap gap-3">
                {project.liveLink && (
                  <a
                    href={project.liveLink.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 generic-hover"
                  >
                    {project.liveLink.label} ↗
                  </a>
                )}
                {project.repo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 generic-hover"
                  >
                    github ↗
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Overview + features/tech */}
          <div className="flex flex-col xl:flex-row gap-4">
            <div className="border dark:border-gray-700 rounded-lg p-6 xl:flex-grow space-y-4">
              <div className="text-lg font-bold">overview</div>
              {project.overview.map((para, i) => (
                <p key={i} className="text-gray-600 dark:text-gray-300">
                  {para}
                </p>
              ))}

              <div className="text-lg font-bold pt-2">features</div>
              <ul className="space-y-2">
                {project.features.map((f, i) => (
                  <li
                    key={i}
                    className="text-gray-600 dark:text-gray-300 flex gap-2"
                  >
                    <span className="text-blue-500 dark:text-blue-300">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border dark:border-gray-700 rounded-lg p-6 xl:w-[280px] xl:flex-shrink-0 h-fit">
              <div className="text-lg font-bold mb-3">built with</div>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Screenshots */}
          {project.screenshots.length > 0 && (
            <div className="border dark:border-gray-700 rounded-lg p-6">
              <div className="text-lg font-bold mb-4">screenshots</div>
              {/* Phone screenshots tile happily four across; landscape desktop ones need
                  the room, or every one of them is an unreadable thumbnail. */}
              <div
                className={
                  project.wideScreenshots
                    ? "grid grid-cols-1 lg:grid-cols-2 gap-4"
                    : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                }
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
                      className="w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700 group-hover:scale-[1.02] transition-transform"
                    />
                    <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
                      {shot.caption}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
