const express = require("express")
const User = require("./users/model.js")

const server = express()

server.use(express.json())


//GET
server.get("/api/users", (req,res) => {
    User.find()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(err => {
            res.status(500).json({message: "The users information could not be retrieved"})
        })
})

//GET BY ID
server.get("/api/users/:id", (req,res) => {
    const userId = req.params.id
    User.findById(userId)
        .then(user => {
            if(!user){
                res.status(404).json({ message: "The user with the specified ID does not exist" })
            }else{
                res.status(200).json(user)
            }
        })
        .catch(err => {
                res.status(500).json({message: "The user information could not be retrieved"})
            })
})

//POST
server.post("/api/users", (req,res) => {
    const newUser = req.body
    if(!newUser.name || !newUser.bio){
        res.status(400).json({message: "Please provide name and bio for the user"})
    }else{
        User.insert(newUser)
            .then(user => {
                res.status(201).json(user)
            })
            .catch(err => {
                res.status(500).json({message: "There was an error while saving the user to the database"})
            })
    }
})

//UPDATE
server.put('/api/users/:id', async (req,res) => {
    const changes = req.body
    const userId = req.params.id
    try {
        if(!changes.name || !changes.bio){
            res.status(400).json({message: "Please provide name and bio for the user"})
        } else{
            const updatedUser = await User.update(userId, changes)
            if(!updatedUser){
                res.status(404).json({message: "The user with the specified ID does not exist"})
            } else {
                res.status(200).json(updatedUser)
            }
        }
    } catch {
        res.status(500).json({message: "The user information could not be modified"})
    }
})

//DELETE
server.delete('/api/users/:id', async (req,res) => {
    const userId = req.params.id
    
    try{
        const deletedUser = await User.remove(userId)
        if(!deletedUser){
            res.status(404).json({message: "The user with the specified ID does not exist"})
        } else {
            res.status(200).json({message: "User removed"})
        }
    }catch{
        res.status(500).json({message: "The user could not be removed"})
    }
})

server.use("*",(req, res) => {
    res.status(404).json({message: "Error 404 not found"})
})


module.exports = server; // EXPORT YOUR SERVER instead of {}
