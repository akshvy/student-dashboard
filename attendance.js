let attendanceData = {
  subject: "",
  startDate: "",
  endDate: "",
  presentDays: [],
  absentDays: [],
  holidays: []
};

document.addEventListener("DOMContentLoaded", () => {
  loadData();
  updateInputs();
});

function saveSetup() {
  attendanceData.subject = document.getElementById("subjectInput").value.trim();
  attendanceData.startDate = document.getElementById("startDate").value;
  attendanceData.endDate = document.getElementById("endDate").value;

  localStorage.setItem("attendanceData", JSON.stringify(attendanceData));
  alert("Saved!");
  calculateAttendance();
}

function markAttendance(isPresent) {
  const dateInput = document.getElementById("markDate").value;
  const dateToMark = dateInput ? dateInput : new Date().toISOString().split("T")[0];

  const isHoliday = document.getElementById("isTodayHoliday").checked;

  if (
    attendanceData.presentDays.includes(dateToMark) ||
    attendanceData.absentDays.includes(dateToMark) ||
    attendanceData.holidays.includes(dateToMark)
  ) {
    alert(`You already marked ${dateToMark}.`);
    return;
  }

  if (isHoliday) {
    attendanceData.holidays.push(dateToMark);
  } else {
    if (isPresent) {
      attendanceData.presentDays.push(dateToMark);
    } else {
      attendanceData.absentDays.push(dateToMark);
    }
  }

  localStorage.setItem("attendanceData", JSON.stringify(attendanceData));
  calculateAttendance();
}

function calculateAttendance() {
  if (!attendanceData.startDate) return;

  const start = new Date(attendanceData.startDate);
  const today = new Date();
  let totalWorkingDays = 0;

  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    if (d.getDay() === 0 || d.getDay() === 6) continue; // Skip Sat/Sun
    const dateStr = d.toISOString().split("T")[0];
    if (attendanceData.holidays.includes(dateStr)) continue; // Skip holidays
    totalWorkingDays++;
  }

  const present = attendanceData.presentDays.length;
  const percentage = totalWorkingDays === 0 ? 0 : ((present / totalWorkingDays) * 100).toFixed(2);

  const percentEl = document.getElementById("percentage");
  percentEl.innerText = `${percentage}%`;
  percentEl.className = percentage >= 80 ? "green" : "red";

  const allowedLeaves = Math.floor((present / 0.8) - totalWorkingDays);
  document.getElementById("allowedLeaves").innerText = allowedLeaves > 0 ? allowedLeaves : 0;
}

function loadData() {
  const stored = JSON.parse(localStorage.getItem("attendanceData"));
  if (stored) {
    attendanceData = stored;
    calculateAttendance();
  }
}

function updateInputs() {
  document.getElementById("subjectInput").value = attendanceData.subject || "";
  document.getElementById("startDate").value = attendanceData.startDate || "";
  document.getElementById("endDate").value = attendanceData.endDate || "";
}
