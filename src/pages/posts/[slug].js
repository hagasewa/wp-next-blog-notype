import Link from "next/link";

export default function Post(data) {
  const post = data.post;

  return (
    <div>
      <h1>{post.title}</h1>
      <article dangerouslySetInnerHTML={{ __html: post.content }}></article>
      <Link href={"/"}>戻る</Link>
    </div>
  );
}

export const getStaticProps = async (context) => {
  const res = await fetch("http://52.194.243.12/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
                query SinglePost($id: ID!, $idType: PostIdType!) {
                    post(id: $id, idType: $idType) {
                        title
                        slug
                        content
                        featuredImage {
                            node {
                                sourceUrl
                            }
                        }
                    }
                }
            `,
      variables: {
        id: context.params.slug,
        idType: "SLUG",
      },
    }),
  });

  const json = await res.json();

  return {
    props: {
      post: json.data.post,
    },
  };
};

export const getStaticPaths = async () => {
  const res = await fetch("http://52.194.243.12/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
            query AllPostsQuery {
                posts {
                    nodes {
                        slug
                        content
                        title
                        featuredImage {
                            node {
                                sourceUrl
                            }
                        }
                    }
                }
            }
        `,
    }),
  });

  const json = await res.json();
  const posts = json.data.posts.nodes;

  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return { paths, fallback: false };
};
