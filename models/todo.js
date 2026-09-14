const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
    type: String,
    default: ""
},

dueDate: {
    type: Date
},

priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: ""
},

category: {
    type: String,
    enum: ["Work", "Personal", "Study", "Other"],
    default: ""
},

        completed: {
            type: Boolean,
            default: false
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;