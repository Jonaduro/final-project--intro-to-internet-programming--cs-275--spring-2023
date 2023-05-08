window.onload = () => {
    let matrixDiv = document.querySelector(`body`).appendChild(document.createElement(`div`));
    matrixDiv.setAttribute('class','matrix');
    let content = '';

    let len = parseInt(window.prompt('What size should the matrix be? (integer greater than 0)'));
    while (len < 1 || isNaN(len)) {
        len = parseInt(
            window.prompt('Invalid input:\nPlease enter a valid size for the matrix (integer greater than 0)')
        );
    }
    console.log(`Length and width of matrix: ${len}`);

    let matrix = new Array(len);
    let halfwayPoint = parseInt((len * len / 2.0) + 0.5);

    let initializeMatrix = (i, j) =>{
        matrix[i][j] = 1 + j + (i * len);
        content += `<td>${matrix[i][j]}</td>`;
    };
    let flipMatrix = (i,j) => {
        let currVar = matrix[i][j];
        let currIndex = i * len + j;
        if ((len +((len - 1) * i)) === (currIndex + 1)) {
            content += `<td class="unflipped">${currVar}</td>`;
        } else {
            if (currIndex < halfwayPoint) {
                matrix[i][j] = matrix[len - j -1][len - i - 1];
                matrix[len - j - 1][len - i - 1] = currVar;
            }
            currVar = matrix[i][j];
            content += `<td>${currVar}</td>`;
        }
    };

    let displayMatrix = (version) => {
        content = `<table>`;
        for (let i = 0; i < len; i++) {
            content += `<tr>`;
            if (version === 'initial') {
                matrix[i] = new Array(len);
            }
            for (let j = 0; j < len; j++) {
                if (version === 'initial') {
                    initializeMatrix(i,j);
                } else {
                    flipMatrix(i,j);
                }
            }
            content += `</tr>`;
            matrixDiv.innerHTML = content;
        }
    };
    displayMatrix('initial');
    setTimeout(() => {
        displayMatrix('flipped');
    }, 2000);
  };
