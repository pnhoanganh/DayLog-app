import WidgetKit
import SwiftUI

let materialIconUnicodeMap: [String: String] = [
    "add": "e145",
    "3d-rotation": "e84d",
    "accessibility": "e84e",
    "account-balance": "e84f",
    "account-circle": "e853",
    "add-shopping-cart": "e854",
    "alarm": "e855",
    "album": "e89f",
    "all-inclusive": "e90d",
    "android": "e859",
    "announcement": "e85a",
    "apps": "e5c3",
    "archive": "e149",
    "arrow-back": "e5c4",
    "arrow-drop-down": "e5c5",
    "assessment": "e85c",
    "assignment": "e85d",
    "assistant": "e39f",
    "attach-money": "e227",
    "audiotrack": "e3a4",
    "autorenew": "e863",
    "av-timer": "e01b",
    "backpack": "e8f4",
    "battery-charging-full": "e1a3",
    "beach-access": "eb3d",
    "beenhere": "e52d",
    "block": "e14b",
    "bluetooth": "e1a7",
    "book": "e865",
    "bookmark": "e866",
    "border-color": "e22b",
    "brightness-7": "e3ac",
    "build": "e869",
    "cached": "e86a",
    "cake": "e7e9",
    "calendar-today": "e935",
    "call": "e0b0",
    "camera-alt": "e412",
    "cancel": "e5c9",
    "card-giftcard": "e8f6",
    "casino": "eb43",
    "cast": "e307",
    "category": "e574",
    "check": "e5ca",
    "check-circle": "e86c",
    "child-care": "e1ae",
    "child-friendly": "e1af",
    "chrome-reader-mode": "e86d",
    "close": "e5cd",
    "cloud": "e2bd",
    "code": "e86e",
    "commute": "e940",
    "compare-arrows": "e915",
    "computer": "e30a",
    "contact-mail": "e0d0",
    "control-point": "e3ba",
    "copyright": "e90c",
    "create": "e150",
    "credit-card": "e870",
    "dashboard": "e871",
    "delete": "e872",
    "departure-board": "e576",
    "description": "e873",
    "desktop-mac": "e30b",
    "developer-mode": "e1b0",
    "device-hub": "e335",
    "devices": "e1f4",
    "directions": "e52e",
    "directions-bike": "e52f",
    "directions-boat": "e532",
    "directions-bus": "e530",
    "directions-car": "e531",
    "directions-railway": "e534",
    "directions-run": "e566",
    "directions-subway": "e533",
    "directions-transit": "e535",
    "directions-walk": "e536",
    "disc-full": "e610",
    "dns": "e875",
    "do-not-disturb": "e612",
    "dock": "e30d",
    "domain": "e7ee",
    "done": "e876",
    "donut-large": "e917",
    "drag-handle": "e25d",
    "drive-eta": "e613",
    "dvr": "e1b2",
    "eco": "eb3e",
    "edit": "e3c9",
    "eject": "e8fb",
    "email": "e0be",
    "emoji-events": "e7e8",
    "energy-savings-leaf": "eb46",
    "event": "e878",
    "event-seat": "e903",
    "exit-to-app": "e879",
    "expand-less": "e5ce",
    "expand-more": "e5cf",
    "explore": "e87a",
    "extension": "e87b",
    "face": "e87c",
    "fastfood": "e57a",
    "favorite": "e87d",
    "feedback": "e87e",
    "file-download": "e2c4",
    "filter-drama": "e403",
    "fingerprint": "e90d",
    "fireplace": "eb47",
    "fitness-center": "eb48",
    "flag": "e153",
    "flare": "e3d4",
    "flash-on": "e4ef",
    "flight": "e539",
    "folder": "e2c7",
    "folder-open": "e2c8",
    "format-align-center": "e235",
    "forum": "e0bf",
    "fullscreen": "e5d0",
    "gavel": "e90e",
    "gesture": "e155",
    "get-app": "e884",
    "gif": "e908",
    "grade": "e885",
    "group": "e7ef",
    "handyman": "eb49",
    "hardware": "e871",
    "headset": "e310",
    "healing": "e3cb",
    "health-and-safety": "eb4a",
    "hearing": "e023",
    "help": "e887",
    "highlight": "e745",
    "history": "e889",
    "home": "e88a",
    "hotel": "e53a",
    "hourglass-empty": "e88b",
    "http": "e902",
    "https": "e88c",
    "image": "e3f4",
    "import-contacts": "e0e0",
    "important-devices": "e912",
    "inbox": "e156",
    "info": "e88e",
    "input": "e890",
    "keyboard": "e312",
    "kitchen": "eb4b",
    "label": "e892",
    "language": "e894",
    "laptop": "e31c",
    "launch": "e895",
    "layers": "e53b",
    "leak-add": "e3c1",
    "legend-toggle": "e918",
    "lightbulb": "e0f0",
    "line-style": "e919",
    "link": "e157",
    "list": "e896",
    "live-help": "e0c6",
    "local-bar": "e540",
    "local-cafe": "e541",
    "local-car-wash": "e542",
    "local-dining": "e543",
    "local-florist": "e544",
    "local-gas-station": "e545",
    "local-hospital": "e546",
    "local-laundry-service": "e547",
    "local-library": "e548",
    "local-mall": "e549",
    "local-movies": "e54a",
    "local-offer": "e54b",
    "local-parking": "e54c",
    "local-pharmacy": "e54d",
    "local-phone": "e54e",
    "local-pizza": "e54f",
    "local-play": "e550",
    "local-post-office": "e551",
    "local-printshop": "e552",
    "local-see": "e553",
    "local-taxi": "e554",
    "location-city": "e7f1",
    "location-disabled": "e1b6",
    "location-off": "e0c7",
    "location-on": "e0c8",
    "location-searching": "e1b7",
    "lock": "e897",
    "lock-open": "e898",
    "looks": "e3a8",
    "loupe": "e0ce",
    "low-priority": "e16d",
    "loyalty": "e89a",
    "mail": "e158",
    "map": "e55b",
    "markunread": "e159",
    "maximize": "e930",
    "memory": "e322",
    "menu": "e5d2",
    "merge-type": "e252",
    "message": "e0c9",
    "mic": "e029",
    "mood": "e7f3",
    "moped": "eb4c",
    "more": "e619",
    "motorcycle": "eb4d",
    "mouse": "e323",
    "move-to-inbox": "e168",
    "movie": "e02a",
    "music-note": "e405",
    "nature": "e406",
    "navigation": "e55d",
    "near-me": "e569",
    "network-check": "e640",
    "new-releases": "e031",
    "next-week": "e16a",
    "nightlight": "e743",
    "no-encryption": "e641",
    "no-meeting-room": "e0df",
    "no-sim": "e0cc",
    "notifications": "e7f4",
    "offline-bolt": "eb4e",
    "opacity": "e91e",
    "open-in-browser": "e89c",
    "outlined-flag": "e4f4",
    "palette": "e40a",
    "pan-tool": "e925",
    "panorama": "e40b",
    "party-mode": "e7fa",
    "pause": "e034",
    "payment": "e8a1",
    "pets": "e91d",
    "phone": "e0cd",
    "photo": "e410",
    "picture-in-picture": "e8aa",
    "pie-chart": "e6c4",
    "pin-drop": "e55e",
    "place": "e55f",
    "play-arrow": "e037",
    "playlist-add": "e7fe",
    "plus-one": "e55a",
    "poll": "e801",
    "polymer": "e8ab",
    "pool": "eb4f",
    "portable-wifi-off": "e0ce",
    "portrait": "e416",
    "power": "e63c",
    "print": "e8ad",
    "priority-high": "e645",
    "public": "e80b",
    "publish": "e255",
    "query-builder": "e8ae",
    "question-answer": "e8af",
    "queue": "e03c",
    "radio": "e03d",
    "rate-review": "e560",
    "receipt": "e8b0",
    "record-voice-over": "e91f",
    "redeem": "e8b1",
    "refresh": "e5d5",
    "remove-circle": "e15c",
    "remove-shopping-cart": "e928",
    "reorder": "e8fe",
    "repeat": "e040",
    "reply": "e15e",
    "report": "e160",
    "restaurant": "e56c",
    "restore": "e8b3",
    "ring-volume": "e0d1",
    "room": "e8b4",
    "room-service": "eb50",
    "rotate-left": "e7ec",
    "rowing": "e921",
    "rss-feed": "e0e5",
    "schedule": "e8b5",
    "school": "e80c",
    "screen-lock-landscape": "e1be",
    "screen-rotation": "e1bf",
    "screen-share": "e0e2",
    "sd-card": "e623",
    "search": "e8b6",
    "security": "e32a",
    "select-all": "e162",
    "send": "e163",
    "sentiment-dissatisfied": "e811",
    "settings": "e8b8",
    "share": "e80d",
    "shopping-bag": "e8b9",
    "shopping-cart": "e8ba",
    "shuffle": "e043",
    "signal-cellular-4-bar": "e1dc",
    "sim-card": "e32b",
    "skip-next": "e044",
    "slideshow": "e41b",
    "slow-motion-video": "e068",
    "smartphone": "e32c",
    "smoke-free": "eb51",
    "smoking-rooms": "eb52",
    "sms": "e625",
    "snooze": "e046",
    "sort": "e164",
    "spa": "eb53",
    "space-bar": "e256",
    "speaker": "e32d",
    "speed": "e564",
    "spellcheck": "e8bc",
    "sports": "e50f",
    "star": "e838",
    "stars": "e83a",
    "stay-current-landscape": "e0d3",
    "stop": "e047",
    "storage": "e1db",
    "store": "e8c0",
    "storefront": "eb54",
    "straighten": "e41c",
    "streetview": "e56f",
    "strikethrough-s": "e257",
    "style": "e41d",
    "subdirectory-arrow-left": "e5d9",
    "subject": "e8bf",
    "subscriptions": "e7ff",
    "subtitles": "e8c0",
    "supervisor-account": "e8c1",
    "surround-sound": "e7f5",
    "swap-calls": "e0d4",
    "swap-horiz": "e8c4",
    "swap-vertical-circle": "eb55",
    "switch-camera": "e41e",
    "sync": "e627",
    "system-update": "e8c5",
    "tab": "e8c6",
    "table-chart": "e265",
    "tag-faces": "e420",
    "tap-and-play": "e62a",
    "terrain": "e564",
    "text-fields": "e262",
    "text-format": "e165",
    "textsms": "e0d8",
    "thumb-down": "e816",
    "thumb-up": "e817",
    "thumbs-up-down": "e818",
    "time-to-leave": "e62b",
    "timelapse": "e422",
    "timeline": "e922",
    "timer": "e425",
    "title": "e264",
    "toc": "e8c6",
    "today": "e8c7",
    "toll": "e8c8",
    "tonality": "e427",
    "touch-app": "e913",
    "toys": "eb56",
    "track-changes": "e8c9",
    "traffic": "e565",
    "train": "e570",
    "tram": "e571",
    "transfer-within-a-station": "e572",
    "transform": "e428",
    "translate": "e8ca",
    "trending-down": "e8cb",
    "trending-up": "e8cc",
    "tune": "e429",
    "turned-in": "e8cd",
    "tv": "e63a",
    "undo": "e166",
    "unfold-less": "e5d6",
    "unfold-more": "e5d7",
    "update": "e923",
    "usb": "e1e0",
    "verified": "e8ce",
    "vertical-align-bottom": "e258",
    "vertical-align-center": "e259",
    "vertical-align-top": "e25a",
    "vibration": "e62c",
    "video-call": "e070",
    "video-label": "e071",
    "video-library": "e04a",
    "videocam": "e04b",
    "visibility": "e8f4",
    "voice-chat": "e62d",
    "voicemail": "e0d9",
    "volume-down": "e04d",
    "volume-mute": "e04e",
    "volume-off": "e04f",
    "volume-up": "e050",
    "vpn-key": "e63f",
    "wallet-giftcard": "e8d1",
    "wallet-membership": "e8d2",
    "wallet-travel": "e8d3",
    "wallpaper": "e1bc",
    "watch": "e8d4",
    "watch-later": "e924",
    "wb-auto": "e42c",
    "wc": "e63d",
    "wifi": "e63e",
    "wifi-off": "e640",
    "work": "e8d6",
    "wrap-text": "e25b",
    "youtube-searched-for": "e8df",
    "zoom-in": "e8e8",
    "zoom-out": "e8e9",
    "menu-book": "ea6d",
    "book-online": "ea6e",
    "push-pin": "ea6f",
    "access-time": "e192",
    "library-books": "ea71",
    "assignment-turned-in": "ea72",
    "pageview": "ea73",
    "local-drink": "ea74",
    "coffee": "ea75",
    "breakfast-dining": "ea76",
    "food-bank": "ea77"
]

