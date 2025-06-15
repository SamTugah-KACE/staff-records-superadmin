import React, { useState, useEffect } from 'react';
import './OrganizationsTable.css';
import { FaChevronLeft, FaChevronRight, FaFilter } from 'react-icons/fa';
import LogoModal from '../LogoModal';

const OrganizationTable = ({ 
  organizations = [], 
  isDarkMode = false, 
  onUpdate, 
  loading = false,
  error = null,
  onFetchOrgLogos,
  onUploadLogos,
  onSetDefaultLogo,
  onDeleteLogo 
}) => {
  console.log('OrganizationTable component mounting...');

  // NEW: Local state to track logo updates
  const [localOrganizations, setLocalOrganizations] = useState([]);

  // NEW: Update local organizations when props change
  useEffect(() => {
    setLocalOrganizations(organizations);
  }, [organizations]);

  useEffect(() => {
    console.log('🔍 DEBUGGING ORGANIZATION DATA:');
    console.log('Total organizations:', localOrganizations.length);
    
    if (localOrganizations.length > 0) {
      const firstOrg = localOrganizations[0];
      console.log('First organization structure:', firstOrg);
      console.log('First org keys:', Object.keys(firstOrg));
      console.log('First org logos:', firstOrg.logos);
      console.log('Logos type:', typeof firstOrg.logos);
      console.log('Is logos array?', Array.isArray(firstOrg.logos));
      
      // Check for object logos instead of array
      const orgsWithLogos = localOrganizations.filter(org => 
        org.logos && 
        typeof org.logos === 'object' && 
        Object.keys(org.logos).length > 0
      );
      console.log('Organizations with logos:', orgsWithLogos.length);
      
      if (orgsWithLogos.length > 0) {
        console.log('Sample org with logos:', orgsWithLogos[0]);
        console.log('Sample logos:', orgsWithLogos[0].logos);
      }
    }
  }, [localOrganizations]);

  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [filterText, setFilterText] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [updatingOrgIds, setUpdatingOrgIds] = useState(new Set());

  console.log('OrganizationTable render - organizations:', {
    count: localOrganizations.length,
    sample: localOrganizations.length > 0 ? localOrganizations[0] : null,
    isDarkMode,
    loading,
    error
  });

  // UPDATED: Handle logos updated from LogoModal
  const handleLogosUpdated = async (updatedLogos) => {
    console.log('📝 handleLogosUpdated called with:', updatedLogos);
    
    if (!selectedOrg) {
      console.error('No selected organization');
      return;
    }

    try {
      // Update local state immediately for UI responsiveness
      setLocalOrganizations(prevOrgs => 
        prevOrgs.map(org => 
          org.id === selectedOrg.id 
            ? { ...org, logos: updatedLogos }
            : org
        )
      );

      // If onUpdate function is provided, also update the backend
      if (onUpdate) {
        await onUpdate(selectedOrg.id, { logos: updatedLogos });
        console.log('✅ Logos updated successfully in backend');
      }
    } catch (err) {
      console.error('❌ Failed to update logos:', err);
      
      // Revert local state on error
      setLocalOrganizations(prevOrgs => 
        prevOrgs.map(org => 
          org.id === selectedOrg.id 
            ? { ...org, logos: selectedOrg.logos } 
            : org
        )
      );
      
      // Show error message to user
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          "Failed to update logos";
      alert(errorMessage);
    }
  };

  // Toggle organization active status
  const toggleActive = async (orgId) => {
    if (!onUpdate) {
      console.warn('No onUpdate function provided');
      return;
    }

    const org = localOrganizations.find(o => o.id === orgId);
    if (!org) return;

    const newActiveState = !org.is_active;

    // Add to updating set to show loading state
    setUpdatingOrgIds(prev => new Set(prev).add(orgId));

    try {
      // Update local state immediately
      setLocalOrganizations(prevOrgs => 
        prevOrgs.map(o => 
          o.id === orgId 
            ? { ...o, is_active: newActiveState }
            : o
        )
      );

      // Update backend
      await onUpdate(orgId, { is_active: newActiveState });
      console.log("Organization status updated successfully");
    } catch (err) {
      console.error("Failed to update organization status:", err);
      
      // Revert local state on error
      setLocalOrganizations(prevOrgs => 
        prevOrgs.map(o => 
          o.id === orgId 
            ? { ...o, is_active: org.is_active } // Revert to original
            : o
        )
      );
      
      // Show error message to user
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          "Failed to update organization status";
      
      alert(errorMessage);
    } finally {
      // Remove from updating set
      setUpdatingOrgIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(orgId);
        return newSet;
      });
    }
  };

  // Filtering and sorting logic - using localOrganizations
  const filteredOrganisations = localOrganizations.filter(org => {
    const searchTerm = filterText.toLowerCase();
    const matches =
      (org.organization_name?.toLowerCase() || '').includes(searchTerm) ||
      (org.access_url?.toLowerCase() || '').includes(searchTerm) ||
      (org.org_type?.toLowerCase() || '').includes(searchTerm) ||
      (org.nature?.toLowerCase() || '').includes(searchTerm);
    
    return matches;
  });

  const sortedOrganisations = [...filteredOrganisations].sort((a, b) => {
    let aValue, bValue;
    
    switch(sortBy) {
      case 'name':
        aValue = a.organization_name || '';
        bValue = b.organization_name || '';
        break;
      case 'access_url':
        aValue = a.access_url || '';
        bValue = b.access_url || '';
        break;
      case 'type':
        aValue = a.org_type || '';
        bValue = b.org_type || '';
        break;
      case 'nature':
        aValue = a.nature || '';
        bValue = b.nature || '';
        break;
      default:
        aValue = a.organization_name || '';
        bValue = b.organization_name || '';
    }
    
    return aValue.toLowerCase().localeCompare(bValue.toLowerCase());
  });
  
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = sortedOrganisations.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(sortedOrganisations.length / rowsPerPage);

  // Pagination functions
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterText]);

  // UPDATED: Enhanced renderLogos function with better object handling
  const renderLogos = (logos) => {
    console.log('🖼️ Rendering logos:', logos);
    
    // Check if logos is an object with properties
    if (logos && typeof logos === 'object' && !Array.isArray(logos)) {
      const logoEntries = Object.entries(logos);
      console.log('🖼️ Logo entries found:', logoEntries.length);
      
      if (logoEntries.length > 0) {
        const logosToShow = logoEntries.slice(0, 2);
        
        return (
          <>
            {logosToShow.map(([logoId, logoData]) => {
              const logoUrl = typeof logoData === 'string' ? logoData : logoData?.url;
              const logoName = typeof logoData === 'object' ? logoData?.name : logoId;
              
              return (
                <img 
                  key={logoId}
                  src={logoUrl} 
                  alt={`Logo ${logoName || logoId}`} 
                  className="org-logo"
                  onError={(e) => {
                    console.error('🖼️ Logo failed to load:', logoUrl);
                    e.target.style.display = 'none';
                  }}
                  onLoad={() => {
                    console.log('🖼️ Logo loaded successfully:', logoUrl);
                  }}
                />
              );
            })}
            
          </>
        );
      }
    }
    
    // Fallback for array format (in case data structure changes)
    if (Array.isArray(logos)) {
      const validLogos = logos.filter(logo => logo?.url && logo.url !== '○');
      console.log('🖼️ Valid array logos found:', validLogos.length);
      
      if (validLogos.length > 0) {
        const logosToShow = validLogos.slice(0, 2);
        
        return (
          <>
            {logosToShow.map(logo => (
              <img 
                key={logo.id || logo.url} 
                src={logo.url} 
                alt="Organization logo" 
                className="org-logo"
                onError={(e) => {
                  console.error('🖼️ Logo failed to load:', logo.url);
                  e.target.style.display = 'none';
                }}
                onLoad={() => {
                  console.log('🖼️ Logo loaded successfully:', logo.url);
                }}
              />
            ))}
            
          </>
        );
      }
    }
    
    return <div className="logo-placeholder">○</div>;
  };

  // Loading state
  if (loading) {
    return (
      <div className={`container ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="loading-container" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          fontSize: '18px'
        }}>
          <div>
            <p>Loading organizations...</p>
            <p style={{ fontSize: '14px', color: '#666' }}>
              This may take a moment if the server is starting up
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`container ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="error-container" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          color: '#e74c3c',
          textAlign: 'center',
          padding: '20px'
        }}>
          <h3>Unable to Load Organizations</h3>
          <p style={{ marginBottom: '15px' }}>{error}</p>
          
          <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
            Check your internet connection and try again
          </p>
        </div>
      </div>
    );
  }

  console.log('Rendering table with', currentRows.length, 'rows');

  return (
    <div className={`container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="table-header">
        <h1 className="title">Registered Organisations</h1>
      </div>

      <div className="filter-container">
        <div className="filter-input-wrapper">
          <input
            type="text"
            placeholder="Filter organisations..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="filter-input"
          />
          <FaFilter className="filter-icon" />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="name">Sort by Name</option>
          <option value="access_url">Sort by Domain</option>
          <option value="type">Sort by Subscription Plan</option>
          <option value="nature">Sort by Nature</option>
        </select>
      </div>

      <table className="org-table">
        <thead>
          <tr>
            <th>Organisation Name</th>
            <th>Domain</th>
            <th>Type</th>
            <th>Nature</th>
            <th>Status</th>
            <th>Logos</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.length > 0 ? (
            currentRows.map((org) => {
              const isUpdating = updatingOrgIds.has(org.id);
              
              return (
                <tr key={org.id} className={isUpdating ? 'updating' : ''}>
                  <td title={org.organization_name || org.name}>
                    {org.organization_name || org.name}
                  </td>
                  <td title={org.access_url}>{org.access_url}</td>
                  <td title={org.org_type || org.type}>
                    {org.org_type || org.type || 'N/A'}
                  </td>
                  <td title={org.nature}>
                    {org.nature}
                  </td>
                  <td>
                    <span className={`status-badge ${org.is_active ? 'active' : 'inactive'}`}>
                      {org.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div 
                      className="clickable-logo" 
                      onClick={() => {
                        console.log('🖼️ Logo cell clicked for org:', org);
                        console.log('🖼️ Org logos:', org.logos);
                        setSelectedOrg(org);
                        setLogoModalOpen(true);
                      }}
                    >
                      {renderLogos(org.logos)}
                    </div>
                  </td>
                  <td>
                    <div className="actions-container">
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={org.is_active || false}
                          onChange={() => toggleActive(org.id)}
                          disabled={isUpdating || !onUpdate}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                      
                      {isUpdating && (
                        <div className="updating-spinner">⏳</div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7" className="no-results">
                {organizations.length === 0 ? 'No organizations found' : 'No matching results'}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 0 && (
        <div className="pagination-controls">
          <button 
            onClick={prevPage} 
            disabled={currentPage === 1}
            className="pagination-button"
          >
            <FaChevronLeft />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`page-number ${currentPage === page ? 'active' : ''}`}
            >
              {page}
            </button>
          ))}
          <button 
            onClick={nextPage} 
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            <FaChevronRight />
          </button>
        </div>
      )}

      {logoModalOpen && selectedOrg && (
        <LogoModal
          orgId={selectedOrg.id}
          isOpen={logoModalOpen}
          onClose={() => setLogoModalOpen(false)}
          initialLogos={selectedOrg.logos || []}
          onLogosUpdated={handleLogosUpdated}
          isDarkMode={isDarkMode}
          onFetchOrgLogos={onFetchOrgLogos}          
          onUploadLogos={onUploadLogos}
          onSetDefaultLogo={onSetDefaultLogo}
          onDeleteLogo={onDeleteLogo}
        />
      )}
    </div>
  );
};

export default OrganizationTable;