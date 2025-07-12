const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));
document.getElementById('userInfo').innerHTML = `<p>Welcome, ${user.name} (${user.user_type})</p>`;

if (user.user_type === 'owner') {
  document.getElementById('ownerSection').style.display = 'block';

  // Get owner properties
  fetch('http://localhost:5000/api/properties', {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      const myProps = data.filter(p => p.owner_id._id === user._id);
      document.getElementById('myProperties').innerHTML = myProps.map(p => `
        <div class="card">
        <a href="property-detail.html?id=${p._id}">
        ${p.photos[0] ? `<img src="http://localhost:5000${p.photos[0]}" width="200" height="200">` : ''}
          <h4>${p.title}</h4>
        </a>
            <p>${p.location}</p>
            <p>Rs. ${p.price}</p>
            <button onclick="editProperty('${p._id}')">Edit</button>
            <button onclick="deleteProperty('${p._id}')">Delete</button>
        </div>
      `).join('');
    });

  // Get booking requests
  fetch('http://localhost:5000/api/bookings/owner', {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      const bookingsHtml = data.map(b => `
        <div class="card" data-booking-id="${b._id}">
          <p><b>Property:</b> ${b.property_id?.title}</p>
          <p><b>Renter:</b> ${b.renter_id?.name}</p>
          <p><b>Status:</b> ${b.status}</p>
          <button onclick="updateBooking('${b._id}', 'confirmed')">Confirm</button>
          <button onclick="updateBooking('${b._id}', 'rejected')">Reject</button>
          ${
            b.owner_id && b.owner_id._id
              ? `<a href="messaging.html?id=${b.property_id._id}&user=${b.renter_id._id}">💬 Chat with Renter</a>`
              : ''
          }
        </div>
      `).join('');
      document.getElementById('bookingRequests').innerHTML = bookingsHtml;
    });

} else {
  document.getElementById('renterSection').style.display = 'block';

  // Renter - View own bookings (bonus API needed)
  fetch('http://localhost:5000/api/bookings/me', {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      const html = data.map(b => `
        <div class="card">
          <p><b>Property:</b> ${b.property_id?.title}</p>
          <p><b>Status:</b> ${b.status}</p>
          <p><b>Move In:</b> ${new Date(b.move_in_date).toLocaleDateString()}</p>
          <a href="messaging.html?id=${b.property_id._id}&user=${b.property_id.owner_id._id}">💬 Chat with Owner</a>

        </div>
      `).join('');
      document.getElementById('myBookings').innerHTML = html;
    });
}

// Update booking status (owner)
function updateBooking(id, status) {
    fetch(`http://localhost:5000/api/bookings/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    })
      .then(res => res.json())
      .then(() => {
        // ✅ Remove the card from DOM directly
        const card = document.querySelector(`[data-booking-id="${id}"]`);
        if (card) card.remove();
      })
      .catch(err => {
        console.error(err);
        alert('Failed to update booking');
      });
  }

function deleteProperty(id) {
    const confirmDelete = confirm('Are you sure you want to delete this property?');
    if (!confirmDelete) return;
  
    fetch(`http://localhost:5000/api/properties/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        alert('Property deleted');
        location.reload();
      })
      .catch(err => {
        console.error(err);
        alert('Delete failed');
      });
  }
  
  function editProperty(id) {
    window.location.href = `edit-property.html?id=${id}`;
  }
  
