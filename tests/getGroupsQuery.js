module.exports = {
  'GET /groups/query? Test' : function (browser) {
    browser
      .url('http://localhost:2000/groups/query?name=_webauthserver&gid=221&member=_devicemgr&member=_teamsserver')
      .waitForElementVisible('body')
      .pause(1000)
      .assert.containsText('body', '[{"name":"_webauthserver","gid":"221","members":["_teamsserver","_devicemgr"]}]')
      .url('http://localhost:2000/groups/query?member=_devicemgr&member=_teamsserver')
      .waitForElementVisible('body')
      .pause(1000)
      .assert.containsText('body', '[{"name":"_webauthserver","gid":"221","members":["_teamsserver","_devicemgr"]}]')
      .url('http://localhost:2000/groups/query?gid=0')
      .waitForElementVisible('body')
      .pause(1000)
      .assert.containsText('body', '[{"name":"wheel","gid":"0","members":["root"]}]')
      .end();
  }
};
