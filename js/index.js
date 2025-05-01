const CardContainer = document.getElementById("card-container");
const emptyCategory = document.getElementById("empty-category");

const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/peddy/categories")
    .then((response) => response.json())
    .then((data) => loadCategoryButtons(data.categories))
    .catch((error) => console.error("Error fetching data:", error));
};

// load Category Buttons
const loadCategoryButtons = (categories) => {
  // console.log(categories);
  const categoryBtnContainer = document.getElementById(
    "category-btn-container"
  );
  categories.forEach((item) => {
    const categoryContainer = document.createElement("div");
    const categoryInLC = item.category.toLowerCase();
    categoryContainer.innerHTML = `
            <a id="category-${categoryInLC}" onclick="loadActiveBtn('${categoryInLC}')" class="flex items-center justify-center gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-3 md:w-[168px] lg:w-[280px] rounded-lg border-2 border-gray-200 hover:bg-gray-100 transition duration-200 ease-in-out">
            <img src="${item.category_icon}" alt="${item.category}" class="w-6 h-6 md:w-10 md:h-10">
            <p class="md:text-xl font-semibold">${item.category}</p>
            </a>
        `;
    categoryBtnContainer.append(categoryContainer);
  });
};
// load Active Btn and categories
const loadActiveBtn = async (category) => {
  const activeBtn = document.getElementById("category-" + category);
  removeActiveClass();
  activeBtn.classList.add("active");

  // Show loader
  const loader = document.querySelector(".loader");
  loader.style.display = "grid";

  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/peddy/category/${category}`
    );
    const data = await res.json();

    // Show loader (if not already visible)
    loader.style.display = "grid";

    setTimeout(() => {
      loader.style.display = "none";

      // Handle empty category
      if (!data.data || data.data.length === 0) {
        emptyCategory.classList.remove("hidden");
        emptyCategory.classList.add("flex");

        CardContainer.classList.add("hidden");
        CardContainer.classList.remove("grid");
      } else {
        emptyCategory.classList.add("hidden");
        emptyCategory.classList.remove("flex");

        displayPetCards(data.data);
        likeClick(data.data);
      }
    }, 2000);
  } catch (error) {
    loader.style.display = "none";
    console.error("Failed to load pets:", error);
  }
};

// remove active class from all buttons
const removeActiveClass = () => {
  const activeBtn = document.querySelector(".active");
  if (activeBtn) {
    activeBtn.classList.remove("active");
  }
};

let allPets = []; // All loaded pets
const likedPetIds = new Set(); // Track liked pet IDs

// Load pet cards from API
const loadPetCards = () => {
  fetch(`https://openapi.programming-hero.com/api/peddy/pets`)
    .then((response) => response.json())
    .then((data) => {
      allPets = data.pets;
      displayPetCards(allPets);
    })
    .catch((error) => console.error("Error fetching data:", error));
};

// sort by price (changed the style with the help of ai)
const sortBtn = document.getElementById("sort-price");

const applyPrimaryStyle = () => {
  sortBtn.classList.add("primary-bg", "text-white");
};

applyPrimaryStyle(); // initial style

sortBtn.addEventListener("change", function () {
  applyPrimaryStyle();

  const selected = this.value;
  let sortedPets = [...allPets];

  if (selected === "high") {
    sortedPets.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  } else if (selected === "low") {
    sortedPets.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  } else if (selected === "default") {
    sortedPets = [...allPets];
  }

  // Show loader
  const loader = document.querySelector(".loader");
  loader.style.display = "grid";

  setTimeout(() => {
    loader.style.display = "none";
    displayPetCards(sortedPets);
    likeClick(sortedPets);
  }, 2000);
});

