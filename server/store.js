// central place for in-memory data (users, shares)
const users = [
  // sample demo user (password: demo123)
  // passwords stored hashed in auth route when creating; this is an example format
];

const shares = [
  // each share: { id, symbol, name, price, sector, notes, color, ownerId, createdAt, updatedAt }
];

module.exports = { users, shares };
