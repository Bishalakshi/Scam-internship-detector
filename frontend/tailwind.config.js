

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#11182B",
        paper: "#F6F1E4",
        papermute: "#EAE3D2",
        amber: "#E8A23D",
        alert: "#D6483E",
        clear: "#4F9D6E",
        slate: "#8B93A7",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
}