import { useEffect, useState } from 'react';
import axios from 'axios';
import './InfoCard.css';
import { GoOrganization } from "react-icons/go";
import { BsBuildingCheck, BsBuildingX } from "react-icons/bs";

const InfoCard = ({ title, description, icon, value, color, colorRgb, bgOpacity, style }) => {
  const cardStyle = {
    '--card-accent-color': color,
    '--card-accent-rgb': colorRgb || '74, 108, 247', 
    '--card-bg-opacity': bgOpacity || '0.1',
    ...style
  };
  
  return (
    <div className="info-card" style={cardStyle}>
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
        <div className="card-value">{value}</div>
      </div>
    </div>
  );
};

export const InfoCardsContainer = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend (same endpoint as OrganizationTable)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://staff-records-backend.onrender.com/api/organizations');
        setOrganizations(response.data);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch organizations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const activeOrgs = organizations.filter(org => org.is_active).length;

  const cardData = [
    {
      title: 'Total Organizations',
      description: 'Total Number of Organizations',
      value: organizations.length.toString(),
      icon: <GoOrganization />,
      color: '#2196F3',
      colorRgb: '33, 150, 243',
    },
    {
      title: 'Active Organizations',
      description: 'Currently Active Organizations',
      value: activeOrgs.toString(),
      icon: <BsBuildingCheck />,
      color: '#4CAF50',
      colorRgb: '76, 175, 80',
    },
    {
      title: 'Inactive Organizations',
      description: 'Currently Inactive Organizations',
      value: (organizations.length - activeOrgs).toString(),
      icon: <BsBuildingX />,
      color: '#F44336',
      colorRgb: '244, 67, 54',
    },
  ];

  return (
    <div className="cards-container">
      {cardData.map((card, index) => (
        <InfoCard
          key={index}
          title={card.title}
          description={card.description}
          value={card.value}
          icon={card.icon}
          color={card.color}
          style={{
            '--card-accent-color': card.color,
            '--card-accent-rgb': card.colorRgb,
            '--card-bg-opacity': card.bgOpacity || '0.1',
          }}
        />
      ))}
    </div>
  );
};

export default InfoCard;