import React from 'react'
import styles from './PageContent.module.css'
export const PageContent = ({children}) => {
  return (
    <article  className={styles.content} dangerouslySetInnerHTML={{ __html: children }}></article>
  )
}
