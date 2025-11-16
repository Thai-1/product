const mongoose = require("mongoose");
const generate = require("../helper/generate");


const userSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        tokenUser: {
            type: String,
            default: generate.generateRandomString(20)
        },
        phone: String,
        avatar: String,
        status: {
            type: String,
            default: "active"
        },
        requestFriends: Array,// Lời mời đã gửi
        acceptFriends: Array, // Lời mời đã nhận
        friendList: [ // Danh sách bạn bè
            {
                user_id: String,
                room_chat_id: String
            }
        ],
        statusOnline: String,
        deletedAt: Date,
        deleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema, "users");

module.exports = User;