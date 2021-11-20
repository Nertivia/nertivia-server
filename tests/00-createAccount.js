module.exports = function() {
    describe('Create Account', () => {
		describe(`GET /api/${apiVersion}/users/create`, function() {
			it('creates a user', function(done) {
			  request.post(`/api/${apiVersion}/users/create`)
				.send({email: 'test@test.com', username: "test", password: "test123"})
				.expect(200)
				.end(function(err, res) {
				  done(err);
				});
			});
		});
	});
};
