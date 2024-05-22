import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import React from 'react'

const Header = () => {

  return (
    <header>
        <h1>Gym Buddy</h1>
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="post">Post</Link></li>
                <li><Link to="user">Users</Link></li>
            </ul>
        </nav>
    </header>
  )
}

export default Header