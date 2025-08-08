import * as FileSystem from "expo-file-system";

const groupPath = FileSystem.documentDirectory?.replace(
  "Documents",
  "Group/group.com.pnhoanganh.DayLogapp"
);

const widgetDataPath = `${groupPath}/widget-data.json`;

export async function syncToWidget(habitData) {
  const json = JSON.stringify(habitData);
  await FileSystem.writeAsStringAsync(widgetDataPath, json, {
    encoding: FileSystem.EncodingType.UTF8,
  });
}
