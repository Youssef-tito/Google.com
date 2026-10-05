app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Veuillez remplir tous les champs' });
  }

  // 1. صيغة البريد الإلكتروني العامة (Regex)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Adresse e-mail invalide' });
  }

  // 2. التحقق من أن البريد ينتهي بـ @gmail.com
  if (!email.toLowerCase().endsWith('@gmail.com')) {
    return res.status(400).json({ message: 'Veuillez utiliser un compte Google valide (@gmail.com)' });
  }

  // إدخال البيانات في قاعدة البيانات بعد التأكد من صحة البريد
  const stmt = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)');
  stmt.run(email, password, function(err) {
    if (err) {
      return res.status(500).json({ message: 'Erreur serveur' });
    }
    res.json({ success: true, userId: this.lastID });
  });
  stmt.finalize();
});
