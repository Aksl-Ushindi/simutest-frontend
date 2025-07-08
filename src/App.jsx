import { useState } from "react";

function App() {
  const [form, setForm] = useState({
    nom: "",
    age: 0,
    statut_professionnel: "Salarié",
    revenu_annuel: "50k-100k",
    epargne_disponible: "5k-10k",
    enfants_a_charge: 0,
    canton: "VD",
    objectif_principal: "Protection",
    objectif_secondaire: "",
    three_pilier_existants: false,
    assurance_vie_existante: false,
    niveau_connaissance_financiere: "Intermédiaire"
  });

  const [resultat, setResultat] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mapRevenu = {
      "<50k": 40000,
      "50k-100k": 75000,
      ">100k": 120000
    };

    const mapEpargne = {
      "<5k": 3000,
      "5k-10k": 8000,
      ">10k": 15000
    };

    const payload = {
      ...form,
      revenu_annuel: mapRevenu[form.revenu_annuel],
      epargne_disponible: mapEpargne[form.epargne_disponible]
    };

    const res = await fetch("https://simutest.onrender.com/diagnostic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    setResultat(data);
  };

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: "auto", color: "white" }}>
      <h1>Simulateur Expert PPI</h1>
      <form onSubmit={handleSubmit}>
        <input name="nom" placeholder="Nom" onChange={handleChange} /><br />
        <input name="age" type="number" placeholder="Âge" onChange={handleChange} /><br />

        <label>Statut professionnel :</label><br />
        <select name="statut_professionnel" onChange={handleChange}>
          <option>Salarié</option>
          <option>Indépendant</option>
          <option>Étudiant</option>
          <option>Retraité</option>
          <option>Autre</option>
        </select><br />

        <label>Revenu annuel :</label><br />
        <select name="revenu_annuel" onChange={handleChange}>
          <option>&lt;50k</option>
          <option>50k-100k</option>
          <option>&gt;100k</option>
        </select><br />

        <label>Épargne disponible :</label><br />
        <select name="epargne_disponible" onChange={handleChange}>
          <option>&lt;5k</option>
          <option>5k-10k</option>
          <option>&gt;10k</option>
        </select><br />

        <input name="enfants_a_charge" type="number" placeholder="Enfants à charge" onChange={handleChange} /><br />

        <label>Canton :</label><br />
        <select name="canton" onChange={handleChange}>
          <option>VD</option>
          <option>GE</option>
          <option>FR</option>
          <option>VS</option>
          <option>NE</option>
        </select><br />

        <label>Objectif principal :</label><br />
        <select name="objectif_principal" onChange={handleChange}>
          <option>Protection</option>
          <option>Épargne</option>
          <option>Optimisation fiscale</option>
          <option>Transmission</option>
        </select><br />

        <input name="objectif_secondaire" placeholder="Objectif secondaire (optionnel)" onChange={handleChange} /><br />

        <label>
          3e pilier existant :
          <input type="checkbox" name="three_pilier_existants" onChange={handleChange} />
        </label><br />

        <label>
          Assurance vie existante :
          <input type="checkbox" name="assurance_vie_existante" onChange={handleChange} />
        </label><br />

        <label>Niveau financier :</label><br />
        <select name="niveau_connaissance_financiere" onChange={handleChange}>
          <option>Débutant</option>
          <option>Intermédiaire</option>
          <option>Avancé</option>
        </select><br />

        <button type="submit">Analyser</button>
      </form>

      {resultat && (
        <div style={{ marginTop: 20 }}>
          <h2>Diagnostic personnalisé</h2>
          {resultat.recommandations?.length > 0 ? (
            resultat.recommandations.map((rec, i) => (
              <div key={i} style={{
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 16,
                marginBottom: 16,
                background: "#1e1e1e"
              }}>
                <div style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  marginBottom: 8,
                  color: rec.pertinence >= 3 ? "limegreen" : rec.pertinence === 2 ? "gold" : "orange"
                }}>
                  Pertinence : {rec.pertinence}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <strong>Justification :</strong><br />
                  {rec.justification}
                </div>
                <div>
                  <strong>Solutions recommandées :</strong>
                  <ul>
                    {rec.solutions.map((s, j) => (
                      <li key={j}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <p>Aucune recommandation trouvée pour ce profil.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
