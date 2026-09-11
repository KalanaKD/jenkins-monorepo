function getName() {
  return '@monorepo-test/lib-b';
}

function getDummyData() {
  return {
    message: 'Hello from lib-b',
    version: '1.0.0',
    buildTest: true
  };
}

module.exports = { getName };
// test
