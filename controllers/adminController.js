const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { addBusinessDays } = require("date-fns");

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
async function index(req, res) {
  const admins = await Admin.find();
  return res.json(admins);
}

// Display the specified resource.
async function show(req, res) {}

// Show the form for creating a new resource
async function create(req, res) {}

// Store a newly created resource in storage.
async function store(req, res) {
  const admin = new Admin({
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password,
    role_code: "100",
  });

  try {
    await admin.save();
    return res.json("Administrador creado exitosamente");
  } catch (error) {
    console.error("Error al guardar Administrador:", error);
    return res.status(500).json("Error al guardar el Administrador en la base de datos");
  }
}

// Show the form for editing the specified resource.
async function edit(req, res) {}

// Update the specified resource in storage.
async function update(req, res) {
  try {
    const updateData = {
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    };

    if (req.body.password) {
      const password = await bcrypt.hash(req.body.password, 8);
      updateData.password = password;
    }

    await Admin.findByIdAndUpdate(req.params.id, updateData);

    return res.json("Admin ha sido editado");
  } catch (error) {
    console.error("Error al editar el admin:", error);
    return res.json("Failed editing requested admin");
  }
}

// Remove the specified resource from storage.
async function destroy(req, res) {
  try {
    await Admin.findByIdAndDelete(req.params.id);

    return res.json("Admin ha sido eliminado");
  } catch {
    return res.json("Failed deleting requested admin");
  }
}

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
