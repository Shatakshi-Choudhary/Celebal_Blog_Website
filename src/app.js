const express=require("express");
const session = require("express-session");
const path=require("path");
const app=express();
const hbs=require("hbs");
require("./db/conn");

const Register=require("./models/userRegisters");
const SignedInModel = require("./models/signregisters"); // Add this line to import the Signed model
const Blog = require("./models/Blog"); 
const searchRoute = require('./models/search');
app.use(searchRoute);
const port=process.env.PORT || 3000;    // To automatically generate port


const static_path=path.join(__dirname,"../public");
const templates_path=path.join(__dirname,"../templates/views");
const partials_path=path.join(__dirname,"../templates/partials");
const static_pathimg=path.join(__dirname, '../images')
// console.log(path.join(__dirname,"../public"));

// Connect to your MongoDB database

app.use(
    session({
      secret: "mysecretkey123", // Replace with a secret key for session data encryption
      resave: false,
      saveUninitialized: true,
    })
  );
  

app.use(express.static(static_pathimg));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path))
app.set("view engine","hbs")
app.set("views",templates_path);
hbs.registerPartials(partials_path);

app.get("/",(req,res)=>{
    res.render("index")
});

app.get("/register",(req,res)=>{
    res.render("register");
})

app.get("/blog",(req,res)=>{
    res.render("blog");
})

app.get("/contact",(req,res)=>{
    res.render("contact");
})

app.get("/search",(req,res)=>{
    res.render("search");
})
app.get("/signup", (req, res) => {
    res.render("signup"); 
  });

app.get("/create", (req, res) => {
   res.render("create"); // Assuming you have a "signup.hbs" file in your views directory
  });
  app.get("/index", (req, res) => {
    res.render("index"); // Assuming you have a "signup.hbs" file in your views directory
  });
  

  
  //-------------LOG OUT-----------------------

//   app.post("/logout", (req, res) => {
    // Clear the session and redirect to the homepage or login page
    // req.session.destroy((err) => {
        // if (err) {
            // console.error("Error during logout:", err);
        // }
        // res.redirect("/"); // Replace with your desired redirect URL (e.g., "/login")
    // });
// });


  app.get("/logout", (req, res) => {
    // Clear the user session and redirect the user to the login page or any other page you prefer
    req.session.user = null;
    res.redirect("/register");
  });
// 
  const checkLoggedIn = (req, res, next) => {
    if (req.session.user) {
    //   User is logged in, proceed to the next middleware or route handler
      next();
    } else {
    //   User is not logged in, redirect to the login page
      res.redirect("/signup");
    }
  };

   
  //-------------LOG OUT-----------------------

  app.post("/signup", async (req, res) => {
    try {
      const { username, email, password, cpassword } = req.body;

      // Check if the user already exists in the database
    const existingUser = await SignedInModel.findOne({ email });
    if (existingUser) {
      return res.send("User already exists.");
    }

    // Match passwords
      if (password !== cpassword) {
        return res.send("Passwords do not match");
      }
  
      const signedin = new SignedInModel({
        username: username,
        email: email,
        password: password,
        cpassword: cpassword,
      });
  
      const result = await signedin.save();
    //   res.send("User registered successfully!");
      res.status(201).render("logout");
    } catch (error) {
      res.status(400).send(error.message);
    }
  });
  

/*
// Create new user
app.post("/register",async(req,res)=>{
    try{ 
        const { email, password } = req.body;
        console.log("Received login request for email:", email);
        const user = await SignedInModel.findOne({ email });
        console.log("User found in the database:", user);
        if (!user) {
        const alertScript = "<script>alert('User not found. Please sign up.');</script>";
        // Redirect the user to the signup page after a short delay
        const redirectScript = "<script>setTimeout(function() { window.location.href = '/signup'; }, 1000);</script>";

        // Send the response with both the alert and the redirect script
        return res.send(alertScript + redirectScript);
        }

//--------------------------------------------------------

if (password !== user.password) {

    const alertScript = "<script>alert('Invalid password. Please try again');</script>";
const redirectScript = "<script>setTimeout(function() { window.location.href = '/register'; }, 1000);</script>";
return res.send(alertScript + redirectScript);
  }
//--------------------------------------------------------

const Ppassword=req.body.cpassword;
        if(password==Ppassword)
        {
            const registers=new Register({
                email:req.body.email,
                password:req.body.password,
                Ppassword: req.body.cpassword
            })
            const reg=await registers.save();
            req.session.user = user; // Assuming you are using express-session for session management
            console.log("Login successful.");
            // res.redirect("contact");

        }
        else
        {
            res.send("password not matching");
        }
res.status(201).render("logout");
    }catch(error)
    {
        console.error("Error during login:", error);

        res.status(400).send(error);
    }
})
*/

// Login route
app.post("/register", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Retrieve the user's stored credentials from the database
      const user = await SignedInModel.findOne({ email });
  
      if (!user || user.password !== password) {
        return res.send("Invalid email or password.");
      }
  
      // Set the user session after successful login
      req.session.user = user;
  
      // Redirect to the home page or any other authenticated route
      res.redirect("/index");
    } catch (error) {
      res.status(400).send(error.message);
    }
  });
  
/*
// Route to handle form submission for writing or editing a blog post
app.post("/create", async (req, res) => {
    try {
      const { title, content } = req.body;
  
      // Validate that title and content fields are not empty strings
    //   if (!title || !content) {
        // return res.status(400).send("Title and content are required.");
    //   }
  
      const blog = new Blog({
        title: req.body.title,
        content: req.body.content,
      });
  
      const result = await blog.save();
      res.status(201).render("search");
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong.");
    }
  });
*/

app.get("/search", async (req, res) => {
    try {
      const { query } = req.query;
      const results = await BlogPost.find({
        $or: [{ title: { $regex: query, $options: "i" } }, { content: { $regex: query, $options: "i" } }],
      });
  
      // Render the "search_results" view with the search results
      res.render("search_results", { results });
    } catch (error) {
      console.error("Error during search:", error);
      res.status(500).json({ success: false, message: "An error occurred during search." });
    }
  });
// Route for creating a new blog post
app.post('/create', (req, res) => {
    const { title, content } = req.body;
  
    // Validate the input fields
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Please provide both title and content.' });
    }
  
    // Create a new instance of the BlogPost model with the provided data
    const newBlogPost = new BlogPost({
      title,
      content,
      // You can also include the author's user ID or any other relevant data here
    });
  
    // Save the new blog post to the database
    newBlogPost.save()
      .then(() => {
        res.json({ success: true, message: 'Blog post created successfully.' });
      })
      .catch((error) => {
        console.error('Error creating blog post:', error);
        res.status(500).json({ success: false, message: 'Failed to create blog post. Please try again.' });
      });
  });
  
  // Define the search route
//   app.get("/search", async (req, res) => {
    // try {
    //   const query = req.query.query; // Get the search query from the request URL
    //   const results = await Blog.find({ $text: { $search: query } });
//   
    //   res.render("search_results", { results }); // Assuming you have a view named "search_results.hbs"
    // } catch (error) {
    //   res.send("Error fetching search results.");
    // }
//   });
//   

app.listen(port,()=>{
    console.log(`server is running on port number ${port}`);
})

