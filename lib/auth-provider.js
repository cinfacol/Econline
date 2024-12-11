import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.JWT_SECRET_KEY;

export async function authenticate(request) {
  try {
    // Obtener el token de las cookies
    const token = request.cookies.get("access")?.value || "";
    console.log("token", token);

    if (!token) {
      return false;
    }

    // Verificar el JWT token
    const secretKey = new TextEncoder().encode(SECRET_KEY);
    console.log("SECRET_KEY", SECRET_KEY);
    console.log("secretKey", secretKey);
    const { payload } = await jwtVerify(token, secretKey);
    console.log("payload", payload);

    // Verificar que el token no haya expirado
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return false;
    }

    return true;
  } catch (error) {
    // Diferentes tipos de errores que pueden ocurrir:
    if (error.code === "ERR_JWT_EXPIRED") {
      console.error("Token expirado");
    } else if (error.code === "ERR_JWS_SIGNATURE_VERIFICATION_FAILED") {
      console.error("Firma inválida");
    } else if (error.code === "ERR_JWT_CLAIM_VALIDATION_FAILED") {
      console.error("Validación de claims fallida");
    }
    return false;
  }
}
