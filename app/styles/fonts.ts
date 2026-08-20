import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";

// Fuentes exclusivas del rediseño publico/alumnos. Se autoalojan en build time
// (sin peticion runtime a Google Fonts) y solo se cargan en las rutas que las
// importan, así que la sección de administración no se ve afectada ni en peso.
export const gxDisplay = Space_Grotesk({
  variable: "--gx-font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const gxSans = Plus_Jakarta_Sans({
  variable: "--gx-font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const gxFontClass = `${gxDisplay.variable} ${gxSans.variable}`;
