import { useState } from 'react'

import Header from '../../layout/Header'
import SearchFormContainer from './components/SearchFormContainer'
import DriversList from './components/DriversList'
import Description from './components/Description'
import CommentsList from './components/CommentsList'
import Joinus from './components/JoinUsComponent'
import Footer from '../../layout/Footer'

export default function HomePage() {

  return (
    <>
    <Header/>
    <SearchFormContainer/>
    <DriversList/>
    <Description/>
    <CommentsList/>
    <Joinus/>
    <Footer/>
    
    </>
  )
}

