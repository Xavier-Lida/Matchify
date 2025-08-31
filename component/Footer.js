function Footer() {
  return (
    <footer className="footer sm:footer-horizontal footer-center bg-base-200 text-base-content p-4 border border-gray-300">
      <aside className="flex flex-col items-center gap-2">
        <div className="flex flex-row items-center justify-center gap-3 w-full">
          <p className="mb-0">
            Propulsé par Matchify © {new Date().getFullYear()} - Matchify. Tous
            droits réservés.
          </p>
          <a
            href="https://www.facebook.com/groups/270051026369012"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:text-primary"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24h11.495v-9.294H9.691v-3.622h3.13V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.405 24 24 23.408 24 22.674V1.326C24 .592 23.405 0 22.675 0" />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/liguefutsalmauricie"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-primary"
          >
            <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm5.25.75a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
            </svg>
          </a>
        </div>
      </aside>
    </footer>
  );
}
export default Footer;
