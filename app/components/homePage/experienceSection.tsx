import { Badge } from "../ui/badge";

interface ExperienceSectionProps {
  loading?: boolean;
  skills?: string[];
  experience?: Array<{
    title: string;
    date: string;
    description: string;
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
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter text-center">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-sm py-1 px-3"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {experience && experience.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter">Experience</h2>
            {experience.map((job, index) => (
              <div key={index} className="space-y-2">
                <h3 className="text-xl font-semibold text-primary">
                  {job.title}
                </h3>
                <p className="text-sm text-muted-foreground">{job.date}</p>
                <p className="text-muted-foreground">{job.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
