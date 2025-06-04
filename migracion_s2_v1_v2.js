// Función para generar archivos JSON - modificada para arrays
function generarArchivosJSON(resultados) {
  const archivos = {};

  // Procesar archivos normales (un archivo por categoría)
  Object.keys(resultados.archivosNormales).forEach((categoria) => {
    if (resultados.archivosNormales[categoria].length > 0) {
      const nombreArchivo = `${categoria}.json`;
      const contenidoArray =
        resultados.archivosNormales[categoria][0].contenido;
      archivos[nombreArchivo] = JSON.stringify(contenidoArray, null, 2);
    }
  });

  // Procesar archivos de revisión (un archivo por categoría)
  Object.keys(resultados.archivosRevision).forEach((categoria) => {
    if (resultados.archivosRevision[categoria].length > 0) {
      const nombreArchivo = `${categoria}.json`;
      const contenidoArray =
        resultados.archivosRevision[categoria][0].contenido;
      archivos[nombreArchivo] = JSON.stringify(contenidoArray, null, 2);
    }
  });

  // Crear archivo de resumen
  const resumen = {
    fechaGeneracion: new Date().toISOString(),
    directorioOrigen: directorioOrigen,
    directorioDestino: directorioDestino,
    totalArchivos: Object.keys(archivos).length,
    totalObjetos: resultados.estadisticas.totalProcesados,
    clasificacion: {
      contratacion_publica:
        resultados.estadisticas.clasificacion.contratacion_publica,
      otorgamiento_concesiones:
        resultados.estadisticas.clasificacion.otorgamiento_concesiones,
      enajenacion_bienes:
        resultados.estadisticas.clasificacion.enajenacion_bienes,
      dictamen_valuatorio:
        resultados.estadisticas.clasificacion.dictamen_valuatorio,
      sin_clasificar: resultados.estadisticas.clasificacion.sin_clasificar,
      revisar_casos_sin_tipoProcedimiento_definido:
        resultados.estadisticas.clasificacion.revisar_casos,
    },
    archivosGenerados: Object.keys(archivos).filter(
      (nombre) => nombre !== "_resumen_procesamiento.json"
    ),
    errores: resultados.estadisticas.errores,
    advertencias: resultados.estadisticas.advertencias,
    criteriosClasificacion: {
      contratacion_publica:
        "CONTRATACIÓN PÚBLICA, DE TRAMITACIÓN, ATENCIÓN Y RESOLUCIÓN PARA LA ADJUDICACIÓN DE UN CONTRATO",
      otorgamiento_concesiones:
        "OTORGAMIENTO DE CONCESIONES, LICENCIAS, PERMISOS, AUTORIZACIONES Y SUS PRÓRROGAS",
      enajenacion_bienes: "ENAJENACIÓN DE BIENES MUEBLES",
      dictamen_valuatorio:
        "EMISIÓN DE DICTAMEN VALUATORIO Y JUSTIPRECIACIÓN DE RENTAS",
      sin_clasificar:
        "No coincide con ningún patrón conocido - incluye todas las estructuras vacías",
      revisar_casos:
        "Objetos con múltiples tipos de procedimiento - incluye todas las estructuras",
    },
    estructuraObjetoGenerado: {
      descripcion:
        "Cada archivo contiene un array de objetos con la nueva estructura JSON",
      campos: [
        "id",
        "fecha",
        "ejercicio",
        "datosGenerales",
        "empleoCargoComision",
        "tipoProcedimiento",
        "tipoContratacion",
        "contratacionObra",
        "otorgamientoConcesiones",
        "enajenacionBienes",
        "dictaminacionAvaluos",
        "observaciones",
      ],
      notas: [
        "Para casos sin clasificar: se incluyen todas las estructuras de procedimiento con campos vacíos",
        "Para casos con múltiples procedimientos: se incluyen todas las estructuras de procedimiento",
        "Los niveles de responsabilidad se convierten de objeto a arrays de claves",
        "Las fechas se formatean de ISO a DD-MM-YYYY",
        "El género se convierte a HOMBRE/MUJER",
        "Se infieren entidades federativas, niveles de gobierno y ámbitos públicos",
      ],
    },
  };

  archivos["_resumen_procesamiento.json"] = JSON.stringify(resumen, null, 2);

  return archivos;
}

// =====================================================
// SCRIPT DE CONVERSIÓN DE ESTRUCTURA DE DATOS
// Uso: node converter.js <directorio_origen> <directorio_destino>
// =====================================================

const fs = require("fs");
const path = require("path");

// Verificar argumentos de línea de comandos
if (process.argv.length < 4) {
  console.error("❌ Error: Se requieren dos parámetros");
  console.log(
    "📋 Uso: node converter.js <directorio_origen> <directorio_destino>"
  );
  console.log(
    "📋 Ejemplo: node converter.js ./datos_origen ./datos_convertidos"
  );
  process.exit(1);
}

const directorioOrigen = path.resolve(process.argv[2]);
const directorioDestino = path.resolve(process.argv[3]);

console.log("🔄 INICIANDO CONVERSIÓN DE ESTRUCTURA DE DATOS\n");
console.log(`📂 Directorio origen: ${directorioOrigen}`);
console.log(`📂 Directorio destino: ${directorioDestino}\n`);

// =====================================================
// FUNCIONES DEL SISTEMA DE CONVERSIÓN
// =====================================================

