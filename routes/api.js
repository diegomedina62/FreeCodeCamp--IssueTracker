"use strict";
const {
  postNewIssue,
  getIssues,
  updateIssue,
  deleteIssue,
} = require("../controlers/controllers");

module.exports = function (app) {
  app
    .route("/api/issues/:project")
    .get(getIssues)
    .post(postNewIssue)
    .put(updateIssue)
    .delete(deleteIssue);
};

