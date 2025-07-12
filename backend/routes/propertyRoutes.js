const express = require('express');
const router = express.Router();
const { createProperty, getAllProperties, getPropertyById, updateProperty, deleteProperty  } = require('../controllers/propertyController');
const auth = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

// POST /api/properties – Add property (owner only)
router.post('/', auth, upload.array('photos', 5), createProperty);

// GET /api/properties – View all
router.get('/', getAllProperties);

// GET /api/properties/:id – View single
router.get('/:id', getPropertyById);

router.patch('/:id', auth, updateProperty);
router.delete('/:id', auth, deleteProperty);


module.exports = router;
