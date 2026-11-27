# Configurar Firebase

1. Creá un proyecto en [Firebase Console](https://console.firebase.google.com/) y registrá una aplicación **Web** (ícono `</>`). Copiá `apiKey`, `authDomain`, `projectId` y `appId` del objeto `firebaseConfig` a las variables `EXPO_PUBLIC_FIREBASE_*` de `.env`. No hace falta descargar `google-services.json` para esta integración con Expo Go.
2. En **Authentication → Sign-in method**, habilitá **Email/Password**.
3. En **Firestore Database**, creá la base de datos. En la pestaña **Rules**, reemplazá las reglas por el contenido de [firestore.rules](./firestore.rules) y publicalas. Cada usuario podrá leer y escribir solo sus favoritos.
4. Reiniciá Expo con `EXPO_OFFLINE=1 npm run start -- --clear` y abrí el QR nuevo en Expo Go.

Los favoritos se guardan en `users/{uid}/favorites/{productId}` y se sincronizan con un listener de Firestore. La app exige una sesión para verlos o guardarlos. El registro con email y contraseña inicia sesión al crear la cuenta; no depende de un enlace de confirmación.
