const mongoose = require("mongoose")

//creation of schema 

const IssueSchema = new mongoose.Schema({ 
    
    issue_title:{type:String,required:[true,'required field(s) missing' ]}, 
    issue_text: {type:String,required:[true,'required field(s) missing' ]},
    created_by: {type:String,required:[true,'required field(s) missing']},
    assigned_to: {type:String,default:""},
    status_text: {type:String,default:""},
    open: {type:Boolean,default:true}
  },{timestamps:{createdAt:"created_on",updatedAt:"updated_on"}})

const ProjectSchema = new mongoose.Schema({
 projectName:String,
 issues:[IssueSchema] 
})


const Project=mongoose.model("Project",ProjectSchema)

module.exports={
  IssueSchema,Project
} 