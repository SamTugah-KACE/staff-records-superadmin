// import React, { createContext, useState, useContext } from 'react';

// const initialOrganizations = [
//   {
//     id: 'ORG001',
//     organization_name: 'Tech Solutions Inc',
//     domain: 'https://techsolutions.com',
//     subscription_plan: 'Premium',
//     organization_nature: 'private',
//     employee_range: 50,
//     contact_person: 'John Doe',
//     contact_email: 'john@techsolutions.com',
//     phone_number: '+1234567890',
//     logos: [{ url: '○', name: 'default', isDefault: true }],
//     allLogos: [{ url: '○', name: 'default', isDefault: true, id: 'default-' + Math.random() }],
//     active: true,
//     createdAt: new Date().toISOString()
//   },
//   {
//     id: 'ORG002',
//     organization_name: 'Green Energy Ltd',
//     domain: 'https://greenenergy.org',
//     subscription_plan: 'Basic',
//     organization_nature: 'NGO',
//     employee_range: 25,
//     contact_person: 'Jane Smith',
//     contact_email: 'jane@greenenergy.org',
//     phone_number: '+0987654321',
//     logos: [{ url: '○', name: 'default', isDefault: true }],
//     allLogos: [{ url: '○', name: 'default', isDefault: true, id: 'default-' + Math.random() }],
//     active: false,
//     createdAt: new Date().toISOString()
//   },
// ];

// const OrganizationContext = createContext();

// export const useOrganizations = () => useContext(OrganizationContext);

// export const OrganizationProvider = ({ children }) => {
//   const [organizations, setOrganizations] = useState(initialOrganizations);
  
//   // Function to set organizations from API data
//   const setOrganizationsFromAPI = (apiData) => {
//     console.log('Setting organizations from API:', apiData);
    
//     // Transform API data to match your internal structure
//     const transformedData = apiData.map(org => ({
//       // Map API fields to your internal structure
//       id: org.id || org._id,
//       organization_name: org.organization_name || org.name,
//       organization_email: org.organization_email || org.email,
//       domain: org.domain,
//       organization_nature: org.organization_nature || org.nature,
//       org_type: org.org_type || org.type || 'Free',
//       employee_range: org.employee_range,
//       subscription_plan: org.subscription_plan || 'Free',
//       contact_person: org.contact_person,
//       contact_email: org.contact_email,
//       phone_number: org.phone_number,
//       logos: org.logos || [{ url: '○', name: 'default', isDefault: true }],
//       allLogos: org.allLogos || [{ url: '○', name: 'default', isDefault: true, id: 'default-' + Math.random() }],
//       active: org.active !== undefined ? org.active : true,
//       createdAt: org.createdAt || new Date().toISOString()
//     }));
    
//     setOrganizations(transformedData);
//   };
  
//   const addOrganization = (formData) => {
//   console.log('addOrganization called with:', formData);
//   console.log('logoFiles:', formData.logoFiles);

//   const newId = `ORG${String(organizations.length + 1).padStart(3, '0')}`;

//   let logoObjects = [];

//   if (formData.logoFiles && formData.logoFiles.length > 0) {
//     logoObjects = formData.logoFiles.map((fileData, index) => {
//       const file = fileData.file || fileData;
//       return {
//         url: URL.createObjectURL(file),
//         name: fileData.name || file.name,
//         size: fileData.size || file.size,
//         type: fileData.type || file.type,
//         file: file,
//         isDefault: index === 0, 
//         id: Date.now() + Math.random() + index
//       };
//     });
//   }

//   if (logoObjects.length === 0) {
//      logoObjects.push({ url: '○', name: 'placeholder', isDefault: true });
//    }
    
//     const newOrganization = {
//       id: newId,
//       organization_name: formData.organization_name,
//       organization_email: formData.organization_email,
//       domain: formData.domain,
//       organization_nature: formData.organization_nature,
//       org_type: formData.org_type || 'Free', 
//       employee_range: formData.employee_range,
//       subscription_plan: formData.subscription_plan || 'Free',
//       contact_person: formData.contact_person,
//       contact_email: formData.contact_email,
//       phone_number: formData.phone_number,
//       logos: logoObjects,
//       allLogos: [...logoObjects],
//       active: true,
//       createdAt: new Date().toISOString()
//     };
    
