# Migración de archivos JSON del S2

## 📋 Descripción

Este repositorio contiene un script de Node.js para convertir archivos JSON de la versión 1 a la versión 2 de acuerdo al nuevo formato estándar del Sistema de los servidores públicos que intervengan en procedimientos de contrataciones públicas, clasificando automáticamente los datos por tipo de procedimiento y generando archivos organizados por categoría.

## 🚀 Características

- **Conversión automática** de estructura de datos JSON
- **Clasificación inteligente** por tipo de procedimiento
- **Generación de archivos por categoría** con arrays de objetos
- **Validación de datos** de entrada
- **Inferencia automática** de entidades federativas y niveles de gobierno
- **Manejo de casos especiales** (múltiples procedimientos)
- **Reportes detallados** de procesamiento
- **Estructura específica** según el tipo de procedimiento

## 📂 Estructura de Entrada

El script procesa archivos JSON con la siguiente estructura de entrada:

```json
[
  {
    "id": "c87e185e-e0f9-4e4b-9b33-41c6af367507",
    "fechaCaptura": "2023-11-21T11:33:37Z",
    "ejercicioFiscal": "2023",
    "ramo": {
      "clave": 33,
      "valor": "Aportaciones Federales para Entidades Federativas y Municipios"
    },
    "nombres": "CARLOS",
    "primerApellido": "RODRIGUEZ",
    "segundoApellido": "MARTINEZ",
    "genero": {
      "clave": "M",
      "valor": "MASCULINO"
    },
    "institucionDependencia": {
      "nombre": "Municipio de Ejemplo",
      "siglas": "MEJ",
      "clave": "210"
    },
    "puesto": {
      "nivel": "MUNICIPAL",
      "nombre": "DIRECTOR DE ADQUISICIONES"
    },
    "tipoArea": [
      {
        "clave": "C",
        "valor": "CONTRATANTE"
      }
    ],
    "nivelResponsabilidad": [
      {
        "clave": "R",
        "valor": "RESOLUCIÓN"
      },
      {
        "clave": "T",
        "valor": "TRAMITACIÓN"
      }
    ],
    "tipoProcedimiento": [
      {
        "clave": 1,
        "valor": "CONTRATACIONES PÚBLICAS"
      }
    ]
  }
]
```

## 📤 Estructuras de Salida por Tipo

