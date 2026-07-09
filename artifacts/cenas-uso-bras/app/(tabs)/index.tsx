import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { Report, useReports } from "@/context/ReportsContext";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getRua(report: Report): string {
  if (!report.data) return "-";
  const d = report.data as Record<string, string>;
  return d["rua"] || "-";
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { reports, deleteReport, loading } = useReports();

  const topPad =
    Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const handleNew = (type: "diaria" | "semanal") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (type === "diaria") {
      router.push("/diaria");
    } else {
      router.push("/semanal");
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Excluir relatório",
      "Tem certeza que deseja excluir este relatório?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            deleteReport(id);
          },
        },
      ]
    );
  };

  const handleView = (id: string) => {
    Haptics.selectionAsync();
    router.push(`/relatorio/${id}`);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: topPad + 16,
      paddingBottom: 20,
      paddingHorizontal: 20,
      backgroundColor: colors.muted,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 6,
    },
    badgeText: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: colors.accent,
      letterSpacing: 1.5,
      textTransform: "uppercase",
    },
    title: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      letterSpacing: 0.5,
    },
    subtitle: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 2,
    },
    buttonRow: {
      flexDirection: "row",
      gap: 12,
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    btnDiaria: {
      flex: 1,
      backgroundColor: colors.primary,
      borderRadius: colors.radius as number,
      paddingVertical: 14,
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      borderWidth: 1,
      borderColor: colors.accent,
    },
    btnSemanal: {
      flex: 1,
      backgroundColor: colors.secondary,
      borderRadius: colors.radius as number,
      paddingVertical: 14,
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      borderWidth: 1,
      borderColor: colors.border,
    },
    btnLabel: {
      fontSize: 12,
      fontFamily: "Inter_700Bold",
      color: "#FFFFFF",
      textTransform: "uppercase",
      letterSpacing: 0.8,
      textAlign: "center",
    },
    sectionHeader: {
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 10,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    sectionTitle: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
      letterSpacing: 1.2,
      textTransform: "uppercase",
    },
    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 40,
      gap: 10,
      marginTop: 60,
    },
    emptyIcon: {
      marginBottom: 6,
      opacity: 0.4,
    },
    emptyTitle: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
      textAlign: "center",
    },
    emptyText: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      opacity: 0.7,
    },
    card: {
      marginHorizontal: 16,
      marginBottom: 10,
      backgroundColor: colors.card,
      borderRadius: colors.radius as number,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    cardInner: {
      padding: 14,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    typeBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 4,
      alignSelf: "flex-start",
    },
    typeBadgeDiaria: {
      backgroundColor: "#1B5299",
    },
    typeBadgeSemanal: {
      backgroundColor: "#27AE60",
    },
    typeBadgeText: {
      fontSize: 10,
      fontFamily: "Inter_700Bold",
      color: "#FFFFFF",
      textTransform: "uppercase",
      letterSpacing: 0.6,
    },
    cardContent: {
      flex: 1,
    },
    cardRua: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    cardDate: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 2,
    },
    deleteBtn: {
      padding: 6,
    },
  });

  const renderItem = ({ item }: { item: Report }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.75}
      onPress={() => handleView(item.id)}
    >
      <View style={styles.cardInner}>
        <View style={styles.cardContent}>
          <View
            style={[
              styles.typeBadge,
              item.type === "diaria"
                ? styles.typeBadgeDiaria
                : styles.typeBadgeSemanal,
            ]}
          >
            <Text style={styles.typeBadgeText}>
              {item.type === "diaria" ? "Diária" : "Semanal"}
            </Text>
          </View>
          <Text style={[styles.cardRua, { marginTop: 6 }]}>
            {getRua(item) !== "-" ? `Rua: ${getRua(item)}` : "Sem endereço"}
          </Text>
          <Text style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
        </View>
        <Pressable
          style={styles.deleteBtn}
          onPress={() => handleDelete(item.id)}
          hitSlop={8}
        >
          <Feather name="trash-2" size={18} color={colors.destructive} />
        </Pressable>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerBadge}>
          <Feather name="shield" size={14} color={colors.accent} />
          <Text style={styles.badgeText}>ASSISTÊNCIA SOCIAL — BRÁS/SP</Text>
        </View>
        <Text style={styles.title}>Cenas de Uso Brás</Text>
        <Text style={styles.subtitle}>Registro de campo</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.btnDiaria}
          activeOpacity={0.8}
          onPress={() => handleNew("diaria")}
        >
          <Feather name="sun" size={20} color="#FFFFFF" />
          <Text style={styles.btnLabel}>Nova Cena{"\n"}Diária</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnSemanal}
          activeOpacity={0.8}
          onPress={() => handleNew("semanal")}
        >
          <Feather name="calendar" size={20} color="#FFFFFF" />
          <Text style={styles.btnLabel}>Nova Cena{"\n"}Semanal</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Feather name="list" size={14} color={colors.mutedForeground} />
        <Text style={styles.sectionTitle}>
          {reports.length > 0
            ? `${reports.length} relatório${reports.length !== 1 ? "s" : ""} salvo${reports.length !== 1 ? "s" : ""}`
            : "Relatórios"}
        </Text>
      </View>

      {loading ? null : reports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather
            name="file-text"
            size={48}
            color={colors.mutedForeground}
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyTitle}>Nenhum relatório ainda</Text>
          <Text style={styles.emptyText}>
            Toque em "Nova Cena Diária" ou "Nova Cena Semanal" para registrar
            sua primeira ocorrência de campo.
          </Text>
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingBottom:
              insets.bottom + (Platform.OS === "web" ? 34 : 16),
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
