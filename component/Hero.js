function Hero() {
  return (
    <div className="hero bg-base-300 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Matchify</h1>
          <p className="py-4">
            <span className="text-lg font-bold">Site officiel de la Ligue Fustal Mauricie.</span>
            <br></br>
            Pour suivre les matchs, les classements, les statistiques et faire vos prédictions!
          </p>
          <button className="btn btn-primary">Commencer</button>
        </div>
      </div>
    </div>
  );
}
export default Hero;
