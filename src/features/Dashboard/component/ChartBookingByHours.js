// ChartBookingByHours.js
import React, { useRef, useEffect } from 'react';
import { Chart } from 'chart.js';

const ChartBookingByHours = ({ bookingData, labelData, labelSet, lableValue }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null); // Create a ref for the chart instance

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    // Destroy the previous chart instance if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Create gradient for the line of Today
    const gradientToday = ctx.createLinearGradient(0, 0, 0, 400);
    gradientToday.addColorStop(0, 'rgba(54, 162, 235, 0.7)'); // Blue at the top
    gradientToday.addColorStop(0.5, 'rgba(54, 162, 235, 0)'); // Transparent at the bottom

    // Create gradient for the line of Yesterday
    const gradientYesterday = ctx.createLinearGradient(0, 0, 0, 400);
    gradientYesterday.addColorStop(0, 'rgba(99, 99, 99, 0.7)'); // Red at the top
    gradientYesterday.addColorStop(0.5, 'rgba(99, 99, 99, 0)'); // Transparent at the bottom

    // Define the data for the chart
    const chartData = {
      labels: labelData,
      datasets: [
        {
          label: labelSet[0],
          data: bookingData[0],
          backgroundColor: gradientToday,
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 0,
        },
        {
          label: labelSet[1],
          data: bookingData[1],
          backgroundColor: gradientYesterday,
          borderColor: 'rgba(99, 99, 99, 0.7)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 0,
        },
      ],
    };

    // Configure the chart options
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: lableValue[0],
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: lableValue[1],
          },
        },
      },
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ${context.raw}`;
            },
          },
        },
      },
    };

    // Create a new chart instance and store it in the ref
    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: chartOptions,
    });

    // Cleanup function to destroy the chart when the component unmounts
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [bookingData, labelData, labelSet, lableValue]);

  return <canvas ref={chartRef} id="chart_l_2" />;
};

export default ChartBookingByHours;
