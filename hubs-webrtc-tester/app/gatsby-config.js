module.exports = {
    plugins: [
      "gatsby-plugin-image",
      "gatsby-plugin-postcss",
      "gatsby-plugin-sharp",
      "gatsby-transformer-sharp",
      {
        resolve: "gatsby-plugin-manifest",
        options: {
          name: `Hubs WebRTC Tester`,
          short_name: `Hubs WebRTC Tester`,
          start_url: `/hubs-webrtc-tester/`,
          background_color: `#77c8e4`,
          theme_color: `#77c8e4`,
          display: `standalone`,
          icon: "src/images/hubs.png",
          icon_options: {
            purpose: `any maskable`,
          },
        },
      },
    ],
    proxy: {
      prefix: "/api",
      url: "http://localhost:6381"
    },
    pathPrefix: `/hubs-webrtc-tester`
  };