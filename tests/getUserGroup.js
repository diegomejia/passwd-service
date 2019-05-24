module.exports = {
  'GET /users/<uid>/groups Test' : function (browser) {
    browser
      .url('http://localhost:2000/users/0/groups')
      .waitForElementVisible('body')
      .pause(1000)
      .assert.containsText('body', '[{"name":"root","gid":"0","members":["wheel","daemon","kmem","sys","tty","operator"]}]')
      .url('http://localhost:2000/users/94/groups')
      .waitForElementVisible('body')
      .pause(1000)
      .assert.containsText('body', '[{"name":"_teamsserver","gid":"94","members":["mail"]}]')
      .url('http://localhost:2000/users/-2/groups')
      .waitForElementVisible('body')
      .pause(1000)
      .assert.containsText('body', '[{"name":"nobody","gid":"-2","members":[]}]')
      .end();
  }
};
