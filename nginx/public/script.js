const noteForm = document.getElementById("noteForm");
const notesContainer = document.getElementById("notesContainer");

// Load Notes
async function loadNotes() {
    const response = await fetch("/api/notes");
    const notes = await response.json();

    notesContainer.innerHTML = "";

    notes.forEach(note => {
        notesContainer.innerHTML += `
        <div class="note-card">
            <h3>${note.title}</h3>
            <p>${note.content}</p>

            <button onclick="editNote(${note.id}, '${note.title}', '${note.content}')">
                Edit
            </button>

            <button onclick="deleteNote(${note.id})">
                Delete
            </button>
        </div>
        `;
    });
}

// Create Note
noteForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    await fetch("/api/notes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title,
            content
        })
    });

    noteForm.reset();
    loadNotes();
});

// Delete Note
async function deleteNote(id) {

    await fetch(`/api/notes/${id}`, {
        method: "DELETE"
    });

    loadNotes();
}

// Edit Note
function editNote(id, title, content) {

    document.getElementById("title").value = title;
    document.getElementById("content").value = content;

    const btn = document.querySelector("#noteForm button");

    btn.innerText = "Update Note";

    btn.onclick = async function(e){

        e.preventDefault();

        await fetch(`/api/notes/${id}`,{

            method:"PUT",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                title:document.getElementById("title").value,
                content:document.getElementById("content").value
            })

        });

        noteForm.reset();

        btn.innerText="Add Note";

        btn.onclick=null;

        loadNotes();

    }

}

loadNotes();