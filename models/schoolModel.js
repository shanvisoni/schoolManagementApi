import pool from '../config/db.js';

const School = {
  async create(schoolData) {
    const [result] = await pool.query('INSERT INTO schools SET ?', schoolData);
    return result.insertId;
  },

  async getAll() {
    const [rows] = await pool.query('SELECT * FROM schools');
    return rows;
  },

  async getNearbySchools(userLat, userLng) {
    
    const [schools] = await pool.query('SELECT * FROM schools');
    
    // Calculate distance for each school
    const schoolsWithDistance = schools.map(school => {
      const distance = calculateDistance(
        userLat, userLng,
        school.latitude, school.longitude
      );
      return { ...school, distance };
    });
    
    // Sort by distance
    return schoolsWithDistance.sort((a, b) => a.distance - b.distance);
  }
};

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

export default School;