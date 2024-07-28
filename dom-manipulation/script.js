document.addEventListener("DOMContentLoaded", function () {
  const serverUrl = "https://jsonplaceholder.typicode.com/posts";
  const storedQuotes = localStorage.getItem("quotes");
  const quotes = storedQuotes
    ? JSON.parse(storedQuotes)
    : [
        {
          text: "The only way to do great work is to love what you do.",
          category: "Work",
        },
        {
          text: "In the end, we will remember not the words of our enemies, but the silence of our friends.",
          category: "Friendship",
        },
        {
          text: "The best way to predict the future is to create it.",
          category: "Future",
        },
        {
          text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.",
          category: "Mindfulness",
        },
        {
          text: "Life is 10% what happens to us and 90% how we react to it.",
          category: "Life",
        },
        {
          text: "The purpose of our lives is to be happy.",
          category: "Happiness",
        },
        {
          text: "It is never too late to be what you might have been.",
          category: "Motivation",
        },
        {
          text: "Your time is limited, don't waste it living someone else's life.",
          category: "Life",
        },
        { text: "The best revenge is massive success.", category: "Success" },
        {
          text: "You miss 100% of the shots you don’t take.",
          category: "Motivation",
        },
      ];

  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomQuoteBtn = document.getElementById("newQuote");
  const quoteContainer = document.getElementById("addQuoteFormContainer");
  const btnExportToJsonFile = document.getElementById("exportToJsonFile");
  const inputImportFile = document.getElementById("importFile");
  const categoryFilter = document.getElementById("categoryFilter");
  const notification = document.getElementById("notification");

  randomQuoteBtn.addEventListener("click", showRandomQuote);
  categoryFilter.addEventListener("change", filterQuotes);

  createAddQuoteForm();
  updateCategoryFilter();

  function showRandomQuote() {
    const filteredQuotes = populateCategories();
    if (filteredQuotes.length > 0) {
      const randomIndx = Math.floor(Math.random() * filteredQuotes.length);
      const randomQuote = filteredQuotes[randomIndx];
      quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;
      sessionStorage.setItem(
        "lastViewedQuote",
        `"${randomQuote.text}" - ${randomQuote.category}`
      );
    } else {
      quoteDisplay.innerHTML = "No quotes available for this category.";
    }
  }

  function createAddQuoteForm() {
    const form = document.createElement("form");

    const quoteInput = document.createElement("input");
    quoteInput.type = "text";
    quoteInput.placeholder = "Enter your quote";
    quoteInput.id = "quoteInput";
    form.appendChild(quoteInput);

    const categoryInput = document.createElement("input");
    categoryInput.type = "text";
    categoryInput.placeholder = "Enter your category here";
    categoryInput.id = "categoryInput";
    form.appendChild(categoryInput);

    const addQuoteBtn = document.createElement("button");
    addQuoteBtn.textContent = "Add Quote";
    addQuoteBtn.id = "addQuoteBtn";
    form.appendChild(addQuoteBtn);

    quoteContainer.appendChild(form);

    addQuoteBtn.addEventListener("click", function (event) {
      event.preventDefault();
      addQuote();
    });
  }

  function addQuote() {
    const quoteInput = document.getElementById("quoteInput");
    const categoryInput = document.getElementById("categoryInput");

    const quoteText = quoteInput.value.trim();
    const categoryText = categoryInput.value.trim();

    if (quoteText !== "" && categoryText !== "") {
      quotes.push({ text: quoteText, category: categoryText });
      quoteInput.value = "";
      categoryInput.value = "";
      saveQuotes();
      updateCategoryFilter();
      syncQuotes();
      alert("Quote added successfully!");
    } else {
      alert("Please fill out both fields.");
    }
  }

  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }

  btnExportToJsonFile.addEventListener("click", exportToJsonFile);

  function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "quotes.json";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  inputImportFile.addEventListener("change", importFromJsonFile);

  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      updateCategoryFilter();
      syncQuotes();
      alert("Quotes imported successfully!");
    };
    fileReader.readAsText(event.target.files[0]);
  }

  function populateCategories() {
    const selectedCategory = categoryFilter.value;
    if (selectedCategory === "all") {
      return quotes;
    }
    return quotes.filter((quote) => quote.category === selectedCategory);
  }

  function filterQuotes() {
    const filteredQuotes = populateCategories();
    if (filteredQuotes.length > 0) {
      quoteDisplay.innerHTML = `"${filteredQuotes[0].text}" - ${filteredQuotes[0].category}`;
    } else {
      quoteDisplay.innerHTML = "No quotes available for this category.";
    }
    localStorage.setItem("selectedCategory", categoryFilter.value);
  }

  function updateCategoryFilter() {
    const categories = [...new Set(quotes.map((quote) => quote.category))];
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });

    const savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory) {
      categoryFilter.value = savedCategory;
      filterQuotes();
    }
  }

  function syncQuotes() {
    fetch(serverUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quotes),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Data synced with server:", data);
      })
      .catch((error) => {
        console.error("Error syncing with server:", error);
      });
  }

  async function fetchQuotesFromServer() {
    await fetch(serverUrl)
      .then((response) => response.json())
      .then((serverQuotes) => {
        if (JSON.stringify(serverQuotes) !== JSON.stringify(quotes)) {
          quotes.length = 0;
          quotes.push(...serverQuotes);
          saveQuotes();
          updateCategoryFilter();
          notification.innerHTML = "Quotes updated from server.";
        }
      })
      .catch((error) => {
        console.error("Error fetching from server:", error);
      });
  }

  setInterval(fetchQuotesFromServer, 10000); // Periodic fetching every 10 seconds

  // Load last viewed quote from session storage
  const lastViewedQuote = sessionStorage.getItem("lastViewedQuote");
  if (lastViewedQuote) {
    quoteDisplay.innerHTML = lastViewedQuote;
  }
});
