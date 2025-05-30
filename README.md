# Script de migracion de estructura de datos de la version 1 a la versión 1.1 del Sistema de los servidores públicos que intervengan en procedimientos de contrataciones públicas (sistema 2) en formato JSON

Un script de Node.js para convertir archivos JSON de estructura gubernamental a un formato estándar, clasificando automáticamente los datos por tipo de procedimiento y generando archivos organizados.

## 📋 Descripción

Este script transforma datos de servidores públicos y procedimientos administrativos desde su formato original a una estructura JSON estándar, clasificando automáticamente los registros según el tipo de procedimiento y generando archivos organizados por categoría.

## 🚀 Características

- **Conversión automática** de estructura de datos JSON
- **Clasificación inteligente** por tipo de procedimiento
- **Generación de archivos por categoría** con arrays de objetos
- **Validación de datos** de entrada
- **Inferencia automática** de entidades federativas y niveles de gobierno
- **Manejo de casos especiales** (múltiples procedimientos)
- **Reportes detallados** de procesamiento

## 📂 Estructura de Entrada

El script procesa archivos JSON con la siguiente estructura:

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
    "nombres": "ISRAEL",
    "primerApellido": "JUAREZ",
    "segundoApellido": "MENDEZ",
    "genero": {
      "clave": "M",
      "valor": "MASCULINO"
    },
    "institucionDependencia": {
      "nombre": "Municipio de Sabanilla",
      "siglas": "",
      "clave": "210"
    },
    "puesto": {
      "nivel": "MUNICIPAL",
      "nombre": "REGIDOR"
    },
    "tipoArea": [
      {
        "clave": "RE",
        "valor": "RESPONSABLE DE LA EJECUCIÓN DE LOS TRABAJOS"
      }
    ],
    "nivelResponsabilidad": [
      {
        "clave": "R",
        "valor": "RESOLUCIÓN"
      }
    ],
    "tipoProcedimiento": [
      {
        "clave": 5,
        "valor": "OTRO"
      }
    ]
  }
]
```

## 📤 Estructura de Salida

El script genera archivos JSON con arrays de objetos transformados:

```json
[
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

- **`contratacion_publica.json`** - Procedimientos de contratación pública
- **`otorgamiento_concesiones.json`** - Concesiones, licencias y permisos
- **`enajenacion_bienes.json`** - Enajenación de bienes muebles
- **`dictamen_valuatorio.json`** - Dictámenes valuatorios y justipreciación
- **`sin_clasificar.json`** - Casos que no coinciden con patrones conocidos
- **`revisar_casos_sin_tipoProcedimiento_definido.json`** - Casos con múltiples procedimientos
- **`_resumen_procesamiento.json`** - Estadísticas y metadatos del procesamiento

## 🔍 Clasificación Automática

### Criterios de Clasificación

| Categoría                       | Patrones de Reconocimiento                                               |
| ------------------------------- | ------------------------------------------------------------------------ |
| **Contratación Pública**        | Contratación pública, licitación, adjudicación, contratos, adquisiciones |
| **Otorgamiento de Concesiones** | Concesiones, licencias, permisos, autorizaciones, prórrogas              |
| **Enajenación de Bienes**       | Enajenación, bienes muebles, venta, disposición                          |
| **Dictamen Valuatorio**         | Dictamen valuatorio, justipreciación, avalúos, rentas                    |
| **Sin Clasificar**              | No coincide con ningún patrón (incluye todas las estructuras vacías)     |
| **Revisar Casos**               | Múltiples tipos de procedimiento detectados                              |

### Niveles Jerárquicos

| Nivel                     | Patrones                                             |
| ------------------------- | ---------------------------------------------------- |
| **DIRECCION_GENERAL**     | Director General, Secretario                         |
| **DIRECCION_HOMOLOGO**    | Director, Coordinador General, Regidor, Alcalde      |
| **SUBDIRECCION_HOMOLOGO** | Subdirector, Coordinador                             |
| **JEFATURA_HOMOLOGO**     | Jefe, Supervisor                                     |
| **OPERATIVO_HOMOLOGO**    | Operativo, Analista, Técnico, Especialista, Auxiliar |
| **OTRO**                  | No coincide con patrones conocidos                   |

## 📊 Transformaciones Aplicadas

1. **Fechas:** ISO 8601 → DD-MM-YYYY
2. **Género:** M/F → HOMBRE/MUJER
3. **Niveles de responsabilidad:** Objetos → Arrays de claves
4. **Entidades federativas:** Inferencia automática
5. **Niveles de gobierno:** FEDERAL/ESTATAL/MUNICIPAL
6. **Ámbitos públicos:** EJECUTIVO/LEGISLATIVO/JUDICIAL
7. **UUIDs:** Generación automática para objetos sin ID

## 🎯 Ejemplo de Ejecución

```bash
$ node converter.js ./datos_origen ./datos_destino

🔄 INICIANDO CONVERSIÓN DE ESTRUCTURA DE DATOS

📂 Directorio origen: /home/usuario/datos_origen
📂 Directorio destino: /home/usuario/datos_destino

📖 Leyendo archivos JSON...
✅ Archivo leído: municipios/sabanilla.json
✅ Se encontraron 150 objetos para procesar

🗑️  Limpiando directorio existente: /home/usuario/datos_destino
📁 Creando directorio destino: /home/usuario/datos_destino
🔄 Convirtiendo estructura de datos...
📝 Generando archivos JSON...
💾 Escribiendo archivos...

=== RESUMEN DE LA CONVERSIÓN ===
✅ Objetos procesados: 150
📄 Archivos generados: 7

📊 CLASIFICACIÓN POR TIPO DE PROCEDIMIENTO:
   📁 contratacion_publica.json: 45 objetos
   📁 otorgamiento_concesiones.json: 23 objetos
   📁 enajenacion_bienes.json: 12 objetos
   📁 dictamen_valuatorio.json: 18 objetos
   📁 sin_clasificar.json: 49 objetos
   ⚠️  revisar_casos_sin_tipoProcedimiento_definido.json: 3 objetos

🎉 Conversión completada exitosamente!
```

## ⚠️ Consideraciones

### Casos Especiales

- **Múltiples procedimientos:** Se incluyen todas las estructuras de procedimiento
- **Sin clasificar:** Se generan todas las estructuras con campos vacíos
- **Datos faltantes:** Se validan campos obligatorios (nombres, primerApellido)
- **Formatos de fecha:** Se manejan diferentes formatos de entrada

### Validaciones

- Verificación de directorios de origen y destino
- Validación de estructura JSON
- Detección de campos obligatorios faltantes
- Manejo de errores y advertencias

## 🐛 Resolución de Problemas

### Errores Comunes

**Error: El directorio origen no existe**

```bash
❌ Error: El directorio origen no existe: /ruta/inexistente
```

_Solución:_ Verificar que la ruta del directorio origen sea correcta.

**Error: Faltan campos obligatorios**

```bash
❌ Objeto 5: Faltan campos obligatorios (nombres/primerApellido)
```

_Solución:_ Revisar la estructura de los datos de entrada.

**No se encontraron archivos JSON**

```bash
⚠️  No se encontraron archivos JSON en el directorio origen
```

_Solución:_ Verificar que existan archivos .json en el directorio especificado.

### Archivo de Log

Consultar `_resumen_procesamiento.json` para:

- Errores detallados de procesamiento
- Estadísticas completas de conversión
- Criterios de clasificación utilizados
- Metadatos del procesamiento

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el repositorio
2. Crear una rama para la característica (`git checkout -b feature/nueva-caracteristica`)
3. Commit los cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abrir un Pull Request

## 📞 Soporte

Para reportar problemas o solicitar características:

- Crear un [Issue](https://github.com/tu-usuario/conversor-estructura-datos/issues)
- Enviar un Pull Request con correcciones

## 📝 Changelog

### v1.0.0 (2024-12-XX)

- Implementación inicial del conversor
- Clasificación automática por tipo de procedimiento
- Generación de archivos por categoría
- Validación y manejo de errores
- Inferencia de entidades federativas y niveles de gobierno

---

**Desarrollado con ❤️ para la gestión eficiente de datos gubernamentales**
