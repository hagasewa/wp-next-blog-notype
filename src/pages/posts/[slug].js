import { PageContent } from "../../components/PageContent";
import { PageTitle } from "../../components/PageTitle";
import { PageHeader } from "../../components/PageHeader";
import { PowerFlame } from "../../components/PowerFlame";

const wpApi = process.env.WORDPRESS_GQL;

export default function Post(data) {
  const post = data.post;
  const pageHeaderProps = {
    title: data.title,
    nextPost: post.nextPost,
    previousPost: post.previousPost,
  };

  return (
    <div>
      <PowerFlame>
        <PageHeader {...pageHeaderProps} />
        <PageTitle>{post.title}</PageTitle>
        <PageContent>{post.content}</PageContent>
      </PowerFlame>
    </div>
  );
}

export const getStaticProps = async (context) => {
  const res = await fetch(wpApi, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
                query SinglePost($id: ID!, $idType: PostIdType!) {
                    post(id: $id, idType: $idType) {
                      title
                      content
                      slug
                      featuredImage {
                        node {
                          sourceUrl
                        }
                      }
                      nextPost {
                        node {
                          slug
                          title
                        }
                      }
                      previousPost {
                        node {
                          slug
                          title
                        }
                      }
                    }
                    allSettings {
                    generalSettingsTitle
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
      title: json.data.allSettings.generalSettingsTitle,
    },
  };
};

export const getStaticPaths = async () => {
  const res = await fetch(wpApi, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
            query AllPostsQuery {
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
  const posts = json.data.posts.nodes;
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return { paths, fallback: false };
};
