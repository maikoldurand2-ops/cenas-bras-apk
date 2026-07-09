import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import {
  DiariaData,
  SemanalData,
  formatDiaria,
  formatSemanal,
  useReports,
} from "@/context/ReportsContext";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function RelatorioScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { reports, deleteReport } = useReports();
  const [copied, setCopied] = useState(false);

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const botPad = insets.bottom + (Platform.OS === "web" ? 34 : 0);

  const report = useMemo(
    () => reports.find((r) => r.id === id),
    [reports, id]
  );

  const formattedText = useMemo(() => {
    if (!report) return "";
    if (report.type === "diaria") {
      return formatDiaria(report.data as DiariaData);
    }
    return formatSemanal(report.data as SemanalData);
  }, [report]);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(formattedText);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsApp = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const url = `whatsapp://send?text=${encodeURIComponent(formattedText)}`;
    const canOpen = await Linking.canOpenURL(url).catch(() => false);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      await Clipboard.setStringAsync(formattedText);
      Alert.alert(
        "WhatsApp não encontrado",
        "O texto foi copiado para a área de transferência. Cole-o manualmente no WhatsApp.",
        [{ text: "OK" }]
      );
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Excluir relatório",
      "Tem certeza que deseja excluir este relatório?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await deleteReport(id ?? "");
            router.back();
          },
        },
      ]
    );
  };

  if (!report) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: colors.mutedForeground,
            fontFamily: "Inter_400Regular",
          }}
        >
          Relatório não encontrado.
        </Text>
      </View>
    );
  }

  const isDiaria = report.type === "diaria";

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: topPad + 12,
      paddingBottom: 14,
      paddingHorizontal: 20,
      backgroundColor: colors.muted,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    backBtn: { padding: 4 },
    headerMain: { flex: 1 },
    typeTag: {
      borderRadius: 4,
      paddingHorizontal: 8,
      paddingVertical: 2,
      alignSelf: "flex-start",
      marginBottom: 3,
      backgroundColor: isDiaria ? "#1B5299" : "#27AE60",
    },
    typeTagText: {
      fontSize: 9,
      fontFamily: "Inter_700Bold",
      color: "#FFFFFF",
      letterSpacing: 1,
      textTransform: "uppercase",
    },
    title: {
      fontSize: 17,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    dateText: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 2,
    },
    deleteBtn: { padding: 6 },
    scrollContent: {
      padding: 20,
      paddingBottom: botPad + 160,
    },
    previewLabel: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: colors.accent,
      letterSpacing: 1.2,
      textTransform: "uppercase",
      marginBottom: 10,
    },
    textPreview: {
      backgroundColor: colors.card,
      borderRadius: colors.radius as number,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
    },
    previewText: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      lineHeight: 22,
    },
    actionArea: {
      position: "absolute",
      bottom: botPad + 16,
      left: 16,
      right: 16,
      gap: 10,
    },
    whatsappBtn: {
      backgroundColor: "#25D366",
      borderRadius: colors.radius as number,
      paddingVertical: 15,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      borderWidth: 1,
      borderColor: "#1EBE59",
    },
    whatsappBtnText: {
      fontSize: 15,
      fontFamily: "Inter_700Bold",
      color: "#FFFFFF",
    },
    copyBtn: {
      backgroundColor: colors.secondary,
      borderRadius: colors.radius as number,
      paddingVertical: 13,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    copyBtnText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={8}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <View style={styles.headerMain}>
          <View style={styles.typeTag}>
            <Text style={styles.typeTagText}>
              {isDiaria ? "Diária" : "Semanal"}
            </Text>
          </View>
          <Text style={styles.title}>
            {isDiaria ? "Cena de Uso Diária" : "Cena de Uso Semanal"}
          </Text>
          <Text style={styles.dateText}>{formatDate(report.createdAt)}</Text>
        </View>
        <Pressable style={styles.deleteBtn} onPress={handleDelete} hitSlop={8}>
          <Feather name="trash-2" size={20} color={colors.destructive} />
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.previewLabel}>Texto gerado para WhatsApp</Text>
        <View style={styles.textPreview}>
          <Text style={styles.previewText}>{formattedText}</Text>
        </View>
      </ScrollView>

      <View style={styles.actionArea}>
        <TouchableOpacity
          style={styles.whatsappBtn}
          activeOpacity={0.85}
          onPress={handleWhatsApp}
        >
          <Feather name="message-circle" size={20} color="#FFFFFF" />
          <Text style={styles.whatsappBtnText}>Enviar pelo WhatsApp</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.copyBtn}
          activeOpacity={0.85}
          onPress={handleCopy}
        >
          <Feather
            name={copied ? "check" : "copy"}
            size={18}
            color={copied ? "#27AE60" : colors.foreground}
          />
          <Text
            style={[
              styles.copyBtnText,
              { color: copied ? "#27AE60" : colors.foreground },
            ]}
          >
            {copied ? "Texto copiado!" : "Copiar texto"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
