let totalPages = 20,
    selectedPage = 6,
    pages = [],
    oldPage
        
for (let currentPage = 1; currentPage <= totalPages; currentPage++) {

    const firstAndLastPage = currentPage == 1 || currentPage == totalPages
    const pagesAfterSelectedPage = currentPage <= selectedPage + 2 
    const pagesBeforeSelectedPage = currentPage >= selectedPage - 2
    
    if (firstAndLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage) {
        
        if(oldPage && currentPage - oldPage > 2) {
            pages.push("...")
        }
        
        if(oldPage && currentPage - oldPage == 2) {
            pages.push(oldPage + 1)
        }
        
        pages.push(currentPage)
        
        oldPage = currentPage
    }
}

console.log(pages)
