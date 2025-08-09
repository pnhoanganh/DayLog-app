# Day Log - Habit Tracker Mobile App 📝

Habit Tracker is a mobile app built with React Native using **Expo**, designed to help you build and maintain positive habits. The app uses **Tamagui** for a smooth, responsive, and customizable user interface, while storing all your data locally with **SQLite** to ensure your habit records are fast and reliable without requiring an internet connection.

This app makes **tracking habits** simple with daily **check-ins**, detailed **analytics** that show your progress daily, weekly, monthly, and a handy iOS widget that allows you to view your habit status and check in directly from your home screen.

## ✨ Original Figma Design

- [View on Figma - Day Log app](https://www.figma.com/design/miCl17ybPmfxa95vbMjSOc/Daylog-Mobile-App?node-id=0-1&t=n8b4Zq86fDGVpmXy-1)

## 📝 Features

- **Daily Check-ins**: Easily mark your habit as completed each day to stay on track.
- **Powerful Analytics**: Visualize your habit trends and consistency with daily, weekly, and monthly charts.
- **Reports**: Generate summaries habit history that help you understand your progress and areas for improvement.
- **iOS Widget**: Quick and convenient widget on your iPhone home screen for instant habit updates.
- **Local SQLite Storage**: All your data is saved securely on your device with SQLite for quick access and offline availability.
- **Tamagui UI**: Provides a beautiful, customizable, and high-performance user interface with responsive design.

## 🖼️ Screenshots

<table>
  <tr>
    <th>Launch</th>
    <th>Home</th>
    <th>Home - Empty Habit</th>
  </tr>
  <tr>
    <td><img src="./assets/images/screens/lauch.png" width="200"/></td>
    <td><img src="./assets/images/screens/home.png" width="200"/></td>
    <td><img src="./assets/images/screens/empty.png" width="200"/></td>
  </tr>
</table>

<table>
  <tr>
    <th>Add Habit</th>
    <th>Edit Habit</th>
    <th>Delete Habit</th>
  </tr>
  <tr>
    <td><img src="./assets/images/screens/add.png" width="200"/></td>
    <td><img src="./assets/images/screens/edit.png" width="200"/></td>
    <td><img src="./assets/images/screens/delete.png" width="200"/></td>
  </tr>
</table>

<table>
  <tr>
    <th>Habit - Overview</th>
    <th>Habit - Analytics</th>
    <th>Habit - Report</th>
  </tr>
  <tr>
    <td><img src="./assets/images/screens/overview.png" width="200"/></td>
    <td><img src="./assets/images/screens/analytics.png" width="200"/></td>
    <td><img src="./assets/images/screens/report.png" width="200"/></td>
  </tr>
</table>

<table>
  <tr>
    <th>Streak Calendar </th>
    <th>Filter Calendar </th>
    <th>Filter Result</th>
  </tr>
  <tr>
    <td><img src="./assets/images/screens/streak.png" width="200"/></td>
    <td><img src="./assets/images/screens/filcal.png" width="200"/></td>
    <td><img src="./assets/images/screens/filre.png" width="200"/></td>
  </tr>
</table>

## 🛠 Tech Stack

- **React Native via Expo**: Cross-platform mobile app framework.
- **JavaScript**
- **React Navigation**
- **Styled Components / Custom Styles**
- **Tailwind CSS (via NativeWind)**
- **Tamagui**: UI kit for performant and themeable components.
- **SQLite**: Local database for persistent data storage.
- **iOS WidgetKit**: Native iOS widget integration.
- **Charting Libraries**: For rendering habit analytics and reports.

## 👩🏻‍💻 Get started

1. Clone the repository:

   ```bash
   git clone https://github.com/pnhoanganh/DayLog-app.git
   ```

2. Navigate to the project folder:
   ```bash
    cd DayLog-app
   ```
3. Install dependencies:

   ```bash
    npm install
   ```

4. Start the development server:
   ```bash
   npx expo start
   ```
