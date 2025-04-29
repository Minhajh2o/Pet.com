const loadCategories =()=>{
    fetch('https://openapi.programming-hero.com/api/peddy/categories')
    .then(response => response.json())
    .then(data => loadCategoryButtons(data.categories))
    .catch(error => console.error('Error fetching data:', error));
}

const loadCategoryButtons = (categories) => {
    // console.log(categories);
    const categoryBtnContainer = document.getElementById('category-btn-container');
    categories.forEach(item => {
        const categoryContainer = document.createElement('div');
        categoryContainer.innerHTML = `
            <a id="btn-${item.id}" onclick="loadCategoryVideos(${item.id})" class="btn flex items-center gap-2 px-4 py-2 rounded-lg">
            <img src="${item.category_icon}" alt="${item.category}" class="w-6 h-6 ">
            <p>${item.category}</p>
            </a>
        `;
        categoryBtnContainer.append(categoryContainer);
    });
}

const loadCategoryVideos = (categoryId) => {
    console.log(categoryId);
}

loadCategories();