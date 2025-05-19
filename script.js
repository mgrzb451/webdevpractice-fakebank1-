// Users Database

class User {
    constructor(owner, transactions, transactionsDates, interestRate, password, login, currency, locale) {
        this.owner = owner;
        this.transactions = transactions;
        this.transactionsDates = transactionsDates;
        this.interestRate = interestRate;
        this.password = password;
        this.login = login;
        this.currency = currency;
        this.locale = locale;
    }
}

const user1 = new User("John Smith", [200, 450, -400, 3000, -650, -130, 70, 1300], 
    ['2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z'], 1.2, "pw1", "user1", "EUR", "de-DE");
const user2 = new User("Sarah Connor", [5000, 3400, -150, -790, -3210, -1000, 8500, -30], 
    ['2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z'], 1.5, "pw2", "user2", "USD", "en-US");
const user3 = new User("Marjory Henneth Green", [200, -200, 340, -300, -20, 50, 400, -460], 
    ['2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z'], .7, "pw3", "user3", "CNY", "zn-CN");
const user4 = new User("Francis John", [430, 1000, 700, 50, 90], 
    ['2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z'], 1, "pw4", "user4", "JPY", "jp-JP");
const users = [user1, user2, user3, user4];

// Fake Login mechanic
    // Login form elements
const loginScreen = document.getElementById("login-screen");
const loginAccountNameInput  = document.getElementById("login-account-name-input");
const loginAccountPasswordInput  = document.getElementById("login-account-password-input");
const loginButton  = document.getElementById("login-button");
    
    /* Declare a variable that will store the currently Logged in User - it gets filled by the
    login function inside its scope which still trips me up 🤨 */
let currentUser;

    // Top heading welcome message display
    const welcomeNameDisplay = document.getElementById("welcome-name");

    // adding regional formatting
    function makeCurrencyFormatter(currentUser) {
        return new Intl.NumberFormat(currentUser.locale, {style:"currency", currency: currentUser.currency})}

    // Transactions History container
const transactionsSection = document.getElementById("transactions");
    // Function to populate the transactions history container by inserting new HTML content
function displayTransactions(currentUser, sort=false) {
    // Clear whatever is already in the container
    transactionsSection.innerHTML = "";

    // adding option to first sort the transactions array in descending order after clicking the sort button
    if (sort) {currentUser.transactions = currentUser.transactions.sort((a,b) => a-b);}
    
    // adding regional formatting
    const currencyFormatter = makeCurrencyFormatter(currentUser);    

    // adding transaction dates
    const transactionsLen = currentUser.transactions.length;
    for (let i=0; i<transactionsLen; i+=1) {
        const transactionTypePill = (currentUser.transactions[i] > 0) ? "Deposit" : "Withdrawal";
        const transactionDate = Temporal.PlainDate.from(currentUser.transactionsDates[i].slice(0, -1)).toString();

        // HTML we want to add to the DOM
        const transactionArticle = `
            <article>
                <div class="transaction-type-container">
                    <div class="transaction-${transactionTypePill.toLowerCase()}-pill">${transactionTypePill}</div>
                    <div class="transaction-date">${transactionDate}</div>
                </div>
                <p>${currencyFormatter.format(currentUser.transactions[i])}</p>
            </article>`
        // adding the new elements
        transactionsSection.insertAdjacentHTML("afterbegin", transactionArticle);
    }
};

// Fill in the bottom summary and top balance
const totalIncomeDisplay = document.getElementById("total-income");
const totalExpenditureDisplay = document.getElementById("total-expenditure");
const totalInterestDisplay = document.getElementById("total-interest");
const totalBalanceDisplay = document.getElementById("account-balance");
const headingDateTimeDisplay = document.getElementById("top-heading-datetime");

/* We have already looped over the current user's transactions to populate the history container
It'd be better to perform the below calculations inside that loop, but for the ease of taking screenshots for notes
We'll split these operations to a separate function */
function displaySummary (currentUser=currentUser) {
    let totalIncome = 0;
    let totalExpenditure = 0;
    for (const transaction of currentUser.transactions) {
        // loop through the transactions and calculate total income and expenses
        if (transaction > 0) {totalIncome += transaction} else {totalExpenditure += Math.abs(transaction)}
    }
    // add a new attribute to the current user holding their current account balance - we'll be using it later as well
    currentUser.accountBalance = totalIncome - totalExpenditure;
    let totalInterest = currentUser.accountBalance * currentUser.interestRate / 100;
    // display the calculated values in the HTML

    // add regional formatting
    const currencyFormatter = makeCurrencyFormatter(currentUser);
    totalIncomeDisplay.textContent = currencyFormatter.format(totalIncome);
    totalExpenditureDisplay.textContent = currencyFormatter.format(totalExpenditure);
    totalBalanceDisplay.textContent = currencyFormatter.format(currentUser.accountBalance);
    totalInterestDisplay.textContent = currencyFormatter.format(totalInterest);

    // adding current date
    const dateTimeNow = Temporal.Now.plainDateTimeISO();
    const currentDate = dateTimeNow.toLocaleString("en-DE", {month: "long", day:"numeric", year:"numeric"});
    const currentTime = dateTimeNow.toLocaleString("en-DE", {hour:"numeric", minute:"numeric"});
    headingDateTimeDisplay.textContent = `${currentDate}, ${currentTime}`
};

