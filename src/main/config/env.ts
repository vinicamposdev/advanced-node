export const env = {
  facebookApi: {
    clientId: process.env.FACEBOOK_API_CLIENT_ID ?? '473881144322752',
    clientSecret: process.env.FACEBOOK_API_CLIENT_SECRET ?? '081acb60a0bfe93daa0a4d6e1b2aa230'
  },
  port: process.env.PORT ?? 3000,
  jwtSecret: process.env.JWT_SECRET ?? 'secret'
}