// Función para leer archivos JSON desde el directorio origen
function leerArchivosJSON(directorio) {
  const archivosEncontrados = [];

  function explorarDirectorio(rutaActual) {
    try {
      const elementos = fs.readdirSync(rutaActual, { withFileTypes: true });

      for (const elemento of elementos) {
        const rutaCompleta = path.join(rutaActual, elemento.name);

        if (elemento.isDirectory()) {
          // Explorar subdirectorio recursivamente
          explorarDirectorio(rutaCompleta);
        } else if (
          elemento.isFile() &&
          elemento.name.toLowerCase().endsWith(".json")
        ) {
          try {
            const contenido = fs.readFileSync(rutaCompleta, "utf8");
            const datos = JSON.parse(contenido);

            // Si es un array, agregar cada elemento
            if (Array.isArray(datos)) {
              archivosEncontrados.push(...datos);
            } else {
              // Si es un objeto individual, agregarlo
              archivosEncontrados.push(datos);
            }

            console.log(
              `✅ Archivo leído: ${path.relative(directorio, rutaCompleta)}`
            );
          } catch (error) {
            console.error(`❌ Error leyendo ${rutaCompleta}:`, error.message);
          }
        }
      }
    } catch (error) {
      console.error(
        `❌ Error explorando directorio ${rutaActual}:`,
        error.message
      );
    }
  }

  explorarDirectorio(directorio);
  return archivosEncontrados;
}

// Función para limpiar y crear directorio destino
function prepararDirectorioDestino(directorio) {
  try {
    // Si existe, eliminarlo completamente
    if (fs.existsSync(directorio)) {
      console.log(`🗑️  Limpiando directorio existente: ${directorio}`);
      fs.rmSync(directorio, { recursive: true, force: true });
    }

    // Crear directorio nuevo
    console.log(`📁 Creando directorio destino: ${directorio}`);
    fs.mkdirSync(directorio, { recursive: true });
  } catch (error) {
    console.error(`❌ Error preparando directorio destino:`, error.message);
    process.exit(1);
  }
}

// Función para escribir archivos en el directorio destino
function escribirArchivos(archivos, directorioBase) {
  let totalArchivos = 0;

  Object.keys(archivos).forEach((rutaArchivo) => {
    const rutaCompleta = path.join(directorioBase, rutaArchivo);
    const directorioArchivo = path.dirname(rutaCompleta);

    try {
      // Crear directorio si no existe
      fs.mkdirSync(directorioArchivo, { recursive: true });

      // Escribir archivo
      fs.writeFileSync(rutaCompleta, archivos[rutaArchivo], "utf8");
      console.log(`📄 Archivo creado: ${rutaArchivo}`);
      totalArchivos++;
    } catch (error) {
      console.error(`❌ Error escribiendo ${rutaArchivo}:`, error.message);
    }
  });

  return totalArchivos;
}

// Función para convertir tipoArea a nivelesResponsabilidad
function convertirTipoAreaANivelesResponsabilidad(
  tipoArea,
  nivelResponsabilidad
) {
  const resultado = {};

  if (tipoArea && tipoArea.length > 0) {
    resultado.tipoArea = tipoArea[0].valor || "";
    resultado.valorTipoArea = tipoArea[0].clave || "";
  }

  if (nivelResponsabilidad && nivelResponsabilidad.length > 0) {
    const nivel = nivelResponsabilidad[0];
    resultado.nivel = nivel.valor || "";
    resultado.claveNivel = nivel.clave || "";
  }

  return resultado;
}

// Función para crear estructura específica según el tipo de procedimiento
function crearEstructuraEspecifica(tipoProcedimiento, objetoOriginal) {
  switch (tipoProcedimiento) {
    case "Contrataciones Públicas":
      return {
        tipoContratacion: [],
        contratacionAdquisiones: {
          tipoArea: objetoOriginal?.tipoArea?.[0]?.valor || "",
          valorTipoArea: objetoOriginal?.tipoArea?.[0]?.clave || "",
          nivelesResponsabilidad: {
            autorizacionDictamen:
              objetoOriginal?.nivelResponsabilidad?.[0]?.valor || "",
            justificacionLicitacion: "",
            convocatoriaInvitacion: "",
            evaluacionProposiciones: "",
            adjudicacionContrato: "",
            formalizacionContrato: "",
          },
          datosGeneralesProcedimientos: [],
          datosBeneficiariosFinales: {
            razonSocial: "",
            nombre: "",
            primerApellido: "",
            segundoApellido: "",
          },
        },
        contratacionObra: {
          tipoArea: objetoOriginal?.tipoArea?.[0]?.valor || "",
          valorContratacionObra: objetoOriginal?.tipoArea?.[0]?.clave || "",
          nivelesResponsabilidad: {
            autorizacionDictamen:
              objetoOriginal?.nivelResponsabilidad?.[0]?.valor || "",
            justificacionLicictacion: "",
            convocatoriaInvitacion: "",
            evaluacionProposiciones: "",
            adjudicacionContrato: "",
            formalizacionContrato: "",
          },
          datosGeneralesProcedimientos: {
            numeroExpedienteFolio: "",
            tipoProcedimiento: tipoProcedimiento,
            otroTipoProcedimiento: "",
            materia: "",
            otroMateria: "",
            fechaInicioProcedimiento: objetoOriginal?.fechaCaptura || "",
            fechaConclusionProcedimiento: "",
          },
          datosBeneficiariosFinales: {
            razonSocial: "",
            nombre: "",
            primerApellido: "",
            segundoApellido: "",
          },
        },
      };

    case "Otorgamiento de Concesiones":
      return {
        otorgamientoConcesiones: {
          tipoActo: "CONCESIÓN",
          nivelesResponsabilidad: {
            convocatoriaLicitacion:
              objetoOriginal?.nivelResponsabilidad?.[0]?.valor || "",
            dictamenesOpiniones: "",
            visitasVerificacion: "",
            evaluacionCumplimiento: "",
            determinacionOtorgamiento: "",
          },
          datosGeneralesProcedimientos: {
            numeroExpedienteFolio: "",
            denominacion: objetoOriginal?.puesto?.nombre || "",
            objeto: "",
            fundamento: "",
            nombrePersonaSolicitaOtorga: objetoOriginal?.nombres || "",
            primerApellidoSolicitaOtorga: objetoOriginal?.primerApellido || "",
            segundoApellidoSolicitaOtorga:
              objetoOriginal?.segundoApellido || "",
            denominacionPersonaMoral:
              objetoOriginal?.institucionDependencia?.nombre || "",
            sectorActo: "",
            fechaInicioVigencia: objetoOriginal?.fechaCaptura || "",
            fechaConclusionVigencia: "",
            monto: "",
            urlInformacionActo: "",
          },
          datosBeneficiariosFinales: {
            razonSocial: objetoOriginal?.institucionDependencia?.nombre || "",
            nombre: objetoOriginal?.nombres || "",
            primerApellido: objetoOriginal?.primerApellido || "",
            segundoApellido: objetoOriginal?.segundoApellido || "",
          },
        },
      };

    case "Enajenación de Bienes":
      return {
        enajenacionBienes: {
          nivelesResponsabilidad: {
            autorizacionesDictamenes:
              objetoOriginal?.nivelResponsabilidad?.[0]?.valor || "",
            analisisAutorizacion: "",
            modificacionBases: "",
            presentacionOfertas: "",
            evaluacionOfertas: "",
            adjudicacionBienes: "",
            formalizacionContrato: "",
          },
          datosGeneralesProcedimientos: {
            numeroExpedienteFolio: "",
            descripcion: objetoOriginal?.puesto?.nombre || "",
            fechaInicioProcedimiento: objetoOriginal?.fechaCaptura || "",
            fechaConclusionProcedimiento: "",
          },
        },
      };

    case "Avalúos y Justipreciación":
      return {
        dictaminacionAvaluos: {
          nivelesResponsabilidad: {
            propuestasAsignaciones:
              objetoOriginal?.nivelResponsabilidad?.[0]?.valor || "",
            asignacionAvaluos: "",
            emisionDictamenes: "",
          },
          datosGeneralesProcedimientos: {
            numeroExpedienteFolio: "",
            descripcion: objetoOriginal?.puesto?.nombre || "",
            fechaInicioProcedimiento: objetoOriginal?.fechaCaptura || "",
            fechaConclusionProcedimiento: "",
          },
        },
      };

    default:
      return {
        estructuraGenerica: {
          tipo: tipoProcedimiento || "No especificado",
          datosGenerales: {
            fechaInicio: objetoOriginal?.fechaCaptura || "",
            descripcion: objetoOriginal?.puesto?.nombre || "",
          },
          nivelesResponsabilidad: {
            nivel: objetoOriginal?.nivelResponsabilidad?.[0]?.valor || "",
            tipoArea: objetoOriginal?.tipoArea?.[0]?.valor || "",
          },
          datosBeneficiarios: {
            nombre: objetoOriginal?.nombres || "",
            apellidos: `${objetoOriginal?.primerApellido || ""} ${
              objetoOriginal?.segundoApellido || ""
            }`.trim(),
            institucion: objetoOriginal?.institucionDependencia?.nombre || "",
          },
        },
      };
  }
}

