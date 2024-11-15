const LOG_LEVELS = {
  ERROR: "ERROR",
  WARN: "WARN",
  INFO: "INFO",
  DEBUG: "DEBUG",
};

export class Logger {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === "development";
  }

  /**
   * @param {string} message - Mensaje principal
   * @param {Object} [metadata] - Datos adicionales para logging
   * @param {string} [context] - Contexto de donde se origina el log
   */
  error(message, metadata = {}, context = "App") {
    // Convertir el error a un objeto serializable si es una instancia de Error
    const processedMetadata = this.processErrorMetadata(metadata);
    console.error(`[${context}] ERROR: ${message}`, processedMetadata);

    // En desarrollo, mostrar la traza completa
    if (process.env.NODE_ENV === "development") {
      console.error("Error details:", {
        message,
        context,
        ...processedMetadata,
      });
    }
  }

  warn(message, metadata = {}, context = "App") {
    console.warn(`[${context}] WARN: ${message}`, metadata);
  }

  info(message, metadata = {}, context = "App") {
    console.log(`[${context}] INFO: ${message}`, metadata);
  }

  debug(message, metadata = {}, context = "App") {
    if (process.env.NODE_ENV === "development") {
      console.debug(`[${context}] DEBUG: ${message}`, metadata);
    }
  }

  // Método auxiliar para procesar metadatos de error
  processErrorMetadata(metadata) {
    // Si es un error directo
    if (metadata instanceof Error) {
      return {
        name: metadata.name,
        message: metadata.message,
        stack: this.isDevelopment ? metadata.stack : undefined,
        timestamp: new Date().toISOString(),
      };
    }

    // Si es un objeto que contiene errores
    if (metadata && typeof metadata === "object") {
      const processed = {};

      Object.entries(metadata).forEach(([key, value]) => {
        if (value instanceof Error) {
          processed[key] = {
            name: value.name,
            message: value.message,
            stack: this.isDevelopment ? value.stack : undefined,
          };
        } else if (value && typeof value === "object") {
          processed[key] = this.processErrorMetadata(value);
        } else {
          processed[key] = value;
        }
      });

      return processed;
    }

    // Si no es un objeto o error, devolverlo tal cual
    return metadata;
  }

  error(message, metadata = {}, context = "App") {
    const processedMetadata = this.processErrorMetadata(metadata);

    // Asegurarse de que siempre haya un objeto de metadata
    const finalMetadata = {
      ...processedMetadata,
      timestamp: new Date().toISOString(),
      context,
    };

    console.error(`[${context}] ERROR: ${message}`, finalMetadata);

    if (this.isDevelopment) {
      console.error("Error details:", {
        message,
        context,
        ...finalMetadata,
      });
    }
  }

  _getLogColor(level) {
    switch (level) {
      case LOG_LEVELS.ERROR:
        return "#FF0000";
      case LOG_LEVELS.WARN:
        return "#FFA500";
      case LOG_LEVELS.INFO:
        return "#0000FF";
      case LOG_LEVELS.DEBUG:
        return "#808080";
      default:
        return "#000000";
    }
  }

  _sendToLogService(logData) {
    // Aquí implementarías la lógica para enviar a tu servicio de logging
    // Por ejemplo:
    // Sentry.captureMessage(logData.message, {
    //   level: logData.level.toLowerCase(),
    //   extra: logData
    // });
  }
}

export const logger = new Logger();