### 🏢 **CONTRATACION_PUBLICA**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "fecha": "21-11-2023",
    "ejercicio": "2023",
    "datosGenerales": {
      "nombre": "MARIA FERNANDA",
      "primerApellido": "LOPEZ",
      "segundoApellido": "GARCIA",
      "curp": "LOGM850315MDFRRL04",
      "rfc": "LOGM850315ABC",
      "sexo": "MUJER"
    },
    "empleoCargoComision": {
      "entidadFederativa": "Ciudad de Mexico",
      "nivelOrdenGobierno": "FEDERAL",
      "ambitoPublico": "EJECUTIVO",
      "nombreEntePublico": "Secretaría de Hacienda y Crédito Público",
      "siglasEntePublico": "SHCP",
      "nivelJerarquico": {
        "clave": "DIRECCION_HOMOLOGO"
      },
      "denominacion": "DIRECTORA DE ADQUISICIONES",
      "areaAdscripcion": "Dirección General de Recursos Materiales"
    },
    "tipoProcedimiento": "CONTRATACION_PUBLICA",
    "tipoContratacion": [
      {
        "clave": "CONTRATACION_ADQUISICION"
      }
    ],
    "contratacionAdquisiones": {
      "tipoArea": "AREA_CONTRATANTE",
      "nivelesResponsabilidad": {
        "autorizacionDictamen": ["ELABORAR", "REVISAR"],
        "justificacionLicitacion": ["FIRMAR"],
        "convocatoriaInvitacion": ["AUTORIZAR"],
        "evaluacionProposiciones": ["SUPERVISAR"],
        "adjudicacionContrato": ["EMITIR"],
        "formalizacionContrato": ["FIRMAR"],
        "otro": ["RESOLUCIÓN", "TRAMITACIÓN"]
      },
      "datosGeneralesProcedimientos": [
        {
          "numeroExpedienteFolio": "SHCP-ADQ-2023-001",
          "tipoProcedimiento": "LICITACION_NACIONAL",
          "materia": "ADQUISICION",
          "fechaInicioProcedimiento": "15-03-2023",
          "fechaConclusionProcedimiento": "30-06-2023"
        }
      ],
      "datosBeneficiariosFinales": {
        "razonSocial": "TECNOLOGÍA Y SERVICIOS SA DE CV",
        "nombe": "JUAN CARLOS",
        "primerApellido": "MENDOZA",
        "segundoApellido": "SILVA"
      },
      "continuaParticipando": true
    },
    "observaciones": "Procedimiento ejecutado conforme a la normatividad vigente",
    "continuaParticipando": true
  }
]
```

### 🏛️ **OTORGAMIENTO_CONCESIONES**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "fecha": "22-11-2023",
    "ejercicio": "2023",
    "datosGenerales": {
      "nombre": "ROBERTO ANTONIO",
      "primerApellido": "HERNANDEZ",
      "segundoApellido": "MORALES",
      "curp": "HEMR750822HDFRRB08",
      "rfc": "HEMR750822XYZ",
      "sexo": "HOMBRE"
    },
    "empleoCargoComision": {
      "entidadFederativa": "Ciudad de Mexico",
      "nivelOrdenGobierno": "FEDERAL",
      "ambitoPublico": "EJECUTIVO",
      "nombreEntePublico": "Secretaría de Comunicaciones y Transportes",
      "siglasEntePublico": "SCT",
      "nivelJerarquico": {
        "clave": "SUBSECRETARIA_HOMOLOGO"
      },
      "denominacion": "SUBSECRETARIO DE COMUNICACIONES",
      "areaAdscripcion": "Subsecretaría de Comunicaciones"
    },
    "tipoProcedimiento": "OTORGAMIENTO_CONCESIONES",
    "otorgamientoConcesiones": {
      "tipoActo": "CONCESIONES",
      "nivelesResponsabilidad": {
        "convocatoriaLicitacion": ["ELABORAR", "AUTORIZAR"],
        "dictamenesOpiniones": ["REVISAR", "EMITIR"],
        "visitasVerificacion": ["SUPERVISAR"],
        "evaluacionCumplimiento": ["EVALUAR"],
        "determinacionOtorgamiento": ["RESOLVER"],
        "otro": ["RESOLUCIÓN", "TRAMITACIÓN"]
      },
      "datosGeneralesProcedimientos": {
        "numeroExpedienteFolio": "SCT-CON-2023-045",
        "denominacion": "Concesión para servicios de telecomunicaciones móviles",
        "objeto": "Prestación de servicios de telecomunicaciones en modalidad móvil",
        "fundamento": "Ley Federal de Telecomunicaciones y Radiodifusión",
        "nombrePersonaSolicitaOtorga": "ALEJANDRA PATRICIA",
        "primerApellidoSolicitaOtorga": "RAMIREZ",
        "segundoApellidoSolicitaOtorga": "TORRES",
        "denominacionPersonaMoral": "COMUNICACIONES AVANZADAS SA DE CV",
        "sectorActo": "PRIVADO",
        "fechaInicioVigencia": "01-01-2024",
        "fechaConclusionVigencia": "31-12-2033",
        "monto": "$250,000,000.00",
        "urlInformacionActo": "https://www.sct.gob.mx/concesiones/2023/045"
      }
    },
    "datosBeneficiariosFinales": {
      "razonSocial": "COMUNICACIONES AVANZADAS SA DE CV",
      "nombe": "ALEJANDRA PATRICIA",
      "primerApellido": "RAMIREZ",
      "segundoApellido": "TORRES",
      "continuaParticipando": true
    },
    "observaciones": "Concesión otorgada por período de 10 años renovable",
    "continuaParticipando": true
  }
]
```

