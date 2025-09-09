const mongoose = require("mongoose")

const CreateTeamSchema= new mongoose.Schema({
  sport: { type: String, required: true },
  teamType: { type: String, required: true }, 
  ageGroup: { type: String, required: true }, 
  location: { type: String },
  teamName: { type: String, required: true }, 
  season: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model("CreateTeam",CreateTeamSchema)