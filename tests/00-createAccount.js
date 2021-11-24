module.exports = function() {
    describe('Create Account', () => {
		describe(`POST /api/${apiVersion}/users/create`, function() {
			it('Creates a user', function(done) {
				global.email = Math.random() + "@test.com"
				request.post(`/api/${apiVersion}/users/create`)
				.send({email: global.email, username: "test", password: "test123"})
				.expect(200)
				.end(function(err, res) {
					if (err) {
						console.log(err);
						done(err);
					}
					
					global.userToken = res.body.token;
					done(err);
				});
			});
		});
	});
};
