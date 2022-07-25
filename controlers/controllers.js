const { query } = require("express");
const { Project, IssueSchema } = require("../Model/models");

const postNewIssue = async (req, res) => {
  try {
    let project = await Project.findOneAndUpdate(
      { projectName: req.params.project },
      {},
      { new: true, upsert: true }
    );

    project.issues.push(req.body);
    newIssue = await project.save();
    res.json(newIssue.issues[newIssue.issues.length - 1]);
    
  } catch (error) {
    if (error.name == "ValidationError") {
      return res.json({ error: "required field(s) missing" });
    }
    res.send(error);
  }
};

const getIssues = async (req, res) => {
  try {
    // if there is no queries...
    if (Object.keys(req.query) == 0) {
      let queryDoc = await Project.findOne({ projectName: req.params.project });
      return res.json(queryDoc.issues);
    }

    //when there is queries...
    let entries = Object.entries(req.query);
    entries.forEach((x) => {
      //transform String "true" into Boolean true
      if (x[0] == "open") {
        x[1] = x[1] === "true";
      }
    });
    let queryDoc = await Project.findOne({ projectName: req.params.project });
    let arrayResponse = [];
    queryDoc.issues.forEach((x) => {
      if (entries.every((y) => y[1] == x[y[0]])) {
        arrayResponse.push(x);
      }
    });
    res.json(arrayResponse);
  } catch (error) {
    res.json(error.name);
  }
};

const updateIssue = async (req, res) => {
  try {
    if (!req.body.hasOwnProperty("_id")) {
      return res.json({ error: "missing _id" });
    }
    const queries = Object.entries(req.body);
    const id = req.body._id;
    const cleanQueries = {};

    queries.forEach((x) => {
      if (x[0] == "_id") {
        return;
      }
      if (x[1]) {
        cleanQueries[x[0]] = x[1];
      }
      if (x[0] == "open") {
        cleanQueries.open = x[1] === "true";
      }
    });

    if (Object.keys(cleanQueries).length == 0) {
      return res.json({ error: "no update field(s) sent", _id: id });
    }

    const project = await Project.findOne({ "issues._id": id });
    const issueToUpdate = project.issues.id(id);
    issueToUpdate.set(cleanQueries);
    await project.save({ validateBeforeSave: false });
    res.json({ result: "successfully updated", _id: id });
  } catch (error) {
    res.json({ error: "could not update", _id: req.body._id });
  }
};

const deleteIssue = async (req, res) => {
  try {
    if (!req.body.hasOwnProperty("_id")) {
      return res.json({ error: "missing _id" });
    }
    const id = req.body._id;
    const project = await Project.findOne({ "issues._id": id });
    let issueToDelete = project.issues.id(id).remove();
    project.save();
    res.json({ result: "successfully deleted", _id: id });
  } catch (error) {
    res.json({ error: "could not delete", _id: req.body._id });
  }
};

module.exports = {
  postNewIssue,
  getIssues,
  updateIssue,
  deleteIssue,
};