// Display pet cards (handles like state)
const displayPetCards = (pets) => {
  CardContainer.classList.remove("hidden");
  CardContainer.classList.add("grid");

  CardContainer.innerHTML = "";
  pets.forEach((pet) => {
    const isLiked = likedPetIds.has(pet.petId);

    const petCard = document.createElement("div");
    petCard.innerHTML = `
      <div class="card bg-base-100 shadow-sm">
        <figure class="overflow-hidden h-48 shadow-lg">
          <img src="${pet.image}" alt="${
      pet.category
    }" class="object-cover w-full h-full" />
        </figure>
        <div class="p-6 md:p-4">
          <h2 class="card-title mb-2">${pet.pet_name}</h2>
          <p class="text-gray-500 text-base">Breed: ${pet.breed}</p>
          <p class="text-gray-500 text-base">Birth: ${pet.date_of_birth}</p>
          <p class="text-gray-500 text-base">Gender: ${pet.gender}</p>
          <p class="text-gray-500 text-base">Price: ${pet.price}</p>
          <div class="card-actions justify-between">
            <button id="likeCard${
              pet.petId
            }" class="likeBtn btn bg-white mt-3 px-4 py-2 rounded-lg">
              <svg id="likeIcon${
                pet.petId
              }" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none">
                <path d="M5.5275 8.54163C6.19917 8.54163 6.805 8.16996 7.22 7.64163C7.86688 6.81631 8.67893 6.13511 9.60417 5.64163C10.2067 5.32163 10.7292 4.84496 10.9817 4.21246C11.159 3.76933 11.2501 3.29642 11.25 2.81913V2.29163C11.25 2.12587 11.3159 1.96689 11.4331 1.84968C11.5503 1.73247 11.7092 1.66663 11.875 1.66663C12.3723 1.66663 12.8492 1.86417 13.2008 2.2158C13.5525 2.56743 13.75 3.04435 13.75 3.54163C13.75 4.50163 13.5333 5.41079 13.1475 6.22329C12.9258 6.68829 13.2367 7.29163 13.7517 7.29163M13.7517 7.29163H16.3567C17.2117 7.29163 17.9775 7.86996 18.0683 8.72079C18.1058 9.07246 18.125 9.42913 18.125 9.79163C18.1284 12.0719 17.3492 14.2843 15.9175 16.0591C15.5942 16.4608 15.095 16.6666 14.58 16.6666H11.2333C10.8308 16.6666 10.43 16.6016 10.0475 16.475L7.4525 15.6083C7.07009 15.4811 6.66968 15.4164 6.26667 15.4166H4.92M13.7517 7.29163H11.875M4.92 15.4166C4.98917 15.5875 5.06417 15.7541 5.145 15.9183C5.30917 16.2516 5.08 16.6666 4.70917 16.6666H3.9525C3.21167 16.6666 2.525 16.235 2.30917 15.5266C2.02054 14.5793 1.87422 13.5944 1.875 12.6041C1.875 11.31 2.12084 10.0741 2.5675 8.93913C2.8225 8.29413 3.4725 7.91663 4.16667 7.91663H5.04417C5.4375 7.91663 5.665 8.37996 5.46084 8.71663C4.74908 9.88825 4.37369 11.2332 4.37584 12.6041C4.37584 13.5991 4.56917 14.5483 4.92084 15.4166H4.92Z" 
                  stroke="${isLiked ? "#FF0000" : "#131313"}" 
                  stroke-opacity="0.8" 
                  stroke-width="1.5" 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  class="${isLiked ? "primary-stroke" : ""}" />
              </svg>
            </button>
            <button class="btn bg-white primary-color mt-3 px-6 py-2 rounded-lg">Adopt</button>
            <button onclick="loadPetDetails(${
              pet.petId
            })" class="btn bg-white primary-color mt-3 px-6 py-2 rounded-lg">Details</button>
          </div>
        </div>
      </div>
    `;
    CardContainer.appendChild(petCard);
  });

  likeClick(pets);
};

