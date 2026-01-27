import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/Authentication/components/Authprovider'
// Components
import DrPersonalInfo from './components/DrPersonalInfo'
import Stats from '../../components/Stats'
import CitiesComponent from './components/CitiesComponent'
import VehiclesComponent from './components/VehiclesComponent'
import Bookings from './components/Bookings'
import DriverRatings from './components/DriverRatings'
// Icons
import { LayoutDashboard, User, List, Star, LogOut, ChevronLeft, ChevronRight, Truck, MapPin } from 'lucide-react'
// Reuse Client Dashboard Styles for Consistency
import '../../pages/ClientProfile/style/ClientDashboard.css'
import './style/DrPersonalInfo.css'

export default function Driverprofile() {
    const navigate = useNavigate()
    const { logout } = useAuth()
    const [selectedTab, setSelectedTab] = useState('overview')
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    // Sidebar Items Config
    const sidebarItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'myprofile', label: 'My Profile', icon: User },
        { id: 'myrequests', label: 'My Requests', icon: List },
        { id: 'myvehicles', label: 'My Vehicles', icon: Truck },
        { id: 'cities', label: 'Cities', icon: MapPin },
        { id: 'myratings', label: 'My Ratings', icon: Star },
    ]

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <div className="client-dashboard-container">
            {/* --- SIDEBAR --- */}
            <aside className={`dashboard-sidebar ${!isSidebarOpen ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    {isSidebarOpen && <h3>Driver Portal</h3>}
                    <button
                        className="sidebar-toggle-btn"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <button
                                key={item.id}
                                onClick={() => setSelectedTab(item.id)}
                                className={`sidebar-item ${selectedTab === item.id ? 'active' : ''}`}
                                title={!isSidebarOpen ? item.label : ''}
                            >
                                <div className="icon-wrapper"><Icon size={20} /></div>
                                {isSidebarOpen && <span>{item.label}</span>}
                            </button>
                        )
                    })}
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="sidebar-item logout-link" title={!isSidebarOpen ? 'Log Out' : ''}>
                        <div className="icon-wrapper"><LogOut size={20} /></div>
                        {isSidebarOpen && <span>Log Out</span>}
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <main className="dashboard-main-content">
                <div className="content-wrapper">
                    <header className="content-header">
                        <h2>
                            {sidebarItems.find(i => i.id === selectedTab)?.label || 'Dashboard'}
                        </h2>
                    </header>

                    <div className="tab-content">
                        {selectedTab === 'overview' && (
                            <div className="overview-section">
                                <Stats />
                            </div>
                        )}
                        {selectedTab === 'myprofile' && <DrPersonalInfo />}
                        {selectedTab === 'cities' && <CitiesComponent />}
                        {selectedTab === 'myvehicles' && <VehiclesComponent />}
                        {selectedTab === 'myrequests' && <Bookings />}
                        {selectedTab === 'myratings' && <DriverRatings />}
                    </div>
                </div>
            </main>
        </div>
    )
}