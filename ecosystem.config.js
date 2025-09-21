module.exports = {
  apps: [{
    name: 'pompompurin',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/pompompurin',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
}