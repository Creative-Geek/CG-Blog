import { Badge } from "../ui/badge";

interface SkillCategory {
  name: string;
  skills: string[];
  icon?: string;
}

interface ExperienceSectionProps {
  loading?: boolean;
  skills?: string[] | SkillCategory[];
  experience?: Array<{
    title: string;
    date: string;
    description: string;
    link?: string;
  }>;
}

// Helper function to auto-categorize skills if they're provided as a flat array
function categorizeSkills(skills: string[]): SkillCategory[] {
  const categories: { [key: string]: string[] } = {
    Frontend: [],
    Backend: [],
    Design: [],
    Tools: [],
    Other: [],
  };

  const categoryMappings: { [key: string]: string } = {
    // Frontend
    JavaScript: "Frontend",
    React: "Frontend",
    Vue: "Frontend",
    Angular: "Frontend",
    HTML: "Frontend",
    CSS: "Frontend",
    TypeScript: "Frontend",
    "Next.js": "Frontend",
    Svelte: "Frontend",

    // Backend
    "Node.js": "Backend",
    Nodejs: "Backend",
    Python: "Backend",
    Flask: "Backend",
    Django: "Backend",
    Express: "Backend",
    PHP: "Backend",
    Java: "Backend",
    "C#": "Backend",
    Ruby: "Backend",
    Go: "Backend",

    // Design
    "UI/UX": "Design",
    "Web Design": "Design",
    "Graphic Design": "Design",
    Figma: "Design",
    "Adobe XD": "Design",
    Photoshop: "Design",
    Illustrator: "Design",
    "After Effects": "Design",
    "Premiere Pro": "Design",

    // Tools
    Git: "Tools",
    Docker: "Tools",
    AWS: "Tools",
    Firebase: "Tools",
    MongoDB: "Tools",
    PostgreSQL: "Tools",
    MySQL: "Tools",
    WordPress: "Tools",
    Linux: "Tools",
  };

  skills.forEach((skill) => {
    const category = categoryMappings[skill] || "Other";
    categories[category].push(skill);
  });

  // Filter out empty categories and return as SkillCategory array
  return Object.entries(categories)
    .filter(([_, skills]) => skills.length > 0)
    .map(([name, skills]) => ({ name, skills }));
}

function isSkillCategoryArray(
  skills: string[] | SkillCategory[]
): skills is SkillCategory[] {
  return (
    skills.length > 0 && typeof skills[0] === "object" && "name" in skills[0]
  );
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
            {(() => {
              const skillCategories = isSkillCategoryArray(skills)
                ? skills
                : categorizeSkills(skills);

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {skillCategories.map((category, categoryIndex) => (
                    <div
                      key={categoryIndex}
                      className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <h3 className="text-lg font-semibold mb-3 text-accent-primary">
                        {category.name}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {category.skills.map((skill, skillIndex) => (
                          <Badge
                            key={skillIndex}
                            variant="secondary"
                            className="text-sm py-1 px-3 hover:bg-accent-primary/10 transition-colors"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {experience && experience.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tighter text-center">
              Experience
            </h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-primary via-accent-secondary to-transparent"></div>

              <div className="space-y-8">
                {experience.map((job, index) => (
                  <div key={index} className="relative">
                    {/* Timeline dot */}
                    <div className="absolute left-2 md:left-1/2 md:transform md:-translate-x-1/2 w-4 h-4 bg-accent-primary rounded-full border-4 border-background shadow-lg z-10"></div>

                    {/* Content */}
                    <div
                      className={`ml-12 md:ml-0 md:w-5/12 ${
                        index % 2 === 0
                          ? "md:mr-auto md:pr-8"
                          : "md:ml-auto md:pl-8"
                      }`}
                    >
                      <div className="bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-accent-primary/20">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                          {job.link ? (
                            <a
                              href={job.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:opacity-80 transition-opacity"
                            >
                              <h3 className="text-xl font-semibold text-accent-primary hover:text-accent-hover transition-colors">
                                {job.title}
                              </h3>
                            </a>
                          ) : (
                            <h3 className="text-xl font-semibold text-accent-primary">
                              {job.title}
                            </h3>
                          )}
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
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
