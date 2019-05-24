module.exports = {
  'GET /users/ Test' : function (browser) {
    browser
      .url('http://localhost:2000/users/query?name=nobody&uid=-2&gid=-2&comment=Unprivileged+User&home=%2Fvar%2Fempty&shell=%2Fusr%2Fbin%2Ffalse')
      .waitForElementVisible('body')
      .pause(1000)
      .assert.containsText('body', '[{"name":"nobody","uid":"-2","gid":"-2","comment":"Unprivileged User","home":"/var/empty","shell":"/usr/bin/false"}]')
      .end();
  }
};
