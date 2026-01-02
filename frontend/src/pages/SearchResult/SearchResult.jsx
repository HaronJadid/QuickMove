import DriversAvailable from './components/DriversAvailable'
import './style/sr.css'
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function SearchResult(){
    const API_URL = import.meta.env.VITE_API_URL;

    const userRetrieved = localStorage.getItem('user');
    const userParsed = userRetrieved ? JSON.parse(userRetrieved) : null;
    const id = userParsed?.userId;
    
    let ville_depart= localStorage.getItem('ville_depart')
    let ville_arrivee=localStorage.getItem('ville_arrivee')

  
    let [livreurs,setLivreurs]=useState([])

    useEffect(()=>{
    const getlivreurs=async()=>{
    try{
        
    const dep_res=await axios.get(`${API_URL}api/livreur?ville=${ville_depart}`)
    const v_dep=dep_res.data.livreurs || [];
    const arr_res=await axios.get(`${API_URL}api/livreur?ville=${ville_arrivee}`)
    const v_arr=arr_res.data.livreurs || [];
   

    const commoncities = v_dep.filter(v_dep_city => 
    v_arr.some(v_arr_city => v_arr_city.id === v_dep_city.id));

    console.log(commoncities)
    setLivreurs(commoncities)

    }catch(err){
        console.error('Error fetching drivers',err)
    }


    }
    getlivreurs()
    },[ville_depart, ville_arrivee, API_URL])

    if(!livreurs){
    return <div style={{
        fontSize:'10px',
        color:'grey'
    }}>لا يوجد سائق يعمل في المدن المحددة !</div>
    }



        

    return(
        <div className="container">

            <div className='text'>
              :  نتائج البحث 
            </div>
            <div>
                {livreurs.map((livreur,index)=>
                  <DriversAvailable driver={livreur} />
                )}
            </div>
            
    
        </div>
    )
}