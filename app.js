//BUDGET CONTROLLER
var budgetController = (function() {
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  var calculateTotal = function(type) {
    var sum = 0;
    data.allitems[type].forEach(function(cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    allitems: {
      inc: [],
      exp: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };
  return {
    addItem: function(type, des, val) {
      var newItem, ID;
      //create new id
      if (data.allitems[type].length > 0) {
        ID = data.allitems[type][data.allitems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
      //create new item depending of the type of the input
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }
      // push the new item into the array
      data.allitems[type].push(newItem);
      //return the new item
      return newItem;
    },
    deleteItem: function(type, id) {
      var ids, index;
      //id = 3
      // console.log(data.allItems[type][id]);
      ids = data.allitems[type].map(current => {
        return current.id;
      });
      index = ids.indexOf(id);
      console.log(ids);
      console.log(index);
      if (index !== -1) {
        data.allitems[type].splice(index, 1);
      }
      console.log(ids);
    },
    calculateBudget: function() {
      //calculate total income and expenses
      calculateTotal("inc");
      calculateTotal("exp");
      //calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      //calculate the percentage of the income spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      }
    },
    calculatePercentages: function() {
      data.allitems.exp.forEach(function(cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function() {
      var allPerc = data.allitems.exp.map(function(cur) {
        return cur.getPercentage();
      });
      return allPerc;
    },
    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },
    testing: function() {
      console.log(data);
    }
  };
})();

//UI CONTROLLER
var UIController = (function() {
  //All DOM objects (input fields,buttons,options etc.)

  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    expenseContainer: ".expenses__list",
    container: ".container",
    expencesPercentageLabel: ".item__percentage",
    dateLabel: ".budget__title--month"
  };
  var formatNumber = function(num, type) {
    /*
    + or - before the number
    two numbers after the decimal point
    coma separating the thousands

    2310.4567 -> + 2,310.46
    */
    num = Math.abs(num);
    num = num.toFixed(2);
    numSplit = num.split(".");
    int = numSplit[0];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3);
    }

    dec = numSplit[1];

    return int + "." + dec;
  };
  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, //will be either inc(for income) or exp(for expenses)
        description: document.querySelector(DOMstrings.inputDescription).value,
        //Convert the value from a string into a number
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },
    //Adds the new items 'expenses' or 'incomes' to the UI
    addListItem: function(obj, type) {
      // Create HTML string with placeholder text
      var html, newHtml, element;

      if (type === "inc") {
        element = DOMstrings.incomeContainer;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expenseContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"><i></button></div></div></div>';
      }

      // Replace the plaholder text with actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));

      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },
    deleteListItem: function(selectorID) {
      var el = document.getElementById(selectorID);

      el.parentNode.removeChild(el);
    },
    clearFields: function() {
      var fields, fieldsArr;
      // Selecting the description and the value fields (returns a List not an Array so it needs to be converted to an Array)
      fields = document.querySelectorAll(
        DOMstrings.inputDescription + " ," + DOMstrings.inputValue
      );
      // Converting a Nodelist to an Array using Array.from()
      fieldsArr = Array.from(fields);
      fieldsArr.forEach(function(current, index, array) {
        current.value = "";
      });
      fieldsArr[0].focus();
    },
    displayBudget: function(obj) {
      obj.budget > 0 ? (type = "inc") : (type = "exp");
      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(
        obj.budget,
        type
      );
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(
        obj.totalInc,
        type
      );
      document.querySelector(
        DOMstrings.expensesLabel
      ).textContent = formatNumber(obj.totalExp, type);

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage + " %";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "---";
      }
    },
    displayPercentages: function(percentages) {
      var fields = document.querySelectorAll(
        DOMstrings.expencesPercentageLabel
      );
      var nodeListforEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
      };
      nodeListforEach(fields, function(current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + "%";
        } else {
          current.textContent = "---";
        }
      });
    },
    displayMonth: function() {
      var now, year, month, months;
      now = new Date();
      month = now.getMonth();
      year = now.getFullYear();
      months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      document.querySelector(
        DOMstrings.dateLabel
      ).textContent = `${months[month]} ${year}`;
    },

    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();

//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
  var setupEventlisteners = function() {
    var DOM = UICtrl.getDOMstrings();
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);
  };

  var updateBudget = function() {
    // 1. Calculate the budget
    budgetCtrl.calculateBudget();
    // 3.Return the budget
    var budget = budgetCtrl.getBudget();
    // 3. Display the budget on the UI
    UICtrl.displayBudget(budget);
  };

  var updatePercentages = function() {
    //1.Calculate the percentages
    budgetCtrl.calculatePercentages();
    //2.Read them from the budget controler
    var percentages = budgetCtrl.getPercentages();
    //3.Update the UI with the new percentages
    UICtrl.displayPercentages(percentages);
  };

  var ctrlAddItem = function() {
    var input, newItem;
    // 1.Get the input value
    input = UICtrl.getInput();
    //The if statement prevents false inputs
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2. Add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. Add item to the UI
      UICtrl.addListItem(newItem, input.type);
      // 4. Clear the fields
      UICtrl.clearFields();
      // 5.Calculate and update budget
      updateBudget();
      //6.Calculate and Update the percentages
      updatePercentages();
    }
  };

  var ctrlDeleteItem = function(event) {
    var itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);

      //1. Delete the item from the data structure
      budgetController.deleteItem(type, ID);
      //2.Delete the item from the UI
      UICtrl.deleteListItem(itemID);
      //3.Update and show the new budget
      updateBudget();
      //4.Calculate and Update the percentages
      updatePercentages();
    }
  };
  return {
    init: function() {
      console.log("The app started.");
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventlisteners();
    }
  };
})(budgetController, UIController);

controller.init();
