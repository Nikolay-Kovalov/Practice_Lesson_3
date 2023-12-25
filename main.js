document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const size = 10;
    const bombCount = 15;

    let bombLocations = [];
    let revealedCells = 0;

    function initializeBoard() {
        bombLocations = generateBombLocations();
        for (let i = 0; i < size * size; i++){
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            cell.addEventListener('click', () => revealCell(i))
            cell.addEventListener('contextmenu', (evt) => {
                evt.preventDefault();
                toggleFlag(i);
            })
            board.appendChild(cell);

        }
    }

    function generateBombLocations() {
        const locations = [];
        while (locations.length < bombCount) {
            const location = Math.floor(Math.random() * size * size);
            if (!locations.includes(location)) {
                locations.push(location);
            }
        }
        return locations;
    }

    function isBomb(index) {
        return bombLocations.includes(index);
    }

    function countNeighboringBombs(index) {
        const neighbors = [-size - 1, -size, -size + 1, -1, 1, size - 1, size, size + 1];
        let count = 0;

        for (const offset of neighbors) {
            const neighborIndex = offset + index;
            if (neighborIndex >= 0 && neighborIndex < size * size && Math.floor(neighborIndex / size) === Math.floor(index / size)) {
                if (isBomb(neighborIndex)) {
                    count++;
                }
            }
        }
        return count;
    }

    function revealCell(index) {
        const cell = board.children[index];
        if (cell.classList.contains('clicked') || cell.classList.contains('flagged')) {
            return
        }
        if (isBomb(index)) {
            cell.classList.add('bomb');
            revealAllBombs();
            alert('You caught a bomb! Game over!')
        } else {
            const bombCount = countNeighboringBombs(index);
            cell.textContent = bombCount > 0 ? bombCount : "";
            cell.classList.add('clicked');
            revealedCells++;
            if (revealedCells === size * size - bombCount) {
                alert('Congratulations! You are still alive!')
            }
            if (bombCount === 0) {
                const neighbors = [-size - 1, -size, -size + 1, -1, 1, size - 1, size, size + 1];
                for (const offset of neighbors) {
                    const neighborIndex = index + offset;
                    if (neighborIndex >= 0 && neighborIndex < size * size && Math.floor(neighborIndex / size) === Math.floor(index / size)) {
                        revealedCells(neighborIndex);
                    }
                }
            }
        }
    }
    function toggleFlag(index) {
        const cell = board.children[index];
        if (!cell.classList.contains('clicked')) {
            cell.classList.toggle('flagged')
        }
    }

    function revealAllBombs() {
        for (const location of bombLocations) {
            const cell = board.children[location];
            cell.classList.add('bomb');
        }
    }

    initializeBoard();
})