### 🏠 **ENAJENACION_BIENES**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "fecha": "23-11-2023",
    "ejercicio": "2023",
    "datosGenerales": {
      "nombre": "LAURA VICTORIA",
      "primerApellido": "SANTOS",
      "segundoApellido": "JIMENEZ",
      "curp": "SAJL800520MDFNTR09",
      "rfc": "SAJL800520DEF",
      "sexo": "MUJER"
    },
    "empleoCargoComision": {
      "entidadFederativa": "Estado de Mexico",
      "nivelOrdenGobierno": "ESTATAL",
      "ambitoPublico": "EJECUTIVO",
      "nombreEntePublico": "Instituto de la Vivienda del Estado de México",
      "siglasEntePublico": "IVEQ",
      "nivelJerarquico": {
        "clave": "DIRECCION_HOMOLOGO"
      },
      "denominacion": "DIRECTORA DE PATRIMONIO",
      "areaAdscripcion": "Dirección de Patrimonio y Bienes"
    },
    "tipoProcedimiento": "ENAJENACION_BIENES",
    "enajenacionBienes": {
      "nivelesResponsabilidad": {
        "autorizacionesDictamenes": ["ELABORAR", "REVISAR"],
        "analisisAutorizacion": ["EVALUAR"],
        "modificacionBases": ["AUTORIZAR"],
        "presentacionOfertas": ["SUPERVISAR"],
        "evaluacionOfertas": ["ANALIZAR"],
        "adjudicacionBienes": ["RESOLVER"],
        "formalizacionContrato": ["FIRMAR"],
        "otro": ["RESOLUCIÓN", "TRAMITACIÓN"]
      },
      "datosGeneralesProcedimientos": {
        "numeroExpedienteFolio": "IVEQ-EB-2023-012",
        "descripcion": "Enajenación de lote baldío ubicado en Toluca, Estado de México",
        "fechaInicioProcedimiento": "10-04-2023",
        "fechaConclusionProcedimiento": "25-08-2023"
      }
    },
    "observaciones": "Enajenación realizada mediante subasta pública",
    "continuaParticipando": true
  }
]
```

### 📊 **DICTAMEN_VALUATORIO**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "fecha": "24-11-2023",
    "ejercicio": "2023",
    "datosGenerales": {
      "nombre": "MIGUEL ANGEL",
      "primerApellido": "VARGAS",
      "segundoApellido": "CASTILLO",
      "curp": "VACM720918HDFRRG05",
      "rfc": "VACM720918GHI",
      "sexo": "HOMBRE"
    },
    "empleoCargoComision": {
      "entidadFederativa": "Veracruz",
      "nivelOrdenGobierno": "ESTATAL",
      "ambitoPublico": "EJECUTIVO",
      "nombreEntePublico": "Instituto Veracruzano del Patrimonio",
      "siglasEntePublico": "IVERPAT",
      "nivelJerarquico": {
        "clave": "DG_HOMOLOGO"
      },
      "denominacion": "COORDINADOR GENERAL DE AVALÚOS",
      "areaAdscripcion": "Coordinación General de Avalúos y Dictámenes"
    },
    "tipoProcedimiento": "DICTAMEN_VALUATORIO",
    "dictaminacionAvaluos": {
      "nivelesResponsabilidad": {
        "propuestasAsignaciones": ["ELABORAR", "REVISAR"],
        "asignacionAvaluos": ["AUTORIZAR"],
        "emisionDictamenes": ["EMITIR", "FIRMAR"],
        "otro": ["RESOLUCIÓN", "TRAMITACIÓN"]
      },
      "datosGeneralesProcedimientos": {
        "numeroExpedienteFolio": "IVERPAT-AV-2023-078",
        "descripcion": "Avalúo de inmueble histórico en el centro de Veracruz",
        "fechaInicioProcedimiento": "05-05-2023",
        "fechaConclusionProcedimiento": "20-09-2023"
      }
    },
    "observaciones": "Avalúo realizado conforme a normas internacionales de valuación",
    "continuaParticipando": true
  }
]
```

