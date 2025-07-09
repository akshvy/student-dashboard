let notes = [];

document.addEventListener("DOMContentLoaded", loadNotes);

function uploadNote() {
  const fileInput = document.getElementById("noteFile");
  const noteName = document.getElementById("noteName").value.trim();

  if (!fileInput.files[0] || !noteName) {
    alert("Please select a file and enter a name.");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    const note = {
      name: noteName,
      data: e.target.result,
      type: file.type
    };

    notes.push(note);
    localStorage.setItem("notes", JSON.stringify(notes));
    loadNotes();
  };

  reader.readAsDataURL(file);
}

function loadNotes() {
  const stored = JSON.parse(localStorage.getItem("notes"));
  if (stored) {
    notes = stored;
  }

  const notesList = document.getElementById("notesList");
  notesList.innerHTML = "";

  notes.forEach((note, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${note.name} 
      <button onclick="downloadNote(${index})">Open</button>
      <button onclick="deleteNote(${index})">Delete</button>
    `;
    notesList.appendChild(li);
  });
}

function downloadNote(index) {
  const note = notes[index];
  const link = document.createElement("a");
  link.href = note.data;
  link.download = note.name;
  link.click();
}

function deleteNote(index) {
  notes.splice(index, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  loadNotes();
}
