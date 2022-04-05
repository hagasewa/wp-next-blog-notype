import React from "react";
import Link from "next/link";
import styles from "./PageHeader.module.css";

export const PageHeader = ({ title,nextPost, previousPost }) => {
  const previousLink = () => {
    const { slug, title } = previousPost.node;
    return <Link href={`/posts/${slug}`}>{title}</Link>;
  };

  const nextLink = () => {
    const { slug, title } = nextPost.node;
    return <Link href={`/posts/${slug}`}>{title}</Link>;
  };
  return (
    <div className={styles.postLinkContainer}>
      <div className={styles.prev}>{previousPost ? previousLink() : null}</div>
      <div className={styles.title}><Link href={"/"}>{title}</Link></div>
      <div className={styles.next}> {nextPost ? nextLink() : null}</div>
    </div>
  );
};
