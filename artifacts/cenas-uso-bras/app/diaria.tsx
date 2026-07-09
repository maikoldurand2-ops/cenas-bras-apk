import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { DiariaData, useReports } from "@/context/ReportsContext";

function getTodayBR(): string {
  return new Date().toLocaleDateString("pt-BR");
}

function getNowTime(): string {
  return new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function newId(): string {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
}

interface FieldProps {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: "default" | "numeric" | "decimal-pad";
  multiline?: boolean;
  placeholder?: string;
  colors: ReturnType<typeof useColors>;
}

function Field({
  label,
  value,
  onChangeText,
  keyboardType = "default",
  multiline = false,
  placeholder,
  colors,
}: FieldProps) {
  const styles = StyleSheet.create({
    wrapper: {
      marginBottom: 14,
    },
    label: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
      letterSpacing: 0.8,
      textTransform: "uppercase",
      marginBottom: 5,
    },
    input: {
      backgroundColor: colors.input,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: colors.radius as number,
      paddingHorizontal: 12,
      paddingVertical: multiline ? 10 : 0,
      height: multiline ? 80 : 44,
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      textAlignVertical: multiline ? "top" : "center",
    },
  });

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>✅ {label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholder={placeholder ?? ""}
        placeholderTextColor={colors.mutedForeground}
        multiline={multiline}
        returnKeyType={multiline ? "default" : "next"}
      />
    </View>
  );
}

export default function DiariaScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { addReport } = useReports();

  const topPad =
    Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const botPad =
    insets.bottom + (Platform.OS === "web" ? 34 : 0);

  const [form, setForm] = useState<DiariaData>({
    rua: "",
    data: getTodayBR(),
    horario: getNowTime(),
    emUso: "0",
    naoEmUso: "0",
    totalAbordagens: "0",
  });

  const set = (key: keyof DiariaData) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (!form.rua.trim()) {
      Alert.alert("Campo obrigatório", "Preencha o campo Rua antes de salvar.");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await addReport({
      id: newId(),
      type: "diaria",
      data: form,
      createdAt: new Date().toISOString(),
    });
    router.back();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
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
    backBtn: {
      padding: 4,
    },
    headerTitle: {
      flex: 1,
    },
    typeTag: {
      backgroundColor: "#1B5299",
      borderRadius: 4,
      paddingHorizontal: 8,
      paddingVertical: 2,
      alignSelf: "flex-start",
      marginBottom: 3,
    },
    typeTagText: {
      fontSize: 9,
      fontFamily: "Inter_700Bold",
      color: "#FFFFFF",
      letterSpacing: 1,
      textTransform: "uppercase",
    },
    title: {
      fontSize: 18,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: botPad + 100,
    },
    saveBtn: {
      position: "absolute",
      bottom: botPad + 20,
      left: 20,
      right: 20,
      backgroundColor: colors.primary,
      borderRadius: colors.radius as number,
      paddingVertical: 16,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
      borderWidth: 1,
      borderColor: colors.accent,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    saveBtnText: {
      fontSize: 15,
      fontFamily: "Inter_700Bold",
      color: "#FFFFFF",
      letterSpacing: 0.5,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={8}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <View style={styles.headerTitle}>
          <View style={styles.typeTag}>
            <Text style={styles.typeTagText}>Diária</Text>
          </View>
          <Text style={styles.title}>Cena de Uso Diária</Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Field
          label="Rua"
          value={form.rua}
          onChangeText={set("rua")}
          placeholder="Ex: Rua Oriente, 123"
          colors={colors}
        />
        <Field
          label="Data"
          value={form.data}
          onChangeText={set("data")}
          placeholder={getTodayBR()}
          colors={colors}
        />
        <Field
          label="Horário"
          value={form.horario}
          onChangeText={set("horario")}
          placeholder={getNowTime()}
          colors={colors}
        />
        <Field
          label="N° de Usuários em situação de rua que ESTÃO EM USO"
          value={form.emUso}
          onChangeText={set("emUso")}
          keyboardType="numeric"
          placeholder="0"
          colors={colors}
        />
        <Field
          label="N° de Usuários em situação de rua QUE NÃO ESTÃO EM USO"
          value={form.naoEmUso}
          onChangeText={set("naoEmUso")}
          keyboardType="numeric"
          placeholder="0"
          colors={colors}
        />
        <Field
          label="N° Total de abordagens"
          value={form.totalAbordagens}
          onChangeText={set("totalAbordagens")}
          keyboardType="numeric"
          placeholder="0"
          colors={colors}
        />
      </ScrollView>

      <TouchableOpacity
        style={styles.saveBtn}
        activeOpacity={0.85}
        onPress={handleSave}
      >
        <Feather name="save" size={18} color="#FFFFFF" />
        <Text style={styles.saveBtnText}>Salvar Relatório</Text>
      </TouchableOpacity>
    </View>
  );
}
