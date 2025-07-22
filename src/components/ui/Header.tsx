'use client'

import React, { useEffect } from 'react'
// import { fetchGlobalData } from '../../lib/utils'

const Header: React.FC = () => {
  //   const [navItems, setNavItems] = useState([])

  useEffect(() => {
    // const getNavItems = async () => {
    //   try {
    //     const data = await fetchGlobalData('header')
    //     setNavItems(data.navItems)
    //   } catch (error) {
    //     console.error(error)
    //   }
    // }
    // getNavItems()
  }, [])

  return (
    <header>
      header
      <nav>
        nav
        {/* <ul>
          {navItems.map((item) => (
            <li key={item.label}>
              <a href={item.link}>{item.label}</a>
            </li>
          ))}
        </ul> */}
      </nav>
    </header>
  )
}

export default Header
