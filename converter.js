#!/usr/bin/env node

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

// Función para convertir un objeto individual
function convertirObjeto(objeto) {
  const objetoBase = {
    id: objeto.id || "",
    fechaCaptura: objeto.fechaCaptura || "",
    ejercicioFiscal: objeto.ejercicioFiscal || "",
    ramo: objeto.ramo || { clave: "", valor: "" },
    rfc: objeto.rfc || "",
    curp: objeto.curp || "",
    nombres: objeto.nombres || "",
    primerApellido: objeto.primerApellido || "",
    segundoApellido: objeto.segundoApellido || "",
    genero: objeto.genero || { clave: "", valor: "" },
    institucionDependencia: objeto.institucionDependencia || {
      nombre: "",
      siglas: "",
      clave: "",
    },
    puesto: objeto.puesto || { nombre: "", nivel: "" },
    nivelesResponsabilidad: convertirTipoAreaANivelesResponsabilidad(
      objeto.tipoArea,
      objeto.nivelResponsabilidad
    ),
    observaciones: objeto.observaciones || "",
    empleoCargoComision: {
      denominacion: objeto.puesto?.nombre || "",
      areaAdscripcion: objeto.institucionDependencia?.nombre || "",
    },
    tipoProcedimineto: objeto.tipoProcedimiento?.[0]?.valor || "",
    superiorInmediato: objeto.superiorInmediato || null,
    continuaParticipando: true,
  };

  const estructuraEspecifica = crearEstructuraEspecifica(
    objeto.tipoProcedimiento?.[0]?.valor,
    objeto
  );
  return { ...objetoBase, ...estructuraEspecifica };
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

// Función principal de conversión
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

      const nombreArchivo = `${objeto.id || index}_${objeto.nombres.replace(
        /\s+/g,
        "_"
      )}_${objeto.primerApellido}.json`;

      if (tieneMultiplesProcedimientos) {
        // Casos con múltiples procedimientos van a directorio especial
        const rutaRevision = "revisar_casos_sin_tipoProcedimiento_definido";
        if (!resultados.archivosRevision[rutaRevision]) {
          resultados.archivosRevision[rutaRevision] = [];
        }

        // Agregar metadata de revisión
        objetoConvertido._metadata = {
          requiereRevision: true,
          razon: `Múltiples tipos de procedimiento: ${objeto.tipoProcedimiento
            .map((t) => t.valor)
            .join(", ")}`,
          fechaProcesamiento: new Date().toISOString(),
          procedimientosDetectados: objeto.tipoProcedimiento.map(
            (t) => t.valor
          ),
        };

        resultados.archivosRevision[rutaRevision].push({
          archivo: nombreArchivo,
          contenido: objetoConvertido,
        });

        resultados.estadisticas.clasificacion.revisar_casos++;
      } else {
        // Clasificar según el tipo de procedimiento
        const tipoProcedimiento = objeto.tipoProcedimiento?.[0]?.valor || "";
        const categoria = clasificarTipoProcedimiento(tipoProcedimiento);

        if (!resultados.archivosNormales[categoria]) {
          resultados.archivosNormales[categoria] = [];
        }

        // Agregar información de clasificación al objeto
        objetoConvertido._clasificacion = {
          categoria: categoria,
          tipoProcedimientoOriginal: tipoProcedimiento,
          fechaClasificacion: new Date().toISOString(),
        };

        resultados.archivosNormales[categoria].push({
          archivo: nombreArchivo,
          contenido: objetoConvertido,
        });

        resultados.estadisticas.clasificacion[categoria]++;
      }
    } catch (error) {
      resultados.estadisticas.errores.push(`Objeto ${index}: ${error.message}`);
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
      `   📁 contratacion_publica: ${clasificacion.contratacion_publica} archivos`
    );
    console.log(
      `   📁 otorgamiento_concesiones: ${clasificacion.otorgamiento_concesiones} archivos`
    );
    console.log(
      `   📁 enajenacion_bienes: ${clasificacion.enajenacion_bienes} archivos`
    );
    console.log(
      `   📁 dictamen_valuatorio: ${clasificacion.dictamen_valuatorio} archivos`
    );
    console.log(
      `   📁 sin_clasificar: ${clasificacion.sin_clasificar} archivos`
    );
    console.log(
      `   ⚠️  revisar_casos_sin_tipoProcedimiento_definido: ${clasificacion.revisar_casos} archivos`
    );

    // Mostrar estructura de directorios creada
    console.log("\n📁 ESTRUCTURA DE DIRECTORIOS CREADA:");
    Object.keys(resultados.archivosNormales).forEach((categoria) => {
      if (resultados.archivosNormales[categoria].length > 0) {
        console.log(
          `   📂 ${categoria}/ (${resultados.archivosNormales[categoria].length} archivos)`
        );
      }
    });

    Object.keys(resultados.archivosRevision).forEach((categoria) => {
      if (resultados.archivosRevision[categoria].length > 0) {
        console.log(
          `   📂 ${categoria}/ (${resultados.archivosRevision[categoria].length} archivos - REQUIEREN REVISIÓN)`
        );
      }
    });

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

    // Mostrar guía de clasificación utilizada
    console.log("\n📖 CRITERIOS DE CLASIFICACIÓN UTILIZADOS:");
    console.log(
      "   • contratacion_publica: Contratación pública, licitación, adjudicación, contratos"
    );
    console.log(
      "   • otorgamiento_concesiones: Concesiones, licencias, permisos, autorizaciones"
    );
    console.log(
      "   • enajenacion_bienes: Enajenación, bienes muebles, venta, disposición"
    );
    console.log(
      "   • dictamen_valuatorio: Dictamen valuatorio, justipreciación, avalúos, rentas"
    );
    console.log("   • sin_clasificar: No coincide con ningún patrón conocido");
    console.log(
      "   • revisar_casos: Múltiples tipos de procedimiento detectados"
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
   ├── contratacion_publica/
   │   ├── 1_RODOLFO_BENJAMIN_MARTINEZ.json
   │   └── 3_GLORIA_IVETTE_ROSAS.json
   ├── otorgamiento_concesiones/
   │   └── 4_MARIA_ELENA_GARCIA.json
   ├── enajenacion_bienes/
   │   └── 5_PEDRO_LUIS_HERNANDEZ.json
   ├── dictamen_valuatorio/
   │   └── 6_ANA_SOFIA_LOPEZ.json
   ├── sin_clasificar/
   │   └── 7_CARLOS_MIGUEL_TORRES.json
   ├── revisar_casos_sin_tipoProcedimiento_definido/
   │   └── 2_ALEJANDRO_JAVIER_ROMERO.json
   └── _resumen_procesamiento.json

CRITERIOS DE CLASIFICACIÓN:
   • contratacion_publica: CONTRATACIÓN PÚBLICA, TRAMITACIÓN, ADJUDICACIÓN, CONTRATOS
   • otorgamiento_concesiones: CONCESIONES, LICENCIAS, PERMISOS, AUTORIZACIONES
   • enajenacion_bienes: ENAJENACIÓN DE BIENES MUEBLES, VENTA, DISPOSICIÓN
   • dictamen_valuatorio: DICTAMEN VALUATORIO, JUSTIPRECIACIÓN, AVALÚOS, RENTAS
   • sin_clasificar: No coincide con ningún patrón conocido
   • revisar_casos: Múltiples tipos de procedimiento detectados
*/
