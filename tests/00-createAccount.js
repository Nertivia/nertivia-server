module.exports = function() {
    describe('Create Account', () => {
		describe(`GET /api/${apiVersion}/users/create`, function() {
			it('creates a user', function(done) {
			  request.get(`/api/${apiVersion}/users/create`)
				.expect(200)
				.end(function(err, res) {
				  done(err);
				});
			});
		});
	});
};