//     setOrganizations(prev => [...prev, newOrganization]);
//     return newId;
//   };
  
//   const toggleActive = (id) => {
//     setOrganizations(
//       organizations.map((org) =>
//         org.id === id ? { ...org, active: !org.active } : org
//       )
//     );
//   };

//   const getAllLogos = (id) => {
//     const org = organizations.find(org => org.id === id);
//     return org?.allLogos || [];
//   };

//   const updateTableLogos = (id, selectedLogos) => {
//     setOrganizations(
//       organizations.map((org) => {
//         if (org.id === id) {
//           return { ...org, logos: selectedLogos };
//         }
//         return org;
//       })
//     );
//   };               

//   const addLogos = (id, newLogoFiles) => {
//     setOrganizations(
//       organizations.map((org) => {
//         if (org.id === id) {
//           const newLogoObjects = newLogoFiles.map((file, index) => ({
//             url: URL.createObjectURL(file),
//             name: file.name,
//             size: file.size,
//             type: file.type,
//             file: file,
//             isDefault: false,
//             id: Date.now() + Math.random() + index
//           }));

//           return {
//             ...org,
//             allLogos: [...(org.allLogos || []), ...newLogoObjects]
//           };
//         }
//         return org;
//       })
//     );
//   };

//   const updateLogo = (id, logoIndex, newFile) => {
//     setOrganizations(
//       organizations.map((org) => {
//         if (org.id === id) {
//           const updatedLogos = [...org.logos];
          
//           if (updatedLogos[logoIndex] && updatedLogos[logoIndex].url && updatedLogos[logoIndex].url.startsWith('blob:')) {
//             URL.revokeObjectURL(updatedLogos[logoIndex].url);
//           }
          
//           updatedLogos[logoIndex] = {
//             url: URL.createObjectURL(newFile),
//             name: newFile.name,
//             size: newFile.size,
//             type: newFile.type,
//             file: newFile,
//             isDefault: updatedLogos[logoIndex]?.isDefault || false
//           };
          
//           return { ...org, logos: updatedLogos };
//         }
//         return org;
//       })
//     );
//   };

//   const removeLogo = (id, logoId) => {
//     setOrganizations(
//       organizations.map((org) => {
//         if (org.id === id) {
//           const logoToRemove = org.allLogos.find(logo => logo.id === logoId);
          
//           if (logoToRemove && logoToRemove.url && logoToRemove.url.startsWith('blob:')) {
//             URL.revokeObjectURL(logoToRemove.url);
//           }
          
//           const updatedAllLogos = org.allLogos.filter(logo => logo.id !== logoId);
//           const updatedTableLogos = org.logos.filter(logo => logo.id !== logoId);
          
//           if (updatedTableLogos.length === 0) {
//             updatedTableLogos.push({ url: '○', name: 'placeholder', isDefault: true });
//           }
          
//           return { 
//             ...org, 
//             allLogos: updatedAllLogos,
//             logos: updatedTableLogos
//           };
//         }
//         return org;
//       })
//     );
//   };

//   const setDefaultLogo = (id, logoId) => {
//     setOrganizations(
//       organizations.map((org) => {
//         if (org.id === id) {
//         const updatedAllLogos = Array.isArray(org.allLogos) 
//             ? org.allLogos.map(logo => ({
//                 ...logo,
//                 isDefault: logo.id === logoId
//               }))
//             : [];

//           const updatedTableLogos = Array.isArray(org.logos)
//             ? org.logos.map(logo => ({
//                 ...logo,
//                 isDefault: logo.id === logoId
//               }))
//             : [];
          
//           return { 
//             ...org, 
//             allLogos: updatedAllLogos,
//             logos: updatedTableLogos
//           };
//         }
//         return org;
//       })
//     );
//   };

//   const getOrganizationLogos = (id) => {
//     const org = organizations.find(org => org.id === id);
//     return org?.logos || [{ url: '○', name: 'default', isDefault: true }];
//   };
  
