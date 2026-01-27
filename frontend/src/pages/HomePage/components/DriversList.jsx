import { useEffect, useState } from 'react';
import DriverComponent from "./DriverComponent";
import '../style/DriverComponent.css';
import { useTranslation } from 'react-i18next';
import api from '../../../services/api';

export default function DriversList() {
    const { t } = useTranslation();
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const response = await api.get('/livreur/all');
                // The controller returns { livreurs: [...] }
                if (response.data && response.data.livreurs) {
                    setDrivers(response.data.livreurs);
                }
            } catch (error) {
                console.error("Error fetching drivers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDrivers();
    }, []);

    if (loading) {
        return <div className="text-center p-4">Loading drivers...</div>;
    }

    return (
        <div>
            <div className="text" align='left'>The top rated drivers </div>
            <div className="Driverslist">
                {drivers.length > 0 ? (
                    drivers.map((driver) => (
                        <DriverComponent key={driver.id} driver={driver} />
                    ))
                ) : (
                    <div className="text-gray-500">No drivers found.</div>
                )}
            </div>
        </div>
    )
}