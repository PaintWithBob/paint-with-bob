
//NOTE: All tests pass if and only if you do not currently have a user named "aaaaa" in your mongodb database.
//Otherwise the first "create user" will fail, as it is attempting to create a new user that isn't currently in the database.

var request = require('supertest');
describe('loading express', function () {
  var server;
  var user;

  beforeEach(function () {
    server = require('../bin/www');
  });
  afterEach(function () {
    server.close();
  });
  //checks for 200 (successful)
  it('responds to /', function testSlash(done) {
  request(server)
    .get('/')
    .expect(200, done);
  });
  //does it give back 404
  it('404 everything else', function testPath(done) {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });
  //create user
  it('create user', function testPath(done){
    request(server)
      .post('/users/join')
      .type('form')
      .send({
	       "username":"aaaaa",
	       "email":"user3@user.com",
         "password":"123455"
       })
      .expect(200)
      .end(function (err, res) { done(); });
  });

  it('create user (already created)', function testPath(done){
    request(server)
      .post('/users/join')
      .type('form')
      .send({
	       "username":"aaaaa",
	       "email":"user3@user.com",
         "password":"123455"
       })
      .expect(409)
      .end(function (err, res) { done(); });
  });


  it('login (correct)', function testPath(done){
    request(server)
      .post('/users/login')
      .type('form')
      .send({
	       "username":"aaaaa",
	       "email":"user3@user.com",
         "dummyjson": "toomuchdata",
         "password":"123455"
       })
       .expect(200)
       .end(function (err, res) {
         user = res.body.user;
         done(); });
   });

   it('login (wrong password)', function testPath(done){
     request(server)
       .post('/users/login')
       .type('form')
       .send({
 	       "username":"aaaaa",
 	       "email":"user3@user.com",
         "password":"12345WRONG"
        })
        .expect(401)
        .end(function (err, res) {  done(); });
    });

    it('delete user', function testPath(done){
      request(server)
         .delete("/user/"+user._id)
         .expect(200)
         .end(function (err, res) { done(); });
     });


     //TODO: testing creating a lobby
     /*
     it('create lobby', function testPath(done)){



     }
     */



});
