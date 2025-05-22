function Footer() {
  return (
    <footer className="footer sm:footer-horizontal footer-center bg-base-200 text-base-content p-4 border border-gray-300">
      <aside>
        <p>
          Propulsé par Matchify © {new Date().getFullYear()} - Matchify. Tous
          droits réservés.
        </p>
      </aside>
    </footer>
  );
}
export default Footer;
