import { Article } from "../components/Article";

const sampleMarkdown = `
## About Me

I'm a passionate developer who loves to create and share knowledge.

### What I Do

- Write technical articles
- Create tutorials
- Share coding tips
- Build awesome projects

هذه تجربة لدعم اللغة العربية Arabic في المارك داون

### My Tech Stack

- React
- TypeScript
- Node.js
- And many more!

Feel free to [connect with me](https://github.com) on GitHub.
`;

export default function About() {
  return (
    <Article
      title="About Creative Geek"
      content={sampleMarkdown}
      image="https://picsum.photos/800/400"
      description="A creative developer passionate about building amazing web experiences"
      author="John Doe"
      date="February 13, 2024"
    />
  );
}
