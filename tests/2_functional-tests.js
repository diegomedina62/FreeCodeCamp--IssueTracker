const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { application } = require('express');

chai.use(chaiHttp);


let IDForTesting

suite('Functional Tests', function() {
    suite("POST Test",()=>{
      test("1. Create an issue with every field",(done)=>{
        
      chai.request(server)
      .post("/api/issues/test")
      .send({
        issue_title:"IssueTitleTest",
          issue_text:"issueTextTest",
          created_by:"test",
          assigned_to:"asignTest",
          status_text:"statusTest"        
        })
      .end((err,res)=>{
        assert.equal(res.status,200);
        IDForTesting=res.body._id;
        titleForTesting=res.body.issue_title
        assert.include(res.body,{
          issue_title:"IssueTitleTest",
            issue_text:"issueTextTest",
            created_by:"test",
            assigned_to:"asignTest",
            status_text:"statusTest"        
          })
        
        done()
      })
    })
    test("2. include only required fields",(done)=>{
      chai.request(server)
      .post("/api/issues/test")
      .send({
        issue_title:"IssueTitleTest",
          issue_text:"issueTextTest",
          created_by:"test",
          assigned_to:"",
          status_text:""        
        })
      .end((err,res)=>{
        assert.equal(res.status,200)
        assert.include(res.body,{
          issue_title:"IssueTitleTest",
          issue_text:"issueTextTest",
          created_by:"test",
          assigned_to:"",
          status_text:""        
        })
        done()
      })

    })
    test("3.Create an issue with missing required fields",(done)=>{
      chai.request(server)
      .post("/api/issues/test")
      .send({
        issue_title:"",
          issue_text:"",
          created_by:"",
          assigned_to:"testAssigned",
          status_text:""        
        })
      .end((err,res)=>{
        assert.equal(res.status,200)
        assert.equal(res.body.error, "required field(s) missing")
        done()
      })
    })
  })

  suite("GET test",()=>{
    test("4. View issues on a project",(done)=>{
      chai.request(server)
      .get("/api/issues/test")
      .end((err,res)=>{
        assert.equal(res.status,200)
        assert.isArray(res.body)
        done()
      })
      
    })
    test("5. View issues on a project with one filter",(done)=>{
      chai.request(server)
      .get("/api/issues/test")
      .query({_id:IDForTesting})
      .end((err,res)=>{
        assert.equal(res.status,200)
        assert.include(res.body[0],{
          issue_title:"IssueTitleTest",
            issue_text:"issueTextTest",
            created_by:"test",
            assigned_to:"asignTest",
            status_text:"statusTest"        
          })
          done()
      })

    })
    test("6. View issues on a project with multiple filters",(done)=>{
      chai.request(server)
      .get("/api/issues/test")
      .query({_id:IDForTesting,created_by:"test"})
      .end((err,res)=>{
        assert.equal(res.status,200)
        assert.include(res.body[0],{
          issue_title:"IssueTitleTest",
            issue_text:"issueTextTest",
            created_by:"test",
            assigned_to:"asignTest",
            status_text:"statusTest"        
          })
        done()
      })

    })

  })

  suite("POST test",()=>{
    test("7. Update one field on an issue",(done)=>{
      chai.request(server)
      .put("/api/issues/test")
      .send({_id:IDForTesting, issue_title:"put test different"})
      .end((err,res)=>{
        assert.equal(res.status,200)
        assert.equal(res.body.result,"successfully updated")
        done()
      })
    })
    test("8. Update multiple fields on an issue",(done)=>{
      chai.request(server)
      .put("/api/issues/test")
      .send({_id:IDForTesting, issue_title:"put test, different",issue_text:"put test different"})
      .end((err,res)=>{
        assert.equal(res.status,200)
        assert.equal(res.body.result,"successfully updated")
        done()
      })

      
    })
    test("9. Update an issue with missing _id",(done)=>{
      chai.request(server)
      .put("/api/issues/test")
      .send({issue_title:"put test, different",issue_text:"put test different"})
      .end((err,res)=>{
        assert.equal(res.status,200)
        assert.equal(res.body.error,"missing _id")
        done()
      })

      
    })
    test("10. Update an issue with no fields to update",(done)=>{
      chai.request(server)
      .put("/api/issues/test")
      .send({_id:IDForTesting})
      .end((err,res)=>{
        assert.equal(res.status,200)
        assert.equal(res.body.error,"no update field(s) sent")
        done()
      })


      
    })
    test("11. Update an issue with an invalid _id",(done)=>{
      chai.request(server)
      .put("/api/issues/test")
      .send({_id:"invalid",issue_title:"put test, different"})
      .end((err,res)=>{
        assert.equal(res.status,200)
        assert.equal(res.body.error,"could not update")
        done()
      })
    })

  })

  suite("DELETE Test",()=>{
    test("12. Delete an issue",(done)=>{
      chai.request(server)
      .delete("/api/issues/test")
      .send({_id:IDForTesting})
      .end((err,res)=>{
        assert.equal(res.status,200)
        assert.equal(res.body.result,"successfully deleted")
        done()
      })
    })
    test("13. Delete an issue with invalid _id",(done)=>{
      chai.request(server)
      .delete("/api/issues/test")
      .send({_id:"invalid"})
      .end((err,res)=>{
        assert.equal(res.status,200)
        assert.equal(res.body.error,"could not delete")
        done()
      })
    })
    test("14. Delete an issue with missing _id",(done)=>{
      chai.request(server)
      .delete("/api/issues/test")
      .send({})
      .end((err,res)=>{
        assert.equal(res.status,200)
        assert.equal(res.body.error,"missing _id")
        done()
      })
    })

  });
})
