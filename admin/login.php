<?php
session_start(); require __DIR__.'/../config/database.php';
$error='';
if($_SERVER['REQUEST_METHOD']==='POST'){
 $s=$pdo->prepare("SELECT * FROM admins WHERE email=? LIMIT 1");$s->execute([$_POST['email']??'']);$a=$s->fetch();
 if($a && password_verify($_POST['password']??'',$a['password_hash'])){$_SESSION['admin_id']=$a['id'];header('Location: index.php');exit;}
 $error='Invalid email or password';
}
?><!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Admin Login</title><script src="https://cdn.tailwindcss.com"></script></head><body class="grid min-h-screen place-items-center bg-slate-100"><form method="post" class="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl"><h1 class="text-2xl font-black">CloudNova Admin</h1><?php if($error):?><p class="mt-4 text-red-600"><?=$error?></p><?php endif;?><input required type="email" name="email" placeholder="Email" class="mt-6 w-full rounded-xl border p-3"><input required type="password" name="password" placeholder="Password" class="mt-4 w-full rounded-xl border p-3"><button class="mt-5 w-full rounded-xl bg-blue-600 p-3 font-bold text-white">Login</button></form></body></html>