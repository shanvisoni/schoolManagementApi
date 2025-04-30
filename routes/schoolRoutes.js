import express from 'express';
const router = express.Router();
import { addSchool, listSchools } from '../controllers/schoolController.js';
import  validateSchool  from '../validations/schoolValidation.js';

router.post('/addSchool', validateSchool, addSchool);
router.get('/listSchools',listSchools);

export default router;