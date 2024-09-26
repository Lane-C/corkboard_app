import './styles.css';

const canvas = document.getElementById('canvas');
const clearButton = document.getElementById('clearButton');
const editToggle = document.getElementById('editToggle');

let editMode = false;

// Function to create a new node
const createNode = (x, y) => {
    const node = document.createElement('div');
    node.className = 'node';
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;

    const textNode = document.createElement('span');
    textNode.className = 'node-text';
    textNode.innerText = 'New Node';
    textNode.contentEditable = editMode; // Make text editable based on edit mode

    // If edit mode is enabled, set contentEditable to true
    if (editMode) {
        textNode.contentEditable = true;
    }

    node.appendChild(textNode);

    // Make the node draggable
    node.onmousedown = (e) => {
        if (e.button === 0) {
            node.style.cursor = 'grabbing';
            const offsetX = e.clientX - node.getBoundingClientRect().left;
            const offsetY = e.clientY - node.getBoundingClientRect().top;

            const mouseMoveHandler = (e) => {
                node.style.left = `${e.clientX - offsetX}px`;
                node.style.top = `${e.clientY - offsetY}px`;
            };

            const mouseUpHandler = () => {
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
                node.style.cursor = 'grab';
            };

            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        }
    };

    // Enable text editing when the node text is clicked
    textNode.onclick = (e) => {
        if (editMode) {
            textNode.focus(); // Focus on the text for editing
        }
    };

    canvas.appendChild(node);
};

// Function to clear all nodes
const clearCanvas = () => {
    while (canvas.firstChild) {
        canvas.removeChild(canvas.firstChild);
    }
};

// Event listener for middle mouse button to create nodes
canvas.onmousedown = (e) => {
    if (e.button === 1) { // Middle mouse button
        e.preventDefault(); // Prevent the default action of the middle mouse button
        createNode(e.clientX, e.clientY);
    }
};

// Event listener for the clear button
clearButton.onclick = clearCanvas;

// Event listener for the edit toggle button
editToggle.onclick = () => {
    editMode = !editMode;
    canvas.classList.toggle('edit-mode', editMode); // Toggle edit mode class on canvas

    // Update button text based on the current mode
    editToggle.innerText = editMode ? 'Disable Edit Mode' : 'Enable Edit Mode';

    // Update contentEditable for existing nodes
    const nodes = document.querySelectorAll('.node-text');
    nodes.forEach((textNode) => {
        textNode.contentEditable = editMode; // Enable or disable editing based on the edit mode
    });
};

// Change cursor to text when hovering over the text inside the node while in edit mode
canvas.onmousemove = (e) => {
    if (editMode && e.target.classList.contains('node-text')) {
        e.target.style.cursor = 'text';
    } else {
        canvas.style.cursor = 'default';
    }
};
