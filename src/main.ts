import './style.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <textarea id="jsonInput" cols="30" rows="10"></textarea>
    <div class="buttons">
        <button id="parseButton">Parse JSON</button>
        <input type="file" id="fileInput" accept=".json, .txt">
    </div>
    <div id="jsonViewer"></div>
`;


document.getElementById('parseButton')!.addEventListener('click', () => {
    const jsonInput = (document.getElementById('jsonInput') as HTMLTextAreaElement).value;
    try {
        const jsonObj = JSON.parse(jsonInput);
        const jsonViewer = document.getElementById('jsonViewer');
        if (jsonViewer) {
            jsonViewer.innerHTML = '';
            buildTree(jsonObj, jsonViewer, 'root');
        }
    } catch (e) {
        const jsonViewer = document.getElementById('jsonViewer');
        if (jsonViewer) {
            jsonViewer.innerHTML = '<p style="color: red;">Invalid JSON</p>';
        }
    }

    function buildTree(obj: any, parentElement: HTMLElement, key: string) {
        const item = document.createElement('div');
        parentElement.appendChild(item);

        if (typeof obj === 'object' && obj !== null) {
            const keySpan = document.createElement('span');
            keySpan.className = 'key collapsible';
            keySpan.textContent = key + ': ';
            item.appendChild(keySpan);

            const childContainer = document.createElement('div');
            childContainer.className = 'hidden ' + (Array.isArray(obj) ? 'array' : 'object');
            item.appendChild(childContainer);

            for (const childKey in obj) {
                buildTree(obj[childKey], childContainer, childKey);
            }

            keySpan.addEventListener('click', function (event) {
                event.stopPropagation();
                const childDiv = this.parentElement!.querySelector('.hidden') as HTMLDivElement;
                if (childDiv) {
                    if (childDiv.style.display === 'block') {
                        childDiv.style.display = 'none';
                        this.classList.remove('collapsed');
                    } else {
                        childDiv.style.display = 'block';
                        this.classList.add('collapsed');
                    }
                }
            })
        } else {
            item.innerHTML = '<span class="key">' + key + ': </span>' + '<span class="' + getType(obj) + '">' + obj + '</span>';
        }
    }

    function getType(value: any): string {
        if (typeof value === 'string') return 'string';
        if (typeof value === 'number') return 'number';
        if (Array.isArray(value)) return 'array';
        if (typeof value === 'object' && value !== null) return 'object';
        return 'unknown';
    }
});

document.getElementById('fileInput')!.addEventListener('change', event => {
    const file = (event.target as HTMLInputElement).files![0];
    if (!file) {
        return;
    }

    let reader = new FileReader();
    reader.onload = function (event) {
        (document.getElementById('jsonInput') as HTMLTextAreaElement).value = event.target!.result as string;
        (document.getElementById('parseButton') as HTMLButtonElement).click();
    };
    reader.readAsText(file);
});
