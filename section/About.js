// Section.js
export default function About() {
  return (
    <section className="pt-40 pb-15 flex flex-col items-center gap-8 bg-base-200">
      <div className="w-full">
        <h1 className="text-6xl font-bold mb-6 text-center">
          Ligue Futsal Mauricie
        </h1>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          <p className="text-xl mb-0">18 équipes</p>
          <p className="text-xl mb-0">3 divisions</p>
          <p className="text-xl mb-0">Dimanche de 18h à 22h</p>
        </div>
      </div>
    </section>
  );
}
