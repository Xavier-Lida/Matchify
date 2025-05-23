import GoogleButton from "./GoogleButton";

function Login() {
  return (
    <div className="flex w-full min-h-screen items-center justify-center">
      <div className="card w-96 bg-white card-lg shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-4xl mb-5">
            Matchify <span className="font-light">Compte</span>
          </h2>

          <GoogleButton />
          {/*
          <div className="divider">OU</div>

          <label className="label">Nom d'utilisateur</label>
          <input
            type="text"
            className="input bg-white"
            placeholder="Nom d'utilisateur"
          />

          <label className="label">Courriel</label>
          <input
            type="email"
            className="input bg-white"
            placeholder="Courriel"
          />

          <label className="label">Mot de passe</label>
          <input
            type="password"
            className="input bg-white"
            placeholder="Mot de passe"
          />

          <div className="card-actions mt-5">
            <button className="btn btn-primary hover:bg-base-300 w-full">
              Connexion
            </button>
          </div>
          */}
        </div>
      </div>
    </div>
  );
}
export default Login;
