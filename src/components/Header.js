import { Link } from 'react-router-dom'
import React from 'react'

const Header = () => {

  return (
    <header>
        <h1>Gym Buddy</h1>
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="post">Post</Link></li>
                <li><Link to="tag">Tags</Link></li>
            </ul>
        </nav>
    </header>
  )
}

export default Header