const io = require("socket.io-client");
module.exports = function() {

    describe('Socket Authentication', () => {
			before((done) => {
					global.io = io(`http://localhost:80`, {transports: ["websocket"]});
					global.io.on("connect", done);
			});


			it('Login using socket io.', function(done) {
				global.io.on("authenticate_error", (err) => done(new Error(err.message)));
				global.io.on("authorized", () => done())
				global.io.emit("authenticate", {token: global.userToken});
			});
	});
};