// Like button functionality
const likeClick = (pets) => {
  pets.forEach((pet) => {
    const likeButton = document.getElementById(`likeCard${pet.petId}`);
    const likeIcon = document.querySelector(`#likeIcon${pet.petId} path`);

    likeButton.addEventListener("click", () => {
      const likedPetsContainer = document.getElementById("liked-pets");
      const noItems = document.getElementById("no-items");
      const likedPetId = `liked-pet-${pet.petId}`;

      if (likedPetIds.has(pet.petId)) {
        // Remove like
        likedPetIds.delete(pet.petId);
        const petFigure = document.getElementById(likedPetId);
        if (petFigure) likedPetsContainer.removeChild(petFigure);
      } else {
        // Add like
        likedPetIds.add(pet.petId);

        const petFigure = document.createElement("figure");
        petFigure.id = likedPetId;
        petFigure.className = "overflow-hidden rounded-lg";
        petFigure.innerHTML = `<img src="${pet.image}" alt="${pet.category}" class="object-cover w-full h-full" />`;
        likedPetsContainer.appendChild(petFigure);
      }

      // Show or hide "no items"
      noItems.classList.toggle(
        "hidden",
        likedPetsContainer.children.length > 0
      );

      // Re-render current cards to update like button state
      displayPetCards(pets);
    });
  });
};

// load pet details
const loadPetDetails = (petId) => {
  fetch(`https://openapi.programming-hero.com/api/peddy/pet/${petId}`)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data.petData.pet_details);
      displayPetDetails(data.petData);
    })
    .catch((error) => console.error("Error fetching data:", error));
};

// display pet details in modal
const displayPetDetails = (pet) => {
  const modalCard = document.getElementById("modal-card");
  modalCard.innerHTML = `
    <div class="rounded-xl bg-base-100">
            <figure class="overflow-hidden rounded-lg shadow-lg">
                <img src="${pet.image}" alt="${pet.category}" class="object-cover w-full h-full" />
            </figure>
    
            <div class="mt-5">
                <h2 class="card-title">
                            ${pet.pet_name}
                </h2>
                <div class=" grid grid-cols-1 md:grid-cols-2 gap-1 pt-4 pb-4 border-b border-gray-200">
                    <p class="flex items-center gap-2 text-gray-500 text-base">
                        <img src="images/icons/Frame.svg" alt="icon" class="w-5 h-5">
                        Breed: ${pet.breed}
                    </p>
                    <p class="flex items-center gap-2 text-gray-500 text-base">
                        <img src="images/icons/Frame (1).svg" alt="icon" class="w-5 h-5">
                        Birth: ${pet.date_of_birth}
                    </p>
                    <p class="flex items-center gap-2 text-gray-500 text-base">
                        <img src="images/icons/Frame (2).svg" alt="icon" class="w-5 h-5">
                        Gender: ${pet.gender}
                    </p>
                    <p class="flex items-center gap-2 text-gray-500 text-base">
                        <img src="images/icons/Frame (3).svg" alt="icon" class="w-5 h-5">
                        Price: ${pet.price}
                    </p>
                    <p class="flex items-center gap-2 text-gray-500 text-base">
                        <img src="images/icons/Frame (2).svg" alt="icon" class="w-5 h-5">
                        Vaccinated status: ${pet.vaccinated_status}
                    </p>
                </div>
                <div class="pt-4">
                    <h5 class="font-semibold">Details information: </h5>
                    <p class="pt-3">${pet.pet_details}</p>
                </div>
            </div>
        </div>
    `;

  const detailsModal = document.getElementById("details_modal");
  detailsModal.showModal();
};

// const likeClick = (pets) => {
//   pets.forEach((pet) => {
//     const likeButton = document.getElementById(`likeCard${pet.petId}`);
//     likeButton.addEventListener("click", () => {
//       // change like icon color
//       const likeIcon = document.querySelector(`#likeIcon${pet.petId} path`);
//       likeIcon.classList.toggle("primary-stroke");
//       // add pet to liked pets in favorite section
//       const noItems = document.getElementById("no-items");
//       noItems.classList.add("hidden");
//       const likedPets = document.getElementById("liked-pets");
//       console.log(likedPets);
//       likedPets.innerHTML += `
//         <figure class="overflow-hidden  rounded-lg">
//             <img src="${pet.image}" alt="${pet.category}" class="object-cover w-full h-full" />
//         </figure>
//         `;
//     });
//     const likeIcon = document.querySelector(`#likeIcon${pet.petId} path`);
//   });
// };

// like
// const like=(petId)=>{
//     const likeIcon = document.querySelector(`#likeIcon${petId} path`);
//     likeIcon.classList.toggle("primary-stroke");
//     console.log('like' + petId);
// }

loadCategories();
loadPetCards();
