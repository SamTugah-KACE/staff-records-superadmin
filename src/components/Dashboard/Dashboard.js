import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { InfoCardsContainer } from './InfoCard';
import NotificationModal from './Notificationbox';
import OrganizationTable from './OrganizationsTable';
import './InfoCard.css';
import './Notificationbox.css';
import './OrganizationsTable.css';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
// import { blockBackButton } from './historyBlocker';

const Dashboard = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const navigate = useNavigate();

  const API_BASE_URL = 'https://staff-records-backend.onrender.com/api';

   // Call this right AFTER any replace‑style navigation
  const disableBackButton = () => {
    // push a dummy entry so we can trap “popstate”
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = () => {
      // prevent going back
      window.history.go(1);
    };
  };

    // If not logged in, force back to login
  useEffect(() => {
    if (!localStorage.getItem('access_token')) {
      navigate('/', { replace: true });
    }
  }, [navigate]);


  disableBackButton();
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching dashboard data...');
      
      const [orgsResponse, notificationsResponse, statsResponse] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/organizations`),
        axios.get(`${API_BASE_URL}/notifications`),
        axios.get(`${API_BASE_URL}/dashboard/stats`)
      ]);

      // Handle organizations data - RESTORED ORIGINAL LOGIC
      if (orgsResponse.status === 'fulfilled') {
        setOrganizations(orgsResponse.value.data || []);
        console.log('Organizations loaded:', orgsResponse.value.data?.length || 0);
      } else {
        console.error('Failed to fetch organizations:', orgsResponse.reason);
      }

      // Handle notifications data (optional - might not exist yet)
      if (notificationsResponse.status === 'fulfilled') {
        setNotifications(notificationsResponse.value.data || []);
      } else {
        console.warn('Notifications endpoint not available:', notificationsResponse.reason);
        setNotifications([]); // Set empty array as fallback
      }

      // Handle stats data (optional - might not exist yet)
      if (statsResponse.status === 'fulfilled') {
        setDashboardStats(statsResponse.value.data || {});
      } else {
        console.warn('Stats endpoint not available:', statsResponse.reason);
        setDashboardStats({}); // Set empty object as fallback
      }

      // Only set error if organizations failed (since it's the main data)
      if (orgsResponse.status === 'rejected') {
        throw orgsResponse.reason;
      }
      
    } catch (err) {
      console.error('Dashboard API Error:', err);
      
      let errorMessage = 'Failed to fetch dashboard data';
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Server might be starting up - please try again.';
      } else if (err.response) {
        errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'Network error. Please check your connection.';
      } else {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh data (can be called from child components)
  const refreshData = () => {
    fetchDashboardData();
  };

  // Fetch all logos for an organization - moved outside apiMethods for internal use
  const fetchOrgLogos = async (orgId) => {
    try {
      console.log('Fetching logos for organization:', orgId);
      const response = await axios.get(
        `${API_BASE_URL}/organizations/${orgId}/logos`,
      );
      
      console.log('Logos fetched successfully for org', orgId, ':', response.data);
      return response.data || [];
    } catch (err) {
      console.error(`Failed to fetch organization logos for org ${orgId}:`, err);
      
      // Don't throw error for individual logo fetch failures
      // This allows the dashboard to still work even if some logos fail
      if (err.response?.status === 404) {
        console.log(`No logos found for organization ${orgId}`);
        return [];
      }
      
      throw new Error(err.response?.data?.message || err.message || 'Failed to fetch logos');
    }
  };

  // API functions for child components
  const apiMethods = {
    updateOrganization: async (id, data) => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/organizations/${id}`, 
          data,
          { 
            headers: { "Content-Type": "application/json" },
          }
        );
        
        console.log("Organization updated successfully:", response.data);
        
        // Refresh data after successful update
        refreshData();
        return response.data;
      } catch (err) {
        console.error("Update failed:", err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to update organization';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },

    deleteOrganization: async (id) => {
      try {
        await axios.delete(`${API_BASE_URL}/organizations/${id}`, {
        });
        
        console.log("Organization deleted successfully");
        
        // Refresh data after successful deletion
        refreshData();
      } catch (err) {
        console.error("Delete failed:", err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to delete organization';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },

    markNotificationAsRead: async (id) => {
      try {
        await axios.put(`${API_BASE_URL}/notifications/${id}/read`, {}, {
        });
        
        // Update local state immediately for better UX
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === id ? { ...notif, read: true } : notif
          )
        );
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to update notification';
        throw new Error(errorMessage);
      }
    },

    // Fetch all logos for an organization - exposed for child components
    fetchOrgLogos: fetchOrgLogos,

    // Upload logos for an organization
   // In your Dashboard component's apiMethods
uploadLogos: async (orgId, files) => {
  try {
    console.log('Uploading logos for organization:', orgId);
    
    const formData = new FormData();
    files.forEach(file => formData.append('logos', file));

    const response = await axios.post(
      `${API_BASE_URL}/organizations/${orgId}/logos`,
      formData,
      { 
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    
    console.log('Logos uploaded successfully:', response.data);
    
    const uploadedLogos = response.data || [];
    
    // Update the specific organization's logos in state
    setOrganizations(prevOrgs => 
      prevOrgs.map(org => {
        if (org.id === orgId) {
          // Merge existing logos with new ones, avoiding duplicates
          const existingLogos = org.logos || [];
          const newLogos = uploadedLogos.filter(newLogo => 
            !existingLogos.some(existing => existing.id === newLogo.id)
          );
          
          return { 
            ...org, 
            logos: [...existingLogos, ...newLogos]
          };
        }
        return org;
      })
    );

    
    return uploadedLogos;
    
  } catch (err) {
    console.error("Failed to upload logos:", err);
    const errorMessage = err.response?.data?.message || err.message || 'Failed to upload logos';
    throw new Error(errorMessage);
  }
},

    // Set default logo for an organization
    setDefaultLogo: async (orgId, logoId) => {
      try {
        console.log('Setting default logo:', { orgId, logoId });
        
        const response = await axios.get(
          `${API_BASE_URL}/organizations/${orgId}/logos/default`,
          { logoId },
          { 
            headers: { "Content-Type": "application/json" },
          }
        );
        
        console.log('Default logo set successfully:', response.data);
        
        // Refresh organization data to get updated logos
        refreshData();
        
        return response.data;
      } catch (err) {
        console.error("Failed to set default logo:", err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to set default logo';
        throw new Error(errorMessage);
      }
    },

    // Delete a logo
    deleteLogo: async (orgId, logoId) => {
      try {
        console.log('Deleting logo:', { orgId, logoId });
        
        await axios.delete(
          `${API_BASE_URL}/organizations/${orgId}/logos/${logoId}`,
        );
        
        console.log('Logo deleted successfully');
        
        // Refresh organization data to get updated logos
        refreshData();
        
      } catch (err) {
        console.error("Failed to delete logo:", err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to delete logo';
        throw new Error(errorMessage);
      }
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // Show loading state
  if (loading) {
    return (
      <div className={`dashboard-container `}>
        <div className="loading-spinner">Loading dashboard...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={`dashboard-container `}>
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={refreshData}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`dashboard-container `}>
      <main className="dashboard-content"
           style={{
            marginTop: '20px',
            marginBottom: '20px',
            minHeight: 'calc(100vh - 40px)',
            width: '100vw'
          }}>
        <div className="content-wrapper">
          <InfoCardsContainer 
            stats={dashboardStats}
            onRefresh={refreshData}
            organizations={organizations}
          />
                    
          <div className="table-section">
            <OrganizationTable 
              organizations={organizations}
              onUpdate={apiMethods.updateOrganization}
              onDelete={apiMethods.deleteOrganization}
              onRefresh={refreshData}
              onFetchOrgLogos={apiMethods.fetchOrgLogos}
              onUploadLogos={apiMethods.uploadLogos}
              onSetDefaultLogo={apiMethods.setDefaultLogo}
              onDeleteLogo={apiMethods.deleteLogo}
            />
          </div>
        </div>
      </main>
                
      {/* Notification Modal with data and API methods */}
      {showNotifications && (
        <NotificationModal 
          notifications={notifications}
          onClose={toggleNotifications}
          onMarkAsRead={apiMethods.markNotificationAsRead}
        />
      )}
    </div>
  );
};

export default Dashboard;
