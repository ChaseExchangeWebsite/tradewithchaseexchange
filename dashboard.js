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


const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

console.log("Firebase Connected");
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

// Upload payment proof (if selected)
let paymentProofURL = "";

const paymentFile =
document.getElementById("paymentProof").files[0];

if (paymentFile) {

    const storageRef = storage
        .ref()
        .child("payment-proofs/" + Date.now() + "-" + paymentFile.name);

    await storageRef.put(paymentFile);

    paymentProofURL = await storageRef.getDownloadURL();

}

await db.collection("transactions").add({

    reference: reference,

    customer: customer,

    service: service,

    amount: Number(amount),

    status: status,

    paymentProof: paymentProofURL,

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
let completedOrders = 0;
let todayRevenue = 0;
let todayOrders = 0;
const customers = new Set();
const serviceCount = {};

        snapshot.forEach(doc => {

          const data = doc.data();
          
            totalOrders++;
totalRevenue += Number(data.amount);
customers.add(data.customer);

// Count services
serviceCount[data.service] =
(serviceCount[data.service] || 0) + 1;

// Pending
if (data.status === "Pending") {
    pendingOrders++;
}

// Completed
if (data.status === "Completed") {
    completedOrders++;
}

// Today's transactions
const today = new Date().toDateString();

if (
    data.createdAt &&
    data.createdAt.toDate().toDateString() === today
) {
    todayOrders++;
    todayRevenue += Number(data.amount);
}

            table.innerHTML += `
<tr>
    <td>${data.reference || doc.id.substring(0,8).toUpperCase()}</td>
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
        let revenueDisplay = "";

if (totalRevenue >= 1000000000) {

    revenueDisplay = "₦" + (totalRevenue / 1000000000).toFixed(1) + "B";

} else if (totalRevenue >= 1000000) {

    revenueDisplay = "₦" + (totalRevenue / 1000000).toFixed(1) + "M";

} else if (totalRevenue >= 1000) {

    revenueDisplay = "₦" + (totalRevenue / 1000).toFixed(1) + "K";

} else {

    revenueDisplay = "₦" + totalRevenue.toLocaleString();

}

document.getElementById("totalRevenue").innerText = revenueDisplay;
        document.getElementById("totalCustomers").innerText = customers.size;
        document.getElementById("pendingOrders").innerText = pendingOrders;
// ==========================
// Today's Summary
// ==========================

document.getElementById("todayOrders").innerText = todayOrders;

// Format Today's Revenue
let todayRevenueDisplay = "";

if (todayRevenue >= 1000000000) {

    todayRevenueDisplay =
        "₦" + (todayRevenue / 1000000000).toFixed(1) + "B";

} else if (todayRevenue >= 1000000) {

    todayRevenueDisplay =
        "₦" + (todayRevenue / 1000000).toFixed(1) + "M";

} else if (todayRevenue >= 1000) {

    todayRevenueDisplay =
        "₦" + (todayRevenue / 1000).toFixed(1) + "K";

} else {

    todayRevenueDisplay = "₦" + todayRevenue.toLocaleString();

}

document.getElementById("todayRevenue").innerText =
    todayRevenueDisplay;

document.getElementById("completedOrders").innerText =
    completedOrders;

// Most Used Service
let topService = "-";
let highest = 0;

for (const service in serviceCount) {

    if (serviceCount[service] > highest) {

        highest = serviceCount[service];
        topService = service;

    }

}

document.getElementById("topService").innerText = topService;
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
// ==========================
// Search Transactions
// ==========================

function searchTransactions() {

    const input = document
        .getElementById("searchTransaction")
        .value
        .toLowerCase();

    const table = document.getElementById("transactionsTable");

    const rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {

        const rowText = rows[i].innerText.toLowerCase();

        if (rowText.includes(input)) {

            rows[i].style.display = "";

        } else {

            rows[i].style.display = "none";

        }

    }

}
// ==========================
// Search Transactions
// ==========================

function searchTransactions() {

    const search = document
        .getElementById("searchTransaction")
        .value
        .toLowerCase();

    const rows = document
        .getElementById("transactionTable")
        .getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {

        const text = rows[i].innerText.toLowerCase();

        if (text.includes(search)) {

            rows[i].style.display = "";

        } else {

            rows[i].style.display = "none";

        }

    }

}
// ==========================
// Filter Transactions
// ==========================

function filterTransactions(status) {

    const rows = document
        .getElementById("transactionTable")
        .getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {

        if (status === "all") {

            rows[i].style.display = "";

            continue;

        }

        const rowText = rows[i].innerText.toLowerCase();

        if (rowText.includes(status.toLowerCase())) {

            rows[i].style.display = "";

        } else {

            rows[i].style.display = "none";

        }

    }

}