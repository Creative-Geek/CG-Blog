import { Article } from "../components/Article";
import { PageTransition } from "~/components/PageTransition";

export default function About() {
  return (
    <PageTransition>
      <title>About Me</title>
      <Article path="Pages/about" />
    </PageTransition>
  );
}
