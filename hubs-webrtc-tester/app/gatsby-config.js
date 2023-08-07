module.exports = {
    plugins: [
      "gatsby-plugin-image",
      "gatsby-plugin-postcss",
      "gatsby-plugin-sharp",
      "gatsby-transformer-sharp",
    ],
    proxy: {
      prefix: "/api",
      url: "http://localhost:6381"
    },
    pathPrefix: `/hubs-webrtc-tester`
  };