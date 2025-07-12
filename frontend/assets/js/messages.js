// document.addEventListener('DOMContentLoaded', () => {
//   const token = localStorage.getItem('token');
//   const user = JSON.parse(localStorage.getItem('user'));

//   const params = new URLSearchParams(window.location.search);
//   const propertyId = params.get('id');
//   const otherUserId = params.get('user');
//   // if (!propertyId || !otherUserId) {
//   //   alert("Invalid message link");
//   //   window.location.href = "dashboard.html";
//   // }
//   if (!propertyId || !otherUserId || otherUserId === 'undefined') {
//     alert("Invalid or missing chat info.");
//     window.location.href = "dashboard.html";
//   }
//   console.log("Property ID:", propertyId);
//   console.log("Other User ID:", otherUserId);


//   const chatBox = document.getElementById('chatBox');
//   const form = document.getElementById('msgForm');
//   const input = document.getElementById('msgInput');

//   const roomId = `${propertyId}_${[user._id, otherUserId].sort().join('_')}`; // unique chatroom ID
//   const socket = io('http://localhost:5000');

//   // Join room
//   socket.emit('joinRoom', { roomId });

//   // Fetch previous messages
//   fetch(`http://localhost:5000/api/messages/${propertyId}/${otherUserId}`, {
//     headers: { Authorization: `Bearer ${token}` }
//   })
//     .then(res => res.json())
//     .then(messages => {
//       if (Array.isArray(messages)) {
//         renderMessages(messages);
//       } else {
//         console.error('Expected message array but got:', messages);
//       }
//     });

//   // On message received
//   socket.on('receiveMessage', (msg) => {
//     renderMessages([msg], true);
//   });

//   // Send message
//   form.addEventListener('submit', (e) => {
//     e.preventDefault();
//     const text = input.value.trim();
//     if (!text) return;

//     const msgData = {
//       sender_id: user._id,
//       receiver_id: otherUserId,
//       property_id: propertyId,
//       message_text: text,
//       roomId
//     };

//     socket.emit('sendMessage', msgData);
//     input.value = '';
//   });

//   function renderMessages(messages, append = false) {
//     if (!Array.isArray(messages)) {
//       console.error("Expected array, got:", messages);
//       return;
//     }
//     const html = messages.map(m => `
//       <div style="margin: 5px 0; text-align: ${m.sender_id === user._id ? 'right' : 'left'}">
//         <span style="background: ${m.sender_id === user._id ? '#acf' : '#eee'}; padding: 5px; border-radius: 5px">
//           ${m.message_text}
//         </span>
//       </div>
//     `).join('');

//     if (append) {
//       chatBox.innerHTML += html;
//     } else {
//       chatBox.innerHTML = html;
//     }

//     chatBox.scrollTop = chatBox.scrollHeight;
//   }
// });

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // Debug: Check if user and token exist
  console.log('Token:', token);
  console.log('User:', user);

  if (!token || !user) {
    alert('Please log in first');
    window.location.href = 'login.html';
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const propertyId = params.get('id');
  const otherUserId = params.get('user');
  
  console.log("Property ID:", propertyId);
  console.log("Other User ID:", otherUserId);

  if (!propertyId || !otherUserId || otherUserId === 'undefined') {
    alert("Invalid or missing chat info.");
    window.location.href = "dashboard.html";
    return;
  }

  const chatBox = document.getElementById('chatBox');
  const form = document.getElementById('msgForm');
  const input = document.getElementById('msgInput');

  const roomId = `${propertyId}_${[user._id, otherUserId].sort().join('_')}`; // unique chatroom ID
  const socket = io('http://localhost:5000');

  // Join room
  socket.emit('joinRoom', { roomId });

  // Fetch previous messages
  console.log('Fetching messages from:', `http://localhost:5000/api/messages/${propertyId}/${otherUserId}`);
  
  fetch(`http://localhost:5000/api/messages/${propertyId}/${otherUserId}`, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
    .then(res => {
      console.log('Response status:', res.status);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(messages => {
      console.log('Received messages:', messages);
      renderMessages(messages);
    })
    .catch(error => {
      console.error('Error fetching messages:', error);
      chatBox.innerHTML = '<div style="color: red;">Error loading messages. Please try again.</div>';
    });

  // On message received
  socket.on('receiveMessage', (msg) => {
    console.log('Received new message:', msg);
    renderMessages([msg], true);
  });

  // Send message
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    const msgData = {
      sender_id: user._id,
      receiver_id: otherUserId,
      property_id: propertyId,
      message_text: text,
      roomId
    };

    console.log('Sending message:', msgData);
    socket.emit('sendMessage', msgData);
    input.value = '';
  });

  function renderMessages(messages, append = false) {
    if (!Array.isArray(messages)) {
      console.error("Expected array, got:", messages);
      return;
    }
    
    if (messages.length === 0) {
      if (!append) {
        chatBox.innerHTML = '<div style="color: #666; text-align: center; padding: 20px;">No messages yet. Start the conversation!</div>';
      }
      return;
    }

    const html = messages.map(m => `
      <div style="margin: 5px 0; text-align: ${m.sender_id === user._id ? 'right' : 'left'}">
        <span style="background: ${m.sender_id === user._id ? '#acf' : '#eee'}; padding: 5px; border-radius: 5px; display: inline-block;">
          ${m.message_text}
        </span>
        <div style="font-size: 0.8em; color: #666; margin-top: 2px;">
          ${new Date(m.sent_date).toLocaleTimeString()}
        </div>
      </div>
    `).join('');

    if (append) {
      chatBox.innerHTML += html;
    } else {
      chatBox.innerHTML = html;
    }

    chatBox.scrollTop = chatBox.scrollHeight;
  }
});