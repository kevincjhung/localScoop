const chatForm  = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');




const socket = io.connect();


// Join chatroom
socket.emit('joinRoom',  { ROOM_ID: ROOM_ID});
chatMessages.scrollTop = chatMessages.scrollHeight;




//message from server
socket.on('message', message=>{
    outputMessage(message)

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})



socket.on('GTFO', () => {
    // Redirects the user
    window.location = "/"
})


//message submit
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    let msg = e.target.elements.msg.value;

    //emitting the message in input to server side
    socket.emit('chatMessage', msg)

    // 👇️ clear input field
    e.target.elements.msg.value = '';



})


//output message from server
function outputMessage(message){
    const div = document.createElement('div');


    div.classList.add('message');
    div.innerHTML = `<p class="meta"> ${message.username} <span> ${message.timestamp}</span></p>
                         <p class="text">
                            ${message.text}
                         </p>`;
    document.querySelector('.chat-messages').appendChild(div)
}



// Add room name to DOM
// function outputRoomName(room) {
//     roomName.innerText = room;
// }



// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
    });
}


// user leave chat room
// document.getElementById('leave-btn').addEventListener('click', () => {
//     window.location = '../index.html';
// });


document.addEventListener("beforeunload", () => {
    socket.emit('disconnect')


});
