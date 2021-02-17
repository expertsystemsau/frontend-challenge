# frontend-challenge react.js

PURPOSE

The purpose of this challenge is to test your ability to:
- Create basic react components and shared components
- Replicate design with css
- Work with 3rd party components (i.e. Bryntum Scheduler)
- Handle drag/drop events, object handling and user interaction


GETTING STARTED

To get started, you'll need to run these files on a PHP web server. Make sure PHP is installed and you can use the following command: "php -S localhost:8000"
Once it's running, you can bypass the "Trial Expiry" limitation by accessing the url with "/docs" on the end (such as http://localhost:8000/docs). Once the demo project is running, refer to the below 2 tasks for this challenge.


TASK 1 - Create Side Panel

- Refer to "design.png" and create the side panel as react components
- Use CSS to stylise all elements exactly like the design
- Consider adding hover effects on the tasks (you determine the hover style)


TASK 2 - Implement Drag & Drop

- In the side panel you created, the user should be able to drag a task from the panel onto the scheduler board (in Bryntum these are called events)
- Refer to this example to see how the drag feature should work from a panel onto the scheduler https://www.bryntum.com/examples/scheduler/react/javascript/drag-from-grid
- When the user drags the task over the scheduler, it should create an event block like the above example
- When the user releases the task onto the scheduler, hide the task from the side panel