### 🔍 **SIN_CLASIFICAR**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440004",
    "fecha": "25-11-2023",
    "ejercicio": "2023",
    "datosGenerales": {
      "nombre": "ANA SOFIA",
      "primerApellido": "MEDINA",
      "segundoApellido": "ORTEGA",
      "curp": "MEDA900312MDFRDNA07",
      "rfc": "MEDA900312JKL",
      "sexo": "MUJER"
    },
    "empleoCargoComision": {
      "entidadFederativa": "Jalisco",
      "nivelOrdenGobierno": "MUNICIPAL",
      "ambitoPublico": "EJECUTIVO",
      "nombreEntePublico": "Municipio de Guadalajara",
      "siglasEntePublico": "MG",
      "nivelJerarquico": {
        "clave": "OPERATIVO_HOMOLOGO"
      },
      "denominacion": "ANALISTA ADMINISTRATIVO",
      "areaAdscripcion": "Dirección de Administración"
    },
    "tipoProcedimiento": "SIN_CLASIFICAR",
    "tipoContratacion": [
      {
        "clave": "CONTRATACION_ADQUISICION"
      }
    ],
    "contratacionAdquisiones": {
      "tipoArea": "AREA_CONTRATANTE",
      "nivelesResponsabilidad": {
        "autorizacionDictamen": [""],
        "justificacionLicitacion": [""],
        "convocatoriaInvitacion": [""],
        "evaluacionProposiciones": [""],
        "adjudicacionContrato": [""],
        "formalizacionContrato": [""],
        "otro": ["RESOLUCIÓN"]
      },
      "datosGeneralesProcedimientos": [
        {
          "numeroExpedienteFolio": "",
          "tipoProcedimiento": "LICITACION_NACIONAL",
          "materia": "ADQUISICION",
          "fechaInicioProcedimiento": "25-11-2023",
          "fechaConclusionProcedimiento": ""
        }
      ],
      "datosBeneficiariosFinales": {
        "razonSocial": "",
        "nombe": "",
        "primerApellido": "",
        "segundoApellido": ""
      },
      "continuaParticipando": true
    },
    "otorgamientoConcesiones": {
      "tipoActo": "CONCESIONES",
      "nivelesResponsabilidad": {
        "convocatoriaLicitacion": [""],
        "dictamenesOpiniones": [""],
        "visitasVerificacion": [""],
        "evaluacionCumplimiento": [""],
        "determinacionOtorgamiento": [""],
        "otro": ["RESOLUCIÓN"]
      },
      "datosGeneralesProcedimientos": {
        "numeroExpedienteFolio": "",
        "denominacion": "ANALISTA ADMINISTRATIVO",
        "objeto": "",
        "fundamento": "",
        "nombrePersonaSolicitaOtorga": "",
        "primerApellidoSolicitaOtorga": "",
        "segundoApellidoSolicitaOtorga": "",
        "denominacionPersonaMoral": "",
        "sectorActo": "",
        "fechaInicioVigencia": "25-11-2023",
        "fechaConclusionVigencia": "",
        "monto": "",
        "urlInformacionActo": ""
      }
    },
    "datosBeneficiariosFinales": {
      "razonSocial": "",
      "nombe": "",
      "primerApellido": "",
      "segundoApellido": "",
      "continuaParticipando": true
    },
    "enajenacionBienes": {
      "nivelesResponsabilidad": {
        "autorizacionesDictamenes": [""],
        "analisisAutorizacion": [""],
        "modificacionBases": [""],
        "presentacionOfertas": [""],
        "evaluacionOfertas": [""],
        "adjudicacionBienes": [""],
        "formalizacionContrato": [""],
        "otro": ["RESOLUCIÓN"]
      },
      "datosGeneralesProcedimientos": {
        "numeroExpedienteFolio": "",
        "descripcion": "ANALISTA ADMINISTRATIVO",
        "fechaInicioProcedimiento": "25-11-2023",
        "fechaConclusionProcedimiento": ""
      }
    },
    "dictaminacionAvaluos": {
      "nivelesResponsabilidad": {
        "propuestasAsignaciones": [""],
        "asignacionAvaluos": [""],
        "emisionDictamenes": [""],
        "otro": ["RESOLUCIÓN"]
      },
      "datosGeneralesProcedimientos": {
        "numeroExpedienteFolio": "",
        "descripcion": "ANALISTA ADMINISTRATIVO",
        "fechaInicioProcedimiento": "25-11-2023",
        "fechaConclusionProcedimiento": ""
      }
    },
    "observaciones": "Registro sin tipo de procedimiento específico definido",
    "continuaParticipando": true
  }
]
```

### ⚠️ **REVISAR_CASOS_SIN_TIPOPROCEDIMIENTO_DEFINIDO**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440005",
    "fecha": "26-11-2023",
    "ejercicio": "2023",
    "datosGenerales": {
      "nombre": "DIEGO FERNANDO",
      "primerApellido": "TORRES",
      "segundoApellido": "VALDEZ",
      "curp": "TOVD850607HDFRLG03",
      "rfc": "TOVD850607MNO",
      "sexo": "HOMBRE"
    },
    "empleoCargoComision": {
      "entidadFederativa": "Nuevo Leon",
      "nivelOrdenGobierno": "ESTATAL",
      "ambitoPublico": "EJECUTIVO",
      "nombreEntePublico": "Secretaría de Desarrollo Económico",
      "siglasEntePublico": "SEDEC",
      "nivelJerarquico": {
        "clave": "JEFATURA_HOMOLOGO"
      },
      "denominacion": "JEFE DE DEPARTAMENTO JURÍDICO",
      "areaAdscripcion": "Departamento Jurídico"
    },
    "tipoProcedimiento": "SIN_CLASIFICAR",
    "tipoContratacion": [
      {
        "clave": "CONTRATACION_ADQUISICION"
      }
    ],
    "contratacionAdquisiones": {
      "tipoArea": "AREA_CONTRATANTE",
      "nivelesResponsabilidad": {
        "autorizacionDictamen": [""],
        "justificacionLicitacion": [""],
        "convocatoriaInvitacion": [""],
        "evaluacionProposiciones": [""],
        "adjudicacionContrato": [""],
        "formalizacionContrato": [""],
        "otro": ["RESOLUCIÓN", "TRAMITACIÓN", "SUPERVISIÓN"]
      },
      "datosGeneralesProcedimientos": [
        {
          "numeroExpedienteFolio": "",
          "tipoProcedimiento": "LICITACION_NACIONAL",
          "materia": "ADQUISICION",
          "fechaInicioProcedimiento": "26-11-2023",
          "fechaConclusionProcedimiento": ""
        }
      ],
      "datosBeneficiariosFinales": {
        "razonSocial": "",
        "nombe": "",
        "primerApellido": "",
        "segundoApellido": ""
      },
      "continuaParticipando": true
    },
    "otorgamientoConcesiones": {
      "tipoActo": "CONCESIONES",
      "nivelesResponsabilidad": {
        "convocatoriaLicitacion": [""],
        "dictamenesOpiniones": [""],
        "visitasVerificacion": [""],
        "evaluacionCumplimiento": [""],
        "determinacionOtorgamiento": [""],
        "otro": ["RESOLUCIÓN", "TRAMITACIÓN", "SUPERVISIÓN"]
      },
      "datosGeneralesProcedimientos": {
        "numeroExpedienteFolio": "",
        "denominacion": "JEFE DE DEPARTAMENTO JURÍDICO",
        "objeto": "",
        "fundamento": "",
        "nombrePersonaSolicitaOtorga": "",
        "primerApellidoSolicitaOtorga": "",
        "segundoApellidoSolicitaOtorga": "",
        "denominacionPersonaMoral": "",
        "sectorActo": "",
        "fechaInicioVigencia": "26-11-2023",
        "fechaConclusionVigencia": "",
        "monto": "",
        "urlInformacionActo": ""
      }
    },
    "datosBeneficiariosFinales": {
      "razonSocial": "",
      "nombe": "",
      "primerApellido": "",
      "segundoApellido": "",
      "continuaParticipando": true
    },
    "enajenacionBienes": {
      "nivelesResponsabilidad": {
        "autorizacionesDictamenes": [""],
        "analisisAutorizacion": [""],
        "modificacionBases": [""],
        "presentacionOfertas": [""],
        "evaluacionOfertas": [""],
        "adjudicacionBienes": [""],
        "formalizacionContrato": [""],
        "otro": ["RESOLUCIÓN", "TRAMITACIÓN", "SUPERVISIÓN"]
      },
      "datosGeneralesProcedimientos": {
        "numeroExpedienteFolio": "",
        "descripcion": "JEFE DE DEPARTAMENTO JURÍDICO",
        "fechaInicioProcedimiento": "26-11-2023",
        "fechaConclusionProcedimiento": ""
      }
    },
    "dictaminacionAvaluos": {
      "nivelesResponsabilidad": {
        "propuestasAsignaciones": [""],
        "asignacionAvaluos": [""],
        "emisionDictamenes": [""],
        "otro": ["RESOLUCIÓN", "TRAMITACIÓN", "SUPERVISIÓN"]
      },
      "datosGeneralesProcedimientos": {
        "numeroExpedienteFolio": "",
        "descripcion": "JEFE DE DEPARTAMENTO JURÍDICO",
        "fechaInicioProcedimiento": "26-11-2023",
        "fechaConclusionProcedimiento": ""
      }
    },
    "observaciones": "Servidor con múltiples responsabilidades en diferentes procedimientos",
    "continuaParticipando": true,
    "_metadata": {
      "requiereRevision": true,
      "razon": "Múltiples tipos de procedimiento: CONTRATACIONES PÚBLICAS, OTORGAMIENTO DE CONCESIONES, ENAJENACIÓN DE BIENES",
      "fechaProcesamiento": "2023-11-26T10:30:00.000Z"
    }
  }
]
```

