// Section.js
export default function About() {
  return (
    <section className="pt-40 pb-5 flex flex-col items-center gap-8 bg-base-200">
      <div className="w-full">
        <h1 className="text-6xl font-bold mb-6 text-center">
          Ligue Futsal Mauricie
            <object
                data="public/REGLEMENTS.pdf"
                type="application/pdf"
                width="100%"
                height="30px"
                className="text-xl"
            >
                <a href="/REGLEMENTS.pdf" target="_blank" rel="noopener noreferrer">
                    Ouvrir les règlements
                </a>
            </object>
        </h1>
      </div>
    </section>
  );
}
