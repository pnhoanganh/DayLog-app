import WidgetKit
import AppIntents

// 1. Entity
struct HabitEntity: AppEntity {
    static var typeDisplayRepresentation = TypeDisplayRepresentation(name: "Habit")
    static var defaultQuery = HabitQuery()

    var id: String
    var name: String

    var displayRepresentation: DisplayRepresentation {
        DisplayRepresentation(title: "\(name)")
    }
}

// 2. Query
struct HabitQuery: EntityQuery {
    func entities(for identifiers: [String]) async throws -> [HabitEntity] {
        let all = try await suggestedEntities()
        return all.filter { identifiers.contains($0.id) }
    }

    func suggestedEntities() async throws -> [HabitEntity] {
        let defaults = UserDefaults(suiteName: "group.com.pnhoanganh.DayLogapp")
        guard let raw = defaults?.string(forKey: "widget_habit_list"),
              let data = raw.data(using: .utf8),
              let list = try? JSONDecoder().decode([String].self, from: data) else {
            return []
        }
       return list.map { habitName in
    HabitEntity(id: habitName, name: habitName)
}

    }
}

// 3. AppIntent
struct ConfigurationAppIntent: WidgetConfigurationIntent {
    static var title: LocalizedStringResource { "Select Habit" }
    static var description: IntentDescription { "Choose a habit to display on the widget" }

  @Parameter(title: "Habit")
  var selectedHabit: HabitEntity?


}
