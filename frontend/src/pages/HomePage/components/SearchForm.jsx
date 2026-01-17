import React, { useEffect } from 'react';
import '../style/SearchForm.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function SearchForm() {
  let [err,setErr]=useState(false)
  const API_URL = import.meta.env.VITE_API_URL;
  let [villes,setVilles]=useState(null)

  let [ville_depart,setVille_depart]=useState('')
  let [ville_arrivee,setVille_arrivee]=useState('')


     useEffect(()=>{
      let fetchvilles=async()=>{
       const res= await axios.get(`${API_URL}api/ville/`)
        setVilles(res.data.villes)
        console.log(res.data)
        console.log(villes)
        
      }
      fetchvilles()

     },[])

  const navigate = useNavigate()

  const lookup=async(e)=>{
     e.preventDefault();
    setErr(false)

    if(ville_depart&&ville_arrivee){
      localStorage.setItem('ville_depart', ville_depart);
      localStorage.setItem('ville_arrivee', ville_arrivee);
      setVille_depart('')
      setVille_arrivee('')
      navigate('/searchresult')
    }
    else {
      setErr(true)


    }


  }


  return (
    <div className="search-card-container" >
      
      <div className="card-header">
        <div className="header-title">

          <span className="search-icon-red">🔍</span>
          <h2>  Begin searching now</h2>
        </div>
      </div>
    <form onSubmit={lookup}>
      <div className="form-grid">

        <div className="input-group">
          <label align='left'>City of departure  <span className="required">*</span></label>
          <select className="form-input" value={ville_depart} onChange={(event)=>setVille_depart(event.target.value)}>
            <option value="" disabled selected> Choose city of departure  </option>
           {( villes)&& villes.map((ville,index)=>(
              <option  key={index} value={ville.id}>{ville.nom}</option>
            ))}
            

          </select>
        </div>

        <div className="input-group">
          <label align='left'>City of arrival  <span className="required">*</span></label>
          <select className="form-input" value={ville_arrivee} onChange={(event)=>setVille_arrivee(event.target.value)}>
              <option value="" disabled selected> Choose city of arrival  </option>

                {(villes) &&villes.map((ville,index)=>(
              <option  key={index} value={ville.id}>{ville.nom}</option>
            ))}

          </select>
        </div>

      

      </div>

      <button type='submit' className="submit-btn">
            Look up available drivers
        <span className="btn-icon">🔍</span>
      </button>
      </form>
      {err &&<div style={{color:'rgba(215, 130, 144, 1)',textAlign:'center'
      }} >You should specify both cities !!</div>}

    </div>
  );
}