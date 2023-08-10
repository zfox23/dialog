module.exports = {
  siteMetadata: {
    siteUrl: "https://zachfox.io/hubs-webrtc-tester",
    title: "Mozilla Hubs WebRTC Tester",
    titleTemplate: "%s · Hubs WebRTC Tester",
    description: "A tool for testing Mozilla Hubs' WebRTC capabilities, and a resource for learning about how Hubs uses WebRTC.",
    image: "/mainMetaImage.jpg"
  },
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