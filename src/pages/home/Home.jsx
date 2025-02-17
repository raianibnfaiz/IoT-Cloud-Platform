import React from 'react'
import Banner from './Banner'
import Features from '../Features/Features'
import Menu from '../Menu/Menu'
import Timeline from '../Timeline/Timeline'

const Home = () => {
  return (
      <div className="flex">
        <Menu />
        <div className="flex-1">
          <Banner />
          <Features />
          <Timeline />
        </div>
    </div>
      
  )
}

export default Home