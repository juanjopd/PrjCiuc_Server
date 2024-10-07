# Proceso de Migración con Sequelize

Este documento describe el proceso para realizar migraciones en una base de datos utilizando Sequelize.

## Requisitos Previos

1. **Node.js y npm** deben estar instalados.
2. **Sequelize CLI** y **MySQL** deben estar instalados y configurados.
3. Asegúrate de tener un archivo de configuración para Sequelize (config/config.json).
4. Debe estar encendido el servicio de Mysql en tu computadora.

## Pasos para Realizar Migraciones

### 1. Configuración de la Base de Datos

1. Accede a MySQL:
   ```bash
   mysql -u root -p
   ```
2. Crea la base de datos si no existe: (en este caso se llama CiucBD)
   ```sql
   CREATE DATABASE CiucBD;
   ```
3. Concede privilegios al usuario:
   ```sql
   GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost';
   FLUSH PRIVILEGES;
   ```

### 2. Generar una Migración

Para crear una nueva migración, utiliza el siguiente comando en la terminal:

```bash
npx sequelize-cli migration:generate --name nombre_de_la_migracion
```

Reemplaza `nombre_de_la_migracion` con un nombre descriptivo.

### 3. Modificar el Archivo de Migración

1. Navega a la carpeta `migrations` y abre el archivo generado.
2. Modifica la función `up` para definir las tablas y columnas.
3. Modifica la función `down` para definir cómo revertir los cambios.

Ejemplo de archivo de migración:

```javascript
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('nombre_tabla', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre_columna: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('nombre_tabla');
  }
};
```

### 4. Ejecutar la Migración

Una vez que hayas modificado el archivo de migración, ejecuta el siguiente comando para aplicar los cambios:

```bash
npx sequelize-cli db:migrate
```

### 5. Verificar las Tablas

Accede a MySQL y verifica si las tablas se han creado correctamente:

```bash
mysql -u root -p
USE CiucBD;
SHOW TABLES;
```

### 6. Revertir Migraciones (si es necesario)

Si necesitas deshacer la última migración, puedes usar:

```bash
npx sequelize-cli db:migrate:undo
```

### 7. Estado de las Migraciones

Para verificar el estado de las migraciones, usa:

```bash
npx sequelize-cli db:migrate:status
```
