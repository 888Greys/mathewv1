module.exports = {
  apps: [{
    name: 'pompompurin',
    script: '.next/standalone/server.js',
    cwd: '/var/www/pompompurin',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
}