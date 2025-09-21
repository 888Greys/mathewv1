module.exports = {
  apps: [{
    name: 'pompompurin',
    script: './node_modules/.bin/next',
    args: 'start -p 3001',
    cwd: '/var/www/pompompurin',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
}