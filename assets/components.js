document.querySelectorAll('.form-select-chosen').forEach(element => {
    try {
        let isVisible = false;
        let isSync = false;

        const input = element.querySelector('.form-select-chosen__input');
        const output = element.querySelector('.form-select-chosen__output');
        const outputWrap = element.querySelector('.form-select-chosen__output-wrap');
        const blockSearch = element.querySelector('.form-select-chosen__search');
        const inputSearch = element.querySelector('.form-select-chosen__search-input');
        const blockOptions = element.querySelector('.form-select-chosen__options');

        !input && console.error('not .form-select-chosen__input: ', element);
        !output && console.error('not .form-select-chosen__output: ', element);
        !outputWrap && console.error('not .form-select-chosen__output-wrap: ', element);
        !blockSearch && console.error('not .form-select-chosen__search: ', element);
        !inputSearch && console.error('not .form-select-chosen__search-input: ', element);
        !blockOptions && console.error('not .form-select-chosen__options: ', element);

        outputWrap.addEventListener('click', () => {
            blockSearch.classList.toggle('is-visible');
            isVisible = !isVisible;
            if (isVisible) {
                outputWrap.classList.add('is-open');
                isSync = true;
                inputSearch.focus();
                setTimeout(() => {
                    isSync = false;
                }, 0);
            } else {
                outputWrap.classList.remove('is-open');
            }
        });

        document.addEventListener('click', (e) => {
            if (isVisible && !isSync && e.target.closest('.form-select-chosen__search') !== blockSearch) {
                isVisible = false;
                blockSearch.classList.remove('is-visible');
                outputWrap.classList.remove('is-open');
                inputSearch.value = '';
                searchValues('');
            }
            isSync = false;
        });

        inputSearch.addEventListener('input', event => {
            searchValues(event.target.value);
        });

        function searchValues(str) {
            let count = 0;
            blockOptions.querySelectorAll('.form-select-chosen__option:not(.is-not-search)').forEach(element => {
                if (element.textContent.toLowerCase().startsWith(str.toLowerCase())) {
                    element.style.display = "";
                    count++;
                } else {
                    element.style.display = "none";
                }
            });

            count ? blockOptions.classList.remove('is-empty') : blockOptions.classList.add('is-empty');
        }

        function addEvent(element) {
            if (element.classList.contains('form-select-chosen__option')) {
                element.addEventListener('click', function () {
                    isVisible = false;
                    blockSearch.classList.remove('is-visible');
                    outputWrap.classList.remove('is-open');
                    input.value = element.getAttribute('data-value');
                    output.textContent = element.textContent;

                    
                    input.classList.remove('error-class');
                    outputWrap.classList.remove('error');

                    blockOptions.querySelectorAll('.form-select-chosen__option').forEach(option => option.classList.remove('is-selected'));
                    element.classList.add('is-selected');

                    inputSearch.value = '';
                    searchValues('');

                    input.dispatchEvent(new Event('change'));
                });
            }
        }

        blockOptions.querySelectorAll('.form-select-chosen__option').forEach(element => addEvent(element));

        (new MutationObserver(function (mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(element => addEvent(element));
                    input.value = 0;
                    output.textContent = '';
                }
            }
        })).observe(blockOptions, { childList: true });

        
        const form = element.closest('form');
        if (form) {
            form.addEventListener('submit', (e) => {
                if (!input.value) {
                    e.preventDefault();
                    input.classList.add('error-class');
                    outputWrap.classList.add('error');
                } else {
                    input.classList.remove('error-class');
                    outputWrap.classList.remove('error');
                }
            });
        }

    } catch (err) {
        console.log(err);
    }
});
