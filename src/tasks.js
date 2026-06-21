const seed = [
  { id: 1, title: 'Write demo script' },
  { id: 2, title: 'Connect repo to Aikido' },
  { id: 3, title: 'Practice objection handling' }
];

// Minimal stand-in for a real DB driver so the injection sink below
// is a believable `db.all(sql, cb)` call rather than dead code.
const db = {
  all(sql, callback) {
    const match = /LIKE '%(.*)%'/.exec(sql);
    const term = match ? match[1] : '';
    const pattern = new RegExp(term, 'i');
    callback(null, seed.filter((t) => pattern.test(t.title)));
  }
};

// SQL injection: user input concatenated directly into the query string
function search(query, callback) {
  const sql = "SELECT * FROM tasks WHERE title LIKE '%" + query + "%'";
  db.all(sql, callback);
}

module.exports = { search };
