<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Archivo donde se almacenarán las tareas
$tasksFile = 'tasks.json';

// Función para leer tareas desde el archivo JSON
function readTasks($file) {
    if (!file_exists($file)) {
        return [];
    }
    
    $content = file_get_contents($file);
    if (empty($content)) {
        return [];
    }
    
    $tasks = json_decode($content, true);
    return $tasks ? $tasks : [];
}

// Función para guardar tareas en el archivo JSON
function saveTasks($file, $tasks) {
    $json = json_encode($tasks, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    return file_put_contents($file, $json) !== false;
}

// Obtener la acción solicitada
$action = $_GET['action'] ?? null;

// Si es POST, obtener datos del body
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    $action = $data['action'] ?? null;
}

// Procesar la acción
try {
    switch ($action) {
        case 'read':
            // Leer todas las tareas
            $tasks = readTasks($tasksFile);
            echo json_encode([
                'success' => true,
                'tasks' => $tasks
            ]);
            break;

        case 'create':
            // Crear una nueva tarea
            if (!isset($data['task'])) {
                throw new Exception('Datos de tarea no proporcionados');
            }

            $newTask = $data['task'];
            
            // Validar datos
            if (empty($newTask['text'])) {
                throw new Exception('El texto de la tarea no puede estar vacío');
            }

            $tasks = readTasks($tasksFile);
            
            // Asegurar que el ID sea único
            if (isset($newTask['id'])) {
                $existingIds = array_column($tasks, 'id');
                while (in_array($newTask['id'], $existingIds)) {
                    $newTask['id'] = $newTask['id'] + 1;
                }
            }

            $tasks[] = $newTask;
            
            if (saveTasks($tasksFile, $tasks)) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Tarea creada exitosamente',
                    'task' => $newTask
                ]);
            } else {
                throw new Exception('Error al guardar la tarea');
            }
            break;

        case 'update':
            // Actualizar una tarea existente
            if (!isset($data['id']) || !isset($data['task'])) {
                throw new Exception('ID o datos de tarea no proporcionados');
            }

            $taskId = $data['id'];
            $updatedTask = $data['task'];
            
            $tasks = readTasks($tasksFile);
            $found = false;

            foreach ($tasks as $index => $task) {
                if ($task['id'] == $taskId) {
                    $tasks[$index] = $updatedTask;
                    $found = true;
                    break;
                }
            }

            if (!$found) {
                throw new Exception('Tarea no encontrada');
            }

            if (saveTasks($tasksFile, $tasks)) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Tarea actualizada exitosamente',
                    'task' => $updatedTask
                ]);
            } else {
                throw new Exception('Error al guardar los cambios');
            }
            break;

        case 'delete':
            // Eliminar una tarea
            if (!isset($data['id'])) {
                throw new Exception('ID de tarea no proporcionado');
            }

            $taskId = $data['id'];
            $tasks = readTasks($tasksFile);
            $initialCount = count($tasks);

            $tasks = array_filter($tasks, function($task) use ($taskId) {
                return $task['id'] != $taskId;
            });

            $tasks = array_values($tasks); // Reindexar array

            if (count($tasks) < $initialCount) {
                if (saveTasks($tasksFile, $tasks)) {
                    echo json_encode([
                        'success' => true,
                        'message' => 'Tarea eliminada exitosamente'
                    ]);
                } else {
                    throw new Exception('Error al guardar los cambios');
                }
            } else {
                throw new Exception('Tarea no encontrada');
            }
            break;

        default:
            throw new Exception('Acción no válida');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>

