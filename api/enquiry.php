<?php
require __DIR__.'/../config/database.php';
session_start();
if($_SERVER['REQUEST_METHOD']!=='POST' || !hash_equals($_SESSION['csrf']??'',$_POST['csrf']??'')){http_response_code(403);exit('Invalid request');}
$name=trim($_POST['name']??'');$email=trim($_POST['email']??'');$phone=trim($_POST['phone']??'');$company=trim($_POST['company']??'');$message=trim($_POST['message']??'');
if($name===''||!filter_var($email,FILTER_VALIDATE_EMAIL)||$message===''){exit('Please provide valid details.');}
$stmt=$pdo->prepare("INSERT INTO enquiries(name,email,phone,company,message) VALUES(?,?,?,?,?)");
$stmt->execute([$name,$email,$phone,$company,$message]);
header('Location: ../index.php?sent=1#contact');exit;
