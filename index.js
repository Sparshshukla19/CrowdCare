// require('dotenv').config();
// const ejs = require('ejs');
// const express = require('express');
// const mongoose = require('mongoose');
// const multer = require('multer');
// const path = require('path');
// const session = require('express-session');
// const methodOverride = require('method-override');
// const Issue = require('./models/issue');

// const app = express();

// // --- MongoDB Connection ---
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log(" MongoDB Connected"))
//   .catch(err => console.log(err));

// // --- Middleware ---
// app.set('view engine', 'ejs');
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride('_method'));
// app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
// app.use((req, res, next) => {
//   res.locals.session = req.session; // makes session available in EJS
//   next();
// });


// // --- Multer Setup for Uploads ---
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'public/uploads/'),
//   filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
// });
// const upload = multer({ storage });

// // Home page (can be used later for map or intro)
// app.get('/', (req, res) => {
//   res.render('index'); // You can make this a simple welcome page later
// });

// // New route for listing issues
// app.get('/issues', async (req, res) => {
//   const issues = await Issue.find().sort({ createdAt: -1 });
//   res.render('issues', { issues });
// });


// app.get('/report', (req, res) => res.render('report'));

// app.post('/report', upload.single('image'), async (req, res) => {
//   const { title, description, location } = req.body;
//   const newIssue = new Issue({
//     title,
//     description,
//     location,
//     image: req.file ? '/uploads/' + req.file.filename : null
//   });
//   await newIssue.save();
//   res.redirect('/');
// });
// //2 NEW FEATURES
// // --- Upvote route ---
// app.post('/issue/:id/upvote', async (req, res) => {
//   const issue = await Issue.findById(req.params.id);
//   if (issue) {
//     issue.upvotes++;
//     await issue.save();
//   }
//   res.status(200).send('ok');
// });

// // --- Comment route ---
// app.post('/issue/:id/comment', async (req, res) => {
//   const issue = await Issue.findById(req.params.id);
//   if (issue) {
//     issue.comments.push({ text: req.body.comment });
//     await issue.save();
//   }
//   res.redirect('back');
// });

// // --- Server Start ---
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`));
 






















require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const methodOverride = require('method-override');
const Issue = require('./models/issue');

const app = express();

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Connection Error:", err));

// --- Middleware ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// --- Multer Setup ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// --- ROUTES ---

// ✅ Home Page
app.get('/', (req, res) => {
  res.render('home');
});

// ✅ Community Listings
app.get('/issues', async (req, res) => {
  const issues = await Issue.find().sort({ createdAt: -1 });
  res.render('community', { issues });
});

// ✅ Report Form
app.get('/new', (req, res) => {
  res.render('new');
});

// ✅ Create New Issue
app.post('/issues', upload.single('image'), async (req, res) => {
  const { title, description,lat, lng } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
  // await Issue.create({ title, description, image: imagePath, upvotes: 0, location: { lat, lng } });
   const issue = new Issue({
    title,
    description,
    image: req.file ? `/uploads/${req.file.filename}` : "",
    location: { lat, lng },
    upvotes: 0
  });

  await issue.save();
  res.redirect('/issues');
});
app.get('/issues/new', (req, res) => {
  res.render('new');
});
// ✅ Show Single Issue
app.get('/issues/:id', async (req, res) => {
  const issue = await Issue.findById(req.params.id);
  res.render('show', { issue });
});

// ✅ Upvote
app.post('/issues/:id/upvote', async (req, res) => {
  const issue = await Issue.findById(req.params.id);
  issue.upvotes += 1;
  await issue.save();
  res.redirect(`/issues/${issue._id}`);
});

// --- Server ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
