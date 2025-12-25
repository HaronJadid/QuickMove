import { createContext,useContext } from "react";
import { useState } from "react";


export const SearchContext = createContext();


export default function SearchparamsProvider({children}) {
 
  let [ville_depart,setVille_depart]=useState('')
  let [ville_arrivee,setVille_arrivee]=useState('')
  let [date_depart,setDate_depart]=useState('')
  let [type_transport,setType_transport]=useState('')


  return (
    <SearchContext.Provider value={{
     ville_depart,setVille_depart,
     ville_arrivee,setVille_arrivee,
     date_depart,setDate_depart,
     type_transport,setType_transport
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export const useSearchparams = () => useContext(SearchContext);