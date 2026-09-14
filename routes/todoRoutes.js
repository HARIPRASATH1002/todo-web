const express =require("express");
const Todo=require("../models/todo");
const verifyToken=require("../middleware/authMiddleware");
const router=express.Router();
router.post("/", verifyToken, async (req, res) => {
    try {
    
        const { title, description, dueDate, priority, category } = req.body;

if (!title) {
    return res.status(400).json({
        message: "Task title is required"
    });
}

const cleanTitle = title.trim();

if (cleanTitle.length < 3) {
    return res.status(400).json({
        message: "Task must contain at least 3 characters"
    });
}

if (cleanTitle.length > 100) {
    return res.status(400).json({
        message: "Task must not exceed 100 characters"
    });
}

const onlySpecialCharacters = /^[^A-Za-z0-9\s]+$/;

if (onlySpecialCharacters.test(cleanTitle)) {
    return res.status(400).json({
        message: "Task cannot contain only special characters"
    });
}

        const todo = await Todo.create({
            title: cleanTitle,
            description: description,
            dueDate: dueDate,
            priority: priority,
            category: category,
            userId: req.user.userId
        });

        res.status(201).json({
            message: "Task added successfully",
            todo: todo
        });

    } catch (error) {
        res.status(500).json({
            message: "Error adding task"
        });
    }
});
router.get("/",verifyToken,async (req,res)=>{
    try{
        const todos=await Todo.find({
            userId:req.user.userId
        }).sort({
            createdAt:-1
        });
        res.status(200).json({
            todos:todos
        });

    }
    catch(error){
        res.status(500).json({
            message:"Error to Fetch"
        });
    }
});
router.put("/:id", verifyToken, async (req, res) => {
    try {

        const {
            title,
            description,
            dueDate,
            priority,
            category
        } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Task title is required"
            });
        }

        const cleanTitle = title.trim();

        if (cleanTitle.length < 3) {
            return res.status(400).json({
                message: "Task must contain at least 3 characters"
            });
        }

        if (cleanTitle.length > 100) {
            return res.status(400).json({
                message: "Task must not exceed 100 characters"
            });
        }

        const onlySpecialCharacters =
            /^[^A-Za-z0-9\s]+$/;

        if (onlySpecialCharacters.test(cleanTitle)) {
            return res.status(400).json({
                message: "Task cannot contain only special characters"
            });
        }

        const todo = await Todo.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.userId
            },
            {
                title: cleanTitle,
                description: description || "",
                dueDate: dueDate || undefined,
                priority: priority || undefined,
                category: category || undefined
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!todo) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task updated successfully",
            todo: todo
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Error updating task"
        });
    }
});
router.delete("/:id", verifyToken, async (req, res) => {
    try {

        const todo = await Todo.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!todo) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting task"
        });
    }
});
router.patch("/:id", verifyToken, async (req, res) => {
    try {

        const { completed } = req.body;

        const todo = await Todo.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.userId
            },
            {
                completed: completed
            },
            {
                new: true
            }
        );

        if (!todo) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task status updated",
            todo: todo
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating task status"
        });
    }
});
module.exports=router;