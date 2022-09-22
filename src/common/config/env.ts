export const env = {
  server: { port: process.env.PORT || 5000 },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  }
};
