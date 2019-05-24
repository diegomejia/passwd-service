module.exports = {
  'GET /groups/<gid> Test' : function (browser) {
    browser
      .url('http://localhost:2000/groups/-2')
      .waitForElementVisible('body')
      .pause(1000)
      .assert.containsText('body', '[{"name":"nobody","gid":"-2","members":[]}]')
      .url('http://localhost:2000/groups/1')
      .waitForElementVisible('body')
      .pause(1000)
      .assert.containsText('body', '[{"name":"daemon","gid":"1","members":["root"]}]')
      .url('http://localhost:2000/groups/221')
      .waitForElementVisible('body')
      .pause(1000)
      .assert.containsText('body', '[{"name":"_webauthserver","gid":"221","members":["_teamsserver","_devicemgr"]}]')
      .end();
  }
};
