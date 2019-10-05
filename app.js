//BUDGET CONTROLLER
var budgetController = (function() {})();

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
    console.log(input);
    // 2. Add the item to the budget controller
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
