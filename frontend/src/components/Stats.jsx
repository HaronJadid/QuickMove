import React, { useEffect } from 'react';
import './style/stats.css'; 
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL;


const fetchStats = async (id,role) => {
  try {
     let response=null
    if(role=='client'){
       response = await axios.get(`${API_URL}api/client/${id}/statistics`);
       return response.data
  }else if(role=='driver'){
       response = await axios.get(`${API_URL}api/livreur/${id}/statistics`);
 
       return response.data.statistics;
  }
   
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch statistics');
  }
};

export default function Stats() {

  const userfetched=localStorage.getItem('user')
  const user=JSON.parse(userfetched)
  let role=user?.role
  let id=user?.userId
  

   const {
    data: stats,
    isLoading,
    isError,
    error,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ['stats', id], // Include id in queryKey for proper caching
    queryFn: () => fetchStats(id,role), // Pass id to the fetch function
    enabled: !!id, // Only run query if id exists
  });

    // Handle loading state
  if (isLoading) return <div className="loading">Loading statistics...</div>;
  
/*   // Handle error state
  if (isError) return <div className="error">Error: {error.message}</div>; */
  
  // Handle case where user is not logged in
  if (!user) return <div className="error">Please log in to view statistics</div>;
  let statistics={}
  if(role=='client'){
    statistics={
    completed:stats.completed||0,
    confirmed:stats.pending||0,
    pending: stats.confirmed||0,
    totalSpent:  stats.totalSpent||0.0
  }
  }else if(role=='driver'){
    statistics={
    totalCompletedTrips:stats.totalCompletedTrips||0,
    averageRatings:stats.averageRatings||0,
    totalPendingTrips: stats.totalPendingTrips||0,
    totalEarnings:  stats.totalEarnings||0
    
  }}
  console.log(statistics)
   
  
  return (
    <div className="dashboard-section">
      
      {/* --- STATS CARDS ROW --- */}
      <div className="stats-grid">
        
        {/* Card 1:   */}
      { role=='client'?
       (<div className="stat-card">
          <span className="stat-label"> Completed Bookings </span>
          <h3 className="stat-value text-red">{statistics.completed}</h3>
        </div>)
        :
        ( <div className="stat-card">
          <span className="stat-label">Total Completed Trips</span>
          <h3 className="stat-value text-red">{statistics.totalCompletedTrips}</h3>
        </div>)}


        {/* Card 2:  */}
       {role=='client'? (<div className="stat-card">
          <span className="stat-label">Pending</span>
          <h3 className="stat-value text-black">{statistics.pending}</h3>
        </div>):
         (<div className="stat-card">
          <span className="stat-label">Average Rating</span>
          <h3 className="stat-value text-black">{statistics.averageRatings}</h3>
        </div>)}

        {/* Card 3:  */}
       {role=='client'?
       ( <div className="stat-card">
          <span className="stat-label">Confirmed</span>
          <h3 className="stat-value text-green">{statistics.confirmed}</h3>
        </div>):
        (<div className="stat-card">
          <span className="stat-label">Total Pending Trips</span>
          <h3 className="stat-value text-green">{statistics.totalPendingTrips}</h3>
        </div>)}

        {/* Card 4: Total Spent */}
       {role=='client'?
        (<div className="stat-card">
          <span className="stat-label">Total Spent</span>
          <h3 className="stat-value text-blue">{statistics.totalSpent} MAD</h3>
        </div>):
       ( <div className="stat-card">
          <span className="stat-label">Total Earnings</span>
          <h3 className="stat-value text-blue">{statistics.totalEarnings} MAD</h3>
        </div>)}

      </div>

      
    </div>
  );
}