<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data["usuario"]) || !isset($data["password"])) { http_response_code(400);
    echo json_encode(["message" => "Usuario y contraseña requeridos"], JSON_UNESCAPED_UNICODE);
    exit;}
$usuario = $data["usuario"];
$password = $data["password"];
$usuarios = [];
if (file_exists("usuarios.json")) {
    $contenido = file_get_contents("usuarios.json");
    $decoded = json_decode($contenido, true);if (is_array($decoded)) {
        $usuarios = $decoded;}}
foreach ($usuarios as $u) { if ($u["usuario"] === $usuario && $u["password"] === $password) {
        http_response_code(200);
        echo json_encode(["message" => "Autenticación satisfactoria"], JSON_UNESCAPED_UNICODE);
        exit;}
}
http_response_code(401);
echo json_encode(["message" => "Error en la autenticación"], JSON_UNESCAPED_UNICODE);
?>
