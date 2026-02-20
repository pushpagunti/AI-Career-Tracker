// This object maps the name of the app to a human-readable category
const categories = {
    "Visual Studio Code": "Productive (Coding)",
    "Code": "Productive (Coding)", // Some systems report it as just 'Code'
    "Notepad": "Productive (Notes)",
    "Google Chrome": "Learning/Browsing",
    "Microsoft Edge": "Learning/Browsing",
    "Spotify": "Entertainment (Music)",
    "Command Prompt": "System/Development",
    "Windows PowerShell": "System/Development"
};

// This function helps your main app look up a category
function getCategory(appName) {
    return categories[appName] || "Other / Uncategorized";
}

// Exporting so main.js can use it
module.exports = { categories, getCategory };