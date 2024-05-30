import { Link } from 'react-router-dom'
import React from 'react'
import styles from './header.module.css'

const Header = () => {

  return (
    <header >
      
        <h1 className={styles.title}>GYM BUDDY</h1>
        <nav>
            <ul className={styles.menuItems}>
                <li><Link to="/">Home</Link></li>
                <li><Link to="post">Post</Link></li>
                <li><Link to="tag">Tags</Link></li>
            </ul>
        </nav>    
    </header>
  )
}

export default Header