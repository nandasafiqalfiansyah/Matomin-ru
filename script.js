document.addEventListener("DOMContentLoaded", () => {
  const apiUrlForm = document.getElementById("api-url-form");
  const apiUrlInput = document.getElementById("api-url");
  const dataForm = document.getElementById("data-form");
  const dataId = document.getElementById("data-id");
  const dataName = document.getElementById("data-name");
  const dataValue = document.getElementById("data-value");
  const dataContainer = document.getElementById("data-container");

  let apiUrl = "";

  // Set API URL
  apiUrlForm.addEventListener("submit", (e) => {
    e.preventDefault();
    apiUrl = apiUrlInput.value;
    if (apiUrl) {
      fetchData();
      dataForm.classList.remove("hidden");
    }
  });

  // Fetch and display data (GET all)
  const fetchData = () => {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        dataContainer.innerHTML = "";
        data.forEach((item) => {
          const itemElement = document.createElement("div");
          itemElement.className =
            "p-4 bg-gray-100 rounded-lg shadow-sm flex justify-between items-center";
          itemElement.innerHTML = `
                        <div>
                            <p class="font-bold">${item.name}</p>
                            <p>${item.value}</p>
                        </div>
                        <div>
                            <button onclick="editData('${item.id}')" class="bg-yellow-500 text-white px-2 py-1 rounded-md">Edit</button>
                            <button onclick="deleteData('${item.id}')" class="bg-red-500 text-white px-2 py-1 rounded-md">Delete</button>
                        </div>
                    `;
          dataContainer.appendChild(itemElement);
        });
      })
      .catch((error) => {
        dataContainer.innerHTML = "Fetch error: " + error.message;
      });
  };

  // Add or update data (POST/PUT)
  dataForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = dataId.value;
    const method = id ? "PUT" : "POST";
    const url = id ? `${apiUrl}/${id}` : apiUrl;
    const payload = {
      name: dataName.value,
      value: dataValue.value,
    };

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(() => {
        dataForm.reset();
        fetchData();
      })
      .catch((error) => {
        alert("Submit error: " + error.message);
      });
  });

  // Edit data (GET by id)
  window.editData = (id) => {
    fetch(`${apiUrl}/${id}`)
      .then((response) => response.json())
      .then((data) => {
        dataId.value = data.id;
        dataName.value = data.name;
        dataValue.value = data.value;
      })
      .catch((error) => {
        alert("Edit error: " + error.message);
      });
  };

  // Delete data (DELETE)
  window.deleteData = (id) => {
    fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        fetchData();
      })
      .catch((error) => {
        alert("Delete error: " + error.message);
      });
  };
});
