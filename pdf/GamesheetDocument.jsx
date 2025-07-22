import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 12 },
  title: { fontSize: 20, textAlign: "center", marginBottom: 16 },
  section: { marginBottom: 12 },
  bold: { fontWeight: "bold" },
  player: { marginBottom: 2 },
});

export default function GamesheetDocument({ game, team, opponent, players }) {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>Feuille de match</Text>
        <View style={styles.section}>
          <Text>
            <Text style={styles.bold}>Date:</Text> {game.date}{" "}
            <Text style={styles.bold}>Heure:</Text> {game.time || "N/A"}
          </Text>
          <Text>
            <Text style={styles.bold}>Lieu:</Text> {game.location}
          </Text>
          <Text>
            <Text style={styles.bold}>Équipes:</Text> {team.name} vs {opponent.name}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.bold}>Joueurs ({team.name}):</Text>
          {players.map((p) => (
            <Text key={p._id} style={styles.player}>
              {p.number} - {p.firstName} {p.lastName}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}