// Función para convertir un objeto individual a la nueva estructura
function convertirObjeto(objeto) {
  // Determinar el tipo de procedimiento principal
  const tipoProcedimientoPrincipal = determinarTipoProcedimientoPrincipal(
    objeto.tipoProcedimiento
  );

  // Estructura base del objeto convertido
  const objetoConvertido = {
    id: objeto.id || generateUUID(),
    fecha: formatearFecha(objeto.fechaCaptura),
    ejercicio: objeto.ejercicioFiscal || "",
    datosGenerales: {
      nombre: objeto.nombres || "",
      primerApellido: objeto.primerApellido || "",
      segundoApellido: objeto.segundoApellido || "",
      curp: objeto.curp || "",
      rfc: objeto.rfc || "",
      sexo: convertirGenero(objeto.genero),
    },
    empleoCargoComision: {
      entidadFederativa: extraerEntidadFederativa(
        objeto.institucionDependencia
      ),
      nivelOrdenGobierno: determinarNivelOrdenGobierno(objeto.ramo),
      ambitoPublico: determinarAmbitoPublico(objeto.ramo),
      nombreEntePublico: objeto.institucionDependencia?.nombre || "",
      siglasEntePublico: objeto.institucionDependencia?.siglas || "",
      nivelJerarquico: {
        clave: determinarNivelJerarquico(objeto.puesto),
      },
      denominacion: objeto.puesto?.nombre || "",
      areaAdscripcion: objeto.institucionDependencia?.nombre || "",
    },
    tipoProcedimiento: tipoProcedimientoPrincipal,
    observaciones: objeto.observaciones || "",
  };

  // Agregar estructura específica según el tipo de procedimiento
  agregarEstructuraEspecifica(objetoConvertido, objeto);

  return objetoConvertido;
}

// Función para generar UUID simple
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Función para formatear fecha
function formatearFecha(fechaCaptura) {
  if (!fechaCaptura) return "";
  try {
    const fecha = new Date(fechaCaptura);
    const dia = fecha.getDate().toString().padStart(2, "0");
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const año = fecha.getFullYear();
    return `${dia}-${mes}-${año}`;
  } catch {
    return "";
  }
}

// Función para convertir género
function convertirGenero(genero) {
  if (!genero || !genero.clave) return "";
  return genero.clave.toUpperCase() === "M"
    ? "HOMBRE"
    : genero.clave.toUpperCase() === "F"
    ? "MUJER"
    : "";
}

