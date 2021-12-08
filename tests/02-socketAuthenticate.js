const io = require("socket.io-client");
module.exports = function() {

    describe('Socket Authentication', () => {
			before((done) => {
					global.io = io(`http://localhost:80`, {transports: ["websocket"]});
					global.io.on("connect", done);
			});
			before(done => {
				global.io2 = io(`http://localhost:80`, {transports: ["websocket"]});
				global.io2.on("connect", done);
			})


		describe('Authenticate user 1', () => {
			it('Login using socket io.', function(done) {
				global.io.on("authenticate_error", (err) => done(new Error(err.message)));
				global.io.on("authorized", (data) => {
					global.me = data.me;
					done()
				})
				global.io.emit("authenticate", {token: global.userToken});
			});
		})

		describe('Authenticate user 2', () => {
			it('Login using socket io with second account.', function(done) {
				global.io2.on("authenticate_error", (err) => done(new Error(err.message)));
				global.io2.on("authorized", (data) => {
					global.me2 = data.me;
					done()
				})
				global.io2.emit("authenticate", {token: global.userToken2});
			});
		});
	})
};
