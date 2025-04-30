import School from '../models/schoolModel.js'; 

export const addSchool = async (req, res) => { 
    try {
        const schoolId = await School.create(req.body);
        res.status(201).json({
            success: true,
            message: 'School added successfully',
            schoolId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error adding school',
            error: error.message 
        });
    }
};

export const listSchools = async (req, res) => { 
    try {
        const { latitude, longitude } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: 'Latitude and longitude are required'
            });
        }

        const schools = await School.getNearbySchools(
            parseFloat(latitude),
            parseFloat(longitude)
        );

        res.status(200).json({
            success: true,
            schools
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error fetching schools',
            error: error.message 
        });
    }
};