// Función para extraer entidad federativa
function extraerEntidadFederativa(institucion) {
  if (!institucion || !institucion.nombre) return "";
  const nombre = institucion.nombre.toLowerCase();

  // Mapeo básico de entidades federativas
  const entidades = {
    "ciudad de mexico": "Ciudad de Mexico",
    cdmx: "Ciudad de Mexico",
    "distrito federal": "Ciudad de Mexico",
    jalisco: "Jalisco",
    "nuevo leon": "Nuevo Leon",
    "estado de mexico": "Estado de Mexico",
    veracruz: "Veracruz",
    puebla: "Puebla",
    guanajuato: "Guanajuato",
    chihuahua: "Chihuahua",
    sonora: "Sonora",
    coahuila: "Coahuila",
    michoacan: "Michoacan",
    oaxaca: "Oaxaca",
    tamaulipas: "Tamaulipas",
    guerrero: "Guerrero",
    "baja california": "Baja California",
    sinaloa: "Sinaloa",
    hidalgo: "Hidalgo",
    chiapas: "Chiapas",
  };

  // Buscar coincidencias
  for (const [clave, valor] of Object.entries(entidades)) {
    if (nombre.includes(clave)) {
      return valor;
    }
  }

  return "No especificado";
}

// Función para determinar nivel de orden de gobierno
function determinarNivelOrdenGobierno(ramo) {
  if (!ramo || !ramo.valor) return "NO_ESPECIFICADO";

  const valor = ramo.valor.toLowerCase();
  if (
    valor.includes("federal") ||
    valor.includes("poder") ||
    valor.includes("organismo")
  ) {
    return "FEDERAL";
  } else if (valor.includes("estatal") || valor.includes("estado")) {
    return "ESTATAL";
  } else if (valor.includes("municipal") || valor.includes("municipio")) {
    return "MUNICIPAL";
  }

  return "FEDERAL"; // Por defecto
}

// Función para determinar ámbito público
function determinarAmbitoPublico(ramo) {
  if (!ramo || !ramo.valor) return "NO_ESPECIFICADO";

  const valor = ramo.valor.toLowerCase();
  if (
    valor.includes("ejecutivo") ||
    valor.includes("secretaria") ||
    valor.includes("organismo")
  ) {
    return "EJECUTIVO";
  } else if (
    valor.includes("legislativo") ||
    valor.includes("congreso") ||
    valor.includes("camara")
  ) {
    return "LEGISLATIVO";
  } else if (
    valor.includes("judicial") ||
    valor.includes("tribunal") ||
    valor.includes("juzgado")
  ) {
    return "JUDICIAL";
  }

  return "EJECUTIVO"; // Por defecto
}

// Función para determinar nivel jerárquico - corregida según especificación
function determinarNivelJerarquico(puesto) {
  if (!puesto || !puesto.nombre) return "NO_ESPECIFICADO";

  const nombre = puesto.nombre.toLowerCase();

  if (nombre.includes("director general") || nombre.includes("secretario")) {
    return "DIRECCION_GENERAL";
  } else if (
    nombre.includes("subsecretario") ||
    nombre.includes("subsecretaria")
  ) {
    return "SUBSECRETARIA_HOMOLOGO";
  } else if (
    nombre.includes("director general adjunto") ||
    nombre.includes("dg")
  ) {
    return "DG_HOMOLOGO";
  } else if (
    nombre.includes("director") ||
    nombre.includes("coordinador general")
  ) {
    return "DIRECCION_HOMOLOGO";
  } else if (nombre.includes("subdirector") || nombre.includes("coordinador")) {
    return "SUBDIRECCION_HOMOLOGO";
  } else if (nombre.includes("jefe") || nombre.includes("supervisor")) {
    return "JEFATURA_HOMOLOGO";
  } else if (
    nombre.includes("regidor") ||
    nombre.includes("alcalde") ||
    nombre.includes("presidente municipal")
  ) {
    return "DIRECCION_HOMOLOGO";
  } else if (
    nombre.includes("operativo") ||
    nombre.includes("analista") ||
    nombre.includes("técnico") ||
    nombre.includes("especialista") ||
    nombre.includes("auxiliar") ||
    nombre.includes("asistente") ||
    nombre.includes("profesional") ||
    nombre.includes("enlace") ||
    nombre.includes("ejecutivo") ||
    nombre.includes("oficial") ||
    nombre.includes("coordinadora")
  ) {
    return "OPERATIVO_HOMOLOGO";
  }

  return "OTRO";
}

// Función para determinar tipo de procedimiento principal
function determinarTipoProcedimientoPrincipal(tipoProcedimiento) {
  if (!tipoProcedimiento || tipoProcedimiento.length === 0)
    return "SIN_CLASIFICAR";

  const primerTipo = tipoProcedimiento[0].valor;
  const categoria = clasificarTipoProcedimiento(primerTipo);

  switch (categoria) {
    case "contratacion_publica":
      return "CONTRATACION_PUBLICA";
    case "otorgamiento_concesiones":
      return "OTORGAMIENTO_CONCESIONES";
    case "enajenacion_bienes":
      return "ENAJENACION_BIENES";
    case "dictamen_valuatorio":
      return "DICTAMEN_VALUATORIO";
    default:
      return "SIN_CLASIFICAR";
  }
}

