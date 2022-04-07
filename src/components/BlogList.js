import React from 'react'
import Link from "next/link";
import styles from "./BlogList.module.css"

export const BlogList = ({nodes}) => {
  return (
    <>
    {nodes.map((post) => {
      const slug = post.slug
      const title = post.title
      return (
        <ul key={slug} className={styles.ul}>
          <li className={styles.li}>
            <Link href={`/posts/${slug}`} >{title}</Link>
          </li>
        </ul>
      );
    })}
    </>
  )
}
