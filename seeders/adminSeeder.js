const Admin = require("../models/Admin");

module.exports = async () => {
  const admin = await new Admin({
    firstname: "Maximiliano",
    lastname: "Quintana",
    username: "admin",
    password: "kasenawe",
    role_code: "100",
  });

  await admin.save();

  console.log("[Database] Se corrió el seeder de Admins.");
};
