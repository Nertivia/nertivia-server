const io = require("socket.io-client");
module.exports = function() {

  describe('Socket Authentication', () => {
			before((done) => {
					global.io = io(`http://localhost:${process.env.PORT}`, {transports: ["websocket"]});
					global.io.on("connect", done);
			});
			before(done => {
				global.io2 = io(`http://localhost:${process.env.PORT}`, {transports: ["websocket"]});
				global.io2.on("connect", done);
			})
			before(done => {
				global.io3 = io(`http://localhost:${process.env.PORT}`, {transports: ["websocket"]});
				global.io3.on("connect", done);
			})
			before(done => {
				global.io4 = io(`http://localhost:${process.env.PORT}`, {transports: ["websocket"]});
				global.io4.on("connect", done);
			})
			before(done => {
				global.io5 = io(`http://localhost:${process.env.PORT}`, {transports: ["websocket"]});
				global.io5.on("connect", done);
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

		describe('Authenticate fake user', () => {
			it('Login using socket io with bad data.', function(done) {
				global.io3.on("authenticate_error", (err) => done());
				global.io3.on("authorized", (data) => {
					done(new Error("Should not be authorized."))
				})
				global.io3.emit("authenticate", {token: global.userToken + "fake"});
			});
		})

		describe('Authenticate fake user2', () => {
			it('Login using socket io with no data.', function(done) {
				global.io4.on("authenticate_error", (err) =>done());
				global.io4.on("authorized", (data) => {
					done(new Error("Should not be authorized."))
				})
				global.io4.emit("authenticate", {});
			});
		})

		describe('Connect but dont autheniticate', () => {
			it('Login using socket io with no data.', function(done) {
				global.io5.on("authenticate_error", (err) => done());
				global.io5.on("authorized", (data) => {
					done(new Error("Should not be authorized."))
				})
			});
		})

		// TODO: Kick a user if they are not authenitcated after a certain amount of time.
	})
};
