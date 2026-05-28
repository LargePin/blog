module.exports = {
  apps: [
    {
      name: "blog",
      script: ".next/standalone/server.js",
      cwd: "/home/oesp/Desktop/hermes/blog",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
      },
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      error_file: "/home/oesp/Desktop/hermes/blog/logs/error.log",
      out_file: "/home/oesp/Desktop/hermes/blog/logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
