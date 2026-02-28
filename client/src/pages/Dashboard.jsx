import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { User, Mail, Phone, Calendar, RefreshCcw, LogOut } from 'lucide-react';
import LeadModal from '../components/LeadModal';

const Dashboard = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedLead, setSelectedLead] = useState(null);
    const navigate = useNavigate();

    // Fetch Leads on Component Load
    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/leads');
            setLeads(response.data);
        } catch (err) {
            setError('Failed to load leads. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Status Update
    const handleStatusChange = async (leadId, newStatus) => {
        try {
            await api.patch(`/admin/leads/${leadId}`, { status: newStatus });

            // Update local state so that changes reflect immediately
            setLeads(prevLeads =>
                prevLeads.map(lead =>
                    lead.id === leadId ? { ...lead, status: newStatus } : lead
                )
            );
        } catch (err) {
            alert('Error updating status');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) return <div className="loading-state">Loading your leads...</div>;

    return (
        <div className="dashboard-container">
            {/* Sidebar Section */}
            <aside className="sidebar">
                <div className="sidebar-top">
                    <h2 className="sidebar-title">Mini CRM</h2>
                    <nav className="sidebar-nav">
                        <p className="nav-label" style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                            MAIN MENU
                        </p>
                        <div className="nav-item active" style={{ color: '#fff', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <User size={18} color="#22d3ee" />
                            Leads
                        </div>
                    </nav>
                </div>

                <button onClick={handleLogout} className="logout-btn">
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </aside>

            {/* Main Content Section */}
            <main className="main-content">
                <header className="dashboard-header">
                    <h1>Leads Management</h1>
                    <button onClick={fetchLeads} className="refresh-btn">
                        <RefreshCcw size={16} />
                        <span>Refresh</span>
                    </button>
                </header>

                {error && <div className="error-banner">{error}</div>}

                <div className="table-wrapper">
                    <table className="leads-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map((lead) => (
                                <tr key={lead.id}>
                                    <td
                                        className="lead-name-cell"
                                        onClick={() => setSelectedLead(lead)}
                                    >
                                        {lead.name}
                                    </td>
                                    <td>{lead.email}</td>
                                    <td>{lead.phone || 'N/A'}</td>
                                    <td>{new Date(lead.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`status-badge badge-${lead.status}`}>
                                            {lead.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            value={lead.status}
                                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                            className="status-dropdown"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <option value="new">New</option>
                                            <option value="contacted">Contacted</option>
                                            <option value="converted">Converted</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Lead Details Modal */}
            {selectedLead && (
                <LeadModal
                    lead={selectedLead}
                    onClose={() => setSelectedLead(null)}
                />
            )}
        </div>
    );
};

export default Dashboard;