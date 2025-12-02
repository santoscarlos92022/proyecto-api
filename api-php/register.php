<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data["usuario"]) || empty($data["password"])) {
    http_response_code(400);
    echo json_encode(["message" => "Usuario y contraseña requeridos"]);
    exit;
}

$usuario  = $data["usuario"];
$password = $data["password"];

$usuarios = file_exists("usuarios.json")
    ? (json_decode(file_get_contents("usuarios.json"), true) ?: [])
    : [];

if (array_filter($usuarios, fn($u) => $u["usuario"] === $usuario)) {
    http_response_code(409);
    echo json_encode(["message" => "El usuario ya existe"]);
    exit;
}

$usuarios[] = compact("usuario", "password");

file_put_contents("usuarios.json", json_encode($usuarios, JSON_PRETTY_PRINT));

echo json_encode(["message" => "Registro exitoso"]);
?>
