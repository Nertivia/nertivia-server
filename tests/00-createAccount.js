module.exports = function() {
    describe('Create Account', () => {
		describe(`POST /api/${apiVersion}/users/create`, function() {
			it('Creates a user', function(done) {
				global.email = Math.random() + "@test.com"
				request.post(`/api/${apiVersion}/users/create`)
				.send({email: global.email, username: "test", password: "test123"})
				.expect(200)
				.end(function(err, res) {

					global.userToken = res.body.token;
					done(err);
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
						done(err);
					} else {
						done();
					}
				});
			});
		});
	});
};
