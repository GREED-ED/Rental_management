checkAuth();

const propertyId = new URLSearchParams(window.location.search).get('id');
const form = document.getElementById('editPropertyForm');
const token = localStorage.getItem('token');

// Load property data to pre-fill
fetch(`http://localhost:5000/api/properties/${propertyId}`)
  .then(res => res.json())
  .then(data => {
    form.title.value = data.title;
    form.description.value = data.description;
    form.price.value = data.price;
    form.location.value = data.location;
    form.property_type.value = data.property_type;
    form.bedrooms.value = data.bedrooms;
    form.bathrooms.value = data.bathrooms;
  });

// Update on submit
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const updatedData = Object.fromEntries(formData.entries());

  try {
    const res = await fetch(`http://localhost:5000/api/properties/${propertyId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updatedData)
    });

    const data = await res.json();
    if (res.ok) {
      alert('Property updated successfully!');
      window.location.href = 'dashboard.html';
    } else {
      alert(data.message || 'Update failed');
    }
  } catch (err) {
    console.error(err);
    alert('Something went wrong');
  }
});
