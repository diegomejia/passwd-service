module.exports = {
  'GET /groups/ Test' : function (browser) {
    browser
      .url('http://localhost:2000/groups')
      .waitForElementVisible('body')
      .pause(1000)
      .assert.containsText('body', '{"name":"sys","gid":"3","members":["root"]}')
      .assert.containsText('body', '{"name":"mail","gid":"6","members":["_teamsserver"]}')
      .end();
  }
};