// Función para agregar estructura específica según tipo de procedimiento
function agregarEstructuraEspecifica(objetoConvertido, objetoOriginal) {
  const categoria = clasificarTipoProcedimiento(
    objetoOriginal.tipoProcedimiento?.[0]?.valor
  );
  const tieneMultiplesProcedimientos =
    objetoOriginal.tipoProcedimiento &&
    objetoOriginal.tipoProcedimiento.length > 1;

  switch (categoria) {
    case "contratacion_publica":
      objetoConvertido.tipoContratacion = [
        {
          clave: "CONTRATACION_ADQUISICION",
        },
      ];
      objetoConvertido.contratacionAdquisiones =
        crearEstructuraContratacionAdquisiciones(objetoOriginal);
      break;

    case "otorgamiento_concesiones":
      objetoConvertido.otorgamientoConcesiones =
        crearEstructuraOtorgamientoConcesiones(objetoOriginal);
      objetoConvertido.datosBeneficiariosFinales =
        crearDatosBeneficiarios(objetoOriginal);
      break;

    case "enajenacion_bienes":
      objetoConvertido.enajenacionBienes =
        crearEstructuraEnajenacionBienes(objetoOriginal);
      break;

    case "dictamen_valuatorio":
      objetoConvertido.dictaminacionAvaluos =
        crearEstructuraDictaminacionAvaluos(objetoOriginal);
      break;

    default:
      // Para casos sin clasificar, agregar todas las estructuras con campos vacíos
      objetoConvertido.tipoContratacion = [
        {
          clave: "CONTRATACION_ADQUISICION",
        },
      ];
      objetoConvertido.contratacionAdquisiones =
        crearEstructuraContratacionAdquisiciones(objetoOriginal);
      objetoConvertido.otorgamientoConcesiones =
        crearEstructuraOtorgamientoConcesiones(objetoOriginal);
      objetoConvertido.datosBeneficiariosFinales =
        crearDatosBeneficiarios(objetoOriginal);
      objetoConvertido.enajenacionBienes =
        crearEstructuraEnajenacionBienes(objetoOriginal);
      objetoConvertido.dictaminacionAvaluos =
        crearEstructuraDictaminacionAvaluos(objetoOriginal);
      break;
  }

  // Agregar continuaParticipando a nivel raíz
  objetoConvertido.continuaParticipando = true;

  // Si tiene múltiples procedimientos, agregar todas las estructuras
  if (tieneMultiplesProcedimientos) {
    objetoConvertido.tipoContratacion = [
      {
        clave: "CONTRATACION_ADQUISICION",
      },
    ];
    objetoConvertido.contratacionAdquisiones =
      crearEstructuraContratacionAdquisiciones(objetoOriginal);
    objetoConvertido.otorgamientoConcesiones =
      crearEstructuraOtorgamientoConcesiones(objetoOriginal);
    objetoConvertido.datosBeneficiariosFinales =
      crearDatosBeneficiarios(objetoOriginal);
    objetoConvertido.enajenacionBienes =
      crearEstructuraEnajenacionBienes(objetoOriginal);
    objetoConvertido.dictaminacionAvaluos =
      crearEstructuraDictaminacionAvaluos(objetoOriginal);
    objetoConvertido.continuaParticipando = true;

    // Agregar metadata para casos de revisión
    objetoConvertido._metadata = {
      requiereRevision: true,
      razon: `Múltiples tipos de procedimiento: ${objetoOriginal.tipoProcedimiento
        .map((t) => t.valor)
        .join(", ")}`,
      fechaProcesamiento: new Date().toISOString(),
    };
  }
}

// Funciones para crear estructuras específicas según los ejemplos
function crearEstructuraContratacionAdquisiciones(objeto) {
  return {
    tipoArea: objeto.tipoArea?.[0]?.valor || "AREA_CONTRATANTE",
    nivelesResponsabilidad: {
      autorizacionDictamen: objeto.nivelResponsabilidad?.map(
        (n) => n.valor
      ) || [""],
      justificacionLicitacion: [""],
      convocatoriaInvitacion: [""],
      evaluacionProposiciones: [""],
      adjudicacionContrato: [""],
      formalizacionContrato: [""],
      otro: [""],
    },
    datosGeneralesProcedimientos: [
      {
        numeroExpedienteFolio: "",
        tipoProcedimiento: "LICITACION_NACIONAL",
        materia: "ADQUICISION",
        fechaInicioProcedimiento: formatearFecha(objeto.fechaCaptura),
        fechaConclusionProcedimiento: "",
      },
    ],
    datosBeneficiariosFinales: {
      razonSocial: "",
      nombe: "",
      primerApellido: "",
      segundoApellido: "",
    },
    continuaParticipando: true,
  };
}

function crearEstructuraOtorgamientoConcesiones(objeto) {
  return {
    tipoActo: "CONCECIONES",
    nivelesResponsabilidad: {
      convocatoriaLicitacion: objeto.nivelResponsabilidad?.map(
        (n) => n.valor
      ) || [""],
      dictamenesOpiniones: [""],
      visitasVerificacion: [""],
      evaluacionCumplimiento: [""],
      determinacionOtorgamiento: [""],
      otro: [""],
    },
    datosGeneralesProcedimientos: {
      numeroExpedienteFolio: "",
      denominacion: objeto.puesto?.nombre || "",
      objeto: "",
      fundamento: "",
      nombrePersonaSolicitaOtorga: "",
      primerApellidoSolicitaOtorga: "",
      segundoApellidoSolicitaOtorga: "",
      denominacionPersonaMoral: "",
      sectorActo: "",
      fechaInicioVigencia: formatearFecha(objeto.fechaCaptura),
      fechaConclusionVigencia: "",
      monto: "",
      urlInformacionActo: "",
    },
  };
}

function crearEstructuraEnajenacionBienes(objeto) {
  return {
    nivelesResponsabilidad: {
      autorizacionesDictamenes: objeto.nivelResponsabilidad?.map(
        (n) => n.valor
      ) || [""],
      analisisAutorizacion: [""],
      modificacionBases: [""],
      presentacionOfertas: [""],
      evaluacionOfertas: [""],
      adjudicacionBienes: [""],
      formalizacionContrato: [""],
      otro: [""],
    },
    datosGeneralesProcedimientos: {
      numeroExpedienteFolio: "",
      descripcion: objeto.puesto?.nombre || "",
      fechaInicioProcedimiento: formatearFecha(objeto.fechaCaptura),
      fechaConclusionProcedimiento: "",
    },
  };
}

function crearEstructuraDictaminacionAvaluos(objeto) {
  return {
    nivelesResponsabilidad: {
      propuestasAsignaciones: objeto.nivelResponsabilidad?.map(
        (n) => n.valor
      ) || [""],
      asignacionAvaluos: [""],
      emisionDictamenes: [""],
      otro: [""],
    },
    datosGeneralesProcedimientos: {
      numeroExpedienteFolio: "",
      descripcion: objeto.puesto?.nombre || "",
      fechaInicioProcedimiento: formatearFecha(objeto.fechaCaptura),
      fechaConclusionProcedimiento: "",
    },
  };
}

