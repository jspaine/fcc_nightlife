const env = process.env.NODE_ENV || 'development'
const port = env === 'development' ? 8000 : 8001
const mongoUri = env === 'development' ?
    'localhost/koa-nightlife' :
    'localhost/koa-nightlife-test'

export default {
  env,
  protocol: process.env.PROTOCOL || 'http',
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || port,
  jwt: process.env.JWT || 'koa-nightlife',
  db: {
    uri: process.env.MONGODB_URI || mongoUri,
    options: {
      db: {safe: true}
    },
    seed: env === 'development'
  },
  github: {
    clientID: process.env.GITHUB_ID || '',
    clientSecret: process.env.GITHUB_SECRET || '',
    callbackURL: '/api/auth/github/callback'
  },
  google: {
    clientID: process.env.GOOGLE_ID || '',
    clientSecret: process.env.GOOGLE_SECRET || '',
    callbackURL: '/api/auth/google/callback'
  },
  yelp: {
    clientID: process.env.YELP_ID || '',
    clientSecret: process.env.YELP_SECRET || ''
  }
}