## 🛠️ Instalación

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/tu-usuario/conversor-estructura-datos.git
   cd conversor-estructura-datos
   ```

2. **Verificar Node.js:**

   ```bash
   node --version  # Requiere Node.js v14 o superior
   ```

3. **Hacer el script ejecutable (opcional):**
   ```bash
   chmod +x converter.js
   ```

## 🚀 Uso

### Sintaxis Básica

```bash
node converter.js <directorio_origen> <directorio_destino>
```

### Ejemplos

```bash
# Ejemplo básico
node converter.js ./datos_originales ./datos_convertidos

# Con rutas absolutas
node converter.js /ruta/completa/origen /ruta/completa/destino

# Procesamiento de múltiples subdirectorios
node converter.js ./datos_complejos ./resultados
```

## 📁 Archivos Generados

El script genera los siguientes archivos en el directorio destino:

- **`contratacion_publica.json`** - Array de objetos con procedimientos de contratación pública
- **`otorgamiento_concesiones.json`** - Array de objetos con concesiones, licencias y permisos
- **`enajenacion_bienes.json`** - Array de objetos con enajenación de bienes muebles
- **`dictamen_valuatorio.json`** - Array de objetos con dictámenes valuatorios y justipreciación
- **`sin_clasificar.json`** - Array de objetos que no coinciden con patrones conocidos (incluye todas las estructuras)
- **`revisar_casos_sin_tipoProcedimiento_definido.json`** - Array de objetos con múltiples procedimientos (requiere revisión manual)
- **`_resumen_procesamiento.json`** - Estadísticas y metadatos del procesamiento

## 🔍 Clasificación Automática

### Criterios de Clasificación

| Categoría                       | Patrones de Reconocimiento                                               | Estructura Generada                                     |
| ------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------- |
| **Contratación Pública**        | Contratación pública, licitación, adjudicación, contratos, adquisiciones | `tipoContratacion` + `contratacionAdquisiones`          |
| **Otorgamiento de Concesiones** | Concesiones, licencias, permisos, autorizaciones, prórrogas              | `otorgamientoConcesiones` + `datosBeneficiariosFinales` |
| **Enajenación de Bienes**       | Enajenación, bienes muebles, venta, disposición                          | `enajenacionBienes`                                     |
| **Dictamen Valuatorio**         | Dictamen valuatorio, justipreciación, avalúos, rentas                    | `dictaminacionAvaluos`                                  |
| **Sin Clasificar**              | No coincide con ningún patrón                                            | Todas las estructuras con campos vacíos                 |
| **Revisar Casos**               | Múltiples tipos de procedimiento                                         | Todas las estructuras + metadata                        |

### Niveles Jerárquicos

| Nivel                      | Patrones                                   | Ejemplo                           |
| -------------------------- | ------------------------------------------ | --------------------------------- |
| **DIRECCION_GENERAL**      | Director General, Secretario               | "SECRETARIO DE HACIENDA"          |
| **SUBSECRETARIA_HOMOLOGO** | Subsecretario, Subsecretaria               | "SUBSECRETARIO DE COMUNICACIONES" |
| **DG_HOMOLOGO**            | Director General Adjunto, DG               | "COORDINADOR GENERAL DE AVALÚOS"  |
| **DIRECCION_HOMOLOGO**     | Director, Coordinador General, Regidor     | "DIRECTORA DE ADQUISICIONES"      |
| **SUBDIRECCION_HOMOLOGO**  | Subdirector, Coordinador                   | "SUBDIRECTOR DE PATRIMONIO"       |
| **JEFATURA_HOMOLOGO**      | Jefe, Supervisor                           | "JEFE DE DEPARTAMENTO JURÍDICO"   |
| **OPERATIVO_HOMOLOGO**     | Operativo, Analista, Técnico, Especialista | "ANALISTA ADMINISTRATIVO"         |
| **OTRO**                   | No coincide con patrones conocidos         | "CONTADOR ESPECIALIZADO"          |

## 📊 Transformaciones Aplicadas

1. **Fechas:** ISO 8601 → DD-MM-YYYY
2. **Género:** M/F → HOMBRE/MUJER
3. **Niveles de responsabilidad:** Objetos → Arrays de valores
4. **Entidades federativas:** Inferencia automática
5. **Niveles de gobierno:** FEDERAL/ESTATAL/MUNICIPAL
6. **Ámbitos públicos:** EJECUTIVO/LEGISLATIVO/JUDICIAL
7. **UUIDs:** Generación automática para objetos sin ID
8. **Estructura específica:** Según tipo de procedimiento detectado

## 🎯 Ejemplo de Ejecución

```bash
$ node converter.js ./datos_origen ./datos_destino

🔄 INICIANDO CONVERSIÓN DE ESTRUCTURA DE DATOS

📂 Directorio origen: /home/usuario/datos_origen
📂 Directorio destino: /home/usuario/datos_destino

📖
```
