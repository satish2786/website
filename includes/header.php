<?php
session_start();
if(empty($_SESSION['csrf'])) $_SESSION['csrf']=bin2hex(random_bytes(32));
?>
<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title><?=htmlspecialchars($pageTitle??'CloudNova')?></title><script src="https://cdn.tailwindcss.com"></script><link rel="stylesheet" href="assets/css/style.css"></head><body class="text-slate-900">