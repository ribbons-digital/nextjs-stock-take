class sanityClient {}
const client = jest.fn(() => new sanityClient());

const fetchMock = jest.fn();

client.prototype = {
  fetch: fetchMock,
};

module.exports = sanityClient;
module.exports.client = client;
module.exports.fetch = fetchMock;
