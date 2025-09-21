module.exports = {
  apps: [{
    name: 'pompompurin',
    script: 'node',
    args: '.next/standalone/server.js',
    cwd: '/var/www/pompompurin',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
}