import { Badge } from "../ui/badge";

interface SkillCategory {
  category: string;
  skills: string[];
  icon?: string;
}

interface ExperienceSectionProps {
  loading?: boolean;
  skills?: SkillCategory[];
  experience?: Array<{
    title: string;
    company?: string;
    logo?: string;
    date: string;
    description: string;
    link?: string;
  }>;
}

export default function ExperienceSection({
  loading,
  skills,
  experience,
}: ExperienceSectionProps) {
  if (loading) {
    return (
      <section className="container py-16 w-3/4 ml-auto mr-auto">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="h-8 w-48 animate-pulse rounded-md bg-muted mx-auto" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-24 animate-pulse rounded-full bg-muted"
                />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-6 w-64 animate-pulse rounded-md bg-muted" />
                <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />
                <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!skills?.length && !experience?.length) return null;

  return (
    <section className="container py-16 w-3/4 ml-auto mr-auto">
      <div className="space-y-8">
        {skills && skills.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center">
              Skills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((category, categoryIndex) => (
                <div
                  key={categoryIndex}
                  className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold mb-3 text-primary">
                    {category.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <Badge
                        key={skillIndex}
                        variant="secondary"
                        className="text-sm py-1 px-3 hover:bg-primary/10 transition-colors"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {experience && experience.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tighter text-center">
              Experience
            </h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/60 to-transparent"></div>

              <div className="space-y-8">
                {experience.map((job, index) => (
                  <div key={index} className="relative">
                    {/* Timeline dot - positioned at the vertical center of the card */}
                    <div className="absolute left-2 md:left-1/2 md:transform md:-translate-x-1/2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg z-10"></div>

                    {/* Content */}
                    <div
                      className={`ml-12 md:ml-0 md:w-5/12 ${
                        index % 2 === 0
                          ? "md:mr-auto md:pr-8"
                          : "md:ml-auto md:pl-8"
                      }`}
                    >
                      {/* Wrapper for logo overflow */}
                      <div className="relative">
                        {/* Circular logo - half inside, half outside */}
                        {job.logo && (
                          <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-0 z-20">
                            <div className="w-20 h-20 rounded-full border-4 border-background bg-white dark:bg-card shadow-lg overflow-hidden">
                              <img
                                src={job.logo}
                                alt={`${job.company || job.title} logo`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Hide logo container if image fails to load
                                  (
                                    e.target as HTMLImageElement
                                  ).parentElement!.parentElement!.style.display =
                                    "none";
                                }}
                              />
                            </div>
                          </div>
                        )}
                        <div className="bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/20">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                            <div>
                              {job.link ? (
                                <a
                                  href={job.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:opacity-80 transition-opacity"
                                >
                                  <h3 className="text-xl font-semibold text-primary hover:text-primary/80 transition-colors">
                                    {job.title}
                                  </h3>
                                </a>
                              ) : (
                                <h3 className="text-xl font-semibold text-primary">
                                  {job.title}
                                </h3>
                              )}
                              {job.company && (
                                <p className="text-sm italic text-muted-foreground/80 mt-0.5">
                                  {job.company}
                                </p>
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full whitespace-nowrap">
                              {job.date}
                            </span>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">
                            {job.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