function crearDatosBeneficiarios(objeto) {
  return {
    razonSocial: "",
    nombe: "",
    primerApellido: "",
    segundoApellido: "",
    continuaParticipando: true,
  };
}

// Función para clasificar tipo de procedimiento
function clasificarTipoProcedimiento(tipoProcedimientoValor) {
  if (!tipoProcedimientoValor) return "sin_clasificar";

  const valor = tipoProcedimientoValor.toUpperCase();

  // Patrones para clasificación
  const patrones = {
    contratacion_publica: [
      "CONTRATACIÓN PÚBLICA",
      "CONTRATACIONES PÚBLICAS",
      "TRAMITACIÓN",
      "ATENCIÓN Y RESOLUCIÓN",
      "ADJUDICACIÓN",
      "CONTRATO",
      "LICITACIÓN",
      "ADQUISICIONES",
      "OBRAS PÚBLICAS",
    ],
    otorgamiento_concesiones: [
      "OTORGAMIENTO",
      "CONCESIONES",
      "LICENCIAS",
      "PERMISOS",
      "AUTORIZACIONES",
      "PRÓRROGAS",
      "CONCESIÓN",
    ],
    enajenacion_bienes: [
      "ENAJENACIÓN",
      "BIENES MUEBLES",
      "VENTA",
      "DISPOSICIÓN",
      "BIENES",
    ],
    dictamen_valuatorio: [
      "DICTAMEN VALUATORIO",
      "JUSTIPRECIACIÓN",
      "RENTAS",
      "AVALÚO",
      "AVALÚOS",
      "VALUACIÓN",
      "PERITAJE",
    ],
  };

  // Buscar coincidencias por prioridad
  for (const [categoria, palabrasClave] of Object.entries(patrones)) {
    for (const palabra of palabrasClave) {
      if (valor.includes(palabra)) {
        return categoria;
      }
    }
  }

  return "sin_clasificar";
}

// Función principal de conversión - modificada para generar arrays
function convertirEstructura(datosOriginales) {
  const resultados = {
    archivosNormales: {},
    archivosRevision: {},
    estadisticas: {
      totalProcesados: datosOriginales.length,
      errores: [],
      advertencias: [],
      clasificacion: {
        contratacion_publica: 0,
        otorgamiento_concesiones: 0,
        enajenacion_bienes: 0,
        dictamen_valuatorio: 0,
        sin_clasificar: 0,
        revisar_casos: 0,
      },
    },
  };

  // Inicializar arrays para cada categoría
  const categorias = {
    contratacion_publica: [],
    otorgamiento_concesiones: [],
    enajenacion_bienes: [],
    dictamen_valuatorio: [],
    sin_clasificar: [],
    revisar_casos_sin_tipoProcedimiento_definido: [],
  };

  datosOriginales.forEach((objeto, index) => {
    try {
      // Validaciones básicas
      if (!objeto.nombres || !objeto.primerApellido) {
        resultados.estadisticas.errores.push(
          `Objeto ${index}: Faltan campos obligatorios (nombres/primerApellido)`
        );
        return;
      }

      const tieneMultiplesProcedimientos =
        objeto.tipoProcedimiento && objeto.tipoProcedimiento.length > 1;
      const objetoConvertido = convertirObjeto(objeto);

      if (tieneMultiplesProcedimientos) {
        // Casos con múltiples procedimientos
        categorias["revisar_casos_sin_tipoProcedimiento_definido"].push(
          objetoConvertido
        );
        resultados.estadisticas.clasificacion.revisar_casos++;
      } else {
        // Clasificar según el tipo de procedimiento
        const tipoProcedimiento = objeto.tipoProcedimiento?.[0]?.valor || "";
        const categoria = clasificarTipoProcedimiento(tipoProcedimiento);

        categorias[categoria].push(objetoConvertido);
        resultados.estadisticas.clasificacion[categoria]++;
      }
    } catch (error) {
      resultados.estadisticas.errores.push(`Objeto ${index}: ${error.message}`);
    }
  });

  // Generar archivos por categoría (un archivo por categoría con array de objetos)
  Object.keys(categorias).forEach((categoria) => {
    if (categorias[categoria].length > 0) {
      if (categoria === "revisar_casos_sin_tipoProcedimiento_definido") {
        resultados.archivosRevision[categoria] = [
          {
            archivo: `${categoria}.json`,
            contenido: categorias[categoria],
          },
        ];
      } else {
        resultados.archivosNormales[categoria] = [
          {
            archivo: `${categoria}.json`,
            contenido: categorias[categoria],
          },
        ];
      }
    }
  });

  return resultados;
}

