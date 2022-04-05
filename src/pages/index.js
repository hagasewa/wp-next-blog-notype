import Link from "next/link";
import { Title } from "../components/Title";

export default function Home({ posts,title }) {
  const { nodes } = posts;
  return (
    <div>
      <Title>{title}</Title>
      {nodes.map((post) => {
        return (
          <ul key={post.slug}>
            <li>
              <Link href={`/posts/${post.slug}`}>{post.title}</Link>
            </li>
          </ul>
        );
      })}
    </div>
  );
}

export const getStaticProps = async () => {
  const res = await fetch("https://hagasewa.com/NextJS/graphql", {
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
