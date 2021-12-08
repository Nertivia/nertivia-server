module.exports = function() {
    describe('Create Account', () => {
		describe(`POST /api/${apiVersion}/users/create`, function() {
			it('Creates a user', function(done) {
				global.email = Math.random() + "@test.com"
				request.post(`/api/${apiVersion}/users/create`)
				.send({email: global.email, username: "user1", password: "test123"})
				.expect(200)
				.end(function(err, res) {
					if(err) {
						console.log("ERR", res.body)
						done(err);
					} else {
						global.userToken = res.body.token;
						done();
					}
				});
			});
		});

		// create 2 accounts to test the friends feature.
		describe(`POST /api/${apiVersion}/users/create`, function() {
			it('Creates a second user', function(done) {
				global.email2 = Math.random() + "@test.com"
				request.post(`/api/${apiVersion}/users/create`)
				.send({email: global.email2, username: "user2", password: "test123"})
				.expect(200)
				.end(function(err, res) {
					if(err) {
						console.log("ERR", res.body)
						done(err);
					} else {
						global.userToken2 = res.body.token;
						done();
					}
				});
			});
		});


		describe(`POST /api/${apiVersion}/users/create`, function() {
			it('Sends bad data to try crash the server', function(done) {
				request.post(`/api/${apiVersion}/users/create`)
				.send({})
				.expect(400)
				.end(function(err, res) {
					if(err) {
						console.log("ERR", res.body)
						done(err);
					} else {
						done();
					}
				});
			});
		});
	});
};
