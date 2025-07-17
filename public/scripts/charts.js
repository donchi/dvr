  // Visiting Trend Today (Line Chart)
const trendCtx = document.getElementById('trendChart').getContext('2d');
const trendChart = new Chart(trendCtx, {
  type: 'line',
  data: {
    labels: ['6-8AM', '8-10AM', '10-12PM', '12-2PM', '2-4PM', '4-6PM'],
    datasets: [{
      label: 'Visitors',
      data: [5, 12, 18, 15, 10, 4],
      backgroundColor: 'rgba(0, 121, 196, 0.2)',
      borderColor: '#0079c4',
      borderWidth: 2,
      tension: 0.4,
      fill: true
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  }
});

// Visitors Destination Today (Horizontal Bar Chart)
const hbarCtx = document.getElementById('hbarchart').getContext('2d');
const hbarChart = new Chart(hbarCtx, {
  type: 'bar',
  data: {
    labels: ['Main Gate', 'North Wing', 'Admin Block', 'Command Center', 'Mess Hall', 'Armory'],
    datasets: [{
      label: 'Visitors',
      data: [15, 8, 12, 5, 10, 3],
      backgroundColor: [
        '#0079c4',
        '#0194B0',
        '#00B0A1',
        '#4CAF50',
        '#8BC34A',
        '#CDDC39'
      ],
      borderWidth: 1
    }]
  },
  options: {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  }
});
  
  // Weekly Visitors Chart (Bar Chart)
  const weeklyCtx = document.getElementById('weeklyChart').getContext('2d');
  const weeklyVisitorsChart = new Chart(weeklyCtx, {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Visitors',
        data: [32, 45, 28, 51, 42, 19, 7],
        backgroundColor: '#0079c4',
        borderColor: '#0062a3',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });

  // Visitor Categories Chart (Doughnut Chart)
  const categoriesCtx = document.getElementById('categoriesChart').getContext('2d');
  const visitorCategoriesChart = new Chart(categoriesCtx, {
    type: 'doughnut',
    data: {
      labels: ['Military Personnel', 'Paramilitary Personnel', 'Civilians', 'Others'],
      datasets: [{
        data: [35, 25, 20, 20],
        backgroundColor: [
          '#0079c4',
          '#0194B0',
          '#00B0A1',
          '#8BC34A'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right'
        }
      }
    }
  });
