const Booking = require('../models/Booking');
const Property = require('../models/Property');

exports.createBooking = async (req, res) => {
  try {
    const { property_id, move_in_date, total_amount } = req.body;

    const property = await Property.findById(property_id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    const newBooking = await Booking.create({
      property_id,
      renter_id: req.user.id,
      owner_id: property.owner_id,
      move_in_date,
      total_amount
    });

    res.status(201).json({ 
        message: 'Booking request sent', 
        booking: newBooking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookingsForOwner = async (req, res) => {
  try {
    const bookings = await Booking.find({ owner_id: req.user.id, status: 'pending'})
      .populate('property_id')
      .populate('renter_id', 'name phone');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookingsForRenter = async (req, res) => {
    try {
      // const bookings = await Booking.find({ renter_id: req.user.id }).populate('property_id');
      const bookings = await Booking.find({ renter_id: req.user.id })
  .populate({
    path: 'property_id',
    populate: {
      path: 'owner_id',
      select: 'name _id'
    }
  })
  .populate('renter_id');
      res.json(bookings);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body; // should be 'confirmed' or 'rejected'
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.owner_id.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized to update this booking' });

    booking.status = status;
    await booking.save();

    res.json({ message: `Booking ${status}`, booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
