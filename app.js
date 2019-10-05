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
  };

  var data = {
    allitems: {
      inc: [],
      exp: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
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
    inputBtn: ".add__btn"
  };
  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, //will be either inc(for income) or exp(for expenses)
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
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
  };
  var ctrlAddItem = function() {
    // 1.Get the input value
    var input = UICtrl.getInput();
    // 2. Add the item to the budget controller
    budgetCtrl.addItem(input.type, input.description, input.value);

    // 3. Add item to the UI
    // 4. Calculate the budget
    // 5. Display the budget on the UI
  };
  return {
    init: function() {
      console.log("The app started.");

      setupEventlisteners();
    }
  };
})(budgetController, UIController);

controller.init();
