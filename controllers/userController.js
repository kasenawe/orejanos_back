const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function token(req, res) {
  const admin = await Admin.findOne({ username: req.body.username });

  if (!admin) {
    return res.json({ error: "Credenciales inválidas" });
  } else if (!(await admin.comparePassword(req.body.password))) {
    return res.json({ error: "Credenciales inválidas" });
  } else {
    const token = jwt.sign({ id: admin.id }, process.env.SESSION_SECRET);

    return res.json({
      token,
      id: admin.id,
      firstname: admin.firstname,
      lastname: admin.lastname,
      username: admin.username,
    });
  }
}

// Display a listing of the resource.
async function index(req, res) {}

// Display the specified resource.
async function show(req, res) {}

// Show the form for creating a new resource
async function create(req, res) {}

// Store a newly created resource in storage.
async function store(req, res) {}

// Show the form for editing the specified resource.
async function edit(req, res) {}

// Update the specified resource in storage.
async function update(req, res) {}

// Remove the specified resource from storage.
async function destroy(req, res) {}

// Otros handlers...
// ...

module.exports = {
  token,
  index,
  show,
  create,
  store,
  edit,
  update,
  destroy,
};
