import React from 'react'
import styles from './PageTitle.module.css'

export const PageTitle = ({children}) => {
  return (
    <h1 className={styles.title}>{children}</h1>
  )
}