func unicodeForMaterialIcon(name: String) -> String {
    guard let hex = materialIconUnicodeMap[name],
          let codepoint = UInt32(hex, radix: 16),
          let scalar = UnicodeScalar(codepoint) else {
        return "?" // fallback
    }
    return String(scalar)
}



struct Provider: AppIntentTimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), configuration: ConfigurationAppIntent())
    }

    func snapshot(for configuration: ConfigurationAppIntent, in context: Context) async -> SimpleEntry {
        SimpleEntry(date: Date(), configuration: configuration)
    }
    
    func timeline(for configuration: ConfigurationAppIntent, in context: Context) async -> Timeline<SimpleEntry> {
        let currentDate = Date()
        let entry = SimpleEntry(date: currentDate, configuration: configuration)

      if let habit = configuration.selectedHabit {
          print("Selected Habit: \(habit.name)")
      } else {
          print("No habit selected")
      }


        return Timeline(entries: [entry], policy: .atEnd)
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let configuration: ConfigurationAppIntent
}

struct widgetEntryView: View {
    var entry: Provider.Entry

    // Tạo biến info để sử dụng trong body
    var info: (name: String, icon: String, lastCheckin: String)? {
        guard let habit = entry.configuration.selectedHabit else { return nil }
        return getHabitInfo(from: habit.name)
    }