//   const value = {
//     organizations,
//     setOrganizations: setOrganizationsFromAPI, 
//     addOrganization,
//     toggleActive,
//     addLogos,
//     removeLogo,
//     setDefaultLogo,
//     getOrganizationLogos,
//     updateLogo,
//     getAllLogos,
//     updateTableLogos
//   };
  
//   return (
//     <OrganizationContext.Provider value={value}>
//       {children}
//     </OrganizationContext.Provider>
//   );
// };

// export default OrganizationContext;


import React, { createContext, useState, useContext } from 'react';

const initialOrganizations = [
  {
    id: 'ORG001',
    organization_name: 'Tech Solutions Inc',
    domain: 'https://techsolutions.com',
    subscription_plan: 'Premium',
    organization_nature: 'private',
    employee_range: 50,
    contact_person: 'John Doe',
    contact_email: 'john@techsolutions.com',
    phone_number: '+1234567890',
    logos: [{ url: '○', name: 'default', isDefault: true }],
    allLogos: [{ url: '○', name: 'default', isDefault: true, id: 'default-' + Math.random() }],
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'ORG002',
    organization_name: 'Green Energy Ltd',
    domain: 'https://greenenergy.org',
    subscription_plan: 'Basic',
    organization_nature: 'NGO',
    employee_range: 25,
    contact_person: 'Jane Smith',
    contact_email: 'jane@greenenergy.org',
    phone_number: '+0987654321',
    logos: [{ url: '○', name: 'default', isDefault: true }],
    allLogos: [{ url: '○', name: 'default', isDefault: true, id: 'default-' + Math.random() }],
    active: false,
    createdAt: new Date().toISOString()
  },
];

const OrganizationContext = createContext();

export const useOrganizations = () => useContext(OrganizationContext);