// Logout timer
const logoutTimerDisplay = document.getElementById("logout-timer");
function formatTimeLeft(timeLeft) {
    // Format the timeLeft into MM:SS. Returns an array of minutes and seconds to be displayed in the UI
    const minsLeft = String(Math.floor(timeLeft / 60)).padStart(2, 0);
    const secsLeft = String(Math.floor(timeLeft % 60)).padStart(2, 0);
    return [minsLeft, secsLeft]
}
function startLogoutTimer() {
    let timeLeft = 600;

    function showTimeLeft() {
        logoutTimerDisplay.textContent = `${formatTimeLeft(timeLeft)[0]}:${formatTimeLeft(timeLeft)[1]}`
        timeLeft -= 1;
        if (timeLeft < 0) {
            clearInterval(logoutTimerId)
            window.location.reload(true);
        };
    }
    const logoutTimerId = setInterval(showTimeLeft, 1000);
};

    // Function to handle user login and filling in the page with their data
function loginUser(event) {
    // Stop the button's default behaviour of sending form data and reloading the page
    event.preventDefault();

    // User validation
    // Get the text entered by the user in the form fields. Use .value not .textContent
    const enteredLogin = loginAccountNameInput.value;
    const enteredPassword = loginAccountPasswordInput.value;

    /* loop through the array of users and find the first user whose login attribute matches
    the users' input
     Decided no to use the .find() method for performance reasons and the fact that I'd have to
     chain more of these array methods - instead I'll use a normal for loop */
    // const currentUser = users.find((user) => user.login === enteredLogin);
    for (const user of users) {
        if (enteredLogin && enteredLogin === user.login) {
            // found matching user now check the password
            if (enteredPassword && enteredPassword === user.password ) {
                // password matches - assign the global currentUser variable
                currentUser = user;
            }
            else {
                // user found but password didn't match. We return to prevent the "User not found" log 
                console.log("Password incorrect")
            return
            }
        }
    }
    // for loop finished and no matching user was found. Stop the function
    if (!currentUser) {
        console.log("User not found")
        return
    }
    else {
    // User succesfully logged in. Lift the login screen and populate the page
        loginScreen.style.display = "none";
        welcomeNameDisplay.textContent = currentUser.owner.split(" ")[0];
        displayTransactions(currentUser);
        displaySummary(currentUser);
        startLogoutTimer();
    }
};
loginButton.addEventListener("click", loginUser);


// Operations section
// Transfering funds
const transferDestinationInput = document.getElementById("transfer-funds-destination-input");
const transferAmountInput = document.getElementById("transfer-funds-amount-input");
const transferButton = document.getElementById("transfer-funds-button");

function transferFunds(event) {
    event.preventDefault();

    const destinationAccount = transferDestinationInput.value;
    const transferAmount = Number(transferAmountInput.value);
    console.log(`dest acc: ${destinationAccount} transfer amnt: ${transferAmount}`)

    // Opportunity to reuse functionality with the loging in function?
    // Loop through the users array and check if destination account is valid
    for (const destinationUser of users) {
        if (destinationAccount && destinationAccount !== currentUser.login && destinationAccount === destinationUser.login) {
            // destination account found check if enough funds in current account
            // no need to check for number validity - it happens in the HTML <input pattern="regex">
            if (transferAmount > 0 && currentUser.accountBalance >= transferAmount) {
                // transfer succesfull update balance, transfer history and display the new values
                currentUser.accountBalance -= transferAmount;
                currentUser.transactions.push(-transferAmount);
                currentUser.transactionsDates.push(Temporal.Now.plainDateTimeISO().toString({fractionalSecondDigits:3})+"Z");
                displayTransactions(currentUser);
                displaySummary(currentUser);
                // add new funds to the destination account
                destinationUser.transactions.push(transferAmount);
                // clear the input fields
                transferDestinationInput.value = "";
                transferAmountInput.value = "";
                return
            }
        }
    }
    return
};
transferButton.addEventListener("click", transferFunds);

// Requesting loan - add a new transaction after a random delay
const loanAmountInput = document.getElementById("reuqest-loan-amount-input");
const requestLoanButton = document.getElementById("reuqest-loan-button");

function grantLoan(currentUser) {
    // read the requested amount
    const loanAmount = Number(loanAmountInput.value);

    // if user requests more than their current account balance reject loan
    if (loanAmount > currentUser.accountBalance) {
        alert("Loan rejected - requested amount is too high.")
        loanAmountInput.value = "";
        return};
    
    // add a new transaction with current date to the user's history
    currentUser.transactions.push(loanAmount);
    currentUser.transactionsDates.push(Temporal.Now.plainDateTimeISO().toString({fractionalSecondDigits:3})+"Z");
    // update the page
    displayTransactions(currentUser);
    displaySummary(currentUser);
    // clear input field
    loanAmountInput.value = "";
}

function handleLoanRequest(event) {
    event.preventDefault();
    // random loan delay between 2 and 10sec in ms
    const loanDelay = (Math.floor(Math.random() * 9) + 2) * 1000;
    setTimeout(grantLoan, loanDelay, currentUser);
}
requestLoanButton.addEventListener("click", handleLoanRequest);











// Sorting the transfers history in descending order
// We want clicking the button to toggle between sorted and unsorted state
const buttonSortHistory = document.getElementById("button-sort-transfer-history");
// start with the array not sorted
let sorted = false;
function sortHistory() {
    if (sorted) {
        // if the array is currently sorted - unsort it and set state to unsorted
        displayTransactions(currentUser, false);
        sorted = false;
    }
    else {
        // if the array is currently unsorted - sort it and set state to sorted
        displayTransactions(currentUser, true);
        sorted = true;
    }
}
buttonSortHistory.addEventListener("click", sortHistory);