    func getHabitInfo(from habitName: String) -> (name: String, icon: String, lastCheckin: String) {
        let defaults = UserDefaults(suiteName: "group.com.pnhoanganh.DayLogapp")

        let iconMap: [String: String] = {
            guard let raw = defaults?.string(forKey: "widget_habit_icons"),
                  let data = raw.data(using: .utf8),
                  let decoded = try? JSONDecoder().decode([String: String].self, from: data) else {
                return [:]
            }
            return decoded
        }()

        let lastCheckinMap: [String: String] = {
            guard let raw = defaults?.string(forKey: "widget_habit_last_checkins"),
                  let data = raw.data(using: .utf8),
                  let decoded = try? JSONDecoder().decode([String: String].self, from: data) else {
                return [:]
            }
            return decoded
        }()

        let icon = iconMap[habitName] ?? "❓"
        let lastCheckin = lastCheckinMap[habitName] ?? "No check-in yet"

        return (habitName, icon, lastCheckin)
    }

    func isEmoji(_ string: String) -> Bool {
        guard let scalar = string.unicodeScalars.first else { return false }
        return scalar.properties.isEmoji && (string.count == 1)
    }
    var body: some View {
        VStack {
           if let info = info {
                HStack {
                    if isEmoji(info.icon) {
                        Text(info.icon)
                            .font(.body)
                    } else {
                      Text(unicodeForMaterialIcon(name: info.icon))
                          .font(Font.custom("MaterialIcons-Regular", size: 20))
                    }
                    Text(info.name)
                        .font(.headline)
                }
            

                Text("Last check-ins: ").font(.caption)
                Text(info.lastCheckin)
                    .font(.caption)
                    .foregroundColor(.gray)
            } else {
              Text("No habit selected")
                  .font(.headline)
                  .foregroundColor(.gray)
               
            }
            }
    }
}


struct widget: Widget {
    let kind: String = "widget"

    var body: some WidgetConfiguration {
        AppIntentConfiguration(kind: kind, intent: ConfigurationAppIntent.self, provider: Provider()) { entry in
            widgetEntryView(entry: entry)
                .containerBackground(.fill.tertiary, for: .widget)
        }
    }
}

extension ConfigurationAppIntent {
  fileprivate static var sample: ConfigurationAppIntent {
      var intent = ConfigurationAppIntent()
      intent.selectedHabit = nil
      return intent
  }

}

#Preview(as: .systemSmall) {
    widget()
} timeline: {
    SimpleEntry(date: .now, configuration: .sample)
}
