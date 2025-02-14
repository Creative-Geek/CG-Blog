import { useParams } from "react-router-dom";
import { Article } from "../components/Article";

export default function ViewArticle() {
  const { path } = useParams();

  return (
    <>
      <Article path={`Articles/${path}`} />
    </>
  );
}
