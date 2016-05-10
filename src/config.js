module.exports = {
  env: process.env.NODE_ENV || 'development',
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000,
  mongodb: process.env.MONGOLAB_URI || 'mongodb://localhost:27017/caloric',//'mongodb://caloric:c4l0r1c@ds011382.mlab.com:11382/caloric'
  secret: 'tajnyKlic',
  authExpiration: 24 * 60 * 60

};