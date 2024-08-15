document.addEventListener('DOMContentLoaded', () => {
    const newNoteBtn = document.getElementById('new-note');
    const saveNoteBtn = document.getElementById('save-note');
    const searchInput = document.getElementById('search');
    
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    let currentNoteId = null;

    // Inicializar Quill
    var quill = new Quill('#editor-container', {
        theme: 'snow',
        placeholder: 'Escribe tu nota aquí...',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline'],
                ['image', 'code-block'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }]
            ]
        }
    });

    function saveNote() {
        if (currentNoteId !== null) {
            notes[currentNoteId].content = quill.root.innerHTML;
            localStorage.setItem('notes', JSON.stringify(notes));
            console.log('Nota guardada:', notes[currentNoteId]);
        }
    }

    function createNote() {
        saveNote();
        const newNote = {
            id: notes.length,
            content: '',
            created_at: new Date(),
            category: 'General'
        };
        notes.push(newNote);
        currentNoteId = newNote.id;
        quill.setText('');
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    newNoteBtn.addEventListener('click', createNote);
    saveNoteBtn.addEventListener('click', saveNote);

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        // Lógica de búsqueda de notas
    });

    // Cargar la primera nota si existe
    if (notes.length > 0) {
        currentNoteId = 0;
        quill.root.innerHTML = notes[currentNoteId].content;
    }
});
