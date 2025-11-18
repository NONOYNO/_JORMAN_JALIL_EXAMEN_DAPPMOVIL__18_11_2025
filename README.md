# To-Do List - Aplicación Web

Una aplicación web moderna y dinámica para gestionar tareas, desarrollada con PHP, HTML, CSS y JavaScript.

## 🚀 Características

- ✅ **Interfaz moderna y atractiva**: Diseño limpio con gradientes y animaciones suaves
- 📱 **Totalmente responsive**: Se adapta perfectamente a dispositivos móviles, tablets y escritorio
- ⚡ **Interacción dinámica**: Todas las operaciones se realizan sin recargar la página
- 💾 **Persistencia de datos**: Las tareas se guardan en un archivo JSON
- 🎨 **Animaciones fluidas**: Transiciones y efectos visuales modernos
- 📊 **Estadísticas en tiempo real**: Contador de tareas totales, completadas y pendientes
- 🔍 **Filtros**: Visualiza todas las tareas, solo las completadas o solo las pendientes
- ✏️ **Edición inline**: Edita las tareas directamente desde la lista

## 📋 Requisitos

- Servidor web con PHP 7.0 o superior
- Navegador web moderno (Chrome, Firefox, Safari, Edge)

## 🛠️ Instalación

1. Clona o descarga este repositorio
2. Coloca los archivos en el directorio de tu servidor web (por ejemplo, `htdocs` en XAMPP o `www` en WAMP)
3. Asegúrate de que el archivo `tasks.json` tenga permisos de escritura
4. Abre tu navegador y accede a `http://localhost/To-Do-List/index.html`

## 📁 Estructura de Archivos

```
To-Do-List/
├── index.html      # Estructura HTML principal
├── style.css       # Estilos y diseño responsive
├── script.js       # Lógica JavaScript para interacción dinámica
├── api.php         # Backend PHP para operaciones CRUD
├── tasks.json      # Archivo de almacenamiento de tareas
└── README.md       # Este archivo
```

## 🎯 Funcionalidades

### Agregar Tareas
- Escribe una nueva tarea en el campo de texto
- Presiona "Agregar" o Enter para guardarla

### Marcar como Completada
- Haz clic en el checkbox junto a la tarea
- La tarea se marcará como completada con un efecto visual

### Editar Tareas
- Haz clic en el botón de editar (✏️)
- Modifica el texto directamente
- Presiona Enter para guardar o Escape para cancelar

### Eliminar Tareas
- Haz clic en el botón de eliminar (🗑️)
- Confirma la eliminación en el diálogo

### Filtrar Tareas
- Usa los botones de filtro para ver:
  - **Todas**: Muestra todas las tareas
  - **Pendientes**: Solo tareas no completadas
  - **Completadas**: Solo tareas completadas

## 🎨 Características de Diseño

- **Gradientes modernos**: Colores vibrantes y profesionales
- **Animaciones suaves**: Transiciones fluidas en todas las interacciones
- **Tarjetas con sombras**: Efecto de profundidad y modernidad
- **Iconos intuitivos**: Interfaz fácil de usar
- **Notificaciones**: Feedback visual para todas las acciones

## 🔧 Personalización

Puedes personalizar los colores editando las variables CSS en `style.css`:

```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    --success-color: #10b981;
    --danger-color: #ef4444;
    /* ... más colores */
}
```

## 📝 Notas

- El archivo `tasks.json` se crea automáticamente si no existe
- Las tareas se guardan inmediatamente después de cada acción
- Los datos persisten entre sesiones

## 🌐 Compatibilidad

- ✅ Chrome/Edge (últimas versiones)
- ✅ Firefox (últimas versiones)
- ✅ Safari (últimas versiones)
- ✅ Navegadores móviles modernos

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso educativo y personal.

---

Desarrollado con ❤️ usando PHP, HTML, CSS y JavaScript

