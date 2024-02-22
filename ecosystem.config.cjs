module.exports = {
  apps: [
    {
      name: 'mcd-server',
      port: '3001',
      exec_mode: 'cluster',
      instances: 'max',
      script: './dist/main.js',
    },
  ],
};
