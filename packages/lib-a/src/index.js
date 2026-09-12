function getName() {
  return '@monorepo-test/lib-a';
}

function getDummyData() {
  return {
    message: 'Hello from lib-a',
    version: '1.0.3',
    buildTest: true
  };
}

module.exports = { getName };
// test
