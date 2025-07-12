const form = document.getElementById('searchForm');
const list = document.getElementById('propertyList');

// Initial fetch (all properties)
fetchProperties();

// On form submit
form.addEventListener('submit', function(e) {
  e.preventDefault();
  const query = new URLSearchParams(new FormData(form)).toString();
  fetchProperties(query);
});

function fetchProperties(query = '') {
  fetch(`http://localhost:5000/api/properties?${query}`)
    .then(res => res.json())
    .then(data => {
      if (!data.length) {
        list.innerHTML = "<p>No properties found.</p>";
        return;
      }

      list.innerHTML = data.map(p => `
        <div class="card">
          <a href="property-detail.html?id=${p._id}">
            <h3>${p.title}</h3>
          </a>
          <p><b>Location:</b> ${p.location}</p>
          <p><b>Type:</b> ${p.property_type}</p>
          <p><b>Price:</b> Rs. ${p.price}</p>
          <p><b>Status:</b> ${p.status}</p>
          ${p.photos[0] ? `<img src="http://localhost:5000${p.photos[0]}" width="200" height="200">` : ''}
        </div>
      `).join('');
    })
    .catch(err => {
      console.error(err);
      list.innerHTML = "<p>Error fetching properties.</p>";
    });
}
