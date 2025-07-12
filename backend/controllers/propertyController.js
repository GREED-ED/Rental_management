const Property = require('../models/Property');

exports.createProperty = async (req, res) => {
  try {
    const { title, description, price, location, property_type, bedrooms, bathrooms } = req.body;
    const photoFiles = req.files;
    const photoPaths = photoFiles.map(file => `/uploads/${file.filename}`);

    const newProperty = new Property({
      owner_id: req.user.id,
      title,
      description,
      price,
      location,
      property_type,
      bedrooms,
      bathrooms,
      photos: photoPaths,
    });

    await newProperty.save();
    res.status(201).json({ 
        message: 'Property added successfully', 
        property: newProperty 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllProperties = async (req, res) => {
  try {
    const { location, minPrice, maxPrice, property_type } = req.query;

    let filters = {};

    if (location) {
      filters.location = { $regex: location, $options: 'i' };
    }

    if (minPrice && maxPrice) {
      filters.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    } else if (minPrice) {
      filters.price = { $gte: Number(minPrice) };
    } else if (maxPrice) {
      filters.price = { $lte: Number(maxPrice) };
    }

    if (property_type) {
      filters.property_type = property_type;
    }

    const properties = await Property.find(filters).populate('owner_id', 'name _id');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner_id', 'name _id');
    if (!property) {
        return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProperty = async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) return res.status(404).json({ message: 'Property not found' });
  if (property.owner_id.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  Object.assign(property, req.body);
  await property.save();
  res.json(property);
};

exports.deleteProperty = async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) return res.status(404).json({ message: 'Property not found' });
  if (property.owner_id.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  await property.remove();
  res.json({ message: 'Property deleted' });
};

