alert("dashboard.js loaded");

// ==========================
// Firebase Configuration
// ==========================

const firebaseConfig = {
  apiKey: "AIzaSyDSu_PnEweLIf66tWUh6rxGmJj7PM1s28A",
  authDomain: "chase-exchange.firebaseapp.com",
  projectId: "chase-exchange",
  storageBucket: "chase-exchange.firebasestorage.app",
  messagingSenderId: "749594140408",
  appId: "1:749594140408:web:1f1bdc5f82fe76f91ca50d"
};
firebase.initializeApp(firebaseConfig);

alert("Firebase initialized");

const db = firebase.firestore();
const auth = firebase.auth();

console.log("Firebase Connected");
alert("THIS IS THE NEW FILE");
// ==========================
// Dashboard Ready
// ==========================

window.addEventListener("DOMContentLoaded", () => {

    // ----------------------
    // Protect Dashboard
    // ----------------------

    auth.onAuthStateChanged(user => {

        if (!user) {

            window.location.href = "login.html";

        }

    });

    // ----------------------
    // Elements
    // ----------------------

    const modal = document.getElementById("transactionModal");

    const newBtn = document.getElementById("newTransactionBtn");

    const closeBtn = document.getElementById("closeModal");

    const saveBtn = document.getElementById("saveTransaction");

  const serviceModal = document.getElementById("serviceModal");
const serviceBtn = document.getElementById("serviceManagerBtn");
const closeServiceBtn = document.getElementById("closeServiceModal");

  const rateModal = document.getElementById("rateModal");
const rateBtn = document.getElementById("rateManagerBtn");
const closeRateBtn = document.getElementById("closeRateModal");

    // ----------------------
    // Open Modal
    // ----------------------

    newBtn.addEventListener("click", () => {

        modal.style.display = "flex";

    });
  serviceBtn.addEventListener("click", () => {

    serviceModal.style.display = "flex";

});

closeServiceBtn.addEventListener("click", () => {

    serviceModal.style.display = "none";

});

  rateBtn.addEventListener("click", () => {

    rateModal.style.display = "flex";

});

closeRateBtn.addEventListener("click", () => {

    rateModal.style.display = "none";

});
    // ----------------------
    // Close Modal
    // ----------------------

    closeBtn.addEventListener("click", () => {

        modal.style.display = "none";

    });

    // ----------------------
    // Save Transaction
    // ----------------------

    saveBtn.addEventListener("click", async () => {

        const customer = document.getElementById("customerName").value.trim();

        const service = document.getElementById("service").value;

        const amount = document.getElementById("amount").value;

        const status = document.getElementById("status").value;

        if (customer === "" || amount === "") {

            alert("Please fill in all fields.");

            return;

        }

        try {

            // Generate transaction reference
const reference =
"CHX-" + Date.now().toString().slice(-5);

await db.collection("transactions").add({

    reference: reference,

    customer: customer,

    service: service,

    amount: Number(amount),

    status: status,

    createdAt: firebase.firestore.FieldValue.serverTimestamp()

});

alert("Transaction Added Successfully!\nReference: " + reference);

            alert("Transaction Saved!");

            modal.style.display = "none";

            document.getElementById("customerName").value = "";

            document.getElementById("amount").value = "";

        }

        catch(error){

            alert(error.message);

        }

    });

});
// ==========================
// Load Transactions
// ==========================

function loadTransactions() {

    db.collection("transactions")
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {

        const table = document.getElementById("transactionTable");

        table.innerHTML = "";

        let totalOrders = 0;
        let totalRevenue = 0;
        let pendingOrders = 0;
        const customers = new Set();

        snapshot.forEach(doc => {

            const data = doc.data();

            totalOrders++;
            totalRevenue += Number(data.amount);
            customers.add(data.customer);

            if (data.status === "Pending") {
                pendingOrders++;
            }

            table.innerHTML += `
<tr>
    <td>${doc.id.substring(0,8).toUpperCase()}</td>
    <td>${data.customer}</td>
    <td>${data.service}</td>
    <td>₦${Number(data.amount).toLocaleString()}</td>
    <td>
        <span class="status ${data.status.toLowerCase()}">
            ${data.status}
        </span>
    </td>
    <td>${new Date().toLocaleDateString()}</td>
    <td>
        <button
            class="view-btn"
            onclick="viewTransaction(
                '${doc.id}',
                '${data.reference || doc.id.substring(0,8).toUpperCase()}',
                '${data.customer}',
                '${data.service}',
                '${data.amount}',
                '${data.status}'
            )">
            View
        </button>
    </td>
</tr>
`;

        });

        document.getElementById("totalOrders").innerText = totalOrders;
        document.getElementById("totalRevenue").innerText =
            "₦" + totalRevenue.toLocaleString();
        document.getElementById("totalCustomers").innerText = customers.size;
        document.getElementById("pendingOrders").innerText = pendingOrders;

    });

}

window.addEventListener("DOMContentLoaded", () => {

    loadTransactions();

    loadServices();

});
// ==========================
// View Transaction
// ==========================

let selectedTransactionId = "";

function viewTransaction(id, reference, customer, service, amount, status) {

    selectedTransactionId = id;

    document.getElementById("viewReference").innerText = reference;
    document.getElementById("viewCustomer").innerText = customer;
    document.getElementById("viewService").innerText = service;
    document.getElementById("viewAmount").innerText =
        Number(amount).toLocaleString();
    document.getElementById("viewStatus").innerText = status;

    document.getElementById("viewModal").style.display = "flex";

}

