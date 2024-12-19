const express = require('express');
const dotenv = require("dotenv")
dotenv.config();
const sequelize = require('./config/sequelize')
const user = require("./models/user");
const app = express()
app.use(express.json())
const task = require('./model/task');

//to register/login
app.post("/register", async (req, res) => {
    try {
        const{name, email, password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({Message : "Please fill the informations correctly"})
        }
const userExists = User.findOne({where : {email}});
if(userExists){
    return res.status(401).json({message: "User already exists"})
}const secretPassword = await bycrypt(password, 10);
const newUser = {name, email, password : secretPassword,};
await User.create(newUser);
res.status(201).json({message : "User created successfully"});

    } catch (error) {
        console.log(error); 
    }
   
})

app.post('/login', async (req, res) => {
    const { email, password} = req.body;

    try {
        const user = await User.findOne({ where: { email}});

        if(!user) {
            return res.status(400).json({ message: `Incorrect email or password`});
        };
        const checkPassword = await bcrypt.compare(password, user.password);

        if(!checkPassword) {
            return res.status(400).json({ message: 'Incorrect email or password'});
        }
        const accessToken = jwt.sign(
            {id: user.id, name: user.name , email: user.email}, 
            process.env.JWT_KEY
        );

        return res.status(200).json({ message: "Login successful"});

    } catch (error) {
        res.status(500).json({ message: `Internal Server Error ${error.message}`})
        console.log(error);
    };
});

app.post('/admin/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email}});
        if(!user) {
            return res.status(400).json({ message: `Incorrect email or password`});
        }

        if(user.role !== 'admin') {
            return res.status(403).json({ message: `Access denied`});
        }

        const checkPassword = bcrypt.compare(password, user.password);

        if(!checkPassword) {
            return res.status(400).json({ message: `Incorrect email or password`});
        };
        const accessToken = jwt.sign(
            {id: user.id, name: user.name, email: user.email },
            process.env.JWT_KEY
        );

        return res.status(200).json({ message: 'Login successfully'});
    }catch (error) {
        res.status(500).json({ message: `Internal server error ${error.message}` });
        console.log(error);
    };
});


app.get('/users', async(req, res) => {
    try{
        const users = await User.findAll();
        if(!users) {
            return res.status(404).json({ message: `No user found`});
        };
        return res.status(200).json({ message: `All users retrieved successfully`, users});

    } catch (error) {
        res.status(500).json({ message: `Internal server error ${error.message}` });
        console.log(error);
    };
});




app.listen(3000, async (req, res) => {
    try {
    await sequelize.authenticate();
    console.log('server is running on http://localhost:3000')
    } catch(error) {
        console.log(error)
    }
}) 