export const OrganizationProvider = ({ children }) => {
  const [organizations, setOrganizations] = useState(initialOrganizations);
  
  // Function to set organizations from API data
  const setOrganizationsFromAPI = (apiData) => {
    console.log('Setting organizations from API:', apiData);
    
    // Transform API data to match your internal structure
    const transformedData = apiData.map(org => {
      // Handle logos from API response
      let logoObjects = [];
      
      if (org.logos && Array.isArray(org.logos)) {
        logoObjects = org.logos.map((logo, index) => {
          // If logo is a URL string from backend
          if (typeof logo === 'string') {
            return {
              url: logo.startsWith('http') ? logo : `${process.env.REACT_APP_API_BASE_URL || 'https://staff-records-backend.onrender.com'}${logo}`,
              name: `logo-${index + 1}`,
              isDefault: index === 0,
              id: `api-logo-${org.id}-${index}`
            };
          }
          // If logo is an object with url property
          if (logo.url) {
            return {
              url: logo.url.startsWith('http') ? logo.url : `${process.env.REACT_APP_API_BASE_URL || 'https://staff-records-backend.onrender.com'}${logo.url}`,
              name: logo.name || `logo-${index + 1}`,
              isDefault: logo.isDefault || index === 0,
              id: logo.id || `api-logo-${org.id}-${index}`
            };
          }
          return logo;
        });
      }
      
      // Fallback to default logo if no logos
      if (logoObjects.length === 0) {
        logoObjects = [{ url: '○', name: 'default', isDefault: true, id: `default-${org.id}` }];
      }
      
      return {
        // Map API fields to your internal structure
        id: org.id || org._id,
        organization_name: org.organization_name || org.name,
        organization_email: org.organization_email || org.email,
        domain: org.domain,
        organization_nature: org.organization_nature || org.nature,
        org_type: org.org_type || org.type || 'Free',
        employee_range: org.employee_range,
        subscription_plan: org.subscription_plan || 'Free',
        contact_person: org.contact_person,
        contact_email: org.contact_email,
        phone_number: org.phone_number,
        logos: logoObjects,
        allLogos: [...logoObjects], // Copy for allLogos
        active: org.active !== undefined ? org.active : true,
        createdAt: org.createdAt || org.created_at || new Date().toISOString()
      };
    });
    
    setOrganizations(transformedData);
  };
  
  const addOrganization = (formData) => {
    console.log('addOrganization called with:', formData);
    console.log('logoFiles:', formData.logoFiles);

    // Don't generate ID here if it comes from API response
    const newId = formData.id || `ORG${String(organizations.length + 1).padStart(3, '0')}`;

    let logoObjects = [];

    // Handle logo files for display purposes (temporary URLs for preview)
    if (formData.logoFiles && formData.logoFiles.length > 0) {
      logoObjects = formData.logoFiles.map((file, index) => {
        // Handle both File objects and file metadata
        const actualFile = file instanceof File ? file : (file.file || file);
        
        if (actualFile instanceof File) {
          return {
            url: URL.createObjectURL(actualFile), // Temporary URL for preview
            name: actualFile.name,
            size: actualFile.size,
            type: actualFile.type,
            file: actualFile,
            isDefault: index === 0,
            id: `temp-${Date.now()}-${index}`,
            isTemporary: true // Flag to indicate this is a temporary preview URL
          };
        } else {
          // Handle case where file data comes from API response
          return {
            url: file.url || '○',
            name: file.name || `logo-${index + 1}`,
            size: file.size,
            type: file.type,
            isDefault: index === 0,
            id: file.id || `api-${Date.now()}-${index}`
          };
        }
      });
    }

    // If no logos provided, use default placeholder
    if (logoObjects.length === 0) {
      logoObjects.push({ 
        url: '○', 
        name: 'placeholder', 
        isDefault: true, 
        id: `default-${newId}` 
      });
    }
    
    const newOrganization = {
      id: newId,
      organization_name: formData.organization_name,
      organization_email: formData.organization_email,
      domain: formData.domain,
      organization_nature: formData.organization_nature,
      org_type: formData.org_type || 'Free', 
      employee_range: formData.employee_range,
      subscription_plan: formData.subscription_plan || 'Free',
      contact_person: formData.contact_person,
      contact_email: formData.contact_email,
      phone_number: formData.phone_number,
      logos: logoObjects,
      allLogos: [...logoObjects],
      active: true,
      createdAt: formData.created_at || new Date().toISOString()
    };
    
    console.log('Adding new organization:', newOrganization);
    setOrganizations(prev => [...prev, newOrganization]);
    return newId;
  };
  
  // Function to update organization after successful API response
  const updateOrganizationFromAPI = (orgId, apiResponse) => {
    console.log('Updating organization from API response:', orgId, apiResponse);
    
    setOrganizations(prev => prev.map(org => {
      if (org.id === orgId) {
        // Clean up temporary object URLs
        org.logos.forEach(logo => {
          if (logo.isTemporary && logo.url && logo.url.startsWith('blob:')) {
            URL.revokeObjectURL(logo.url);
          }
        });
        
        // Update with real API data
        let updatedLogos = [];
        if (apiResponse.logos && Array.isArray(apiResponse.logos)) {
          updatedLogos = apiResponse.logos.map((logo, index) => ({
            url: typeof logo === 'string' ? logo : logo.url,
            name: typeof logo === 'string' ? `logo-${index + 1}` : logo.name,
            isDefault: index === 0,
            id: `api-${orgId}-${index}`
          }));
        }
        
        if (updatedLogos.length === 0) {
          updatedLogos = [{ url: '○', name: 'default', isDefault: true, id: `default-${orgId}` }];
        }
        
        return {
          ...org,
          ...apiResponse,
          id: orgId, // Ensure ID stays consistent
          logos: updatedLogos,
          allLogos: [...updatedLogos]
        };
      }
      return org;
    }));
  };
  
  const toggleActive = (id) => {
    setOrganizations(
      organizations.map((org) =>
        org.id === id ? { ...org, active: !org.active } : org
      )
    );
  };

  const getAllLogos = (id) => {
    const org = organizations.find(org => org.id === id);
    return org?.allLogos || [];
  };

  const updateTableLogos = (id, selectedLogos) => {
    setOrganizations(
      organizations.map((org) => {
        if (org.id === id) {
          return { ...org, logos: selectedLogos };
        }
        return org;
      })
    );
  };               

  const addLogos = (id, newLogoFiles) => {
    setOrganizations(
      organizations.map((org) => {
        if (org.id === id) {
          const newLogoObjects = newLogoFiles.map((file, index) => ({
            url: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
            type: file.type,
            file: file,
            isDefault: false,
            id: `temp-${Date.now()}-${index}`,
            isTemporary: true
          }));

          return {
            ...org,
            allLogos: [...(org.allLogos || []), ...newLogoObjects]
          };
        }
        return org;
      })
    );
  };

  const updateLogo = (id, logoIndex, newFile) => {
    setOrganizations(
      organizations.map((org) => {
        if (org.id === id) {
          const updatedLogos = [...org.logos];
          
          // Clean up old blob URL
          if (updatedLogos[logoIndex] && updatedLogos[logoIndex].url && updatedLogos[logoIndex].url.startsWith('blob:')) {
            URL.revokeObjectURL(updatedLogos[logoIndex].url);
          }
          
          updatedLogos[logoIndex] = {
            url: URL.createObjectURL(newFile),
            name: newFile.name,
            size: newFile.size,
            type: newFile.type,
            file: newFile,
            isDefault: updatedLogos[logoIndex]?.isDefault || false,
            id: `temp-${Date.now()}-${logoIndex}`,
            isTemporary: true
          };
          
          return { ...org, logos: updatedLogos };
        }
        return org;
      })
    );
  };

  const removeLogo = (id, logoId) => {
    setOrganizations(
      organizations.map((org) => {
        if (org.id === id) {
          const logoToRemove = org.allLogos.find(logo => logo.id === logoId);
          
          // Clean up blob URL
          if (logoToRemove && logoToRemove.url && logoToRemove.url.startsWith('blob:')) {
            URL.revokeObjectURL(logoToRemove.url);
          }
          
          const updatedAllLogos = org.allLogos.filter(logo => logo.id !== logoId);
          const updatedTableLogos = org.logos.filter(logo => logo.id !== logoId);
          
          // Ensure at least one logo (placeholder)
          if (updatedTableLogos.length === 0) {
            updatedTableLogos.push({ 
              url: '○', 
              name: 'placeholder', 
              isDefault: true, 
              id: `default-${id}` 
            });
          }
          
          return { 
            ...org, 
            allLogos: updatedAllLogos,
            logos: updatedTableLogos
          };
        }
        return org;
      })
    );
  };

  const setDefaultLogo = (id, logoId) => {
    setOrganizations(
      organizations.map((org) => {
        if (org.id === id) {
          const updatedAllLogos = Array.isArray(org.allLogos) 
            ? org.allLogos.map(logo => ({
                ...logo,
                isDefault: logo.id === logoId
              }))
            : [];

          const updatedTableLogos = Array.isArray(org.logos)
            ? org.logos.map(logo => ({
                ...logo,
                isDefault: logo.id === logoId
              }))
            : [];
          
          return { 
            ...org, 
            allLogos: updatedAllLogos,
            logos: updatedTableLogos
          };
        }
        return org;
      })
    );
  };

  const getOrganizationLogos = (id) => {
    const org = organizations.find(org => org.id === id);
    return org?.logos || [{ url: '○', name: 'default', isDefault: true }];
  };

  // Cleanup function for component unmount
  const cleanupBlobUrls = () => {
    organizations.forEach(org => {
      org.logos.forEach(logo => {
        if (logo.url && logo.url.startsWith('blob:')) {
          URL.revokeObjectURL(logo.url);
        }
      });
      org.allLogos.forEach(logo => {
        if (logo.url && logo.url.startsWith('blob:')) {
          URL.revokeObjectURL(logo.url);
        }
      });
    });
  };
  
  const value = {
    organizations,
    setOrganizations: setOrganizationsFromAPI, 
    addOrganization,
    updateOrganizationFromAPI,
    toggleActive,
    addLogos,
    removeLogo,
    setDefaultLogo,
    getOrganizationLogos,
    updateLogo,
    getAllLogos,
    updateTableLogos,
    cleanupBlobUrls
  };
  
  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
};

export default OrganizationContext;