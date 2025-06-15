import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaUpload, FaTrash, FaStar, FaCheck, FaEdit } from 'react-icons/fa';
import './LogoModal.css';

const LogoModal = ({ 
  isOpen, 
  onClose,
  initialLogos = {}, 
  onLogosUpdated, // NEW: Callback to update parent component
  isDarkMode = false
}) => {
  const [selectedLogos, setSelectedLogos] = useState({});
  const [defaultLogoId, setDefaultLogoId] = useState(null);
  const [allLogos, setAllLogos] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const changeLogoInputRef = useRef(null);
  const [changingLogoId, setChangingLogoId] = useState(null);

  // Helper function to convert logos object to array for easier processing
  const logosToArray = (logosObj) => {
    if (!logosObj || typeof logosObj !== 'object') return [];
    return Object.entries(logosObj).map(([id, logo]) => ({
      id,
      ...(typeof logo === 'string' ? { url: logo } : logo)
    }));
  };

  // Helper function to convert logos array back to object
  const logosToObject = (logosArray = []) => {
    return logosArray.reduce((obj, logo) => {
      const { id, ...logoData } = logo;
      obj[id] = logoData;
      return obj;
    }, {});
  };

  // Initialize logos when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log('🔄 LogoModal initializing with:', initialLogos);
      
      // Handle both object and array formats
      let logosArray = [];
      if (Array.isArray(initialLogos)) {
        logosArray = initialLogos.filter(logo => logo?.url && logo.url !== '○');
      } else if (initialLogos && typeof initialLogos === 'object') {
        logosArray = logosToArray(initialLogos).filter(logo => logo?.url && logo.url !== '○');
      }
      
      console.log('🔄 Processed logos array:', logosArray);
      
      // Convert back to object format for selectedLogos
      const validLogosObj = logosToObject(logosArray);
      setSelectedLogos(validLogosObj);
      
      // Set default logo if one exists
      const defaultLogo = logosArray.find(logo => logo.isDefault);
      setDefaultLogoId(defaultLogo?.id || null);
      
      // Initialize allLogos with current logos
      setAllLogos(typeof initialLogos === 'object' && !Array.isArray(initialLogos) ? initialLogos : validLogosObj);
    }
  }, [isOpen, initialLogos]);

  if (!isOpen) return null;

  // Handle file upload (local only)
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      
      if (!isValidType) {
        alert(`${file.name} is not a valid image file`);
        return false;
      }
      if (!isValidSize) {
        alert(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setIsUploading(true);

    // Create local URLs for the uploaded files
      const newLogos = {};
      validFiles.forEach((file, index) => {
        const id = `local-${Date.now()}-${index}`;
        const url = URL.createObjectURL(file);
        newLogos[id] = {
          url,
          name: file.name,
          type: file.type,
          size: file.size,
          isDefault: false
        };
      });

      // Update state with new logos
      setAllLogos(prev => ({ ...prev, ...newLogos }));
      
      // Auto-select new logos if under the limit
      setSelectedLogos(prev => {
        const currentSelected = Object.keys(prev).length;
        const canSelect = Math.min(Object.keys(newLogos).length, 3 - currentSelected);
        
        if (canSelect > 0) {
          const logosToSelect = Object.entries(newLogos).slice(0, canSelect);
          const selectedNewLogos = Object.fromEntries(logosToSelect);
          return { ...prev, ...selectedNewLogos };
        }
        
        return prev;
      });
      
      setIsUploading(false);

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
  };

  // Handle changing a specific logo
  const handleChangeLogo = (logoId) => {
    setChangingLogoId(logoId);
    changeLogoInputRef.current?.click();
  };

  // Handle the file change for replacing a logo
  const handleChangeLogoFile = (e) => {
    const file = e.target.files[0];
    if (!file || !changingLogoId) return;

    // Validate file
    const isValidType = file.type.startsWith('image/');
    const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
    
    if (!isValidType) {
      alert(`${file.name} is not a valid image file`);
      return;
    }
    if (!isValidSize) {
      alert(`${file.name} is too large. Maximum size is 5MB`);
      return;
    }

    // Create new URL and update the specific logo
    const url = URL.createObjectURL(file);
    
    setAllLogos(prev => ({
      ...prev,
      [changingLogoId]: {
        ...prev[changingLogoId],
        url,
        name: file.name,
        type: file.type,
        size: file.size
      }
    }));

    // Update selectedLogos if this logo was selected
    setSelectedLogos(prev => {
      if (changingLogoId in prev) {
        return {
          ...prev,
          [changingLogoId]: {
            ...prev[changingLogoId],
            url,
            name: file.name,
            type: file.type,
            size: file.size
          }
        };
      }
      return prev;
    });

    // Clear the input and reset changing logo ID
    if (changeLogoInputRef.current) {
      changeLogoInputRef.current.value = '';
    }
    setChangingLogoId(null);
  };

  // Set default logo (toggle functionality)
  const handleSetDefault = (logoId) => {
    if (defaultLogoId === logoId) {
      // Unset default if clicking on the already default logo
      setDefaultLogoId(null);
      setAllLogos(prev => {
        const updated = { ...prev };
        updated[logoId] = {
          ...updated[logoId],
          isDefault: false
        };
        return updated;
      });
    } else {
      // Set new default
      setDefaultLogoId(logoId);
      setAllLogos(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(id => {
          updated[id] = {
            ...updated[id],
            isDefault: id === logoId
          };
        });
        return updated;
      });
    }
  };

  // Remove logo
  const handleRemoveLogo = (logoId) => {
    if (logoId === defaultLogoId) {
      alert("Cannot remove the default logo! Please unset it as default first.");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this logo? This action cannot be undone.");
    if (!confirmDelete) return;

    // Update local state - remove from both allLogos and selectedLogos
    setAllLogos(prev => {
      const updated = { ...prev };
      delete updated[logoId];
      return updated;
    });
    
    setSelectedLogos(prev => {
      const updated = { ...prev };
      delete updated[logoId];
      return updated;
    });
  };

  // Toggle logo selection for table display (max 2)
  const toggleLogoSelection = (logoId, logoData) => {
    setSelectedLogos(prev => {
      const isSelected = logoId in prev;
      const selectedCount = Object.keys(prev).length;
      
      if (isSelected) {
        // Remove from selection
        const updated = { ...prev };
        delete updated[logoId];
        return updated;
      } else {
        // Add to selection (max 2)
        if (selectedCount >= 2) {
          alert("You can only select up to 2 logos for table display");
          return prev;
        }
        return { ...prev, [logoId]: logoData };
      }
    });
  };

  // UPDATED: Handle save - send selected logos back to parent
  const handleSave = () => {
    console.log('💾 Saving logos:', selectedLogos);
    
    if (onLogosUpdated) {
      // Send the selected logos back to the parent component
      onLogosUpdated(selectedLogos);
    }
    
    onClose();
  };

  // Get logos as array for rendering
  const allLogosArray = logosToArray(allLogos);
  const selectedLogosCount = Object.keys(selectedLogos).length;

  return (
    <div className={`logo-modal-overlay ${isDarkMode ? 'dark-mode' : ''}`} onClick={onClose}>
      <div className="logo-modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="logo-modal-header">
          <h2>Manage Logos</h2>
          <button className="logo-modal-close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="logo-modal-body">
          {/* Upload Section */}
          <div className="upload-section">
            <button 
              className="upload-button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <FaUpload /> {isUploading ? 'Uploading...' : 'Upload Logos'}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              multiple
              hidden
            />
            <input
              type="file"
              ref={changeLogoInputRef}
              onChange={handleChangeLogoFile}
              accept="image/*"
              hidden
            />
            <p>
              Maximum file size: 5MB. Supported formats: JPG, PNG, GIF, SVG
            </p>
          </div>

          {/* Selection Info */}
          <div className="selection-info">
            Selected for table display: {selectedLogosCount}/3 logos
            {defaultLogoId && (
              <span>
                ★ Default logo set
              </span>
            )}
          </div>

          {/* Logos Grid */}
          <div className="logos-grid">
            {allLogosArray.length > 0 ? (
              allLogosArray.map(logo => {
                const isSelected = logo.id in selectedLogos;
                const isDefault = logo.id === defaultLogoId;
                
                return (
                  <div 
                    key={logo.id} 
                    className={`logo-item ${isSelected ? 'selected' : ''} ${isDefault ? 'default' : ''}`}
                  >
                    <div className="logo-image-container">
                      <img 
                        src={logo.url} 
                        alt="Organization logo"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div 
                        className="logo-placeholder" 
                        style={{ display: 'none' }}
                      >
                        ○
                      </div>
                      
                      {/* Selection indicator */}
                      {isSelected && (
                        <div className="selection-indicator">
                          <FaCheck />
                        </div>
                      )}
                      
                      {/* Default indicator */}
                      {isDefault && (
                        <div className="default-indicator">
                          <FaStar />
                        </div>
                      )}
                    </div>
                    
                    {/* Logo Name */}
                    <div className="logo-name">
                      {logo.name || 'Unnamed Logo'}
                    </div>
                    
                    {/* Logo Controls */}
                    <div className="logo-controls">
                      {/* Change Button */}
                      <button 
                        onClick={() => handleChangeLogo(logo.id)}
                        className="control-button change-button"
                        title="Change logo"
                      >
                        <FaEdit /> Change
                      </button>
                      
                      {/* Select Button */}
                      <button 
                        onClick={() => toggleLogoSelection(logo.id, { ...logo })}
                        className={`control-button select-button ${isSelected ? 'selected' : ''}`}
                        title={isSelected ? "Unselect logo" : "Select logo"}
                      >
                        <FaCheck /> {isSelected ? 'Selected' : 'Select'}
                      </button>
                      
                      {/* Default Button */}
                      <button 
                        onClick={() => handleSetDefault(logo.id)}
                        className={`control-button default-button ${isDefault ? 'active' : ''}`}
                        title={isDefault ? "Unset as default" : "Set as default"}
                      >
                        <FaStar /> {isDefault ? 'Default' : 'Set Default'}
                      </button>
                      
                      {/* Delete Button */}
                      <button 
                        onClick={() => handleRemoveLogo(logo.id)}
                        className="control-button delete-button"
                        title="Delete logo"
                        disabled={isDefault}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-logos" style={{
                textAlign: 'center',
                color: '#666',
                padding: '40px',
                gridColumn: '1 / -1'
              }}>
                No logos found. Upload some logos to get started.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="logo-modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="save-button" 
            onClick={handleSave}
            disabled={isUploading}
          >
            Save Changes ({selectedLogosCount} selected)
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoModal;