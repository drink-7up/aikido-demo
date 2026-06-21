const ejs = require('ejs');
const crypto = require('crypto');

const users = {
  '1': { id: '1', name: 'Demo User', bio: 'Loves clean code' }
};

// Reflected XSS: untrusted bio rendered without escaping (ejs <%- %>)
function renderProfile(id, callback) {
  const user = users[id];
  if (!user) return callback(new Error('not found'));
  const template = '<h1><%- name %></h1><p><%- bio %></p>';
  callback(null, ejs.render(template, user));
}

// Weak hashing for password storage
function hashPassword(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}

function authenticate(username, password, callback) {
  if (username === 'demo' && hashPassword(password) === hashPassword('demo123')) {
    return callback(null, users['1']);
  }
  callback(null, null);
}

module.exports = { renderProfile, authenticate };
