const { app, BrowserWindow } = require("electron");
const path = require("path");
const activeWin = require("active-win");
const db = require("./database");

let mainWindow;
let currentApp = null;
let startTime = Date.now();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true
    },
  });

  mainWindow.loadFile("src/index.html");
}

function getCategoryId(appName) {
  const name = appName.toLowerCase();

  if (
    name.includes("code") ||
    name.includes("pycharm") ||
    name.includes("notepad") ||
    name.includes("sublime")
  ) return 1;

  if (
    name.includes("chrome") ||
    name.includes("edge") ||
    name.includes("firefox")
  ) return 2;

  if (
    name.includes("netflix") ||
    name.includes("instagram") ||
    name.includes("game")
  ) return 3;

  return 4;
}

function updateDashboard() {
  db.all(
    `SELECT category_id, SUM(duration) as total_time
     FROM app_usage
     WHERE usage_date = DATE('now')
     GROUP BY category_id`,
    [],
    (err, rows) => {
      if (err) return;

      let total = 0;
      let productive = 0;
      let learning = 0;
      let entertainment = 0;

      rows.forEach(row => {
        total += row.total_time;

        if (row.category_id === 1) productive = row.total_time;
        if (row.category_id === 2) learning = row.total_time;
        if (row.category_id === 3) entertainment = row.total_time;
      });

      const score = total > 0
        ? (((productive + learning) / total) * 100).toFixed(2)
        : 0;

      // Get top 5 apps
      db.all(
        `SELECT app_name, SUM(duration) as total_time
         FROM app_usage
         WHERE usage_date = DATE('now')
         GROUP BY app_name
         ORDER BY total_time DESC
         LIMIT 5`,
        [],
        (err2, topRows) => {

          const topApps = topRows.map(row => ({
            name: row.app_name,
            time: row.total_time
          }));

          mainWindow.webContents.send("update-dashboard", {
            total,
            productive,
            learning,
            entertainment,
            score,
            topApps
          });
        }
      );
    }
  );
}

app.whenReady().then(() => {
  createWindow();

  setInterval(async () => {
    try {
      const activeWindow = await activeWin();
      if (!activeWindow) return;

      const newApp = activeWindow.owner.name;
      const now = Date.now();

      if (currentApp === null) {
        currentApp = newApp;
        startTime = now;
        return;
      }

      if (newApp === currentApp) return;

      const totalDuration = Math.floor((now - startTime) / 1000);
      const categoryId = getCategoryId(currentApp);

      db.run(
        `INSERT INTO app_usage (user_id, app_name, duration, category_id)
         VALUES (?, ?, ?, ?)`,
        [1, currentApp, totalDuration, categoryId],
        (err) => {
          if (!err) {
            updateDashboard();
          }
        }
      );

      currentApp = newApp;
      startTime = now;

    } catch (err) {
      console.error(err);
    }
  }, 1000);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});