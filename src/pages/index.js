import Link from "next/link";

export default function Home({ posts }) {
  console.log("posts:", posts);
  const { nodes } = posts;
  return (
    <div>
      <h1>Hellow from the home page</h1>
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
  const res = await fetch("http://52.194.243.12/graphql", {
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
     }
      `,
    }),
  });

  const json = await res.json();

  const props = {
    props: {
      posts: json.data.posts,
    },
  };
  console.log("getStaticProps:props:", props);
  return props;
};
