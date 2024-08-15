
document.addEventListener('DOMContentLoaded', () => {
    const newNoteBtn = document.getElementById('new-note');
    const saveNoteBtn = document.getElementById('save-note');
    const downloadDocxBtn = document.getElementById('download-docx');
    const searchInput = document.getElementById('search');
    
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    let currentNoteId = null;

    // Inicializar Quill con barra de herramientas completa
    var quill = new Quill('#editor-container', {
        theme: 'snow',
        modules: {
            toolbar: '#editor-toolbar'
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

    function loadNoteContent(noteId) {
        currentNoteId = noteId;
        quill.root.innerHTML = notes[noteId].content;
    }

    function downloadDocx() {
        if (currentNoteId !== null) {
            const content = notes[currentNoteId].content;

            // Procesar el contenido para crear un documento DOCX
            const doc = new docx.Document({
                sections: [{
                    properties: {},
                    children: [
                        new docx.Paragraph({
                            children: [new docx.TextRun(content.replace(/<[^>]+>/g, ''))]
                        })
                    ]
                }]
            });

            docx.Packer.toBlob(doc).then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'nota.docx';
                a.click();
                window.URL.revokeObjectURL(url);
            });
        }
    }

    newNoteBtn.addEventListener('click', createNote);
    saveNoteBtn.addEventListener('click', saveNote);
    downloadDocxBtn.addEventListener('click', downloadDocx);

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        // Lógica de búsqueda de notas
        const filteredNotes = notes.filter(note => note.content.toLowerCase().includes(query));
        if (filteredNotes.length > 0) {
            loadNoteContent(notes.indexOf(filteredNotes[0]));
        }
    });

    // Cargar la primera nota si existe
    if (notes.length > 0) {
        loadNoteContent(0);
    }
});
