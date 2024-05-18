import express from "express";
import bodyParser from "body-parser";
import path from "path";
import multer from "multer";

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");


const storage = multer.diskStorage({
  destination: "./public/images",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});


let upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, 
}).single("imageUrl");


const defaultPosts = [
  {
    id: 1,
    title: "  HeratGrandMosque",
    description:
      "Herat Grand Mosque: One of the largest and most beautiful mosques in Afghanistan, also known as the Friday Mosque of Herat, dating back to the Ghaznavid and Seljuk periodsA historic fortress that dates back to the time of Alexander the Great and has been rebuilt by various kings over the centuries The tomb of Queen Gawhar Shad, the wife of Shah Rukh Timurid, and one of the beautiful and historical buildings of Herat",
    imageUrl: "images/HeratGrandMosque1.jpg",
  },
  {
    id: 2,
    title: "AkhtaruddinCastle",
    description:
      "A historic fortress that dates back to the time of Alexander the Great and has been rebuilt by various kings over the centuries...",
    imageUrl: "images/AkhtaruddinCastle2.jpg",
  },
  {
    id: 3,
    title: "The minarets of Herat",
    description:
      "Including five historical minarets from the Timurid period, which are among the prominent architectural works of that era..",
    imageUrl: "images/The minarets of Herat3.jpg",
  },
  {
    id: 4,
    title: "Minar Jam",
    description:
      "Jam minaret is one of the famous minarets of Ghor province, whose height is 64 meters. It was built near a mountain during the Ghorian period..",
    imageUrl: "images/Minar Jam4.jpg",
  },

];

let posts = [...defaultPosts];

app.get("/", (req, res) => {
  res.render("index", { posts });
});

app.get("/newpost", (req, res) => {
  res.render("newpost");
});

app.post("/newpost", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error(err);
    } else {
      let { title, description } = req.body;
      let imageUrl = req.file ? `/images/${req.file.filename}` : null;
      let id = Date.now(); 

      const newPost = { id, title, description, imageUrl };
      posts.push(newPost);

      res.redirect("/");
    }
  });
});

app.get("/edit/:id", (req, res) => {
  let postId = parseInt(req.params.id);
  let post = posts.find((post) => post.id === postId);
  res.render("edit", { post });
});

app.post("/edit/:id", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error(err);
      
      
     const postId = parseInt(req.params.id);
      let { title, description } = req.body;
      let imageUrl = req.file ? `/images/${req.file.filename}` : null;
      const id = Date.now(); 
      let index = posts.findIndex((post) => post.id === postId);
  if (index !== -1) {
    posts[index].title = title;
    posts[index].description = description;
    if (imageUrl) {
      posts[index].imageUrl = imageUrl;
    }
  }
      res.redirect("/");
    }
  });
});


app.post("/delete/:id", (req, res) => {
  let postId = parseInt(req.params.id);
  posts = posts.filter((post) => post.id !== postId);

  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
