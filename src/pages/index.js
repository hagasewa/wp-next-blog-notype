import Link from "next/link";
import { BlogList } from "../components/BlogList";
import { Title } from "../components/Title";

const wpApi = process.env.WORDPRESS_GQL;

export default function Home({ posts, title }) {

  const { nodes } = posts;
  return (
    <div>
      <Title>{title}</Title>
      <BlogList nodes={nodes} />
    </div>
  );
}

export const getStaticProps = async () => {
  
  const res = await fetch(wpApi, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `query HomePageQuery {
        posts {
          nodes {
           slug
           title
          }
      }
        allSettings {
        generalSettingsTitle
      }
     }
      `,
    }),
  });

  const json = await res.json();

  const props = {
    props: {
      posts: json.data.posts,
      title: json.data.allSettings.generalSettingsTitle,
    },
  };
  return props;
};
