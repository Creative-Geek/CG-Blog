interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
}

export default function ProjectCard({ title, description, image }: ProjectCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-[1.02]">
      <div className="h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600">{description}</p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          onClick={() => alert('View Project details coming soon!')}
        >
          View Project
        </button>
      </div>
    </div>
  );
}
