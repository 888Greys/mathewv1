module.exports = {
  apps: [{
    name: 'pompompurin',
    script: 'server.js',
    cwd: '/var/www/pompompurin',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
}