document.getElementById("closeViewModal").addEventListener("click", () => {

    document.getElementById("viewModal").style.display = "none";

});
// ==========================
// Delete Transaction
// ==========================

document.getElementById("deleteTransaction").addEventListener("click", async () => {

    if (!selectedTransactionId) return;

    if (!confirm("Delete this transaction?")) return;

    try {

        await db.collection("transactions")
            .doc(selectedTransactionId)
            .delete();

        alert("Transaction deleted!");

        document.getElementById("viewModal").style.display = "none";

    } catch (error) {

        alert(error.message);

    }

});

// ==========================
// Mark Completed
// ==========================

document.getElementById("completeTransaction").addEventListener("click", async () => {

    if (!selectedTransactionId) return;

    await db.collection("transactions")
        .doc(selectedTransactionId)
        .update({

            status: "Completed"

        });

    document.getElementById("viewModal").style.display = "none";

});

// ==========================
// Mark Processing
// ==========================

document.getElementById("processingTransaction").addEventListener("click", async () => {

    if (!selectedTransactionId) return;

    await db.collection("transactions")
        .doc(selectedTransactionId)
        .update({

            status: "Processing"

        });

    document.getElementById("viewModal").style.display = "none";

});
// ==========================
// Add New Service
// ==========================

document.getElementById("addService").addEventListener("click", async () => {

    const service = document.getElementById("newService").value.trim();

    if (service === "") {
        alert("Enter a service name.");
        return;
    }

    try {

        await db.collection("services").add({

            name: service,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()

        });

        document.getElementById("newService").value = "";

        alert("Service added successfully!");

    } catch (error) {

        alert(error.message);

    }

});
// ==========================
// Load Services
// ==========================

function loadServices() {

    db.collection("services")
      .orderBy("name")
      .onSnapshot(snapshot => {

        const serviceList = document.getElementById("serviceList");

        serviceList.innerHTML = "";
        
const serviceSelect = document.getElementById("service");

if (serviceSelect) {
    serviceSelect.innerHTML = "";
}

        const rateService = document.getElementById("rateService");

if (rateService) {
    rateService.innerHTML =
        '<option value="">Select Service</option>';
}
        snapshot.forEach(doc => {

            const data = doc.data();
          
if (serviceSelect) {
    serviceSelect.innerHTML += `
        <option value="${data.name}">
            ${data.name}
        </option>
    `;
}

          if (rateService) {
    rateService.innerHTML += `
        <option value="${data.name}">
            ${data.name}
        </option>
    `;
          }
            serviceList.innerHTML += `
                <div class="service-item">
                    <span>${data.name}</span>

                    <button
                        onclick="deleteService('${doc.id}')">
                        Delete
                    </button>
                </div>
            `;

        });

    });

}

// ==========================
// Delete Service
// ==========================

async function deleteService(id) {

    if (!confirm("Delete this service?")) return;

    await db.collection("services")
        .doc(id)
        .delete();

}
// ==========================
// Load Exchange Rates
// ==========================

function loadExchangeRates() {

    db.collection("exchangeRates")
      .orderBy("service")
      .onSnapshot(snapshot => {

        const rateList = document.getElementById("rateList");

        rateList.innerHTML = "";

        snapshot.forEach(doc => {

            const data = doc.data();

            rateList.innerHTML += `
                <div class="service-item">

                    <div>

                        <strong>${data.service}</strong><br>

                        Buy: ₦${Number(data.buyRate).toLocaleString()}<br>

                        Sell: ₦${Number(data.sellRate).toLocaleString()}

                    </div>

                    <div>

<button
    onclick="editRate(
        '${data.service}',
        '${data.buyRate}',
        '${data.sellRate}'
    )">

    Edit

</button>

<button
    onclick="deleteRate('${doc.id}')">

    Delete

</button>

</div>

                </div>
            `;

        });

    });

}

loadExchangeRates();
// ==========================
// Delete Exchange Rate
// ==========================

async function deleteRate(id) {

    if (!confirm("Delete this exchange rate?")) return;

    try {

        await db.collection("exchangeRates")
            .doc(id)
            .delete();

        alert("Exchange rate deleted!");

    } catch (error) {

        alert(error.message);

    }

}
// ==========================
// Save Exchange Rate
// ==========================

document.getElementById("saveRate").addEventListener("click", async () => {

    const service = document.getElementById("rateService").value;
    const buyRate = document.getElementById("buyRate").value;
    const sellRate = document.getElementById("sellRate").value;

    if (service === "" || buyRate === "" || sellRate === "") {
        alert("Please complete all fields.");
        return;
    }

    try {

        await db.collection("exchangeRates")
            .doc(service)
            .set({

                service: service,
                buyRate: Number(buyRate),
                sellRate: Number(sellRate),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()

            });

        alert("Exchange rate saved successfully!");

        document.getElementById("buyRate").value = "";
        document.getElementById("sellRate").value = "";

    } catch (error) {

        alert(error.message);

    }

});
// ==========================
// Edit Exchange Rate
// ==========================

function editRate(service, buyRate, sellRate) {

    document.getElementById("rateService").value = service;

    document.getElementById("buyRate").value = buyRate;

    document.getElementById("sellRate").value = sellRate;

}