let chart;

window.api.onUpdate((event, data) => {

  document.getElementById("total").innerText = data.total;
  document.getElementById("score").innerText = data.score + "%";

  let message = "";
  if (data.score > 70) message = "🔥 Excellent Focus!";
  else if (data.score > 40) message = "💪 Good Progress!";
  else message = "⚠ Reduce Distractions!";

  document.getElementById("status").innerText = message;

  const ctx = document.getElementById("chart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Productive", "Learning", "Entertainment"],
      datasets: [{
        label: "Seconds",
        data: [
          data.productive,
          data.learning,
          data.entertainment
        ],
        backgroundColor: ["#22c55e", "#3b82f6", "#ef4444"]
      }]
    }
  });

  const table = document.getElementById("apps");
  table.innerHTML = "";

  data.topApps.forEach(app => {
    table.innerHTML += `
      <tr>
        <td>${app.name}</td>
        <td>${app.time} sec</td>
      </tr>
    `;
  });

});