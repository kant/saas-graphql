export default {
    mongodb: {
      uri: process.env.DATABASE_URI || ''
    },
    token: {
      secret: process.env.SECRET || '',
    },
  };