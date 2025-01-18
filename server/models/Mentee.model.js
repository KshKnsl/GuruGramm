const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const menteeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    dob: { type: Date },
    avatar: { type: String }, // For profile picture
    bio: { type: String },
    socialLinks: { type: [String], default: [] },
    interests: { type: [String], default: ["Reading"] },
    readArticles: { type: [mongoose.Schema.Types.ObjectId], ref: "Article", default: [] },
    lastRead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
    }
  },
  { timestamps: true }
);

menteeSchema.pre("save", async function (next) 
{
  if(this.password === undefined || this.password.length==0) this.password= "GooGleAuthAccount";
  if (!this.isModified("password"))
    next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

menteeSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Mentee", menteeSchema);