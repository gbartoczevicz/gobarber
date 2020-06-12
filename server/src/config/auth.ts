const secret = process.env.AUTH_SECRET;

if (!secret) {
  throw new Error('Secret key must be provided');
}

export default {
  jwt: {
    secret,
    expiresIn: process.env.AUTH_EXPIRES_IN,
  },
};
