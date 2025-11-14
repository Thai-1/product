//Chức năng gửi yêu cầu 
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
    listBtnAddFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("add");
            const userId = button.getAttribute("btn-add-friend");

            socket.emit("CLIENT_ADD_FRIEND", userId);

        })
    })
}

// Hết chức năng gửi yêu cầu


//Chức năng hủy gửi yêu cầu 
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
    listBtnCancelFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.remove("add");
            const userId = button.getAttribute("btn-cancel-friend");
            socket.emit("CLIENT_CANCEL_FRIEND", userId);

        })
    })
}
// Hết chức năng hủy gửi yêu cầu

//Chức năng từ chối kết bạn
const refuseFriend = (button) => {
    button.addEventListener("click", () => {
        button.closest(".box-user").classList.add("refuse");

        const userId = button.getAttribute("btn-refuse-friend");
        socket.emit("CLIENT_REFUSE_FRIEND", userId);

    })
}
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
    listBtnRefuseFriend.forEach(button => {
        refuseFriend(button);
    })
}
// Hết chức năng từ chối kết bạn

//Chức năng chấp nhận kết bạn

const acceptFriend = (button) => {
    button.addEventListener("click", () => {
        button.closest(".box-user").classList.add("accepted");

        const userId = button.getAttribute("btn-accept-friend");

        socket.emit("CLIENT_ACCEPT_FRIEND", userId);

    })
}
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
    listBtnAcceptFriend.forEach(button => {
        acceptFriend(button)
    })
}
// Hết chức năng chấp nhận kết bạn

//SERVER RETURN LENGTH ACCEPT FRIEND
const badgeUsersAccept = document.querySelector("[badge-users-accept]");
if (badgeUsersAccept) {
    const userId = badgeUsersAccept.getAttribute("badge-users-accept");
    socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
        if (userId == data.userId) {
            badgeUsersAccept.innerHTML = data.lengthAcceptFriends;
        }
    })

}
//End SERVER RETURN LENGTH ACCEPT FRIEND

// SERVER_RETURN_INFO_ACCEPT_FRIEND
const dataUsersAccept = document.querySelector("[data-users-accept]");
if (dataUsersAccept) {
    const userId = dataUsersAccept.getAttribute("data-users-accept");
    socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
        if (userId == data.userId) {
            // Vẽ user ra giao diện
            const div = document.createElement("div");
            div.classList.add("col-6");
            div.innerHTML = `<div class="box-user"><div class="inner-avatar"><img src="https://robohash.org/hicveldicta.png" alt=${data.infoUserA.fullName}></div><div class="inner-info"><div class="inner-name">${data.infoUserA.fullName}</div><div class="inner-buttons"><button class="btn btn-sm btn-primary mr-1" btn-accept-friend=${data.infoUserA.fullName._id}>Chấp nhận</button><button class="btn btn-sm btn-secondary mr-1" btn-refuse-friend="690b7dd3ba50861aad2e8211">Xóa </button><button class="btn btn-sm btn-secondary mr-1" btn-deleted-friend="690b7dd3ba50861aad2e8211" disabled="">Đã xóa </button><button class="btn btn-sm btn-secondary mr-1" btn-accepted-friend="690b7dd3ba50861aad2e8211" disabled="">Đã chấp nhận</button></div></div></div></div>`

            dataUsersAccept.appendChild(div);
            // Hết vẽ user ra giao diện

            //Hủy lời mời kết bạn
            const buttonRefuse = div.querySelector("[btn-refuse-friend]");

            refuseFriend(buttonRefuse);
            //Hết hủy lời mời kết bạn

            // Chấp nhận lời mời kết bạn
            const buttonAccept = div.querySelector("[btn-accept-friend]");
            acceptFriend(buttonAccept);
            // Hết Chấp nhận lời mời kết bạn

        }
    })
}
//END SERVER_RETURN_INFO_ACCEPT_FRIEND
