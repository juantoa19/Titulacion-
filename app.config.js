import 'dotenv/config';

// Detecta si estamos construyendo la versión de desarrollo
const IS_DEV = process.env.APP_VARIANT === 'development';

export default {
  expo: {
    // Nombre de la aplicación
    name: "CHM Technology",
    slug: "titulacion",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icono.png",
    scheme: "titulacion",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      // Si es Dev, cambia el ID. Si no, usa el original.
      bundleIdentifier: IS_DEV ? "com.juan21210.titulacion.dev" : "com.juan21210.titulacion"
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      // Si es Dev, cambia el ID para que no sobrescriba tu app normal.
      package: IS_DEV ? "com.juan21210.titulacion.dev" : "com.juan21210.titulacion"
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff",
          "dark": {
            "backgroundColor": "#000000"
          }
        }
      ],
      "expo-secure-store"
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true
    },
    extra: {
      router: {},
      eas: {
        projectId: "2c0c0093-f67a-4341-b516-bc85fe1a5a9b"
      }
    },
    owner: "jeremy339-org"
  }
};