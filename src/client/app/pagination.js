export function setupPagination(loadProducts) {
    const paginationContainer = document.getElementById('pagination');
    const perPageSelect = document.getElementById('perPage');

    perPageSelect.addEventListener('click', () =>{
        const perPage = parseInt(perPageSelect.value);
        loadProducts(1, perPage);
    });

    function createPagination(totalPages, currentPage) {
        paginationContainer.innerHTML = '';

       // Add "Previous" button
       const prevItem = document.createElement('li');
       prevItem.classList.add('page-item');
       if (currentPage === 1) {
           prevItem.classList.add('disabled');
       }
       const prevLink = document.createElement('a');
       prevLink.classList.add('page-link');
       prevLink.href = '#';
       prevLink.textContent = 'Previous';
       prevLink.addEventListener('click', (event) => {
           event.preventDefault();
           if (currentPage > 1) {
               loadProducts(currentPage - 1, parseInt(document.getElementById('perPage').textContent));
           }
       });
       prevItem.appendChild(prevLink);
       paginationContainer.appendChild(prevItem);

       for (let i = 1; i <= totalPages; i++) {
           const pageItem = document.createElement('li');
           pageItem.classList.add('page-item');
           if (i === currentPage) {
               pageItem.classList.add('active');
           }
           const pageLink = document.createElement('a');
           pageLink.classList.add('page-link');
           pageLink.href = '#';
           pageLink.textContent = i;

           pageLink.addEventListener('click', (event) => {
               event.preventDefault();
               loadProducts(i, parseInt(document.getElementById('perPage').textContent));
           });
           pageItem.appendChild(pageLink);
           paginationContainer.appendChild(pageItem);
       }

       // Add "Next" button
       const nextItem = document.createElement('li');
       nextItem.classList.add('page-item');
       if (currentPage === totalPages) {
           nextItem.classList.add('disabled');
       }
       const nextLink = document.createElement('a');
       nextLink.classList.add('page-link');
       nextLink.href = '#';
       nextLink.textContent = 'Next';
       nextLink.addEventListener('click', (event) => {
           event.preventDefault();
           if (currentPage < totalPages) {
               loadProducts(currentPage + 1, parseInt(document.getElementById('perPage').textContent));
           }
       });
       nextItem.appendChild(nextLink);
       paginationContainer.appendChild(nextItem);
   }
   return { createPagination };
}