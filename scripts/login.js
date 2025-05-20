function connecter() {
  const codeEntre = document.getElementById('code').value.trim();
  fetch('data/connexions.json')
    .then(res => res.json())
    .then(codes => {
      const entry = codes.find(e => e.code === codeEntre);
      if (entry) {
        localStorage.setItem('equipeConnectee', entry.equipe);
        window.location.href = 'dashboard.html';
      } else {
        document.getElementById('message').textContent = "Code invalide.";
      }
    });
}
