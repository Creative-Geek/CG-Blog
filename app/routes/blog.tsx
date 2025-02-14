import ArticleCard from "../components/articleCard";

export default function Blog() {
  return (
    <>
      {/* <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Blog</h1>
        <p>Welcome to the blog page!</p>
      </div> */}
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h2 className="text-xl font-bold mb-5">Latest Posts</h2>
        <ArticleCard
          title="title"
          description="description"
          image="image"
          date="date"
          author="author"
          path="fontpreviewer"
        />
      </div>
    </>
  );
}
