import { useState } from 'react'
import { useRef } from 'react'

import Header from '../../layout/Header/Header'
import SearchFormContainer from './components/SearchFormContainer'
import DriversList from './components/DriversList'
import Description from './components/Description'
import CommentsList from './components/CommentsList'
import Joinus from './components/JoinUsComponent'



export default function HomePage({ville_depart, ville_arrivee, date_depart,type_transport }) {

  const searchform=useRef(null)

  const scrollToSearchForm=()=>{
    searchform.current.scrollIntoView({
      behavior:'smooth'
    })
  }

  return (
    <>
    <Header scrollToSearchForm={scrollToSearchForm} />
    <SearchFormContainer ref={searchform} ville_depart={ville_depart} ville_arrivee={ville_arrivee} date_depart={date_depart} type_transport={type_transport} />
    <DriversList/>
    <Description/>
    <CommentsList/>
    <Joinus/>
    
    
    </>
  )
}

