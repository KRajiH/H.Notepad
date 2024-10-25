// script.js

    let currentNoteIndex = null; // To track the current note being edited

    // Function to format text
    function formatText(command) {
      document.execCommand(command, false, null);
    }


    // Copy selected text
    function copyText() {
      const selection = window.getSelection().toString();
      navigator.clipboard.writeText(selection).then(() => {
        showMessage("Text copied!");
      });
    }

    // Save note to local storage
      function saveNote() {
      const title = document.getElementById('noteTitle').value;
      const content = document.getElementById('editor').innerHTML;

      if (title && content) {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];

        if (currentNoteIndex !== null) {
          notes[currentNoteIndex] = { title, content };
          currentNoteIndex = null;
          showMessage("Note updated");
        } else {
          notes.push({ title, content });
          showMessage("Note saved");
        }

        localStorage.setItem('notes', JSON.stringify(notes));
        displayNotes();
        clearEditor();
      } else {
        showMessage("Enter title and content");
      }
    }


    // Show message
    function showMessage(msg) {
      const messageDiv = document.getElementById('message');
      messageDiv.textContent = msg;
      messageDiv.style.display = 'block';

      setTimeout(() => {
        messageDiv.style.display = 'none';
      }, 2000);
    }


    // Display saved notes
    function displayNotes() {
      const notesList = document.getElementById('notesList');
      notesList.innerHTML = '';
      const notes = JSON.parse(localStorage.getItem('notes')) || [];
      notes.forEach((note, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${note.title}</strong> 
                            <button onclick="openNote(${index})">Edit</button>
                            <button onclick="exportAsTxt(${index})">TXT</button>
                            <button onclick="deleteNote(${index})">Del</button>`;
        notesList.appendChild(li);
      });
    }

    // Open note for editing
    function openNote(index) {
      const notes = JSON.parse(localStorage.getItem('notes'));
      document.getElementById('noteTitle').value = notes[index].title;
      document.getElementById('editor').innerHTML = notes[index].content;
      currentNoteIndex = index; // Set current note index for editing
    }

    // Delete note
    function deleteNote(index) {
      const notes = JSON.parse(localStorage.getItem('notes'));
      notes.splice(index, 1);
      localStorage.setItem('notes', JSON.stringify(notes));
      displayNotes();
      showMessage("Note deleted");
    }

    // Clear the editor
    function clearEditor() {
      document.getElementById('noteTitle').value = '';
      document.getElementById('editor').innerHTML = '';
      currentNoteIndex = null; // Reset current note index
    }

    // Clear text selection
    function clearSelection() {
      const selection = window.getSelection();
      selection.removeAllRanges(); // Deselect the text
    }

    // Export note as TXT
    function exportAsTxt(index) {
      const notes = JSON.parse(localStorage.getItem('notes'));
      const note = notes[index];
      if (!note.title || !note.content) {
        showMessage("Note is empty");
        return;
      }

      const blob = new Blob([note.content], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${note.title}.txt`;
      link.click();
      showMessage("Note exported as TXT");
    }

    // Initialize the app
    displayNotes();


    // Change text color
    document.getElementById('textColor').addEventListener('change', (e) => {
      const color = e.target.value;
      if (color === 'customColor') {
        const customColor = prompt('Enter custom color (e.g., #ff0000 or red)');
        document.execCommand('foreColor', false, customColor);
      } else {
        document.execCommand('foreColor', false, color);
      }
    });

    // Change text size
    document.getElementById('textSize').addEventListener('change', (e) => {
      const size = e.target.value;
      document.execCommand('fontSize', false, 7); // '7' is the maximum execCommand font size.
      const elements = document.getElementById('editor').getElementsByTagName('font');
      for (let element of elements) {
        if (element.size === "7") {
          element.removeAttribute('size');
          element.style.fontSize = size;
        }
      }
    });




    // Disable the default context menu on text selection
    document.getElementById('editor').addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });


    // Align text to left
    document.querySelector('.leftAlignment').addEventListener('click', () => {
      document.execCommand('justifyLeft');
    });

    // Align text to center
    document.querySelector('.centerAlignment').addEventListener('click', () => {
      document.execCommand('justifyCenter');
    });

    // Align text to right
    document.querySelector('.rightAlignment').addEventListener('click', () => {
      document.execCommand('justifyRight');
    });

    // Align text to justyfy
    document.querySelector('.justifyAlignment').addEventListener('click', () => {
      document.execCommand('justifyFull');
    });



    // list set karane ke liye

    document.getElementById('listType').addEventListener('change', (e) => {
      const listType = e.target.value;

      // Editor को focus में लाएं
      const editor = document.getElementById('editor');
      editor.focus();

      if (listType === 'insertUnorderedList') {
        document.execCommand('insertUnorderedList', false, null);
      } else if (listType === 'insertOrderedList') {
        document.execCommand('insertOrderedList', false, null);
      } else {
        applyCustomListStyle(listType);
      }
    });

    function applyCustomListStyle(type) {
      const editor = document.getElementById('editor');
      editor.focus();

      // Create a temporary ordered list if not already present
      let selectedList = editor.querySelector('ol');

      if (!selectedList) {
        document.execCommand('insertOrderedList', false, null); // Insert a default ordered list
        selectedList = editor.querySelector('ol'); // Get the newly created list
      }

      // Apply the chosen style to the ordered list
      if (selectedList) {
        switch (type) {
          case 'ol-decimal':
            selectedList.style.listStyleType = 'decimal'; // 1, 2, 3...
            break;
          case 'ol-roman':
            selectedList.style.listStyleType = 'upper-roman'; // I, II, III...
            break;
          case 'ol-alpha':
            selectedList.style.listStyleType = 'upper-alpha'; // A, B, C...
            break;
          case 'ol-l-alpha':
            selectedList.style.listStyleType = 'lower-alpha'; // A, B, C...
            break;
          case 'ol-l-roman':
            selectedList.style.listStyleType = 'lower-roman'; // A, B, C...
            break;
          default:
            break;
        }
      }
          }
