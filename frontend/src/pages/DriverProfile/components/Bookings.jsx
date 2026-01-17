import { useEffect, useState,useMemo } from "react";
import axios from "axios";
import BookingRequestCard from "./BookingRequestCard";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import '../style/bookings.css'
import UpcomingTripCard from "./UpcomingTripCard";
import CompletedTripCard from "./CompletedTripCard";

const API_URL = import.meta.env.VITE_API_URL;


const fetchrequests = async (id) => {
  try {
   
       let response = await axios.get(`${API_URL}api/livreur/${id}/demands`);
       return response.data;
  
   
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch requests');
  }
};

export default function Bookings(){
    const queryClient = useQueryClient();

    let [filterReq,setFilterReq]=useState('requests')

    const userRetrieved = localStorage.getItem('user');
    const user = userRetrieved ? JSON.parse(userRetrieved) : null;
    const id = user?.userId;

    const {
        data: requestsData,
        isLoading,
        isError,
        error,
        isFetching,
        refetch
      } = useQuery({
        queryKey: ['requests', id], 
        queryFn: () => fetchrequests(id), 
        enabled: !!id, 
      });


        // Actions API
        const handleUpdateStatus = async (demandeId, status) => {
         
            try {
            await axios.put(`${API_URL}api/livreur/${id}/demands/${demandeId}/status`, { status });
             // This forces your "Dashboard Stats" component to refresh its data
            queryClient.invalidateQueries({ queryKey: ['stats', id] });

            refetch(); // On rafraîchit les données depuis le serveur

            } catch (err) {
              alert("Erreur lors de la mise à jour");
            }
         
           
         
        };

        const handleReject = async (demandeId) => {
            try {
                // 1. Mise à jour immédiate du FRONT (UI)
                // On modifie le cache de TanStack Query pour retirer la demande
                queryClient.setQueryData(['requests', id], (oldData) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        demands: oldData.demands.filter(req => req.id !== demandeId)
                    };
                });

                // 2. Appel à la DB en arrière-plan
/*                 await axios.delete(`${API_URL}api/livreur/${id}/demands/${demandeId}`);
 */                
                // Facultatif: refetch pour être sûr d'être synchro à 100%
                refetch(); 

            } catch (err) {
                console.error(err);
                alert("Erreur lors de la suppression");
                refetch(); // En cas d'erreur, on recharge tout pour faire réapparaître l'élément
            }
          };

         
        const filteredList = useMemo(() => {
        if (!requestsData?.demands) return [];
        
        if (filterReq === "requests") {
          
        console.log(requestsData.demands)
          return requestsData.demands.filter(r => r.status === "PENDING");
        } else if (filterReq === "upcoming trips") {
          
        console.log(requestsData.demands)
          return requestsData.demands.filter(r => r.status === "CONFIRMED");
        } else if (filterReq === "completed trips") {
          return requestsData.demands.filter(r => r.status === "COMPLETED");
        }
        return [];
        }, [requestsData, filterReq]);



   

    if (isLoading) return <div className="loading">Loading requests...</div>;

    if (!user) return <div className="error">Please log in to view statistics</div>;
    



  

        


    return (
    <div className="bookings-container">
      <div className="filter-group">
        <select 
          className="request-filter-dropdown"
          value={filterReq}
          onChange={(e) => setFilterReq(e.target.value)}
        >
          <option value="requests">Requests</option>
          <option value="upcoming trips">Upcoming trips</option>
          <option value="completed trips">Completed trips</option>
        </select>
      </div>

      <div className="bookings-list">
        {filteredList.length > 0 ? (
          filteredList.map((req) => {
            // On choisit le design selon l'onglet
            if (filterReq === "requests") {
              return (
                <BookingRequestCard 
                  key={req.id} 
                  req={req} 
                  onAccept={() => handleUpdateStatus(req.id, "CONFIRMED")}
                  onReject={() => handleReject(req.id)}
                />
              );
            }
            if (filterReq === "upcoming trips") {
              return <UpcomingTripCard key={req.id} req={req} onFinish={() => handleUpdateStatus(req.id, "COMPLETED")} />;
            }
            return <CompletedTripCard key={req.id} req={req} />;
          })
        ) : (
          <div className="empty-state">No {filterReq} found.</div>
        )}
      </div>
      
    </div>
   
    
  );
}