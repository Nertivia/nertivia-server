module.exports = function() {
    describe('Login Account', () => {
		describe(`POST /api/${apiVersion}/users/login`, function() {
			it('login to the user', function(done) {
			  request.post(`/api/${apiVersion}/users/login`)
				.send({email: global.email,  password: "test123"})
				.expect(200)
				.end(function(err, res) {
					if (global.userToken !== res.body.token) {
						done(new Error("Token does not match. with created account."))
						return;
					}
					done(err);
				});
			});
		});

		describe(`POST /api/${apiVersion}/users/login`, function() {
			it('login to the user', function(done) {
			  request.post(`/api/${apiVersion}/users/login`)
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
