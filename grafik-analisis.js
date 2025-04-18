document.addEventListener("DOMContentLoaded", function () {
    const ctx = document.getElementById("pupukChart").getContext("2d");

    let pupukChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: [], // Blok akan ditampilkan di sini
            datasets: [
                { label: "N (%)", data: [], backgroundColor: "rgba(255, 99, 132, 0.6)" },
                { label: "P (%)", data: [], backgroundColor: "rgba(54, 162, 235, 0.6)" },
                { label: "K (%)", data: [], backgroundColor: "rgba(255, 206, 86, 0.6)" },
                { label: "Ca (%)", data: [], backgroundColor: "rgba(75, 192, 192, 0.6)" },
                { label: "Mg (%)", data: [], backgroundColor: "rgba(153, 102, 255, 0.6)" },
                { label: "B (ppm)", data: [], backgroundColor: "rgba(255, 159, 64, 0.6)" }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "top" },
                tooltip: {
                    callbacks: {
                        title: function (tooltipItems) {
                            let index = tooltipItems[0].dataIndex;
                            return `Blok: ${pupukChart.data.labels[index]}`;
                        },
                        label: function (tooltipItem) {
                            let datasetIndex = tooltipItem.datasetIndex;
                            let value = tooltipItem.raw;
                            let noId = pupukChart.data.customData[tooltipItem.dataIndex];
                            return `ID ${noId}: ${pupukChart.data.datasets[datasetIndex].label} = ${value}`;
                        }
                    }
                }
            },
            scales: {
                x: { title: { display: true, text: "Blok" } },
                y: { title: { display: true, text: "Kandungan Unsur Hara" }, beginAtZero: true }
            }
        }
    });

    function updateChart() {
        let dataKoordinat = JSON.parse(localStorage.getItem("koordinatData")) || [];

        let labels = [];
        let nData = [], pData = [], kData = [], caData = [], mgData = [], bData = [];
        let idData = [];

        dataKoordinat.forEach((item) => {
            labels.push(item.blok);
            idData.push(item.no); // Menyimpan ID untuk ditampilkan di tooltip
            nData.push(parseFloat(item.n) || 0);
            pData.push(parseFloat(item.p) || 0);
            kData.push(parseFloat(item.k) || 0);
            caData.push(parseFloat(item.ca) || 0);
            mgData.push(parseFloat(item.mg) || 0);
            bData.push(parseFloat(item.b) || 0);
        });

        pupukChart.data.labels = labels;
        pupukChart.data.datasets[0].data = nData;
        pupukChart.data.datasets[1].data = pData;
        pupukChart.data.datasets[2].data = kData;
        pupukChart.data.datasets[3].data = caData;
        pupukChart.data.datasets[4].data = mgData;
        pupukChart.data.datasets[5].data = bData;

        // Menyimpan ID sebagai custom data
        pupukChart.data.customData = idData;

        pupukChart.update();
    }

    // Perbarui grafik saat halaman dimuat
    updateChart();

    // Perbarui grafik jika ada perubahan di localStorage
    window.addEventListener("storage", function (event) {
        if (event.key === "koordinatData") {
            updateChart();
        }
    });
});
