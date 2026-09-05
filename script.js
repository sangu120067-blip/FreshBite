/* =========================================
   FRESHBITE - MAIN JAVASCRIPT
========================================= */


/* =========================================
   CART FUNCTIONS
========================================= */

function getCart() {
    try {
        return JSON.parse(
            localStorage.getItem("freshBiteCart")
        ) || [];
    } catch (error) {
        return [];
    }
}


/* Add item to cart */

function addToCart(name, price) {

    let cart = getCart();

    const existingItem = cart.find(
        item => item.name === name
    );

    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({
            name: name,
            price: Number(price),
            quantity: 1
        });

    }

    localStorage.setItem(
        "freshBiteCart",
        JSON.stringify(cart)
    );

    updateCartCount();

    showToast(
        name + " added to cart 🛒"
    );
}


/* =========================================
   UPDATE CART COUNT
========================================= */

function updateCartCount() {

    const cart = getCart();

    const totalQuantity = cart.reduce(
        (total, item) =>
            total + Number(item.quantity || 0),
        0
    );

    const cartCount =
        document.getElementById("cartCount");

    if (cartCount) {

        cartCount.textContent = totalQuantity;

    }
}


/* =========================================
   TOAST MESSAGE
========================================= */

let toastTimer;

function showToast(message) {

    const toast =
        document.getElementById("toast");

    if (!toast) {
        return;
    }

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);
}


/* =========================================
   MENU FILTERING
   CATEGORY + DIETARY + SEARCH
========================================= */

let selectedCategory = "all";
let selectedDiet = "all";


function setupMenuFilters() {

    const categoryButtons =
        document.querySelectorAll(
            ".category-btn"
        );

    const dietButtons =
        document.querySelectorAll(
            ".diet-btn"
        );

    const foodCards =
        document.querySelectorAll(
            ".food-card"
        );

    const searchInput =
        document.getElementById(
            "foodSearch"
        );

    const noResults =
        document.getElementById(
            "noResults"
        );


    /* -------------------------------------
       CATEGORY BUTTONS
    ------------------------------------- */

    categoryButtons.forEach(button => {

        button.addEventListener(
            "click",
            function () {

                categoryButtons.forEach(btn => {

                    btn.classList.remove(
                        "active"
                    );

                });

                this.classList.add("active");

                selectedCategory =
                    this.dataset.category;

                filterFood();

            }
        );

    });


    /* -------------------------------------
       DIETARY BUTTONS
    ------------------------------------- */

    dietButtons.forEach(button => {

        button.addEventListener(
            "click",
            function () {

                dietButtons.forEach(btn => {

                    btn.classList.remove(
                        "active"
                    );

                });

                this.classList.add("active");

                selectedDiet =
                    this.dataset.diet;

                filterFood();

            }
        );

    });


    /* -------------------------------------
       SEARCH
    ------------------------------------- */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterFood
        );

    }


    /* -------------------------------------
       FILTER FUNCTION
    ------------------------------------- */

    function filterFood() {

        const searchText =
            searchInput
                ? searchInput.value
                    .toLowerCase()
                    .trim()
                : "";

        let visibleCards = 0;


        foodCards.forEach(card => {

            const category =
                card.dataset.category || "";

            const diet =
                card.dataset.diet || "";

            const name =
                card.dataset.name
                    ? card.dataset.name
                        .toLowerCase()
                    : "";


            const categoryMatch =
                selectedCategory === "all" ||
                category === selectedCategory;


            const dietMatch =
                selectedDiet === "all" ||
                diet === selectedDiet;


            const searchMatch =
                name.includes(searchText);


            if (
                categoryMatch &&
                dietMatch &&
                searchMatch
            ) {

                card.style.display = "";

                visibleCards++;

            } else {

                card.style.display = "none";

            }

        });


        /* ---------------------------------
           NO RESULTS MESSAGE
        --------------------------------- */

        if (noResults) {

            if (visibleCards === 0) {

                noResults.style.display =
                    "block";

            } else {

                noResults.style.display =
                    "none";

            }

        }

    }


    /* -------------------------------------
       INITIAL FILTER
    ------------------------------------- */

    filterFood();
}


/* =========================================
   RUN WHEN PAGE LOADS
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartCount();

        setupMenuFilters();

    }
);