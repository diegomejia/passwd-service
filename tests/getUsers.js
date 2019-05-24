module.exports = {
  'GET /users/ Test' : function (browser) {
    browser
      .url('http://localhost:2000/users')
      .waitForElementVisible('body')
      .pause(1000)
      .assert.containsText('body', '{"name":"_teamsserver","uid":"94","gid":"94","comment":"TeamsServer","home":"/var/teamsserver","shell":"/usr/bin/false"}')
      .end();
  }
};
