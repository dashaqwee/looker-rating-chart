const dscc = require('dscc');

function drawViz(data) {
  const el = document.createElement("div");
  el.innerHTML = `
    <h2>${data.fields.dimension[0].name}</h2>
    <div class="rating-wrapper">
      <div class="rating-summary">
        <div class="avg" id="avgRating">--</div>
        <div class="stars" id="stars">★★★★★</div>
        <div class="count" id="totalCount">--</div>
      </div>
      <div class="bar-chart" id="barChart"></div>
      <div class="tooltip" id="tooltip"></div>
    </div>
  `;
  document.body.appendChild(el);

  const rows = data.tables.DEFAULT;
  const ratings = rows.map(row => ({
    star: parseInt(row[0].value),
    count: parseInt(row[1].value)
  }));

  const total = ratings.reduce((sum, r) => sum + r.count, 0);
  const avg = total
    ? (ratings.reduce((sum, r) => sum + r.star * r.count, 0) / total).toFixed(1)
    : '0.0';

  document.getElementById('avgRating').textContent = avg;
  document.getElementById('totalCount').textContent = total.toLocaleString();

  const avgVal = parseFloat(avg);
  const starsEl = document.getElementById('stars');
  starsEl.style.color = avgVal < 3 ? '#EA4335' : avgVal < 3.8 ? '#FBBC05' : '#34A853';

  const chartEl = document.getElementById('barChart');
  const tooltip = document.getElementById('tooltip');
  const maxCount = Math.max(...ratings.map(r => r.count));

  ratings.forEach(r => {
    const row = document.createElement('div');
    row.className = 'bar-row';

    const label = document.createElement('div');
    label.className = 'bar-label';
    label.textContent = r.star;

    const track = document.createElement('div');
    track.className = 'bar-track';

    const fill = document.createElement('div');
    fill.className = 'bar-fill';
    fill.style.width = ((r.count / maxCount) * 100).toFixed(2) + '%';

    track.onmouseenter = () => {
      const percent = ((r.count / total) * 100).toFixed(1);
      tooltip.textContent = `${percent}% (${r.count.toLocaleString()})`;
      tooltip.style.opacity = 1;
    };
    track.onmousemove = e => {
      tooltip.style.left = e.pageX + 10 + 'px';
      tooltip.style.top = e.pageY - 30 + 'px';
    };
    track.onmouseleave = () => {
      tooltip.style.opacity = 0;
    };

    track.appendChild(fill);
    row.appendChild(label);
    row.appendChild(track);
    chartEl.appendChild(row);
  });
}

dscc.subscribeToData(drawViz, { transform: dscc.objectTransform });
