function getName() {
  return '@monorepo-test/lib-c';
}

function getDummyData() {
  return {
    message: 'Hello from lib-c',
    version: '1.0.0',
    buildTest: true
  };
}

module.exports = { getName };
// test
