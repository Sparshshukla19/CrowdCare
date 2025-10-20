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
