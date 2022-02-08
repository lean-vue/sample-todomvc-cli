describe('TodoMVC App', () => {
  const todoFixtures = [
    'Unit Testing',
    'E2E Testing',
    'Test Coverage',
    'Continous Integration',
  ];

  const selectors = {
    newTodo: '.new-todo',
    todoList: '.todo-list',
    todoItems: '.todo-list li',
    lastTodo: '.todo-list li:last-child()',
    count: 'span.todo-count',
    main: '.main',
    footer: '.footer',
    toggleAll: '.toggle-all',
    clearCompleted: '.clear-completed',
    filters: '.filters',
    filterItems: '.filters li a',
  };

  beforeEach(() => {
    cy.visit('/');
  });

  context('When page is initially opened', () => {
    it('should focus on the todo input field', () => {
      cy.focused().should('have.class', 'new-todo');
    });
  });

  context('No Todos', function () {
    it('starts with nothing', () => {
      cy.get(selectors.todoItems).should('have.length', 0);
    });

    it('should hide main section and footer toolbar', function () {
      cy.get(selectors.main).should('not.be.visible');
      cy.get(selectors.footer).should('not.be.visible');
    });
  });

  context('New Todo', () => {
    it('should allow me to add todo items', () => {
      cy.get(selectors.newTodo).type(`${todoFixtures[0]}{enter}`);
      cy.get(selectors.todoItems).first().contains('label', todoFixtures[0]);
      cy.get(selectors.newTodo).type(`${todoFixtures[1]}{enter}`);
      cy.get(selectors.todoItems).last().contains('label', todoFixtures[1]);
      cy.get(selectors.todoItems).should('have.length', 2);
    });

    it('should clear text input field when an item is added', () => {
      cy.createTodo(todoFixtures[0]);
      cy.get(selectors.newTodo).should('have.value', '');
    });

    it('should trim text input', () => {
      cy.createTodo(`    ${todoFixtures[0]}    `);
      cy.get(selectors.todoItems)
        .first()
        .find('label')
        .should('have.text', todoFixtures[0]);
    });

    it('should not allow me to enter empty todos', () => {
      cy.get(selectors.newTodo).type('{enter}');
      cy.get(selectors.newTodo).type('   {enter}');
      cy.get(selectors.todoItems).should('have.length', 0);
    });

    it('should show main section and footer toolbar when items added', () => {
      cy.createTodo(todoFixtures[0]);
      cy.get(selectors.main).should('be.visible');
      cy.get(selectors.footer).should('be.visible');
    });

    it('should persist added items', () => {
      cy.createTodo(todoFixtures[0]);
      cy.createTodo(todoFixtures[1]);
      cy.createTodo(todoFixtures[2]);
      cy.get(selectors.todoItems).should('have.length', 3);
      cy.reload();
      cy.get(selectors.todoItems).should('have.length', 3);
    });
  });

  context('Mark all as completed', () => {
    beforeEach(() => {
      cy.createTodo(todoFixtures[0]);
      cy.createTodo(todoFixtures[1]);
      cy.createTodo(todoFixtures[2]);
      cy.get(selectors.todoItems).as('todos');
    });

    it('should allow me to mark all items as completed', () => {
      cy.get(selectors.toggleAll).check();

      cy.get('@todos').eq(0).should('have.class', 'completed');
      cy.get('@todos').eq(1).should('have.class', 'completed');
      cy.get('@todos').eq(2).should('have.class', 'completed');
    });

    it('should allow me to clear the complete state of all items', () => {
      cy.get(selectors.toggleAll).check();
      cy.get(selectors.toggleAll).uncheck();

      cy.get('@todos').eq(0).should('not.have.class', 'completed');
      cy.get('@todos').eq(1).should('not.have.class', 'completed');
      cy.get('@todos').eq(2).should('not.have.class', 'completed');
    });

    it('complete all checkbox should update state when items are completed / cleared', function () {
      cy.get(selectors.toggleAll).should('not.be.checked');

      cy.get(selectors.toggleAll).check();
      cy.get(selectors.toggleAll).should('be.checked');

      cy.get(selectors.todoItems)
        .first()
        .as('firstTodo')
        .find('.toggle')
        .uncheck();
      cy.get(selectors.toggleAll).should('not.be.checked');

      cy.get('@firstTodo').find('.toggle').check();
      cy.get(selectors.toggleAll).should('be.checked');
    });

    it('should persist completed state of items this way', () => {
      cy.get(selectors.toggleAll).check();
      cy.reload();
      cy.get(selectors.toggleAll).should('be.checked');
      cy.get(selectors.todoItems).should('have.length', 3);
    });
  });

  context('Item', () => {
    it('should allow me to mark items as complete', () => {
      cy.createTodo(todoFixtures[0]).as('firstTodo');
      cy.createTodo(todoFixtures[1]).as('secondTodo');

      cy.get('@firstTodo').find('.toggle').check();
      cy.get('@firstTodo').should('have.class', 'completed');
      cy.get('@secondTodo').should('not.have.class', 'completed');

      cy.get('@secondTodo').find('.toggle').check();
      cy.get('@firstTodo').should('have.class', 'completed');
      cy.get('@secondTodo').should('have.class', 'completed');
    });

    it('should allow me to un-mark items as complete', () => {
      cy.createTodo(todoFixtures[0]).as('firstTodo');
      cy.createTodo(todoFixtures[1]).as('secondTodo');

      cy.get('@firstTodo').find('.toggle').check();
      cy.get('@firstTodo').should('have.class', 'completed');
      cy.get('@secondTodo').should('not.have.class', 'completed');

      cy.get('@firstTodo').find('.toggle').uncheck();
      cy.get('@firstTodo').should('not.have.class', 'completed');
      cy.get('@secondTodo').should('not.have.class', 'completed');
    });

    it('should allow me to edit an item', () => {
      cy.createTodo(todoFixtures[0]);
      cy.createTodo(todoFixtures[1]).as('todo');

      cy.get('@todo').find('label').dblclick();
      cy.get('@todo')
        .find('.edit')
        .should('have.value', todoFixtures[1])
        .clear()
        .type('E2E Testing with Cypress{enter}');
      cy.get('@todo')
        .find('label')
        .should('contain.text', 'E2E Testing with Cypress');
    });

    it('should save edits on blur', function () {
      cy.createTodo(todoFixtures[0]);
      cy.createTodo(todoFixtures[1]).as('todo');

      cy.get('@todo').find('label').dblclick();
      cy.get('@todo')
        .find('.edit')
        .should('have.value', todoFixtures[1])
        .clear()
        .type('E2E Testing with Cypress')
        .blur();
      cy.get('@todo')
        .find('label')
        .should('contain.text', 'E2E Testing with Cypress');
    });

    it('should allow me to delete an item', () => {
      cy.createTodo(todoFixtures[0]).as('todo');
      cy.createTodo(todoFixtures[1]);

      cy.get('@todo').find('.destroy').click({ force: true });
      cy.get(selectors.todoItems).should('have.length', 1);
      cy.get(selectors.todoItems).first().contains(todoFixtures[1]);
    });

    it('should remove the item if an empty text string was entered', () => {
      cy.createTodo(todoFixtures[0]).as('firstTodo');
      cy.createTodo(todoFixtures[1]).as('secondTodo');

      cy.get('@secondTodo').find('label').dblclick();
      cy.get('@secondTodo').find('.edit').clear().type('{enter}');

      cy.get(selectors.todoItems).should('have.length', 1);
      cy.get(selectors.todoItems).first().contains(todoFixtures[0]);

      cy.get('@firstTodo').find('label').dblclick();
      cy.get('@firstTodo').find('.edit').clear().blur();

      cy.get(selectors.todoItems).should('have.length', 0);
    });

    it('should persist marking/un-marking of items as complete', () => {
      cy.createTodo(todoFixtures[0]);
      cy.createTodo(todoFixtures[1]);

      cy.get(selectors.lastTodo).find('.toggle').check();
      cy.reload();
      cy.get(selectors.lastTodo).should('have.class', 'completed');

      cy.get(selectors.lastTodo).find('.toggle').uncheck();
      cy.reload();
      cy.get(selectors.lastTodo).should('not.have.class', 'completed');
    });

    it('should persist editing of items', () => {
      cy.createTodo(todoFixtures[0]);
      cy.createTodo(todoFixtures[1]);

      cy.get(selectors.lastTodo).find('label').dblclick();
      cy.get(selectors.lastTodo)
        .last()
        .find('.edit')
        .clear()
        .type('E2E Testing with Cypress{enter}');
      cy.reload();

      cy.contains(
        '.todo-list li:last-child() label',
        'E2E Testing with Cypress'
      );
    });

    it('should persist edits commited via blur', function () {
      cy.createTodo(todoFixtures[0]);
      cy.createTodo(todoFixtures[1]);

      cy.get(selectors.todoItems).last().find('label').dblclick();
      cy.get(selectors.todoItems)
        .last()
        .find('.edit')
        .clear()
        .type('E2E Testing with Cypress')
        .blur();
      cy.reload();

      cy.contains(
        '.todo-list li:last-child() label',
        'E2E Testing with Cypress'
      );
    });

    it('should persist deleting items', () => {
      cy.createTodo(todoFixtures[0]).as('todo');
      cy.createTodo(todoFixtures[1]);

      cy.get('@todo').find('.destroy').invoke('show').click();
      cy.reload();
      cy.get(selectors.todoItems).should('have.length', 1);
    });

    it('should persist deleting items via empty edit text', () => {
      cy.createTodo(todoFixtures[0]);
      cy.createTodo(todoFixtures[1]);

      cy.get(selectors.todoItems).first().find('label').dblclick();
      cy.get(selectors.todoItems).first().find('.edit').clear().type('{enter}');
      cy.reload();

      cy.get(selectors.todoItems).should('have.length', 1);

      cy.contains('.todo-list li:last-child() label', 'E2E Testing').dblclick();
      cy.get(selectors.todoItems).find('.edit').clear().blur();
      cy.reload();

      cy.get(selectors.todoItems).should('have.length', 0);
    });
  });

  context('Editing', () => {
    beforeEach(() => {
      cy.createTodo(todoFixtures[0]);
      cy.createTodo(todoFixtures[1]);
      cy.createTodo(todoFixtures[2]);
      cy.get(selectors.todoItems).as('todos');
    });

    it('should hide edit fields when not editing', () => {
      cy.get('@todos').find('.edit').should('not.be.visible');
    });

    it('should hide other controls when editing', function () {
      cy.get('@todos').eq(1).find('label').dblclick();

      cy.get('@todos').eq(1).find('.toggle').should('not.be.visible');
      cy.get('@todos').eq(1).find('label').should('not.be.visible');
    });

    it('should allow only one editing element', () => {
      cy.get('@todos').eq(1).find('label').dblclick();
      cy.get('@todos').eq(2).find('label').dblclick();

      cy.get('@todos').eq(1).find('.edit').should('not.be.visible');
      cy.get('@todos').eq(2).find('.edit').should('be.visible');
    });

    it('should focus on the edited todo after entering edit mode', () => {
      cy.get('@todos').eq(1).find('label').dblclick();
      cy.get('@todos').eq(1).find('.edit').should('have.focus');
    });

    it('should trim entered text', () => {
      cy.get('@todos').eq(1).find('label').dblclick();

      cy.get('@todos')
        .eq(1)
        .find('.edit')
        .type('{selectall}{backspace}    E2E Testing with Cypress    {enter}');

      cy.get('@todos')
        .eq(1)
        .find('label')
        .should('have.text', 'E2E Testing with Cypress');
    });

    it('should cancel edits on escape', () => {
      cy.get('@todos').eq(1).find('label').dblclick();

      cy.get('@todos')
        .eq(1)
        .find('.edit')
        .type('{selectall}{backspace}Protractor Testing{esc}');

      cy.get('@todos')
        .eq(1)
        .find('label')
        .should('contain.text', todoFixtures[1]);
    });
  });

  context('Counter', () => {
    it('should display the current number of todo items', function () {
      cy.createTodo(todoFixtures[0]).as('firstTodo');
      cy.get(selectors.count).contains('1');
      cy.createTodo(todoFixtures[1]).as('secondTodo');
      cy.get(selectors.count).contains('2');
      cy.createTodo(todoFixtures[2]).as('thirdTodo');
      cy.get(selectors.count).contains('3');
      cy.get('@firstTodo').find('.toggle').check();
      cy.get(selectors.count).contains('2');
      cy.get('@firstTodo').find('.destroy').click({ force: true });
      cy.get(selectors.count).contains('2');
      cy.get('@secondTodo').find('.destroy').click({ force: true });
      cy.get(selectors.count).contains('1');
    });

    it('should pluralize the item-word', () => {
      cy.createTodo(todoFixtures[0]).as('firstTodo');
      cy.get('@firstTodo').find('.toggle').check();
      cy.get(selectors.count).contains('0 items left');
      cy.get('@firstTodo').find('.toggle').uncheck();
      cy.get(selectors.count).contains('1 item left');
      cy.createTodo(todoFixtures[1]);
      cy.get(selectors.count).contains('2 items left');
      cy.createTodo(todoFixtures[2]);
      cy.get(selectors.count).contains('3 items left');
    });
  });

  context('Clear completed button', () => {
    beforeEach(() => {
      cy.createTodo(todoFixtures[0]);
      cy.createTodo(todoFixtures[1]);
      cy.createTodo(todoFixtures[2]);
      cy.createTodo(todoFixtures[3]);
      cy.get(selectors.todoItems).as('todos');
    });

    it('should be visible if there are completed todos', () => {
      cy.get('@todos').first().find('.toggle').check();
      cy.get(selectors.clearCompleted).should('be.visible');
    });

    it('should remove completed items when clicked', () => {
      cy.get('@todos').eq(0).find('.toggle').check();
      cy.get('@todos').eq(1).find('.toggle').check();
      cy.get('@todos').eq(3).find('.toggle').check();
      cy.get(selectors.clearCompleted).click();
      cy.get('@todos').should('have.length', 1);
      cy.get('@todos').eq(0).should('contain', todoFixtures[2]);
    });

    it('should persist items when removed this way', () => {
      cy.get('@todos').eq(0).find('.toggle').check();
      cy.get('@todos').eq(1).find('.toggle').check();
      cy.get('@todos').eq(3).find('.toggle').check();
      cy.get(selectors.clearCompleted).click();
      cy.get('@todos').should('have.length', 1);
      cy.get('@todos').eq(0).should('contain', todoFixtures[2]);
      cy.reload();
      cy.get('@todos').should('have.length', 1);
      cy.contains('.todo-list li:last-child() label', todoFixtures[2]);
    });

    it('should be hidden when there are no items that are completed', () => {
      cy.get(selectors.clearCompleted).should('not.be.visible');
      cy.get('@todos').first().find('.toggle').check();
      cy.get(selectors.clearCompleted).should('be.visible').click();
      cy.get(selectors.clearCompleted).should('not.be.visible');
    });
  });

  context('Routing', () => {
    beforeEach(() => {
      cy.createTodo(todoFixtures[0]);
      cy.createTodo(todoFixtures[1]);
      cy.createTodo(todoFixtures[2]);
      cy.get(selectors.todoItems).as('todos');
    });

    it('should allow me to display active items', () => {
      cy.get('@todos').eq(1).find('.toggle').check();
      cy.contains(selectors.filterItems, 'Active').click();
      cy.get(selectors.todoItems)
        .should('have.length', 2)
        .first()
        .should('contain', todoFixtures[0]);
      cy.get(selectors.todoItems).eq(1).should('contain', todoFixtures[2]);
    });

    it('should allow me to display completed items', () => {
      cy.get('@todos').eq(1).find('.toggle').check();
      cy.get(selectors.filters).contains('Completed').click();
      cy.get(selectors.todoItems).should('have.length', 1);
    });

    it('should allow me to display all items', () => {
      cy.get('@todos').eq(1).find('.toggle').check();
      cy.get(selectors.filters).contains('Active').click();
      cy.get(selectors.filters).contains('Completed').click();
      cy.get(selectors.filters).contains('All').click();
      cy.get(selectors.todoItems).should('have.length', 3);
    });

    it('should highlight the currently applied filter', () => {
      cy.contains(selectors.filterItems, 'All').should(
        'have.class',
        'selected'
      );

      cy.contains(selectors.filterItems, 'Active').click();
      cy.contains(selectors.filterItems, 'Active').should(
        'have.class',
        'selected'
      );

      cy.contains(selectors.filterItems, 'Completed').click();
      cy.contains(selectors.filterItems, 'Completed').should(
        'have.class',
        'selected'
      );
    });

    it('should respect the back button', function () {
      cy.get('@todos').first().find('.toggle').check();

      cy.log('Showing all items');
      cy.contains(selectors.filterItems, 'All').click();
      cy.log('Showing active items');
      cy.contains(selectors.filterItems, 'Active').click();
      cy.log('Showing completed items');
      cy.contains(selectors.filterItems, 'Completed').click();

      cy.log('Back to active items');
      cy.go('back');
      cy.get(selectors.todoItems).should('have.length', 2);

      cy.log('Back to all items');
      cy.go('back');
      cy.get(selectors.todoItems).should('have.length', 3);
    });

    it('should respect bookmarking/initial routing', () => {
      cy.get('@todos').first().find('.toggle').check();

      cy.log('Showing active items');
      cy.contains(selectors.filterItems, 'Active').click();
      cy.reload();
      cy.get(selectors.todoItems).should('have.length', 2);

      cy.log('Showing completed items');
      cy.contains(selectors.filterItems, 'Completed').click();
      cy.reload();
      cy.get(selectors.todoItems).should('have.length', 1);

      cy.log('Showing all items');
      cy.contains(selectors.filterItems, 'All').click();
      cy.reload();
      cy.get(selectors.todoItems).should('have.length', 3);
    });
  });
});
