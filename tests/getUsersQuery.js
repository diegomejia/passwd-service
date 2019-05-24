module.exports = {
  'GET /users/ Test' : function (browser) {
    browser
      .url('http://localhost:2000/users/query?name=nobody&uid=-2&gid=-2&comment=Unprivileged+User&home=%2Fvar%2Fempty&shell=%2Fusr%2Fbin%2Ffalse')
      .waitForElementVisible('body')
      .pause(1000)
      .assert.containsText('body', '[{"name":"nobody","uid":"-2","gid":"-2","comment":"Unprivileged User","home":"/var/empty","shell":"/usr/bin/false"}]')
      .url('http://localhost:2000/users/query?name=root&uid=0&gid=0')
      .waitForElementVisible('body')
      .pause(1000)
      .assert.containsText('body', '[{"name":"root","uid":"0","gid":"0","comment":"System Administrator","home":"/var/root","shell":"/bin/sh"}]')
      .end();
  }
};
