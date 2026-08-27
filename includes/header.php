<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?= htmlspecialchars($pageTitle ?? "CloudNova") ?></title>
<meta name="description" content="Professional cloud, business email and managed IT solutions.">
<script src="https://cdn.tailwindcss.com"></script>
<script>
tailwind.config = {
  theme: {
    extend: {
      colors: { brand: { 50:"#eff6ff",100:"#dbeafe",500:"#2563eb",600:"#1d4ed8",700:"#1e40af",900:"#172554" } }
    }
  }
}
</script>
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body class="bg-white text-slate-900 antialiased">
