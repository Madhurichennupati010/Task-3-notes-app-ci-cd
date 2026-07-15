const noteForm = document.getElementById("noteForm");
const notesContainer = document.getElementById("notesContainer");

// Load all notes
async function loadNotes() {
    try {
        const response = await fetch("/api/notes");

        if (!response.ok) {
            throw new Error("Failed to fetch notes");
        }

        const notes = await response.json();

        notesContainer.innerHTML = "";

        if (notes.length === 0) {
            notesContainer.innerHTML = `
                <p style="text-align:center;">
                    No notes available.
                </p>
            `;
            return;
        }

        notes.forEach(note => {
            notesContainer.innerHTML += `
                <div class="note-card">
                    <h3>${note.title}</h3>

                    <p>${note.content}</p>

                    <div class="buttons">
                        <button onclick="editNote(${note.id}, '${note.title.replace(/'/g, "\\'")}', '${note.content.replace(/'/g, "\\'")}')">
                            Edit
                        </button>

                        <button onclick="deleteNote(${note.id})">
                            Delete
                        </button>
                    </div>
                </div>
            `;
        });

    } catch (err) {
        console.error(err);
    }
}

// Create Note
noteForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    try {
        const response = await fetch("/api/notes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                content
            })
        });

        if (!response.ok) {
            alert("Failed to save note");
            return;
        }

        noteForm.reset();

        loadNotes();

    } catch (err) {
        console.error(err);
    }

});

// Delete Note
async function deleteNote(id) {

    if (!confirm("Delete this note?")) return;

    try {

        await fetch(`/api/notes/${id}`, {
            method: "DELETE"
        });

        loadNotes();

    } catch (err) {
        console.error(err);
    }

}

// Edit Note
function editNote(id, title, content) {

    document.getElementById("title").value = title;
    document.getElementById("content").value = content;

    const submitBtn = document.querySelector("#noteForm button");

    submitBtn.innerText = "Update Note";

    submitBtn.onclick = async function (e) {

        e.preventDefault();

        const newTitle = document.getElementById("title").value;
        const newContent = document.getElementById("content").value;

        await fetch(`/api/notes/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                title: newTitle,
                content: newContent
            })

        });

        noteForm.reset();

        submitBtn.innerText = "Add Note";

        submitBtn.onclick = null;

        loadNotes();

    };

}

// Initial Load
loadNotes();