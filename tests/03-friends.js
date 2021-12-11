module.exports = function() {
  describe('Friends', () => {
    describe(`POST /api/${apiVersion}/relationships/friends/add`, function() {
      it('Add a friend and check for the events for both users.', function(done) {
        let eventRunCount = 0;
        global.io.on('friend_request_created', (data) => {
          eventRunCount++
          eventRunCount === 2 && done()
        })
        global.io2.on('friend_request_created', (data) => {
          eventRunCount++
          eventRunCount === 2 && done()
        })
          request.post(`/api/${apiVersion}/relationships/friends/add`)
          .send({id: global.user2.id})
          .set('Authorization', global.userToken)
          .expect(200)
          .end(function(err, res) {
            if(err) {
              console.log("ERR", res.body)
              done(err);
            }
          });
      });
    });
  });
};
