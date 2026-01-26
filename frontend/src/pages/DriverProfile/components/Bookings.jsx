import { toast } from 'react-toastify';
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import BookingRequestCard from "./BookingRequestCard";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Inbox } from 'lucide-react';
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

export default function Bookings() {
  const queryClient = useQueryClient();

  let [filterReq, setFilterReq] = useState('requests')

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

      if (status === "CONFIRMED") {
        toast.success("Booking accepted successfully!");
      } else if (status === "COMPLETED") {
        toast.success("Trip marked as completed!");
      } else {
        toast.success(`Status updated to ${status}`);
      }

    } catch (err) {
      toast.error("Error updating status");
      console.error(err);
    }



  };

  const handleReject = async (demandeId) => {
    try {
      // Call the API to update status to REJECTED
      await axios.put(`${API_URL}api/livreur/${id}/demands/${demandeId}/status`, { status: "REJECTED" });

      // Invalidate stats to reflect changes
      queryClient.invalidateQueries({ queryKey: ['stats', id] });

      // Refetch requests to update the list (item will disappear from 'requests' tab)
      refetch();
      toast.success("Booking rejected");

    } catch (err) {
      console.error(err);
      toast.error("Error rejecting booking");
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
          <div className="empty-state-container">
            <div className="empty-state-icon-wrapper">
              <Inbox size={48} strokeWidth={1.5} />
            </div>
            <h3>No {filterReq} found</h3>
            <p>Your list is currently empty. Check back later!</p>
          </div>
        )}
      </div>

    </div>


  );
}