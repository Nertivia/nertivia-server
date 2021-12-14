module.exports = function() {
  describe('Presences', () => {
    describe(`PATCH /api/${apiVersion}/presences/update`, function() {
      it('Update presence and listen for the change event', function(done) {
        let eventRunCount = 0;
        global.io.on('presence_changed', (data) => {
          eventRunCount++
          eventRunCount === 2 && done()
        })
        global.io2.on('presence_changed', (data) => {
          eventRunCount++
          eventRunCount === 2 && done()
        })
          request.patch(`/api/${apiVersion}/presences/update`)
          .send({presence: 4})
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
