module.exports = {
  'GET /users/<uid> Test' : function (browser) {
    browser
      .url('http://localhost:2000/users/-2')
      .waitForElementVisible('body')
      .pause(1000)
      .assert.containsText('body', '[{"name":"nobody","uid":"-2","gid":"-2","comment":"Unprivileged User","home":"/var/empty","shell":"/usr/bin/false"}]')
      .end();
  }
};
