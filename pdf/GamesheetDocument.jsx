import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Styles for Spordle-like layout
const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 10, fontFamily: "Helvetica" },
  headerBox: {
    border: "1pt solid #333",
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
    backgroundColor: "#f5f5f5",
  },
  league: { fontSize: 14, fontWeight: "bold", textAlign: "center", marginBottom: 4 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  headerLabel: { fontWeight: "bold" },
  teamsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  teamBlock: { width: "48%" },
  table: { border: "1pt solid #333", marginBottom: 8 },
  tableRow: { 
    flexDirection: "row", 
    borderBottom: "1pt solid #ccc", 
    alignItems: "center", 
    minHeight: 18,
    height: 18,
  },
  tableHeader: { backgroundColor: "#e6e6e6", fontWeight: "bold" },
  cellStatut: { width: 50, textAlign: "center", padding: 2, borderRight: "1pt solid #ccc", height: 18, overflow: "hidden" },
  cellNum: { width: 30, textAlign: "center", padding: 2, borderRight: "1pt solid #ccc", height: 18, overflow: "hidden" },
  cellName: { width: 220, textAlign: "left", paddingLeft: 4, borderRight: "1pt solid #ccc", height: 18, overflow: "hidden" },
  cellCartons: { width: 60, textAlign: "center", padding: 2, borderRight: "1pt solid #ccc", height: 18, overflow: "hidden" },
  cellButs: { width: 40, textAlign: "center", padding: 2, height: 18, overflow: "hidden" },
  officials: { marginBottom: 8 },
  signatures: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  legend: { fontSize: 8, marginTop: 8, color: "#555" },
});

export default function GamesheetDocument({ game, team, opponent, players }) {
  // Ensure at least 10 rows for players
  const filledPlayers = [
    ...players,
    ...Array(Math.max(0, 10 - players.length)).fill({}),
  ].slice(0, 10);

  return (
    <Document>
      <Page style={styles.page}>
        {/* Header Box */}
        <View style={styles.headerBox}>
          <Text style={styles.league}>
            {game.league || "Ligue Futsal Mauricie"}
          </Text>
          <View style={styles.headerRow}>
            <Text>
              <Text style={styles.headerLabel}>Date:</Text> {game.date}
            </Text>
            <Text>
              <Text style={styles.headerLabel}>Heure:</Text> {game.time || "N/A"}
            </Text>
            <Text>
              <Text style={styles.headerLabel}>Lieu:</Text> {game.location}
            </Text>
          </View>
        </View>
        {/* Teams */}
        <View style={styles.teamsRow}>
          <View style={styles.teamBlock}>
            <Text style={{ fontWeight: "bold" }}>Équipe locale:</Text>
            <Text>{team.name}</Text>
          </View>
          <View style={styles.teamBlock}>
            <Text style={{ fontWeight: "bold" }}>Équipe visiteur:</Text>
            <Text>{opponent.name}</Text>
          </View>
        </View>
        {/* Players Table */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.cellStatut}>Statut</Text>
            <Text style={styles.cellNum}>#</Text>
            <Text style={styles.cellName}>Nom</Text>
            <Text style={styles.cellCartons}>Cartons</Text>
            <Text style={styles.cellButs}>Buts</Text>
          </View>
          {filledPlayers.map((p, idx) => (
            <View style={styles.tableRow} key={p._id || idx}>
              <Text style={styles.cellStatut}>
                {p.suspended ? "Suspendu" : (p.status || "")}
              </Text>
              <Text style={styles.cellNum}>
                {typeof p.number === "number" ? p.number : (p.number ? p.number : "")}
              </Text>
              <Text style={styles.cellName}>
                {(p.firstName || "") + (p.lastName ? " " + p.lastName : "")}
              </Text>
              <Text style={styles.cellCartons}>
                {p.yellowCard ? "X" : ""}{p.redCard ? " X" : ""}
              </Text>
              <Text style={styles.cellButs}></Text>
            </View>
          ))}
        </View>
        {/* Signatures */}
        <View style={styles.signatures}>
          <Text>Signature (locale): ____________________</Text>
          <Text>Signature (visiteur): ____________________</Text>
        </View>
      </Page>
    </Document>
  );
}