// Función para generar archivos JSON
function generarArchivosJSON(resultados) {
  const archivos = {};

  // Procesar archivos normales
  Object.keys(resultados.archivosNormales).forEach((ruta) => {
    resultados.archivosNormales[ruta].forEach((item) => {
      const rutaCompleta = `${ruta}/${item.archivo}`;
      archivos[rutaCompleta] = JSON.stringify(item.contenido, null, 2);
    });
  });

  // Procesar archivos de revisión
  Object.keys(resultados.archivosRevision).forEach((ruta) => {
    resultados.archivosRevision[ruta].forEach((item) => {
      const rutaCompleta = `${ruta}/${item.archivo}`;
      archivos[rutaCompleta] = JSON.stringify(item.contenido, null, 2);
    });
  });

  // Crear archivo de resumen
  const resumen = {
    fechaGeneracion: new Date().toISOString(),
    directorioOrigen: directorioOrigen,
    directorioDestino: directorioDestino,
    totalArchivos: Object.keys(archivos).length,
    clasificacion: {
      contratacion_publica:
        resultados.estadisticas.clasificacion.contratacion_publica,
      otorgamiento_concesiones:
        resultados.estadisticas.clasificacion.otorgamiento_concesiones,
      enajenacion_bienes:
        resultados.estadisticas.clasificacion.enajenacion_bienes,
      dictamen_valuatorio:
        resultados.estadisticas.clasificacion.dictamen_valuatorio,
      sin_clasificar: resultados.estadisticas.clasificacion.sin_clasificar,
      revisar_casos_sin_tipoProcedimiento_definido:
        resultados.estadisticas.clasificacion.revisar_casos,
    },
    errores: resultados.estadisticas.errores,
    advertencias: resultados.estadisticas.advertencias,
    directoriosCreados: [
      ...new Set([
        ...Object.keys(resultados.archivosNormales),
        ...Object.keys(resultados.archivosRevision),
      ]),
    ],
    criteriosClasificacion: {
      contratacion_publica:
        "CONTRATACIÓN PÚBLICA, DE TRAMITACIÓN, ATENCIÓN Y RESOLUCIÓN PARA LA ADJUDICACIÓN DE UN CONTRATO",
      otorgamiento_concesiones:
        "OTORGAMIENTO DE CONCESIONES, LICENCIAS, PERMISOS, AUTORIZACIONES Y SUS PRÓRROGAS",
      enajenacion_bienes: "ENAJENACIÓN DE BIENES MUEBLES",
      dictamen_valuatorio:
        "EMISIÓN DE DICTAMEN VALUATORIO Y JUSTIPRECIACIÓN DE RENTAS",
      sin_clasificar: "No coincide con ningún patrón conocido",
      revisar_casos: "Objetos con múltiples tipos de procedimiento",
    },
    reglasAplicadas: [
      "Campo 'tipoArea' convertido a 'nivelesResponsabilidad' con contenido del objeto original",
      "Campos 'no aplica' convertidos a campos vacíos",
      "Estructura específica generada según 'tipoProcedimiento'",
      "Clasificación automática según patrones de tipoProcedimiento",
      "Objetos con múltiples procedimientos enviados a 'revisar_casos_sin_tipoProcedimiento_definido'",
      "Organización: categoria/archivo.json",
    ],
    estadisticasDetalladas: {
      archivosNormalesPorCategoria: Object.keys(
        resultados.archivosNormales
      ).reduce((acc, cat) => {
        acc[cat] = resultados.archivosNormales[cat].length;
        return acc;
      }, {}),
      archivosRevisionPorCategoria: Object.keys(
        resultados.archivosRevision
      ).reduce((acc, cat) => {
        acc[cat] = resultados.archivosRevision[cat].length;
        return acc;
      }, {}),
    },
  };

  archivos["_resumen_procesamiento.json"] = JSON.stringify(resumen, null, 2);

  return archivos;
}

// =====================================================
// FUNCIÓN PRINCIPAL
// =====================================================

async function main() {
  try {
    // 1. Verificar que el directorio origen existe
    if (!fs.existsSync(directorioOrigen)) {
      console.error(
        `❌ Error: El directorio origen no existe: ${directorioOrigen}`
      );
      process.exit(1);
    }

    // 2. Leer archivos JSON del directorio origen
    console.log("📖 Leyendo archivos JSON...");
    const datosOriginales = leerArchivosJSON(directorioOrigen);

    if (datosOriginales.length === 0) {
      console.log(
        "⚠️  No se encontraron archivos JSON en el directorio origen"
      );
      process.exit(0);
    }

    console.log(
      `✅ Se encontraron ${datosOriginales.length} objetos para procesar\n`
    );

    // 3. Preparar directorio destino
    prepararDirectorioDestino(directorioDestino);

    // 4. Convertir estructura de datos
    console.log("🔄 Convirtiendo estructura de datos...");
    const resultados = convertirEstructura(datosOriginales);

    // 5. Generar archivos JSON
    console.log("📝 Generando archivos JSON...");
    const archivosGenerados = generarArchivosJSON(resultados);

    // 6. Escribir archivos al directorio destino
    console.log("💾 Escribiendo archivos...");
    const totalEscritos = escribirArchivos(
      archivosGenerados,
      directorioDestino
    );

    // 7. Mostrar resumen final
    console.log("\n=== RESUMEN DE LA CONVERSIÓN ===");
    console.log(`✅ Objetos procesados: ${datosOriginales.length}`);
    console.log(`📄 Archivos generados: ${totalEscritos}`);
    console.log(`📂 Directorio destino: ${directorioDestino}`);

    // Mostrar clasificación detallada
    console.log("\n📊 CLASIFICACIÓN POR TIPO DE PROCEDIMIENTO:");
    const clasificacion = resultados.estadisticas.clasificacion;

    console.log(
      `   📁 contratacion_publica.json: ${clasificacion.contratacion_publica} objetos`
    );
    console.log(
      `   📁 otorgamiento_concesiones.json: ${clasificacion.otorgamiento_concesiones} objetos`
    );
    console.log(
      `   📁 enajenacion_bienes.json: ${clasificacion.enajenacion_bienes} objetos`
    );
    console.log(
      `   📁 dictamen_valuatorio.json: ${clasificacion.dictamen_valuatorio} objetos`
    );
    console.log(
      `   📁 sin_clasificar.json: ${clasificacion.sin_clasificar} objetos`
    );
    console.log(
      `   ⚠️  revisar_casos_sin_tipoProcedimiento_definido.json: ${clasificacion.revisar_casos} objetos`
    );

    // Mostrar archivos generados
    console.log("\n📁 ARCHIVOS GENERADOS:");
    Object.keys(resultados.archivosNormales).forEach((categoria) => {
      if (resultados.archivosNormales[categoria].length > 0) {
        console.log(
          `   📄 ${categoria}.json (${resultados.estadisticas.clasificacion[categoria]} objetos en array)`
        );
      }
    });

    Object.keys(resultados.archivosRevision).forEach((categoria) => {
      if (resultados.archivosRevision[categoria].length > 0) {
        console.log(
          `   📄 ${categoria}.json (${resultados.estadisticas.clasificacion.revisar_casos} objetos - REQUIEREN REVISIÓN)`
        );
      }
    });

    console.log(`   📄 _resumen_procesamiento.json (estadísticas y metadatos)`);

    if (resultados.estadisticas.errores.length > 0) {
      console.log(
        `\n❌ ERRORES ENCONTRADOS: ${resultados.estadisticas.errores.length}`
      );
      resultados.estadisticas.errores.forEach((error, i) => {
        if (i < 5) {
          // Mostrar solo los primeros 5 errores
          console.log(`   • ${error}`);
        }
      });
      if (resultados.estadisticas.errores.length > 5) {
        console.log(
          `   ... y ${
            resultados.estadisticas.errores.length - 5
          } errores más (ver archivo de resumen)`
        );
      }
    }

    if (resultados.estadisticas.advertencias.length > 0) {
      console.log(
        `\n⚠️  ADVERTENCIAS: ${resultados.estadisticas.advertencias.length}`
      );
    }

    console.log("\n🎉 Conversión completada exitosamente!");
    console.log(
      "📋 Revisa el archivo _resumen_procesamiento.json para detalles completos"
    );

    // Mostrar información sobre la nueva estructura
    console.log("\n📖 ESTRUCTURA DE DATOS GENERADA:");
    console.log(
      "   • Cada archivo .json contiene un ARRAY de objetos con la nueva estructura"
    );
    console.log("   • Formato de fechas: DD-MM-YYYY");
    console.log("   • Género convertido a: HOMBRE/MUJER");
    console.log("   • Niveles de responsabilidad como arrays de claves");
    console.log(
      "   • Campos inferidos: entidad federativa, nivel de gobierno, ámbito público"
    );

    console.log("\n📖 TIPOS DE ESTRUCTURA SEGÚN CLASIFICACIÓN:");
    console.log(
      "   • contratacion_publica: tipoContratacion + contratacionObra"
    );
    console.log("   • otorgamiento_concesiones: otorgamientoConcesiones");
    console.log("   • enajenacion_bienes: enajenacionBienes");
    console.log("   • dictamen_valuatorio: dictaminacionAvaluos");
    console.log("   • sin_clasificar: TODAS las estructuras con campos vacíos");
    console.log(
      "   • revisar_casos: TODAS las estructuras (múltiples procedimientos)"
    );
  } catch (error) {
    console.error("❌ Error fatal:", error.message);
    process.exit(1);
  }
}

