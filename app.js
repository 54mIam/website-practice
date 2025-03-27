import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";


import dotenv from "dotenv";
dotenv.config();


const app = express();
const port = process.env.PORT || 4000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const auther = {
    image: "auther.jpeg",
    name: "Sir-kayos",
    email: "sammieb38@gmail.com",
    phone: "555-555-5555",
    socialMedia:{
        instagram: "https://www.instagram.com/",
        twitter:"https://twitter.com/",
        tiktok:"https://www.tiktok.com/",
    },

    description:  ` Hello there, My name is olukayode oshonaike, but you can call me Sir Kay...
    i am a painter by hobby , 
    a healthcare worker by day and a web developer by night.
    I am a self taught web developer, who is always looking for new ways to improve my skills.
    I am always looking for new projects to work on, so feel free to reach out to me.
    I am very passionate about my work and i am always looking for new ways to improve my skills.
            `

        }

const images= [
{ id:1,
     image:"eve.jpeg",
   title: "Eve", 
   description:` Here is a look at Eve-Adam
    in the Garden of Eden,
    where the Tree of Knowledge stood.  `,
    comments:[]
 },
    {id:2,
   image:"grassPlain-sunset.jpeg",
   title:" Grass Plains",
   description: `A nice view of a sunset,
       emulating a perfect set megenta clouds
    `,
    comments:[]
},
    {id:3,
      image:"green-stairs.jpeg",
      title:"Path to Emrald City",
      description:``,
      comments:[]
    },{id:4,
      image:"luna.jpeg",
      title:"Gaia",
      desscription:``,
      comments:[]

    },

]

const webPages = [
   
        {
            id:"gallery",
            image:"artGallery.png",
            title:"Art Portfolio"
        },
        {
            id:"games", 
            image:"auther.jpeg",
            
            title:"Game Lab"},
        {
                id:"jsProjects",
                image:"auther.jpeg",
                title:"JavaScript Projects",
            
        }
    ]
const projects =[
            {id:'dicee',
            title:"Dice Game",
            image:"diceRoll.png",
            },
            {
                id:"simonSays",
                title:"Simon Says",
                image:"simonSays.png",
            }

    ]


app.get("/", (req, res) => {
    res.render("index", {webPages, auther});
});

app.get("/about", (req, res) => {
    res.render("about", {auther});
});

app.get("/contact", (req, res) => {
    res.render("contact", {auther});
});

app.get("/gallery", (req, res) => {
    res.render("pages/gallery", {images});
    
});
app.get('/games', (req,res) =>{
    res.render('pages/games', {projects, images});
})

app.get("/projects/:id", (req, res) => {
    const projectId = req.params.id;
    const project = projects.find((project) => project.id == projectId);
    if (project) {
      res.render(`pages/projects/${project.id}`, { project, images });
    } else {
      res.render("404");
    }
  });


app.get('/pages/:id', (req,res) =>{
   const pageId = req.params.id;
   const page = webPages.find((page) => page.id == pageId);
   if (page){
      res.render(`pages/${page.id}`, {page, projects, images});
   }else{
      res.render('404');
   }
}) 

app.post("/contact", (req, res) => {  
    const { name, email, message } = req.body;
    console.log(`Received message from ${name} (${email}): ${message}`);
    
    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Email options
    const mailOptions = {
        from: process.env.EMAIL_USER, // Must match the authenticated email
        to: "sammieb38@gmail.com", // Your email
        replyTo: email, // The sender's email from the form
        subject: `Contact Form Submission from ${name}`,
        text: `You have received a new message from ${name} (${email}):\n\n${message}`,
        html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
    `
    };


    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.send("There was an error sending the email. Please try again later.");
        } else {
            console.log("Email sent: " + info.response);
            res.render("contact", { auther, successMessage: "Your message has been sent successfully!" });
        }
    });
});

//tester
app.get("/test-email", (req, res) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: "sammieb38@gmail.com",
        subject: "Test Email",
        text: "This is a test email from your application."
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error:", error);
            res.send("Error: " + error.message);
        } else {
            console.log("Email sent: " + info.response);
            res.send("Test email sent successfully!");
        }
    });
});

app.post("/comment", (req, res) => {
    const { imageId, comment } = req.body;
    console.log(`recieved comment ${comment} for image ${imageId}`);
    const image = images.find(img => img.id == imageId);

    if (image) {
        if (!image.comments) {
            image.comments = [];
            console.log(`created comments array for image ${imageId}`);
        }
        image.comments.push(comment);
        console.log(`updated comments for image ${imageId}`, image.comments );
    }else{
        console.log(`image not found ${imageId}`);
    }

    res.redirect("/gallery");
});

app.post('/delete-comment', (req, res) => {
    const { imageId, commentIndex } = req.body;
    const image = images.find(img => img.id == imageId);

    if (image && image.comments && image.comments.length > commentIndex) {
        image.comments.splice(commentIndex, 1);
    }

    res.redirect('/gallery');
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);

    console.log("Email User:", process.env.EMAIL_USER);
console.log("Email Pass:", process.env.EMAIL_PASS);
});