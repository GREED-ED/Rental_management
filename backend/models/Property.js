const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  owner_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
},
  title: { 
    type: String, 
    required: true 
},
  description: { 
    type: String 
},
  price: { 
    type: Number, 
    required: true 
},
  location: { 
    type: String, 
    required: true 
},
  property_type: { 
    type: String, 
    enum: ['room', 'apartment', 'house'], 
    required: true 
},
  bedrooms: { 
    type: Number 
},
  bathrooms: { 
    type: Number 
},
  photos: [{ //url
    type: String 
}], 
  status: { 
    type: String, 
    enum: ['available', 'rented'], 
    default: 'available' 
},
  created_date: { 
    type: Date, 
    default: Date.now 
}
});

module.exports = mongoose.model('Property', propertySchema);