// Ejecutar función principal
main();

// =====================================================
// INSTRUCCIONES DE USO
// =====================================================

/*
INSTRUCCIONES DE USO:

1. GUARDAR EL SCRIPT:
 Guarda este archivo como 'converter.js'

2. HACER EJECUTABLE (opcional):
 chmod +x converter.js

3. EJECUTAR:
 node converter.js <directorio_origen> <directorio_destino>

EJEMPLOS:
 node converter.js ./datos_originales ./datos_convertidos
 node converter.js /ruta/completa/origen /ruta/completa/destino

COMPORTAMIENTO:
 - Lee todos los archivos .json del directorio origen (recursivamente)
 - Limpia completamente el directorio destino antes de escribir
 - Crea la estructura de directorios automáticamente
 - Genera un archivo de resumen con estadísticas

ESTRUCTURA DE SALIDA:
 destino/
 ├── contratacion_publica.json (array de objetos)
 ├── otorgamiento_concesiones.json (array de objetos)
 ├── enajenacion_bienes.json (array de objetos)
 ├── dictamen_valuatorio.json (array de objetos)
 ├── sin_clasificar.json (array de objetos)
 ├── revisar_casos_sin_tipoProcedimiento_definido.json (array de objetos)
 └── _resumen_procesamiento.json

ESTRUCTURA JSON DE CADA OBJETO:
{
"id": "550e8400-e29b-41d4-a716-446655440000",
"fecha": "21-11-2023",
"ejercicio": "2023",
"datosGenerales": {
  "nombre": "ISRAEL",
  "primerApellido": "JUAREZ",
  "segundoApellido": "MENDEZ",
  "curp": "",
  "rfc": "",
  "sexo": "HOMBRE"
},
"empleoCargoComision": {
  "entidadFederativa": "No especificado",
  "nivelOrdenGobierno": "MUNICIPAL",
  "ambitoPublico": "EJECUTIVO",
  "nombreEntePublico": "Municipio de Sabanilla",
  "siglasEntePublico": "",
  "nivelJerarquico": {
    "clave": "DIRECCION_HOMOLOGO"
  },
  "denominacion": "REGIDOR",
  "areaAdscripcion": "Municipio de Sabanilla"
},
"tipoProcedimiento": "SIN_CLASIFICAR",
"tipoContratacion": [...],
"contratacionObra": {...},
"otorgamientoConcesiones": {...},
"enajenacionBienes": {...},
"dictaminacionAvaluos": {...},
"observaciones": ""
}

CRITERIOS DE CLASIFICACIÓN:
 • contratacion_publica: Solo incluye tipoContratacion + contratacionObra
 • otorgamiento_concesiones: Solo incluye otorgamientoConcesiones
 • enajenacion_bienes: Solo incluye enajenacionBienes
 • dictamen_valuatorio: Solo incluye dictaminacionAvaluos
 • sin_clasificar: Incluye TODAS las estructuras con campos vacíos
 • revisar_casos: Incluye TODAS las estructuras (múltiples procedimientos)

TRANSFORMACIONES APLICADAS:
 • Fechas: ISO 8601 → DD-MM-YYYY
 • Género: M/F → HOMBRE/MUJER
 • Niveles responsabilidad: objetos → arrays de claves
 • Inferencia automática de entidades federativas y niveles de gobierno
 • Generación de UUIDs para objetos sin ID
*/
